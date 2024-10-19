<?php
  if(isset($_POST["numpadClear"])):
      setcookie('isCleared', "clear", time() + (86400 * 10), "/");
      echo "isCleared";
      exit;
  endif;

  if(isset($_POST["setUser"])):
      setCookie('loggedUser', $_POST["user"], time() + (86400 * 10), "/");
      echo "loggedUser";
      exit;
  endif;


?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Riksbyggen Snöschema - netle.se</title>

  <link rel="apple-touch-icon" sizes="180x180" href="img/favico/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favico/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favico/favicon-16x16.png">
  <link rel="mask-icon" href="img/favico/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="theme-color" content="#ffffff">
  <link rel="manifest" href="manifest.json" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <link rel="stylesheet" href="styles/core/styles.css?v0.96"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.gridlayer.googlemutant@latest/dist/Leaflet.GoogleMutant.js"></script>
  <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
  <script src="core/js/dataset.js?v0.96"></script>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

</head>
<body>

  <?php
    # if !numpadclear
      # load numpad
    # if !setuser
      # load user

    # if numpad && setuser
      # load map

    //setcookie("isCleared", 0, time() - 3600);


    if (!isset($_COOKIE["isCleared"])):
        include_once "core/extra/login.php";

    elseif (!isset($_COOKIE["loggedUser"])):
        include_once "core/extra/pickUser.php";

    endif;


    if (isset($_COOKIE["isCleared"]) && isset($_COOKIE["loggedUser"])):
        include_once "core/extra/map.php";
    endif;


  ?>



</body>
</html>
