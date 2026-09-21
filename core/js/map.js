/*
  Misc functions to handle customized events such as getLineWeight, displayLatLngClick.
  - These functions are ran inside other functions to prevent reusing too much code
*/
const lineReg = new Map()
const map = L.map("map", {
  preferCanvas: true
});
const locationMarkers = new Map()
const warningType = {
  stairs: {
    text: "<h1>Källartrappa alt. trappa</h1>",
    icon: "<i class='fa-solid fa-stairs'></i>"
  },
  obstacle: {
    text: "<h1>Hinder alt. Viktig yta</h1>",
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
  },
  door: {
    text: "<h1>Entré</h1>",
    icon: '<i class="fa-solid fa-door-open"></i>'
  },
  barrier: {
    text: "<h1>Vägbom</h1>",
    icon: '<i class="fa-solid fa-road-barrier"></i>'
  }
}
const tileLayers = () => {
    const eniroMap = L.tileLayer('https://map02.enirocdn.com/map/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.eniro.se">Eniro</a>'
    });
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

    const OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  	maxZoom: 20,
  	attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
    const OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  	maxZoom: 19,
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  var OpenStreetMap_CAT = L.tileLayer('https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png', {
  	maxZoom: 19,
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>',
    className: "map-tiles"
  });

  var ny = L.tileLayer('https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>',
  });

  var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

    // Add OpenStreetMap as the default map layer
    let baseLayers = {
      "Open streets map": openStreetMap_DE,
      "open topo map": openTopoMap,
      "tf landscape": thunderforest_Landscape,
      "tf outdoors": thunderforest_Outdoors, // Satellite map layer
      "jawg matrix": OpenStreetMap_CAT,
      "Sattelit": esri_WorldImagery,
      "Eniro": eniroMap,
      "ny": ny,
      "new dark": Stadia_AlidadeSmoothDark
    };

    const getStoredLayer = () => {
      const savedLayerName = localStorage.getItem('layer')
      console.log("*** --- SAVED LAYER", savedLayerName)
      return baseLayers[savedLayerName] || OpenStreetMap_CAT
    }
    //
    const storedLayer = getStoredLayer()

    console.log("______", storedLayer)
    storedLayer.addTo(map);

    // Layer control object to switch between map styles

    // Add the control to the map to switch between layers
    L.control.layers(baseLayers).addTo(map);
    // Geolocation - Get the user's current location and place a marker

}

const compareTwoUnixDates = (startTimestamp, endTimestamp) => {

  startTimestamp = (startTimestamp.toString().length == 13) ? Math.floor(startTimestamp / 1000) : startTimestamp
  endTimestamp = (endTimestamp?.toString().length == 13) ? Math.floor(endTimestamp / 1000) : endTimestamp

  // Calculate the difference in seconds
  const differenceInSeconds = endTimestamp - startTimestamp;

  // Convert the difference to hours and minutes
  const hours = Math.floor(differenceInSeconds / 3600);
  const minutes = Math.floor((differenceInSeconds % 3600) / 60);
  // Construct the result string
  let result = "";
  if (hours > 0) result += `${hours}t `;
  if (minutes > 0) result += `${minutes}m`;

  return result.trim();

}
const formatStringDate = (input) => {
    const day = input.slice(0, 2);
    const month = input.slice(2, 4);
    const year = input.slice(4);

    return `${day}-${month}/${year}`;
}
const formatUnixToTime = (unixTimestamp) => {
    // Create a Date object from the Unix timestamp (multiplied by 1000 to convert seconds to milliseconds)
    const date = new Date(unixTimestamp * 1000);

    // Get hours and minutes, and pad with leading zero if needed
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Format as "HH:MM"
    return `${hours}:${minutes}`;
}
const findPositionPoint = (coords) => {0
    let leftmostPoint = coords[0]
    coords.forEach(coord => {
      if (coord[0] > leftmostPoint[0]) {
        leftmostPoint = coord
      }
    });
    return leftmostPoint
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
      console.log(storedZoom, storedTile)
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
              document.querySelector('#userGPStrackDot').classList.remove('activated')
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
  //let loggedUser = JSON.parse(localStorage.getItem("loggedUser"))[1].toLowerCase()
  // Updates the markers with new coords
  let uid = USER_INFO.id
  //console.log(data)
  data.forEach((user, i) => {
        /* UPDATE Existing markers and user */
        multipleMarkers.forEach((object, i) => {
            // Do not update or modify yourself, you exists in another function
            //console.log(multipleMarkers)
            if (user.id != uid) {
                if (user.id == object.uid) {
                  //console.log(user.id, object.uid, object.username, user.last_known)
                  // Update these markers with new coordinates
                  let dateSub = Math.floor(Date.now() / 1000000) - user?.last_known
                  if (dateSub < 600) {
                        //console.log("Tracking", user.username)
                        // Coordinates have updated since last time
                        multipleMarkers[i].last_coord = user.last_coord
                        multipleMarkers[i].last_known = Math.floor(Date.now() / 1000)
                        object.marker.setLatLng(user.last_coord)
                        object.marker._icon.classList?.remove('fms-hidden')
                  } else {
                    object.marker._icon.classList.add('fms-hidden')
                  }

                }
            }
        });
  });



  if ((data.length - 1) != multipleMarkers.length) {
      // Update mutlipleMarkers object with new data
      // Find what user does not exists first.
      const getAllUids = (array) => array.map(item => item.uid);

      // Get UIDs from objWithTwoLists and objWithFourLists
      const protMutliple = new Set(getAllUids(multipleMarkers)); // Convert to Set
      const protData = data; // No transformation; just use as-is

      // Filter items in objWithFourLists that are not in objWithTwoLists
      const missingItems = protData.filter(item => !protMutliple.has(item.id));

      missingItems.forEach((item, i) => {

        if (item.id != uid) {
            // Do not modify yourself, you exist in another function
            //console.log(item)
            let userfix = { f: item?.username.split(" ")[0][0], l: item?.username.split(" ")[1][0] }
            // Reduce username to initials
            // Create a brand new marker, this is the ONLOAD function
            let dateSub = Math.floor(Date.now() / 1000) - item.last_known
            let hideStatus = (dateSub < 300) ? "" : "fms-hidden"
            if (!item.last_coord) {item.last_coord = [58.709738298193585,13.840351402759554]}
            gpsMarker = L.marker(item.last_coord, { icon: L.divIcon({
              html: `${userfix.f + userfix.l}`, // FontAwesome icon
              iconSize: [18, 36], // Size of the icon
              className: `GPS-user-tracker ${hideStatus}`,
              popupAnchor: [0, 6], // Position of the popup,
              iconAnchor: [15, 30]
            })
          }).addTo(map);

          // Push onload data to a global object
          multipleMarkers.push({
            uid: item.id,
            username: item.username,
            last_known: item.last_known,
            last_coord: item.last_coord,
            marker: gpsMarker
          })
        }

      });


      //console.log("mia", missingItems);
      //console.log("Object not matching")
      //console.log(multipleMarkers, data)

      //drawMultipleUsers(data)
  }
}
const drawMultipleUsers = (data) => {
  let uid = USER_INFO.id
  data.forEach((user, index) => {
    // Loop through new incoming data
    if (user.id != uid) {
      // Do not modify yourself, you exist in another function
      let userfix = { f: user.username.split(" ")[0][0], l: user.username.split(" ")[1][0] }
      // Reduce username to initials
      // Create a brand new marker, this is the ONLOAD function
      let dateSub = Math.floor(Date.now() / 1000) - user.last_known
      let hideStatus = (dateSub < 3000) ? "" : "fms-hidden"
      let userLastCoord = user.last_coord ?? [58.0323039, 12.8089764]
      gpsMarker = L.marker(userLastCoord, { icon: L.divIcon({
        html: `${userfix.f + userfix.l}`, // FontAwesome icon
        iconSize: [18, 36], // Size of the icon
        className: `GPS-user-tracker ${hideStatus}`,
        popupAnchor: [30, 6], // Position of the popup
        iconAnchor: [15, 30]
      })
    }).addTo(map);
    // Push onload data to a global object
    multipleMarkers.push({
      uid: user.id,
      username: user.username,
      last_known: user.last_known,
      last_coord: userLastCoord,
      marker: gpsMarker
    })

    }

  });

}
const drawLines_done = () => {
  // Loop through points and create polylines for each group
  const colorObj = {
    "big": "green",
    "small": "green",
    "small_2": "green"
  }

    const objectGroup = L.layerGroup()
    MAPS_DATA.forEach((item, i) => {

    let key = Object.keys(item)[0]

    compounds = item[key].compounds
    Object.entries(compounds).forEach((data, index) => {
          blocks = data[1].data_lines

          if (blocks) {
            Object.entries(blocks).forEach((block, i) => {
              let custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
              let customWidth = (block[1].type === "small") ? 0.8 : 1

              const sessionClassName = `${data[1].desc.split(' ').join('')}-line`
              const lines = block[1].coords
              const polyline = L.polyline(lines, {
                color: colorObj[block[1].type], // Set the color from the group data
                weight: 7,//getLineWeight(map.getZoom() * customWidth), // Set initial weight
                className: `fms-line ${block[1].work_type} ${custClass} ${sessionClassName}`
              }).addTo(objectGroup);

              if (GLOBAL_PARAMETER.length > 0 && GLOBAL_PARAMETER == '?m=editor') {
                  // User is in editor / debugg mode
                  polyline.bindPopup(`data_line #:${i}`)
              }
            });
          }
    })
  });
  objectGroup.addTo(map)
}




