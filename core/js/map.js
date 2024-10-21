/*
  Define default variables to be changed later
*/
const SUPABASE_URL = 'https://fhivxtszdqyyjffnxqbr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaXZ4dHN6ZHF5eWpmZm54cWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjE2NTEsImV4cCI6MjA0NDU5NzY1MX0.J1w5t2ihCjNSAzdXM98wfv3PdsntR-T6M4NOD3_srjo';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let clientPosition = null
let previousLatLng = null
let userMarker = null
let gpsMarker = null
let multipleMarkers = []
let userIsFollowing = false
let userLastKnownPos = null
let flagFromSetView = null
let watcherId = null
let isTracking = null
let domClasses = [
  "fms-line",
  "fms-blocks",
  "fms-hazard-blocks",
  "fms-obstacle",
  "fms-stairs",
  "fms-headsup",
  "fms-snow",
  "fms-trash"
]
let GLOBAL_PARAMETER = window.location.search
let GLOBAL_SETTINGS = null
const jsonData = Object.entries(points)

/*
  Misc functions to handle customized events such as getLineWeight, displayLatLngClick.
  - These functions are ran inside other functions to prevent reusing too much code
*/
const map = L.map('map')
const warningType = {
  stairs: {
    text: "<h1>Handskottning</h1><span>Trappa</span>",
    icon: "<i class='fa-solid fa-stairs'></i>"
  },
  obstacle: {
    text: "<h1>Vägbomm</h1>",
    icon: "<i class='fa-solid fa-triangle-exclamation'></i>"
  },
  headsup: {
    text: "<h1>Standard info</h1>",
    icon: "<i class='fa-solid fa-stairs'></i>"
  },
  snow: {
    text: "<h1>Snöupplag</h1>",
    icon: "<i class='fa-regular fa-snowflake'></i>"//"<i class='fa-solid fa-mountain'></i>"
  },
  trash: {
    text: "<h1>Soprum / Soptunna</h1>",
    icon: '<i class="fa-regular fa-trash-can"></i>'
  }
}
const tileLayers = () => {
    const openStreetMap_DE = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    	maxZoom: 18,
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    	maxZoom: 17,
    	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    const thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
    	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    	apikey: 'dc7a2112154c438197bd2d9da031c764',
    	maxZoom: 22
    });
    const thunderforest_Outdoors = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
    	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    	apikey: 'dc7a2112154c438197bd2d9da031c764',
    	maxZoom: 22
    });
    const jawg_Matrix = L.tileLayer('https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    	minZoom: 0,
    	maxZoom: 22,
    	accessToken: 'rpjouPxUJLrvkOIc8BcXcrf6FRCRPf0sZTVGOZRgPiuXFtC2cVp6VTCfmS9Tgqky'
    });
    const esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
    // Add OpenStreetMap as the default map layer
    let baseLayers = {
      "Open streets map": openStreetMap_DE,
      "open topo map": openTopoMap,
      "tf landscape": thunderforest_Landscape,
      "tf outdoors": thunderforest_Outdoors, // Satellite map layer
      "jawg matrix": jawg_Matrix,
      "Sattelit": esri_WorldImagery
    };

    const getStoredLayer = () => {
      const savedLayerName = localStorage.getItem('layer')
      return baseLayers[savedLayerName] || thunderforest_Outdoors
    }
    //
    const storedLayer = getStoredLayer()
    storedLayer.addTo(map);

    // Layer control object to switch between map styles

    // Add the control to the map to switch between layers
    L.control.layers(baseLayers).addTo(map);
    // Geolocation - Get the user's current location and place a marker
}
const getPolygonCentroid = (latlngs) => {
  let lat = 0;
  let lng = 0;
  let totalPoints = latlngs.length;

  latlngs.forEach(function (point) {
    lat += point.lat;
    lng += point.lng;
  });

  return L.latLng(lat / totalPoints, lng / totalPoints);
}
const displayLatLngClick = (e) => {
    // Get the latitude and longitude of the clicked point
    const { lat, lng } = e.latlng;

    // Add a popup at the clicked location showing the coordinates
    L.popup()
    .setLatLng([lat, lng])
    .setContent(`[${lat.toFixed(5)}, ${lng.toFixed(5)}],`)
    .openOn(map);

    navigator.clipboard.writeText(`[${lat.toFixed(5)}, ${lng.toFixed(5)}],`)
    .then(() => {
      console.log(`[${lat.toFixed(5)}, ${lng.toFixed(5)}],\n`)
    })
    mapDOM = document.getElementById('map')
    mapDOM.classList.add('pointer')
}
const getLineWeight = (zoomLevel) => {
    return Math.max(1, zoomLevel - 7); // Grow line weight as zoom level increases
}
const calculateDistance = (currentPos, lastPos) => {
    var currentPoint = L.latLng(currentPos[0], currentPos[1]);
    var lastPoint = L.latLng(lastPos[0], lastPos[1]);
    return currentPoint.distanceTo(lastPoint); // Distance in meters
}

