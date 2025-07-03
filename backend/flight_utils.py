import csv
import heapq
from collections import deque

def load_flight_graph(airports_csv, routes_csv):
    """
    Loads airport data and flight routes from CSV files,
    builds a graph with routes weighted by cost and distance,
    and returns the graph and airport coordinates.

    Parameters:
    - airports_csv: path to the CSV file containing airport info
    - routes_csv: path to the CSV file containing flight routes info

    Returns:
    - graph: dict mapping source airport codes to lists of edges (destinations with distance and cost)
    - coordinates: dict mapping airport codes to airport metadata (name, latitude, longitude)
    """
    graph = {}
    coordinates = {}
    cost_per_km = 4  # Cost rate in INR per kilometer (simulated value)

    # Load airport data from CSV file
    with open(airports_csv, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            code = row["ID"]  # Unique airport code
            coordinates[code] = {
                "code": code,
                "name": row["Name"],  # Airport name
                "lat": float(row["Latitude"]),  # Latitude coordinate
                "lon": float(row["Longitude"])  # Longitude coordinate
            }

    # Load route data from CSV file and build the graph
    with open(routes_csv, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            src = row["SourceID"]  # Source airport code
            dest = row["DestID"]  # Destination airport code
            distance = float(row["Distance"])  # Distance between airports in km
            cost = int(distance * cost_per_km)  # Calculate cost based on distance

            # Only add edges if both source and destination airports exist in coordinates
            if src in coordinates and dest in coordinates:
                graph.setdefault(src, []).append({
                    "to": dest,
                    "distance": distance,
                    "cost": cost
                })

    return graph, coordinates


def find_all_paths(graph, start, end, max_paths=10):
    """
    Finds multiple paths from start to end in the flight graph using BFS.
    Returns up to max_paths paths sorted by total cost.

    Parameters:
    - graph: the flight graph (dict of adjacency lists)
    - start: starting airport code
    - end: destination airport code
    - max_paths: maximum number of paths to find

    Returns:
    - A list of paths, each a dict with keys:
      - "path": list of airport codes representing the path
      - "cost": total cost of the path
      - "distance": total distance of the path
    """
    all_paths = []
    queue = deque()
    # Initialize queue with tuple: (current_node, path_so_far, total_cost_so_far, total_distance_so_far)
    queue.append((start, [start], 0, 0))

    while queue and len(all_paths) < max_paths:
        current_node, path, total_cost, total_distance = queue.popleft()

        # If we reached the destination, record the path info
        if current_node == end:
            all_paths.append({
                "path": path,
                "cost": total_cost,
                "distance": total_distance
            })
            continue

        # Explore neighbors that are not already in the path (to avoid cycles)
        for edge in graph.get(current_node, []):
            neighbor = edge["to"]
            if neighbor not in path:
                queue.append((
                    neighbor,
                    path + [neighbor],
                    total_cost + edge["cost"],
                    total_distance + edge["distance"]
                ))

    # Sort the found paths by total cost (lowest cost first)
    return sorted(all_paths, key=lambda x: x["cost"])


def dijkstra(graph, start, end, key="cost"):
    """
    Implements Dijkstra's algorithm to find the shortest path
    from start to end based on a specified key (either "cost" or "distance").

    Parameters:
    - graph: the flight graph (dict of adjacency lists)
    - start: starting airport code
    - end: destination airport code
    - key: attribute to optimize ("cost" or "distance")

    Returns:
    - A dict with keys:
      - "path": list of airport codes representing the shortest path
      - "cost": total cost of the shortest path
      - "distance": total distance of the shortest path
    """
    # Heap elements: (priority, total_cost, total_distance, current_node, path_so_far)
    heap = [(0, 0, 0, start, [])]
    visited = set()  # Track visited nodes to avoid revisiting

    while heap:
        priority, total_cost, total_dist, node, path = heapq.heappop(heap)

        # Skip nodes already visited
        if node in visited:
            continue
        visited.add(node)

        # Append current node to the path
        path = path + [node]

        # If destination reached, return the path and accumulated cost/distance
        if node == end:
            return {"path": path, "cost": total_cost, "distance": total_dist}

        # Explore neighbors of current node
        for edge in graph.get(node, []):
            neighbor = edge["to"]
            if neighbor not in visited:
                cost = edge.get("cost", 0)
                dist = edge.get("distance", 0)
                new_cost = total_cost + cost
                new_dist = total_dist + dist

                # Priority based on the optimization key
                new_priority = new_cost if key == "cost" else new_dist

                # Add neighbor to the heap for exploration
                heapq.heappush(heap, (new_priority, new_cost, new_dist, neighbor, path))

    # If no path found, return empty path and infinite cost/distance
    return {"path": [], "cost": float("inf"), "distance": float("inf")}
