const fs = require('fs');
const f = 'scripts/e2e-browser.mjs';
let t = fs.readFileSync(f, 'utf8');
let n = 0;

// Helper injection (after settle())
if (!t.includes('async function waitMain(page')) {
  t = t.replace(
    'async function settle(page, ms = 700) { await page.waitForTimeout(ms); }',
    `async function settle(page, ms = 700) { await page.waitForTimeout(ms); }
// Deterministic SPA-ready wait: brand loader gone AND a real <main> heading painted.
async function waitMain(page) {
  await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 20000 }).catch(() => {});
  await page.waitForFunction(() => !!document.querySelector('main h1'), null, { timeout: 15000 }).catch(() => {});
}`
  );
  n++;
}

// 1. [15] counter: read the dedicated counter element instead of body text
t = t.replace(
  "counter: document.body.textContent.match(/SHOWING\\s+(\\d+)\\s+OF\\s+(\\d+)(?!\\d)/i)?.slice(1).map(Number) || [],",
  "counter: (() => { const el = [...document.querySelectorAll('div')].find(d => /SHOWING/i.test(d.textContent) && d.textContent.length < 80); const mnum = el?.textContent.match(/(\\d+)/g); return mnum ? mnum.map(Number) : []; })(),"
);
n++;

// 2. [19] loop: wait for main h1 before reading
t = t.replace(
  "await page.goto(`${BASE}/works/${p.slug}`, { waitUntil: 'domcontentloaded' });\n      await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 15000 }).catch(() => {});\n      await settle(page, 400);",
  "await page.goto(`${BASE}/works/${p.slug}`, { waitUntil: 'domcontentloaded' });\n      await waitMain(page);\n      await settle(page, 250);"
);
n++;

// 3. [26b]: wait for main before reading title
t = t.replace(
  "await page.goto(`${BASE}/works/ceylon-gems`, { waitUntil: 'domcontentloaded' }); await settle(page, 600);",
  "await page.goto(`${BASE}/works/ceylon-gems`, { waitUntil: 'domcontentloaded' }); await waitMain(page); await settle(page, 400);"
);
n++;

// 4. weddings block: wait for timeline to exist
t = t.replace(
  "await page.goto(BASE + '/weddings', { waitUntil: 'load' }); await settle(page, 1600);",
  "await page.goto(BASE + '/weddings', { waitUntil: 'domcontentloaded' });\n    await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 20000 }).catch(() => {});\n    await page.waitForSelector('#wedding-story-timeline', { timeout: 15000 });\n    await settle(page, 900);"
);
n++;

// 5. admin: scope nav clicks to the panel sidebar + use search for DANCE COVERS
t = t.split("await page.click('nav >> text=Works / Projects');").join("await page.click('aside nav button:has-text(\"Works / Projects\")');");
t = t.split("await page.click('nav >> text=All Projects');").join("await page.click('aside nav button:has-text(\"All Projects\")'); await page.waitForTimeout(900); await page.fill('input[placeholder*=\"Search by title\"]', 'DANCE'); await page.waitForTimeout(700);");
t = t.split("await page.click('nav >> text=WEDDINGS');").join("await page.click('aside nav button:has-text(\"Weddings\")');");
t = t.split("await page.click('nav >> text=Stories');").join("await page.click('aside nav button:has-text(\"Stories\")');");

fs.writeFileSync(f, t, 'utf8');
console.log('patches applied:', n);
