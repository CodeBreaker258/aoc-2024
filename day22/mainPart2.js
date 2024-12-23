const fs = require("fs");
const data = fs.readFileSync("input.txt","utf8").trim().split("\n").map(Number);

function nextSecret(s) {
  let m = s * 64;
  s ^= m;
  s &= 0xFFFFFF;

  m = s >>> 5;
  s ^= m;
  s &= 0xFFFFFF;

  m = s * 2048;
  s ^= m;
  s &= 0xFFFFFF;

  return s;
}

// Precompute prices and earliest 4-change sequences for each buyer
const buyers = data.map(start => {
  let secrets = [start];
  for (let i = 0; i < 2000; i++) {
    secrets.push(nextSecret(secrets[secrets.length - 1]));
  }
  let prices = secrets.map(s => s % 10);
  let changesMap = new Map();
  for (let i = 0; i < 2000; i++) {
    // four consecutive changes, if i+3 < 2000
    if (i + 3 < 2000) {
      let c1 = prices[i+1] - prices[i];
      let c2 = prices[i+2] - prices[i+1];
      let c3 = prices[i+3] - prices[i+2];
      let c4 = prices[i+4] - prices[i+3];
      let key = `${c1},${c2},${c3},${c4}`;
      if (!changesMap.has(key)) {
        changesMap.set(key, i);
      }
    }
  }
  return { prices, changesMap };
});

// Try all possible 4-change sequences [-9..9]
let bestSum = 0;
for (let a = -9; a <= 9; a++) {
  for (let b = -9; b <= 9; b++) {
    for (let c = -9; c <= 9; c++) {
      for (let d = -9; d <= 9; d++) {
        let seqKey = `${a},${b},${c},${d}`;
        let sumBananas = 0;
        for (let buyer of buyers) {
          let idx = buyer.changesMap.get(seqKey);
          if (idx !== undefined) {
            // sell at prices[idx+4]
            sumBananas += buyer.prices[idx+4];
          }
        }
        if (sumBananas > bestSum) bestSum = sumBananas;
      }
    }
  }
}

console.log(bestSum);