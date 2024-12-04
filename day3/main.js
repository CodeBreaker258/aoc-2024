const fs = require('fs');

// Read the input file
const data = fs.readFileSync('input.txt', 'utf8');

const lines = data.trim().split('\n');
let totalSum = 0;

//Constructs regex to match criteria:
//mul(number1, number2) where number1 and number2 are 1-3 digit numbers
const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

lines.forEach(line => {
    let match;
    //regex.exec finds all the matches
    while ((match = regex.exec(line)) !== null) {
        //Parses the string to return an integer as a base10 (standard numeric output)
        const number1 = parseInt(match[1], 10);
        const number2 = parseInt(match[2], 10);
        totalSum += number1 * number2;
    }
});
console.log(`Total sum of all multiplied numbers: ${totalSum}`);