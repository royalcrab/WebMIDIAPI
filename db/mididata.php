<?php
// require https://pear.php.net
$data = "";
$database = "iot";
$host = "localhost";
require("pw.php");

if(isset($_GET['name'])) {
    $tableName = urldecode($_GET['name']);
    error_log( "table:" . $tableName . "\n", 3, "./error.log");
}else{
    error_log( "GET error\n", 3, "./error.log");
    exit(-1);
}


try {
    $pdo = new PDO('mysql:host=localhost;dbname=iot;charset=utf8',$user,$pw,array(PDO::ATTR_EMULATE_PREPARES => false));
    $query = "select * from mididata where name = '" . $tableName . "';";
    $res = $pdo->query( $query );
    error_log( $query . "\n", 3, "./error.log");

} catch (PDOException $e) {
    exit('DB connection refused.'.$e->getMessage());
}

if (!isset($res) || $res=="") :
    error_log("no data", 3 ,"./error.log");
else :
    $buf = "";
    foreach( $res as $name ){
        $buf .= $name[1] . "," . $name[2] . "," . $name[3] . "," . $name[4] . "\n";
    }
    header('Content-Disposition: attachment; filename="midi.csv"');
    header('Content-Type: application/octet-stream');
    header('Content-Transfer-Encoding: binary');
    header('Content-Length: '.strlen($buf));

    print $buf;
endif
?>
