const fs = require('fs');
const f = 'scripts/e2e-browser.mjs';
let t = fs.readFileSync(f, 'utf8');

// [19] loop: exclude the loader brand h1 exactly like metrics()
t = t.replace(
  "const t = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim());",
  "const t = await page.evaluate(() => [...document.querySelectorAll('h1')].filter(h => !h.closest('.loader-container'))[0]?.textContent?.trim());"
);

// [2b]/[4a]: retry card click once if SPA routing hadn't flushed yet
t = t.replace(
  `await page.evaluate(() => { const card = document.querySelector('.works-card'); card?.click(); });
    await settle(page, 900);
    const detailUrl = new URL(page.url()).pathname;`,
  `await page.evaluate(() => { const card = document.querySelector('.works-card'); card?.click(); });
    await settle(page, 900);
    if (!/^\\/works\\/.+/.test(new URL(page.url()).pathname)) {
      await page.evaluate(() => { const card = document.querySelector('.works-card'); card?.click(); });
      await settle(page, 1200);
    }
    const detailUrl = new URL(page.url()).pathname;`
);

fs.writeFileSync(f, t, 'utf8');
console.log('v1 final patches applied');
