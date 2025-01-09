/*
  Handles all logic to handle fetching
  the correct data, map etc for the users
  depending on org, priveleges, ranks and
  the set work-area
*/
const drawUserProfile = () => {
  let userInfo = JSON.parse(localStorage.getItem('user_info'))
  let orgInfo = JSON.parse(localStorage.getItem('affiliation'))

  let username = userInfo?.username
  let id = userInfo?.id
  let email = userInfo?.email
  let org_number = userInfo?.org_number
  let maps = userInfo?.maps
  let tag = userInfo?.tags

  let company = orgInfo?.org_name
  let company_logo = orgInfo?.org_logo
  let company_number = orgInfo?.org_number


  // Populate DOM
  document.getElementsByClassName('api-username')[0].innerText = username
  document.getElementsByClassName('api-logo')[0].src = company_logo


  // handle cities
  let citiesDOM = document.getElementsByClassName('api-cities')[0]
  for (i in tag) {
      console.log(i)
      citiesDOM.insertAdjacentHTML(
        'beforeend',
        `<span class="tag ${tag[i]}">${i}</span>`
      )
  }
}
const setAffiliationData = async (org) => {
    const {data, error} = await supabase
      .from('organisation')
      .select('*')
      .eq('org_number', org)
      .single()

      //console.log(data)
      if (error) {
          handleErrors(error)
          return
      } else {
          localStorage.setItem('affiliation', JSON.stringify(data))
          return true
      }
}
const fetchUserLinks = async () => {
  if (USERID) {
      const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', USERID)
        .single()

        if (error) {
            handleErrors(error)
            return
        } else {
            return data
        }
  }
}
const init_fetchUserMaps = async () => {
  //console.log("Init Fetch")
  let result = await fetchUserLinks()
  let org = parseInt(result.org_number)
            setAffiliationData(org)
  let cities = result.maps
  const {data, error} = await supabase
    .from('maps')
    .select('*')
    .eq('org_number', org)

  if (error) {
        handleErrors(error)
        return null
  } else {

        // Loop data from mapstable
        for (i = 0; i < data.length; i++) {
            // Loop users cities
            for(x = 0; x < cities.length; x++) {
                if (data[i].name == cities[x]) {
                    // Add this to global variable
                    MAPS_DATA.push(data[i].data)
                }
            }
        }
        // Send maps_data to the right function
        // MAPS_DATA <-
        // to handle drawing

        return MAPS_DATA
  }
}

init_fetchUserMaps().then(bool => {
  if (bool) {
      // Send this data to drawing functions
      // Window Onload
      // Display user settings
      drawUserProfile()
      //console.log("drawUserProfile")
      // Init app
      initMap()
      screenLock()
      gpsFetchStorage(updateBool = false)   // Initial Load (i.e create markers instad of updating)
      if (document.getElementById('f_flag')) {
          document.getElementById('f_flag').setAttribute('data-state', 'true')
      }
      setInterval(() => {
        gpsFetchStorage(updateBool = true)  // Interval Load (updating existing markers and showing/hiding)

      }, 5000)
  }
})



document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
      if (!wakeLock || wakeLock.released == true) {
            screenLock()
      }
  }
})
















/*
function convertNumericKeysToStrings(obj) {
  if (Array.isArray(obj)) {
    // If it's an array, recursively process each element
    return obj.map(convertNumericKeysToStrings);
  } else if (typeof obj === "object" && obj !== null) {
    // If it's an object, process each key-value pair
    return Object.keys(obj).reduce((newObj, key) => {
      // Check if the key is numeric
      const newKey = isNaN(key) ? key : key.toString();

      // Recursively process the value
      newObj[newKey] = convertNumericKeysToStrings(obj[key]);

      return newObj;
    }, {});
  }
  // For non-objects and non-arrays, return as is
  return obj;
}
// Transform the data
const transformedData = convertNumericKeysToStrings(points);
*/
// Log the transformed data
//console.log(JSON.stringify(transformedData, null, 2));