/*
  EXPERIMENTAL
    - Functions that should not be shown to the public
*/
const devOnClick = (boolean) => {

    if (!boolean) {
      map.off('click', displayLatLngClick);

    } else {
      map.on('click', displayLatLngClick);

    }

}
const drawRouteTest = () => {
// Define two positions
     var currentPosition = [58.70299, 13.81125]  // Start position
     var lastKnownPosition = [58.70885, 13.84046]  // End position

     // Use Leaflet Routing Machine to create a route that follows the road
     L.Routing.control({
         waypoints: [
             L.latLng(currentPosition[0], currentPosition[1]),
             L.latLng(lastKnownPosition[0], lastKnownPosition[1])
         ],
         routeWhileDragging: true,  // Allows dynamic rerouting while dragging
         show: true,
         addWaypoints: false  // Disable adding more waypoints by clicking on the route
     }).addTo(map);
}

/*
  COOKIES
  localCookies
  - Takes care of i.e storing the last "style" a user picks, if he reloads, give him the usual one.
    It takes tile, zoom and layer from LS and checks if these are already stored.
    If we can find them, make sure the users view(position) is set to last known

  - When a user moves on the map, it will continue to store the latest coordinate to easily-
    keep the user on the same position.
*/

const localCookies = () => {
  // Store stuff here;
  // . Last picked tilelayer (style)
  // . Last position
  let storedTile = localStorage.getItem('tile')
  let storedZoom = localStorage.getItem('zoom')
  let storedLayer = localStorage.getItem('layer')
  if (storedTile && storedZoom) {
      // Exists
      storedTile = JSON.parse(storedTile)
      storedZoom = parseInt(storedZoom)
      map.setView(storedTile, storedZoom)
  } else {
      // does not
      map.setView([58.70780, 13.82166], 14) // Center of Mariestad
  }
  map.on('moveend', () => {
    // We stopped moving, store new coordinates in 'tile'
    let coords = [map.getCenter().lat, map.getCenter().lng]
    localStorage.setItem('tile', JSON.stringify(coords))

    // Store last zoom aswell
    localStorage.setItem('zoom', map.getZoom())


    if (userLastKnownPos && coords && userIsFollowing) {
      if (calculateDistance(coords, userLastKnownPos) > 150) {
          if (!flagFromSetView) {
              userIsFollowing = !userIsFollowing
              document.getElementById("centerGps").classList.remove("highlighted")
          }
      }
    }
    // Update "last known"
    userLastKnownPos = coords
    flagFromSetView = false
  })

  // Stored last picked tilelayer, and use it if it exists
  map.on('baselayerchange', (e) => {
      localStorage.setItem('layer', e.name)
  })
}

