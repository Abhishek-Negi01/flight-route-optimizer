async function fetchPaths(mode) {
  const source = document.getElementById("source").value.trim().toUpperCase();
  const destination = document.getElementById("destination").value.trim().toUpperCase();
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "Loading...";

  try {
    const response = await fetch("/find-paths", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, destination, mode })
    });

    const data = await response.json();
    resultDiv.innerHTML = "";

    if (data.error) {
      resultDiv.textContent = data.error;
      return;
    }

    const airportData = await fetch("/airports").then(res => res.json());

    // Function to convert airport code to readable label
    const formatPathWithNames = (path) => {
      return path.map(code => `${airportData[code]?.name || code} (${code})`).join(" → ");
    };

    if (data.mode === "all") {
      if (!data.paths || data.paths.length === 0) {
        resultDiv.textContent = "No routes found.";
        return;
      }

      data.paths.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "path-card";
        div.innerHTML = `
          <strong>Route ${i + 1}</strong>:<br>
          ${formatPathWithNames(p.path)}<br>
          <strong>Cost:</strong> ₹${p.cost} &nbsp; | &nbsp;
          <strong>Distance:</strong> ${p.distance} km
        `;
        resultDiv.appendChild(div);
      });

      drawMultipleRoutes(data.paths.slice(0, 3), airportData); // map top 3 paths

    } else if (data.mode === "cost" || data.mode === "distance") {
      const { path, cost, distance } = data.result;

      if (!path || path.length === 0 || cost === Infinity) {
        resultDiv.textContent = "No optimal path found.";
        return;
      }

      const label = mode === "cost" ? "Cheapest Flight" : "Shortest Route";
      const div = document.createElement("div");
      div.className = "path-card";
      div.innerHTML = `
        <strong>${label}</strong>:<br>
        ${formatPathWithNames(path)}<br>
        <strong>Cost:</strong> ₹${cost} &nbsp; | &nbsp;
        <strong>Distance:</strong> ${distance} km
      `;
      resultDiv.appendChild(div);

      drawRoute(path, airportData);
    }

  } catch (err) {
    resultDiv.textContent = "An error occurred while fetching routes.";
    console.error(err);
  }

}

function toggleAirportList() {
  const modal = document.getElementById("airportModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";

  if (modal.style.display === "block") {
    loadAirportList();
  }
}

async function loadAirportList() {
  const list = document.getElementById("airportList");
  list.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch("/airports");
    const data = await res.json();

    list.innerHTML = ""; // clear old content

    Object.values(data).forEach(ap => {
      const item = document.createElement("li");
      item.textContent = `${ap.name} (${ap.code})`;
      list.appendChild(item);
    });

  } catch (err) {
    list.innerHTML = "<li>Failed to load airports.</li>";
  }
}
