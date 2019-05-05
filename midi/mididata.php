<?php

$buf = "";
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

if (!isset($res) || $res==""){
    error_log("no data", 3 ,"./error.log");
}{
    if ( !isset($_GET['type']) || $_GET['type'] == 'csv'){
        $buf = "";
        foreach( $res as $name ){
            $buf .= $name[1] . "," . $name[2] . "," . $name[3] . "," . $name[4] . "\n";
        }
        header('Content-Disposition: attachment; filename="midi.csv"');
        header('Content-Type: application/octet-stream');
        header('Content-Transfer-Encoding: binary');
//        header('Content-Length: '.strlen($buf));

        print $buf;
    }else if ( !isset($_GET['type']) || $_GET['type'] == 'txt'){
        header( 'Content-Type: text/plain' );

        foreach( $res as $name ){
            echo $name[1] . "," . $name[2] . "," . $name[3] . "," . $name[4] . "\n";
        }

    }else if ( !isset($_GET['type']) || $_GET['type'] == 'hex'){
        header( 'Content-Type: text/plain' );

        foreach( $res as $name ){
            echo $name[1] . "," . dechex($name[2]) . "," . dechex($name[3]) . "," . dechex($name[4]) . "\n";
        }

    }else{

        $buf = pack("CCCCCCCCCCCCCCCCCC", 0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0x78, 0x4d, 0x54, 0x72, 0x6b);

        $dat = "";

//        foreach ( $header as $data ){
//            $buf .= pack("C", $data );
//        }

        // ここにバイナリデータを出力する処理をかく
        $count = 0;
        $pre = 0;
        foreach( $res as $name ){
            $time = $name[1] - $pre;
            if ( $pre == 0){
                $time = 1000;
            }

            if ( $time > 0x7f ){ // ignore over 0x3fff time
                $dat .= pack( "CC", (($time >> 7) & 0x7f) | 0x80,  $time & 0x7f );
                $count += 5;
            }else{
                $dat .= pack( "C", $time);
                $count += 4;
            }
            $dat .= pack( "CCC", $name[2] , $name[3] , $name[4] );


            $pre = $name[1];
        }

//        $fp = fopen( "dat/tmp.mid", "w");
//        if ( $fp == false ){
//            error_log( "dat/tmp.mid can not be opend.\n");
//        }else{
            $cdat = pack("N", $count );

//            fwrite( $fp, $buf . $cdat . $dat );
//            fclose( $fp );

            header('Content-Disposition: attachment; filename="midi.mid"');
            header('Content-Type: application/octet-stream');
            header('Content-Transfer-Encoding: binary');
            header('Content-Length: '.strlen($buf . $cdat . $dat ));
    
            //((($count >> 24) & 0x000000ff) | (($count >> 8) & 0x0000ff00) | (($count << 8 ) & 0x00ff0000) | (($count << 24) & 0xff000000)));
            echo $buf . $cdat. $dat;

//            readfile("dat/tmp.mid");
//        }
    }
}
?>