/*
  Functions are run when determined what element in DOM should be visible or not
*/
const hideForZoom = () => {
  // Hide small objects
  for (i = 0; i < domClasses.length; i++) {
      let objects = document.getElementsByClassName(domClasses[i])
      for (x = 0; x < objects.length; x++) {
          objects[x].classList.add("fms-hidden")
      }
  }
  // Show streetnames
  let names = document.getElementsByClassName('area-label')
  for (i = 0; i < names.length; i++) {
      names[i].classList.remove('fms-hidden')
  }
}
const showForZoom = (disregard) => {
  // Show smalll objects
  for (i = 0; i < domClasses.length; i++) {
      let objects = document.getElementsByClassName(domClasses[i])
      for (x = 0; x < objects.length; x++) {
          if (!objects[x].classList.contains("fms-type-hidden")) {
              objects[x].classList.remove("fms-hidden")
          }
      }
  }

  if (!disregard) {
    // Hide streetnames
    let names = document.getElementsByClassName('area-label')
    for (i = 0; i < names.length; i++) {
      names[i].classList.add('fms-hidden')
    }
  }
}
/*
  Drawings
  These functions handles the different type of objects we "draw" on the map based-
  on the data given in "dataset.js"
  - Note to self: Consider making this alot more dynamic based on the data in dataset.js
    Determine a baseline, then use the data to handle the actions instead of making new-
    functions for each new type.
*/
const updateMultipleusers = (data) => {
  let loggedUser = JSON.parse(localStorage.getItem("loggedUser"))[1].toLowerCase()
  // Updates the markers with new coords
  data.forEach((user, i) => {
        /* UPDATE Existing markers and user */
        multipleMarkers.forEach((object, i) => {
            // Do not update or modify yourself, you exists in another function
            if (user.username != loggedUser) {
                // 2 dimensional interation
                if (user.username == object.username) {
                  // Update these markers with new coordinates
                  // lastupdate = 100
                  // date = 150
                  let dateSub = Math.floor(Date.now() / 1000) - user?.lastUpdated
                  if (dateSub < 300) {
                        // Coordinates have updated since last time
                        multipleMarkers[i].coords = user.coords
                        multipleMarkers[i].lastUpdated = Math.floor(Date.now() / 1000)
                        object.marker.setLatLng(user.coords)
                        object.marker._icon.classList?.remove('fms-hidden')

                        // Update db with coordinates and db
                  } else {
                    object.marker._icon.classList.add('fms-hidden')
                  }

                }
            }
        });


  });


}
const drawMultipleUsers = (data) => {
  let loggedUser = JSON.parse(localStorage.getItem("loggedUser"))[1].toLowerCase()
  let testUser = "ludwig"
  data.forEach((user, index) => {
    // Loop through new incoming data
    if (user.username != loggedUser) {
      // Do not modify yourself, you exist in another function
      let userfix = { f: user?.username.split(" ")[0][0], l: user?.username.split(" ")[1][0] }
      // Reduce username to initials
      // Create a brand new marker, this is the ONLOAD function
      let dateSub = Math.floor(Date.now() / 1000) - user?.lastUpdated
      let hideStatus = (dateSub < 300) ? "" : "fms-hidden"
      gpsMarker = L.marker(user?.coords, { icon: L.divIcon({
        html: `${userfix.f + userfix.l}`, // FontAwesome icon
        iconSize: [18, 36], // Size of the icon
        className: `GPS-user-tracker ${hideStatus}`,
        popupAnchor: [12, 36] // Position of the popup
      })
    }).addTo(map);
    // Push onload data to a global object
    multipleMarkers.push({
      username: user?.username,
      lastUpdated: user?.lastUpdated,
      coords: user?.coords,
      marker: gpsMarker
    })

    }

  });

}
/* ======== Multi / Single ======== */
const drawLines = () => {
  // Loop through points and create polylines for each group
  const colorObj = {
    "big": "#ca5757",
    "small": "#fe9700",
    "small_2": "#fe9700"
  }

  jsonData.forEach((item, i) => {
    compounds = item[1].compounds

    Object.entries(compounds).forEach((data, index) => {
          blocks = data[1].data_lines

          if (blocks) {
            Object.entries(blocks).forEach((block, i) => {
              let custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
              let customWidth = (block[1].type === "small") ? 0.8 : 1

              const lines = block[1].coords
              const polyline = L.polyline(lines, {
                color: colorObj[block[1].type], // Set the color from the group data
                weight: 7,//getLineWeight(map.getZoom() * customWidth), // Set initial weight
                className: `fms-line ${block[1].work_type} ${custClass}`
              }).addTo(map);

              if (GLOBAL_PARAMETER.length > 0 && GLOBAL_PARAMETER == '?m=editor') {
                  // User is in editor / debugg mode
                  polyline.bindPopup(`data_line #:${i}`)
              }
            });
          }
    })
  });
}
const drawBlocks = () => {
  // Example coordinates for a polygon (5-6 points)
  // Loop through points and create polylines for each group
  jsonData.forEach((item, i) => {
    compounds = item[1].compounds

    Object.entries(compounds).forEach((data, index) => {
          blocks = data[1].data_blocks

          if (blocks) {
            Object.entries(blocks).forEach((block, i) => {
              let custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
              const lines = block[1].coords
              const polygon = L.polygon(lines, {
                fillOpacity: 0.35,  // Transparency level of the fill
                className: `fms-blocks ${block[1].work_type} ${custClass}`
              }).addTo(map);

              if (GLOBAL_PARAMETER.length > 0 && GLOBAL_PARAMETER == '?m=editor') {
                  // User is in editor / debugg mode
                  polygon.bindPopup(`data_blocks #:${i}`)
              }
            });
          }
    })
  });
}
const drawHazardBlocks = () => {

  // Example coordinates for a polygon (5-6 points)
  // Loop through points and create polylines for each group
  jsonData.forEach((item, i) => {
    compounds = item[1].compounds

    Object.entries(compounds).forEach((data, index) => {
          blocks = data[1].data_hazard_blocks

          if (blocks) {
            Object.entries(blocks).forEach((block, i) => {
              let custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
              const lines = block[1].coords
              const polygon = L.polygon(lines, {
                fillOpacity: 0.45,  // Transparency level of the fill
                className: `fms-hazard-blocks ${custClass}`
              }).addTo(map);
              if (GLOBAL_PARAMETER.length > 0 && GLOBAL_PARAMETER == '?m=editor') {
                  // User is in editor / debugg mode
                  polygon.bindPopup(`data_hazard_blocks #:${i}`)
              }
            });
          }
    })
  });

}
const drawWarnings = () => {

  // Here we handle the warnings on the map
  // Could be a gate, no entry, word-in-progress et
  jsonData.forEach((item, i) => {
    compounds = item[1].compounds

    Object.entries(compounds).forEach((data, index) => {
          blocks = data[1].data_warning

          if (blocks) {
            Object.entries(blocks).forEach((block, i) => {
              let custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
              const typeIndex = block[1].type
              const icon = L.divIcon({
                  html: warningType[typeIndex].icon, // FontAwesome icon
                  iconSize: [24, 24], // Size of the icon
                  className: `fms-${typeIndex} ${custClass}`,
                  popupAnchor: [0, -12] // Position of the popup
              });
              // Add a marker with the custom icon and a popup
              const marker = L.marker(block[1].coords, { icon: icon }).addTo(map);
              if (GLOBAL_PARAMETER.length > 0 && GLOBAL_PARAMETER == '?m=editor') {
                  // User is in editor / debugg mode
                  marker.bindPopup(warningType[typeIndex].text + ` #${i}`)
              } else {
                  marker.bindPopup(warningType[typeIndex].text)
              }

            });
          }
    })
  });

}
const drawPerimiter = () => {

  // Example coordinates for a polygon (5-6 points)
  // Loop through points and create polylines for each group
  jsonData.forEach((item, i) => {
    compounds = item[1].compounds
    Object.entries(compounds).forEach((data, index) => {
          blocks = data[1].object_perimiter
          let polygon
          if (blocks) {
            Object.entries(blocks).forEach((block, i) => {
              let custClass = (map.getZoom() < 16) ? "" : ""
              polygon = L.polygon(blocks, {
                className: `fms-perimiter ${custClass}`,
                weight: 1,//getLineWeight(map.getZoom() * 2),
              }).addTo(map);

            });
            const centroid = getPolygonCentroid(polygon.getLatLngs()[0]);
            // Create a DivIcon to hold text or an icon
            let custClass = (map.getZoom() <= 13) ? "fms-hidden" : ""
            const icon = L.divIcon({
              className: "polygon-label",
              html: `<div class='area-label ${custClass}'>${data[1].desc}</div>`,  // You can also use custom text here
              iconSize: [150, 150],
              iconAnchor: [40, 15]  // Center the icon
            });

            // Add a marker at the centroid using the DivIcon
            const marker = L.marker(centroid, { icon: icon }).addTo(map);
            marker.on('click', () => {
                map.setView(centroid, 18, {animate: true, duration: 1})
            })
          }
    })
  });

}
const drawCompounds = () => {

  // City compounds
  jsonData.forEach((item, i) => {
      let city = item[0]
      let coords = item[1].coords
      let areaAmount = Object.keys(item[1].compounds).length
      let custClass = (map.getZoom() >= 13) ? "fms-hidden" : ""
      // Draw div
      const icon = L.divIcon({
        className: "polygon-label-city",
        html: `<div class='city-label ${custClass}'>${city}<h3>${areaAmount} Föreningar</h3></div>`,  // You can also use custom text here
        iconSize: ["auto", "auto"],
        iconAnchor: [5, 5]  // Center the icon
      });

      const marker = L.marker(coords, {icon:icon}).addTo(map)

      marker.on('click', () => {
          map.setView(coords, 15, { animate: true, duration: 1 });
      })

  });

}
/*
  This is given a list with classnames to keep an eye on, if the zoom exceed a threshold-
  i.e 16, certain objects should be hidden.
  This was an easy fix to prevent clutter on the screen if you zoom out "too much"
*/
map.on('zoomend', () => {

  let zoom = map.getZoom()
  if (zoom >= 16) {
    showForZoom(false)
  } else {
    // Hide small objects
    hideForZoom(false)
  }


  let citylabel = document.getElementsByClassName('city-label')
  let arealabel = document.getElementsByClassName('polygon-label')


  if (zoom <= 13) {
    // Hide city button
    for (i = 0; i < citylabel.length; i++) {
      citylabel[i].classList.remove('fms-hidden')
    }
    for (i = 0; i < arealabel.length; i++){
      arealabel[i].classList.add('fms-hidden')
    }
  } else if (zoom >= 14){
    // Show city button
    for (i = 0; i < citylabel.length; i++) {
      citylabel[i].classList.add('fms-hidden')
    }
    for (i = 0; i < arealabel.length; i++){
      arealabel[i].classList.remove('fms-hidden')
    }
  }

})
/*
  workTypeAuto
  - Simply changes the DOM classnames depending on if they should be shown or not-
    this is determined in "dataset.js" which is our database
  - If we zoom in or out, the objects are hidden or shown, this also handles the overlap-
    between these two functions. A user can hide icons, then zoom out and in and it will remain-
    as before.
  toggleWorkTypes
  - Handles clicking on the button and sending indexes to "workTypeAuto()"
*/
const workTypeAuto = (index) => {

  const worktypes = ["dagtid", "jour", "both"]
  for (i = 0; i < worktypes.length; i++) {
      let objects = document.getElementsByClassName(worktypes[i])
      for (x = 0; x < objects.length; x++) {
          // Handle instructions like this:
          // clickindex = 0 -dagtids
          // dagtid is "show all"
          // jour is show only jour
          if (index == 0) {
              // Show jour
              if (objects[x].classList.contains("dagtid")) {
                  // hide everything except jour
                  objects[x].classList.add('fms-type-hidden')
              }
          } else if (index == 1) {
              // Show all
              objects[x].classList.remove('fms-type-hidden')
          }
      }
  }
}
const toggleWorkTypes = () => {

    let button = document.getElementById('worktype')
    let headline = document.getElementById('fms-toggle-headline')
    let headlineWrap = document.getElementById('headline-wrapper')
    let clickIndex = 0
        button.addEventListener("click", (e) => {
          //workTypeAuto(clickIndex)
          if (clickIndex == 0) {
            if(confirm("Vill du visa körschema för snöjouren enbart?")) {
              workTypeAuto(clickIndex)
              button.innerText = "Jour"
              button.classList.add("highlighted")
              showForZoom(true)
            }
          } else if (clickIndex == 1) {
            workTypeAuto(clickIndex)
            button.innerText = "Dagtid"
            button.classList.remove("highlighted")
            showForZoom(true)
          }
          clickIndex++
          if (clickIndex > 1) {
              clickIndex = 0
          }
        })
}
/*
  Handles GEO Location data - navigatorInit and updateUserLocation
  updateUserLocation:
    - Handles updates and updates client
  navigatorInit
    - Monitors the current position and if user has moved,
    if so it sends new data to previous function
*/
const updateUserLocation = (position) => {

    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    let newLatLng = L.latLng(lat, lng);
    clientPosition = [lat, lng]
    // Update the map's view to the new location (optional: add smooth transitions)
    // If the marker exists, update its position, otherwise create a new marker
    // Log the updated position to the console
    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        userMarker = L.marker([lat, lng], { icon: L.divIcon({
            html: '<i class="fa-regular fa-circle-dot"></i>', // FontAwesome icon
            iconSize: [18, 36], // Size of the icon
            className: "GPS-tracker",
            popupAnchor: [12, 36] // Position of the popup
        })}).addTo(map);
    }
    // Check if following mode is active and update map view accordingly
    if (userIsFollowing) {
        map.setView(newLatLng, map.getZoom(), { animate: true, duration: 1 });
    }
    if (document.getElementsByClassName('GPS-tracker')[0]) {
        document.getElementsByClassName('GPS-tracker')[0].classList.remove('gps-hidden')
    }


    // Update supabase Database with new Date.now and coordinates
    const updateSupaDb = async () => {
        let username = JSON.parse(localStorage.getItem("loggedUser"))[1]
        const {data, error} = await supabase
          .from('route')
          .update({
            lastUpdated: Math.floor(Date.now() / 1000),
            coords: clientPosition
          })
          .eq('username', username.toLowerCase())
        if (error) {
          console.log("Update Error", error)
        } else {
          console.log("Updated Succesfully, ", username.toLowerCase())
        }
    }
    updateSupaDb()
}
const navigatorInit = (_boolean) => {
  // Watch for geolocation updates

  if (!boolean) {
      navigator.geolocation.clearWatch(watcherId)
      isTracking = false
      if (document.getElementsByClassName('GPS-tracker')[0]) {
          document.getElementsByClassName('GPS-tracker')[0].classList.add('gps-hidden')
      }
      /*
      if (userMarker) {
          userMarker.remove()
      }
      */

  } else {
      if (navigator.geolocation) {
        watcherId = navigator.geolocation.watchPosition(updateUserLocation,
          function(error) {
            console.error("Error getting geolocation", error);
            if (error.code == 3) {
                location.reload()
            }
          },
          {
            enableHighAccuracy: true,  // Ensure the best possible accuracy
            timeout: 5000,             // Wait for 5 seconds before timing out
            maximumAge: 0              // Disable cache
          }
        );
        isTracking = true
      } else {
        console.error("Geolocation is not supported by this browser.");
      }

  }

}
const trackLocationView = () => {

    let buttonIndex = 0
    let button = document.getElementById("centerGps")
        button.addEventListener("click", (e) => {
            userIsFollowing = !userIsFollowing; // Toggle the following mode

            // If toggled to following, immediately center the map to the current location
            if (userIsFollowing && userMarker) {
                button.classList.add('highlighted')
                map.setView(userMarker.getLatLng(), map.getZoom(), { animate: true, duration: 1 });
                flagFromSetView = true
            } else {
                button.classList.remove('highlighted')
                flagFromSetView = false
            }
            if( buttonIndex > 1) { buttonIndex = 0 }
            buttonIndex++
        })
}

