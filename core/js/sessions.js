let SESSIONDATA = null
let SESSIONSTATS = [0,0]
const searchVariable = parseInt(window.location.search.substr(3))

const fetchSessions = async () => {
  const username = JSON.parse(localStorage.getItem('loggedUser'))[1].toLowerCase()

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
const sessionsMain = async () => {
  await fetchSessions()
  return SESSIONDATA
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

  pureGetData().then(data => {
      // Update the data then send it in. (Pray it not gonna bug out with handshakes)
      data[0].data[where][type].current += 1
      updateNewData(data[0].data)


  })


}
const createStatusDOM = (coords, areaName, pureName, status) => {

  let buttons = ""
  Object.entries(status).forEach((item, i) => {
    if (item[0] != "statusHolder") {
      console.log(item[1])
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
      if (localStorage.getItem(`${searchVariable}`)) {

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
