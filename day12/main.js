const fs = require('fs');

function main() {
    const input = fs.readFileSync('input.txt', 'utf8');
    const lines = input.split('\n');

    const grid = [];
    for (let line of lines) {
        if (line.startsWith('#') || !line.trim()) {
            continue;
        }
        grid.push(line.trim().split(''));
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from(Array(rows), () => Array(cols).fill(false));

    let totalPrice = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                const plantType = grid[i][j];
                let area = 0;
                let perimeter = 0;
                const queue = [];
                queue.push([i, j]);
                visited[i][j] = true;

                while (queue.length > 0) {
                    const [ci, cj] = queue.shift();
                    area += 1;

                    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
                    for (const [dx, dy] of directions) {
                        const ni = ci + dx;
                        const nj = cj + dy;

                        if (ni < 0 || nj < 0 || ni >= rows || nj >= cols) {
                            perimeter += 1;
                        } else if (grid[ni][nj] !== plantType) {
                            perimeter += 1;
                        } else if (!visited[ni][nj]) {
                            queue.push([ni, nj]);
                            visited[ni][nj] = true;
                        }
                    }
                }

                totalPrice += area * perimeter;
            }
        }
    }

    console.log(totalPrice);
}

main();