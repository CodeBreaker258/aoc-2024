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

function countWays(design, towels, memo = {}) {
    if (design in memo) return memo[design];
    if (design.length === 0) return 1;
    let totalWays = 0;
    for (let towel of towels) {
        if (design.startsWith(towel)) {
            totalWays += countWays(design.slice(towel.length), towels, memo);
        }
    }
    memo[design] = totalWays;
    return totalWays;
}

let totalCount = 0;
for (let design of designs) {
    totalCount += countWays(design, towels);
}

console.log(totalCount);