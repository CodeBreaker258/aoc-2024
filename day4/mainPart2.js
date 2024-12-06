const fs = require('fs');

// Read the input file and create the grid
const data = fs.readFileSync('input.txt', 'utf8');
const lines = data.trim().split('\n');
const grid = lines.map(line => line.trim().split(''));

const numRows = grid.length;
const numCols = grid[0].length;
let count = 0;

// Directions for diagonals
const dir1 = [-1, -1]; // Top-left to bottom-right
const dir2 = [-1,  1]; // Top-right to bottom-left

for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (grid[row][col] === 'A') {
        let valid1 = false;
        let valid2 = false;
  
        // Check diagonal from top-left to bottom-right
        // Check diagonal from top-left to bottom-right
if (
    row - 1 >= 0 && col - 1 >= 0 &&
    row + 1 < numRows && col + 1 < numCols &&
    (
      (grid[row - 1][col - 1] === 'M' && grid[row + 1][col + 1] === 'S') ||
      (grid[row - 1][col - 1] === 'S' && grid[row + 1][col + 1] === 'M')
    )
  ) {
    valid1 = true;
  }
  
  // Check diagonal from top-right to bottom-left
  if (
    row - 1 >= 0 && col + 1 < numCols &&
    row + 1 < numRows && col - 1 >= 0 &&
    (
      (grid[row - 1][col + 1] === 'M' && grid[row + 1][col - 1] === 'S') ||
      (grid[row - 1][col + 1] === 'S' && grid[row + 1][col - 1] === 'M')
    )
  ) {
    valid2 = true;
  }
  
  // If both diagonals form 'MAS' or 'SAM', increment count
  if (valid1 && valid2) {
    count++;
  }
      }
    }
  }
  
  console.log(`Number of X-MAS patterns found: ${count}`);