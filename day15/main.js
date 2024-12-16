
const fs = require('fs');

// Read and parse the input
const adv_input = fs.readFileSync('input.txt', 'utf-8');
let [gridPart, steps_list] = adv_input.split("\n\n");
const step_lines = steps_list.split(/\r?\n/).filter(line => line.trim().length > 0);
let steps = step_lines.map(line => line.trim()).join("");

let grid = gridPart.split(/\r?\n/).map(line => line.trim().split(''));
let grid2 = grid.map(row => row.slice());

const shape = grid.length;
const directions = { "^": [-1, 0], "v": [1, 0], ">": [0, 1], "<": [0, -1] };

function next_step(grid, current_pos, step) {
    const [x, y] = current_pos;
    const [dx, dy] = directions[step];
    const nx = x + dx;
    const ny = y + dy;
    if (grid[nx][ny] === "#") {
        return [x, y];
    } else if (grid[nx][ny] === "O") {
        const next_block_pos = next_step(grid, [nx, ny], step);
        if (next_block_pos[0] !== nx || next_block_pos[1] !== ny) {
            grid[nx][ny] = grid[x][y];
            grid[x][y] = ".";
            return [nx, ny];
        } else {
            return [x, y];
        }
    } else if (grid[nx][ny] === ".") {
        grid[nx][ny] = grid[x][y];
        grid[x][y] = ".";
        return [nx, ny];
    }
}

function main(grid, steps) {
    let init_pos;
    for (let i = 0; i < shape; i++) {
        for (let j = 0; j < shape; j++) {
            if (grid[i][j] === "@") {
                init_pos = [i, j];
            }
        }
    }

    let current_pos = init_pos;
    for (const step of steps) {
        current_pos = next_step(grid, current_pos, step);
    }

    let result = 0;
    for (let x = 0; x < shape; x++) {
        for (let y = 0; y < shape; y++) {
            if (grid[x][y] === "O") {
                result += 100 * x + y;
            }
        }
    }

    return result;
}

console.log(`Result: ${main(grid, steps)}`);