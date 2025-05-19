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