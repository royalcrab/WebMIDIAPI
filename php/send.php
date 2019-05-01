<?php
$data = "";
$name = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  if (!empty($_POST["data"]) ) {
    $data = $_POST["data"];
    $name = $_POST["name"];
    if ( $name == ""){
        $name = date("Y-m-d-H-i-s");
    }
  } else {
    $err = "MIDI DATA NOT FOUND.";
  }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>MIDI DATA SENDER</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <?php if (!isset($data) || $data=="") : ?>
    <form action="" method="post">
      <p>data： <input type="text" name="data" value="<?php echo htmlspecialchars($data, ENT_QUOTES, "UTF-8"); ?>"></p>
      <p><input type="submit" value="send"></p>
    </form>
  <?php else : ?>
    <p>
      Received data: '<?php echo htmlspecialchars($data, ENT_QUOTES, "UTF-8"); ?>''
    </p>
  <?php endif; ?>
</body>
</html>
