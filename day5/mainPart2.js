const fs = require('fs');

// Read the input file
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.trim().split('\n');

let index = 0;
const rules = [];

// Parse the rules
while (index < lines.length && lines[index].includes('|')) {
    const [from, to] = lines[index].split('|').map(Number);
    rules.push({ from, to });
    index++;
}

// Skip blank lines
while (index < lines.length && lines[index].trim() === '') {
    index++;
}

// Parse the updates
const updates = [];
for (; index < lines.length; index++) {
    const line = lines[index].trim();
    if (line !== '') {
        const pages = line.split(',').map(Number);
        updates.push(pages);
    }
}

// Function to check if an update is in correct order
function isCorrectOrder(update) {
    const positions = new Map();
    update.forEach((page, idx) => positions.set(page, idx));

    for (const { from, to } of rules) {
        if (positions.has(from) && positions.has(to)) {
            if (positions.get(from) > positions.get(to)) return false;
        }
    }
    return true;
}

// Function to reorder an update according to the rules
function reorderUpdate(update) {
    // Build a subgraph for the pages in the update
    const pagesSet = new Set(update);
    const graph = new Map();
    const inDegree = new Map();

    // Initialize graph and in-degree
    for (const page of pagesSet) {
        graph.set(page, []);
        inDegree.set(page, 0);
    }

    // Add edges based on rules
    for (const { from, to } of rules) {
        if (pagesSet.has(from) && pagesSet.has(to)) {
            graph.get(from).push(to);
            inDegree.set(to, inDegree.get(to) + 1);
        }
    }

    // Topological sort
    const queue = [];
    for (const [node, degree] of inDegree) {
        if (degree === 0) queue.push(node);
    }

    const sorted = [];
    while (queue.length > 0) {
        const node = queue.shift();
        sorted.push(node);
        for (const neighbor of graph.get(node)) {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }

    // If sorting is not possible (cycle detected), return original update
    if (sorted.length !== pagesSet.size) return update;

    return sorted;
}

// Sum the middle page numbers after reordering incorrectly ordered updates
let sum = 0;
for (const update of updates) {
    if (!isCorrectOrder(update)) {
        const reordered = reorderUpdate(update);
        const middleIndex = Math.floor(reordered.length / 2);
        sum += reordered[middleIndex];
    }
}

console.log(sum);