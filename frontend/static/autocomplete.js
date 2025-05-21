let airportList = [];

// === Fetch the list of available airport codes from the backend ===
async function fetchAirports() {
  try {
    const res = await fetch("/airports"); // Call the backend endpoint to get airport data
    const data = await res.json();        // Parse the JSON response
    airportList = Object.keys(data);      // Extract and store airport codes (e.g., ["DEL", "BOM", "BLR"])
  } catch (err) {
    console.error("Failed to load airport list:", err); // Log any errors to the console
  }
}

// === Set up the autocomplete dropdown for a specific input field ===
function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId); // Get the input element by ID
  const list = document.getElementById(listId);   // Get the container to display matching airport codes

  // === Event Listener: Runs whenever user types in the input field ===
  input.addEventListener("input", () => {
    const val = input.value.toUpperCase(); // Convert input to uppercase for consistent matching
    list.innerHTML = "";                   // Clear previous suggestions

    // Exit if there's no input or airport list hasn't loaded
    if (!val || airportList.length === 0) return;

    // Find matching airport codes that start with the input value
    const matches = airportList
      .filter(code => code.startsWith(val)) // Case-insensitive match
      .slice(0, 6);                          // Limit to first 6 results

    // Create and display a div for each matching code
    matches.forEach(code => {
      const item = document.createElement("div");
      item.className = "autocomplete-item"; // Add styling class
      item.textContent = code;              // Show the airport code

      // When user clicks a suggestion, set it as input value and close the list
      item.onclick = () => {
        input.value = code;
        list.innerHTML = ""; // Clear suggestion box
      };

      list.appendChild(item); // Add suggestion to the DOM
    });
  });

  // === Event Listener: Close the suggestions if user clicks outside the input field ===
  document.addEventListener("click", e => {
    if (e.target !== input) {
      list.innerHTML = ""; // Close autocomplete list
    }
  });
}

// === Initialize airport data and set up autocompletion on page load ===
window.addEventListener("load", () => {
  fetchAirports(); // Get airport list from server
  setupAutocomplete("source", "source-list"); // Enable autocomplete for source input
  setupAutocomplete("destination", "destination-list"); // Enable autocomplete for destination input
});
