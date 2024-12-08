const fs = require('fs');

// Read the input file, parse per line
const data = fs.readFileSync('input.txt', 'utf8');
const lines = data.trim().split('\n');

let totalCalibration = 0;

for (const line of lines) {
    //Splits each line into the test value and a string of numbers.
    //Parses the test value as an integer.
    //Converts the list of number strings into an array of integers.
    const [testValueStr, numbersStr] = line.split(':');
    const testValue = parseInt(testValueStr.trim());
    const numbers = numbersStr.trim().split(' ').map(Number);

    // Determines the total number of possible operator combinations (2^n), since each position can be either + or *
    const n = numbers.length - 1;
    const totalCombos = 1 << n;
    let possible = false;

    // Loops through all possible combinations of + and *.
    // Uses bit manipulation to decide which operator to use at each position.
    // Evaluates the expression left to right according to the chosen operators.
    // Checks if the result equals the test value
    for (let i = 0; i < totalCombos; i++) {
        let result = numbers[0];
        for (let j = 0; j < n; j++) {
            const op = (i & (1 << j)) ? '+' : '*';
            if (op === '+') {
                result += numbers[j + 1];
            } else {
                result *= numbers[j + 1];
            }
        }
        if (result === testValue) {
            possible = true;
            break;
        }
    }
    //Add the value to the total calibration
    if (possible) {
        totalCalibration += testValue;
    }
}

console.log(totalCalibration);