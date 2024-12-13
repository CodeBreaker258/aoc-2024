const fs = require('fs');

let stones = fs.readFileSync('input.txt', 'utf-8').trim().split(/\s+/);

const blinks = 25;

for (let i = 0; i < blinks; i++) {
    let newStones = [];
    for (let stone of stones) {
        if (stone === '0') {
            newStones.push('1');
        } else if (stone.length % 2 === 0) {
            let half = stone.length / 2;
            let left = stone.slice(0, half).replace(/^0+/, '') || '0';
            let right = stone.slice(half).replace(/^0+/, '') || '0';
            newStones.push(left, right);
        } else {
            let num = BigInt(stone);
            let newNum = num * 2024n;
            newStones.push(newNum.toString());
        }
    }
    stones = newStones;
}

console.log(stones.length);