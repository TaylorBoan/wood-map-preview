import "./style.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Create the main UI structure
document.querySelector("#app").innerHTML = `
  <div class="map-wrapper">
    <div class="aspect-selector">
      <button class="aspect-btn active" data-ratio="4x4">4x4</button>
      <button class="aspect-btn" data-ratio="11x14">11x14</button>
      <button class="aspect-btn" data-ratio="16x16">16x16</button>
      <button class="aspect-btn" data-ratio="20x20">20x20</button>
    </div>
    <div class="map-container" id="map-container">
      <div id="comparison-container">
        <div id="left" class="compare-map">
        </div>
        <div id="right" class="compare-map"></div>
        <div class="pad-scroll scrl-left"></div>
        <div class="pad-scroll scrl-right"></div>
        <div class="pad-scroll scrl-top"></div>
        <div class="pad-scroll scrl-bot"></div>
      </div>
    </div>
  </div>

  <div class="controls-panel">
    <div class="controls-content">
      <h2>Wood Map Preview</h2>

      <div class="form-group">
        <label for="location">Location Search</label>
        <div id="geocoder"></div>
      </div>

      <div class="form-group">
        <label for="title">Map Title</label>
        <input type="text" id="title" placeholder="Enter map title">
      </div>

      <div class="form-group">
        <label for="subtitle">Map Subtitle</label>
        <input type="text" id="subtitle" placeholder="Enter map subtitle">
      </div>

      <div class="form-group">
        <label for="order">Order Number</label>
        <input type="text" id="order" placeholder="Enter order number">
      </div>

      <button id="submit-button">Submit Map Selection</button>
    </div>
  </div>
`;

// Initialize the before (left) map
const beforeMap = new mapboxgl.Map({
  container: "left",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [-74.5, 40],
  zoom: 9,
});

// Initialize the after (right) map with custom styling
const afterMap = new mapboxgl.Map({
  container: "right",
  style: {
    version: 8,
    sources: {
      "mapbox-streets": {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8",
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "white",
        },
      },
      {
        id: "water",
        type: "fill",
        source: "mapbox-streets",
        "source-layer": "water",
        paint: {
          "fill-color": "#0000ff",
        },
      },
      {
        id: "major-roads",
        type: "line",
        source: "mapbox-streets",
        "source-layer": "road",
        filter: [
          "all",
          [
            "in",
            "class",
            "motorway",
            "trunk",
            "primary",
            "secondary",
            "tertiary",
          ],
        ],
        paint: {
          "line-color": "black",
          "line-width": 2,
        },
      },
      {
        id: "minor-roads",
        type: "line",
        source: "mapbox-streets",
        "source-layer": "road",
        minzoom: 0,
        maxzoom: 24,
        filter: [
          "all",
          [
            "!in",
            "class",
            "motorway",
            "trunk",
            "primary",
            "secondary",
            "tertiary",
          ],
          ["!=", "structure", "tunnel"],
        ],
        paint: {
          "line-color": "red",
          "line-width": 1.5,
        },
      },
    ],
  },
  center: [-74.5, 40],
  zoom: 9,
});

// Initialize the map comparison slider
const container = "#comparison-container";
const map = new mapboxgl.Compare(beforeMap, afterMap, container, {
  mousemove: true,
  orientation: "horizontal",
});

// Add geocoder (search) control
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: {
    color: "black",
  },
});

document.getElementById("geocoder").appendChild(geocoder.onAdd(beforeMap));

// When we search for a location, update both maps
geocoder.on("result", (e) => {
  const coords = e.result.center;
  beforeMap.flyTo({ center: coords, zoom: 14 });
  afterMap.flyTo({ center: coords, zoom: 14 });
});

// Handle form submission
document.getElementById("submit-button").addEventListener("click", () => {
  const bounds = beforeMap.getBounds();
  const title = document.getElementById("title").value;
  const subtitle = document.getElementById("subtitle").value;
  const orderNumber = document.getElementById("order").value;
  const center = beforeMap.getCenter();

  const emailBody = `
        New Map Selection:
        Order Number: ${orderNumber}
        Title: ${title}
        Subtitle: ${subtitle}
        Bounds: ${JSON.stringify(bounds)}
        Center: ${JSON.stringify(center)}
        Zoom: ${beforeMap.getZoom()}
    `;

  window.location.href = `mailto:taylor@themapsguy.com?subject=New Map Selection - Order ${orderNumber}&body=${encodeURIComponent(emailBody)}`;
});

// Handle aspect ratio selection
const aspectBtns = document.querySelectorAll(".aspect-btn");
const mapContainer = document.getElementById("map-container");

aspectBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    aspectBtns.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");

    const ratio = btn.dataset.ratio;

    // Update map container dimensions based on ratio
    switch (ratio) {
      case "4x4":
        mapContainer.style.width = "400px";
        mapContainer.style.height = "400px";
        break;
      case "11x14":
        mapContainer.style.width = "440px";
        mapContainer.style.height = "560px";
        break;
      case "16x16":
        mapContainer.style.width = "480px";
        mapContainer.style.height = "480px";
        break;
      case "20x20":
        mapContainer.style.width = "500px";
        mapContainer.style.height = "500px";
        break;
    }

    // Trigger map resize
    beforeMap.resize();
    afterMap.resize();
  });
});
