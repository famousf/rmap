let SESSIONDATA = null
let SESSIONCITY = ""
let SESSIONSTATS = [0,0]
let MARKERS = {}
let DISTRESS
//let USER_INFO = JSON.parse(localStorage.getItem('user_info'))
let username = null
const searchVariable = parseInt(window.location.search.substr(3))

/* Reactivate the bottom bar */
document.getElementsByClassName('bmb_flex')[0].classList.add('show')

/* Speed calculations */
const speedCalc = () => {
  const display = document.getElementById('speedometer')
  navigator.geolocation.watchPosition(
      (position) => {
          const {latitute, longitude, speed} = position.coords
          const latlng = [latitute, longitude]

          if (speed !== null) {
              const kmh = (speed * 3.6).toFixed(0)
              display.innerText = kmh
              console.log(kmh)
          } else {
              display.innerText = "-"
              console.log("Stationary")
          }
      },
      (error) => {
          console.log("Speed error", error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
      }
  )
}

const fetchSessions = async () => {

  org_number = JSON.parse(localStorage.getItem('affiliation')).org_number
  username = USER_INFO?.username
  email = USER_INFO?.email
  uid = USER_INFO?.id
  maps = USER_INFO?.maps

  const {data, error} = await client
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
  const {data, error} = await client
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

  const {error} = await client
    .from('reports')
    .insert({session_id: searchVariable, data:data})

    return {data, error, success: !error}

}
const updateReport = async (newData) => {

  const {data, error} = await client
    .from('reports')
    .update({data:newData})
    .eq('session_id', searchVariable)

    return {data, error, success: !error}
}
const updateCompletedDate = async () => {
  let org = USER_INFO.org_number
  let city = USER_INFO.maps[0]
  const {data, error} = await client
    .from('session')
    .select('*')
    .eq('session_id', searchVariable)
    .eq('org_number', org)
    .eq('city', city)
    .limit(1)

    if (data.length > 0) {
        if (data[0].completed_at == null) {
          const {error} = await client
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
    const {data, error} = await client
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
  let perc = SESSIONSTATS[0] + 1 / SESSIONSTATS[1] * 100
  let org_number = JSON.parse(localStorage.getItem('affiliation')).org_number
  let maps = USER_INFO?.maps

  const {error} = await client
    .from('session')
    .update({data:data, report:report, current_progress:SESSIONSTATS})
    .eq('session_id', searchVariable)
    .eq('org_number', org_number)
    .in('city', maps)

  if (!error) {
      //location.reload()
  }
}
const updateDbCurrent = (e) => {
  console.log("updateDbCurrent")
  e = e.querySelector('button')
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
    //console.log("** UPDATE", update)
    let parent = document.getElementsByClassName(`obj-${areaName}`)[0]
    let children = parent.querySelectorAll('div')
    let totalMax = 0
    let totalCur = 0
    //console.log("Update UI for:", areaName)
    children.forEach((item, i) => {



        // NEW UPDATE UI
        let wrap = item.querySelector('span') // Span ELEMENT containing vägar/handskottning etc
        let name = wrap.innerText.toLowerCase() // the spans text value

        let type = status[name]
        let max = status[name].max
        let current = status[name].current

        let currentStatus = wrap.parentElement.classList


        totalMax += status[name].max
        totalCur += status[name].current
      //console.log(currentStatus)

        if (current == max) {
            if (!item.classList.contains('completed')) {

                item.classList.remove('started')
                item.classList.add('completed')
                //console.log("Update  to completed", item.id)
                // Set areaname to completed
            }
        }

        if (current == 1) {
            if (!item.classList.contains('started')) {

                item.classList.add('started')
                item.classList.remove(name.replace(/ /g, ''))
                //console.log("Update to started", item.id)


            }
        }

        /*         */

        /*
        let title = item.querySelector('span').innerText.toLowerCase()
        let button = item.querySelector('button')
        // Replace current DOM with following §

        // DOM Elements
        //console.log(title, button, max, current)
        if (current == max) {
            // New DOM should be 'greened' out and remove eventListener
            button.innerText = `Färdig`
            button.removeAttribute('onclick')
            //button.classList.add('completed')
            button.parentElement.classList.add('completed')

        } else {
            // Just update the progress
            button.innerText = `Påbörjad`
        }

        //console.log(areaName, title, status[title], button)
        */
    });


    // Update areaName badge
    let progress = Math.trunc(totalCur / totalMax * 100)
    if (progress >= 100) {
      parent.querySelector('h1').classList.add('completed')
      parent.querySelector('h1').innerText = `${areaName}`

    } else if (progress > 0) {
      parent.querySelector('h1').classList.add('started')
      parent.querySelector('h1').innerText = `${areaName} | ${progress}%`
    }


    drawStatusVisibility()

    //console.log(parent, children)

    //console.log("THE %", areaName, totalCur, totalMax, Math.trunc(totalCur / totalMax * 100))


  } else {
    // Create new drawing of data
    let max = 0
    let current = 0
    let buttons = ""
    Object.entries(status).forEach((item, i) => {
      if (item[0] != "statusHolder") {

        max += item[1].max
        current += item[1].current

        if (item[1].current == item[1].max && item[1].current > 0) { // 2 /2
            buttons += `
            <div id="${pureName}" class="completed">
            <span class="${item[0].replace(/ /g, '')}">${item[0]}</span>
            <button id="${item[0]}" class="completed">Färdig</button>
            </div>
            `
        } else if (item[1].current == 1) { // (1 / 2
            buttons += `
            <div id="${pureName}" class="started" onclick="updateDbCurrent(this)">
            <span class="${item[0].replace(/ /g, '')}">${item[0]}</span>
            <button id="${item[0]}">Påbörjad</button>
            </div>
            `
        }   else {
            buttons += `
            <div id="${pureName}" class="${item[0].replace(/ /g, '')}" onclick="updateDbCurrent(this)">
            <span class="${item[0].replace(/ /g, '')}">${item[0]}</span>
            <button id="${item[0]}"></button>
            </div>
            `
        }

      }
    });

    let custClass = (map.getZoom() <= 15) ? "fms-area-transp" : ""


    /*

      new % areaName

    */
    let progressHtml = ''
    let progressTrigger = ''
    let currentProgress = Math.trunc(current / max * 100)
    if (currentProgress > 0) {
        // Add label to areaname
        progressTrigger = currentProgress >= 100 ? 'completed' : 'started'

    }

    const statusDiv = L.divIcon({
      className: `fms-statusDiv ${custClass}`,
      html: `<div class="fms-stChild obj-${areaName}">
              ${progressHtml}
              <h1 onclick="expandStatusElement(this)" class="${progressTrigger}">${pureName} ${(currentProgress < 100 && currentProgress > 0) ? ' | ' +currentProgress + '%' : ''}</h1>
              ${buttons}
            </div>`,
      iconAnchor: [150, 0]
    })

    L.marker(coords, {icon:statusDiv}).addTo(map)

    //console.log(currentProgress)
    //console.log("SJKDASJDKAJSD", status)
  }



}
const expandStatusElement = (e) => {
  // Start by getting localStorage if the settings
  settings = localStorage.getItem('areaNamesUI') ? JSON.parse(localStorage.getItem('areaNamesUI')) : []

  //console.log("--asd", settings)
  let divs = e.parentElement.querySelectorAll('div')
  let id = divs[0].id
  if (divs[0].classList.contains('visible')) {
    // SET LOCALSTORAGE
    settings.pop(id)
    //console.log("REMOVE", id, settings)
    localStorage.setItem('areaNamesUI', JSON.stringify(settings))
    // hide them all
    divs.forEach((item) => {
        item.classList.remove('visible')
    });
  } else {
    // SET LOCALSTORAGE
    settings.push(id)
    //console.log("ADD: ", id, settings)
    localStorage.setItem('areaNamesUI', JSON.stringify(settings))

    // show them all
    divs.forEach((item) => {
        item.classList.add('visible')
    });

  }
}
// ------------ //
const drawVisialChanges_new = (area, type, progress) => {
  let definition = {
    "vägar": "line",
    "stora ytor": "blocks",
    "dubbdäck":"hazardblocks"
  }
  if (type[0] != "statusHolder") {
      type = definition[type[0]]
      if (type == "line") {

        //console.log(area, type)
        //console.log(type[0])
        const coreLines = [...lineReg.values()]
        .filter(l => l.meta.area === area && l.meta.type === type);

        let col = progress >= 2 ? "#36cd32" : "#eaca00"
        coreLines.forEach(line => {
          //console.log(line)
          line.core.setStyle({ color: col });

          line.glowMid.setStyle({
            color: col,
            opacity: 0.15
          });

          line.glowOuter.setStyle({
            color: col,
            opacity: 0.06
          });
        });
      }
      if (type == "blocks") {

      //  console.log(area, type)
        //console.log(type[0])
        const coreLines = [...window.blockReg.values()]
        .filter(l => l.meta.area === area && l.meta.type === type);

        let col = progress >= 2 ? "#36cd32" : "#eaca00"
        //console.log("uppdatera block", area, type, coreLines)
        coreLines.forEach(line => {
          //console.log(line)
          line.polygon.setStyle({ color: col });

        });
      }
  }
}
const drawVisialChanges = (data) => {
  console.log(data)
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
const formatDuration = (startTs, endTs) => {
  const diffSeconds = endTs - startTs;

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
const drawStatusBar = (data) => {
  if (data) {
      if (data > 0) {
        document.querySelector('#workProgress').innerText = `${Math.round(data * 100) / 100}%`
      }
  }

}
const updateElapsedTime = () => {
  if (SESSIONDATA[0]?.created_at) {
      document.querySelector('#timeElapsed').innerText = formatDuration(SESSIONDATA[0].created_at, Math.floor(Date.now() / 1000))
  }
}
const reDrawData = async (data, update) => {
  //console.log("-------", data)


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

              drawVisialChanges_new(item[0], type, 1)
            //  console.log("---", areaName, type)
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
                drawVisialChanges_new(item[0], type, 2)
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
        //console.log(areaName, item)

        /*
          item[0] = Indexable area name i.e BRÅTEN 2, FREDSLUND


         */
        //drawVisialChanges([areaName, item[1]])



        /*
        if (areaStatus[0] == areaStatus[1] && areaStatus[0] > 0) {
          // Change compound name color
          setTimeout(() => {
            let p = document.getElementsByClassName(`area-${areaName}`)
            p[0].classList.add('session-completed')

          }, 200)

        }
        */

    });


    //console.log(jsonData)
}
const drawStatusVisibility = () => {
  settings = localStorage.getItem('areaNamesUI') ? JSON.parse(localStorage.getItem('areaNamesUI')) : []

  if (settings) {
      settings.forEach((item) => {


        let a = document.querySelector(`.obj-${item.replace(/ /g, '')}`)

        if (!a.querySelector('h1').classList.contains('completed')) {
            a.querySelectorAll('div').forEach((item) => {
                item.classList.add('visible')
            });
        } else {
          a.querySelector('h1').removeAttribute('onclick')
          a.querySelectorAll('div').forEach((item) => {
              item.classList.remove('visible')
          });
        }

      });

  }
}
const clearCompletedCheck = (e) => {
  let body = document.getElementsByClassName('session-confetti')[0]
      body.remove()
      location.reload()
}
const calculateStats = () => {
  let perc = SESSIONSTATS[0] / SESSIONSTATS[1] * 100
  // Send data to ui function
  drawStatusBar(perc)
  if (perc >= 100) {
        if (!localStorage.getItem(`${searchVariable}-done`) || localStorage.getItem(`${searchVariable}-done`) == null) {
          let html = `
          <div class="session-confetti">
            <div class="sc-content">
              <h1>Bra jobbat!</h1>
              <p>Alla moment verkar vara klarmarkerade!<br><strong>Ring dina kollegor för att säkerställa.</strong></p>
              <img src="img/shak.gif" alt="">
              <button type="button" name="button" onclick="clearCompletedCheck(this)">Jag åker inte bara hem!</button>
            </div>
            <div class="sc-blur"></div>
          </div>
          `
          let holder = document.getElementsByTagName('body')
          holder[0].insertAdjacentHTML('beforeend', html)
          localStorage.setItem(`${searchVariable}-done`, 'true')
    }

  // Set completed time in DB
  updateCompletedDate()
  }
}

const disableHelpUI = (e) => {
  let parent = document.querySelector('.call-for-help')
      parent.classList.remove('expanded')

}

const callForHelpUI = (e) => {
  let parent = document.querySelector('.call-for-help')

  if (parent.classList.contains('expanded')) {
      parent.classList.remove('expanded')
  } else {
      parent.classList.add('expanded')
  }
}
const callForHelp = async (e) => {
  distress = e.querySelector('span').innerText
  id = USER_INFO.id
  coord = USER_INFO.last_coord
  known = USER_INFO.last_known
  session = SESSIONDATA[0].session_id
  username = USER_INFO.username

  const {data, error} = await client
    .from('session')
    .select('*')
    .eq('session_id', session)
    .limit(1)

    if (data) {

        if(!data[0].call_for_help) { SESSIONDATA[0].call_for_help = [] }
        SESSIONDATA[0].call_for_help.push({
          "distress_id": Math.random().toString(16).slice(2),
          "username": username,
          "user": id,
          "last_known": known,
          "last_coord": coord,
          "cfh_date": Date.now(),
          "distress": distress,
          "completed": false
        })

      // Update database with new sessiondata
      const {data:d, error:e} = await client
        .from('session')
        .update({
          call_for_help:SESSIONDATA[0].call_for_help
        })
        .eq('session_id', SESSIONDATA[0].session_id)

        if (!e) {
            disableHelpUI('t')
        }
      }


}

const addDistressPin = (id, lat, lng, msg) => {
  const icon = L.divIcon({
    className: "fmsAlarmActive",
    html: `<i class="fa-solid fa-triangle-exclamation"></i>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -25]
  })

  const marker = L.marker([lat, lng], {
    icon: icon
  })
    .addTo(map)
    .bindPopup(msg)

  MARKERS[id] = marker
}

const visualizeCallHelp = () => {

  let data = SESSIONDATA[0].call_for_help
  let nowdate = Date.now()
  if (data) {
      data.forEach((item) => {


          // Handles notifications uptop

          if (Math.abs(item.cfh_date - nowdate) <= 6000) {
              console.log(item)
              let parent = document.querySelector('.assist-popup')
              console.log(parent, parent.innerHTML.length)
              if (parent.innerHTML == "") {
                  let body = `
                    <div class="ap-icon" data-id="${item.distress_id}">
                      <i class="fa-regular fa-bell"></i>
                    </div>
                    <div class="ap-msg">
                      <h1>${item.username}</h1>
                      <p>${item.distress}</p>
                  `

                  parent.insertAdjacentHTML('beforeend', body)
                  parent.classList.add('visible')
                  setInterval(() => {
                      parent.innerHTML = ''
                      parent.classList.remove('visible')
                  }, 10000)
              }


          }


          // Handles displaying icons on map where distress came from
          let pos = item.last_coord
          let id = item.distress_id


          // Check if already exists
          if (!MARKERS[id] && item.completed == false) {
            let distressMsg = `<span class="disstressSpan">${item.username}</span><h4 class="distressMsg">${item.distress}</h4>`
            addDistressPin(id, pos[0], pos[1], distressMsg)
          }

          // Check if someone should be deleted ?
          if (item.completed == true && MARKERS[id]) {
              // Exists but is completed
              map.removeLayer(MARKERS[id])
              delete MARKERS[id]
          }


      });

  }

}

const updateDistressCall = async (e) => {
  let el = e.parentElement.parentElement
  let distressId = e.parentElement.parentElement.dataset.id
  let session_id = SESSIONDATA[0].session_id

  if (el.classList.contains('klar')) {
      return
  }

  const {data, error} = await client
    .from('session')
    .select('call_for_help')
    .eq('session_id', session_id)
    .single()

    if (data) {

      const updatedCallForHelp = data.call_for_help.map(item => {
        if (item.distress_id === distressId) {
          return {
            ...item,
            completed: true
          };
        }
        return item;
      });

      const {error:updateErr} = await client
        .from('session')
        .update({
          call_for_help: updatedCallForHelp
        })
        .eq('session_id', session_id)

        if (!updateErr) {
            // Update visual for client
            el.classList.remove('aktiv')
            el.classList.add('klar')
            el.querySelector('.larm_status').innerText = "Klar"

        }

    }
}

const distressCamera = (coord, id) => {
  map.setView([coord[0], coord[1]], 17)
  MARKERS[id].openPopup()
  document.querySelector('.fms_alarm').classList.add('hidden')
}
const updateDistressVisuals = async () => {
  const {data, error} = await client
    .from('session')
    .select('call_for_help')
    .eq('session_id', SESSIONDATA[0].session_id)
    .single()


    // Compare if currently stored array matchen what we're pulling from DB
    // Starts as null on pageload
    const compare = JSON.stringify(DISTRESS) === JSON.stringify(data.call_for_help)
    if (!compare || DISTRESS == null) {
      DISTRESS = data.call_for_help
      // Visual updates

      let span = document.querySelector('.tn_alarm_amount')
      let parent = span.parentElement

      let incompleted = 0
      data.call_for_help.forEach((item) => {
        if (!item.completed) { incompleted++ }
      });






      // More than 0 call
      if (DISTRESS != null && DISTRESS.length != parseInt(span.innerText)) {
          span.classList.remove('hidden')

          if (incompleted > 0) {

              span.innerText = incompleted
              span.classList.remove('hidden')
              parent.classList.add('red')
          } else {
              span.classList.add('hidden')
              parent.classList.remove('red')
          }
      }



    }





    // Handles box data
    if (data && data.call_for_help?.length > 0) {
        let parent = document.querySelector('.fms_alarm')
        let html = ""
        data.call_for_help.forEach((item) => {
            let status = item.completed == false ? "aktiv" : "klar"
            let time = compareTwoUnixDates(item.cfh_date, Date.now())
            if (!document.querySelector(`div[data-id="${item.distress_id}"]`)) {
                html += `
                <div class="larm_wrap ${status}" data-id="${item.distress_id}" data-cfh="${item.cfh_date}">
                  <div class="larm_content" ${(status == "aktiv" ? "onclick=distressCamera("+JSON.stringify(item.last_coord)+','+JSON.stringify(item.distress_id)+")" : "")}>
                    <span>${item.username}</span>
                    <h1>${item.distress}</h1>
                  </div>
                  <div class="larm_time">
                    <span>${(time.length == 0) ? "Nu" : `${time}`}</span>
                  </div>
                  <div class="larm_status">
                    <span ${(status == "aktiv" ? 'onclick="updateDistressCall(this)"' : '')}>${status}</span>
                  </div>
                </div>
                `
            } else {
              let div = document.querySelector(`div[data-id="${item.distress_id}"]`)
              if (div.classList.contains('aktiv') && item.completed == true) {
                  // Update status
                  div.classList.remove('aktiv')
                  div.classList.add('klar')
                  div.querySelector('.larm_status').querySelector('span').innerText = 'klar'
              }
              // Does it need an update?
              // Compare div.larm_contents classlist with item data

            }




          let p = document.querySelector(`div[data-id="${item.distress_id}"]`)
          let c = p?.querySelectorAll('span')[1]
          if (c) { c.innerText = (time.length == 0) ? "Nu" : `${time}` }




        });

        parent.insertAdjacentHTML('afterbegin', html)


    }





    //const isTheSame = JSON.stringify(SESSIONDATA[0].call_for_help) === JSON.stringify(data.call_for_help)
    //console.log(SESSIONDATA[0].call_for_help, data.call_for_help)



    //SESSIONDATA[0].call_for_help = data.call_for_help

    //console.log(isTheSame)
}



sessionsMain().then(data => {
  if (data.length == 0) {
      // No data, tell it to the user
      window.location.search = '?'
      alert('Det fanns ingen session med det ID numret.')
  } else {
      // Set flag for this session id
      localStorage.setItem(data[0].session_id, true)
      console.log("**** DRAW STATUS")
      // Data exists, do something with i
      // Make sure an observer has checked the flag as true before executing this
      observeFlagState('f_flag', () => {
        updateElapsedTime()
        reDrawData(data, update = false)
        //speedCalc()
        calculateStats()
        drawStatusVisibility()            // If areaName should be visible or not

        updateDistressVisuals()           // Handles the "box" of larms and more detail about them?
        visualizeCallHelp()               // New call-for-help function, for notifications


        // Continue to update the data aswell
        setInterval(() => {
            SESSIONSTATS = [0,0]
            sessionsMain().then(newData => {
                updateElapsedTime()

                updateDistressVisuals()           // Handles the "box" of larms and more detail about them?
                visualizeCallHelp()               // New call-for-help function, for notifications

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
