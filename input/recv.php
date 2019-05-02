<?php
$data = "";

error_log("hoge\n", 3, "./error.log");


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json_string = file_get_contents('php://input') ; ## This time Kimo

    $data = json_decode($json_string);
    error_log($json_string, 3, "./error.log" );
    error_log("MIDI\n", 3, "./error.log");
    if ( $data->midi == null ){
        error_log("NULL\n", 3, "./error.log");
    }else{
        error_log("OK\n", 3, "./error.log");
        error_log(print_r($data->midi,true), 3, "./error.log");
     }
}

if (! isset($_SERVER['HTTP_X_REQUESTED_WITH']) ||
	$_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
	die(json_encode(array('status' => "error")));
}
 
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
