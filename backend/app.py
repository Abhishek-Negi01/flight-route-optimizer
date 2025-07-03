from flask import Flask, request, jsonify, render_template
from flask_cors import CORS     #cross origin resource sharing
import os                       #for file path
from flight_utils import load_flight_graph, find_all_paths, dijkstra

# File paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__)) # to Get the directory of the current file
AIRPORTS_FILE = os.path.join(BASE_DIR, "global_airports.csv") # to Get the path of the airports file
ROUTES_FILE = os.path.join(BASE_DIR, "global_routes.csv") # to Get the path of the routes file


# Load graph and airport metadata
flight_graph, airport_data = load_flight_graph(AIRPORTS_FILE, ROUTES_FILE)    #getting data in a dictionary format
# flight_graph is a dictionary where keys are airport codes and values are lists of tuples (destination, cost, distance)    

# Flask app
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "../frontend/templates"),
    static_folder=os.path.join(BASE_DIR, "../frontend/static")
)
CORS(app)               #Allows the frontend (JavaScript running in browser) to communicate with this Flask backend.


@app.route("/")   #/ — Loads the main UI page
def index():
    return render_template("index.html")   #This renders the HTML page (index.html) when you visit localhost:5000/.

@app.route("/find-paths", methods=["POST"])  #Core API for getting routes the input is in a dict format
def find_paths():
    try:
        data = request.json
        source = data.get("source")
        destination = data.get("destination")
        mode = data.get("mode", "all")

        if source not in flight_graph or destination not in flight_graph:     # Basic validation to make sure both source and destination exist.
            return jsonify({"error": "Invalid source or destination"}), 400

        if mode == "all":
            paths = find_all_paths(flight_graph, source, destination)  #Finds all possible paths between the source and destination airports.   
            return jsonify({"mode": "all", "paths": paths})

        elif mode == "cost":
            result = dijkstra(flight_graph, source, destination, key="cost")  #Uses Dijkstra’s algorithm to find the cheapest flight (based on cost).
            return jsonify({"mode": "cost", "result": result})

        elif mode == "distance":
            result = dijkstra(flight_graph, source, destination, key="distance") #Uses Dijkstra again, but this time optimizes based on shortest physical distance.
            return jsonify({"mode": "distance", "result": result})

        else:
            return jsonify({"error": "Invalid mode selected"}), 400  #Invalid source/destination input or  bad request

    except Exception as e:
        return jsonify({"error": str(e)}), 500 #Error handling: returns a clean JSON error if something goes wrong

@app.route("/airports")
def get_airports():        #Returns: Metadata about all airports:
    return jsonify(airport_data) #Dropdown/autocomplete in frontend, Displaying airport names in results, Plotting on Leaflet map


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)  # Remove debug=True



