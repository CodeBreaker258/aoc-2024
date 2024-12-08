const fs = require('fs');

// Read the input file
const input = fs.readFileSync('input.txt', 'utf8');

// Parse the grid into a 2D array
let grid = input.split('\n').map(line => line.split(''));

const numRows = grid.length;
const numCols = grid[0].length;

// Define directions and their corresponding movements
const directions = ['up', 'right', 'down', 'left'];
const moves = {
    'up': [-1, 0],
    'right': [0, 1],
    'down': [1, 0],
    'left': [0, -1]
};

// Map symbols to directions
const dirSymbols = {
    '^': 'up',
    '>': 'right',
    'v': 'down',
    '<': 'left'
};

// Find the starting position and direction of the guard
let posRow, posCol, dir;

outerLoop:
for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
        let cell = grid[i][j];
        if (cell in dirSymbols) {
            posRow = i;
            posCol = j;
            dir = dirSymbols[cell];
            grid[i][j] = '.'; // Replace the starting symbol with empty space
            break outerLoop;
        }
    }
}

// Set to keep track of visited positions
let visited = new Set();
visited.add(`${posRow},${posCol}`);

while (true) {
    // Compute the next position
    let [dRow, dCol] = moves[dir];
    let newRow = posRow + dRow;
    let newCol = posCol + dCol;

    // Check if the guard is about to leave the grid
    if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols) {
        break;
    }

    let cellAhead = grid[newRow][newCol];

    if (cellAhead === '#') {
        // Turn right 90 degrees
        let dirIndex = directions.indexOf(dir);
        dirIndex = (dirIndex + 1) % 4;
        dir = directions[dirIndex];
    } else {
        // Move forward
        posRow = newRow;
        posCol = newCol;
        visited.add(`${posRow},${posCol}`);
    }
}

// Output the number of distinct positions visited
console.log(visited.size);