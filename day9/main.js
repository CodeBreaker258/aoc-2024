// Read the input disk map as a string
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8').trim();

// Parse the disk map into file lengths and free space lengths
const diskLengths = input.split('').map(Number);
let disk = [];
let fileId = 0;
let isFile = true;

// Build the initial disk representation
for (let i = 0; i < diskLengths.length; i++) {
    const length = diskLengths[i];
    if (isFile) {
        // Add blocks for the current file with the file ID
        for (let j = 0; j < length; j++) {
            disk.push(fileId);
        }
        fileId++;
    } else {
        // Add free space blocks represented by -1
        for (let j = 0; j < length; j++) {
            disk.push(-1);
        }
    }
    // Alternate between file and free space
    isFile = !isFile;
}

// Simulate moving file blocks one at a time from the end to the leftmost free space
while (true) {
    // Find the leftmost free space index
    let leftmostFreeIndex = disk.indexOf(-1);
    if (leftmostFreeIndex === -1) {
        // No free space left, disk is compacted
        break;
    }

    // Find the last file block index
    let lastFileIndex = disk.length - 1;
    while (lastFileIndex > leftmostFreeIndex && disk[lastFileIndex] === -1) {
        lastFileIndex--;
    }

    if (lastFileIndex <= leftmostFreeIndex) {
        // No file blocks to move
        break;
    }

    // Move the last file block to the leftmost free space
    disk[leftmostFreeIndex] = disk[lastFileIndex];
    disk[lastFileIndex] = -1;
}

// Calculate the filesystem checksum
let checksum = 0;
for (let i = 0; i < disk.length; i++) {
    if (disk[i] !== -1) {
        // Sum the product of position and file ID
        checksum += i * disk[i];
    }
}

// Output the resulting checksum
console.log(checksum);