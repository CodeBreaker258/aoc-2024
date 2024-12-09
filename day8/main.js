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

for (const freq in antennas) {
  const positions = antennas[freq];
  const n = positions.length;
  for (let i = 0; i < n; i++) {
    const A = positions[i];
    for (let j = i + 1; j < n; j++) {
      const B = positions[j];
      const dx = A.x - B.x;
      const dy = A.y - B.y;
      const D = { x: dx, y: dy };

      // Antinodes occur at positions where one antenna is twice as far as the other
      const tValues = [-1, 2];

      for (const t of tValues) {
        const Px = B.x + t * D.x;
        const Py = B.y + t * D.y;
        if (
          Number.isInteger(Px) &&
          Number.isInteger(Py) &&
          Px >= 0 &&
          Px < width &&
          Py >= 0 &&
          Py < height
        ) {
          const key = `${Px},${Py}`;
          antinodes.add(key);
        }
      }
    }
  }
}

console.log(antinodes.size);