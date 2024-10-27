const toggleUI = (e) => {
  let id = e?.id
  let cname = e?.classList.length
  // Make the change
  if (id == "toggle-layer") {
    $('.toggle-layer').toggleClass('fms-show-menu')
    $('#toggle-layer').toggleClass('fms-show-menu')
  } else {
    $(`#${id}`).toggleClass('fms-show-menu')
  }

  // Logic to handle changing ui and map
  if (cname == 1) {
      switch (id) {
        case "show":
          // Remove all restrictions from any object
          $('.fms-blocks').show()
          $('.leaflet-marker-icon').show()
          $('.fms-line').show()
          $('.fms-hazard-blocks').show()
          break
        case "lines":
          // Remove all lines
          $('.fms-line').hide()
          break
        case "icon":
          // Remove all icons
          $('.leaflet-marker-icon').hide()
          break
        case "parking":
          // remove all blocks
          $('.fms-blocks').hide()
          $('.fms-hazard-blocks').hide()
      }
  }
  if (cname == 2) {
    switch (id) {
      case "show":
        // show all restrictions from any object
        $('.fms-blocks').show()
        $('.leaflet-marker-icon').show()
        $('.fms-line').show()
        $('.fms-hazard-blocks').show()
        break
      case "lines":
        // show all lines
        $('.fms-line').show()
        break
      case "icon":
        // show all icons
        $('.leaflet-marker-icon').show()
        break
      case "parking":
        // show all blocks
        $('.fms-blocks').show()
        $('.fms-hazard-blocks').show()
    }
  }
}