/* ======== Multi / Single ======== */


const drawLines = () => {

  const LINE_STYLE = {
    big: {
      color: "#df2e20",
      weight: 7,
      opacity: 0.9
    },
    small: {
      color: "#fe9700",
      weight: 5,
      opacity: 0.85
    },
    small_2: {
      color: "#fe9700",
      weight: 5,
      opacity: 0.85
    }
  };

  const objectGroup = L.layerGroup();
  const zoom = map.getZoom();
  const isHidden = zoom < 16;

  // clear registry if redrawing
  lineReg.clear();

  for (let i = 0; i < MAPS_DATA.length; i++) {
    const item = MAPS_DATA[i];
    const key = Object.keys(item)[0];
    const compounds = item[key]?.compounds;

    if (!compounds) continue;

    for (const compKey in compounds) {
      const compound = compounds[compKey];
      const blocks = compound?.data_lines;

      if (!blocks) continue;

      for (const blockKey in blocks) {
        const block = blocks[blockKey];

        const styleBase =
          LINE_STYLE[block.type] || LINE_STYLE.small;

        const id = `${compKey}-data_lines-${blockKey}-${block.type}`;
        //console.log(compound.desc)
        // =========================
        // 🔥 CORE LINE (interactive)
        // =========================
        const core = L.polyline(block.coords, {
          ...styleBase,
          lineCap: "round",
          lineJoin: "round",
          smoothFactor: 1.2,
          interactive: true,
          className: isHidden
          ? "fms-line fms-hidden fms-line-main"
          : "fms-line fms-line-main"
        });

        const glowOuter = L.polyline(block.coords, {
          color: styleBase.color,
          weight: styleBase.weight + 10,
          opacity: 0.08,
          lineCap: "round",
          lineJoin: "round",
          smoothFactor: 1.2,
          interactive: false
        });

        const glowMid = L.polyline(block.coords, {
          color: styleBase.color,
          weight: styleBase.weight + 5,
          opacity: 0.18,
          lineCap: "round",
          lineJoin: "round",
          smoothFactor: 1.2,
          interactive: false
        });

        // add to map
        glowOuter.addTo(objectGroup);
        glowMid.addTo(objectGroup);
        core.addTo(objectGroup);

        // =========================
        // metadata
        // =========================
        const bundle = {
          id,
          type: block.type,
          work_type: block.work_type,
          coords: block.coords,

          core,
          glowMid,
          glowOuter
        };

        core._meta = bundle;

        // =========================
        // registry
        // =========================
        lineReg.set(id, {
          id,
          meta: {
            area: compound.desc,
            type: "line"
          },

          core,
          glowMid,
          glowOuter
        });

        // editor debug
        if (GLOBAL_PARAMETER === "?m=editor") {
          core.bindPopup(`data_line: ${id}`);
        }

      //  console.log("DRAWN:", id);
      }
    }
  }

  objectGroup.addTo(map);

  return objectGroup;

};



