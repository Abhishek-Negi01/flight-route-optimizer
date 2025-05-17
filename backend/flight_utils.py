import csv
import heapq

def load_flight_graph(airports_csv, routes_csv):
    graph = {}
    coordinates = {}
    cost_per_km = 4  # Simulated cost rate (INR per km)

    # Load airport data
    with open(airports_csv, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            code = row["ID"]
            coordinates[code] = {
                "code": code,
                "name": row["Name"],
                "lat": float(row["Latitude"]),
                "lon": float(row["Longitude"])
            }

    # Load route data and build graph
    with open(routes_csv, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            src = row["SourceID"]
            dest = row["DestID"]
            distance = float(row["Distance"])
            cost = int(distance * cost_per_km)

            if src in coordinates and dest in coordinates:
                graph.setdefault(src, []).append({
                    "to": dest,
                    "distance": distance,
                    "cost": cost
                })

    return graph, coordinates


def find_all_paths(graph, start, end, path=None, cost=0, distance=0, all_paths=None):
    if path is None:
        path = []
    if all_paths is None:
        all_paths = []

    path = path + [start]

    if start == end:
        all_paths.append({"path": path, "cost": cost, "distance": distance})
        return all_paths

    if start not in graph:
        return all_paths

    for edge in graph[start]:
        neighbor = edge["to"]
        if neighbor not in path:
            find_all_paths(
                graph, neighbor, end, path,
                cost + edge["cost"], distance + edge["distance"],
                all_paths
            )

    return sorted(all_paths, key=lambda x: x["cost"])


def dijkstra(graph, start, end, key="cost"):
    heap = [(0, 0, start, [])]  # (cost, distance, node, path)
    visited = set()

    while heap:
        total_cost, total_dist, node, path = heapq.heappop(heap)
        if node in visited:
            continue
        visited.add(node)
        path = path + [node]
        if node == end:
            return {"path": path, "cost": total_cost, "distance": total_dist}
        for edge in graph.get(node, []):
            neighbor = edge["to"]
            if neighbor not in visited:
                weight = edge[key]
                new_cost = total_cost + (edge["cost"] if key == "cost" else 0)
                new_dist = total_dist + (edge["distance"] if key == "distance" else 0)
                heapq.heappush(heap, (new_cost if key == "cost" else new_dist, new_dist, neighbor, path))

    return {"path": [], "cost": float("inf"), "distance": float("inf")}
