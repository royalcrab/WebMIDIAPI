<?php
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
/*    while( ( $db = $dbs->fetchColumn( 0 ) ) !== false )
    {
        echo $db.'<br>';
    }*/
} catch (PDOException $e) {
    exit('DB connection refused.'.$e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>tables</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <?php if (!isset($res) || $res=="") : ?>
  <?php error_log("no data", 3 ,"./error.log"); ?>
  <?php else : ?>
    <p>
        <ul id="table_names">
      <?php 
        foreach( $res as $name ){
//            error_log(print_r($name,true) . "\n", 3 ,"./error.log");
            echo( "<li>" . $name[1] . "," . $name[2] . "," . $name[3] . "," . $name[4] . "\n");
//            if ( $name[0] == "") continue;
//            echo( '<li><a href="./show.php?name=' . urlencode($name[0]) . '">' . $name[0] . "</a></li>\n" );
//            echo( print_r($name,true) . "<br/>" );
        }
      ?>
      </ul>
    </p>
  <?php endif; ?>
</body>
</html>