function animateMarker(name, newLat, newLng, duration = 1000) {
    const obj = locationMarkers.get(name);
    if (!obj) return;

    if (obj.animationId) {
        cancelAnimationFrame(obj.animationId);
    }

    const marker = obj.marker;

    const start = marker.getLatLng();

    const startLat = start.lat;
    const startLng = start.lng;

    const startTime = performance.now();

    function frame(now) {
        let t = (now - startTime) / duration;

        if (t > 1) t = 1;

        // Smooth easing
        t = t * t * (3 - 2 * t);

        const lat = startLat + (newLat - startLat) * t;
        const lng = startLng + (newLng - startLng) * t;

        marker.setLatLng([lat, lng]);

        if (t < 1) {
            obj.animationId = requestAnimationFrame(frame);
        }
    }

    obj.animationId = requestAnimationFrame(frame);
}
/*
  Coming from init_fetchUserMaps() in /_assign.js

*/
/*
const users = [
  {
    name: "Ludwig Eriksson",
    lat: 57.7089,
    lng: 11.9746
  },
  {
    name: "Anna Svensson",
    lat: 57.706729553476805,
    lng: 11.97413742542267
  }
];

let index = 1;

setInterval(() => {
    if (index >= annaPath.length) return;

    const [lat, lng] = annaPath[index];

    animateMarker("Anna Svensson", lat, lng, 1000);

    index++;
}, 1000);
const annaPath = [
    [57.706729553476805, 11.97413742542267],
    [57.706571925510474, 11.973059177398683],
    [57.706440090684424, 11.972176730632784],
    [57.706428626763845, 11.97210967540741],
    [57.706514606079864, 11.972085535526277],
    [57.70670232687709, 11.971983611583711],
    [57.70698605570074, 11.971844136714935],
    [57.70701758098834, 11.971828043460848],
    [57.70703334362188, 11.97197288274765],
    [57.70711502261292, 11.972474455833437],
    [57.707136517053634, 11.972560286521913],
    [57.70718810365929, 11.97253614664078],
    [57.70724112314961, 11.97250932455063],
    [57.70727551412887, 11.972528100013735]
];
*/
const newDrawUsers = (data) => {
    const uid = USER_INFO.id;

    data.forEach((item) => {

        if (uid === item.id) return;
        if (!item.last_coord) return;

        const timeOffAllowance = 30000;
        const timeDifference = Math.floor(Date.now() / 1000) - item.last_known;
        const hideClass = timeDifference < timeOffAllowance ? "" : "fms-hidden";
        const userfl = `${item.username.split(' ')[0][0]}${item.username.split(' ')[1][0]}`
        const icon = L.divIcon({
            className: `gps-user-dot ${hideClass}`,
            html: `
            <div class="gpsNode">
            <span>${userfl}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="transparent" />
                    <path class="cir" fill="#fb4d4e" stroke="#ff8384" stroke-width="1.5" d="M12 2c4.87 0 9 4.033 9 8.926c0 4.97-4.197 8.459-8.073 10.83a1.89 1.89 0 0 1-1.854 0C7.203 19.363 3 15.915 3 10.927C3 6.033 7.13 2 12 2Z" />
                  </svg>
                </div>`,
            iconSize: [36, 36],
            iconAnchor: [36, 36]
        });

        const marker = L.marker(item.last_coord, {
            icon: icon
        }).addTo(map);

        marker.bindTooltip(item.username);

        locationMarkers.set(item.username, {
            marker,
            animationId: null
        });

    });

    console.log("newDrawUsers", data);
};
/*  Handles drawing your own GPS avatar */
const drawSelf = (data) => {
  console.log(data)
}

