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

// Count occurrences of each number in the right list
const rightCount = {};
rightList.forEach(number => {
    if (rightCount[number]) {
        rightCount[number]++;
    } else {
        rightCount[number] = 1;
    }
});

// Calculate the total similarity score
let totalSimilarityScore = 0;
leftList.forEach(number => {
    if (rightCount[number]) {
        totalSimilarityScore += number * rightCount[number];
    }
});

console.log('Total Similarity Score:', totalSimilarityScore);