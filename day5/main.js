const fs = require('fs');

// Read the input file
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.trim().split('\n');

let index = 0;
const rules = [];

// Parse the rules
while (index < lines.length && lines[index].includes('|')) {
    const [from, to] = lines[index].split('|').map(Number);
    rules.push({ from, to });
    index++;
}

// Skip blank lines
while (index < lines.length && lines[index].trim() === '') {
    index++;
}

// Parse the updates
const updates = [];
for (; index < lines.length; index++) {
    const line = lines[index].trim();
    if (line !== '') {
        const pages = line.split(',').map(Number);
        updates.push(pages);
    }
}

// Build a map for quick lookups
const precedence = new Map();
for (const { from, to } of rules) {
    if (!precedence.has(from)) precedence.set(from, new Set());
    precedence.get(from).add(to);
}

// Function to check if an update is in correct order
function isCorrectOrder(update) {
    const positions = new Map();
    update.forEach((page, idx) => positions.set(page, idx));

    for (const { from, to } of rules) {
        if (positions.has(from) && positions.has(to)) {
            if (positions.get(from) > positions.get(to)) return false;
        }
    }
    return true;
}

// Sum the middle page numbers
let sum = 0;
for (const update of updates) {
    if (isCorrectOrder(update)) {
        const middleIndex = Math.floor(update.length / 2);
        sum += update[middleIndex];
    }
}

console.log(sum);