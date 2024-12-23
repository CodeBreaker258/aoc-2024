const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

// Get towel patterns
const towelsLine = input.shift();
const towels = towelsLine.split(',').map(s => s.trim());

// Skip empty lines
while (input.length && input[0].trim() === '') {
    input.shift();
}

// Get designs
const designs = input.map(s => s.trim()).filter(s => s.length > 0);

function canForm(design, towels, memo = {}) {
    if (design in memo) return memo[design];
    if (design.length === 0) return true;
    for (let towel of towels) {
        if (design.startsWith(towel)) {
            if (canForm(design.slice(towel.length), towels, memo)) {
                memo[design] = true;
                return true;
            }
        }
    }
    memo[design] = false;
    return false;
}

let count = 0;
for (let design of designs) {
    if (canForm(design, towels)) {
        count++;
    }
}

console.log(count);