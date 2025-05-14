async function fetchPaths(mode) {
  const source = document.getElementById("source").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "Loading...";

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

  if (data.mode === "all") {
      if (data.paths.length === 0) {
          resultDiv.textContent = "No paths found.";
      } else {
          data.paths.forEach((p, i) => {
              const div = document.createElement("div");
              div.className = "path";
              div.textContent = `Path ${i + 1}: ${p.path.join(" → ")} | Cost: ₹${p.cost}`;
              resultDiv.appendChild(div);
          });
      }
  } else if (data.mode === "dijkstra") {
      const path = data.result.path;
      const cost = data.result.cost;
      if (!path || path.length === 0) {
          resultDiv.textContent = "No path found.";
      } else {
          resultDiv.innerHTML = `<strong>Shortest Path:</strong> ${path.join(" → ")} <br><strong>Total Cost:</strong> ₹${cost}`;
      }
  }
}

