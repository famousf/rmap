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
  document.getElementsByClassName('api-email')[0].innerText = email


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
    const {data, error} = await client
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
      const {data, error} = await client
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
  console.log("Init Fetch")
  let result = await fetchUserLinks()
  let org = parseInt(result.org_number)
           setAffiliationData(org)
  let cities = result.maps
  const {data, error} = await client
    .from('maps')
    .select('*')
    .eq('org_number', 550)


  if (error) {
        handleErrors(error)
        return null
  } else {
        console.log(data, error)
        // Loop data from mapstable
        for (i = 0; i < data.length; i++) {
            // Loop users cities
            for(x = 0; x < cities.length; x++) {
                if (data[i].area == cities[x]) {
                    // Add this to global variable
                    console.log(data[i].area, cities[x])
                    MAPS_DATA.push(data[i].data)

                }
            }
        }
        // Send maps_data to the right function
        // "PGRST116"
        // MAPS_DATA <-
        // to handle drawing
        /*

            Cant fetch data here, if its empty and cannot return a good value;
            prompt user to logout to fix itself


        */

        if (data.length > 0) return MAPS_DATA

        // if user gets here, theres no data
        console.log("No data, prompt logout")
        signOutUser([])


  }
}

const checkForDev = () => {
  if (!USER_INFO.is_admin) return
  html = `
    <div class="bar setting" onclick="location.search = '?dev=map_dev'">
    <svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512">
      <path d="M0 0h448v512H0z" fill="none" />
      <path fill="currentColor" d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35s5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06M404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8M154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72l29.57-113.72h32.58z" />
    </svg>

      <h1>Redigera & skapa kartor</h1>
    </div>
  `
  document.querySelector('.menu-items-holder').insertAdjacentHTML('afterbegin', html)
  console.log("User is admin, give extra btn")
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
      checkForDev()
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
