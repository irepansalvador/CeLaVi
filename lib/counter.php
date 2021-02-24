<?php
$handle = fopen("./lib/counter.txt", "r"); 
if(!$handle) { 
    echo " "; 
} else { 
    $counter =(int )fread($handle,20);
        fclose($handle); 
        $counter++; 
        echo"<strong> Visitors:</strong> ". $counter . "" ; 
    $handle = fopen("./lib/counter.txt", "w" ); 
    
    fwrite($handle,$counter);
    fclose ($handle); 
}
?>
