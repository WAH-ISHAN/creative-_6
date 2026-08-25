const fs = require('fs');
function check(file) {
  const src = fs.readFileSync(file, 'utf8');
  const re = /"(\/img\/[^"]+|\/video\/[^"]+)"/g;
  let m; const missing = new Set();
  while ((m = re.exec(src))) {
    const p = m[1].split('?')[0];
    if (!fs.existsSync(p.slice(1))) missing.add(p);
  }
  console.log(file, '=> missing:', [...missing]);
}
check('src/data/projectsData.ts');
check('src/data/weddingData.ts');
check('src/components/ContactSection.tsx');
check('src/context/ContentContext.tsx');
