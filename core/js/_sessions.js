let SESSIONDATA = null
let SESSIONCITY = ""
let SESSIONSTATS = [0,0]
//let USER_INFO = JSON.parse(localStorage.getItem('user_info'))
let username = null
const searchVariable = parseInt(window.location.search.substr(3))

const fetchSessions = async () => {

  org_number = JSON.parse(localStorage.getItem('affiliation')).org_number
  username = USER_INFO?.username
  email = USER_INFO?.email
  uid = USER_INFO?.id
  maps = USER_INFO?.maps

  const {data, error} = await supabase
    .from('session')
    .select('*')
    .eq('session_id', searchVariable)
    .eq('org_number', org_number)
    .in('city', maps)

    if (error) {
        handleErrors(error)
    } else {
        SESSIONDATA = data
        SESSIONCITY = data[0].city
        localStorage.setItem('currentCity', data[0].city)
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
  let org = USER_INFO.org_number
  let city = USER_INFO.maps[0]
  const {data, error} = await supabase
    .from('session')
    .select('*')
    .eq('session_id', searchVariable)
    .eq('org_number', org)
    .eq('city', city)
    .limit(1)

    if (data.length > 0) {
        if (data[0].completed_at == null) {
          const {error} = await supabase
            .from('session')
            .update({completed_at: Math.round(Date.now() / 1000)})
            .eq('session_id', searchVariable)
            .eq('org_number', org)
            .eq('city', city)
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
    console.log("pureGetData")
    let org_number = JSON.parse(localStorage.getItem('affiliation')).org_number
    let maps = USER_INFO?.maps
    const {data, error} = await supabase
      .from('session')
      .select('*')
      .eq('session_id', searchVariable)
      .eq('org_number', org_number)
      .in('city', maps)

  if (data) {
      return data
  }
}
const updateNewData = async (data, report) => {
  console.log("updateNewData")
  let org_number = JSON.parse(localStorage.getItem('affiliation')).org_number
  let maps = USER_INFO?.maps
  const {error} = await supabase
    .from('session')
    .update({data:data, report:report})
    .eq('session_id', searchVariable)
    .eq('org_number', org_number)
    .in('city', maps)

  if (!error) {
    //location.reload()
  }
}
const updateDbCurrent = (e) => {
  console.log("updateDbCurrent")
  let type = e.id
  let where = e.parentNode.id
  //let user = JSON.parse(localStorage.getItem('loggedUser'))[1].toLowerCase()
  pureGetData().then(data => {
      // Create logic to handle double handshakes (where two users click the button simultanisaly)

      if (data[0].data[where][type].current < data[0].data[where][type].max) {
          // Makes sure that inputs dont go over maximum (i.e 3 / 2)
          data[0].data[where][type].current += 1

          // Update reports row
          if (data[0].report == null) { data[0].report = {} }
          let workType = (data[0].data[where][type].current == 1) ? "plogning" : "grusning"

          data[0].report[username] = data[0].report[username] || {}
          data[0].report[username][where] = data[0].report[username][where] || {}
          data[0].report[username][where][type] = data[0].report[username][where][type] || {}
          data[0].report[username][where][type][workType] = Math.floor(Date.now() / 1000)


          updateNewData(data[0].data, data[0].report)
      }


  })


}
const createStatusDOM = (coords, areaName, pureName, status, update) => {



  if (update) {
    // only update previous stuff
    /*
      Everything lives in 'status'
      Fetch each element and update the data from 'status' accordinly
      - This function used to blanket create a new DOm
    */
    let parent = document.getElementsByClassName(`obj-${areaName}`)[0]
    let children = parent.querySelectorAll('div')
    children.forEach((item, i) => {
        let title = item.querySelector('span').innerText.toLowerCase()
        let button = item.querySelector('button')
        // Replace current DOM with following §
        let max = status[title].max
        let current = status[title].current

        // DOM Elements

        if (current == max) {
            // New DOM should be 'greened' out and remove eventListener
            button.innerText = `Färdig ${current} / ${max}`
            button.removeAttribute('onclick')
            button.classList.add('completed')

        } else {
            // Just update the progress
            button.innerText = `${current} / ${max}`
        }

        //console.log(areaName, title, status[title], button)
    });



  } else {
    // Create new drawing of data
    console.log("createStatusDOM - draw new")
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



}
// ------------ //
const drawVisialChanges = (data) => {
  // Calculate how % left for that location
  // I.e 2 / 8 should display some change in the location to easily visualize someone has been there
  let percDetails = {0: "val0",25: "val25",50: "val50",75: "val75",100: "val100"}
  let percDom = ""
  let name = data[0]
  let list = Object.entries(data[1])
  let objList = {}
  objList[name] = {max:0, current:0}
  list.forEach((item, i) => {
      if (item[0] != "statusHolder") {
            objList[name].max += item[1].max
            objList[name].current += item[1].current
      }
  });

  let perc = Math.round(objList[name].current / objList[name].max * 100)

  if (perc >= 0) { percDom = percDetails[0] }
  if (perc >= 10) { percDom = percDetails[25] }
  if (perc >= 100) { percDom = percDetails[100] }

  //console.log(perc)
  document.getElementsByClassName(`area-${name}`)[0].classList.add(percDom)
  document.getElementsByClassName(`area-${name}`)[0].children[0].classList.remove('hidden')

  //console.log(document.getElementsByClassName(`area-${name}`)[0].children[0].classList)

  document.getElementsByClassName(`area-${name}`)[0].children[0].classList.add(percDom)
  document.getElementsByClassName(`area-${name}`)[0].children[0].innerText = `${perc}%`
}
const drawPercentageBar = (data) => {
  if (data) {
      if (data > 0) {
        let bar = document.getElementsByClassName('status-bar')[0]
        data = Math.round(data)
        bar.style.width = `${data}%`
        bar.innerText = `${data}%`
        //bar.styles.width = data

      }
  }
}
const reDrawData = async (data, update) => {
    console.log("reDrawData", update)
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
            if (type[1].current % type[1].max == 1) {
                // Half the job is done on this one. Change the colour of the paths
                let name = ""
                let multiple = null
                switch (type[0]) {
                  case "stora ytor":
                        name = `${areaName}-blocks`
                        break
                  case "vägar":
                        name = `${areaName}-line`
                        break
                  case "handskottning":
                        name = [`${areaName}-stairs`, `${areaName}-door`, `${areaName}-barrier`]
                        multiple = true
                        break
                  case "dubbdäck":
                        name = `${areaName}-hazardblocks`
                        break
                }
                if (multiple) {
                    // If stairs, doors and/or barriers exists
                    name.forEach((v, i) => {
                        if (v) {
                            let e = document.getElementsByClassName(v)
                            Object.entries(e).forEach((item, i) => {
                              item[1].classList.add('session-ongoing')
                            });
                        }
                    });

                } else {
                    // If only stairs exists
                    let e = document.getElementsByClassName(name)
                    Object.entries(e).forEach((item, i) => {
                      item[1].classList.add('session-ongoing')
                    });
                }
            }
            if (type[1].current == type[1].max) {
                let name = ""
                let multiple = null
                switch (type[0]) {
                  case "stora ytor":
                        name = `${areaName}-blocks`
                        break
                  case "vägar":
                        name = `${areaName}-line`
                        break
                  case "handskottning":
                        name = [`${areaName}-stairs`, `${areaName}-door`, `${areaName}-barrier`]
                        multiple = true
                        break
                  case "dubbdäck":
                        name = `${areaName}-hazardblocks`
                        break
                }

                if (multiple) {
                    // If stairs, doors and/or barriers exists
                    name.forEach((v, i) => {
                        if (v) {
                            let e = document.getElementsByClassName(v)
                            Object.entries(e).forEach((item, i) => {
                              item[1].classList.add('session-completed')
                            });
                        }
                    });

                } else {
                    // If only stairs exists
                    let e = document.getElementsByClassName(name)
                    Object.entries(e).forEach((item, i) => {
                      item[1].classList.add('session-completed')
                    });
                }

            }

        });
        let coords = item[1].statusHolder
        createStatusDOM(coords, areaName, item[0], item[1], update)
        drawVisialChanges([areaName, item[1]])
        if (areaStatus[0] == areaStatus[1] && areaStatus[0] > 0) {
          // Change compound name color
          setTimeout(() => {
            let p = document.getElementsByClassName(`area-${areaName}`)
            p[0].classList.add('session-completed')

          }, 200)

        }

    });


    //console.log(jsonData)
}
const clearCompletedCheck = (e) => {
  let body = document.getElementsByClassName('session-confetti')[0]
      body.remove()
      location.reload()
}
const calculateStats = () => {
  let perc = SESSIONSTATS[0] / SESSIONSTATS[1] * 100
  // Send data to ui function
  drawPercentageBar(perc)
  if (perc >= 100) {
        if (!localStorage.getItem(searchVariable) || localStorage.getItem(searchVariable) == null) {
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
}


sessionsMain().then(data => {
  if (data.length == 0) {
      // No data, tell it to the user
      window.location.search = '?'
      alert('Det fanns ingen session med det ID numret.')
  } else {
      // Data exists, do something with i
      // Make sure an observer has checked the flag as true before executing this
      observeFlagState('f_flag', () => {
        reDrawData(data, update = false)
        calculateStats()
        // Continue to update the data aswell
        setInterval(() => {
            SESSIONSTATS = [0,0]
            sessionsMain().then(newData => {
                if (dataCompare(data, newData) == false) {
                    // Update reDrawdata() with the new data§
                    reDrawData(newData, update = true)
                    calculateStats()
                    SESSIONDATA = newData
                    data = newData
                }

            })
        }, 3000)
      })
  }
})
