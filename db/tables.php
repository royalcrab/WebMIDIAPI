<?php
$data = "";
$database = "iot";
$host = "localhost";
require("pw.php");
try {
    $pdo = new PDO('mysql:host=localhost;dbname=iot;charset=utf8',$user,$pw,array(PDO::ATTR_EMULATE_PREPARES => false));
    $res = $pdo->query( 'select distinct name from mididata order by name desc;' );
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
            error_log($name[0] . "\n", 3 ,"./error.log");
            if ( $name[0] == "") continue;
            echo( '<li> <a download="midi.csv" href="mididata.php?type=csv&name=' . urlencode($name[0]) . '">[CSV]</a> : ' );
            echo( '<a download="midi.mid" href="mididata.php?type=smf&name=' . urlencode($name[0]) . '">[SMF]</a> : ' );
            echo( '<a href="./showdata.php?name=' . urlencode($name[0]) . '">' . $name[0] . "</a></li>\n" );
//            echo( print_r($name,true) . "<br/>" );
        }
      ?>
      </ul>
    </p>
  <?php endif; ?>
</body>
</html>
