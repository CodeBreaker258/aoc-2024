// Run solution
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
const alignedSeconds = findAlignmentTime(input);
console.log(`Fewest seconds for alignment: ${alignedSeconds}`);


function parseInput(input) {
    return input.split('\n').map(line => {
        const [pos, vel] = line.split(' v=');
        const [px, py] = pos.substring(2).split(',').map(Number);
        const [vx, vy] = vel.split(',').map(Number);
        return { pos: { x: px, y: py }, vel: { x: vx, y: vy } };
    });
}

function getPositionAtTime(point, seconds) {
    return {
        x: point.pos.x + (point.vel.x * seconds),
        y: point.pos.y + (point.vel.y * seconds)
    };
}

function checkAlignment(points, seconds) {
    const positions = points.map(p => getPositionAtTime(p, seconds));
    
    // Find bounds
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    
    // Check if points are in a reasonable area to form letters
    const heightSpread = maxY - minY;
    const widthSpread = maxX - minX;
    
    if (heightSpread <= 10 && widthSpread <= 100) {
        // Visualize the potential message
        const grid = visualizePoints(positions, minX, maxX, minY, maxY);
        console.log('\nPossible message found at', seconds, 'seconds:');
        console.log(grid.join('\n'));
        return true;
    }
    return false;
}

function visualizePoints(positions, minX, maxX, minY, maxY) {
    // Normalize coordinates and create display grid
    const grid = [];
    for (let y = minY; y <= maxY; y++) {
        let row = '';
        for (let x = minX; x <= maxX; x++) {
            if (positions.some(p => Math.round(p.x) === x && Math.round(p.y) === y)) {
                row += '#';
            } else {
                row += '.';
            }
        }
        grid.push(row);
    }
    return grid;
}

function findAlignmentTime(input) {
    const points = parseInput(input);
    let seconds = 0;
    const MAX_SECONDS = 15000; // Reduced max time

    while (seconds < MAX_SECONDS) {
        if (checkAlignment(points, seconds)) {
            return seconds;
        }
        seconds++;
    }
    return -1;
}

