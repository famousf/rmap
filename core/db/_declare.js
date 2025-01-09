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
