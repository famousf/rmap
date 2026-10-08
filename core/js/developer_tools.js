let ACTIONBAR_TOGGLE
let CURRENT_DEV_POS
let selfMarker = null
// Drwaing globals
let POINTS = []
let CLICK = 0
let LINE = null
let PREVIEW = null
let DRAWING = true
let POLYGON = null
const CLOSE_DISTANCE = 1; // meters
let BLOCK_CLICK_HANDLER = null;
let BLOCK_MOUSEMOVE_HANDLER = null;

let LINE_CLICK_HANDLER = null;
let LINE_MOUSEMOVE_HANDLER = null;

let ICON_CLICK_HANDLER = null;
let ICON_MOUSEMOVE_HANDLER = null;

let CLIENTDATA = []

document.getElementById("confirmChanges").addEventListener('click', (e) => {
    // Complete an object / drwaing, sends it to the list
    if(typeof COMPLETED != 'undefined') {
      const type = ACTIONBAR_TOGGLE === "pickBlock" ? "blocks" : ACTIONBAR_TOGGLE === "pickLine" ? "lines" : "icons"
      const measure = ACTIONBAR_TOGGLE === "pickBlock" ? "m³" : ACTIONBAR_TOGGLE === "pickLine" ? "m" : ""
      let segmentsTotal = 0
      if (typeof SEGMENTS != 'undefined') {
        SEGMENTS.forEach((i) => {
          segmentsTotal += i.distance
        });
      }

      const cl = [COMPLETED, segmentsTotal,measure, ACTIONBAR_TOGGLE];

      let compiledList = JSON.parse(
        localStorage.getItem('compiledListDev') || '[]'
      );

      compiledList.push(cl);

      localStorage.setItem(
        'compiledListDev',
        JSON.stringify(compiledList)
      );



      clearPreviousData()
      updateOperationHub()
      util.stopHandlers()
      util.start(type)



    }


})
document.getElementById("browseArea").addEventListener('click', async () => {

    const populate = await populateClientArea()

    const doc = `
        <div class="browseArea-picker">
            <h1>Välj förening/kund</h1>
            <div class="pick-table">
                ${populate}
            </div>
        </div>
    `
    document.body.insertAdjacentHTML('beforeend', doc)
})
const populateClientArea = async () => {
    const { data, error } = await client
        .from('maps')
        .select('*')
        .eq('org_number', 550)
        .single()

    if (error) {
        console.error(error)
        return ''
    }

    if (data) {
        let html = ''
        let klient = data.data.mariestad.compounds
        KLIENTDATA = data.data
        Object.entries(klient).forEach(([key, item]) => {
            html += `
                <div class="b" data-k="${item.desc}" onclick="selectClient(this)">
                    <span>${item.desc}</span>
                </div>
            `
        })

        return html
    }

    return ''
}
const updateOperationHub = () => {
  ls = JSON.parse(localStorage.getItem('compiledListDev'))
  if (ls) {

      let wrapper = document.querySelector('.operationHub').querySelector('.entries-wrapper')
      console.log(wrapper)

  }
}

const selectClient = (e) => {
  klient = e.dataset.k
  let compound = Object.values(KLIENTDATA.mariestad.compounds).find(item => item.desc === klient)
  localStorage.setItem('klientSelect', JSON.stringify(compound))
  updateSelectedClient(compound)
  createOperationHub()

}
const updateSelectedClient = (compound) => {

  // Hide ui and make changes first
  ls = JSON.parse(localStorage.getItem('klientSelect'))

  document.querySelector('.side-button').innerHTML = `<h4><span>Vald kund</span>${ls.desc}</h4>`
  document.querySelector('.browseArea-picker').remove()


  const getCenter = (c) => {
      return [
        coords.reduce((sum, c) => sum + c[0], 0) / coords.length,
        coords.reduce((sum, c) => sum + c[1], 0) / coords.length
    ]
  }

  let coords = ls.object_perimiter
  map.setView(getCenter(coords), 17)


}
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
const createOperationHub = () => {
  /*
    Create the "menu" that handles updating, viewing, hiding, removing etc.
    - Window that displays points, maybe sort by type? or toggle by type
    - View all, view one
    - Delete selected
    - Override with new
  */
  data = JSON.parse(localStorage.getItem('klientSelect'))
  for (const key in data) {
    console.log(key)
    console.log(data[key])
  }

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

      // Toggle work-type
      util.start(toggle.dataset.type)
      console.log(ACTIONBAR_TOGGLE)
  });

  // Hide useless stuff
  document.querySelector('.fms-toggle_n').remove()
  document.querySelector('.fms-top-left').remove()

  // Change cursor to thin crosshair
  document.body.classList.add('dev')

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
const cancelDrawing = () => {

    console.log('Drawing cancelled');

    if (LINE) {
        map.removeLayer(LINE);
        LINE = null;
    }

    if (PREVIEW) {
        map.removeLayer(PREVIEW);
        PREVIEW = null;
    }

    if (POLYGON) {
        map.removeLayer(POLYGON);
        POLYGON = null;
    }

    POINTS = [];
    CLICK = 0;
    DRAWING = true;
}
const clearPreviousData = () => {
  // Revert back to default corsshair
  document.body.id = ''
    if (LINE) {
        map.removeLayer(LINE);
        LINE = null;
    }

    if (PREVIEW) {
        map.removeLayer(PREVIEW);
        PREVIEW = null;
    }

    if (POLYGON) {
        map.removeLayer(POLYGON);
        POLYGON = null;
    }

    POINTS = [];
    CLICK = 0;
    DRAWING = true;
}
//selfPosition()
devMap_drawUI()




