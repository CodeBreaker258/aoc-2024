const fs = require('fs');

// Read the input file
const data = fs.readFileSync('input.txt', 'utf8');

// Parse the input data
const lines = data.trim().split('\n');
let leftList = [];
let rightList = [];

lines.forEach(line => {
    const [left, right] = line.split(/\s+/).map(Number);
    leftList.push(left);
    rightList.push(right);
});

// Sort both lists
leftList.sort((a, b) => a - b);
rightList.sort((a, b) => a - b);

// Calculate the absolute distance
let totalDistance = 0;
for (let i = 0; i < leftList.length; i++) {
    totalDistance += Math.abs(leftList[i] - rightList[i]);
}

console.log('Total Distance:', totalDistance);