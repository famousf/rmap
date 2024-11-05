<div id="editor" draggable="true">

  <!--
  <div class="type">
    <div id="big">Röd</div>
    <div id="small">Blå</div>
    <div id="small_2">Orange</div>
  </div>
  <div class="work_type">
    <div id="dagtid">Dagtid</div>
    <div id="both">Both</div>
    <div id="jour">Jour</div>
  </div>

  <div class="block-line">
    <div id="line">Linje</div>
    <div id="block">Block</div>
    <div id="hazard-block">Varning</div>
  </div>

  <div class="icon-type">
    <div id="snow">Snö</div>
    <div id="warning">Varning</div>
    <div id="stairs">Trappor</div>
  </div>
-->
  <div class="drag-header">
    <div class="pick-draw">
      <div id="line">Linje</div>
      <div id="block">Block</div>
      <div id="icon">Ikon</div>
    </div>
  </div>

  <div class="drag-content">
    <div class="job-line">
      <h1>Linje</h1>
    </div>
    <div class="job-block">
      <h1>Block</h1>
    </div>
    <div class="job-icon">
      <i class='fa-solid fa-stairs fms-icon-picker' id="headsup"></i>
      <i class='fa-solid fa-triangle-exclamation fms-icon-picker' id="obstacle"></i>
      <i class='fa-regular fa-snowflake fms-icon-picker' id="snow"></i>
      <i class="fa-regular fa-trash-can fms-icon-picker" id="trash"></i>
    </div>
  </div>


  <!--
  <div class="data-sum">
    <span id="dsum">Antal punkter: 0</span>
  </div>
  <div id="reset">
    Ta bort
  </div>
-->
</div>
<!--
<div class="fms-confirm-">

</div>
-->
<script src="core/js/editor.js?<?php echo $VERSION ?>"></script>
