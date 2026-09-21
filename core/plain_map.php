<div class="bmb_flex">
  <div class="bmb_bar">
    <span>51%</span>
    <strong>Pågående</strong>
  </div>
  <div class="bmb_bar big">

    <span id="speedometer">-</span>
    <strong>Km / h</strong>

  </div>
  <div class="bmb_bar">
    <span>6h 28m</span>
    <strong>Arbetad tid</strong>
  </div>
</div>
  <div class="bottom_main_bar">


  </div>
  <!-- Top left icon & Tooltip -->
  <div class="fms-top-left" id="top-left-info">
    <i class="fa-regular fa-circle-question"></i>
  </div>
  <div class="fms-icon-tooltip" id="icon-tooltip">
    <div class="fms-tt-block">
      <div class="tt-road"><div></div></div>
      <span>Väg</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-small-road"><div></div></div>
      <span>Mindre väg</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-entrance"><div></div></div>
      <span>Entréer / Ingångar</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-parkering"><div></div></div>
      <span>Parkering / Maskinplogning</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-area-danger"><div></div></div>
      <span>Varning</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-perimiter"><div></div></div>
      <span>Tomtgräns</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-icon snow">
        <i class='fa-regular fa-snowflake'></i>
      </div>
      <span>Snöupplag</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-icon stairs">
        <i class='fa-solid fa-stairs'></i>
      </div>
      <span>Källartrappa</span>
    </div>
    <div class="fms-tt-block">
      <div class="tt-icon warning">
        <i class='fa-solid fa-triangle-exclamation'></i>
      </div>
      <span>Varning (Fara/Vägbomm)</span>
    </div>
  </div>
  <!-- END tooltip -->

  <!-- EXPERIMENTAL Prompt -->
  <div class="fms-prompt" id="prompt">
    <h1>Vill du visa körschema för jouren?</h1>
    <span>Detta visar enbart de rutter och varningar som används på snöberedskapen - Öppna för blåljuspersonal.</span>
    <div class="prompt-buttons">
      <div class="button y jsButton" data-prompt="yes">Bekräfta</div>
      <div class="button n jsButton" data-prompt="no">Avbryt</div>
    </div>
  </div>
  <!-- END Prompt -->
  <div class="fms_layers">
    <h1>Scenarion</h1>
    <p>Bläddra mellan olika kartor och scenarios</p>
      <div class="layer_select">
        <!--
        <div class="modal">
          <div class="img special"><i class="fa-regular fa-bell"></i></div>
            <span>viloläge</span>
        </div> -->
        <div class="modal">
          <div class="img special"><i class="fa-regular fa-bell"></i></div>
            <span>JOUR</span>
        </div>
        <div class="modal">
          <div class="img white"></div>
            <span>LJUS</span>
        </div>
        <div class="modal">
          <div class="img dark"></div>
          <span>MÖRK</span>
        </div>
        <!--
        <div class="modal">
          <div class="img rb-johannesberg"></div>
          <span>BERGET</span>
        </div>
      -->
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
  <!-- Bottom navigation -->
  <div class="fms-toggle_n">
    <div class="tn_button" id="centerGps">
      <i class="fa-solid fa-location-arrow"></i>
    </div>
    <div class="tn_button" id="hamb-layer">
      <i class="fa-solid fa-layer-group"></i>
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
  <div class="fms-toggle">
    <div class="fms-bars" id="hamb-menu">
      <i class="fa-solid fa-bars"></i>
    </div>
    <div class="fms-toggle-btn" id="worktype">Dagtid</div>
    <!--
    <div class="fms-toggle-btn" id="toggle-layer" id="main-btn" onclick="toggleUI(this)">LAGER</div>
    -->
    <div class="fms-toggle-btn" id="centerGps"><i class="fa-solid fa-location-arrow"></i></div>
    <div class="toggle-layer">
      <!--
      <div class="tl-bar" id="show" onclick="toggleUI(this)">
        <div class="show"><i class="fa-solid fa-arrow-rotate-left"></i></div><span>Visa allt</span>
      </div>
    -->
    <!--
      <div class="tl-bar" id="lines" onclick="toggleUI(this)">
        <div class="linjer"></div><span>Linjer</span>
      </div>
      <div class="tl-bar" id="icon" onclick="toggleUI(this)">
        <div class="ikoner"></div><span>Ikoner</span>
      </div>
      <div class="tl-bar" id="parking" onclick="toggleUI(this)">
        <div class="pakering"></div><span>Ytor</span>
      </div>
    </div>
  -->
  </div>


  </div>
  <!-- END bottom navigation -->

  <!-- Hidden menu -->
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

        <!--
        <div class="bar">
          <h1>GPS</h1>
          <span>Spårar din enhet med hjälp av GPS</span>
          <label class="switch">
            <input type="checkbox" onchange="toggleSetting(this)" id="myPosition">
            <span class="slider round"></span>
          </label>
        </div>
        -->
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

          <div class="prev-sessionData">
            <h1>Tidigare sessioner (5)</h1>
          </div>
        </div>
    </div>

    <!--<button id="reset">Reset</button>-->
    <div class="bottom-github">
      <div class="git">
        <img id="cat" src="img/github/github-cat-white.png" alt="">
        <img id="text" src="img/github/github-text-white.png" alt="">
      </div>
      <span>Made by Ludwig Eriksson</span>
    </div>
  </div>
  <!--
  <div class="fms-bars" id="hamb-menu">
    <i class="fa-solid fa-bars"></i>
  </div>
-->
  <!-- END hidden menu -->



  <div id="map"></div>
  <!--<div class="status-bar"></div>-->
  <script src="core/js/map.js?<?php echo $VERSION ?>"></script>
  <script src="core/js/util.js?<?php echo $VERSION ?>"></script>
  <script src="core/api/_assign.js?<?php echo $VERSION ?>"></script>
