<?php

/* define constants */
define('NT_BIN', './bin/newick-tools');
define('MAINTAINER', 'i.salvador@ucl.ac.uk');

 /* get uploaded file information */
$filename = $_FILES['file']['tmp_name'];

/* create command for executing newick tools to validate input tree file */
$cmd_nt = NT_BIN . " --info --tree " . $filename . " --quiet 2>&1";

/* call newick tools to check tree in inputfile. If not rooted/unrooted die */
$nt_output = shell_exec($cmd_nt);

if (preg_match("/error|fault/", $nt_output)) {
	echo "Tree not loaded.\nAn error has occurred when parsing the file.\n";
	echo "Are you sure it is in a correct Newick format?";
} else {
	$lines = explode("\n", $nt_output);
	echo "Tree loaded successfully.\n[newik-tools --info]\n";
	/* echo "$lines[1]\n$lines[2]";*/
}


?>
