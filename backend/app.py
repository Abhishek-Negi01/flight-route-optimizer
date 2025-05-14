from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from flight_utils import load_flight_graph, find_all_paths_with_costs, dijkstra

app = Flask(__name__, template_folder="templates", static_folder="../frontend/static")
CORS(app)

flight_graph = load_flight_graph(os.path.join(os.path.dirname(__file__), "flights.csv"))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/find-paths", methods=["POST"])
def find_paths():
    data = request.json
    source = data.get("source")
    destination = data.get("destination")
    mode = data.get("mode", "all")  # default to 'all'

    if source not in flight_graph or destination not in flight_graph:
        return jsonify({"error": "Invalid source or destination"}), 400

    if mode == "all":
        paths = find_all_paths_with_costs(flight_graph, source, destination)
        return jsonify({"mode": "all", "paths": paths})
    elif mode == "dijkstra":
        path = dijkstra(flight_graph, source, destination)
        return jsonify({"mode": "dijkstra", "result": path})
    else:
        return jsonify({"error": "Invalid mode selected"}), 400

if __name__ == "__main__":
    app.run(debug=True)
