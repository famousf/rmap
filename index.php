<?php
  $VERSION = "3.0.05";
  if(isset($_POST["numpadClear"])):
      setcookie('isCleared', "clear", time() + (86400 * 10), "/");
      echo "isCleared";
      exit;
  endif;

  if(isset($_POST["setUser"])):
      setcookie('loggedUser', $_POST["user"], time() + (86400 * 10), "/");
      echo "loggedUser";
      exit;
  endif;

  if (isset($_POST["logout"])):
      setcookie('isCleared', "", 1, "/");
      setcookie('loggedUser', "", 1, "/");
      header('Location: ?');
      exit;
  endif;

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Snöschema - Netle.se</title>
  <link rel="apple-touch-icon" sizes="180x180" href="img/favico/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favico/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favico/favicon-16x16.png">
  <link rel="mask-icon" href="img/favico/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="theme-color" content="#ffffff">
  <link rel="manifest" href="manifest.json?<?php echo $VERSION ?>" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <link rel="stylesheet" href="styles/core/styles.css?<?php echo $VERSION ?>"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.gridlayer.googlemutant@latest/dist/Leaflet.GoogleMutant.js"></script>
  <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
  <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
  <script src="core/api/_util.js?<?php echo $VERSION ?>"></script>
  <script src="core/db/_declare.js?<?php echo $VERSION ?>"></script>
  <script src="core/api/_auth.js?<?php echo $VERSION?>"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>
    <div id="f_flag" state="false" hidden></div>
    <div class="fms-loader"><div class="fl-center"><i class="fa-solid fa-circle-notch"></i><span>Laddar...</span></div></div>
<?php

    if (isset($_GET["login"]) && $_GET["login"] == "false") {
        include_once "core/extra/_signIn.php";

    } else {

      include_once "core/extra/map.php";

      // Load extras
      if (isset($_GET["s"])) {
          include_once "core/extra/sessions_imports.php";
      }

      if (isset($_GET["m"]) && $_GET["m"] == "editor") {
          include_once "core/extra/editor.php";
      }

    }


?>
</body>
</html>
