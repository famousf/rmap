
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

  <!-- Bottom navigation -->
  <div class="fms-toggle">
    <div class="fms-toggle-btn" id="worktype">Dagtid</div>
    <div class="fms-toggle-btn" id="centerGps"><i class="fa-solid fa-location-arrow"></i></div>
    </div>
  </div>
  <!-- END bottom navigation -->


  <!-- Hidden menu -->
  <div class="fms-menu" id="fms-menu">
    <div class="menu-content">
        <!--
        <div class="bar">
          <h1>Dela Position</h1>
          <span>Visar dig själv och medarbetare på kartan (TBA)</span>
          <label class="switch">
            <input type="checkbox" onchange="toggleSetting(this)" id="sharePosition">
            <span class="slider round"></span>
          </label>
        </div>
      -->
        <div class="bar">
          <h1>GPS</h1>
          <span>Spårar din enhet med hjälp av gps (Beta) </span>
          <label class="switch">
            <input type="checkbox" onchange="toggleSetting(this)" id="myPosition">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="bar">
          <h1>Utvecklare</h1>
          <span>Tillåter användaren att logga kordinater (Beta)</span>
          <label class="switch">
            <input type="checkbox" onchange="toggleSetting(this)" id="enableDev">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="bar red">
          <form method="post">
            <button type="submit" name="logout">Logga ut</button>
          </form>
        </div>
    </div>

    <!--<button id="reset">Reset</button>-->
    <div class="bottom-github">
      <div class="git">
        <img id="cat" src="img/github/github-cat-white.png" alt="">
        <img id="text" src="img/github/github-text-white.png" alt="">
      </div>
      <span>Made by Ludwig Eriksson<br>opensourced on github.io/netle.se</span>
    </div>
  </div>
  <div class="fms-bars" id="hamb-menu">
    <i class="fa-solid fa-bars"></i>
  </div>

  <!-- END hidden menu -->



  <div id="map"></div>
  <script src="core/js/map.js?<?php echo $VERSION ?>"></script>
