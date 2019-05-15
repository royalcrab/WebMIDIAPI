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
<br>
<input type="button" value="縮小" onClick="scaleUp()">
<input type="button" value="拡大" onClick="scaleDown()">
<br>
<input type="button" value="前譜面" onClick="pageDown()">
<input type="button" value="次譜面" onClick="pageUp()">
HOGE;

?>