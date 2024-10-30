let typeSetting = null
let workTypeSetting = null
let blockLineSetting = null
let polygonCoords = []
let polyline = null
let setIconType = null
let iconTypeMarker = null
let setIconData = []
let iconData = null
const fillJobContent = (type) => {
  // Show drag-content first
  let parent = document.getElementsByClassName('drag-content')[0]
      parent.classList.add('show')
  // Hide all other children
  ch = parent.children
  for (i = 0; i < ch.length; i++ ) {
      if (ch[i].classList[0] == `job-${type}`) {
          console.log(type)
          ch[i].classList.add('show')
      } else {
        ch[i].classList.remove('show')
      }
  }

}
const pickJobEditor = () => {
  let holder = document.getElementsByClassName('pick-draw')[0]
  let ch = holder.children
  for (i = 0; i < ch.length; i++) {
      ch[i].addEventListener('click', (e) => {
          id = e.target.id
          fillJobContent(id)
          polygonCoords = []
          polyline.setLatLngs([])
      })
  }


  // For Icons
  let jobIcons = document.getElementsByClassName('fms-icon-picker')
  for (i = 0; i < jobIcons.length; i++) {
      jobIcons[i].addEventListener('click', (e) => {
          // Clear setIconType from previous setting
          setIconType = null
          // Remove class if its not the same as target
          for (i = 0; i < jobIcons.length; i++) {
              jobIcons[i].classList.remove('active')
          }
          e.target.classList.add('active')
          setIconType = e.target.id
      })

  }

  map.on('click', (e) => {
    if (setIconType) {
      if (iconTypeMarker) {
        iconTypeMarker.setLatLng([e.latlng.lat, e.latlng.lng])
        iconTypeMarker.setIcon(L.divIcon({
          html: warningType[setIconType].icon, // Update FontAwesome icon
          iconSize: [18, 36], // Size of the icon
          className: `fms-${setIconType}`,
          popupAnchor: [0, -12], // Position of the popup
          iconAnchor: [13, 12]
        }));

      } else {
        iconTypeMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon: L.divIcon({
          html: warningType[setIconType].icon, // FontAwesome icon
          iconSize: [18, 36], // Size of the icon
          className: `fms-${setIconType}`,
          popupAnchor: [0, -12], // Position of the popup
          iconAnchor: [13, 12]
        })}).addTo(map)
      }

      // Add to json
      let iconData = {
        type: setIconType,
        coords: [e.latlng.lat, e.latlng.lng]
      }


      console.log(iconData)
      // Show "accept" button
      // if confirmed, push data to php and insert into .json
      $('.fms-confirm-coords').show()
      $('.fms-confirm-button').on('click', (e) => {
          console.log("send this data to server:", iconData)
      })


    }


  })
}
const inputDrawBlock = () => {
  mapDOM = document.getElementById('map')
  mapDOM.classList.add('pointer')
  // Array to hold the coordinates of the polygon
  polyline = L.polyline([], { color: 'blue' }).addTo(map); // Realtime polyline


  // Function to print the current polygon coordinates to console
  function logCoordinates() {

      //document.getElementById('dsum').innerText = `Antal punkter: ${polygonCoords.length}`
      console.log('Current Polygon Coordinates:', JSON.stringify(polygonCoords));


  }

  // Event listener for map click
  map.on('click', function(e) {
      var latLng = e.latlng; // Get the latitude and longitude of the click
      polygonCoords.push([latLng.lat, latLng.lng]); // Add coordinates to array
      polyline.addLatLng(latLng); // Add new point to the polyline

      logCoordinates(); // Print current coordinates
  });

  // Reset functionality
  /*
  document.getElementById('reset').addEventListener('click', function() {
      polygonCoords = []; // Reset coordinates array
      polyline.setLatLngs([]); // Remove all points from the polyline
      //document.getElementById('dsum').innerText = `Antal punkter: 0`
      console.log('Polygon reset');
  });
  */
}
inputDrawBlock()
pickJobEditor()









dragElement(document.getElementById("editor"));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
