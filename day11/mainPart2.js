const fs = require('fs');

let stones = fs.readFileSync('input.txt', 'utf-8').trim().split(/\s+/);

const blinks = 75;

let stoneCounts = {};

// Initialize the stone counts
for (let stone of stones) {
    stoneCounts[stone] = (stoneCounts[stone] || 0n) + 1n;
}

for (let i = 0; i < blinks; i++) {
    let newStoneCounts = {};
    for (let stone in stoneCounts) {
        let count = stoneCounts[stone];
        if (stone === '0') {
            newStoneCounts['1'] = (newStoneCounts['1'] || 0n) + count;
        } else if (stone.length % 2 === 0) {
            let half = stone.length / 2;
            let left = stone.slice(0, half).replace(/^0+/, '') || '0';
            let right = stone.slice(half).replace(/^0+/, '') || '0';
            newStoneCounts[left] = (newStoneCounts[left] || 0n) + count;
            newStoneCounts[right] = (newStoneCounts[right] || 0n) + count;
        } else {
            let num = BigInt(stone);
            let newNum = num * 2024n;
            let newStone = newNum.toString();
            newStoneCounts[newStone] = (newStoneCounts[newStone] || 0n) + count;
        }
    }
    stoneCounts = newStoneCounts;
}

let totalStones = Object.values(stoneCounts).reduce((a, b) => a + b, 0n);

console.log(totalStones.toString());
