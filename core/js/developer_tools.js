let ACTIONBAR_TOGGLE
let CURRENT_DEV_POS
let selfMarker = null
let routePoints = []
let previewLine = L.polyline([], {
    color: "gray",
    dashArray: "5,5"
}).addTo(map);
let routeLine = L.polyline([], {
    color: "blue",
    weight: 4
}).addTo(map);

document.getElementById("addPoint").addEventListener("click", () => {

    if (!CURRENT_DEV_POS) {
        console.log("No GPS position available");
        return;
    }

    // Save current GPS position
    const point = L.latLng(
        CURRENT_DEV_POS[0],
        CURRENT_DEV_POS[1]
    );
    console.log("route add")
    routePoints.push(point);
    console.log(point)
    // Update line
    routeLine.setLatLngs(routePoints);

    console.log("Added point:", point);
});
document.getElementById("confirmChanges").addEventListener('click', () => {
    // Prompt a window askin where to update this
    /*
    if (!MAPS_DATA) { return }

    let comp = Object.entries(MAPS_DATA[0].mariestad.compounds)
    let html = ''
    comp.forEach((item) => {
        desc = item[1].desc
        html += `<option value="${desc}">${desc}</option>`
    });

    let select = `
    <div class="selectCompounds">
      <select name="compounds">${html}</select>
    </div>`
    document.body.insertAdjacentHTML('beforeend', select)
    */


})
const updatePreviousLine = () => {
  if (routePoints.length === 0 || !currentDevPosition) return;

  previewLine.setLatLngs([
      routePoints[routePoints.length - 1],
      [
          currentDevPosition.lat,
          currentDevPosition.lng
      ]
  ]);
}
/* */
const devMap_drawUI = () => {
    /*
      DRAW ACTIONBAR
      1: Line
      2: Block
      3: Icons
      -
      4: Reset
      5: Confirm changes

      - Show what of the 3 is currently toggled (dont let user do anything without it)
    */

  document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.actionbar_toggle_item');
      if (!toggle) return;

      // Remove current toggle
      document.querySelector('.ab_toggled')?.classList.remove('ab_toggled');

      // Add new toggle
      toggle.classList.add('ab_toggled');

      ACTIONBAR_TOGGLE = toggle.id;
      console.log(ACTIONBAR_TOGGLE)
  });

  // Hide useless stuff
  document.querySelector('.fms-toggle_n').remove()
  document.querySelector('.fms-top-left').remove()


}
/* */
const drawSignalAccuracy = (position) => {
  let acc = position.coords.accuracy
  let flag = acc > 50 ? 'bad' : acc > 7 ? 'better' : 'stable';


  //document.querySelector('#signalAmount').parentElement.classList.remove('hidden')
  document.querySelector('#signalAmount').parentElement.classList.add(flag)
  document.querySelector('#signalAmount').innerText = `< ${Math.trunc(acc)}m`


}
/* */
const selfPosition = () => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.watchPosition(
    (positon) => {
      const latlng = [positon.coords.latitude, positon.coords.longitude];
      // global
      CURRENT_DEV_POS = latlng
      // Visualize when signal is "good" or stable
      drawSignalAccuracy(positon)

      if (!selfMarker) {
        // Create the marker the first time
        selfMarker = L.marker(latlng, {
          icon: L.divIcon({
            className: "",
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 21 21">
              	<path d="M0 0h21v21H0z" fill="none" />
              	<path fill="none" stroke="#fb4d4e" stroke-linecap="round" stroke-linejoin="round" d="m15.5 15.5l-10-10zm0-10l-10 10" />
              </svg>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(map);
      } else {
        // Move it on subsequent updates
        selfMarker.setLatLng(latlng);
      }
    },
    (err) => console.error(err),
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000
    }
  );
};

selfPosition()
devMap_drawUI()
