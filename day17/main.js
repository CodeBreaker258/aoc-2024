const fs = require('fs');

function runProgram(registers, program) {
    let { A, B, C } = registers;
    let ip = 0;
    let output = [];

    while (ip < program.length) {
        const opcode = program[ip];
        const operand = program[ip + 1];
        let operandValue;

        // Determine operand type
        if (operand >= 0 && operand <= 3) {
            operandValue = operand;
        } else if (operand === 4) {
            operandValue = A;
        } else if (operand === 5) {
            operandValue = B;
        } else if (operand === 6) {
            operandValue = C;
        } else {
            break; // Invalid operand
        }

        switch (opcode) {
            case 0: { // adv
                const denominator = Math.pow(2, operandValue);
                A = Math.trunc(A / denominator);
                ip += 2;
                break;
            }
            case 1: { // bxl
                B ^= operand;
                ip += 2;
                break;
            }
            case 2: { // bst
                B = operandValue % 8;
                ip += 2;
                break;
            }
            case 3: { // jnz
                if (A !== 0) {
                    ip = operand;
                } else {
                    ip += 2;
                }
                break;
            }
            case 4: { // bxc
                B ^= C;
                ip += 2;
                break;
            }
            case 5: { // out
                output.push(operandValue % 8);
                ip += 2;
                break;
            }
            case 6: { // bdv
                const denominator6 = Math.pow(2, operandValue);
                B = Math.trunc(A / denominator6);
                ip += 2;
                break;
            }
            case 7: { // cdv
                const denominator7 = Math.pow(2, operandValue);
                C = Math.trunc(A / denominator7);
                ip += 2;
                break;
            }
            default:
                ip = program.length; // Halt on invalid opcode
        }
    }

    return output.join(',');
}

// Read and parse input.txt
const inputPath = 'input.txt';
const input = fs.readFileSync(inputPath, 'utf-8').trim().split('\n');
let registers = { A: 0, B: 0, C: 0 };
let program = [];

input.forEach(line => {
    if (line.startsWith('Register A:')) {
        registers.A = parseInt(line.split(':')[1]);
    } else if (line.startsWith('Register B:')) {
        registers.B = parseInt(line.split(':')[1]);
    } else if (line.startsWith('Register C:')) {
        registers.C = parseInt(line.split(':')[1]);
    } else if (line.startsWith('Program:')) {
        program = line.split(':')[1].split(',').map(Number);
    }
});

// Execute program and display output
const result = runProgram(registers, program);
console.log(result);