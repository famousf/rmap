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
<div class="actionbutton" id="addPoint">
    <span>+</span>
</div>

<div class="actionbar">
  <div class="left">
    <div id="pickLine" class="actionbar_toggle_item">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
      	<path d="M0 0h256v256H0z" fill="none" />
      	<path fill="currentColor" fill-rule="evenodd" d="M233 64.5h-28.495c-18.104 0-32.517 4.04-49.695 18.089c-15.765 12.892-30.941 31.655-39.559 46.948c-12.478 22.144-33.858 39.953-43.54 43.463c-9.68 3.51-23.202 3.5-30.711 3.5H25V192h23.5c9.747 0 26.265-.681 39.867-7.61c18.496-9.42 33.507-35.51 47.578-54.853c9.879-13.579 21.773-27.756 32.732-36.034C182.775 82.853 196.637 80 216.5 80H233z" />
      </svg>
      <span>Linje</span>
    </div>
    <div id="pickBlock" class="actionbar_toggle_item">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
      	<path d="M0 0h32v32H0z" fill="none" />
      	<path fill="currentColor" d="M14 4a2 2 0 0 0-2 2v.063L6.937 9.25A2 2 0 0 0 6 9a2 2 0 0 0-2 2c0 .738.402 1.371 1 1.719V24.28c-.598.348-1 .98-1 1.719a2 2 0 0 0 2 2c.738 0 1.371-.402 1.719-1H20.28c.348.598.98 1 1.719 1a2 2 0 0 0 2-2c0-.398-.11-.781-.313-1.094L26.125 20a2.005 2.005 0 0 0 .25-3.969l-1.906-5.718C24.785 9.957 25 9.511 25 9a2 2 0 0 0-2-2c-.512 0-.957.215-1.313.531L15.97 5.594A2.01 2.01 0 0 0 14 4m1.313 3.5l5.718 1.875c.153.805.79 1.441 1.594 1.594l1.906 5.687A2 2 0 0 0 24 18c0 .414.129.805.344 1.125L21.875 24a1.99 1.99 0 0 0-1.594 1H7.72a2 2 0 0 0-.72-.719V12.72c.598-.348 1-.98 1-1.719v-.063l5.063-3.187c.28.148.597.25.937.25c.504 0 .96-.191 1.313-.5z" />
      </svg>
      <span>Ruta</span>
    </div>
    <div id="pickIcon" class="actionbar_toggle_item">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      	<path d="M0 0h24v24H0z" fill="none" />
      	<g fill="none">
      		<path d="M3 14.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 0 0-13 0" />
      		<path d="M9 3h12v12h-5c0-4.104-2.895-7-7-7z" />
      		<path stroke="currentColor" stroke-width="2" d="M9 8V3h12v12h-5" />
      		<path stroke="currentColor" stroke-width="2" d="M3 14.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 0 0-13 0Z" />
      	</g>
      </svg>

      <span>Ikon</span>
    </div>
</div>

  <div class="right">
    <div id="resetArray">
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

      <span>Verkställ</span>
    </div>
  </div>
</div>

<div class="signalAccuracy">
  <div class="bg"></div>
  <span id="signalAmount"></span>
</div>

<script src="core/js/developer_tools.js"></script>
