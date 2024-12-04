const fs = require('fs');

// Read the input file
const data = fs.readFileSync('input2.txt', 'utf8');

const lines = data.trim().split('\n');
let totalSafe = 0;

lines.forEach(line => {
    if (validateSafe(line)|| canBeMadeSafe(line)) {
        totalSafe++;
    }
});

console.log(`Total safe lines: ${totalSafe}`);

function validateSafe(line) {
    // Get numbers from line
    const levels = line.split(' ').map(Number);
    let isIncreasing = true;
    let isDecreasing = true;

    for (let i = 1; i < levels.length; i++) {
        const diff = Math.abs(levels[i] - levels[i - 1]);
        if (diff < 1 || diff > 3) {
            return false;
        }
        if (levels[i] <= levels[i - 1]) {
            isIncreasing = false;
        }
        if (levels[i] >= levels[i - 1]) {
            isDecreasing = false;
        }
    }

    return isIncreasing || isDecreasing;
}
function canBeMadeSafe(line) {
    const levels = line.split(' ').map(Number);

    for (let i = 0; i < levels.length; i++) {
        //Shallow copy, take data up to i & everthing after and combines the two slices
        const newLevels = levels.slice(0, i).concat(levels.slice(i + 1));
        if (validateSafe(newLevels.join(' '))) {
            return true;
        }
    }

    return false;
}
