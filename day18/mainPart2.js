const fs = require('fs');

// Read all coordinates from input.txt
const data = fs.readFileSync('input.txt', 'utf8');
const lines = data.trim().split('\n');

const gridSize = 71;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

function bfs(startX, startY, endX, endY) {
    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    const queue = [{ x: startX, y: startY }];
    visited[startY][startX] = true;

    const directions = [
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 },  // down
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 },  // right
    ];

    while (queue.length > 0) {
        const { x, y } = queue.shift();

        if (x === endX && y === endY) {
            return true; // Path exists
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
                queue.push({ x: nx, y: ny });
            }
        }
    }

    return false; // No path found
}

for (let i = 0; i < lines.length; i++) {
    const [xStr, yStr] = lines[i].split(',');
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);

    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        grid[y][x] = 1; // Mark as corrupted
    }

    // Check if path is still available
    if (!bfs(0, 0, gridSize - 1, gridSize - 1)) {
        console.log(`${x},${y}`);
        break;
    }
}