const fs = require('fs');
const path = require('path');

function processGates(wireValues, gates) {
    const pendingGates = [...gates];
    let changed = true;

    while (changed && pendingGates.length > 0) {
        changed = false;
        for (let i = pendingGates.length - 1; i >= 0; i--) {
            const gate = pendingGates[i];
            const input1 = wireValues.get(gate.input1);
            const input2 = wireValues.get(gate.input2);

            if (input1 !== undefined && input2 !== undefined) {
                let result;
                switch (gate.operation) {
                    case 'AND': result = input1 & input2; break;
                    case 'OR': result = input1 | input2; break;
                    case 'XOR': result = input1 ^ input2; break;
                }
                wireValues.set(gate.output, result);
                pendingGates.splice(i, 1);
                changed = true;
            }
        }
    }
}

try {
    const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').trim().split('\n');
    const wireValues = new Map();
    const gates = [];

    // Parse initial values
    let i = 0;
    while (i < input.length && input[i].includes(':')) {
        const [wire, value] = input[i].split(':').map(s => s.trim());
        wireValues.set(wire, parseInt(value));
        i++;
    }
    i++;

    // Parse gates
    while (i < input.length) {
        const line = input[i].trim();
        if (line) {
            const [operation, output] = line.split('->').map(s => s.trim());
            const [input1, op, input2] = operation.split(' ');
            gates.push({
                input1,
                input2,
                operation: op,
                output: output
            });
        }
        i++;
    }

    // Process gates
    processGates(wireValues, gates);

    // Collect z-wires
    const zWires = Array.from(wireValues.entries())
        .filter(([wire]) => wire.startsWith('z'))
        .sort(([a], [b]) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
        .map(([_, value]) => value);

    // Calculate result
    const binaryString = zWires.join('');
    const result = parseInt(binaryString, 2);
    console.log(result);

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}