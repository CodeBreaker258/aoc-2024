const fs = require('fs');

// Step 1: Parse the Input
const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split('').map(Number));
const numRows = input.length;
const numCols = input[0].length;

// Directions: up, down, left, right
const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];

// Step 2: Identify Trailheads
const trailheads = [];
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    if (input[i][j] === 0) {
      trailheads.push([i, j]);
    }
  }
}

// Step 3: Memoization Map
const memo = Array.from({ length: numRows }, () => Array(numCols).fill(null));

// Step 4: DFS to count distinct trails
function countTrails(x, y) {
  if (input[x][y] === 9) {
    return 1;
  }
  if (memo[x][y] !== null) {
    return memo[x][y];
  }
  let totalPaths = 0;
  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (
      nx >= 0 && nx < numRows &&
      ny >= 0 && ny < numCols &&
      input[nx][ny] === input[x][y] + 1
    ) {
      totalPaths += countTrails(nx, ny);
    }
  }
  memo[x][y] = totalPaths;
  return totalPaths;
}

// Step 5 & 6: Calculate Ratings and Sum
let totalRating = 0;
for (const [i, j] of trailheads) {
  totalRating += countTrails(i, j);
}

console.log(totalRating);