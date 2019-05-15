<?php
if(isset($_GET['name'])) {
    $tableName = $_GET['name'];
    error_log( "SHOWROLL| table:" . $tableName . "\n", 3, "./error.log");
}else{
    error_log( "SHOWROLL| GET error\n", 3, "./error.log");
    exit(-1);
}
echo '<script src="mididata.php?type=js&name=' . $tableName . '"></script>';

echo <<< HOGE
<canvas id="roll" width="1000" height="380"></canvas>
<script src="pianoroll.js"></script>
HOGE;

?>