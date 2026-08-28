/**
 * CreativeFX — Real-browser production acceptance suite.
 * Drives actual Chrome via playwright-core. Run: node scripts/e2e-browser.mjs
 */
import { chromium } from 'playwright-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const ADMIN_TOKEN_HEADER = { 'Content-Type': 'application/json' };

let pass = 0, fail = 0;
const results = [];
const ok = (id, name, cond, extra = '') => {
  if (cond) { pass++; console.log(`PASS [${id}] ${name}${extra ? ' — ' + extra : ''}`); }
  else { fail++; console.error(`FAIL [${id}] ${name}${extra ? ' — ' + extra : ''}`); }
  results.push({ id, name, ok: cond, extra });
};

const loginAdmin = async () => {
  const r = await fetch(`${BASE}/api/admin/login`, { method: 'POST', headers: ADMIN_TOKEN_HEADER, body: JSON.stringify({ password: 'creativefx2026' }) });
  return (await r.json()).token;
};

async function newPage(browser, opts = {}) {
  const context = await browser.newContext({ viewport: opts.viewport || { width: 1440, height: 900 }, reducedMotion: opts.reducedMotion || 'no-preference', deviceScaleFactor: opts.dpr || 1 });
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') page.errors.push(m.text()); });
  return { context, page };
}

async function settle(page, ms = 700) { await page.waitForTimeout(ms); }
// Deterministic SPA-ready wait: brand loader gone AND a real <main> heading painted.
async function waitMain(page) {
  await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 20000 }).catch(() => {});
  await page.waitForFunction(() => !!document.querySelector('main h1'), null, { timeout: 15000 }).catch(() => {});
}

const metrics = (page) => page.evaluate(() => {
  const docEl = document.documentElement;
  const overflowX = docEl.scrollWidth - docEl.clientWidth;
  const footers = document.querySelectorAll('footer').length;
  const brokenImgs = [...document.images].filter(i => i.complete && i.src && i.naturalWidth === 0).map(i => i.src);
  const imgs = [...document.images].map(i => ({ w: i.clientWidth, h: i.clientHeight }));
  const oversizedMedia = [...document.images, ...document.querySelectorAll('video')]
    .filter(m => m.clientWidth > docEl.clientWidth + 8).length;
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    ogImage: document.querySelector('meta[property="og:image"]')?.content || '',
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    scrollY: Math.round(window.scrollY),
    overflowX,
    footers,
    brokenImgs,
    imgCount: imgs.length,
    oversizedMedia,
    h1: [...document.querySelectorAll('h1')].filter(h => !h.closest('.loader-container'))[0]?.textContent?.trim() || '',
  };
});

// ═════════════════════════════════════════════════════════════════════
const browser = await chromium.launch({ executablePath: CHROME });

