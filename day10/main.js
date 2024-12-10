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

// Step 3: DFS to find reachable 9s
function dfs(x, y, currentHeight, visited) {
  if (currentHeight === 9) {
    return new Set([[x, y].toString()]);
  }
  let reachable = new Set();
  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (
      nx >= 0 && nx < numRows &&
      ny >= 0 && ny < numCols &&
      input[nx][ny] === currentHeight + 1 &&
      !visited.has([nx, ny].toString())
    ) {
      visited.add([nx, ny].toString());
      const result = dfs(nx, ny, input[nx][ny], visited);
      for (const pos of result) {
        reachable.add(pos);
      }
    }
  }
  return reachable;
}

// Step 4 & 5: Calculate Scores and Sum
let totalScore = 0;
for (const [i, j] of trailheads) {
  const reachable9s = dfs(i, j, 0, new Set([`${i},${j}`]));
  totalScore += reachable9s.size;
}

console.log(totalScore);