const util = {
    model: null,
    mode: null,
    BLOCK_CLICK_HANDLER: null, BLOCK_MOUSEMOVE_HANDLER: null,
    LINE_CLICK_HANDLER: null, LINE_MOUSEMOVE_HANDLER: null,
    ICON_CLICK_HANDLER: null, ICON_MOUSEMOVE_HANDLER: null,


    start(mode) {

        this.mode = mode
        if (mode === 'blocks') { this.blocks() }
        if (mode === 'lines') { this.lines() }
        if (mode === 'icons') { this.icons() }
        document.body.id = 'crosshair'

    },

    // -------------------------
    // Stop all handlers
    // -------------------------
    stopHandlers() {
        document.body.id = ''
        // Blocks
        if (this.BLOCK_CLICK_HANDLER) {
            map.off('click', this.BLOCK_CLICK_HANDLER);
            this.BLOCK_CLICK_HANDLER = null;
        }

        if (this.BLOCK_MOUSEMOVE_HANDLER) {
            map.off('mousemove', this.BLOCK_MOUSEMOVE_HANDLER);
            this.BLOCK_MOUSEMOVE_HANDLER = null;
        }


        // Lines
        if (this.LINE_CLICK_HANDLER) {
            map.off('click', this.LINE_CLICK_HANDLER);
            this.LINE_CLICK_HANDLER = null;
        }

        if (this.LINE_MOUSEMOVE_HANDLER) {
            map.off('mousemove', this.LINE_MOUSEMOVE_HANDLER);
            this.LINE_MOUSEMOVE_HANDLER = null;
        }


        // Icons
        if (this.ICON_CLICK_HANDLER) {
            map.off('click', this.ICON_CLICK_HANDLER);
            this.ICON_CLICK_HANDLER = null;
        }

        if (this.ICON_MOUSEMOVE_HANDLER) {
            map.off('mousemove', this.ICON_MOUSEMOVE_HANDLER);
            this.ICON_MOUSEMOVE_HANDLER = null;
        }
    },
    // -------------------------
    // Calculate polygon area
    // -------------------------

    calculateArea(points) {

        if (!points || points.length < 3) {
            return 0;
        }

        const earthRadius = 6378137; // meters

        let area = 0;

        for (let i = 0; i < points.length; i++) {

            const current = points[i];
            const next = points[(i + 1) % points.length];

            const lat1 = current.lat * Math.PI / 180;
            const lat2 = next.lat * Math.PI / 180;

            const lon1 = current.lng * Math.PI / 180;
            const lon2 = next.lng * Math.PI / 180;

            area +=
                (lon2 - lon1) *
                (2 + Math.sin(lat1) + Math.sin(lat2));
        }

        area =
            Math.abs(area) *
            earthRadius *
            earthRadius /
            2;

        return Number(area.toFixed(2));
    },

    blocks() {

        clearPreviousData();
        this.stopHandlers();

        console.log('block creation activated');

        DRAWING = true;
        POINTS = [];
        SEGMENTS = [];
        CLICK = 0;
        COMPLETED = []

        // Click handler
        this.BLOCK_CLICK_HANDLER = (e) => {

            // Ctrl + left click = cancel drawing
            if (e.originalEvent.ctrlKey) {
                cancelDrawing();
                return;
            }
            if (!DRAWING) return;

            const coords = e.latlng;
            // Check if closing shape
            if (POINTS.length >= 3) {

                const firstPoint = POINTS[0];
                const distanceToStart = map.distance(
                    coords,
                    firstPoint
                );

                if (distanceToStart <= CLOSE_DISTANCE) {
                    // Close the shape
                    POINTS.push(firstPoint);
                    if (LINE) {
                        LINE.setLatLngs(POINTS);
                    }

                    // Update polygon

                    if (POLYGON) {
                        POLYGON.setLatLngs(POINTS);
                    }

                    // Calculate area

                    const area = this.calculateArea(POINTS);

                    // Store area on line
                    if (LINE) {
                        LINE.area = area;
                    }

                    // Store area on polygon
                    if (POLYGON) {
                        POLYGON.area = area;
                    }

                    // Remove preview

                    if (PREVIEW) {
                        map.removeLayer(PREVIEW);
                        PREVIEW = null;
                    }
                    DRAWING = false;

                    // Output
                    console.log('Shape closed!');
                    console.log('Points:', POINTS);
                    console.log('Segments:', SEGMENTS);
                    console.log('Area:', area + ' m²');

                    return;
                }
            }


            // Calculate segment

            if (POINTS.length > 0) {

                const previousPoint = POINTS[POINTS.length - 1];

                const distance = map.distance(
                    previousPoint,
                    coords
                );
                const segment = {
                    from: previousPoint,
                    to: coords,
                    distance: Number(
                        distance.toFixed(2)
                    )
                };
                SEGMENTS.push(segment);
            }

            // Add clicked point
            POINTS.push(coords)
            COMPLETED.push([coords.lat, coords.lng])
            CLICK++;

            // Permanent line
            if (!LINE) {
                LINE = L.polyline(
                    POINTS,
                    {
                        color: '#3382f0',
                        weight: 2
                    }
                ).addTo(map);
                // Store segment information
                LINE.segments = SEGMENTS;
            } else {
                LINE.setLatLngs(POINTS);
            }
            console.log("Completed Perimiter:", COMPLETED)


            console.log(
                `Point ${CLICK}:`,
                coords
            );

            console.log(
                'Segments:',
                SEGMENTS
            );
            let segmentsTotal = 0
            SEGMENTS.forEach((i) => {
              segmentsTotal += i.distance
            });
            console.log("Total meter", segmentsTotal)

        };

        // Mousemove handler
        this.BLOCK_MOUSEMOVE_HANDLER = (e) => {

            if (!DRAWING || POINTS.length === 0) {
                return;
            }
            const mousePoint = e.latlng;

            const lastPoint = POINTS[POINTS.length - 1];
            // Preview line
            if (!PREVIEW) {
                PREVIEW = L.polyline(
                    [
                        lastPoint,
                        mousePoint
                    ],
                    {
                        color: '#3382f0',
                        weight: 2,
                        dashArray: '5, 5'
                    }
                ).addTo(map);
            } else {
                PREVIEW.setLatLngs([
                    lastPoint,
                    mousePoint
                ]);
            }
            // Live polygon
            if (POINTS.length >= 2) {
                const polygonPoints = [
                    ...POINTS,
                    mousePoint
                ];
                if (!POLYGON) {
                    POLYGON = L.polygon(
                        polygonPoints,
                        {
                            color: 'blue',
                            weight: 0,
                            fillColor: '#3382f0',
                            fillOpacity: 0.12
                        }
                    ).addTo(map);
                } else {

                    POLYGON.setLatLngs(
                        polygonPoints
                    );
                }
            }
        };
        // Attach handlers
        map.on( 'click', this.BLOCK_CLICK_HANDLER)
        map.on('mousemove',this.BLOCK_MOUSEMOVE_HANDLER)
    },
    lines() {

        clearPreviousData();
        this.stopHandlers();

        console.log('line creation activated');

        DRAWING = true;
        POINTS = [];
        SEGMENTS = [];
        CLICK = 0;
        COMPLETED = [];

        // Left click = add point
        this.LINE_CLICK_HANDLER = (e) => {

            if (!DRAWING) return;

            const coords = e.latlng;

            // Calculate segment
            if (POINTS.length > 0) {

                const previousPoint = POINTS[POINTS.length - 1];

                const distance = map.distance(
                    previousPoint,
                    coords
                );

                SEGMENTS.push({
                    from: previousPoint,
                    to: coords,
                    distance: Number(distance.toFixed(2))
                });
            }

            // Add point
            POINTS.push(coords);
            COMPLETED.push([coords.lat, coords.lng]);
            CLICK++;

            // Permanent line
            if (!LINE) {

                LINE = L.polyline(
                    POINTS,
                    {
                        color: '#3382f0',
                        weight: 2
                    }
                ).addTo(map);

                LINE.segments = SEGMENTS;

            } else {

                LINE.setLatLngs(POINTS);

            }

            // Update segments reference
            LINE.segments = SEGMENTS;

            const totalDistance = SEGMENTS.reduce(
                (total, segment) => total + segment.distance,
                0
            );

            console.log('Point:', coords);
            console.log('Segments:', SEGMENTS);
            console.log(
                'Total meter:',
                Number(totalDistance.toFixed(2))
            );
        };


        // Right click = finish drawing and KEEP the line
        this.LINE_CONTEXTMENU_HANDLER = (e) => {

            e.originalEvent.preventDefault();

            if (!DRAWING) return;

            console.log('Line drawing finished');

            DRAWING = false;

            // Remove preview only
            if (PREVIEW) {
                map.removeLayer(PREVIEW);
                PREVIEW = null;
            }

            // Keep the actual LINE on the map
            if (LINE) {
                LINE.setLatLngs(POINTS);
                LINE.segments = SEGMENTS;
            }

            // Remove handlers
            map.off(
                'click',
                this.LINE_CLICK_HANDLER
            );

            map.off(
                'mousemove',
                this.LINE_MOUSEMOVE_HANDLER
            );

            map.off(
                'contextmenu',
                this.LINE_CONTEXTMENU_HANDLER
            );

            console.log('Final points:', POINTS);
            console.log('Final segments:', SEGMENTS);
            console.log('Completed:', COMPLETED);
        };


        // Mousemove = preview next segment
        this.LINE_MOUSEMOVE_HANDLER = (e) => {

            if (!DRAWING || POINTS.length === 0) {
                return;
            }

            const mousePoint = e.latlng;
            const lastPoint = POINTS[POINTS.length - 1];

            if (!PREVIEW) {

                PREVIEW = L.polyline(
                    [
                        lastPoint,
                        mousePoint
                    ],
                    {
                        color: '#3382f0',
                        weight: 2,
                        dashArray: '5, 5'
                    }
                ).addTo(map);

            } else {

                PREVIEW.setLatLngs([
                    lastPoint,
                    mousePoint
                ]);

            }
        };


        // Attach handlers
        map.on(
            'click',
            this.LINE_CLICK_HANDLER
        );

        map.on(
            'mousemove',
            this.LINE_MOUSEMOVE_HANDLER
        );

        map.on(
            'contextmenu',
            this.LINE_CONTEXTMENU_HANDLER
        );
    },
    icons() {

    clearPreviousData();
    this.stopHandlers();

    console.log('icon placement activated');

    DRAWING = true;

    COMPLETED = [];
    ICON_MARKERS = [];


    // ----------------------------------------
    // HTML ICONS
    // ----------------------------------------

    const iconElements =
        document.querySelectorAll('.map-icon');


    iconElements.forEach((iconElement) => {

        iconElement.draggable = true;


        // ------------------------------------
        // DRAG START
        // ------------------------------------

        iconElement.addEventListener(
            'dragstart',
            (e) => {

                const icon =
                    iconElement.dataset.icon;

                e.dataTransfer.setData(
                    'application/map-icon',
                    icon
                );

            }
        );


        // ------------------------------------
        // CLICK = PLACE AT MAP CENTER
        // ------------------------------------

        iconElement.addEventListener(
            'click',
            () => {

                if (!DRAWING) return;

                this.createIcon(
                    iconElement.dataset.icon,
                    map.getCenter(),
                    true
                );

            }
        );

    });


    // ----------------------------------------
    // DRAG OVER MAP
    // ----------------------------------------

    this.ICON_DRAGOVER_HANDLER = (e) => {

        if (!DRAWING) return;

        e.preventDefault();

    };


    // ----------------------------------------
    // DROP ON MAP
    // ----------------------------------------

    this.ICON_DROP_HANDLER = (e) => {

        e.preventDefault();

        if (!DRAWING) return;


        const icon =
            e.dataTransfer.getData(
                'application/map-icon'
            );


        if (!icon) return;


        const rect =
            map.getContainer()
                .getBoundingClientRect();


        const point = L.point(
            e.clientX - rect.left,
            e.clientY - rect.top
        );


        const latlng =
            map.containerPointToLatLng(
                point
            );


        // Dropped = completed
        this.createIcon(
            icon,
            latlng,
            true
        );

    };


    // ----------------------------------------
    // RIGHT CLICK = STOP PLACEMENT
    // ----------------------------------------

    this.ICON_CONTEXTMENU_HANDLER = (e) => {

        e.preventDefault();

        if (!DRAWING) return;

        DRAWING = false;


        // Remove map listeners

        map.getContainer()
            .removeEventListener(
                'dragover',
                this.ICON_DRAGOVER_HANDLER
            );


        map.getContainer()
            .removeEventListener(
                'drop',
                this.ICON_DROP_HANDLER
            );


        map.off(
            'contextmenu',
            this.ICON_CONTEXTMENU_HANDLER
        );


        console.log(
            'Icon placement stopped'
        );

        console.log(
            'COMPLETED:',
            COMPLETED
        );

    };


    // ----------------------------------------
    // ATTACH MAP EVENTS
    // ----------------------------------------

    map.getContainer()
        .addEventListener(
            'dragover',
            this.ICON_DRAGOVER_HANDLER
        );


    map.getContainer()
        .addEventListener(
            'drop',
            this.ICON_DROP_HANDLER
        );


    map.on(
        'contextmenu',
        this.ICON_CONTEXTMENU_HANDLER
    );


    // ----------------------------------------
    // CREATE ICON
    // ----------------------------------------

    this.createIcon = (
        icon,
        latlng,
        completed = false
    ) => {


        // ------------------------------------
        // FIND HTML TEMPLATE
        // ------------------------------------

        const sourceIcon =
            document.querySelector(
                `.map-icon[data-icon="${icon}"]`
            );


        if (!sourceIcon) {

            console.warn(
                `No icon template found for "${icon}"`
            );

            return;

        }


        // ------------------------------------
        // COPY TEMPLATE HTML
        // ------------------------------------

        const iconHTML =
            sourceIcon.innerHTML;


        // ------------------------------------
        // CREATE LEAFLET ICON
        // ------------------------------------

        const leafletIcon =
            L.divIcon({

                className:
                    'custom-leaflet-icon',

                html: `
                    <div
                        class="map-icon-instance"
                        data-icon="${icon}"
                    >
                        ${iconHTML}
                    </div>
                `,

                iconSize: null,

                iconAnchor: null

            });


        // ------------------------------------
        // CREATE MARKER
        // ------------------------------------

        const marker =
            L.marker(
                latlng,
                {
                    icon: leafletIcon,
                    draggable: true
                }
            ).addTo(map);


        // ------------------------------------
        // STORE TYPE
        // ------------------------------------

        marker.iconType =
            icon;


        // ------------------------------------
        // STORE MARKER
        // ------------------------------------

        ICON_MARKERS.push(
            marker
        );


        // ------------------------------------
        // ONLY COMPLETE WHEN PLACED
        // ------------------------------------

        if (completed) {

            this.updateCompletedIcons();

        }


        // ------------------------------------
        // UPDATE AFTER MOVING
        // ------------------------------------

        marker.on(
            'dragend',
            () => {

                this.updateCompletedIcons();

                console.log(
                    'Icon moved:',
                    marker.iconType
                );

                console.log(
                    'Position:',
                    marker.getLatLng()
                );

                console.log(
                    'COMPLETED:',
                    COMPLETED
                );

            }
        );


        return marker;

    };


    // ----------------------------------------
    // UPDATE COMPLETED
    // ----------------------------------------

    this.updateCompletedIcons = () => {

        COMPLETED =
            ICON_MARKERS.map(
                (marker) => {

                    const position =
                        marker.getLatLng();


                    return {

                        icon:
                            marker.iconType,

                        lat:
                            position.lat,

                        lng:
                            position.lng

                    };

                }
            );

    };

},

    reset() {

        const toggled =
            document.querySelector('.ab_toggled');

        if (toggled) {
            toggled.classList.remove(
                'ab_toggled'
            );
        }

        clearPreviousData();
        this.stopHandlers();

        this.mode = null;
    }
};
