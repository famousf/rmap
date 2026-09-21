/*
  Misc functions to handle customized events such as getLineWeight, displayLatLngClick.
  - These functions are ran inside other functions to prevent reusing too much code
*/
const map = L.map('map')
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

    // Add OpenStreetMap as the default map layer
    let baseLayers = {
      "Open streets map": openStreetMap_DE,
      "open topo map": openTopoMap,
      "tf landscape": thunderforest_Landscape,
      "tf outdoors": thunderforest_Outdoors, // Satellite map layer
      "jawg matrix": jawg_Matrix,
      "Sattelit": esri_WorldImagery,
      "Eniro": eniroMap
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
    if (accuracy < 20) {
        // Get avg position from last 5 positions
        avgPositions.push([lat, lng])
        if (avgPositions.length > 5) {
            avgPositions.shift()
        }

        const avgLat = avgPositions.reduce((sum, pos) => sum + pos[0], 0) / avgPositions.length
        const avgLng = avgPositions.reduce((sum, pos) => sum + pos[1], 0) / avgPositions.length
        const smoothPos = [avgLat, avgLng]
        if (userMarker) {
          userMarker.setLatLng(smoothPos);
        } else {
          userMarker = L.marker(smoothPos, { icon: L.divIcon({
            html: '<i class="fa-regular fa-circle-dot"></i>', // FontAwesome icon
            iconSize: [24, 24], // Size of the icon
            className: "GPS-tracker",
            popupAnchor: [12, 12] // Position of the popup
          })}).addTo(map);
        }
        // Check if following mode is active and update map view accordingly
        if (userIsFollowing) {
          map.panTo(newLatLng, map.getZoom(), { animate: true, duration: 1 });
        }
        if (document.getElementsByClassName('GPS-tracker')[0]) {
          document.getElementsByClassName('GPS-tracker')[0].classList.remove('gps-hidden')
        }
    }


    // Update supabase Database with new Date.now and coordinates
    const updateSupaDb = async () => {
        const {data, error} = await supabase
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
const mapZoomInput = (e) => {
  if (e.id == "plus") { map.setZoom(map.getZoom() + 1) }
  if (e.id == "minus") { map.setZoom(map.getZoom() - 1) }
}
const toggleTopMenu = () => {
  console.log("asd")


  let layerIndex = 0
  let layerButton = document.getElementById('hamb-layer')
      layerButton.addEventListener('click', (e) => {
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
  const { data, error } = await supabase
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
      //console.log("drawMultipleUsers")
      drawMultipleUsers(data)
    } else {
      //console.log("updateMultipleusers")
      updateMultipleusers(data)
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
  let org = USER_INFO.org_number
  let city = USER_INFO.maps[0]
  const searchVariable = parseInt(formatDate())
  const { data, error } = await supabase
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
        clearInterval(interval)
    }
  }
}
const exportReportButton = (e) => {
  selectReport = document.getElementsByClassName('pickReport')[0].value
  window.location.search = `?r=${selectReport}`
}
const toggleReportWindow = async (e) => {
  org_number = JSON.parse(localStorage.getItem('user_info')).org_number
  const {data, error} = await supabase
    .from('session')
    .select('*')
    .eq('org_number', org_number)
    .order('id', {ascending: false})

  if (error) {console.log("error fetching reports"); return false}
  let htmlData = ""
  console.log(data)

  Object.entries(data).forEach((item, i) => {
      let id = item[1].session_id.toString()
      let len = id.length

      if (len == 7) { id = `0${id}`}

      let day = id.slice(0, 2)
      let month = id.slice(2, 4)
      let year = id.slice(4, 8)
      let rowHtml = `<option value="${item[1].session_id}">${day}/${month}/${year}</option>`
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
      const {data, error} = await supabase.auth.updateUser({
        password: input
      })

      if (error) {
        handleErrors({msg: [error, false]})
      } else {
        console.log("Updated password!: ", input)
        handleErrors( {msg: ["Ditt lösenord är ändrat!", true]} )
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


const initMap = () => {
  console.log("init")
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

  //drawHazardBlocks()            // Draw dangerous/heads-up areas
  //drawBlocks()                  // Draw polygons to represent larger areas
  //drawLines()                   // Draw lines that represent i.e roads
  //drawWarnings()                // Draws fontawesome icons as warnings or 'heads-up'
  //drawPerimiter()               // Draws resident perimiter
  //drawCompounds()               // Draws the "blocks" with the description

  //checkForSesssion(null)            // Looks for a new session created




  //fetchLastSessions()           // Displays last sessions in "menu"

  //toggleWorkTypes()             // Handles two states (daytime work / nighttime work)
  toggleTopMenu()               // Simple js to handle hamburger menu

  //settingsEnableFunctions()     // Runs functions based on setting

  //trackLocationView()           // Handles clicks on "centering" button
  //navigatorInit()               // Initializes GPS for self
  //scenarioUI()                  // Handles custom scenarios navigation

}
initMap()