/*
  Handles "info" button and hamburger menu toggling (on/off)
*/
const toggleTopMenu = () => {
  let infoIndex = 0
  let infoButton = document.getElementById('top-left-info')
      infoButton.addEventListener('click', (e) => {
        if (infoIndex == 0) {
            /* Info menu hidden, show it */
            document.getElementById('icon-tooltip').classList.add('fms-override-show')
        } else {
            document.getElementById('icon-tooltip').classList.remove('fms-override-show')
        }
        infoIndex++
        if (infoIndex > 1) { infoIndex = 0 }
      })
  let hamIndex = 0
  let hamburger = document.getElementById('hamb-menu')
      hamburger.addEventListener('click', (e) => {
        if (hamIndex == 0) {
            document.getElementById('fms-menu').classList.add('fms-override-show')
            document.getElementById('hamb-menu').classList.add('hamb-visible')
        } else {
            document.getElementById('fms-menu').classList.remove('fms-override-show')
            document.getElementById('hamb-menu').classList.remove('hamb-visible')
        }
        hamIndex++
        if (hamIndex > 1) { hamIndex = 0 }
      })
}


/*
  Just settings
*/
const initSettings = () => {

  // Search for saved settings
  let storedSettings = localStorage.getItem('settings')
  if (!storedSettings) {
    let settings = {"sharePosition" : true, "myPosition" : true, "enableDev" : false}
    GLOBAL_SETTINGS = settings
    settings = JSON.stringify(settings)

    localStorage.setItem("settings", settings)

  } else {

    let settings = JSON.parse(storedSettings)
    GLOBAL_SETTINGS = settings

  }
}
const settingsEnableFunctions = () => {
  const settings = JSON.parse(localStorage.getItem("settings"))
  if (settings.enableDev) {
      devOnClick(boolean = true)
  } else {
      devOnClick(boolean = false)
  }

  if (settings.myPosition) {
      navigatorInit(boolean = true)
  } else {
      navigatorInit(boolean = false)
  }
}
const toggleSetting = (e) => {
    const status = e.checked
    const object = e.id
    const settings = JSON.parse(localStorage.getItem("settings"))

    settings[object] = status
    localStorage.setItem("settings", JSON.stringify(settings))
    settingsEnableFunctions()

}
const setSettingsDom = () => {
    /* Set settings switches to the correct value */
    const switches = document.getElementsByClassName("switch")
    const settings = JSON.parse(localStorage.getItem("settings"))
    for (i = 0; i < switches.length; i++) {
        let checkbox = switches[i].children[0].id
        if (settings[checkbox] != false) {
            switches[i].children[0].checked = true
        } else {
            switches[i].children[0].checked = false
        }
    }
}


