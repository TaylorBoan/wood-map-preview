import "./style.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Create the main UI structure
document.querySelector("#app").innerHTML = `
  <div class="map-wrapper">
    <div class="aspect-selector">
      <button class="aspect-btn" data-ratio="4x4">4x4</button>
      <button class="aspect-btn active" data-ratio="11x14">11x14</button>
      <button class="aspect-btn" data-ratio="16x16">16x16</button>
      <button class="aspect-btn" data-ratio="20x20">20x20</button>
    </div>
    <div class="map-container" id="map-container">
      <div id="comparison-container">
        <div id="left" class="compare-map">
        </div>
        <div id="right" class="compare-map">
          <div class="map-overlay" id="map-overlay">
            <div class="map-margin-top"></div>
            <div class="map-margin-left"></div>
            <div class="map-margin-right"></div>
            <div class="map-title-area">
              <div class="map-title-display" id="map-title-display"></div>
              <div class="map-subtitle-display" id="map-subtitle-display"></div>
            </div>
          </div>
        </div>
        <div class="pad-scroll scrl-left"></div>
        <div class="pad-scroll scrl-right"></div>
        <div class="pad-scroll scrl-top"></div>
        <div class="pad-scroll scrl-bot"></div>
      </div>
    </div>
    <div class="bounding-box-display" id="bounding-box-display">
      Bounds: Loading...
    </div>
    <div class="zoom-controls">
      <button class="zoom-btn" id="zoom-in-btn">+</button>
      <button class="zoom-btn" id="zoom-out-btn">-</button>
    </div>
  </div>

  <!-- Initial popup modal -->
  <div class="modal-overlay" id="initial-modal">
    <div class="modal-content">
      <h3>JUST FYI</h3>
      <p>This is just a preview. Your actual design will almost always contain more detail than what you see here.</p>
      <p>We will always send you a final preview before we begin engraving.</p>
      <p>For more questions click on the i icon.</p>
      <button class="modal-close-btn" id="close-modal">Got it!</button>
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

      <div class="form-group">
        <label for="marker-address">Marker Address</label>
        <input type="text" id="marker-address" placeholder="Enter marker address">
      </div>

      <div class="form-group">
        <label for="icon-selector">Select Icon</label>
        <div class="icon-selector-container">
          <div class="icon-scroll" id="icon-scroll">
            <div class="icon-option" data-icon="None">
              <div class="no-icon">No Icon</div>
            </div>
            <div class="icon-option" data-icon="motorcycle">
              <img src="/Icons/00518-Sport-Motorcycle-CF-1-580x387.jpg" alt="Motorcycle">
            </div>
            <div class="icon-option" data-icon="tree">
              <img src="/Icons/1000_F_202931317_7JlNhRZeTnZANztKPhn4bVvpC4HvAPi8.jpg" alt="Tree">
            </div>
            <div class="icon-option" data-icon="graduation">
              <img src="/Icons/106436.webp" alt="Graduation">
            </div>
            <div class="icon-option" data-icon="house">
              <img src="/Icons/1638076-200.png" alt="House">
            </div>
            <div class="icon-option" data-icon="school">
              <img src="/Icons/1647.png" alt="School">
            </div>
            <div class="icon-option" data-icon="mountain">
              <img src="/Icons/2117138-200.png" alt="Mountain">
            </div>
            <div class="icon-option" data-icon="car">
              <img src="/Icons/360_F_316764111_17NQovMYqQSzpf9gNr5lnc1lbcD1qdhh.jpg" alt="Car">
            </div>
            <div class="icon-option" data-icon="dog">
              <img src="/Icons/360_F_485686916_USM1VciJsb34P0vsCTHI4Gx3GJLHBwzl.jpg" alt="Dog">
            </div>
            <div class="icon-option" data-icon="compass">
              <img src="/Icons/484167.png" alt="Compass">
            </div>
            <div class="icon-option" data-icon="plane">
              <img src="/Icons/Plane_icon.svg.png" alt="Plane">
            </div>
            <div class="icon-option" data-icon="real-estate">
              <img src="/Icons/Real_Estate__28101_29.jpg" alt="Real Estate">
            </div>
            <div class="icon-option" data-icon="cake">
              <img src="/Icons/birthday-cake-icon-vector-happy-260nw-698609965.jpg.webp" alt="Birthday Cake">
            </div>
            <div class="icon-option" data-icon="hiking">
              <img src="/Icons/depositphotos_461871716-stock-illustration-highland-hiking-mountains-icon-outline.jpg" alt="Hiking">
            </div>
            <div class="icon-option" data-icon="heart">
              <img src="/Icons/heart-15.png" alt="Heart">
            </div>
            <div class="icon-option" data-icon="church">
              <img src="/Icons/illustration-of-church-icon-free-vector.jpg" alt="Church">
            </div>
            <div class="icon-option" data-icon="star">
              <img src="/Icons/images-2.png" alt="Star">
            </div>
            <div class="icon-option" data-icon="location">
              <img src="/Icons/images.png" alt="Location">
            </div>
            <div class="icon-option" data-icon="guitar">
              <img src="/Icons/istockphoto-490716348-612x612.jpg" alt="Guitar">
            </div>
            <div class="icon-option" data-icon="wedding">
              <img src="/Icons/wedding-icon-wedding-rings-black-icon-wedding-symbol-vector-illustration-wedding-icon-wedding-rings-black-icon-wedding-symbol-184832891.jpg.webp" alt="Wedding">
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="comments">Any Other Comments</label>
        <input type="text" id="comments" placeholder="Any additional comments">
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
  orientation: "vertical",
});

// Delete Me once the slider is working
afterMap.on("load", () => {
  beforeMap.once("load", () => {
    compare.setSlider(100); // hard-right
  });
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

// Variable to store the red dot marker
let redDotMarker = null;

// Function to update bounding box display
function updateBoundingBoxDisplay() {
  const bounds = beforeMap.getBounds();
  const boundingBoxDisplay = document.getElementById("bounding-box-display");
  boundingBoxDisplay.textContent = `Bounds: ${bounds.getSouth().toFixed(4)}, ${bounds.getWest().toFixed(4)}, ${bounds.getNorth().toFixed(4)}, ${bounds.getEast().toFixed(4)}`;
}

// Update bounding box display on map move
beforeMap.on("moveend", updateBoundingBoxDisplay);
beforeMap.on("load", updateBoundingBoxDisplay);

// Handle icon selection
const iconOptions = document.querySelectorAll(".icon-option");
iconOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // Remove selected class from all options
    iconOptions.forEach((opt) => opt.classList.remove("selected"));
    // Add selected class to clicked option
    option.classList.add("selected");
  });
});

// Set default selection to "No Icon"
document
  .querySelector('.icon-option[data-icon="None"]')
  .classList.add("selected");

// Function to update title display
function updateTitleDisplay() {
  const title = document.getElementById("title").value;
  const subtitle = document.getElementById("subtitle").value;

  document.getElementById("map-title-display").textContent =
    title || "Map Title";
  document.getElementById("map-subtitle-display").textContent =
    subtitle || "Map Subtitle";
}

// Add event listeners for title/subtitle inputs
document.getElementById("title").addEventListener("input", updateTitleDisplay);
document
  .getElementById("subtitle")
  .addEventListener("input", updateTitleDisplay);

// Initialize title display
updateTitleDisplay();

// MARGIN CONFIGURATION - Adjust these values to customize margins for each aspect ratio
const MARGIN_SETTINGS = {
  "4x4": {
    top: "30px",
    left: "25px",
    right: "25px",
    bottom: "60px",
  },
  "11x14": {
    top: "25px",
    left: "20px",
    right: "20px",
    bottom: "60px",
  },
  "16x16": {
    top: "30px",
    left: "25px",
    right: "25px",
    bottom: "70px",
  },
  "20x20": {
    top: "35px",
    left: "30px",
    right: "30px",
    bottom: "80px",
  },
};

// TITLE POSITIONING CONFIGURATION - Adjust these values to customize title/subtitle positions
const TITLE_POSITION_SETTINGS = {
  "4x4": {
    titleFontSize: "14px",
    subtitleFontSize: "10px",
    titleVerticalAlign: "center",
    subtitleVerticalAlign: "center",
    titleHorizontalPadding: "15px",
    subtitleHorizontalPadding: "15px",
  },
  "11x14": {
    titleFontSize: "16px",
    subtitleFontSize: "12px",
    titleVerticalAlign: "center",
    subtitleVerticalAlign: "center",
    titleHorizontalPadding: "20px",
    subtitleHorizontalPadding: "20px",
  },
  "16x16": {
    titleFontSize: "18px",
    subtitleFontSize: "14px",
    titleVerticalAlign: "center",
    subtitleVerticalAlign: "center",
    titleHorizontalPadding: "25px",
    subtitleHorizontalPadding: "25px",
  },
  "20x20": {
    titleFontSize: "20px",
    subtitleFontSize: "16px",
    titleVerticalAlign: "center",
    subtitleVerticalAlign: "center",
    titleHorizontalPadding: "30px",
    subtitleHorizontalPadding: "30px",
  },
};

// Update aspect ratio function to also adjust overlay margins and title positioning
function updateOverlayMargins(ratio) {
  const overlay = document.getElementById("map-overlay");
  const marginTop = overlay.querySelector(".map-margin-top");
  const marginLeft = overlay.querySelector(".map-margin-left");
  const marginRight = overlay.querySelector(".map-margin-right");
  const titleArea = overlay.querySelector(".map-title-area");
  const titleDisplay = overlay.querySelector(".map-title-display");
  const subtitleDisplay = overlay.querySelector(".map-subtitle-display");

  const marginSettings = MARGIN_SETTINGS[ratio];
  const titleSettings = TITLE_POSITION_SETTINGS[ratio];

  if (marginSettings) {
    marginTop.style.height = marginSettings.top;
    marginLeft.style.width = marginSettings.left;
    marginRight.style.width = marginSettings.right;
    titleArea.style.height = marginSettings.bottom;

    // Update the left and right margin heights to account for new top/bottom sizes
    const topHeight = parseInt(marginSettings.top);
    const bottomHeight = parseInt(marginSettings.bottom);
    marginLeft.style.height = `calc(100% - ${topHeight + bottomHeight}px)`;
    marginRight.style.height = `calc(100% - ${topHeight + bottomHeight}px)`;
    marginLeft.style.top = marginSettings.top;
    marginRight.style.top = marginSettings.top;
  }

  if (titleSettings) {
    // Update title positioning
    titleDisplay.style.fontSize = titleSettings.titleFontSize;
    titleDisplay.style.alignSelf = titleSettings.titleVerticalAlign;
    titleDisplay.style.paddingLeft = titleSettings.titleHorizontalPadding;

    // Update subtitle positioning
    subtitleDisplay.style.fontSize = titleSettings.subtitleFontSize;
    subtitleDisplay.style.alignSelf = titleSettings.subtitleVerticalAlign;
    subtitleDisplay.style.paddingRight =
      titleSettings.subtitleHorizontalPadding;
  }
}

// Function to place red dot marker based on address
function placeRedDotMarker(address) {
  if (!address.trim()) {
    // Remove marker if address is empty
    if (redDotMarker) {
      redDotMarker.remove();
      redDotMarker = null;
    }
    return;
  }

  // Use Mapbox Geocoding API to get coordinates from address
  const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&limit=1`;

  fetch(geocodingUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].center;

        // Remove existing marker if it exists
        if (redDotMarker) {
          redDotMarker.remove();
        }

        // Create red dot marker
        const redDotElement = document.createElement("div");
        redDotElement.className = "red-dot-marker";

        // Add marker to both maps
        redDotMarker = new mapboxgl.Marker(redDotElement)
          .setLngLat(coords)
          .addTo(beforeMap);

        // Also add to the right map
        new mapboxgl.Marker(redDotElement.cloneNode(true))
          .setLngLat(coords)
          .addTo(afterMap);
      }
    })
    .catch((error) => {
      console.error("Geocoding error:", error);
    });
}

