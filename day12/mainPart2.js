const fs = require('fs');

function main() {
    const input = fs.readFileSync('input.txt', 'utf8');
    const lines = input.split('\n').filter(line => line.trim() && !line.startsWith('#'));

    const grid = lines.map(line => line.trim().split(''));
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from(Array(rows), () => Array(cols).fill(false));

    let totalPrice = 0;

    const directions = [
        { dx: -1, dy: 0, type: 'horizontal' }, // top
        { dx: 1, dy: 0, type: 'horizontal' },  // bottom
        { dx: 0, dy: -1, type: 'vertical' },   // left
        { dx: 0, dy: 1, type: 'vertical' }     // right
    ];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                const plantType = grid[i][j];
                let area = 0;
                const horizontalFences = new Set();
                const verticalFences = new Set();
                const queue = [];
                queue.push([i, j]);
                visited[i][j] = true;

                while (queue.length > 0) {
                    const [ci, cj] = queue.shift();
                    area += 1;

                    for (const { dx, dy, type } of directions) {
                        const ni = ci + dx;
                        const nj = cj + dy;

                        if (ni < 0 || nj < 0 || ni >= rows || nj >= cols || grid[ni][nj] !== plantType) {
                            if (type === 'horizontal') {
                                // Represent horizontal fence by its row and column
                                horizontalFences.add(`${ci},${cj}`);
                            } else {
                                // Represent vertical fence by its row and column
                                verticalFences.add(`${ci},${cj}`);
                            }
                        } else if (!visited[ni][nj]) {
                            queue.push([ni, nj]);
                            visited[ni][nj] = true;
                        }
                    }
                }

                // Function to count contiguous segments
                const countSegments = (fences, orientation) => {
                    const fenceMap = {};

                    fences.forEach(fence => {
                        const [r, c] = fence.split(',').map(Number);
                        if (orientation === 'horizontal') {
                            if (!fenceMap[r]) fenceMap[r] = [];
                            fenceMap[r].push(c);
                        } else {
                            if (!fenceMap[c]) fenceMap[c] = [];
                            fenceMap[c].push(r);
                        }
                    });

                    let segments = 0;
                    for (const key in fenceMap) {
                        const sorted = fenceMap[key].sort((a, b) => a - b);
                        let prev = -2;
                        sorted.forEach(pos => {
                            if (pos !== prev + 1) {
                                segments += 1;
                            }
                            prev = pos;
                        });
                    }
                    return segments;
                };

                const horizontalSegments = countSegments(horizontalFences, 'horizontal');
                const verticalSegments = countSegments(verticalFences, 'vertical');
                const numberOfSides = horizontalSegments + verticalSegments;

                totalPrice += area * numberOfSides;
            }
        }
    }

    console.log(totalPrice);
}

main();