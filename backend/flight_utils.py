import csv
import heapq

def load_flight_graph(csv_file):
    graph = {}
    with open(csv_file, newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            src = row["source"]
            dest = row["destination"]
            cost = int(row["cost"])
            graph.setdefault(src, []).append((dest, cost))
    return graph

def find_all_paths_with_costs(graph, start, end, path=[], cost=0):
    path = path + [start]
    if start == end:
        return [{"path": path, "cost": cost}]
    if start not in graph:
        return []
    all_paths = []
    for (node, weight) in graph[start]:
        if node not in path:
            newpaths = find_all_paths_with_costs(graph, node, end, path, cost + weight)
            all_paths.extend(newpaths)
    return all_paths

def dijkstra(graph, start, end):
    heap = [(0, start, [])]
    visited = set()

    while heap:
        (cost, node, path) = heapq.heappop(heap)
        if node in visited:
            continue
        visited.add(node)
        path = path + [node]

        if node == end:
            return {"path": path, "cost": cost}

        for neighbor, weight in graph.get(node, []):
            if neighbor not in visited:
                heapq.heappush(heap, (cost + weight, neighbor, path))

    return {"path": [], "cost": float("inf")}
