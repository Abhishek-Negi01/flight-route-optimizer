# ✈️ FlyFi - Flight Route and Cost Optimizer

FlyFi is an intelligent web-based flight route optimizer designed for users to find the most efficient and affordable flight paths between Indian airports. Built as a Design and Analysis of Algorithms (DAA) project, it demonstrates real-world application of graph algorithms like **Dijkstra's** and **Breadth-First Search (BFS)** to solve practical transportation problems.

---

## 🚀 Features

- 🔍 **All Routes**: Explore up to 10 possible paths between airports with total cost and distance using an optimized BFS.
- 💸 **Most Efficient Flights**: Uses **Dijkstra’s Algorithm (by cost)** to find the cheapest route.
- 📏 **Shortest Route**: Uses **Dijkstra’s Algorithm (by distance)** to find the shortest flight route.
- 🗺️ **Interactive Map**: Visualize your routes using Leaflet.js.
- 📋 **Airport Autocomplete**: Type airport codes or browse a full dropdown list with city and airport names.
- 📌 **Compare Flights on Map**: See multiple flight paths on a map with color-coded overlays.

---

## 🧠 Algorithms Used (DAA Component)

| Feature                | Algorithm             | Complexity      |
|------------------------|------------------------|------------------|
| All Paths              | Iterative BFS (top 10) | O(V + E) per path |
| Most Efficient Flights | Dijkstra (by cost)     | O((V+E) log V)   |


These algorithms are used not just for theoretical demonstration, but to solve a real-world problem in flight routing and optimization.

---

## 📁 Project Structure
FlyFi/
├── backend/
│ ├── app.py
│ ├── flight_utils.py
│ ├── global_airports.csv
│ └── global_routes.csv
├── frontend/
│ ├── templates/
│ │ └── index.html
│ └── static/
│ ├── style.css
│ ├── script.js
│ ├── map.js
│ ├── autocomplete.js
│ └── logo.png
├── requirements.txt
└── README.md



---

## 🛠 Tech Stack

- 🧠 **Python** + **Flask** (Backend)
- 📊 **CSV** data (Real airport and route data)
- 🎨 **HTML, CSS, JavaScript**
- 🌐 **Leaflet.js** for map visualizations
- 🔁 **Fetch API** for frontend-backend communication

---

## 📌 Setup Instructions

### 1. Clone this repository
```bash
git clone https://github.com/your-username/flyfi.git
cd flyfi

