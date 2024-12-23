const fs = require('fs');

// Read and parse input
const rawInput = fs.readFileSync('input.txt', 'utf8');
const lines = rawInput.split('\n').filter(line => line);
const grid = lines.map(line => line.split(''));

// Find start/end
let start = null, end = null;
for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[0].length; c++) {
    if (grid[r][c] === 'S') start = [r, c];
    if (grid[r][c] === 'E') end = [r, c];
  }
}

function isValid(r, c) {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
}

// Priority Queue implementation using Min-Heap
class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  
  enqueue(item, priority) {
    this.heap.push({ item, priority });
    this.bubbleUp(this.heap.length - 1);
  }
  
  dequeue() {
    const first = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return first;
  }
  
  bubbleUp(index) {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].priority <= this.heap[index].priority) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }
  
  bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1, right = 2 * index + 2, smallest = index;
      if (left < length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest === index) break;
      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
  
  isEmpty() {
    return this.heap.length === 0;
  }
}

// Heuristic: Manhattan distance
function heuristic(r, c) {
  return Math.abs(r - end[0]) + Math.abs(c - end[1]);
}

// BFS with A* and cheat optimization
function bfsCheat() {
  const pq = new PriorityQueue();
  const visited = new Set();
  const cheatSaves = new Map();
  
  // State: r, c, cheatUsed (0 or 1), cheatLeft
  pq.enqueue([start[0], start[1], 0, 2], heuristic(start[0], start[1]));
  visited.add(`0,${start[0]},${start[1]},0,2`);
  
  while (!pq.isEmpty()) {
    const current = pq.dequeue().item;
    const [r, c, cheatUsed, cheatLeft] = current;
    
    if (r === end[0] && c === end[1]) {
      // Calculate saving and store
      // Implement saving logic based on noCheatDist if needed
      continue;
    }
    
    for (const [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (!isValid(nr, nc)) continue;
      const isWall = grid[nr][nc] === '#';
      
      // Option 1: Move normally
      if (!isWall) {
        const key = `0,${nr},${nc},${cheatUsed},${cheatLeft}`;
        if (!visited.has(key)) {
          visited.add(key);
          pq.enqueue([nr, nc, cheatUsed, cheatLeft], heuristic(nr, nc));
        }
      }
      
      // Option 2: Use cheat if possible
      if (isWall && cheatUsed === 0 && cheatLeft > 0) {
        const newCheatUsed = 1;
        const newCheatLeft = cheatLeft - 1;
        const key = `1,${nr},${nc},${newCheatUsed},${newCheatLeft}`;
        if (!visited.has(key)) {
          visited.add(key);
          pq.enqueue([nr, nc, newCheatUsed, newCheatLeft], heuristic(nr, nc));
          // Record cheat save logic here
        }
      }
      
      // Continue using cheat if already started
      if (cheatUsed === 1 && cheatLeft > 0 && isWall) {
        const key = `1,${nr},${nc},${cheatUsed},${cheatLeft - 1}`;
        if (!visited.has(key)) {
          visited.add(key);
          pq.enqueue([nr, nc, cheatUsed, cheatLeft - 1], heuristic(nr, nc));
        }
      }
    }
  }
  
  return cheatSaves;
}

// Normal BFS to find no-cheat distance
function bfsNoCheat() {
  const queue = [[start[0], start[1], 0]];
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);
  
  while (queue.length) {
    const [r, c, d] = queue.shift();
    if (r === end[0] && c === end[1]) return d;
    for (const [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (isValid(nr, nc) && grid[nr][nc] !== '#' && !visited.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        queue.push([nr, nc, d + 1]);
      }
    }
  }
  return Infinity;
}

// Run BFS with cheat
const noCheatDist = bfsNoCheat();
const cheatMap = bfsCheat();

// Count how many cheats save 100 or more picoseconds
let count100 = 0;
for (const saving of cheatMap.values()) {
  if (saving >= 100) count100++;
}
console.log(count100);