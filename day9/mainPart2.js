const fs = require('fs');
const path = require('path');

/**
 * Parses the disk map string into an array of blocks.
 * Files are represented by their unique ID, and free spaces by -1.
 * @param {string} input - The disk map string.
 * @returns {number[]} - The memory map array.
 */
function parseDiskMap(input) {
    if (input === '') {
        return [];
    }
    const memoryMap = [];
    let isFile = true; // Flag to alternate between file and free space
    let fileID = 0;

    for (const char of input) {
        const length = parseInt(char, 10);
        if (isNaN(length)) {
            console.error(`Invalid character in disk map: ${char}`);
            process.exit(1);
        }

        if (isFile) {
            // Assign fileID to the next 'length' blocks
            for (let i = 0; i < length; i++) {
                memoryMap.push(fileID);
            }
            fileID++;
        } else {
            // Assign -1 (free space) to the next 'length' blocks
            for (let i = 0; i < length; i++) {
                memoryMap.push(-1);
            }
        }

        // Toggle between file and free space
        isFile = !isFile;
    }

    return memoryMap;
}
/**
 * Part 2: Move entire files to the leftmost possible free space that can fit them.
 * Files are processed in order of decreasing file ID.
 * @param {number[]} memoryMap - The memory map array.
 * @returns {number[]} - The updated memory map after compaction.
 */
function compactify2(memoryMap) {
    // Identify all files with their IDs and sizes
    const files = [];
    let currentFileID = null;
    let currentSize = 0;

    for (let i = 0; i <= memoryMap.length; i++) {
        const block = memoryMap[i];
        if (block !== currentFileID && currentFileID !== null) {
            // End of the current file
            files.push({ id: currentFileID, size: currentSize });
            currentFileID = null;
            currentSize = 0;
        }

        if (block !== -1 && currentFileID === null) {
            // Start of a new file
            currentFileID = block;
            currentSize = 1;
        } else if (block === currentFileID) {
            // Continuation of the current file
            currentSize++;
        }
    }

    // Sort files by decreasing file ID
    files.sort((a, b) => b.id - a.id);

    for (const file of files) {
        const { id, size } = file;

        // Find the leftmost span of free space that can fit the entire file
        let targetStart = -1;
        let gapLength = 0;

        for (let i = 0; i < memoryMap.length; i++) {
            if (memoryMap[i] === -1) {
                gapLength++;
                if (gapLength === size) {
                    targetStart = i - size + 1;
                    break;
                }
            } else {
                gapLength = 0;
            }
        }

        if (targetStart === -1) {
            // No suitable free space found
            continue;
        }

        // Find the current positions of the file blocks
        const filePositions = [];
        for (let i = 0; i < memoryMap.length; i++) {
            if (memoryMap[i] === id) {
                filePositions.push(i);
            }
        }

        if (filePositions.length !== size) {
            console.error(`Mismatch in file size for file ID ${id}`);
            process.exit(1);
        }

        const firstFileBlock = filePositions[0];
        if (firstFileBlock < targetStart) {
            // The file is already to the left; no need to move
            continue;
        }

        // Move the file blocks to the targetStart
        for (let j = 0; j < size; j++) {
            memoryMap[targetStart + j] = id;
            memoryMap[filePositions[j]] = -1;
        }
    }

    return memoryMap;
}

/**
 * Calculates the filesystem checksum.
 * @param {number[]} memoryMap - The memory map array.
 * @param {boolean} skipFree - Whether to skip free spaces (-1).
 * @returns {number} - The calculated checksum.
 */
function calculateChecksum(memoryMap, skipFree = false) {
    let checksum = 0;
    for (let i = 0; i < memoryMap.length; i++) {
        const value = memoryMap[i];
        if (skipFree && value === -1) {
            continue;
        }
        if (!skipFree || value !== -1) {
            checksum += i * value;
        }
    }
    return checksum;
}

/**
 * Main function to execute the disk compaction and checksum calculation.
 */
function main() {
    // Read the input disk map from 'input.txt'
    const filePath = path.join(__dirname, 'input.txt');
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf-8').trim();
    } catch (err) {
        console.error(`Error reading input file: ${err.message}`);
        process.exit(1);
    }

    // Parse the disk map
    const memoryMap = parseDiskMap(content);

    // Clone the memory map for Part 1 and Part 2
    const oneMemoryMap = [...memoryMap];
    const twoMemoryMap = [...memoryMap];

    console.log(`\nInitial Memory Map:`);
    console.log(oneMemoryMap.map(block => (block === -1 ? '.' : block)).join(''));

    // Part 2: Compact by moving entire files
    console.log(`\n--- Part 2: Moving Entire Files ---`);
    console.log(`Started Memory Map Length: ${twoMemoryMap.length}`);
    compactify2(twoMemoryMap);
    console.log(`Ended Memory Map Length: ${twoMemoryMap.length}`);
    console.log(`Final Memory Map after Part 2:`);
    console.log(twoMemoryMap.map(block => (block === -1 ? '.' : block)).join(''));

    // Calculate Part 2 Checksum
    let sumPart2 = 0;
    for (let pos = 0; pos < twoMemoryMap.length; pos++) {
        const value = twoMemoryMap[pos];
        if (value === -1) {
            continue; // Skip free spaces
        }
        sumPart2 += pos * value;
    }
    console.log(`Part 2 Checksum: ${sumPart2}`);
}

// Execute the main function
main();