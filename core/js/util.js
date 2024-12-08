const toggleLoadingDiv = (t) => {
  div = document.getElementsByClassName('fms-loader')[0]
  if (t == true) {
      // Start animation
      div.classList.add('on')
  }

  if (t == false) {
      // End animation
      div.classList.remove('on')
  }
}
const formatDate = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    return formattedDate
}
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
