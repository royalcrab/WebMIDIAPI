<?php
$firstName = "";
$lastName = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  if (!empty($_POST["first_name"]) && !empty($_POST["last_name"])) {
    $fullName = $_POST["last_name"] . " " . $_POST["first_name"];
  } else {
    $lastName = $_POST["last_name"];
    $firstName = $_POST["first_name"];
    $err = "入力されていない項目があります。";
  }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>サンプル</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <?php if (!isset($fullName)) : ?>
    <form action="" method="post">
      <p>姓： <input type="text" name="last_name" value="<?php echo htmlspecialchars($lastName, ENT_QUOTES, "UTF-8"); ?>"></p>
      <p>名： <input type="text" name="first_name" value="<?php echo htmlspecialchars($firstName, ENT_QUOTES, "UTF-8"); ?>"></p>
      <p style="color:red;"><?php echo $err; ?></p>
      <p><input type="submit" value="送信"></p>
    </form>
  <?php else : ?>
    <p>
      あなたの名前は <?php echo htmlspecialchars($fullName, ENT_QUOTES, "UTF-8"); ?> ですね。<br>
    </p>
    <p><a href="">戻る</a></p>
  <?php endif; ?>
</body>
</html>
