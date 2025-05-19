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


def find_all_paths(graph, start, end, max_depth=4, max_paths=10):
    stack = [(start, [start], 0, 0)]  # (current_node, path_so_far, cost_so_far, distance_so_far)
    all_paths = []

    while stack and len(all_paths) < max_paths:
        current, path, cost, distance = stack.pop()

        if current == end:
            all_paths.append({"path": path, "cost": cost, "distance": distance})
            continue

        if current not in graph or len(path) > max_depth:
            continue

        for edge in graph[current]:
            neighbor = edge["to"]
            if neighbor not in path:  # avoid cycles
                stack.append((
                    neighbor,
                    path + [neighbor],
                    cost + edge.get("cost", 0),
                    distance + edge.get("distance", 0)
                ))

    return sorted(all_paths, key=lambda x: x["cost"])




def dijkstra(graph, start, end, key="cost"):
    heap = [(0, 0, 0, start, [])]  # (priority, cost, distance, node, path)
    visited = set()

    while heap:
        priority, total_cost, total_dist, node, path = heapq.heappop(heap)
        if node in visited:
            continue
        visited.add(node)
        path = path + [node]
        if node == end:
            return {"path": path, "cost": total_cost, "distance": total_dist}
        for edge in graph.get(node, []):
            neighbor = edge["to"]
            if neighbor not in visited:
                cost = edge.get("cost", 0)
                dist = edge.get("distance", 0)
                new_cost = total_cost + cost
                new_dist = total_dist + dist
                new_priority = new_cost if key == "cost" else new_dist
                heapq.heappush(heap, (new_priority, new_cost, new_dist, neighbor, path))


    return {"path": [], "cost": float("inf"), "distance": float("inf")}
