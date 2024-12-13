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
                prize: {x: parseInt(prize[1]), y: parseInt(prize[2])}
            });
        }
    }
    return machines;
}

function findMinCost(machine) {
    let minCost = Infinity;
    for (let a = 0; a <= 100; a++) {
        for (let b = 0; b <= 100; b++) {
            if (
                machine.A.x * a + machine.B.x * b === machine.prize.x &&
                machine.A.y * a + machine.B.y * b === machine.prize.y
            ) {
                const cost = machine.A.cost * a + machine.B.cost * b;
                if (cost < minCost) {
                    minCost = cost;
                }
            }
        }
    }
    return minCost;
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