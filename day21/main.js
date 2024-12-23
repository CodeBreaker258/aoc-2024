const fs = require('fs');
const path = require('path');

const numericKeypad = {
  '7': [0, 0],
  '8': [0, 1],
  '9': [0, 2],
  '4': [1, 0],
  '5': [1, 1],
  '6': [1, 2],
  '1': [2, 0],
  '2': [2, 1],
  '3': [2, 2],
  '0': [3, 1],
  'A': [3, 2],
};

const directions = {
  '^': [-1, 0],
  'v': [1, 0],
  '<': [0, -1],
  '>': [0, 1],
};

const dirKeypadLayout = {
  '^': [0, 1],
  'A': [0, 2],
  '<': [1, 0],
  'v': [1, 1],
  '>': [1, 2],
};

function bfsDirectionalKeypad(startBtn, endBtn) {
  const startPos = dirKeypadLayout[startBtn];
  const endPos = dirKeypadLayout[endBtn];
  const queue = [{ pos: startPos, steps: 0 }];
  const visited = new Set([startPos.toString()]);

  const validDirPad = (r, c) =>
    r >= 0 && r <= 1 && c >= 0 && c <= 2 && !(r === 0 && c === 0);

  while (queue.length) {
    const { pos, steps } = queue.shift();
    if (pos[0] === endPos[0] && pos[1] === endPos[1]) return steps;
    for (const d in directions) {
      const [dr, dc] = directions[d];
      const nr = pos[0] + dr;
      const nc = pos[1] + dc;
      if (!validDirPad(nr, nc)) continue;
      const key = nr + ',' + nc;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos: [nr, nc], steps: steps + 1 });
      }
    }
  }
  return Infinity;
}

function layeredDirectionalCost(moves) {

  const approximatePerPress = 4; 
  return moves * approximatePerPress;
}

// BFS on numeric keypad, but each single step or press is layered cost
function bfsNumericWithLayeredCost(start, target) {
  // Each node in the queue will track total "user-level cost" to reach a numeric keypad (r,c)
  const queue = [{ pos: start, cost: 0 }];
  const visited = new Set([start.toString()]);

  while (queue.length) {
    const { pos, cost } = queue.shift();
    if (pos[0] === target[0] && pos[1] === target[1]) return cost;
    // Explore moves
    for (const d in directions) {
      const [dr, dc] = directions[d];
      const nr = pos[0] + dr;
      const nc = pos[1] + dc;
      // skip out-of-bounds or gap
      if (nr < 0 || nr > 3 || nc < 0 || nc > 2 || (nr === 3 && nc === 0)) continue;

      const key = nr + ',' + nc;
      if (!visited.has(key)) {
        visited.add(key);
        // cost of moving the robotic arm one step on numeric keypad is 1 directional press => layered cost
        // plus no "press" yet. So add layeredDirectionalCost(1)
        queue.push({ pos: [nr, nc], cost: cost + layeredDirectionalCost(1) });
      }
    }
  }
  return Infinity;
}

function numericMoveAndPressCost(start, target) {
  // cost to move from start to target
  const moveCost = bfsNumericWithLayeredCost(start, target);
  // plus cost to press => layeredDirectionalCost(1)
  return moveCost + layeredDirectionalCost(1);
}

function calculateSequenceLength(code) {
  let total = 0;
  let currentPos = numericKeypad['A'];
  for (const char of code) {
    const targetPos = numericKeypad[char];
    total += numericMoveAndPressCost(currentPos, targetPos);
    currentPos = targetPos;
  }
  return total;
}

const inputPath = path.join(__dirname, 'input.txt');
const codes = fs.readFileSync(inputPath, 'utf-8').trim().split('\n');

let sum = 0;
for (const code of codes) {
  const numericPart = parseInt(code.slice(0, -1), 10);
  const seqLen = calculateSequenceLength(code);
  sum += seqLen * numericPart;
}

console.log(sum);