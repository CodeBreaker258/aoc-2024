const fs = require('fs');

// Read the input file
const data = fs.readFileSync('input.txt', 'utf8');
const lines = data.trim().split('\n');

let totalCalibration = 0;

for (const line of lines) {
    const [testValueStr, numbersStr] = line.split(':');
    const testValue = parseInt(testValueStr.trim());
    const numbers = numbersStr.trim().split(' ').map(Number);

    const n = numbers.length - 1;
    const totalCombos = Math.pow(3, n);
    let possible = false;

    for (let i = 0; i < totalCombos; i++) {
        let result = numbers[0];
        let combo = i;
        for (let j = 0; j < n; j++) {
            const opCode = combo % 3;
            combo = Math.floor(combo / 3);
            const num = numbers[j + 1];

            if (opCode === 0) {
                // Addition
                result += num;
            } else if (opCode === 1) {
                // Multiplication
                result *= num;
            } else {
                // Concatenation
                result = parseInt('' + result + num);
            }
        }
        if (result === testValue) {
            possible = true;
            break;
        }
    }

    if (possible) {
        totalCalibration += testValue;
    }
}

console.log(totalCalibration);