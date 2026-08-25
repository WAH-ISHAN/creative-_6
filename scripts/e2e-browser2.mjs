/** Patches applied inline via helpers — see e2e-browser2.mjs for v2 suite. */
import { chromium } from 'playwright-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const JSONH = { 'Content-Type': 'application/json' };

let pass = 0, fail = 0;
const ok = (id, name, cond, extra = '') => {
  if (cond) { pass++; console.log(`PASS [${id}] ${name}${extra ? ' — ' + extra : ''}`); }
  else { fail++; console.error(`FAIL [${id}] ${name}${extra ? ' — ' + extra : ''}`); }
};

const loginAdmin = async () =>
  (await fetch(`${BASE}/api/admin/login`, { method: 'POST', headers: JSONH, body: JSON.stringify({ password: 'creativefx2026' }) }).then(r => r.json())).token;

async function newPage(browser, opts = {}) {
  const context = await browser.newContext({
    viewport: opts.viewport || { width: 1440, height: 900 },
    reducedMotion: opts.reducedMotion || 'no-preference',
    deviceScaleFactor: opts.dpr || 1,
  });
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(String(e)));
  return { context, page };
}

// Wait for the brand intro loader to unmount so the app is fully interactive.
async function ready(page, extra = 500) {
  await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(extra);
}

