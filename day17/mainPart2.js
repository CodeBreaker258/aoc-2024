const fs = require('fs');

function getComboOperandValue(operand, registers) {
    const { A, B, C } = registers;
    if (operand >= 0 && operand <= 3) {
        return operand;
    } else if (operand === 4) {
        return A;
    } else if (operand === 5) {
        return B;
    } else if (operand === 6) {
        return C;
    } else {
        throw new Error('Invalid combo operand');
    }
}

function runProgram(registers, program) {
    let { A, B, C } = registers;
    let ip = 0;
    let output = [];

    while (ip < program.length) {
        const opcode = program[ip];
        const operand = program[ip + 1];
        let operandValue;

        switch (opcode) {
            case 0: { // adv
                // Combo operand
                try {
                    operandValue = getComboOperandValue(operand, { A, B, C });
                } catch {
                    return 'error';
                }
                const denominator = Math.pow(2, operandValue);
                A = Math.trunc(A / denominator);
                ip += 2;
                break;
            }
            case 1: { // bxl
                // Literal operand
                operandValue = operand;
                B ^= operandValue;
                ip += 2;
                break;
            }
            case 2: { // bst
                // Combo operand
                try {
                    operandValue = getComboOperandValue(operand, { A, B, C });
                } catch {
                    return 'error';
                }
                B = operandValue % 8;
                ip += 2;
                break;
            }
            case 3: { // jnz
                // Literal operand
                operandValue = operand;
                if (A !== 0) {
                    ip = operandValue;
                } else {
                    ip += 2;
                }
                break;
            }
            case 4: { // bxc
                // Operand is read but ignored
                B ^= C;
                ip += 2;
                break;
            }
            case 5: { // out
                // Combo operand
                try {
                    operandValue = getComboOperandValue(operand, { A, B, C });
                } catch {
                    return 'error';
                }
                output.push(operandValue % 8);
                ip += 2;
                break;
            }
            case 6: { // bdv
                // Combo operand
                try {
                    operandValue = getComboOperandValue(operand, { A, B, C });
                } catch {
                    return 'error';
                }
                const denominator6 = Math.pow(2, operandValue);
                B = Math.trunc(A / denominator6);
                ip += 2;
                break;
            }
            case 7: { // cdv
                // Combo operand
                try {
                    operandValue = getComboOperandValue(operand, { A, B, C });
                } catch {
                    return 'error';
                }
                const denominator7 = Math.pow(2, operandValue);
                C = Math.trunc(A / denominator7);
                ip += 2;
                break;
            }
            default:
                // Invalid opcode
                return 'error';
        }
    }

    return output.join(',');
}

// Read and parse input.txt
const inputPath = '/Users/coltonsteinbeck/dev/aoc-2024/day17/input.txt';
const input = fs.readFileSync(inputPath, 'utf-8').trim().split('\n');
let program = [];

input.forEach(line => {
    if (line.startsWith('Program:')) {
        program = line.split(':')[1].split(',').map(Number);
    }
});

// Convert program to string for comparison
const programString = program.join(',');

// Iterate to find the minimal A
let A = 1;
while (true) {
    let registers = { A, B: 0, C: 0 };
    const output = runProgram(registers, program);
    if (output === programString) {
        console.log(`The lowest positive initial value for register A is: ${A}`);
        break;
    }
    A++;
    // Optional: Adjust the limit as needed
    if (A > 100000000) {
        console.log('No solution found within the search limit.');
        break;
    }
}