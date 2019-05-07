<?php
$dir = "./dat/";
// ディレクトリハンドルの取得
$dir_h = opendir( $dir );
// ファイル・ディレクトリの一覧を $file_list に

echo "<ul>\n";

while (false !== ($filename = readdir($dir_h))){
    if ( is_file( $dir . $filename )){
        $p = pathinfo( $dir . $filename );
        if ( $p["extension"] == "mp4"){
            echo '<li><a href="' . $dir . $filename . '">' . $filename . "</a></li>\n";
        }
    }else{
//        echo "<li>" . $filename . "</li>\n";
    }
}
// ディレクトリハンドルを閉じる
closedir( $dir_h );
echo "</ul>\n";
?>