const drawBlocks = () => {
  const objectGroup = L.layerGroup();

  const zoom = map.getZoom();
  const isHidden = zoom < 16;

  // optional: clear previous blocks if redrawing
  if (!window.blockReg) window.blockReg = new Map();
  window.blockReg.clear();

  for (let i = 0; i < MAPS_DATA.length; i++) {
    const item = MAPS_DATA[i];
    const key = Object.keys(item)[0];
    const compounds = item[key]?.compounds;

    if (!compounds) continue;

    for (const compKey in compounds) {
      const compound = compounds[compKey];
      const blocks = compound?.data_blocks;

      if (!blocks) continue;

      for (const blockKey in blocks) {
        const block = blocks[blockKey];

        const coords = block.coords;

        const id = `${compKey}-data_blocks-${blockKey}`;

        const polygon = L.polygon(coords, {
          fillOpacity: 0.35,
          opacity: 0.9,
          weight: 2,
          className: isHidden
            ? "fms-blocks fms-hidden"
            : "fms-blocks"
        });

        polygon.addTo(objectGroup);

        // =========================
        // metadata (IMPORTANT)
        // =========================
        polygon._meta = {
          id,
          type: "blocks",
          area: compound.desc,
          coords
        };

        // =========================
        // registry
        // =========================
        window.blockReg.set(id, {
          id,
          polygon,
          meta: polygon._meta
        });

        // editor debug
        if (GLOBAL_PARAMETER === "?m=editor") {
          polygon.bindPopup(`data_blocks: ${id}`);
        }

      //console.log("BLOCK:", polygon._meta);
      }
    }
  }

  objectGroup.addTo(map);

  return objectGroup;
};
const drawHazardBlocks = () => {

  // Example coordinates for a polygon (5-6 points)
  // Loop through points and create polylines for each group
  const objectGroup = L.layerGroup()
  MAPS_DATA.forEach((item, i) => {
    console.log(item)
    let key = Object.keys(item)[0]
    compounds = item[key].compounds

    Object.entries(compounds).forEach((data, index) => {
          blocks = data[1].data_hazard_blocks

          if (blocks) {
            Object.entries(blocks).forEach((block, i) => {
              let custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
              const sessionClassName = `${data[1].desc.split(' ').join('')}-hazardblocks`
              const lines = block[1].coords
              const polygon = L.polygon(lines, {
                fillOpacity: 0.45,  // Transparency level of the fill
                className: `fms-hazard-blocks ${block[1].work_type} ${custClass} ${sessionClassName}`
              }).addTo(objectGroup);
              if (GLOBAL_PARAMETER.length > 0 && GLOBAL_PARAMETER == '?m=editor') {
                  // User is in editor / debugg mode
                  polygon.bindPopup(`data_hazard_blocks #:${i}`)
              }
            });
          }
    })
  });
  objectGroup.addTo(map)
}
const drawWarnings = () => {
  const MIN_ZOOM_FOR_WARNINGS = 15;

  // Create the marker cluster group
  const markerClusterGroup = L.markerClusterGroup({
    disableClusteringAtZoom: 16 // or 20, depending on your preference
  });
  // Build and add markers
  MAPS_DATA.forEach((item) => {
    let key = Object.keys(item)[0];
    const compounds = item[key].compounds;

    Object.entries(compounds).forEach((data) => {
      const blocks = data[1].data_warning;
      if (blocks) {
        Object.entries(blocks).forEach((block, i) => {
          const coords = block[1].coords;

          if (
            !coords ||
            (Array.isArray(coords) && (coords[0] == null || coords[1] == null)) ||
            (!Array.isArray(coords) && (!coords.lat || !coords.lng))
          ) {
            console.warn("Invalid coordinates for block:", block);
            return;
          }

          const custClass = (map.getZoom() < 16) ? "fms-hidden" : "";
          const sessionClassName = `${data[1].desc.split(' ').join('')}-stairs`;
          const typeIndex = block[1].type;

          const icon = L.divIcon({
            html: warningType[typeIndex].icon,
            iconSize: [24, 24],
            className: `fms-${typeIndex} ${custClass} ${sessionClassName}`,
            popupAnchor: [0, -12]
          });


          const marker = L.marker(coords, { icon });
          const popupText = GLOBAL_PARAMETER === '?m=editor'
            ? warningType[typeIndex].text + ` #${i}`
            : warningType[typeIndex].text;

          marker.bindPopup(popupText);
          markerClusterGroup.addLayer(marker);
        });
      }
    });
  });

  // Only add if we're within zoom threshold
  if (map.getZoom() >= MIN_ZOOM_FOR_WARNINGS) {
    markerClusterGroup.addTo(map);
  }

  // Attach zoom listener once
  map.off("zoomend.warningToggle").on("zoomend.warningToggle", () => {
    if (map.getZoom() < MIN_ZOOM_FOR_WARNINGS) {
      if (map.hasLayer(markerClusterGroup)) map.removeLayer(markerClusterGroup);
    } else {
      if (!map.hasLayer(markerClusterGroup)) map.addLayer(markerClusterGroup);
    }
  });
};
const drawWarnings_opt = () => {
  // Ensure map container exists
  const container = document.querySelector("#map");
  if (!container) {
    console.error("Map container (#map-container) not found.");
    return;
  }

  // Clear any previous SVGs or markers
  if (window.compoundGroups) {
    window.compoundGroups.clearLayers();
  }

  // Create a layer group to store all compounds' SVGs
  const compoundGroups = L.layerGroup().addTo(map);

  // Iterate over MAPS_DATA
  MAPS_DATA.forEach((item) => {
    const key = Object.keys(item)[0]; // e.g., "mariestad"
    const compounds = item[key].compounds;

    // Iterate over compounds
    Object.entries(compounds).forEach(([compoundKey, compound]) => {
      const blocks = compound.data_warning;

      if (blocks) {
        // Create an SVG layer for this compound (group of shapes)
        const svgLayer = L.svg();
        svgLayer.addTo(compoundGroups);

        // Access the SVG container for adding shapes
        const svg = svgLayer._container;

        // Iterate over blocks and add circles (or any shape) to the SVG
        Object.entries(blocks).forEach(([blockKey, block]) => {
          const coords = block.coords; // [longitude, latitude]
          const type = block.type;

          if (!coords || coords.length !== 2) {
            console.error("Invalid coordinates for block:", block);
            return;
          }

          const latLng = L.latLng(coords[1], coords[0]); // [latitude, longitude]

          // Create the circle element using Leaflet's L.circle()
          const circle = L.circle(latLng, {
            radius: 5, // Radius in meters (can adjust as needed)
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.6,
          }).addTo(compoundGroups);
          console.log('Circle added at', latLng)

          // Optionally bind a popup with the description
          circle.bindPopup(`Warning type: ${type}`);
        });
      }
    });
  });

  // Store the compoundGroups globally so we can clear it on next draw call
  window.compoundGroups = compoundGroups;
  compoundGroups.addTo(map)
}
const drawPerimiter = () => {

  // Example coordinates for a polygon (5-6 points)
  // Loop through points and create polylines for each group
  const objectGroup = L.layerGroup()
  MAPS_DATA.forEach((item, i) => {
    let key = Object.keys(item)[0]
    compounds = item[key].compounds
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
            let custClass = (map.getZoom() <= 11 || map.getZoom() >= 16) ? "fms-hidden" : ""
            const sessionClassName = `area-${data[1].desc.split(' ').join('')}`
            const icon = L.divIcon({
              className: "polygon-label",
              html: "",
              iconSize: [150, 150],
              iconAnchor: [40, 15]  // Center the icon
            });

            // Add a marker at the centroid using the DivIcon
            const marker = L.marker(centroid, { icon: icon }).addTo(objectGroup);


            /*
            ##
            # Attempt at making a status table that sits outside the perimiter to
            # simple check wether an action is completed or not - SCRAPPED
            # (Clunky and/or messy + decreases performance due to rendering)
            ##
            */
            /*
            if (data[1].notes) {
                const notesContent = data[1]?.notes
                custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
                let notesHtml = ""
                if (notesContent.text) {
                  for (i = 0; i < notesContent.text.length; i++) {
                    notesHtml += `<div class="fst-status">${notesContent.text[i]}</div>`
                  }
                }
                const tablePosition = data[1].notes.coords
                const statusTable = L.divIcon({
                  className: "fms-statusTable",
                  html: `<div class="fst-holder ${custClass}" style="background: #fff">${notesHtml}</div>`,
                })

                L.marker(tablePosition, {icon:statusTable}).addTo(map)

            }
            */


            marker.on('click', () => {
                map.setView(centroid, 18, {animate: true, duration: 1})
            })
          }
    })
  });
  objectGroup.addTo(map)
}
const drawCompounds = () => {

  // City compounds
  const objectGroup = L.layerGroup()
  MAPS_DATA.forEach((item, i) => {
      let key = Object.keys(item)[0]
      let city = key
      let coords = item[key].coords
      let areaAmount = Object.keys(item[key].compounds).length
      let custClass = (map.getZoom() >= 11) ? "fms-hidden" : ""
      // Draw div
      const icon = L.divIcon({
        className: "polygon-label-city",
        html: `<div class='city-label ${custClass}'>${city}<h3>${areaAmount} Föreningar</h3></div>`,  // You can also use custom text here
        iconSize: ["auto", "auto"],
        iconAnchor: [5, 5]  // Center the icon
      });

      const marker = L.marker(coords, {icon:icon}).addTo(objectGroup)

      marker.on('click', () => {
          map.setView(coords, 15, { animate: true, duration: 1 });
      })

  });
  objectGroup.addTo(map)
}

