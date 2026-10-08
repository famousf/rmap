<?php
# This is to handle creating new nodes or lines.
# - user picks a location where changes will be applied to
# - user picks what type of drawing:
#     Lines
#       - User wait until GPS pos is top notch
#       - Press main button (PUT NODE?) to start the drawing
#       - Each buttonpress draws a line
#       - If its a line, it just ends
#       - if its a block, it will completed the "circle" if you leave it not connected
#
#
#     Icons


?>
<!--
<div class="selectCompounds">
  <select id="selectItems">

  </select>

  <div class="confirmComounds">
    <span>Spara & Stäng</span>
  </div>
</div>
-->


<div class="iconSelectMap" style="position:absolute;z-index:999;padding:20px;top:0;left:0;">
  <div class="map-icon" data-icon="snow">
    <i class="fa-regular fa-snowflake"></i>
  </div>
  <div class="map-icon" data-icon="barrier">
      <i class="fa-solid fa-road-barrier"></i>
  </div>

  <div class="map-icon" data-icon="stairs">
      <i class="fa-solid fa-stairs"></i>
  </div>

  <div class="map-icon" data-icon="door">
      <i class="fa-solid fa-door-open"></i>
  </div>

  <div class="map-icon" data-icon="trash">
      <i class="fa-regular fa-trash-can"></i>
  </div>
</div>

<div class="operationHub">
  <div class="content">
    <h4>Entries</h4>
    <div class="entries-wrapper">
      <div class="pointer block">
        <span></span>
      </div>
    </div>
  <div class="buttons">
    <span>Visa alla</span>
    <span>Ta bort</span>
  </div>
</div>




</div>

<div class="actionbar">
  <div class="logbox">
    <div class="logwrap">
      <div class="topstats">
        <span id="kbm">32 m3</span>
        |
        <span id="mtr">100m</span>

      </div>
      <div class="logstats">
        i Lines | i Blocks | i Icons
      </div>
    </div>
  </div>


  <div class="actionbutton" id="browseArea">
      <div class="side-button">
          <!-- <span>Välj område</span> -->
          <h4>
            <!--<span>Vald kund</span>-->
            Välj kund
          </h4>
      </div>
  </div>
  <div class="left">
    <div id="pickLine" class="actionbar_toggle_item" data-type="lines">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100">
      	<path d="M0 0h100v100H0z" fill="none" />
      	<path fill="currentColor" d="M65.55 0a3.5 3.5 0 0 0-.696.07C58.29.444 53 5.898 53 12.55c0 .267.022.528.04.79l-20.743 6.806c-2.09-3.451-5.797-5.833-10.049-6.075a3.5 3.5 0 0 0-.697-.07a3.5 3.5 0 0 0-.697.07C14.29 14.444 9 19.898 9 26.55c0 5.1 3.106 9.519 7.512 11.474l-4.5 17.02l-.158.027C5.29 55.444 0 60.898 0 67.55C0 74.44 5.661 80.1 12.55 80.1c3.887 0 7.38-1.802 9.688-4.609l20.928 10.127A12 12 0 0 0 43 87.55c0 6.89 5.661 12.55 12.55 12.55S68.1 94.44 68.1 87.55c0-.693-.07-1.367-.18-2.03l1.006.487l1.742-3.602l-5.244-2.537c-2.17-2.753-5.469-4.586-9.176-4.797a3.5 3.5 0 0 0-.697-.07l-.174.006l-2.711-1.313l-.963 1.987a12.7 12.7 0 0 0-5.533 3.615L25 69.05c.06-.494.1-.993.1-1.502c0-4.614-2.546-8.647-6.295-10.813l4.707-17.806c5.845-.935 10.384-5.95 10.568-12.002l21.356-7.006c2.29 3.125 5.976 5.178 10.115 5.178c6.89 0 12.549-5.661 12.549-12.551C78.1 5.898 72.812.444 66.248.07a3.5 3.5 0 0 0-.697-.07m0 7c3.107 0 5.55 2.442 5.55 5.549c0 3.106-2.443 5.55-5.55 5.55S60 15.656 60 12.55C60 9.442 62.444 7 65.55 7m32.903 9l-6.398 2.1l1.246 3.798l6.398-2.097zm-10.2 3.346l-7.6 2.494l1.245 3.8l7.602-2.494zM21.552 21c3.106 0 5.549 2.442 5.549 5.549c0 3.106-2.443 5.55-5.55 5.55S16 29.656 16 26.55c0-3.108 2.444-5.55 5.55-5.55m55.3 2.086l-7.6 2.494l1.248 3.8l7.6-2.493zm-11.402 3.74l-7.601 2.494l1.248 3.801l7.601-2.494zm-12.043 5.76L51.36 40.32l3.868 1.022l2.044-7.735zm-3.068 11.602l-2.045 7.734l3.867 1.021l2.045-7.734zM47.27 55.789l-2.044 7.734l3.867 1.022l2.045-7.734zM12.551 62c3.106 0 5.549 2.442 5.549 5.549c0 3.106-2.443 5.55-5.55 5.55S7 70.656 7 67.55C7 64.442 9.444 62 12.55 62m31.654 5.39l-1.139 4.305a2 2 0 0 0 1.063 2.31l3.193 1.546l1.742-3.6l-1.709-.828l.717-2.71zM55.551 82c3.106 0 5.549 2.442 5.549 5.549c0 3.106-2.443 5.55-5.55 5.55S50 90.656 50 87.55c0-3.108 2.444-5.55 5.55-5.55m18.719 2.146l-1.743 3.602l7.202 3.484l1.742-3.601zm10.8 5.227l-1.742 3.602l3.602 1.742l1.742-3.602z" color="currentColor" />
      </svg>

      <span>Linje</span>
    </div>
    <div id="pickBlock" class="actionbar_toggle_item" data-type="blocks">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100">
      	<path d="M0 0h100v100H0z" fill="none" />
      	<path fill="currentColor" d="M32.5 10.95c-6.89 0-12.55 5.66-12.55 12.55c0 4.02 1.935 7.613 4.91 9.916L14.815 54.172a12.4 12.4 0 0 0-2.316-.223C5.61 53.95-.05 59.61-.05 66.5S5.61 79.05 12.5 79.05c5.13 0 9.54-3.151 11.463-7.603l51.277 7.71c1.232 5.629 6.281 9.894 12.26 9.894c6.656 0 12.114-5.297 12.48-11.867a3.5 3.5 0 0 0 .07-.684a3.5 3.5 0 0 0-.071-.7c-.375-6.562-5.829-11.85-12.479-11.85c-.134 0-.264.015-.396.019L80.242 43.05c3.275-2.127 5.509-5.746 5.738-9.867a3.5 3.5 0 0 0 .07-.684a3.5 3.5 0 0 0-.071-.7c-.375-6.562-5.829-11.85-12.479-11.85c-5.062 0-9.452 3.06-11.43 7.415l-17.082-4.517l-.01-.047c-.374-6.563-5.828-11.852-12.478-11.852m0 7c3.107 0 5.55 2.443 5.55 5.55s-2.443 5.55-5.55 5.55s-5.55-2.443-5.55-5.55s2.443-5.55 5.55-5.55m41 9c3.107 0 5.55 2.443 5.55 5.55s-2.443 5.55-5.55 5.55s-5.55-2.443-5.55-5.55s2.443-5.55 5.55-5.55m-30.137 2.708l17.739 4.69C62.007 40.37 67.239 45.05 73.5 45.05l.033-.002l6.92 21.092a12.7 12.7 0 0 0-4.705 6.015l-50.916-7.654a12.6 12.6 0 0 0-3.787-7.13l10.342-21.378c.368.033.737.057 1.113.057c4.652 0 8.71-2.592 10.863-6.393M12.5 60.95c3.107 0 5.55 2.444 5.55 5.551s-2.443 5.55-5.55 5.55s-5.55-2.443-5.55-5.55s2.443-5.55 5.55-5.55m75 10c3.107 0 5.55 2.444 5.55 5.551s-2.443 5.55-5.55 5.55s-5.55-2.443-5.55-5.55s2.443-5.55 5.55-5.55" color="currentColor" />
      </svg>

      <span>Ruta</span>
    </div>
    <div id="pickIcon" class="actionbar_toggle_item" data-type="icons">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      	<path d="M0 0h24v24H0z" fill="none" />
      	<path fill="currentColor" d="M12.8292 2.4397L17.5626 9.4377C18.0118 10.1018 17.536 10.998 16.7343 10.998L7.2674 10.998C6.4657 10.998 5.9899 10.1018 6.4391 9.4377L11.1726 2.4397C11.5692 1.8534 12.4326 1.8534 12.8292 2.4397ZM11 17.5C11 19.8472 8.8472 22 6.5 22C4.1528 22 2 19.8472 2 17.5C2 15.1528 4.1528 13 6.5 13C8.8472 13 11 15.1528 11 17.5ZM14 13L21 13C21.5523 13 22 13.4477 22 14L22 21C22 21.5523 21.5523 22 21 22L14 22C13.4477 22 13 21.5523 13 21L13 14C13 13.4477 13.4477 13 14 13Z" />
      </svg>


      <span>Ikon</span>
    </div>
