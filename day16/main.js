// Require the file system module to read the input file
const fs = require('fs');

// Read the input file and parse it into a 2D array
const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(line => line.split(''));

const numRows = input.length;
const numCols = input[0].length;

let start = null;
let end = null;

// Find the starting (S) and ending (E) positions in the maze
for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
        if (input[y][x] === 'S') {
            start = { x, y };
        }
        if (input[y][x] === 'E') {
            end = { x, y };
        }
    }
}

// Define the possible directions and their movements
const directions = [
    { dx: 0, dy: -1, name: 'N' }, // North
    { dx: 1, dy: 0, name: 'E' },  // East
    { dx: 0, dy: 1, name: 'S' },  // South
    { dx: -1, dy: 0, name: 'W' }, // West
];

// Helper function to create a unique key for each state
function key(x, y, dirIndex) {
    return `${x},${y},${dirIndex}`;
}

// Priority queue implementation for the search algorithm
class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(element) {
        this.heap.push(element);
        this.heapifyUp();
    }

    dequeue() {
        if (this.size() === 0) return null;
        const top = this.heap[0];
        const end = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = end;
            this.heapifyDown();
        }
        return top;
    }

    size() {
        return this.heap.length;
    }

    // Move the last element up to maintain heap property
    heapifyUp() {
        let index = this.size() - 1;
        const element = this.heap[index];
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];
            if (element.cost >= parent.cost) break;
            this.heap[index] = parent;
            this.heap[parentIndex] = element;
            index = parentIndex;
        }
    }

    // Move the first element down to maintain heap property
    heapifyDown() {
        let index = 0;
        const length = this.size();
        const element = this.heap[0];
        while (true) {
            let leftChildIndex = index * 2 + 1;
            let rightChildIndex = index * 2 + 2;
            let swapIndex = null;

            if (leftChildIndex < length) {
                let leftChild = this.heap[leftChildIndex];
                if (leftChild.cost < element.cost) {
                    swapIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                let rightChild = this.heap[rightChildIndex];
                if ((swapIndex === null && rightChild.cost < element.cost) ||
                    (swapIndex !== null && rightChild.cost < this.heap[swapIndex].cost)) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === null) break;

            this.heap[index] = this.heap[swapIndex];
            this.heap[swapIndex] = element;
            index = swapIndex;
        }
    }
}

let visited = new Set();
let pq = new PriorityQueue();

// Start facing East and enqueue the starting state
const startDirIndex = directions.findIndex(dir => dir.name === 'E');
pq.enqueue({
    x: start.x,
    y: start.y,
    dirIndex: startDirIndex,
    cost: 0
});

// Perform a search to find the lowest cost path
while (pq.size() > 0) {
    const state = pq.dequeue();
    const { x, y, dirIndex, cost } = state;

    // Check if we've reached the end position
    if (x === end.x && y === end.y) {
        console.log(cost);
        process.exit(0);
    }

    // Skip if this state has already been visited
    const stateKey = key(x, y, dirIndex);
    if (visited.has(stateKey)) {
        continue;
    }
    visited.add(stateKey);

    // Attempt to move forward in the current direction
    const dir = directions[dirIndex];
    const nx = x + dir.dx;
    const ny = y + dir.dy;
    if (nx >= 0 && nx < numCols && ny >= 0 && ny < numRows && input[ny][nx] !== '#') {
        pq.enqueue({
            x: nx,
            y: ny,
            dirIndex: dirIndex, // Keep the same direction
            cost: cost + 1      // Moving forward costs 1
        });
    }

    // Rotate counterclockwise (left turn)
    const leftDirIndex = (dirIndex + 3) % 4;
    const leftStateKey = key(x, y, leftDirIndex);
    if (!visited.has(leftStateKey)) {
        pq.enqueue({
            x: x,
            y: y,
            dirIndex: leftDirIndex,
            cost: cost + 1000   // Turning costs 1000
        });
    }

    // Rotate clockwise (right turn)
    const rightDirIndex = (dirIndex + 1) % 4;
    const rightStateKey = key(x, y, rightDirIndex);
    if (!visited.has(rightStateKey)) {
        pq.enqueue({
            x: x,
            y: y,
            dirIndex: rightDirIndex,
            cost: cost + 1000   // Turning costs 1000
        });
    }
}

// If no path is found, output a message
console.log('No path found');
console.log("Score of Reindeer (shortest movement):",cost);