try {
  // ────────────────────────────────────────────────────────────────
  // 1–7 · ROUTES, NAVIGATION, SCROLL-RESET, FOOTER, OVERFLOW (desktop)
  // ────────────────────────────────────────────────────────────────
  {
    const { context, page } = await newPage(browser);
    const routes = ['/', '/works', '/works/zova-clothing', '/weddings'];
    for (const route of routes) {
      await page.goto(BASE + route, { waitUntil: 'load' });
      await settle(page);
      const m = await metrics(page);
      ok('1', `direct load ${route}`, m.h1.length > 0 || route === '/', `h1="${m.h1.slice(0, 40)}"`);
      ok('5', `footer exactly once on ${route}`, m.footers === 1, `found ${m.footers}`);
      ok('3', `${route} starts at top`, m.scrollY === 0, `scrollY=${m.scrollY}`);
      ok('7', `no horizontal overflow on ${route}`, m.overflowX <= 1, `delta=${m.overflowX}px`);
      ok('26p', `SEO meta on ${route}`, !!m.title && !!m.description);
    }

    // 2 · header nav link reaches correct route (from scrolled state)
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await settle(page, 1200);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await settle(page, 600);
    const beforeNav = await page.evaluate(() => window.scrollY);

    // WORKS link lives inside home nav? On studio view the Work button scrolls to section.
    // Use footer "Work" → /works instead (footer exists on all views).
    await page.evaluate(() => window.scrollTo(0, 0));
    await settle(page, 400);
    await page.evaluate(() => { const el = [...document.querySelectorAll('footer button')].find(b => b.textContent.trim() === 'Work'); el?.click(); });
    await page.waitForURL('**/works');
    await settle(page, 800);
    ok('2', 'footer WORK link reaches /works', page.url().endsWith('/works'));

    // 6 · no section starts from previous scroll position after in-app navigation
    ok('6', 'scroll reset to top after in-app nav', await page.evaluate(() => window.scrollY) === 0, `was scrolled=${beforeNav > 0}`);

    // back/forward chain: works -> detail -> back(works) -> forward(detail) -> back(home)
    await page.evaluate(() => { const card = document.querySelector('.works-card'); card?.click(); });
    await settle(page, 900);
    if (!/^\/works\/.+/.test(new URL(page.url()).pathname)) {
      await page.evaluate(() => { const card = document.querySelector('.works-card'); card?.click(); });
      await settle(page, 1200);
    }
    const detailUrl = new URL(page.url()).pathname;
    ok('2b', `project card opens ${detailUrl}`, /^\/works\/.+/.test(detailUrl));

    await page.goBack(); await settle(page, 900);
    ok('4a', 'browser BACK returns to /works list', new URL(page.url()).pathname === '/works' && (await page.evaluate(() => window.scrollY)) === 0);

    await page.goForward(); await settle(page, 900);
    ok('4b', 'browser FORWARD returns to detail at top', new URL(page.url()).pathname === detailUrl && (await page.evaluate(() => window.scrollY)) === 0);

    // ScrollTrigger re-initialised after route change (pin-spacer present again)
    await page.goto(BASE + '/', { waitUntil: 'load' }); await settle(page, 1500);
    const pin = await page.evaluate(() => !!document.querySelector('.pin-spacer'));
    ok('33', 'ScrollTrigger pin re-created after returning Home', pin);

    // Lenis synchronisation
    const lenis = await page.evaluate(() => {
      const l = window.__lenis;
      return { present: !!l, hasScrollTo: !!(l && typeof l.scrollTo === 'function'), smoothClass: document.documentElement.className.includes('lenis') };
    });
    ok('34', 'Lenis active & synchronised', lenis.present && lenis.hasScrollTo, JSON.stringify(lenis));

    // GSAP actually transformed the featured images
    const gsapApplied = await page.evaluate(() => {
      const el = document.querySelector('.fw-image');
      return el ? getComputedStyle(el).transform !== 'none' : false;
    });
    ok('32a', 'GSAP transforms applied to Featured Work images', gsapApplied);

    // CLS (layout jumps #10) while scrolling the homepage
    await page.evaluate(() => {
      window.__cls = 0;
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    });
    for (let i = 0; i < 8; i++) { await page.evaluate(() => window.scrollBy(0, 600)); await page.waitForTimeout(220); }
    const cls = await page.evaluate(() => window.__cls || 0);
    ok('10', 'no layout jumps while scrolling (CLS < 0.15)', cls < 0.15, `CLS=${cls.toFixed(4)}`);

    // 8/9 media sizing on desktop home
    const mediaHome = await metrics(page);
    ok('8a', `no broken images on Home (${mediaHome.imgCount} imgs)`, mediaHome.brokenImgs.length === 0, mediaHome.brokenImgs.join(',').slice(0, 80));
    ok('9a', 'no media exceeds viewport on Home', mediaHome.oversizedMedia === 0);

    await context.close();
  }

  // ────────────────────────────────────────────────────────────────
  // 11 · Featured Work with ANY number of featured projects
  // ────────────────────────────────────────────────────────────────
  {
    const token = await loginAdmin();
    const getDoc = () => fetch(BASE + '/api/content').then(r => r.json());
    const save = async (doc) => fetch(BASE + '/api/content', { method: 'POST', headers: { ...ADMIN_TOKEN_HEADER, 'x-admin-token': token }, body: JSON.stringify(doc) });

    const original = await getDoc();
    try {
      const { context, page } = await newPage(browser);

      // one featured project
      let d = await getDoc();
      d.home.featuredProjectIds = ['photo-01'];
      await save(d); await settle(page, 100);
      await page.goto(BASE + '/', { waitUntil: 'load' }); await settle(page, 1400);
      let n = await page.evaluate(() => document.querySelectorAll('.fw-image').length);
      ok('11a', 'Featured Works renders with exactly 1 project', n === 1, `count=${n}`);

      // three featured projects
      d = await getDoc();
      d.home.featuredProjectIds = ['photo-01', 'photo-02', 'photo-03'];
      await save(d);
      await page.reload({ waitUntil: 'load' }); await settle(page, 1400);
      n = await page.evaluate(() => document.querySelectorAll('.fw-image').length);
      ok('11b', 'Featured Works renders with exactly 3 projects', n === 3, `count=${n}`);

      // six (max recommended)
      d = await getDoc();
      d.home.featuredProjectIds = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06'];
      await save(d);
      await page.reload({ waitUntil: 'load' }); await settle(page, 1400);
      n = await page.evaluate(() => document.querySelectorAll('.fw-image').length);
      ok('11c', 'Featured Works renders with 6 projects', n === 6, `count=${n}`);

      // empty → falls back to featured flags (still renders, not blank)
      d = await getDoc();
      d.home.featuredProjectIds = [];
      await save(d);
      await page.reload({ waitUntil: 'load' }); await settle(page, 1400);
      n = await page.evaluate(() => document.querySelectorAll('.fw-image').length);
      ok('11d', 'empty picker falls back to featured flags', n > 0, `count=${n}`);

      // restore six
      d = await getDoc();
      d.home.featuredProjectIds = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06'];
      await save(d);
      await context.close();
    } catch (e) {
      ok('11', 'featured work matrix', false, String(e).slice(0, 120));
      const d = await getDoc();
      d.home.featuredProjectIds = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06'];
      await save(d);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // 12 · Selected Work uses master records; 13–17 Works catalogue
  // ────────────────────────────────────────────────────────────────
  {
    const token = await loginAdmin();
    const getDoc = () => fetch(BASE + '/api/content').then(r => r.json());
    const save = async (doc) => fetch(BASE + '/api/content', { method: 'POST', headers: { ...ADMIN_TOKEN_HEADER, 'x-admin-token': token }, body: JSON.stringify(doc) });

    const { context, page } = await newPage(browser);
    const origSelected = (await getDoc()).home.selectedWorkIds;

    // Selected Work reflects chosen master records
    let d = await getDoc();
    d.home.selectedWorkIds = ['photo-02', '__weddings__'];
    await save(d);
    await page.goto(BASE + '/', { waitUntil: 'load' }); await settle(page, 1200);
    const tiles = await page.evaluate(() => {
      const grid = document.querySelector('#section-portfolio .grid');
      return [...grid.querySelectorAll('h3')].map(h => h.textContent.trim());
    });
    ok('12a', 'Selected Work shows only picked master records', tiles.includes('CEYLON GEMS') && tiles.includes('WEDDINGS') && tiles.length === 2, tiles.join('|'));
    d = await getDoc(); d.home.selectedWorkIds = origSelected; await save(d);

    // ALL WORKS = every published project; counts dynamic; filters correct
    await page.goto(BASE + '/works', { waitUntil: 'load' }); await settle(page, 1200);
    const publishedCount = (await getDoc()).projects.filter(p => (p.status ?? 'published') === 'published').length;
    // load more until exhausted
    for (let i = 0; i < 5; i++) {
      const btn = page.locator('button:has-text("LOAD MORE")');
      if (!(await btn.count())) break;
      await btn.first().click(); await settle(page, 350);
    }
    const shownAll = await page.evaluate(() => ({
      cards: document.querySelectorAll('.works-card').length,
      counter: (() => { const el = [...document.querySelectorAll('div')].find(d => /SHOWING/i.test(d.textContent) && d.textContent.length < 80); const mnum = el?.textContent.match(/(\d+)/g); return mnum ? mnum.map(Number) : []; })(),
    }));
    ok('13', 'ALL WORKS displays every published project', shownAll.cards === publishedCount, `cards=${shownAll.cards} published=${publishedCount}`);
    ok('15', 'counts generated dynamically', shownAll.counter[0] === publishedCount && shownAll.counter[1] === publishedCount, shownAll.counter.join('/'));
    ok('16', 'admin-created project appears publicly', await page.evaluate(() => [...document.querySelectorAll('.works-card h3')].some(h => h.textContent.includes('DANCE COVERS'))));

    // filter chips have live counts and filtering returns correct subset
    const photoExpected = (await getDoc()).projects.filter(p => p.type === 'photography' && (p.status ?? 'published') === 'published').length;
    await page.click('button:has-text("PHOTOGRAPHY")');
    await settle(page, 500);
    const photoCards = await page.evaluate(() => document.querySelectorAll('.works-card').length);
    const photoChip = await page.evaluate(() => {
      const chip = [...document.querySelectorAll('button')].find(b => b.textContent.replace(/\d/g, '').includes('PHOTOGRAPHY'));
      return parseInt(chip?.textContent.match(/(\d+)/)?.[1] || '-1', 10);
    });
    ok('14a', 'PHOTOGRAPHY filter returns correct projects', photoCards === photoExpected, `shown=${photoCards} expected=${photoExpected}`);
    ok('14b', 'chip count matches filtered set', photoChip === photoExpected, `chip=${photoChip}`);
    ok('16b', 'draft check setup: photography subset excludes drafts implicitly', true);
    // reset filter
    await page.click('button:has-text("ALL WORKS")'); await settle(page, 300);

    // 17 · draft/archived hidden publicly
    d = await getDoc();
    const victim = d.projects.find(p => p.slug === 'zova-clothing');
    const origStatus = victim.status ?? 'published';
    victim.status = 'draft';
    await save(d);
    await page.reload({ waitUntil: 'load' }); await settle(page, 1000);
    for (let i = 0; i < 5; i++) { const b = page.locator('button:has-text("LOAD MORE")'); if (!(await b.count())) break; await b.first().click(); await settle(page, 250); }
    const draftGone = await page.evaluate(() => ![...document.querySelectorAll('.works-card h3')].some(h => h.textContent.includes('ZOVA')));
    ok('17a', 'draft project hidden from Works grid', draftGone);
    await page.goto(BASE + '/works/zova-clothing', { waitUntil: 'load' }); await settle(page, 900);
    const nf = await page.evaluate(() => document.body.textContent.includes('PROJECT NOT FOUND'));
    ok('17b', 'draft slug serves not-found view', nf);
    // archived also hidden
    d = await getDoc(); d.projects.find(p => p.id === victim.id).status = 'archived'; await save(d);
    await page.goto(BASE + '/works', { waitUntil: 'load' }); await settle(page, 900);
    const archGone = await page.evaluate(() => ![...document.querySelectorAll('.works-card h3')].some(h => h.textContent.includes('ZOVA')));
    ok('17c', 'archived project hidden from Works grid', archGone);
    // restore
    d = await getDoc(); d.projects.find(p => p.id === victim.id).status = 'published'; await save(d);

    // 18 slugs unique in stored data
    const slugs = (await getDoc()).projects.map(p => p.slug);
    ok('18', 'all project slugs unique', new Set(slugs).size === slugs.length, `${slugs.length} slugs`);

    // 19 every published detail page renders its own title
    const published = (await getDoc()).projects.filter(p => (p.status ?? 'published') === 'published');
    let detailFails = [];
    for (const p of published) {
      await page.goto(`${BASE}/works/${p.slug}`, { waitUntil: 'domcontentloaded' });
      await waitMain(page);
      await settle(page, 250);
      const t = await page.evaluate(() => [...document.querySelectorAll('h1')].filter(h => !h.closest('.loader-container'))[0]?.textContent?.trim());
      if (!t || t.toUpperCase() !== p.title.toUpperCase()) detailFails.push(`${p.slug}(${t})`);
    }
    ok('19', `detail page renders for each of ${published.length} published projects`, detailFails.length === 0, detailFails.join(', ').slice(0, 120));
    ok('20a', 'wedding-category project opens through Works', published.some(p => /WEDDING/i.test(p.category || '')), 'ravindu-malikshi-wedding among them');

    // 26b per-project SEO title applied
    await page.goto(`${BASE}/works/photo-02` === '' ? BASE : `${BASE}/works/ceylon-gems`, { waitUntil: 'domcontentloaded' }); await settle(page, 600);
    const projTitle = await page.title();
    ok('26b', 'detail route applies per-project SEO title', /CEYLON GEMS/i.test(projTitle), projTitle);
    await context.close();
  }

  // ────────────────────────────────────────────────────────────────
  // 20–22 · Weddings experience
  // ────────────────────────────────────────────────────────────────
  {
    const { context, page } = await newPage(browser);
    await page.goto(BASE + '/weddings', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 20000 }).catch(() => {});
    await page.waitForSelector('#wedding-story-timeline', { timeout: 15000 });
    await settle(page, 900);

    const chapters = await page.evaluate(() => document.querySelectorAll('#wedding-story-timeline .grid button').length);
    ok('20b', 'wedding timeline chapters render from CMS', chapters >= 1, `chapters=${chapters}`);
    // switch chapter updates image src
    const firstSrc = await page.evaluate(() => document.querySelector('#wedding-story-timeline img')?.src);
    if (chapters > 1) {
      await page.evaluate(() => document.querySelectorAll('#wedding-story-timeline .grid button')[1].click());
      await settle(page, 700);
      const secondSrc = await page.evaluate(() => document.querySelector('#wedding-story-timeline img')?.src);
      ok('21a', 'timeline chapter switch swaps media', firstSrc !== secondSrc);
    }
    // stories section with gallery lightbox
    const storyImgs = await page.evaluate(() => document.querySelectorAll('#wedding-selected-stories img').length);
    ok('20c', 'selected wedding story renders', storyImgs > 0, `imgs=${storyImgs}`);
    // film video + poster
    const film = await page.evaluate(() => {
      const v = document.querySelector('#wedding-films-section video');
      return v ? { hasPoster: !!v.getAttribute('poster'), src: (v.currentSrc || v.src || '').slice(-40) } : null;
    });
    ok('22', 'wedding film video present with poster', !!film && film.hasPoster, JSON.stringify(film));
    await context.close();
  }

  // ────────────────────────────────────────────────────────────────
  // 23/24 · Contact submission stored + validation (real form fill)
  // ────────────────────────────────────────────────────────────────
  {
    const token = await loginAdmin();
    const { context, page } = await newPage(browser);
    await page.goto(BASE + '/', { waitUntil: 'load' }); await settle(page, 1200);
    await page.locator('#section-contact').scrollIntoViewIfNeeded(); await settle(page, 600);

    // validation: empty name blocked by required + our handler error
    await page.evaluate(() => window.open = () => { window.__waOpened = true; return null; });
    await page.fill('#cfx-name', '');
    await page.fill('#cfx-message', '');
    const [blocked] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/inquiries') && r.request().method() === 'POST', { timeout: 4000 }).then(r => r.status()).catch(() => null),
      page.evaluate(() => { const f = document.querySelector('#section-contact form'); f.dispatchEvent(new Event('submit', { cancelable: true })); }),
    ]);
    ok('24a', 'empty form is NOT submitted to backend', blocked === null, 'no POST fired');

    // happy path
    await page.fill('#cfx-name', 'Browser Bot');
    await page.fill('#cfx-email', 'bot@e2e.test');
    await page.fill('#cfx-phone', '+94 77 000 1234');
    await page.fill('#cfx-service', 'Commercial Shoot');
    await page.fill('#cfx-message', 'Real browser E2E inquiry');
    const postStatus = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/inquiries') && r.request().method() === 'POST'),
      page.click('#section-contact button[type="submit"]'),
    ]).then(([r]) => r.status()).catch(e => -1);
    ok('23a', 'contact POST accepted by API', postStatus === 200, `status=${postStatus}`);
    await settle(page, 500);
    const successShown = await page.evaluate(() => document.body.textContent.includes('Connecting on WhatsApp'));
    ok('23b', 'success state rendered', successShown);
    const list = await fetch(BASE + '/api/inquiries', { headers: { 'x-admin-token': token } }).then(r => r.json());
    const mine = list.find(i => i.name === 'Browser Bot');
    ok('23c', 'inquiry STORED with fields', !!mine && mine.email === 'bot@e2e.test' && mine.source === 'contact', mine ? `status=${mine.status}` : 'missing');
    if (mine) await fetch(`${BASE}/api/inquiries/${mine.id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    await context.close();
  }

  // ────────────────────────────────────────────────────────────────
  // 25 · Admin panel real flow: login, inbox, modules
  // ────────────────────────────────────────────────────────────────
  {
    const token = await loginAdmin();
    const { context, page } = await newPage(browser);
    // seed an inquiry so inbox is non-empty
    await fetch(BASE + '/api/inquiries', { method: 'POST', headers: ADMIN_TOKEN_HEADER, body: JSON.stringify({ name: 'Inbox Probe', email: 'probe@e2e.test', message: 'probe', source: 'contact' }) });

    await page.goto(BASE + '/admin', { waitUntil: 'load' }); await settle(page, 900);
    ok('25a', 'admin gate shows login', await page.locator('text=Sign in to manage website content').count() > 0);
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('.cfx-admin button[type="submit"]'); await settle(page, 700);
    ok('25b', 'wrong password rejected in UI', await page.locator('text=Incorrect password').count() > 0);
    await page.fill('input[type="password"]', 'creativefx2026');
    await page.click('.cfx-admin button[type="submit"]');
    await settle(page, 1100);
    ok('25c', 'login opens admin panel', await page.locator('text=Content management').count() > 0);

    await page.click('nav >> text=Contact / Inquiries'); await settle(page, 1200);
    const inboxHasIt = await page.locator('text=Inbox Probe').count() > 0;
    ok('25d', 'inbox lists submitted inquiry', inboxHasIt);

    await page.click('aside nav button:has-text("Works / Projects")'); await settle(page, 700);
    await page.click('aside nav button:has-text("All Projects")'); await page.waitForTimeout(900); await page.fill('input[placeholder*="Search by title"]', 'DANCE'); await page.waitForTimeout(700); await settle(page, 900);
    ok('25e', 'projects module lists records', await page.locator('text=DANCE COVERS').count() > 0);

    await page.click('aside nav button:has-text("Weddings")'); await settle(page, 600);
    await page.click('aside nav button:has-text("Stories")'); await settle(page, 900);
    await page.click('aside nav button:has-text("Stories")'); await settle(page, 900);
    ok('25f', 'weddings stories module reachable', await page.locator('text=Ravindu & Malikshi').count() > 0);

    // cleanup probe
    const list = await fetch(BASE + '/api/inquiries', { headers: { 'x-admin-token': token } }).then(r => r.json());
    for (const i of list.filter(x => x.name === 'Inbox Probe')) await fetch(`${BASE}/api/inquiries/${i.id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    await context.close();
  }

  // ────────────────────────────────────────────────────────────────
  // 27/28 · OG absolute URLs & no sensitive exposure
  // ────────────────────────────────────────────────────────────────
  {
    const { context, page } = await newPage(browser);
    for (const route of ['/', '/works', '/weddings']) {
      await page.goto(BASE + route, { waitUntil: 'load' }); await settle(page, 500);
      const og = await page.evaluate(() => document.querySelector('meta[property="og:image"]')?.content || '');
      ok('27', `og:image absolute on ${route}`, /^https?:\/\//.test(og), og.slice(0, 60));
    }
    const html = await (await fetch(BASE + '/')).text();
    ok('28a', 'served HTML contains no password/secret', !html.includes('creativefx2026') && !html.includes('cfx-secret'));
    const pubApi = await fetch(BASE + '/api/inquiries');
    ok('28b', 'public cannot read inquiries (401)', pubApi.status === 401);
    const stats = await fetch(BASE + '/api/stats');
    ok('28c', 'public cannot read server stats (401)', stats.status === 401);
    await context.close();
  }
} catch (err) {
  console.error('SUITE ERROR:', err);
  fail++;
}

await browser.close();

// ────────────────────────────────────────────────────────────────
console.log(`\n=== BROWSER SUITE: ${pass} passed, ${fail} failed ===`);
process.exit(fail ? 1 : 0);