</div>

  <div class="right">
    <div id="resetArray" onclick="util.reset()">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21">
      	<path d="M0 0h21v21H0z" fill="none" />
      	<g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      		<path d="M3.578 6.487A8 8 0 1 1 2.5 10.5" />
      		<path d="M7.5 6.5h-4v-4" />
      	</g>
      </svg>
      <span>Reset</span>

    </div>
    <div id="confirmChanges">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      	<path d="M0 0h24v24H0z" fill="none" />
      	<path fill="currentColor" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd" />
      </svg>

      <span>Godkänn objekt</span>
    </div>
  </div>

  <div class="right_plus" id="hamb-layer">

    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      	<path d="M0 0h24v24H0z" fill="none" />
      	<g fill="currentColor">
      		<path d="M12 7C10.8954 7 10 6.10457 10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5C14 6.10457 13.1046 7 12 7Z" />
      		<path d="M12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14Z" />
      		<path d="M12 21C10.8954 21 10 20.1046 10 19C10 17.8954 10.8954 17 12 17C13.1046 17 14 17.8954 14 19C14 20.1046 13.1046 21 12 21Z" />
      	</g>
      </svg>

    </div>
    <div class="fms_layers dev" id="layerDev">
        <div class="layer_select">
          <!--
          <div class="modal">
            <div class="img special"><i class="fa-regular fa-bell"></i></div>
              <span>SNÖJOUR</span>
          </div>
        -->
          <div class="modal" onclick="changeTileLayer(this)" data-layer="ny">
            <div class="img white"></div>
          </div>
          <div class="modal" onclick="changeTileLayer(this)" data-layer="jawg matrix">
            <div class="img dark"></div>
          </div>
          <div class="modal" onclick="changeTileLayer(this)" data-layer="Sattelit">
            <div class="img sat"></div>
          </div>
        </div>
    </div>
  </div>
  </div>
</div>

<div class="signalAccuracy">
  <div class="bg"></div>
  <span id="signalAmount"></span>
</div>

<script src="core/js/developer_tools.js"></script>
