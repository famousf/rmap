let SESSIONDATA = null
let SESSIONSTATS = [0,0]
let username = null
const searchVariable = parseInt(window.location.search.substr(3))

const fetchSessions = async () => {
  username = JSON.parse(localStorage.getItem('loggedUser'))[1].toLowerCase()

  const {data, error} = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', searchVariable)
    .limit(1)

    if (error) {
      console.log("Error fetching", error)
    } else {
        SESSIONDATA = data
    }
}
const fetchReportData = async (param) => {
  const {data, error} = await supabase
    .from('reports')
    .select('*')
    .eq('session_id', searchVariable)
    .limit(1)

    if (error) {
      console.log("Reports error", error)
    } else {
      return data
    }
}
const sessionsMain = async () => {
  await fetchSessions()
  return SESSIONDATA
}
const createNewReport = async (data) => {

  const {error} = await supabase
    .from('reports')
    .insert({session_id: searchVariable, data:data})

    return {data, error, success: !error}

}
const updateReport = async (newData) => {

  const {data, error} = await supabase
    .from('reports')
    .update({data:newData})
    .eq('session_id', searchVariable)

    return {data, error, success: !error}
}
const updateCompletedDate = async () => {
  const {data, error} = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', searchVariable)
    .limit(1)

    if (data.length > 0) {
        if (data[0].completed_date == null) {
          const {error} = await supabase
            .from('sessions')
            .update({completed_date: Math.round(Date.now() / 1000)})
            .eq('session_id', searchVariable)
        }
    }

}
const dataCompare = (a, b) => {
  a = JSON.stringify(a)
  b = JSON.stringify(b)
  if (a == b) {
    return true
  } else {
    return false
  }
}
const pureGetData = async () => {
  const {data, error} = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', searchVariable)
    .limit(1)

  if (data) {
      return data
  }
}
const updateNewData = async (data) => {
  const {error} = await supabase
    .from('sessions')
    .update({data:data})
    .eq('session_id', searchVariable)

  if (!error) {
    location.reload()
  }
}
const updateDbCurrent = (e) => {

  let type = e.id
  let where = e.parentNode.id
  //let user = JSON.parse(localStorage.getItem('loggedUser'))[1].toLowerCase()
  pureGetData().then(data => {
      // Update the data then send it in. (Pray it not gonna bug out with handshakes)
      //console.log(data, type, where, username, data[0].data[where][type])
      data[0].data[where][type].current += 1
      updateNewData(data[0].data)
      // Update userReport db
      /* Example below
        "rasmus engqvist": {
          "mhus10": {
            "parkeringar": ["plogat", "10:30"],
            "parkeringar": ["grusat", "12:00"],

        }
      }
      */
      // Fetch reports data
      // - Parse it and add new data
      // - Post it to DB
      fetchReportData(searchVariable).then(reports => {
            let dataString = ""
            let dataPoint = data[0].data[where][type].current
            if (reports.length > 0) {
                  if (dataPoint == 1) {
                      // Plogning klart
                      dataString = "plogning"
                  }
                  if (dataPoint == 2) {
                      // Grusning klart
                      dataString = "grusning"
                  }

                  if (dataString.length > 0) {
                      // We did something, continue.
                      let baseData = reports[0].data
                      baseData[username] = baseData[username] || {}
                      baseData[username][where] = baseData[username][where] || {}
                      baseData[username][where][type] = baseData[username][where][type] || {}

                      baseData[username][where][type][dataString] = Math.floor(Date.now() / 1000)
                      updateReport(baseData).then(result => {
                        if (result.success) {
                            console.log("updateReport() - True")
                        }
                      })
                  }

            } else {
              // Insert new row with base-data
              let baseData = {
               "ludwig eriksson": {},
               "jenny östensson": {},
               "magnus edvinsson": {},
               "rasmus engqvist": {},
               "fredrik hallen": {},
               "fredrik östensson": {},
               "lukas larsson": {},
               "maja falk": {},
               "kim peter": {}
              }
              if (dataPoint == 1) {
                  // Plogning klart
                  dataString = "plogning"
              }
              if (dataPoint == 2) {
                  // Grusning klart
                  dataString = "grusning"
              }
              // ["plogning", Math.floor(Date.now() / 1000)]
              baseData[username][where] = {[type]: {[dataString]:Math.floor(Date.now() / 1000)}}
              createNewReport(baseData).then(data => {
                  if (data.success) {
                      console.log("createNewReport() - True")
                  }
              })
            }
      })
  })


}
const createStatusDOM = (coords, areaName, pureName, status) => {

  let buttons = ""
  Object.entries(status).forEach((item, i) => {
    if (item[0] != "statusHolder") {
      if (item[1].current == item[1].max && item[1].current > 0) {
          buttons += `
          <div id="${pureName}">
          <span>${item[0]}</span>
          <button id="${item[0]}" class="completed">Färdig 2/2</button>
          </div>
          `
      } else {
          buttons += `
          <div id="${pureName}">
          <span>${item[0]}</span>
          <button id="${item[0]}" onclick="updateDbCurrent(this)">${item[1].current} / ${item[1].max}</button>
          </div>
          `
      }

    }
  });

  let custClass = (map.getZoom() < 16) ? "fms-hidden" : ""
  const statusDiv = L.divIcon({
    className: `fms-statusDiv ${custClass}`,
    html: `<div class="fms-stChild obj-${areaName}">
            <h1>${pureName}</h1>
            ${buttons}
          </div>`,
    iconAnchor: [100, 0]
  })

  L.marker(coords, {icon:statusDiv}).addTo(map)

}
// ------------ //
const reDrawData = (data) => {
    objects = data[0].data
    Object.entries(objects).forEach((item, i) => {
        // Draw status-buttons here
        let areaName = item[0].split(' ').join('')
        let areaStatus = [0,0]


        Object.entries(item[1]).forEach((type, i) => {

            if (type[0] != "statusHolder") {

                SESSIONSTATS[1] += type[1].max
                SESSIONSTATS[0] += type[1].current

                areaStatus[1] += type[1].max
                areaStatus[0] += type[1].current

            }

            if (type[1].current == type[1].max) {
                let name = ""
                switch (type[0]) {
                  case "parkeringar":
                        name = `${areaName}-blocks`
                        break
                  case "vägar":
                        name = `${areaName}-line`
                        break
                  case "handskottning":
                        name = `${areaName}-stairs`
                        break
                  case "hazardblocks":
                        name = `${areaName}-hazardblocks`

                }
                let e = document.getElementsByClassName(name)
                Object.entries(e).forEach((item, i) => {
                      item[1].classList.add('session-completed')
                });

            }

        });
        let coords = item[1].statusHolder
        createStatusDOM(coords, areaName, item[0], item[1])

        if (areaStatus[0] == areaStatus[1] && areaStatus[0] > 0) {
          // Change compound name color
          let p = document.getElementsByClassName(`area-${areaName}`)
              p[0].classList.add('session-completed')

        }

    });


    //console.log(jsonData)
}
const clearCompletedCheck = (e) => {
  let body = document.getElementsByClassName('session-confetti')[0]
      body.remove()
}
const calculateStats = () => {
  let perc = SESSIONSTATS[0] / SESSIONSTATS[1] * 100
  if (perc >= 100) {
      if (!localStorage.getItem(`${searchVariable}`)) {

      } else {
          let html = `
          <div class="session-confetti">
            <div class="sc-content">
              <h1>Bra jobbat!</h1>
              <p>Alla moment verkar vara klarmarkerade!<br><strong>Ring dina kollegor för att säkerställa.</strong></p>
              <img src="img/shaka.gif" alt="">
              <button type="button" name="button" onclick="clearCompletedCheck(this)">Jag åker inte bara hem!</button>
            </div>
            <div class="sc-blur"></div>
          </div>
          `
          let holder = document.getElementsByTagName('body')
          holder[0].insertAdjacentHTML('beforeend', html)
          localStorage.setItem(`${searchVariable}`, 'true')
      }
  // Set completed time in DB
  updateCompletedDate()
  }
//  console.log(SESSIONSTATS[0] / SESSIONSTATS[1] * 100)
}


sessionsMain().then(data => {
  if (data.length == 0) {
      // No data, tell it to the user
      window.location.search = '?'
      alert('Det fanns ingen session med det ID numret.')
  } else {
      // Data exists, do something with it
      reDrawData(data)
      calculateStats()
      // Continue to update the data aswell
      setInterval(() => {
          SESSIONSTATS = [0,0]
          sessionsMain().then(newData => {
              if (dataCompare(data, newData) == false) {
                  // Update reDrawdata() with the new data§
                  reDrawData(newData)
                  calculateStats()
                  SESSIONDATA = newData
                  data = newData
              }

          })
      }, 10000)
  }
})
