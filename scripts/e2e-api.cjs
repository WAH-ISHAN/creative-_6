/** Final E2E regression against the production server (dist + Express). */
const base = 'http://localhost:4000';
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log('PASS', name, extra); }
  else { fail++; console.error('FAIL', name, extra); }
};
const j = r => r.json();

(async () => {
  // ── Public surface ──
  for (const route of ['/', '/works', '/works/zova-clothing', '/weddings', '/photography-alias-check', '/admin']) {
    const r = await fetch(base + (route === '/photography-alias-check' ? '/photography' : route));
    const html = await r.text();
    ok('SPA ' + route, r.status === 200 && html.includes('id="root"'));
  }

  const c = await fetch(base + '/api/content').then(j);
  ok('content.projects = 19', c.projects.length === 19, `got ${c.projects.length}`);
  ok('content.home present', Array.isArray(c.home?.featuredProjectIds) && c.home.featuredProjectIds.length === 6);
  ok('all projects published', c.projects.every(p => (p.status ?? 'published') === 'published'));
  ok('featured flags aligned', c.projects.filter(p => p.featured).length === 6);

  // static media
  const img = await fetch(base + '/img/wedding/Ravindu%20&%20Malikshi/DSC09233.jpg', { method: 'HEAD' });
  ok('static wedding image', img.status === 200);
  const vid = await fetch(base + '/video/Malikshi_Ravindu_Wedding.mp4', { method: 'HEAD' });
  ok('static video', vid.status === 200);

  // ── Auth ──
  let r = await fetch(base + '/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': 'dev-token' }, body: '{}' });
  ok('legacy dev-token rejected', r.status === 401);
  const login = await fetch(base + '/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'creativefx2026' }) }).then(j);
  ok('login issues token', !!login.token);
  const H = { 'Content-Type': 'application/json', 'x-admin-token': login.token };

  r = await fetch(base + '/api/inquiries');
  ok('inquiries list requires auth', r.status === 401);
  r = await fetch(base + '/api/uploads');
  ok('uploads list requires auth', r.status === 401);

  // ── Inquiry lifecycle (contact form path) ──
  r = await fetch(base + '/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'E2E Contact', email: 'e2e@test.lk', phone: '+94771111111', service: 'Commercial Shoot', message: 'final e2e inquiry', source: 'contact' }) }).then(j);
  ok('contact inquiry accepted (no email required)', r.ok === true);
  r = await fetch(base + '/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'E2E Wedding', email: 'w@test.lk', message: 'date 2026-12-12\nvenue Galle', source: 'wedding' }) }).then(j);
  ok('wedding inquiry accepted', r.ok === true);
  r = await fetch(base + '/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Bad Email', email: 'nope', message: 'x' }) });
  ok('invalid email rejected', r.status === 400);

  let list = await fetch(base + '/api/inquiries', { headers: H }).then(j);
  const mine = list.filter(i => i.name.startsWith('E2E'));
  ok('both e2e inquiries stored', mine.length === 2, `got ${mine.length}`);
  ok('newest first', list[0].name === 'E2E Wedding');

  const id = mine[0].id;
  r = await fetch(`${base}/api/inquiries/${id}`, { method: 'PATCH', headers: H, body: JSON.stringify({ status: 'contacted' }) });
  ok('status patched', r.ok);
  list = await fetch(base + '/api/inquiries', { headers: H }).then(j);
  ok('patch persisted', list.find(i => i.id === id).status === 'contacted');
  r = await fetch(`${base}/api/inquiries/${id}`, { method: 'DELETE', headers: H });
  ok('inquiry deleted', r.ok);
  r = await fetch(`${base}/api/inquiries/${id}`, { method: 'DELETE', headers: H });
  ok('double delete 404', r.status === 404);

  // cleanup remaining e2e record
  list = await fetch(base + '/api/inquiries', { headers: H }).then(j);
  for (const i of list.filter(x => x.name.startsWith('E2E'))) {
    await fetch(`${base}/api/inquiries/${i.id}`, { method: 'DELETE', headers: H });
  }
  list = await fetch(base + '/api/inquiries', { headers: H }).then(j);
  ok('inbox clean after tests', !list.some(i => i.name.startsWith('E2E')));

  // ── Admin content update propagates to public GET ──
  let doc = await fetch(base + '/api/content').then(j);
  doc.settings.announcementEnabled = true;
  doc.settings.announcementText = 'E2E ANNOUNCEMENT ✓';
  r = await fetch(base + '/api/content', { method: 'POST', headers: H, body: JSON.stringify(doc) });
  ok('admin save ok', r.ok);
  doc = await fetch(base + '/api/content').then(j);
  ok('announcement propagated', doc.settings.announcementText === 'E2E ANNOUNCEMENT ✓');
  // revert
  doc.settings.announcementEnabled = false;
  doc.settings.announcementText = 'NOW BOOKING COMMERCIALS & WEDDING DATES FOR 2026 / 2027';
  await fetch(base + '/api/content', { method: 'POST', headers: H, body: JSON.stringify(doc) });

  // stats endpoint
  const stats = await fetch(base + '/api/stats', { headers: H }).then(j);
  ok('stats endpoint', typeof stats.inquiryCount === 'number');

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('E2E CRASH:', e && e.message || e); process.exit(1); });
