<?php
$data = "";
$database = "iot";
$host = "localhost";
require("pw.php");
try {
    $pdo = new PDO('mysql:host=localhost;dbname=iot;charset=utf8',$user,$pw,array(PDO::ATTR_EMULATE_PREPARES => false));
/*    $dbs = $pdo->query( 'show tables;' );
    while( ( $db = $dbs->fetchColumn( 0 ) ) !== false )
    {
        echo $db.'<br>';
    }*/
} catch (PDOException $e) {
    exit('DB connection refused.'.$e->getMessage());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json_string = file_get_contents('php://input') ; ## This time Kimo

    $data = json_decode($json_string);
    error_log($json_string, 3, "./error.log" );
    if ( $data->midi == null ){
        error_log("NULL\n", 3, "./error.log");
    }else{
        error_log("MIDI: \n", 3, "./error.log");
        foreach ($data->midi as $value) {
//            error_log(print_r($value, true), 3, "./error.log" );

            $time = $value[0];
            $m2 = $value[1];
            $m3 = $value[2];
            $m4 = $value[3];

            if ( $m3 == null ) $m3 = 0;
            if ( $m4 == null ) $m4 = 0;

            $cmd = "INSERT INTO `mididata` (`id`, `time`, `c1`, `c2`, `c3`, `name`)";
            $cmd .= " VALUES (NULL, '" . $time . "', '" . $m2 . "', '" . $m3 . "', '" . $m4 . "', '" . $data->name . "'); ";

            error_log($cmd . "\n", 3, "./error.log" );

            $pdo->query( $cmd );

        }

        //        error_log(print_r($data->midi,true), 3, "./error.log");
//        error_log("NAME: \n", 3, "./error.log");
//        error_log(print_r($data->name,true), 3, "./error.log");

        

     }
}

if (! isset($_SERVER['HTTP_X_REQUESTED_WITH']) ||
	$_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
	die(json_encode(array('status' => "error")));
}
 
// no mean code
$value = array(
	3 => array('status' => 'ok')
);
 
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
 
echo json_encode(
	$value,
	JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
);
?>
