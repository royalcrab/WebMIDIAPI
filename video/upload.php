<?php
$directory = './dat/';

$uploadFile = $directory . $_FILES['file0']['name'];
//echo $uploadFIle . "\n";
//echo $_FILES['file0']['name'];

if (move_uploaded_file($_FILES['file0']['tmp_name'], $uploadFile)) {
    //成功
    print '送信に成功しました。<a href="./">戻る</a>';
} else {
    //失敗
    print '送信に失敗しました。<a href="./">戻る</a>';
}
?>