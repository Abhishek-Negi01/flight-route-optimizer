from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from flight_utils import load_flight_graph, find_all_paths, dijkstra

# File paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
AIRPORTS_FILE = os.path.join(BASE_DIR, "global_airports.csv")
ROUTES_FILE = os.path.join(BASE_DIR, "global_routes.csv")

# Load graph and airport metadata
flight_graph, airport_data = load_flight_graph(AIRPORTS_FILE, ROUTES_FILE)

# Flask app
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "../frontend/templates"),
    static_folder=os.path.join(BASE_DIR, "../frontend/static")
)
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/find-paths", methods=["POST"])
def find_paths():
    try:
        data = request.json
        source = data.get("source")
        destination = data.get("destination")
        mode = data.get("mode", "all")

        if source not in flight_graph or destination not in flight_graph:
            return jsonify({"error": "Invalid source or destination"}), 400

        if mode == "all":
            paths = find_all_paths(flight_graph, source, destination)
            return jsonify({"mode": "all", "paths": paths})

        elif mode == "cost":
            result = dijkstra(flight_graph, source, destination, key="cost")
            return jsonify({"mode": "cost", "result": result})

        elif mode == "distance":
            result = dijkstra(flight_graph, source, destination, key="distance")
            return jsonify({"mode": "distance", "result": result})

        else:
            return jsonify({"error": "Invalid mode selected"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/airports")
def get_airports():
    return jsonify(airport_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)  # Remove debug=True

