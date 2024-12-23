const fs = require("fs");
const data = fs.readFileSync("input.txt","utf8").trim().split("\n").map(Number);

function nextSecret(s) {
  // Step 1
  let m = s * 64;
  s ^= m;
  s &= 0xFFFFFF; // modulo 16777216

  // Step 2
  m = s >>> 5; // integer division by 32
  s ^= m;
  s &= 0xFFFFFF;

  // Step 3
  m = s * 2048;
  s ^= m;
  s &= 0xFFFFFF;

  return s;
}

function get2000thSecret(start) {
  let s = start;
  for (let i = 0; i < 2000; i++) {
    s = nextSecret(s);
  }
  return s;
}

const result = data.reduce((sum, val) => sum + get2000thSecret(val), 0);
console.log(result);