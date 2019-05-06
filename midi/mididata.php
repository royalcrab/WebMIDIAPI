<?php

$buf = "";
$database = "iot";
$host = "localhost";
require("pw.php");

function control_code( $code )
{
    switch( $code ){
        case 64:
        return "-pedal-";

        case 88:
        return "-velocity prefix-";

        default:
        return $code;
    }
}

function note( $code )
{
    if ( $code > 107 ){
        return "NA ";
    }
    $oct = floor($code / 12);
    $note = $code % 12;
    $buf = "";
    switch( $note ){
        case 0:
        $buf .= "C" . $oct;
        break;

        case 1:
        $buf .= "Cs" . $oct;
        break;

        case 2:
        $buf .= "D" . $oct;
        break;

        case 3:
        $buf .= "Ds" . $oct;
        break;

        case 4:
        $buf .= "E" . $oct;
        break;

        case 5:
        $buf .= "F" . $oct;
        break;

        case 6:
        $buf .= "Fs" . $oct;
        break;

        case 7:
        $buf .= "G" . $oct;
        break;

        case 8:
        $buf .= "Gs" . $oct;
        break;

        case 9:
        $buf .= "A" . $oct;
        break;

        case 10:
        $buf .= "As" . $oct;
        break;

        case 11:
        $buf .= "B" . $oct;
        break;

        default:
        $buf .= "NA ";
        break;
    }

    return $buf;
}


function code( $time, $code1, $code2, $code3 )
{
    $buf = "[" . $time . "] ";
    $buf = "ch" . ($code1 & 0x0f) . " ";
    switch( $code1 & 0xf0){
        case 0x80:
        $buf .= "NOTE OFF   :" . note( $code2 ) . " (0x" . dechex( $code2) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;

        case 0x90:
        $buf .= "NOTE ON    :" . note( $code2 ) . " (0x" . dechex( $code2) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;

        case 0xA0: 
        $buf .= "AFTER TOUCH:" . note( $code2 ) . " (0x" . dechex( $code2) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;

        case 0xB0:
        $buf .= "CONTROL    :" . control_code($code2) . " (0x" . dechex( $code2 ) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;

        case 0xC0:
        $buf .= "PROGRAM CHNG:" . $code2 . " (0x" . dechex( $code2 ) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;

        case 0xD0:
        $buf .= "KEY PRESSUER:" . $code2 . " (0x" . dechex( $code2 ) . ") ";
        break;

        case 0xE0:
        $buf .= "PITCH BEND  :" . $code2 . " (0x" . dechex( $code2 ) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;

        case 0xF0:
        $buf .= "SYSTEM      :" . $code2 . " (0x" . dechex( $code2 ) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;

        default:
        $buf .= "UNKNOWN ----:" . $code1 . " (0x" . dechex( $code1 ) . ") " . $code2 . " (0x" . dechex( $code2 ) . ") "  . $code3 . " (0x" . dechex( $code3) . ")";
        break;
    }

    return $buf;
}




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
        header('Content-Length: '.strlen($buf));

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

    }else if ( !isset($_GET['type']) || $_GET['type'] == 'json'){
        header( 'Content-Type: text/plain' );

        echo( '{"data" : [' . "\n");

        foreach( $res as $name ){
            echo '{ "time": "' . $name[1] . '", "c1": "' . $name[2] . '", "c2": "' . $name[3] . '", "c3": "' . $name[4] . '"' . "},\n";
        }

        echo "null ]}\n";

    } else if ( !isset($_GET['type']) || $_GET['type'] == 'note'){
        header( 'Content-Type: text/plain' );

        foreach( $res as $name ){
            echo code( $name[1], $name[2] ,  $name[3] ,  $name[4] ) . "\n";
        }

    }else{

        $buf = pack("CCCCCCCCCCCCCCCCCC", 0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0x1, 0xf6, 0x4d, 0x54, 0x72, 0x6b);
        // 0x10f: 1/4 note = 252 (for synthesia, which requires a number that can be divided by 3.)

//        $dat = pack( "CCCCCC", 0xff, 0x51 ,0x03, 0x03, 0xD0, 0x96);
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
                $time = 252*4;
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