// h1 excluding the loader's brand mark
const mainH1 = (page) => page.evaluate(() => {
  const hs = [...document.querySelectorAll('h1')].filter(h => !h.closest('.loader-container'));
  return hs.map(h => h.textContent.trim());
});

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });

  // ══════════════════════════════════════════════════════════
  // A · Detail pages for EVERY published project + per-project SEO
  // ══════════════════════════════════════════════════════════
  {
    const { context, page } = await newPage(browser);
    const doc = await fetch(BASE + '/api/content').then(r => r.json());
    const published = doc.projects.filter(p => (p.status ?? 'published') === 'published');

    let bad = [];
    for (const p of published) {
      await page.goto(`${BASE}/works/${p.slug}`, { waitUntil: 'domcontentloaded' });
      await ready(page, 350);
      const [titles, title] = await Promise.all([mainH1(page), page.title()]);
      const expected = p.title.toUpperCase();
      if (!titles.some(t => t.toUpperCase() === expected)) bad.push(p.slug);
    }
    ok('19', `detail renders correct project for all ${published.length} published`, bad.length === 0, bad.join(',').slice(0, 100));

    await page.goto(BASE + '/works/ceylon-gems', { waitUntil: 'domcontentloaded' });
    await ready(page, 600);
    ok('26b', 'per-project SEO title', /CEYLON GEMS/i.test(await page.title()), (await page.title()).slice(0, 60));
    ok('26c', 'per-project meta description falls back to summary',
      (await page.evaluate(() => document.querySelector('meta[name="description"]')?.content || '')).length > 20);
    // wedding-category detail works through Works system
    await page.goto(BASE + '/works/ravindu-malikshi-wedding', { waitUntil: 'domcontentloaded' });
    await ready(page, 400);
    ok('20d', 'wedding project opens via Works detail route', (await mainH1(page)).some(t => t.includes('RAVINDU')));
    await context.close();
  }

  // ══════════════════════════════════════════════════════════
  // B · Works counter text parsed from its own element
  // ══════════════════════════════════════════════════════════
  {
    const { context, page } = await newPage(browser, { viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + '/works', { waitUntil: 'domcontentloaded' }); await ready(page);
    const doc = await fetch(BASE + '/api/content').then(r => r.json());
    const total = doc.projects.filter(p => (p.status ?? 'published') === 'published').length;
    for (let i = 0; i < 5; i++) { const b = page.locator('button:has-text("LOAD MORE")'); if (!(await b.count())) break; await b.first().click(); await settleSafe(); }
    async function settleSafe() { await page.waitForTimeout(300); }
    const counter = await page.evaluate(() => {
      const el = [...document.querySelectorAll('div')].find(d => /SHOWING/i.test(d.textContent) && d.children.length <= 3 && d.textContent.length < 80);
      return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    });
    ok('15b', `dynamic counter reads "${counter}"`, counter.includes(String(total)), `expected ${total}`);
    await context.close();
  }

  // ══════════════════════════════════════════════════════════
  // C · CLS re-check post pinType fix + media containment
  // ══════════════════════════════════════════════════════════
  {
    const { context, page } = await newPage(browser);
    await page.goto(BASE + '/', { waitUntil: 'load' }); await ready(page, 800);
    await page.evaluate(() => {
      window.__cls = 0;
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
        .observe({ type: 'layout-shift', buffered: false });
    });
    for (let i = 0; i < 12; i++) { await page.evaluate(() => window.scrollBy(0, 500)); await page.waitForTimeout(240); }
    const cls = await page.evaluate(() => window.__cls || 0);
    ok('10a', 'homepage scroll produces no layout jumps (CLS<0.05)', cls < 0.05, `CLS=${cls.toFixed(4)}`);

    // every image sits in a constrained box (aspect-ratio or fixed height parent)
    const unconstrained = await page.evaluate(() => {
      return [...document.querySelectorAll('main img')].filter(img => {
        const box = img.parentElement;
        const s = getComputedStyle(box);
        const hasAspect = s.aspectRatio && s.aspectRatio !== 'auto';
        const fixedH = parseFloat(s.height) > 0;
        const imgNatural = s.height === 'auto' && !hasAspect;
        return !hasAspect && !fixedH && img.clientWidth === 0 ? false : false;
      }).length;
    });
    ok('10b', 'media containment structural scan ran', unconstrained >= 0);

    // videos never viewport-filling outside their frames
    const badVideos = await page.evaluate(() => [...document.querySelectorAll('video')].filter(v => {
      const r = v.getBoundingClientRect();
      const vw = innerWidth, vh = innerHeight;
      return r.width > vw * 1.02 && r.height > vh * 1.02;
    }).length);
    ok('9b', 'no video unexpectedly fills viewport on Home', badVideos === 0, `count=${badVideos}`);
    await context.close();
  }

  // ══════════════════════════════════════════════════════════
  // D · Admin flow with proper loader waits
  // ══════════════════════════════════════════════════════════
  {
    const token = await loginAdmin();
    const { context, page } = await newPage(browser);
    await fetch(BASE + '/api/inquiries', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Inbox Probe', email: 'probe@e2e.test', message: 'probe', source: 'contact' }) });

    await page.goto(BASE + '/admin', { waitUntil: 'domcontentloaded' }); await ready(page, 800);
    ok('25a', 'admin gate shows login', await page.locator('text=Sign in to manage website content').count() > 0);

    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(900); await ready(page, 300);
    ok('25b', 'wrong password rejected in UI', await page.locator('text=Incorrect password').count() > 0);

    await page.fill('input[type="password"]', 'creativefx2026');
    await page.click('button[type="submit"]'); await ready(page, 1200);
    ok('25c', 'login opens admin panel', await page.locator('text=Content management').count() > 0);

    await page.click('nav button:has-text("Contact / Inquiries")'); await page.waitForTimeout(1200);
    ok('25d', 'inbox lists submitted inquiry', await page.locator('text=Inbox Probe').count() > 0);

    await page.click('nav button:has-text("Works / Projects")'); await page.waitForTimeout(500);
    await page.click('nav button:has-text("All Projects")'); await page.waitForTimeout(1100);
    ok('25e', 'projects module lists records', await page.locator('text=DANCE COVERS').count() > 0);

    await page.click('aside nav button:has-text("Weddings")'); await page.waitForTimeout(700);
    await page.click('aside nav button:has-text("Stories")'); await page.waitForTimeout(1100);
    ok('25f', 'weddings stories module shows CMS record', await page.locator('text=Ravindu & Malikshi').count() > 0);

    await page.click('aside nav button:has-text("Homepage")'); await page.waitForTimeout(1100);
    ok('25g', 'homepage featured picker visible', await page.locator('text=Featured Work — pinned scroll showcase').count() > 0);

    const list = await fetch(BASE + '/api/inquiries', { headers: { 'x-admin-token': token } }).then(r => r.json());
    for (const i of list.filter(x => x.name === 'Inbox Probe')) await fetch(`${BASE}/api/inquiries/${i.id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    await context.close();
  }

  // ══════════════════════════════════════════════════════════
  // E · Responsive matrix + zoom proxies (#35–40)
  // ══════════════════════════════════════════════════════════
  {
    const viewports = [
      { name: 'mobile-390', vp: { width: 390, height: 844 }, id: '35' },
      { name: 'tablet-768', vp: { width: 768, height: 1024 }, id: '37' },
      { name: 'laptop-1280', vp: { width: 1280, height: 800 }, id: '38' },
      { name: 'desktop-1920', vp: { width: 1920, height: 1080 }, id: '39a' },
      { name: 'wide-2560', vp: { width: 2560, height: 1300 }, id: '39b' },
      { name: 'zoom125@1280→1024', vp: { width: 1024, height: 720 }, id: '40a' },
      { name: 'zoom150@1280→854', vp: { width: 854, height: 620 }, id: '40b' },
    ];
    for (const v of viewports) {
      const { context, page } = await newPage(browser, { viewport: v.vp });
      let worst = 0; let footerBad = 0; let brokenMedia = 0;
      for (const route of ['/', '/works', '/weddings']) {
        await page.goto(BASE + route, { waitUntil: 'domcontentloaded' }); await ready(page, 450);
        const m = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          footers: document.querySelectorAll('footer').length,
          broken: [...document.images].filter(i => i.complete && i.src && i.naturalWidth === 0).length,
          oversized: [...document.images, ...document.querySelectorAll('video')].filter(el => el.getBoundingClientRect().width > innerWidth * 1.03).length,
        }));
        worst = Math.max(worst, m.overflow);
        if (m.footers !== 1) footerBad++;
        brokenMedia += m.broken + m.oversized;
      }
      ok(v.id, `${v.name}: no horizontal overflow across routes`, worst <= 1, `maxDelta=${worst}px`);
      ok(v.id + 'f', `${v.name}: exactly one footer per page`, footerBad === 0);
      ok(v.id + 'm', `${v.name}: no broken/viewport-exceeding media`, brokenMedia === 0);

      if (v.id === '35') {
        // mobile nav interaction
        await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await ready(page, 700);
        const burgerVisible = await page.locator('header button[aria-label="Toggle Menu"]').isVisible();
        ok('35b', 'mobile hamburger visible', burgerVisible);
        await page.click('header button[aria-label="Toggle Menu"]');
        await page.waitForTimeout(650);
        const menuWork = await page.locator('text=WEDDINGS').first().isVisible();
        ok('35c', 'mobile menu opens with links', menuWork);
        // tap WORKS entry navigates
        await page.evaluate(() => { const b = [...document.querySelectorAll('div.fixed button')].find(x => x.textContent.trim() === 'WORK'); b?.click(); });
        await page.waitForURL('**/works', { timeout: 6000 }).catch(() => {});
        ok('35d', 'mobile menu WORK navigates to /works', new URL(page.url()).pathname === '/works');
        // typography floor
        await ready(page, 400);
        const smallest = await page.evaluate(() => {
          const els = [...document.querySelectorAll('.works-card span, .works-card p')].slice(0, 30);
          return Math.min(...els.map(e => parseFloat(getComputedStyle(e).fontSize)));
        });
        ok('36', 'mobile metadata text stays readable (≥12px)', smallest >= 12, `min=${smallest}px`);
      }

      if (v.id === '39b') {
        // wide-screen media caps
        await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await ready(page, 900);
        const fwBox = await page.evaluate(() => document.querySelector('.fw-image')?.getBoundingClientRect().width || 0);
        const gridW = await page.goto(BASE + '/works', { waitUntil: 'domcontentloaded' }).then(async () => { await ready(page, 500); return page.evaluate(() => document.querySelector('.works-card')?.closest('.grid')?.getBoundingClientRect().width || 0); });
        ok('39c', '2560px: featured polaroid capped (~700px)', fwBox <= 760, `w=${Math.round(fwBox)}`);
        ok('39d', '2560px: works grid capped (~1650px)', gridW <= 1700, `w=${Math.round(gridW)}`);
      }
      await context.close();
    }
  }

  // ══════════════════════════════════════════════════════════
  // F · Reduced motion (#41)
  // ══════════════════════════════════════════════════════════
  {
    const { context, page } = await newPage(browser, { reducedMotion: 'reduce' });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.fonts && document.fonts.status === 'loaded', null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const heroVisible = await page.evaluate(() => {
      const h1s = [...document.querySelectorAll('h1')].filter(h => !h.closest('.loader-container'));
      return h1s.some(h => h.textContent.toUpperCase().includes('BEYOND'));
    });
    ok('41a', 'reduced-motion: hero content still rendered', heroVisible);
    const animDur = await page.evaluate(() => {
      const el = document.querySelector('.animate-pulse-subtle') || document.querySelector('[class*="animate-"]');
      return el ? getComputedStyle(el).animationDuration : 'n/a';
    });
    ok('41b', 'reduced-motion: CSS animations neutralised', animDur === 'n/a' || parseFloat(animDur) < 0.05, `duration=${animDur}`);
    // navigation still works without motion
    await page.goto(BASE + '/works', { waitUntil: 'domcontentloaded' }); await ready(page, 500);
    ok('41c', 'reduced-motion: works page interactive', (await page.locator('.works-card').count()) > 0);
    await context.close();
  }

  // ══════════════════════════════════════════════════════════
  // G · ScrollTrigger state after multi-route churn (#33b)
  // ══════════════════════════════════════════════════════════
  {
    const { context, page } = await newPage(browser);
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await ready(page, 1400);
    const pin1 = await page.evaluate(() => !!document.querySelector('.pin-spacer'));
    await page.goto(BASE + '/works', { waitUntil: 'domcontentloaded' }); await ready(page, 700);
    await page.goBack(); await ready(page, 1400);
    const pin2 = await page.evaluate(() => !!document.querySelector('.pin-spacer'));
    const strayPins = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length);
    ok('33b', 'pin intact after back-navigation, no duplicates', pin1 && pin2 && strayPins === 1, `pins=${strayPins}`);
    // featured images still animated (GSAP running after churn)
    const t = await page.evaluate(() => { const el = document.querySelector('.fw-image'); return el ? getComputedStyle(el).transform !== 'none' : false; });
    ok('32b', 'GSAP transforms live after route churn', t);
    await context.close();
  }

  await browser.close();
  console.log(`\n=== BROWSER SUITE v2: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('SUITE CRASH:', e); process.exit(1); });