const drawStatusWrapper = () => {
  jsonData.forEach((item, i) => {

    //console.log(item)

  });

}
/*
  This is given a list with classnames to keep an eye on, if the zoom exceed a threshold-
  i.e 16, certain objects should be hidden.
  This was an easy fix to prevent clutter on the screen if you zoom out "too much"
*/
map.on('zoomend', () => {
  let zoom = map.getZoom()
  //console.log(zoom)
  if (zoom >= 16) {
    showForZoom(false)
  } else {
    // Hide small objects
    hideForZoom(false)
  }


  let citylabel = document.getElementsByClassName('city-label')
  let arealabel = document.getElementsByClassName('polygon-label')
  let statusHolders = document.getElementsByClassName('fms-statusDiv')

  // Change areaName to transp. bg if zoom is too great, then show them on high zoom

  console.log(zoom)

  if (zoom >= 16) {
    for (i = 0; i < statusHolders.length; i++){
      statusHolders[i].classList.remove('fms-area-transp')
    }
  } else {
    for (i = 0; i < statusHolders.length; i++){
      statusHolders[i].classList.add('fms-area-transp')
    }
  }

  if (zoom <= 11) {
    // Hide city button
    for (i = 0; i < citylabel.length; i++) {
      citylabel[i].classList.remove('fms-hidden')
    }
    for (i = 0; i < arealabel.length; i++){
      arealabel[i].classList.add('fms-hidden')
    }
  } else if (zoom >= 12){
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

  // * Late addition, add stairs too
  let stairs = document.getElementsByClassName('fms-stairs')
  for (i = 0; i < stairs.length; i++) {
      if (index == 0) {
          // Hide stairs
          stairs[i].classList.add('fms-type-hidden')
      }
      if (index == 1) {
          stairs[i].classList.remove('fms-type-hidden')
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
    let lat = position.coords.latitude
    let lng = position.coords.longitude
    let accuracy = position.coords.accuracy
    let newLatLng = L.latLng(lat, lng);
    clientPosition = [lat, lng]
    // Update the map's view to the new location (optional: add smooth transitions)
    // If the marker exists, update its position, otherwise create a new marker
    // Log the updated position to the console
    console.log("POOOOOSITION", position)
    if (accuracy > 0) {
        // Get average position from the last 5 positions
        avgPositions.push([lat, lng]);

        if (avgPositions.length > 5) {
            avgPositions.shift();
        }

        // Calculate average latitude and longitude
        const avgLat =
            avgPositions.reduce((sum, pos) => sum + pos[0], 0) /
            avgPositions.length;

        const avgLng =
            avgPositions.reduce((sum, pos) => sum + pos[1], 0) /
            avgPositions.length;

        const smoothPos = [avgLat, avgLng];

        // Update or create user's marker
        if (userMarker) {
            userMarker.setLatLng(smoothPos);
        } else {
            userMarker = L.marker(smoothPos, {
                icon: L.divIcon({
                    html: `
                    <svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" viewBox="0 0 24 24" id="userGPStrackDot">
                    	<path d="M0 0h24v24H0z" fill="none" />
                    	<path class="big_round_crosshair" fill="none" stroke="#cc0001" stroke-dasharray="54" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4c4.42 0 8 3.58 8 8c0 4.42 -3.58 8 -8 8c-4.42 0 -8 -3.58 -8 -8c0 -4.42 3.58 -8 8 -8Z">
                    		<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0" />
                    	</path>
                      <circle class="small_crosshair" cx="12" cy="12" fill="none">
                          <animate
                              id="crosshairAnimation"
                              attributeName="r"
                              begin="indefinite"
                              dur="0.2s"
                              to="4"
                              fill="freeze"
                          />
                      </circle>
                    	<path class="small_dots_crosshair" fill="none" stroke="#fb4d4e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v-2M20 12h2M12 20v2M4 12h-2" opacity="0">
                    		<set fill="freeze" attributeName="opacity" begin="0.7s" to="1" />
                    		<animate fill="freeze" attributeName="d" begin="0.7s" dur="0.2s" values="M12 4v0M20 12h0M12 20v0M4 12h0;M12 4v-2M20 12h2M12 20v2M4 12h-2" />
                    		<animateTransform attributeName="transform" begin="0.7s" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
                    	</path>
                    </svg>
                    `,
                    iconSize: [24, 24],
                    className: "GPS-tracker",
                    popupAnchor: [12, 12]
                })
            }).addTo(map);
        }

        // Follow the user's SMOOTHED position
        if (userIsFollowing) {
            map.panTo(smoothPos, map.getZoom(), {
                animate: true,
                duration: 1
            });
        }

        // Show GPS marker
        const gpsTracker = document.getElementsByClassName('GPS-tracker')[0];

        if (gpsTracker) {
            gpsTracker.classList.remove('gps-hidden');
        }
    }


    // Update client Database with new Date.now and coordinates
    const updateSupaDb_OLD = async () => {
        const {data, error} = await client
          .from('users')
          .update({
            last_known: Math.floor(Date.now() / 1000),
            last_coord: clientPosition
          })
          .eq('id', USER_INFO?.id)
        if (error) {
          //console.log("Update Error", error)
        } else {
          //console.log("Updated Succesfully, ", username.toLowerCase())
        }
    }

    const updateSupaDb = async () => {
      // Get all trail data
      const {data:userData, error:userError} = await client
        .from('session')
        .select('*')
        .eq('session_id', SESSIONDATA[0].session_id)
        .single()

        // Set users new position with timestamp
        userData.user_positions[USER_INFO.id][Math.floor(Date.now())] = clientPosition
        SESSIONDATA[0] = userData

        // Update session with new data
        const {data:updateData, error:updateError} = await client
          .from('session')
          .update({
            user_positions:userData.user_positions
          })
          .eq('session_id', SESSIONDATA[0].session_id)

    }
    const drawTrail_old = () => {
      let userData = SESSIONDATA[0].user_positions[USER_INFO.id];
      let entries = Object.entries(userData);

      const coordinates = entries
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([_, coord]) => coord);

      const total = coordinates.length;

      for (let i = 1; i < total; i++) {
        const t = i / (total - 1);

        const r = Math.floor(120 + 135 * t);
        const color = `rgb(${r}, 0, 0)`;

        const segment = [
          coordinates[i - 1],
          coordinates[i]
        ];

        L.polyline(segment, {
          color: "red",
          weight: 16,
          opacity: 0.08,
          lineCap: "round",
          lineJoin: "round"
        }).addTo(map);

        L.polyline(segment, {
          color,
          weight: 8,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round"
        }).addTo(map);
      }
    };
    const trailReg = new Map();
    let trailGroup = null;

    const drawTrail = () => {
      const userData = SESSIONDATA[0].user_positions[USER_INFO.id];
      if (!userData) return;

      // Remove previous trail
      if (trailGroup) {
        map.removeLayer(trailGroup);
      }

      trailReg.clear();
      trailGroup = L.layerGroup();

      const coordinates = Object.entries(userData)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([, coord]) => coord);

      const total = coordinates.length;

      for (let i = 1; i < total; i++) {
        const t = i / (total - 1);

        const r = Math.floor(120 + 135 * t);
        const color = `rgb(${r},0,0)`;

        const segment = [
          coordinates[i - 1],
          coordinates[i]
        ];

        // Glow
        const glow = L.polyline(segment, {
          color,
          weight: 16,
          opacity: 0.08,
          lineCap: "round",
          lineJoin: "round",
          smoothFactor: 1.2,
          interactive: false
        });

        // Core
        const core = L.polyline(segment, {
          color,
          weight: 8,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
          smoothFactor: 1.2,
          interactive: false
        });

        glow.addTo(trailGroup);
        core.addTo(trailGroup);

        trailReg.set(i, {
          glow,
          core,
          meta: {
            index: i,
            progress: t
          }
        });
      }

      trailGroup.addTo(map);
    };
    if (typeof SESSIONDATA !== 'undefined') {

      updateSupaDb()
      //drawTrail()

    }
    //updateSupaDb()
}
const navigatorInit = (_boolean) => {
  // Watch for geolocation updates
  console.log("NAVIGATOR INIT????????????")
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
                //location.reload()
            }
          },
          {
            enableHighAccuracy: true,  // Ensure the best possible accuracy
            timeout: 5000,             // Wait for 5 seconds before timing out
            maximumAge: 1000              // Disable cache
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
                document.querySelector('#userGPStrackDot').classList.add('activated')
                document.querySelector('#crosshairAnimation').beginElement()
                map.setView(userMarker.getLatLng(), map.getZoom(), { animate: true, duration: 1 });
                flagFromSetView = true
            } else {
                button.classList.remove('highlighted')
                document.querySelector('#userGPStrackDot').classList.remove('activated')
                flagFromSetView = false
            }
            if( buttonIndex > 1) { buttonIndex = 0 }
            buttonIndex++
        })
}

