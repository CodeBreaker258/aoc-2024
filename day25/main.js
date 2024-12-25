const fs = require('fs');
const lines = fs.readFileSync('input.txt','utf8')
  .trim().split(/\n\s*\n/).map(chunk => chunk.split('\n'));

function isLock(p) { return p[0] === '#####'; }
function parseLockHeights(p) {
  const res = [];
  for (let c=0; c<5; c++){
    let h=0;
    for (let r=1; r<=5; r++){
      if (p[r][c] === '#') h++; else break;
    }
    res.push(h);
  }
  return res;
}

function parseKeyHeights(p) {
  const res = [];
  for (let c=0; c<5; c++){
    let h=0;
    for (let r=5; r>=1; r--){
      if (p[r][c] === '#') h++; else break;
    }
    res.push(h);
  }
  return res;
}

const locks = [], keys = [];
for (const pat of lines) {
  const arr = isLock(pat) ? parseLockHeights(pat) : parseKeyHeights(pat);
  isLock(pat) ? locks.push(arr) : keys.push(arr);
}

let count=0;
for (const lock of locks){
  for (const key of keys){
    if (lock.every((l,i)=>l+key[i]<=5)) count++;
  }
}
console.log(count);