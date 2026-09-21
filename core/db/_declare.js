/*
  Define default variables to be changed later
*/
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
let avgPositions = []
let domClasses = [
  "fms-line",
  "fms-blocks",
  "fms-hazard-blocks",
  "fms-obstacle",
  "fms-stairs",
  "fms-headsup",
  "fms-snow",
  "fms-trash",
  "fst-holder",
  "fms-door",
  "fms-barrier"
]
let GLOBAL_PARAMETER = window.location.search
let GLOBAL_SETTINGS = null
let USERID = localStorage.getItem('at') ? JSON.parse(localStorage.getItem('at'))[0] : null
let USER_INFO = JSON.parse(localStorage.getItem('user_info'))
let MAPS_DATA = []
let AWAIT_FIX = false
