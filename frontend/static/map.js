let map;

function initMap() {
  map = L.map("map").setView([22.5937, 78.9629], 5); // center on India for default

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors",
  }).addTo(map);
}

function clearMap() {
  if (!map) return;
  map.eachLayer((layer) => {
    if (layer instanceof L.Polyline || layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

function drawRoute(path, airportData) {
  if (!map || !path || path.length === 0) return;

  clearMap();

  const coords = path.map(code => {
    const ap = airportData[code];
    return [ap.lat, ap.lon];
  });

  L.polyline(coords, { color: "#22B8CF", weight: 6 }).addTo(map);

  path.forEach(code => {
    const ap = airportData[code];
    L.marker([ap.lat, ap.lon])
      .addTo(map)
      .bindPopup(`${ap.name} (${code})`);
  });

  map.fitBounds(coords);
}

function drawMultipleRoutes(paths, airportData) {
  if (!map) return;

  clearMap();

  paths.forEach((route, index) => {
    const coords = route.path.map(code => {
      const ap = airportData[code];
      return [ap.lat, ap.lon];
    });

    L.polyline(coords, {
      color: index === 0 ? "#007bff" : index === 1 ? "#28a745" : "#ffc107",
      weight: 4,
      dashArray: index > 0 ? "5,10" : null
    }).addTo(map);

    route.path.forEach(code => {
      const ap = airportData[code];
      L.marker([ap.lat, ap.lon])
        .addTo(map)
        .bindPopup(`${ap.name} (${code})`);
    });
  });

  const allCoords = paths.flatMap(p => p.path.map(code => [airportData[code].lat, airportData[code].lon]));
  map.fitBounds(allCoords);
}

window.addEventListener("load", initMap);
