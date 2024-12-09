const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trim();
const lines = input.split('\n');
const height = lines.length;
const width = lines[0].length;
const antennas = {};

// Collect antennas by frequency
for (let y = 0; y < height; y++) {
  const line = lines[y];
  for (let x = 0; x < width; x++) {
    const char = line[x];
    if (/[a-zA-Z0-9]/.test(char)) {
      if (!antennas[char]) antennas[char] = [];
      antennas[char].push({ x, y });
    }
  }
}

const antinodes = new Set();

function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

for (const freq in antennas) {
  const positions = antennas[freq];
  const n = positions.length;
  for (let i = 0; i < n; i++) {
    const A = positions[i];
    for (let j = i + 1; j < n; j++) {
      const B = positions[j];
      let dx = B.x - A.x;
      let dy = B.y - A.y;
      const stepGCD = gcd(dx, dy);
      dx /= stepGCD;
      dy /= stepGCD;

      // Include positions along the line in both directions
      const points = [];

      // From A towards B
      let x = A.x;
      let y = A.y;
      while (x >= 0 && x < width && y >= 0 && y < height) {
        const key = `${x},${y}`;
        antinodes.add(key);
        x += dx;
        y += dy;
      }

      // From A in the opposite direction
      x = A.x - dx;
      y = A.y - dy;
      while (x >= 0 && x < width && y >= 0 && y < height) {
        const key = `${x},${y}`;
        antinodes.add(key);
        x -= dx;
        y -= dy;
      }
    }
  }
}

console.log(antinodes.size);