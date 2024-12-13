const fs = require('fs');

function parseInput(data) {
    const machines = [];
    const lines = data.split('\n').filter(line => line.trim() !== '');
    for (let i = 0; i < lines.length; i += 3) {
        const buttonA = lines[i].match(/Button A: X\+(\d+), Y\+(\d+)/);
        const buttonB = lines[i+1].match(/Button B: X\+(\d+), Y\+(\d+)/);
        const prize = lines[i+2].match(/Prize: X=(\d+), Y=(\d+)/);
        if (buttonA && buttonB && prize) {
            machines.push({
                A: {x: parseInt(buttonA[1]), y: parseInt(buttonA[2]), cost: 3},
                B: {x: parseInt(buttonB[1]), y: parseInt(buttonB[2]), cost: 1},
                prize: {x: parseInt(prize[1]) + 10000000000000, y: parseInt(prize[2]) + 10000000000000}
            });
        }
    }
    return machines;
}

function findMinCost(machine) {
    const { A, B, prize } = machine;
    const Xp = prize.x;
    const Yp = prize.y;

    const det = A.x * B.y - A.y * B.x;
    if (det === 0) {
        return Infinity;
    }

    // Calculate determinants for Cramer's rule
    const detA = Xp * B.y - Yp * B.x;
    const detB = A.x * Yp - A.y * Xp;

    if (det === 0) return Infinity;

    const a = detA / det;
    const b = detB / det;

    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
        return Infinity;
    }

    return A.cost * a + B.cost * b;
}

function calculateTotalMinTokens(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const machines = parseInput(data);
    let totalTokens = 0;
    machines.forEach(machine => {
        const cost = findMinCost(machine);
        if (cost !== Infinity) {
            totalTokens += cost;
        }
    });
    return totalTokens;
}

const total = calculateTotalMinTokens('input.txt');
console.log(`Minimum total tokens required: ${total}`);