/*
  Handles "info" button and hamburger menu toggling (on/off)
*/
const mapZoomInput = (e) => {
  if (e.id == "plus") { map.setZoom(map.getZoom() + 1) }
  if (e.id == "minus") { map.setZoom(map.getZoom() - 1) }
}
const toggleTopMenu = () => {
  const domList = {

  }

  let larmIndex = 0
  let larmButton = document.getElementById('distressIcon')
      larmButton.addEventListener('click', (e) => {
        if (document.querySelector('.fms_layers').classList.contains('fms-override-show')) {
          // Hide layer box & btn
          document.getElementsByClassName('fms_layers')[0].classList.remove('fms-override-show') // box
          document.getElementById('hamb-layer').classList.remove('highlighted') // btn
        }


        if (larmIndex == 0) {

          document.getElementsByClassName('fms_alarm')[0].classList.remove('hidden')
          larmButton.classList.add('toggle')


        } else {
          document.getElementsByClassName('fms_alarm')[0].classList.add('hidden')
          larmButton.classList.remove('toggle')
        }
        larmIndex++
        if (larmIndex > 1) { larmIndex = 0 }
      })


  let layerIndex = 0
  let layerButton = document.getElementById('hamb-layer')
      layerButton.addEventListener('click', (e) => {
        if (!document.querySelector('.fms_alarm').classList.contains('hidden')) {
          // Hide distress box & btn
          document.getElementsByClassName('fms_alarm')[0].classList.add('hidden') // box
          document.getElementById('distressIcon').classList.remove('toggle') // btn
        }


        if (layerIndex == 0) {

          document.getElementsByClassName('fms_layers')[0].classList.add('fms-override-show')
          layerButton.classList.add('highlighted')
        } else {
          document.getElementsByClassName('fms_layers')[0].classList.remove('fms-override-show')
          layerButton.classList.remove('highlighted')
        }
        layerIndex++
        if (layerIndex > 1) { layerIndex = 0 }
      })


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
          document.getElementById('fms-menu').classList.add('fms-override-show')
          document.getElementById('hamb-menu').classList.add('hamb-visible')
      })

      let expIndex = 0
      if (document.getElementById('experimental-layer')) {
        let expButton = document.getElementById('experimental-layer')
        expButton.addEventListener('click', (e) => {
          if (expIndex == 0) {
            document.getElementsByClassName('fms_scenario')[0].classList.add('fms-override-show')
            expButton.classList.add('highlighted')
          } else {
            document.getElementsByClassName('fms_scenario')[0].classList.remove('fms-override-show')
            expButton.classList.remove('highlighted')
          }
          expIndex++
          if (expIndex > 1) { expIndex = 0 }
        })

      }

  let back = document.getElementById('hamb-back')
      back.addEventListener('click', (e) => {
          console.log(e)
          document.getElementById('fms-menu').classList.remove('fms-override-show')
          document.getElementById('hamb-menu').classList.remove('hamb-visible')
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
  //console.log(`gpsFetchStorage ${updateBool}`)
  org_number = JSON.parse(localStorage.getItem('affiliation')).org_number
  current_city = JSON.parse(localStorage.getItem('user_info')).maps[0]
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('org_number', org_number)
    .contains('maps', `["${current_city}"]`)


  if (error) {
    console.error("Error fetching users:", error);
  } else {
    // Display users in the HTML
    //console.log(`gpsFetchStorage ${updateBool} - Select data`)
    //console.log(data)
    if (!updateBool) {
      // No update boolean given, just draw them out
      //console.log("drawMultipleUsers")
      newDrawUsers(data)
      //drawMultipleUsers(data)
    } else {
      //console.log("updateMultipleusers")
      // Update existing users (add new if needed)
      //updateMultipleusers(data)
    }

  }

}
const gpsInsertStorage = () => {
  let user = JSON.parse(localStorage.getItem("loggedUser"))
  let currentDate = Date.now()
  let coordinate = clientPosition
}


const screenLock = async () => {
    try {
        if ('wakeLock' in navigator) {
            console.log("Attempting wakeLock")
            wakeLock = await navigator.wakeLock.request('screen');
            if (wakeLock) {
              console.log("wakeLock sucessful")
            }
            // Handle the release event
            wakeLock.addEventListener('release', () => {
                screenLock()
            });
        }
    } catch (err) {
        console.error(`Failed to request Wake Lock: ${err.message}`);
    }
}

const checkForSesssion = async (interval) => {
  //console.log(interval)
  let org = USER_INFO.org_number
  let city = USER_INFO.maps[0]
  const searchVariable = parseInt(formatDate())
  const { data, error } = await client
  .from('session')  // Replace 'users' with your table name
  .select('*')   // Get all columns
  .eq('session_id', searchVariable)
  .eq('city', city)
  .eq('org_number', org)


  if (error) {
    console.error("Error fetching users:", error);
  } else {
    // Display users in the HTML
    if (data.length > 0) {
          if (!localStorage.getItem(data[0].session_id)) {
              // Show prompt
              let html = `
                    <div class="session-confetti">
                    <div class="sc-content">
                    <h1>Ny Session</h1>
                    <p>En ny session har skapats av: '${data[0].created_by}'.<br>Vänligen gå till den nya sessionen istället.</p><br>
                    <a href="?s=${searchVariable}">
                    <button type="button" name="button">Ta mig dit!</button>
                    </a>
                    </div>
                    <div class="sc-blur"></div>
                    </div>
              `
              toggleLoadingDiv(t = false)
              let holder = document.getElementsByTagName('body')
              holder[0].insertAdjacentHTML('beforeend', html)
              // Cancel Interval
              clearInterval(interval)
          }

    }
  }
}
const exportReportButton = (e) => {
  selectReport = document.getElementsByClassName('pickReport')[0].value
  window.location.search = `?r=${selectReport}`
}
const toggleReportWindow = async (e) => {
  org_number = JSON.parse(localStorage.getItem('user_info')).org_number
  const {data, error} = await client
    .from('session')
    .select('*')
    .eq('org_number', org_number)
    .order('id', {ascending: false})

  if (error) {console.log("error fetching reports"); return false}
  let htmlData = ""
  //console.log(data)

  Object.entries(data).forEach((item, i) => {
      let id = item[1].session_id.toString()
      let len = id.length

      if (len == 7) { id = `0${id}`}

      let day = id.slice(0, 2)
      let month = id.slice(2, 4)
      let year = id.slice(4, 8)
      let rowHtml = `<option value="${item[1].session_id}">${new Date(item[1].session_id.slice(0, 4), item[1].session_id.slice(4, 6) - 1, item[1].session_id.slice(6, 8)).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}</option>`
      htmlData += rowHtml
  });

  for (const [i, row] of Object.entries(data)) {
    /*
    console.log(row)
    let id = row.session_id.toString()
    let day = id.slice(0, 2)
    let month = id.slice(2, 4)
    let year = id.slice(4, 8)
    let rowHtml = `<option value="${row.session_id}">${day}/${month}/${year}</option>`
    htmlData += rowHtml
    */
  }
  let html = `
  <div class="auth-screen reports" id="ldle3a">
  <i class="fa-solid fa-arrow-left" onclick="passwordResetReturn(this)"></i>
    <div class="auth-pick-user">
      <h1>... Välj rapport</h1>
      <span>Välj datumet för rapportern som ska exporteras.</span>
      <select class="pickReport">
        <option value="" default></option>
        ${htmlData}
      </select>
      <button type="submit" onclick="exportReportButton(this)">Exportera</button>
    </div>
    <img id="rb_white" src="img/logo.svg" alt="">
  </div>
  `
  let body = document.getElementsByTagName('body')[0]
  body.insertAdjacentHTML('beforeend', html)
}
const changePassword = async (e) => {
  let input = document.getElementsByClassName('inputChangePassword')[0].value
  if (input.length <= 6) {
      handleErrors({msg: ["För kort lösenord..", false]})
  } else {
      const {data, error} = await client.auth.updateUser({
        password: input
      })

      if (error) {
        handleErrors({msg: [error, false]})
      } else {
        console.log("Updated password!: ", input)
        handleErrors( {msg: ["Ditt lösenord är ändrat!", true]} )
        signOutUser(true)
      }
  }
}
const toggleUserCredentials = async (e) => {
  // Allow users to change their password
  // Their first password is a random one
  let html = `
  <div class="auth-screen reports" id="ldle3a">
    <i class="fa-solid fa-arrow-left" onclick="passwordResetReturn(this)"></i>
    <div class="auth-pick-user change">
      <h1>... Ändra lösenord</h1>
      <span>Var nog att välja ett svårt lösenord</span>
      <input type="password" class="inputChangePassword" minlength="6">
      <button type="submit" onclick="changePassword(this)">Verkställ</button>
    </div>
    <img id="rb_white" src="img/logo.svg" alt="">
  </div>
  `
  let body = document.getElementsByTagName('body')[0]
  body.insertAdjacentHTML('beforeend', html)
}


const createNewSesssion = async (e) => {
  // Updated - NOT FOR MULTIPLE
    // User wants to create a new session
  // Make sure there is not one already made.
  toggleLoadingDiv(t = true)
  let mapPick = null
  let org_number = USER_INFO.org_number
  let username = USER_INFO?.username
  let all_users = {}
  if (USER_INFO.maps.length > 1) {
      // Prompt user to pick one alternative.

  } else {
    mapPick = USER_INFO.maps[0]
  }

  const {data: userData, error: userError} = await client
    .from('users')
    .select('*')
    .eq('org_number', USER_INFO?.org_number)

    userData.forEach((user) => {
        all_users[user.id] = {}
    });



  const {data: baseMap, error: baseError} = await client
    .from('maps')
    .select('*')
    .eq('org_number', org_number)
    .eq('uri_name', mapPick)
    .single()

    if (baseError) { handleErrors(baseError); toggleLoadingDiv(t = false) }
    if (baseMap) {
        const {data: existingRow, error: existingError} = await client
          .from('session')
          .select('*')
          .eq('org_number', org_number)
          .eq('city', mapPick)
          .eq('session_id', new Date().toISOString().slice(0, 10).replaceAll('-', ''))

          if (existingError) {
              handleErrors(existingError)
              toggleLoadingDiv(t = false)
              return
          }

          if (existingRow.length > 0) {
              handleErrors({msg: "Session already exists"})
              toggleLoadingDiv(t = false)
              return
          } else {
              const {error: insertError} = await client
                .from('session')
                .insert({
                  data: baseMap.session_data,
                  org_number: org_number,
                  city: mapPick,
                  session_id: new Date().toISOString().slice(0, 10).replaceAll('-', ''),
                  created_at: Math.floor(Date.now() / 1000),
                  created_by: username,
                  user_positions: all_users
                })

                if (insertError) {
                    handleErrors(insertError)
                    toggleLoadingDiv(t = false)
                    return
                }
                toggleLoadingDiv(t = false)
                // Reload page to get new session
                location.reload()
          }
    }
}
// Updated - NOT FOR MULTIPLE

const fetchLastSessions = async () => {

  let org = USER_INFO.org_number
  let city = USER_INFO.maps[0]
  const {data, error} = await client
    .from('session')
    .select('*')
    .eq('org_number', org)
    .eq('city', city)
    .order('id', {ascending: false})
    .limit(5)

    if (error) {
      handleErrors(error)
      console.log("Error getting Menu Data")
    } else {
      let parent = document.getElementsByClassName('prev-sessionData')[0]
      Object.entries(data).forEach((item, i) => {
        let cstatus = ""
        let status = ""
        if (item[1].completed_at != null) {
            status = "Färdig"
            cstatus = "done"
        } else {
            status = "Pågående"
            cstatus = ""
        }

        let startTime = item[1].created_at
        let totTime = compareTwoUnixDates(item[1].created_at, item[1].completed_at)
        let endTime = (item[1].completed_at == null) ? "Pågår" : `${formatUnixToTime(item[1].completed_at)} | ${totTime}`

        let html = `
        <a href="?s=${item[1].session_id}" class="_prev-session-bar">
          <div class="session-bar" id="sd-${item[1].session_id}">
              <div id="sb-date">${new Date(item[1].session_id.slice(0, 4), item[1].session_id.slice(4, 6) - 1, item[1].session_id.slice(6, 8)).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div id="sb-status" class="${cstatus}">${status}</div>
              <div id="sb-time">${formatUnixToTime(startTime)} - ${endTime}</div>
          </div>
        </a>
        `

        parent.insertAdjacentHTML('beforeend', html)
      });

    }
}
// Updated - NOT FOR MULTIPLE

const momentChange = (e) => {
  let param = e.id
  location.search = location.search + `&moment=${param}`
}
const scenChange = (e) => {
  let param = e.id
  location.search = `?experimental=${param}`
}
const secenarioFetch = async (item) => {
  console.log(item)
  const {data, error} = await client
    .from('special')
    .select('*')
    .eq('name', item)
    .limit(1)

    if (error) {
        console.log(error)
    }

    if (data) {

      if (data[0].html) {
          let parent = document.getElementsByClassName('layer_select')[0]
              parent.insertAdjacentHTML('beforeend', data[0].html)


      }
    }

}
const scenarioUI = async () => {
  let special = USER_INFO.special
  console.log(special)
  special.forEach((item, i) => {
        secenarioFetch(item)
  });

}


const changeTileLayer = (e) => {
  localStorage.setItem('layer', e.dataset.layer)
  location.reload()
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
  console.log("init")
  tileLayers()                  // Draws the map(tile)
  localCookies()                // i.e lastknown position, tile settings, zoom
  setSettingsDom()              // Sets the DOM with the correct switches
  drawLines()                   // Draw lines that represent i.e roads
  drawBlocks()                  // Draw polygons to represent larger areas
  drawHazardBlocks()            // Draw dangerous/heads-up areas
  drawWarnings()                // Draws fontawesome icons as warnings or 'heads-up'
  //drawPerimiter()               // Draws resident perimiter
  drawCompounds()               // Draws the "blocks" with the description

  /*

    for contrast themees

  */
  document.body.dataset.layer = localStorage.getItem('layer') || 'ny'


  checkForSesssion(null)            // Looks for a new session created

  if (window.location.search.length < 5) {
    let sessionInt = setInterval(() => {
      checkForSesssion(sessionInt)
    }, 2500)
  }


  fetchLastSessions()           // Displays last sessions in "menu"

  toggleWorkTypes()             // Handles two states (daytime work / nighttime work)
  toggleTopMenu()               // Simple js to handle hamburger menu

  settingsEnableFunctions()     // Runs functions based on setting

  trackLocationView()           // Handles clicks on "centering" button
  navigatorInit()               // Initializes GPS for self
  //scenarioUI()                  // Handles custom scenarios navigation


}
