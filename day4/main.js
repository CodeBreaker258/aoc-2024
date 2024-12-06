const fs = require('fs');

// Read the input file
const data = fs.readFileSync('input.txt', 'utf8');
const lines = data.trim().split('\n');
const grid = lines.map(line => line.trim().split(''));

const numRows = grid.length;
const numCols = grid[0].length;
const word = 'XMAS';
let count = 0;

// Directions: N, NE, E, SE, S, SW, W, NW
const directions = [
  [-1,  0], // N
  [-1,  1], // NE
  [ 0,  1], // E
  [ 1,  1], // SE
  [ 1,  0], // S
  [ 1, -1], // SW
  [ 0, -1], // W
  [-1, -1]  // NW
];

for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    for (let [dx, dy] of directions) {
      let match = true;
      for (let k = 0; k < word.length; k++) {
        const x = row + k * dx;
        const y = col + k * dy;
        if (x < 0 || x >= numRows || y < 0 || y >= numCols || grid[x][y] !== word[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        count++;
      }
    }
  }
}

console.log(`The word "XMAS" appears ${count} times in the grid.`);