<?php
  $VERSION = "3.0.1";
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
  <meta name="msapplication-TileColor" content="#171c21">
  <meta name="theme-color" content="#171c21">
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
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="core/db/supabase.js"></script>
  <script src="core/api/_util.js?<?php echo $VERSION ?>"></script>
  <script src="core/db/_declare.js?<?php echo $VERSION ?>"></script>
  <script src="core/api/_auth.js?<?php echo $VERSION?>"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>
    <div id="f_flag" state="false" hidden></div>
    <div class="fms-loader">
      <div class="fl-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
        	<path d="M0 0h24v24H0z" fill="none" />
        	<rect width="10" height="10" x="1" y="1" fill="#ffffff95" rx="1">
        		<animate id="SVG7WybndBt" fill="freeze" attributeName="x" begin="0;SVGo3aOUHlJ.end" dur="0.2s" values="1;13" />
        		<animate id="SVGVoKldbWM" fill="freeze" attributeName="y" begin="SVGFpk9ncYc.end" dur="0.2s" values="1;13" />
        		<animate id="SVGKsXgPbui" fill="freeze" attributeName="x" begin="SVGaI8owdNK.end" dur="0.2s" values="13;1" />
        		<animate id="SVG7JzAfdGT" fill="freeze" attributeName="y" begin="SVG28A4To9L.end" dur="0.2s" values="13;1" />
        	</rect>
        	<rect width="10" height="10" x="1" y="13" fill="#fb4d4e" rx="1">
        		<animate id="SVGUiS2jeZq" fill="freeze" attributeName="y" begin="SVG7WybndBt.end" dur="0.2s" values="13;1" />
        		<animate id="SVGU0vu2GEM" fill="freeze" attributeName="x" begin="SVGVoKldbWM.end" dur="0.2s" values="1;13" />
        		<animate id="SVGOIboFeLf" fill="freeze" attributeName="y" begin="SVGKsXgPbui.end" dur="0.2s" values="1;13" />
        		<animate id="SVG14lAaeuv" fill="freeze" attributeName="x" begin="SVG7JzAfdGT.end" dur="0.2s" values="13;1" />
        	</rect>
        	<rect width="10" height="10" x="13" y="13" fill="#ffffff95" rx="1">
        		<animate id="SVGFpk9ncYc" fill="freeze" attributeName="x" begin="SVGUiS2jeZq.end" dur="0.2s" values="13;1" />
        		<animate id="SVGaI8owdNK" fill="freeze" attributeName="y" begin="SVGU0vu2GEM.end" dur="0.2s" values="13;1" />
        		<animate id="SVG28A4To9L" fill="freeze" attributeName="x" begin="SVGOIboFeLf.end" dur="0.2s" values="1;13" />
        		<animate id="SVGo3aOUHlJ" fill="freeze" attributeName="y" begin="SVG14lAaeuv.end" dur="0.2s" values="1;13" />
        	</rect>
        </svg>

        <span>Laddar...</span>
      </div>
    </div>
<?php
    /*
      main
      main -> map -> johannesberg-lampor
      main -> map -> mariestad-snow
      0       550    uri
    */


    /*

      - new remake 2025-09-16

        login
        landing page - flashy showing different modes to enable(seasonal)
          - snow routes -> rmap/?route=snow
            - load based on default map setting from api
            -

          - drifttekniker
            - load based on default map settings from api

    */

    if (isset($_GET["login"]) && $_GET["login"] == "false") {
        include_once "core/extra/_signIn.php";

    } else {
      ##include_once "core/extra/base_map.php"; // Load default map without functions (navigation pretty much)
      include_once "core/extra/map.php";
    }
    // Load extras
    if (isset($_GET["s"])) {
        include_once "core/extra/sessions_imports.php";
    }
    if (isset($_GET["m"]) && $_GET["m"] == "editor") {
        include_once "core/extra/editor.php";
    }

    if (isset($_GET["dev"])) {
        if ($_GET["dev"] == "map_dev") {
          include_once "core/extra/map_dev.php";
        }
    }


    if (isset($_GET["r"])) {
        include_once "core/extra/export_report.php";
    }
      /*
      if (isset($_GET["map"]) && !isset($_GET["type"])) {

          include_once "core/extra/map.php";
          return;
      } else if (!isset($_GET["map"]) && isset($_GET["type"])){

          include_once "core/extra/map.php";
          return;
      }
      */


      //if (isset($_GET["map"]) && isset($_GET["type"])) { include_once "core/extra/core.php";}

      /*
      if (!isset($_GET["s"]) && !isset($_GET["map"]) && !isset($_GET["m"])) {
      }
      */

      /*

      if (isset($_GET["map"]) && $_GET["map"] == "snow") {
          include_once "core/extra/map.php";
      }

      if (isset($_GET["m"]) && $_GET["m"] == "editor") {
          include_once "core/extra/editor.php";
      }


    }
    */
    /*
    if (isset($_GET["experimental"])) {
      include_once "core/extra/experimental.php";

      if (isset($_GET["moment"])) {
        include_once "core/extra/moment.php";

      }
    }
    */
?>
</body>
</html>
