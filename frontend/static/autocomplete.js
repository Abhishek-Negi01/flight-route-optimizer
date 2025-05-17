let airportList = [];

async function fetchAirports() {
  try {
    const res = await fetch("/airports");
    const data = await res.json();
    airportList = Object.keys(data); // e.g., ["DEL", "BOM", "BLR"]
  } catch (err) {
    console.error("Failed to load airport list:", err);
  }
}

function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener("input", () => {
    const val = input.value.toUpperCase();
    list.innerHTML = "";

    if (!val || airportList.length === 0) return;

    const matches = airportList.filter(code => code.startsWith(val)).slice(0, 6);

    matches.forEach(code => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.textContent = code;
      item.onclick = () => {
        input.value = code;
        list.innerHTML = "";
      };
      list.appendChild(item);
    });
  });

  document.addEventListener("click", e => {
    if (e.target !== input) list.innerHTML = "";
  });
}

window.addEventListener("load", () => {
  fetchAirports();
  setupAutocomplete("source", "source-list");
  setupAutocomplete("destination", "destination-list");
});
