#!/usr/bin/perl -w
use strict;
use List::Util qw(min);
use List::Util qw(max);
##################################################################
## Open file
my $file = $ARGV[0];
open (INPUT, "<$file") or die "cant open $file\n"; # the file created with the MATLAB simulation
## dump file into an array @lines
my @lines = <INPUT>;
close (INPUT);
###

############# DECLARE IMPORTANT VARIABLES #######################
## Create a @points array and hashes for %X, %Y and %ID
my @points;
my %X; my %Y; my %Z; my %did; my %time;

my @progenitors;
my @children;
my @internal_n;
my @edges;
#################################################################
#### MAKE A DICTIONARY FOR RECOVERING THE DATA OF EVERY POINT

foreach (@lines)
	{
	my $n_points=0;
	my $line = $_;
	if ($line =~ m/<Spot ID="(\d+)" name="(\w+)"/) 	{
		$points[$n_points] = $1;
		$did{$points[$n_points]} = $2;
		# get X,Y,Z coords and time points
		( $X{$points[$n_points]} ) = $line =~ m/POSITION_X="(\d+\.\d+)"/;
		( $Y{$points[$n_points]} ) = $line =~ m/POSITION_Y="(\d+\.\d+)"/;
		( $Z{$points[$n_points]} ) = $line =~ m/POSITION_Z="(\d+\.\d+)"/;
		( $time{$points[$n_points]} ) = $line =~ m/FRAME="(\d+\.\d+)"/;
	#	print("point: $points[$n_points], name: $did{$points[$n_points]}, X: $X{$points[$n_points]} ");
	#	print("Y: $Y{$points[$n_points]}, Z: $Z{$points[$n_points]}, time: $time{$points[$n_points]}\n");

		$n_points++;
		}
	if ($line =~ m/<Edge VELOCITY/) {push @edges, $line}	
	}

########################################################################
my $earliest = min values %time;
my $latest   = max values %time;
#print "Earliest point is $earliest\n";
#print "Latest   point is $latest\n";

## Iterate the points to get all points at time=0 (or the min)
for my $p (keys %time) {
	if ($time{$p}==$earliest) {
		## push the points to the progenitors array
		push @progenitors, $p;
	}
}
#print("number of progenitors = $#progenitors\n");
#print("@progenitors\n");

## iterate through progenitors and every time I find that
## one progenitor has children, push them to the children
## array

open(COORDS, ">3D_coords.txt") or die "cannot open outputfile\n";

while ($#progenitors >= 0)
	{
	my $level=0; # will count the steps to go down the tree to get this
	my @d; # provisional array for daughters
	my @daughters; # array to store a whole linear lineage
	my $n_daught=0;
	my $orphans = 0;
	my $mom = $progenitors[0];
	my $conc=0;
#	print("$mom\n\n");
	print("{\"did\": \"$did{$mom}\", \"length\": $time{$mom}, \"level\": $level");
	
	
	## find ALL the time points associated for the
	## progenitor cell
	my @tp; # for time points
	for my $p (keys %did) {
	if ($did{$p}=~/^$did{$mom}$/) {push @tp, $time{$p}}		
	}
	
	my $mom_lp = 	max(@tp);
	my $mom_last;
	
	for my $p (keys %did) {
	if ($did{$p}=~/^$did{$mom}$/ and $time{$p}==$mom_lp )
		{$mom_last =$p}		
	}
	## look for every (potential) progenitor if it divides
	## i.e. if it has 2 children
	for my $e (0..$#edges)
		{
		if ($edges[$e] =~ m/SPOT_SOURCE_ID="$mom_last" SPOT_TARGET_ID="(\d+)"/)
			{push @d, $1; $n_daught++;}
		}
	if ($n_daught==1)
		{print(", \"children\":[\n");
 		$level++;
		if ($orphans>0 && $conc>1) {$orphans = $orphans-1;}
		$conc=1;
		}
	elsif ($n_daught==2)
		{print(", \"children\":[\n");
 		$level++; $conc=0;
		$orphans++;
		}
	
	#else {
	#	print("}");
	#	if ($orphans>0) {for my $o (1..$level-$orphans) {print("]}")}} 		
	#	$orphans = $orphans-1; ##
	#	$level = $level-1;
	#	print("\n");
	#	#$level=0;
	#	}
	else {
		print("}");
		$conc++;			
		if ($conc>1)
			{for my $o (1..$level-$orphans) {print("]}");$level--;}
			}
		$orphans = $orphans-1; ##
		print("\n");
		#$level=0;
		}
	
	
	
	
	while (@d > 0 )
		{
		my $d_0 = $d[0];
		splice @d, 0, 1;
		## find ALL the time points associated for the
		## progenitor cell
		my @tp_0; # for time points
		for my $p (keys %did) {
		if ($did{$p}=~/^$did{$d_0}$/) {push @tp_0, $time{$p}}		
		}
		my $d_0_ltp = 	max(@tp_0); ## my last point time point
		my $d_0_last;
		for my $p (keys %did) {
			if ($did{$p}=~/^$did{$d_0}$/ and $time{$p}==$d_0_ltp )
				{$d_0_last =$p;
				print("{\"did\": \"$did{$d_0_last}\",	 \"length\": $time{$d_0_last}, \"level\": $level, \"orphans\": $orphans");
				}		
			}
		
		##### recursive loop
		$n_daught=0;
		for my $e (0..$#edges)
			{
			if ($edges[$e] =~ m/SPOT_SOURCE_ID="$d_0_last" SPOT_TARGET_ID="(\d+)"/)
				{unshift @d, $1;
				 $n_daught++}
			}
		if ($n_daught==1)
			{print(", \"children\":[\n");
			$level++;
			if ($orphans>0 && $conc>1) {$orphans = $orphans-1;}
			$conc=1;
			}
		elsif ($n_daught==2)
			{print(", \"children\":[\n");
 			$level++;$conc=0;
			$orphans++;
			}
		
		else {
			print("}");
			$conc++;			
			if ($conc>1)
				{for my $o (1..$level-$orphans) {print("]}");$level--;}
				}
			if ($time{$d_0_last}==400)
				{print COORDS "$did{$d_0_last}\t$X{$d_0_last}\t$Y{$d_0_last}\t$Z{$d_0_last}\n"; }
			$orphans = $orphans-1; ##
			print("\n");
			#$level=0;
			}
					
		####################
		#	}
		}

	### need to populate an array with the daughters of a lineage and keep going until
	### i cannot find more, then I need to go back to get the sisters left behind..
	### need to populate @daughters with the point number and then refer to the time
	### they were created. keep looking for the first daughter and when the lineage
	### ends, go back to the earliest point of the lineage (with the %time of daughters)
	### and start were left.
	### I will need to remove the "visited" daughters from the array to avoid duplicates
	
	splice @progenitors, 0, 1;	
	print("-\n");
	}
close COORDS;