<?php
$database = "iot";
$host = "localhost";
require("pw.php");
try {
    $pdo = new PDO('mysql:host=localhost;dbname=iot;charset=utf8',$user,$pw,array(PDO::ATTR_EMULATE_PREPARES => false));
    $dbs = $pdo->query( 'show tables;' );
    while( ( $db = $dbs->fetchColumn( 0 ) ) !== false )
    {
        echo $db.'<br>';
    }
} catch (PDOException $e) {
    exit('DB connection refused.'.$e->getMessage());
}
?>
