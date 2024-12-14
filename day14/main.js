const fs = require('fs');

// Grid dimensions
const width = 101;
const height = 103;

// Read input from 'input.txt'
const input = fs.readFileSync('input.txt', 'utf-8');

// Parse the input
const robots = input.trim().split('\n').map(line => {
    const parts = line.split(' ');
    const p = parts[0].slice(2).split(',').map(Number);
    const v = parts[1].slice(2).split(',').map(Number);
    return { x: p[0], y: p[1], vx: v[0], vy: v[1] };
});

// Simulate movement for 100 seconds
robots.forEach(robot => {
    robot.x = (robot.x + robot.vx * 100) % width;
    robot.y = (robot.y + robot.vy * 100) % height;
    if (robot.x < 0) robot.x += width;
    if (robot.y < 0) robot.y += height;
});

// Determine center lines
const centerX = Math.floor(width / 2);
const centerY = Math.floor(height / 2);

// Initialize quadrant counts
const quadrants = {
    Q1: 0, // Top-Left
    Q2: 0, // Top-Right
    Q3: 0, // Bottom-Left
    Q4: 0  // Bottom-Right
};

// Count robots in each quadrant
robots.forEach(robot => {
    if (robot.x === centerX || robot.y === centerY) return; // Ignore central lines
    if (robot.x < centerX && robot.y < centerY) quadrants.Q1++;
    else if (robot.x > centerX && robot.y < centerY) quadrants.Q2++;
    else if (robot.x < centerX && robot.y > centerY) quadrants.Q3++;
    else if (robot.x > centerX && robot.y > centerY) quadrants.Q4++;
});

// Calculate safety factor
const safetyFactor = quadrants.Q1 * quadrants.Q2 * quadrants.Q3 * quadrants.Q4;

console.log('Safety Factor after 100 seconds:', safetyFactor);