// Add event listener to marker address input
document.getElementById("marker-address").addEventListener("input", (e) => {
  const address = e.target.value;
  // Debounce the geocoding requests
  clearTimeout(window.geocodeTimeout);
  window.geocodeTimeout = setTimeout(() => {
    placeRedDotMarker(address);
  }, 500);
});

// Handle form submission
document.getElementById("submit-button").addEventListener("click", () => {
  const bounds = beforeMap.getBounds();
  const title = document.getElementById("title").value;
  const subtitle = document.getElementById("subtitle").value;
  const orderNumber = document.getElementById("order").value;
  const markerAddress = document.getElementById("marker-address").value;
  const comments = document.getElementById("comments").value;
  const selectedIcon =
    document.querySelector(".icon-option.selected")?.dataset.icon || "None";
  const center = beforeMap.getCenter();

  const emailBody = `
        New Map Selection:
        Order Number: ${orderNumber}
        Title: ${title}
        Subtitle: ${subtitle}
        Marker Address: ${markerAddress}
        Selected Icon: ${selectedIcon}
        Comments: ${comments}
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
    // Using a scale factor to make larger ratios proportionally bigger
    switch (ratio) {
      case "4x4":
        mapContainer.style.width = "320px";
        mapContainer.style.height = "320px";
        break;
      case "11x14":
        mapContainer.style.width = "385px";
        mapContainer.style.height = "490px";
        break;
      case "16x16":
        mapContainer.style.width = "480px";
        mapContainer.style.height = "480px";
        break;
      case "20x20":
        mapContainer.style.width = "560px";
        mapContainer.style.height = "560px";
        break;
    }

    // Update overlay margins
    updateOverlayMargins(ratio);

    // Trigger map resize
    beforeMap.resize();
    afterMap.resize();
  });
});

// Initialize overlay margins for default selection (11x14)
updateOverlayMargins("11x14");
