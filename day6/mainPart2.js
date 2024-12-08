const fs = require('fs');

// Read the input file
const input = fs.readFileSync('input.txt', 'utf8');

// Parse the grid into a 2D array
let originalGrid = input.split('\n').map(line => line.split(''));

const numRows = originalGrid.length;
const numCols = originalGrid[0].length;

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
let startRow, startCol, startDir;

outerLoop:
for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
        let cell = originalGrid[i][j];
        if (cell in dirSymbols) {
            startRow = i;
            startCol = j;
            startDir = dirSymbols[cell];
            break outerLoop;
        }
    }
}

// Function to simulate the guard's movement
function simulate(grid) {
    let posRow = startRow;
    let posCol = startCol;
    let dir = startDir;

    // Visited positions with direction
    let visitedStates = new Set();
    visitedStates.add(`${posRow},${posCol},${dir}`);

    while (true) {
        let [dRow, dCol] = moves[dir];
        let newRow = posRow + dRow;
        let newCol = posCol + dCol;

        // Check if the guard is about to leave the grid
        if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols) {
            return false; // Guard leaves the grid
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
        }

        let state = `${posRow},${posCol},${dir}`;
        if (visitedStates.has(state)) {
            return true; // Guard is in a loop
        }
        visitedStates.add(state);
    }
}

// Count the number of positions where adding an obstruction causes the guard to loop
let count = 0;

for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
        // Skip if cell is not empty or is the starting position
        if (originalGrid[i][j] !== '.' || (i === startRow && j === startCol)) {
            continue;
        }

        // Create a copy of the grid
        let grid = originalGrid.map(row => row.slice());

        // Place an obstruction at (i, j)
        grid[i][j] = '#';

        // Simulate the guard's movement
        if (simulate(grid)) {
            count++;
        }
    }
}

// Output the total count
console.log(count);