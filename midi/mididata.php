<?php

$buf = "";
$database = "iot";
$host = "localhost";
require("pw.php");

/* データベースは下記を想定しているが、name みたいな属性をあとで入れるかも。
    CREATE TABLE `mididata` (
    `id` int(11) NOT NULL,
    `time` int(24) NOT NULL,
    `c1` int(11) NOT NULL,
    `c2` int(11) NOT NULL DEFAULT '0',
    `c3` int(11) NOT NULL DEFAULT '0',
    `name` varchar(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
*/

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

$filename = str_replace( '/', '_', $tableName  );
$filename = str_replace( ' ', '_', $filename );
$filename = str_replace( ':', '_', $filename );

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
        header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
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

    } else if ( !isset($_GET['type']) || $_GET['type'] == 'js'){
        // javascript のコード(配列)として出力する。最後に null を追加しているところに注意
        header( 'Content-Type: text/plain' );

        echo( 'var data = [' . "\n");

        foreach( $res as $name ){
            $offset = 0;
            echo '{ "time": "' . ($name[1]-$offset) . '", "c1": "' . $name[2] . '", "c2": "' . $name[3] . '", "c3": "' . $name[4] . '"' . "},\n";
        }

        echo "null ];\n";

    } else if ( !isset($_GET['type']) || $_GET['type'] == 'note'){
        header( 'Content-Type: text/plain' );

        foreach( $res as $name ){
            echo code( $name[1], $name[2] ,  $name[3] ,  $name[4] ) . "\n";
        }

    }else{

        $buf = pack("CCCCCCCCCCCCCCCCCC", 0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0x1, 0xf6, 0x4d, 0x54, 0x72, 0x6b);
        // 0x10f: 1/4 note = 252 (for synthesia, which requires a number that can be divided by 3.)
        // SMF 0 のファイルヘッダを生成している。かなり適当なため、再生ソフトによっては読みこんでくれないことも多い。
        // QuickTime と Windows Media Player は読んでくれなかった。
        // Logic X pro と Garageband は読んでくれる。VLC player, Sekaiju なども読んでくれる。
        // VLC Player は何でも無理矢理よんでくれるようだ。他のソフトは分解能を 3 で割りきれる数にしないと読んでくれないぽい。
        // デフォルトのテンプが 120bpm になるので、四分音符の長さを 250 にすると全音符が 100ms になり、実データにあう。
        // しかし、player が 3 で割る数を求めるので、 4 分音符の 252 を指定している。このため 1000ms あたり 8 ms だけ音がずれる。
        // ずれないようにするには 250 を指定するか。時刻に 1.008 を乗じるなどの対がg必要になる。
        // MIDI データ的には四分音符を 192 とかにするのが良いようなので、0.968 を乗じて 192 を指定すて時刻を合わせるのが本来いいのかも。

//        $dat = pack( "CCCCCC", 0xff, 0x51 ,0x03, 0x03, 0xD0, 0x96);
        $dat = "";

        // ここから SMF のトラックのバイナリデータを出力している
        $count = 0;
        $pre = 0;
        foreach( $res as $name ){
            if ( $name[2] == 0xfe ) continue;
            // 0xfe は MIDI 機器の ping 応答のようなもので、これが SMF に入ってると再生できないソフトがあるぽい。
            // そのため、このコマンドは無視している。
            $time = $name[1] - $pre;
            if ( $pre == 0){
                $time = 252*4;
            }

            if ( $time > 0x7f ){ // ignore over 0x3fff time。3fff 以上の時刻データがきたら 0x3fff に丸めている。
                $dat .= pack( "CC", (($time >> 7) & 0x7f) | 0x80,  $time & 0x7f );
                $count += 5;
            }else{
                $dat .= pack( "C", $time);
                $count += 4;
            } // 4 byte 以上のコマンドは無視している。もし MIDI 機器から送られてきていたらバグるはず。
            $dat .= pack( "CCC", $name[2] , $name[3] , $name[4] );


            $pre = $name[1];
        }

        $cdat = pack("N", $count );
        // MIDI データの長さ(バイト数)をあとから計算している。

        // この php を参照する a タグに download 属性をつけておくことを推奨
        // <a download="midi.mid" href="mididata.php?type=smf&name="hoge">smf</a>
        // こんな感じで
        header('Content-Disposition: attachment; filename="' . $filename . '.mid"'); // なくても動く
        header('Content-Type: application/octet-stream'); // ないと動かない
        header('Content-Transfer-Encoding: binary'); // ないと動かない
        header('Content-Length: '.strlen($buf . $cdat . $dat )); // なくても動くが、あるとダウンロードの経過が表示される、ことがある

        echo $buf . $cdat. $dat;
        // ヘッダ、データ長、データ部の順で出する。

    }
} // このファイルの先頭や末尾に空白とか何か文字が入っていると、それがバイナリの先頭に出力されてしまう。注意!
?>
