const fs = require('fs');

// Read the first 1024 coordinates from input.txt
const data = fs.readFileSync('input.txt', 'utf8');
const lines = data.trim().split('\n').slice(0, 1024);

// Initialize a 71x71 grid
const gridSize = 71;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

// Mark the corrupted cells
for (const line of lines) {
    const [xStr, yStr] = line.split(',');
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        grid[y][x] = 1; // Mark as corrupted
    }
}

// BFS to find the shortest path
function bfs(startX, startY, endX, endY) {
    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    const queue = [{ x: startX, y: startY, steps: 0 }];
    visited[startY][startX] = true;

    const directions = [
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 },  // down
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 },  // right
    ];

    while (queue.length > 0) {
        const { x, y, steps } = queue.shift();

        if (x === endX && y === endY) {
            console.log(steps);
            return;
        }

        for (const { dx, dy } of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 && nx < gridSize &&
                ny >= 0 && ny < gridSize &&
                !visited[ny][nx] &&
                grid[ny][nx] === 0
            ) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, steps: steps + 1 });
            }
        }
    }

    console.log('No path found');
}

bfs(0, 0, 70, 70);