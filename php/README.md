/var/www/html/kani/ にすべてファイルを置く。

li.html と recv.php で JSON のうけわたしができる。
error.log ファイルを 666 で作成する必要あり。

db.php は mysql へのアクセステスト用。
pw.php にアカウント名とパスワードを設定する ($pw と $user)
pw.php は下記のような感じ。

<?php
  $pw = "hogehoge";
  $user = "hogehoge";
?>

recv.php で 200 をかえしているのに、li.html ではエラーと認識されてしまう問題がある。
json を返すときのデコードに何か問題があるぽいけど、面倒なので直していない。

