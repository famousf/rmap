<div class="auth-screen">
  <div class="auth-content">

  <h2>Välkommen, <span>Ludwig</span>!</h2>

  <div class="flex-container">
    <div class="">
      <i class="fa-solid fa-snowplow"></i>
      <h3>Snökörning</h3>
    </div>
    <div class="">
      <h3>Fastighetsdrift</h3>
    </div>
    <div class="">
      <h3>Test</h3>
    </div>

  </div>

</div>
  <video autoplay muted loop playsinline class="video-background">
      <source src="img/media/vidbg.webm" type="video/webm">
          Your browser does not support the video tag.
  </video>
</div>

<div class="fms_layers">
  <h1>Scenarion</h1>
  <p>Bläddra mellan olika kartor och scenarios</p>
    <div class="layer_select">
      <div class="modal">
        <div class="img special"><i class="fa-regular fa-bell"></i></div>
          <span>SNÖJOUR</span>
      </div>
      <div class="modal">
        <div class="img white"></div>
          <span>LJUS</span>
      </div>
      <div class="modal">
        <div class="img dark"></div>
        <span>MÖRK</span>
      </div>
    </div>
</div>

  <div class="fms_scenario">
    <h1>Arbetsmoment</h1>
    <p>Skräddarsydda moment</p>
      <div class="layer_select">
        <div class="modal" onclick="momentChange(this)" id="lamprondering">
          <div class="img special"><i class="fa-solid fa-lightbulb"></i></div>
        </div>
      </div>
  </div>
  <!--
  <div class="fms-toggle_n one-extra">
    <div class="tn_button" id="centerGps">
      <i class="fa-solid fa-location-arrow"></i>
    </div>
    <div class="tn_button" id="hamb-layer">
      <i class="fa-solid fa-layer-group"></i>
    </div>
    <div class="tn_button" id="hamb-tasks">
      <i class="fa-solid fa-table-list"></i>
    </div>
    <div class="tn_button last_bump" id="hamb-menu">
      <i class="fa-solid fa-gear"></i>
    </div>
    <div class="tn_button zoom" id="plus" onclick="mapZoomInput(this)">
      <i class="fa-solid fa-plus"></i>
    </div>
    <div class="tn_button" id="minus" onclick="mapZoomInput(this)">
      <i class="fa-solid fa-minus"></i>
    </div>
  </div>

  <div class="fms-menu" id="fms-menu">
    <div class="menu-content">
        <div class="bar head-info">
            <i class="fa-solid fa-arrow-left" id="hamb-back"></i>
            <img class="api-logo" src="">
            <h1 class="api-username"></h1>
            <span class="api-email"></span>
            <div class="api-cities"></div>
        </div>
        <div class="break"></div>
        <div class="menu-items-holder">

          <div class="bar setting" onclick="createNewSesssion(this)">
            <i class="fa-solid fa-route"></i>
            <h1>Skapa Session</h1>
          </div>
          <div class="bar setting" onclick="toggleReportWindow(this)">
            <i class="fa-solid fa-file-export"></i>
            <h1>Exportera Rapporter</h1>
          </div>

          <div class="bar setting" onclick="toggleUserCredentials(this)">
            <i class="fa-solid fa-user-secret"></i>
            <h1>Ändra Lösenord</h1>
          </div>
          <div class="bar setting" onclick="">
            <i class="fa-solid fa-arrows-rotate"></i>
            <h1>Ladda om</h1>
          </div>
          <div class="bar red setting">
            <i class="fa-solid fa-door-open"></i>
            <button type="submit" name="logout" onclick="signOutUser(this)">Logga ut</button>
          </div>

        </div>
    </div>
  -->
    <!--<button id="reset">Reset</button>-->
    <!--
    <div class="bottom-github">
      <div class="git">
        <img id="cat" src="img/github/github-cat-white.png" alt="">
        <img id="text" src="img/github/github-text-white.png" alt="">
      </div>
      <span>Made by Ludwig Eriksson</span>
    </div>
  </div>
-->
  <!--
  <div class="fms-bars" id="hamb-menu">
    <i class="fa-solid fa-bars"></i>
  </div>
-->
  <!-- END hidden menu -->

  <!--<div id="map"></div>-->
  <!--<div class="status-bar"></div>-->
  <script src="core/js/base_map.js?<?php echo $VERSION ?>"></script>
  <script src="core/js/util.js?<?php echo $VERSION ?>"></script>
