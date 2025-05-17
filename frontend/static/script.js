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

    if (data.mode === "all") {
      if (!data.paths || data.paths.length === 0) {
        resultDiv.textContent = "No routes found.";
        return;
      }

      data.paths.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "path-card";
        div.innerHTML = `<strong>Route ${i + 1}</strong>: ${p.path.join(" → ")}<br>Cost: ₹${p.cost} | Distance: ${p.distance} km`;
        resultDiv.appendChild(div);
      });

      drawMultipleRoutes(data.paths.slice(0, 3), airportData); // draw top 3 routes

    } else if (data.mode === "cost" || data.mode === "distance") {
      const path = data.result.path;
      const cost = data.result.cost;
      const dist = data.result.distance;

      if (!path || path.length === 0 || cost === Infinity) {
        resultDiv.textContent = "No optimal path found.";
        return;
      }

      const label = mode === "cost" ? "Cheapest Flight" : "Shortest Route";
      const div = document.createElement("div");
      div.className = "path-card";
      div.innerHTML = `<strong>${label}</strong>: ${path.join(" → ")}<br>Cost: ₹${cost} | Distance: ${dist} km`;
      resultDiv.appendChild(div);

      drawRoute(path, airportData);
    }

  } catch (err) {
    resultDiv.textContent = "An error occurred while fetching routes.";
    console.error(err);
  }
}
