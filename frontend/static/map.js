let map;

// === Initialize the Leaflet Map ===
function initMap() {
  // Create a map centered on India (latitude: 22.5937, longitude: 78.9629) with zoom level 5
  map = L.map("map").setView([22.5937, 78.9629], 5);

  // Add OpenStreetMap tiles as the base layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors", // Proper attribution
  }).addTo(map);
}

// === Remove All Existing Polylines and Markers from the Map ===
function clearMap() {
  if (!map) return; // Do nothing if map is not initialized

  map.eachLayer((layer) => {
    // Only remove lines and markers, not the tile layer
    if (layer instanceof L.Polyline || layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

// === Draw a Single Route on the Map ===
function drawRoute(path, airportData) {
  if (!map || !path || path.length === 0) return; // Exit if map or path is invalid

  clearMap(); // Clean up any existing routes or markers

  // Convert airport codes to their coordinates
  const coords = path.map(code => {
    const ap = airportData[code];
    return [ap.lat, ap.lon]; // [latitude, longitude]
  });

  // Draw the route line connecting all waypoints
  L.polyline(coords, { color: "#22B8CF", weight: 6 }).addTo(map);

  // Add markers for each airport in the route
  path.forEach(code => {
    const ap = airportData[code];
    L.marker([ap.lat, ap.lon])
      .addTo(map)
      .bindPopup(`${ap.name} (${code})`); // Show airport name and code on click
  });

  // Adjust the view to fit all route points
  map.fitBounds(coords);
}

// === Draw Multiple Routes on the Map (e.g., for All Paths) ===
function drawMultipleRoutes(paths, airportData) {
  if (!map) return; // Exit if map not ready

  clearMap(); // Remove any previous paths or markers

  // Loop through each path and draw it with a unique color/style
  paths.forEach((route, index) => {
    // Map airport codes to coordinates
    const coords = route.path.map(code => {
      const ap = airportData[code];
      return [ap.lat, ap.lon];
    });

    // Draw polyline with unique styling per route
    L.polyline(coords, {
      color: index === 0 ? "#007bff" : index === 1 ? "#28a745" : "#ffc107", // Blue, Green, Yellow
      weight: 4,
      dashArray: index > 0 ? "5,10" : null // Dashed lines for secondary paths
    }).addTo(map);

    // Place a marker for each airport in this route
    route.path.forEach(code => {
      const ap = airportData[code];
      L.marker([ap.lat, ap.lon])
        .addTo(map)
        .bindPopup(`${ap.name} (${code})`);
    });
  });

  // Gather all coordinates across all routes to fit them into view
  const allCoords = paths.flatMap(p =>
    p.path.map(code => [airportData[code].lat, airportData[code].lon])
  );

  map.fitBounds(allCoords); // Adjust the map view to include all markers/routes
}

// === Initialize the map once the page has fully loaded ===
window.addEventListener("load", initMap);
