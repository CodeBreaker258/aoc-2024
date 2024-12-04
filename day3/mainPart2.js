const fs = require('fs');

// Read the input file
const data = fs.readFileSync('input.txt', 'utf8');
const inputString = data.trim();

let totalSum = 0;
let mulEnabled = true;

const instructionRegex = /(do\(\))|(don't\(\))|mul\((\d{1,3}),(\d{1,3})\)/g;

let match;
while ((match = instructionRegex.exec(inputString)) !== null) {
    if (match[1]) {
        // Matched 'do()'
        mulEnabled = true;
    } else if (match[2]) {
        // Matched "don't()"
        mulEnabled = false;
    } else if (match[3] && mulEnabled) {
        // Matched 'mul(X,Y)' and mul is enabled
        const number1 = parseInt(match[3], 10);
        const number2 = parseInt(match[4], 10);
        totalSum += number1 * number2;
    }
}

console.log(`Total sum of all multiplied numbers: ${totalSum}`);