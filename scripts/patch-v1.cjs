const fs = require('fs');
const f = 'scripts/e2e-browser.mjs';
let t = fs.readFileSync(f, 'utf8');
let n = 0;

// 1. metrics(): ignore the loader's brand h1
const oldH1 = "h1: document.querySelector('h1')?.textContent?.trim() || '',";
const newH1 = "h1: [...document.querySelectorAll('h1')].filter(h => !h.closest('.loader-container'))[0]?.textContent?.trim() || '',";
if (t.includes(oldH1)) { t = t.replace(oldH1, newH1); n++; }

// 2. counter regex: prevent absorbing adjacent digits
const oldRe = '/SHOWING\\s+(\\d+)\\s+OF\\s+(\\d+)/i';
const newRe = '/SHOWING\\s+(\\d+)\\s+OF\\s+(\\d+)(?!\\d)/i';
if (t.includes(oldRe)) { t = t.replace(oldRe, newRe); n++; }

// 3. admin login: scope to the login card + wait out the brand loader
t = t.split("await page.click('button[type=\"submit\"]')").join('await page.click(\'.cfx-admin button[type="submit"]\')');

// 4. detail-loop: give SPA time to mount (loader) before asserting h1/title
const oldLoopWait = "await page.goto(`${BASE}/works/${p.slug}`, { waitUntil: 'domcontentloaded' }); await settle(page, 450);";
const newLoopWait = "await page.goto(`${BASE}/works/${p.slug}`, { waitUntil: 'domcontentloaded' });\n      await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 15000 }).catch(() => {});\n      await settle(page, 400);";
if (t.includes(oldLoopWait)) { t = t.replace(oldLoopWait, newLoopWait); n++; }

// 5. CLS threshold now achievable (pinType fix landed)
fs.writeFileSync(f, t, 'utf8');
console.log('applied patches:', n);
