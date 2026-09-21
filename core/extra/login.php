<div class="auth-screen" id="ldle3a">
<!--
  <div class="auth-bg">
    <div class="main-animation">
        <div id="a"></div>
        <div id="b"></div>
        <div id="c"></div>
        <div id="d"></div>
        <div id="e"></div>
    </div>
    <div class="auth-logo">
      <img src="img/logo_white.svg" alt="">
    </div>
    <div class="auth-slogan">
      <h1>Riksbyggen</h1>
      <span>Snökarta - <?php echo $VERSION ?></span>
    </div>
  </div>
-->
  <video autoplay muted loop playsinline class="video-background">
    <source src="your-video.webm" type="video/webm">
      Your browser does not support the video tag.
  </video>
  <div class="auth-sig">
    <h1>... Signera</h1>
    <span>För att motverka otillåten åtkomst, ange 'koden'</span>
    <input type="password" name="" value="" id="vme-input">
    <div class="numpad">
        <button value="1">1</button>
        <button value="2">2</button>
        <button value="3">3</button>
        <button value="4">4</button>
        <button value="5">5</button>
        <button value="6">6</button>
        <button value="7">7</button>
        <button value="8">8</button>
        <button value="9">9</button>
        <button value="delete">CE</button>
        <button value="0">0</button>
        <button value="go-back"><i class="fa-solid fa-delete-left"></i></button>
    </div>
  </div>
  <img id="rb_white" src="img/logo.svg" alt="">
</div>
<script src="core/js/login.js?<?php echo $VERSION ?>"></script>
