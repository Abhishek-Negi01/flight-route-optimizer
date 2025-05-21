// Fetch paths based on selected mode: 'all', 'cost', or 'distance'
async function fetchPaths(mode) {
  // Get input values, trim spaces, and convert to uppercase for consistency
  const source = document.getElementById("source").value.trim().toUpperCase();
  const destination = document.getElementById("destination").value.trim().toUpperCase();
  const resultDiv = document.getElementById("results");

  // Show a temporary loading message
  resultDiv.innerHTML = "Loading...";

  try {
    // Make a POST request to the backend to fetch path(s)
    const response = await fetch("/find-paths", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Tell server we’re sending JSON
      body: JSON.stringify({ source, destination, mode }) // Include data in request
    });

    // Parse the JSON response
    const data = await response.json();

    // Clear any previous results
    resultDiv.innerHTML = "";

    // If the backend sends an error, display it
    if (data.error) {
      resultDiv.textContent = data.error;
      return;
    }

    // Fetch airport metadata (names, coordinates, etc.) for displaying labels
    const airportData = await fetch("/airports").then(res => res.json());

    // Convert airport codes in a path to a readable string: "Delhi (DEL) → Mumbai (BOM)"
    const formatPathWithNames = (path) => {
      return path.map(code => `${airportData[code]?.name || code} (${code})`).join(" → ");
    };

    // If mode is 'all', multiple paths are returned
    if (data.mode === "all") {
      // Check if any paths were returned
      if (!data.paths || data.paths.length === 0) {
        resultDiv.textContent = "No routes found.";
        return;
      }

      // Loop through all paths and display them
      data.paths.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "path-card"; // Apply styling class
        div.innerHTML = `
          <strong>Route ${i + 1}</strong>:<br>
          ${formatPathWithNames(p.path)}<br>
          <strong>Cost:</strong> ₹${p.cost} &nbsp; | &nbsp;
          <strong>Distance:</strong> ${p.distance} km
        `;
        resultDiv.appendChild(div);
      });

      // Draw top 3 paths on the map for visualization
      drawMultipleRoutes(data.paths.slice(0, 3), airportData);

    // If mode is 'cost' or 'distance', only a single optimal path is returned
    } else if (data.mode === "cost" || data.mode === "distance") {
      const { path, cost, distance } = data.result;

      // Check if a valid path exists
      if (!path || path.length === 0 || cost === Infinity) {
        resultDiv.textContent = "No optimal path found.";
        return;
      }

      // Set appropriate label based on mode
      const label = mode === "cost" ? "Cheapest Flight" : "Shortest Route";

      // Display the optimal path
      const div = document.createElement("div");
      div.className = "path-card";
      div.innerHTML = `
        <strong>${label}</strong>:<br>
        ${formatPathWithNames(path)}<br>
        <strong>Cost:</strong> ₹${cost} &nbsp; | &nbsp;
        <strong>Distance:</strong> ${distance} km
      `;
      resultDiv.appendChild(div);

      // Draw this single path on the map
      drawRoute(path, airportData);
    }

  } catch (err) {
    // Show error in UI and log for debugging
    resultDiv.textContent = "An error occurred while fetching routes.";
    console.error(err);
  }
}


// Toggle the airport modal popup on/off
function toggleAirportList() {
  const modal = document.getElementById("airportModal");

  // If modal is currently shown, hide it. If hidden, show it.
  modal.style.display = modal.style.display === "block" ? "none" : "block";

  // If we are showing the modal, load the airport data
  if (modal.style.display === "block") {
    loadAirportList();
  }
}


// Load the list of all airports dynamically into the modal
async function loadAirportList() {
  const list = document.getElementById("airportList");

  // Temporary message while loading
  list.innerHTML = "<li>Loading...</li>";

  try {
    // Fetch airport data from server
    const res = await fetch("/airports");
    const data = await res.json();

    // Clear previous list items
    list.innerHTML = "";

    // Loop through all airports and display them
    Object.values(data).forEach(ap => {
      const item = document.createElement("li");
      item.textContent = `${ap.name} (${ap.code})`;
      list.appendChild(item);
    });

  } catch (err) {
    // If fetch fails, show fallback message
    list.innerHTML = "<li>Failed to load airports.</li>";
  }
}

