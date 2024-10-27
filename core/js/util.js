const toggleUI = (e) => {
  let id = e?.id
  let cname = e?.classList.length
  let names = ["show", "linjer", "ikoner", "parkering"]
  // Make the change
  if (id == "toggle-layer") {
    $('.toggle-layer').toggleClass('fms-show-menu')
    $('#toggle-layer').toggleClass('fms-show-menu')
  } else {
    $(`#${id}`).toggleClass('fms-show-menu')
  }



<<<<<<< HEAD
=======
  console.log(e.classList, cname)
>>>>>>> 1b9edfc7a4f80c1441f293a90662630160b1d743
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
<<<<<<< HEAD
=======
  //if (cname == 1 && names.includes(id)) {}
  /*


  switch ([cname, id].join(',')) {
    case "1, show":
    case "1, linjer":
    case "1, ikoner":
    case "1, parkering":
      console.log("Change color on: ", id)
      break

    case "2, show":
    case "2, linjer":
    case "2, ikoner":
    case "2, parkering":
      console.log("Change back: ", id)
      break
  }*/

  /*
  switch (cname) {
    case 1:
      console.log("2")
      break
    case 2:
      console.log("2")
      break
  }

  switch (id, cname) {
    case "show":
      console.log("Show ")
  }
  */
>>>>>>> 1b9edfc7a4f80c1441f293a90662630160b1d743
}