/*
  Handles updating, fetching and displaying of gps coordinates
*/
const gpsFetchStorage = async (updateBool) => {
  const { data, error } = await supabase
  .from('route')  // Replace 'users' with your table name
  .select('*');   // Get all columns

  if (error) {
    console.error("Error fetching users:", error);
  } else {
    // Display users in the HTML
    if (!updateBool) {
      drawMultipleUsers(data)
    } else {
      updateMultipleusers(data)
    }
  }
}
const gpsInsertStorage = () => {
  let user = JSON.parse(localStorage.getItem("loggedUser"))
  let currentDate = Date.now()
  let coordinate = clientPosition
}

const initMap = () => {
  /*
    Initalizes all neccesary and options functions.
    Optional functions * SCRAPPING THIS IDEA
      - These can be turned on/off in the settings menu, its all handeled in Initmap onload
    Dev functions
      - "devOnClick" makes a click display the current coordinates for easier handling.
        This is to be improved on in later stages, i.e administrators for an area could-
        click on the map, then set a perimiter, hazard or draw a new line and give it a description
  */
  initSettings()                // Sets default values if localStorage is not set
  tileLayers()                  // Draws the map(tile)
  localCookies()                // i.e lastknown position, tile settings, zoom
  setSettingsDom()              // Sets the DOM with the correct switches

  drawHazardBlocks()            // Draw dangerous/heads-up areas
  drawBlocks()                  // Draw polygons to represent larger areas
  drawLines()                   // Draw lines that represent i.e roads
  drawWarnings()                // Draws fontawesome icons as warnings or 'heads-up'
  drawPerimiter()               // Draws resident perimiter
  drawCompounds()               // Draws the "blocks" with the description

  toggleWorkTypes()             // Handles two states (daytime work / nighttime work)
  toggleTopMenu()               // Simple js to handle hamburger menu

  settingsEnableFunctions()     // Runs functions based on setting

  trackLocationView()           // Handles clicks on "centering" button
  navigatorInit()               // Initializes GPS for self


  //drawRouteTest()             // EXPERIMENTAL
  //inputDrawBlock()            // EXPERIMENTAL
}


/*
  Runs "initMap" which simply runs the functions needed to run the application based on settings
*/
window.onload = () => {
  // Window Onload
  initMap()
  gpsFetchStorage(updateBool = false)   // Initial Load (i.e create markers instad of updating)
  setInterval(() => {
    gpsFetchStorage(updateBool = true)  // Interval Load (updating existing markers and showing/hiding)
  }, 10000)


}
