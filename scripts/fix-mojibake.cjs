// Repairs mojibake (UTF-8 read as CP1252 and re-saved) inside the browser suite.
const fs = require('fs');
const path = 'scripts/e2e-browser2.mjs';
let text = fs.readFileSync(path, 'utf8');
const before = text;

text = text
  .replace(/\u00e2\u20ac\u201d/g, '\u2014')   // â€” -> —
  .replace(/\u00e2\u20ac\u201c/g, '\u2013')   // â€“ -> –
  .replace(/\u00e2\u2030\u00a5/g, '>=' )      // â‰¥ -> >=
  .replace(/\u00e2\u2020\u2019/g, '\u2192');  // â†' -> →

fs.writeFileSync(path, text, 'utf8');
console.log('changed:', before !== text);
console.log('remaining bad bytes:', /[\u00c2-\u00c3][\u0080-\u00bf]/.test(text));
