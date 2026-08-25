/**
 * SSR render smoke test — mounts every public page/section and every Admin
 * module with React's renderToString. Effects (GSAP/Lenis/fetch) are skipped
 * by design; this catches render-time crashes such as undefined identifiers,
 * bad optional chaining, or broken data mapping.
 *
 * Run: npx tsx scripts/render-smoke.tsx
 */
import React from 'react';
import { renderToString } from 'react-dom/server';

// ── Minimal browser globals for module scope & state initializers ──
const g = globalThis as Record<string, unknown>;
if (!g.window) {
  (g as any).window = g;
}
(g as any).location ||= { pathname: '/', search: '', hash: '', href: 'http://localhost/', origin: 'http://localhost' };
(g as any).navigator ||= { userAgent: 'node' };
(g as any).sessionStorage ||= {
  _m: new Map<string, string>(),
  getItem(k: string) { return this._m.get(k) ?? null; },
  setItem(k: string, v: string) { this._m.set(k, v); },
  removeItem(k: string) { this._m.delete(k); },
};
(g as any).localStorage ||= (g as any).sessionStorage;
const rect = () => ({ top: 0, left: 0, right: 1440, bottom: 900, width: 1440, height: 900 });
const makeEl = (): Record<string, unknown> => ({
  style: {
    setProperty() {},
    removeProperty() {},
    getPropertyValue: () => '',
  },
  setAttribute() {},
  getAttribute: () => null,
  hasAttribute: () => false,
  removeAttribute() {},
  appendChild(...args: unknown[]) { return makeEl.apply({ }, args); },
  removeChild() {},
  remove() {},
  addEventListener() {},
  removeEventListener() {},
  getBoundingClientRect: rect,
  offsetWidth: 0,
  offsetHeight: 0,
  clientWidth: 0,
  clientHeight: 0,
  scrollTop: 0,
  parentNode: null,
});
(g as any).document ||= {
  head: makeEl(),
  body: makeEl(),
  documentElement: Object.assign(makeEl(), { scrollHeight: 5000 }),
  title: '',
  visibilityState: 'visible',
  createElement: () => makeEl(),
  createTextNode: () => ({}),
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  addEventListener() {},
  removeEventListener() {},
  fonts: undefined,
};
(g.document as Record<string, unknown>).body = Object.assign(makeEl(), {
  appendChild: () => { const c = makeEl(); c.remove = () => {}; return c; },
});
(g as any).window = g; // after document so window.document resolves
(g as any).innerWidth = 1440;
(g as any).innerHeight = 900;
(g as any).pageYOffset = 0;
(g as any).scrollY = 0;
(g as any).addEventListener = () => {};
(g as any).removeEventListener = () => {};
(g as any).CustomEvent = class { constructor(public type: string) {} };
(g as any).history ||= { scrollRestoration: 'auto', pushState() {}, replaceState() {} };
(g as any).matchMedia ||= () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
(g as any).requestAnimationFrame ||= (cb: (t: number) => void) => setTimeout(() => cb(0), 0);

async function main() {
  const { ContentProvider, DEFAULT_CONTENT } = await import('../src/context/ContentContext');
  const { filterPublished, resolveFeaturedWork, resolveSelectedWork } = await import('../src/context/ContentContext');

  let pass = 0;
  let fail = 0;
  const render = (name: string, el: React.ReactElement) => {
    try {
      const html = renderToString(el);
      if (!html || html.length < 20) throw new Error('empty output');
      console.log('PASS', name, `(${html.length} chars)`);
      pass++;
    } catch (e) {
      console.error('FAIL', name, '→', (e as Error).message);
      fail++;
    }
  };

  const wrap = (el: React.ReactElement) => React.createElement(ContentProvider, null, el);

  // ── Data-layer invariants ──
  const featured = resolveFeaturedWork(DEFAULT_CONTENT);
  const selected = resolveSelectedWork(DEFAULT_CONTENT);
  console.log('featured works:', featured.length, '| selected work cards:', selected.projects.length + (selected.weddingsTile ? 1 : 0));
  if (featured.length !== 6) throw new Error('expected 6 featured projects');
  if (selected.projects.length !== 7) throw new Error('expected 7 project tiles');
  if (!selected.weddingsTile) throw new Error('expected weddings tile');

  const pub = filterPublished(DEFAULT_CONTENT.projects);
  if (pub.length !== DEFAULT_CONTENT.projects.length) throw new Error('static defaults should all be published');

  // ── Public sections ──
  const { Header } = await import('../src/components/Header');
  const { Footer } = await import('../src/components/Footer');
  const { IntroductionSection } = await import('../src/components/IntroductionSection');
  const { FeaturedWorkSection } = await import('../src/components/FeaturedWorkSection');
  const { PortfolioSection } = await import('../src/components/PortfolioSection');
  const { ServicesSection } = await import('../src/components/ServicesSection');
  const { AboutSection } = await import('../src/components/AboutSection');
  const { FinalCtaSection } = await import('../src/components/FinalCtaSection');
  const { ContactSection } = await import('../src/components/ContactSection');
  const { WorksPage } = await import('../src/components/WorksPage');
  const { ProjectDetailPage } = await import('../src/components/ProjectDetailPage');
  const { PageLoader } = await import('../src/components/PageLoader');
  const { TextSizeControl } = await import('../src/components/TextSizeControl');
  const { CustomCursor } = await import('../src/components/CustomCursor');

  render('Header', wrap(React.createElement(Header, { activeView: 'home' })));
  render('Footer', wrap(React.createElement(Footer)));
  render('IntroductionSection', wrap(React.createElement(IntroductionSection)));
  render('FeaturedWorkSection', wrap(React.createElement(FeaturedWorkSection)));
  render('FeaturedWorkSection(mobile)', wrap(React.createElement(FeaturedWorkSection)));
  render('PortfolioSection', wrap(React.createElement(PortfolioSection)));
  render('ServicesSection', wrap(React.createElement(ServicesSection)));
  render('AboutSection', wrap(React.createElement(AboutSection)));
  render('FinalCtaSection', wrap(React.createElement(FinalCtaSection, { onStartProject: () => {} })));
  render('ContactSection', wrap(React.createElement(ContactSection)));
  render('PageLoader', wrap(React.createElement(PageLoader, { onComplete: () => {} })));
  render('TextSizeControl', wrap(React.createElement(TextSizeControl)));

  // WorksPage — default and preset filter
  render('WorksPage', wrap(React.createElement(WorksPage, { onSwitchToStudio: () => {}, onSwitchToWeddings: () => {} })));
  render('WorksPage?f=photography', wrap(React.createElement(WorksPage, { initialFilter: 'PHOTOGRAPHY', onSwitchToStudio: () => {}, onSwitchToWeddings: () => {} })));

  // Project detail — valid slug, invalid slug (404 view)
  render('ProjectDetailPage(zova-clothing)', wrap(React.createElement(ProjectDetailPage, { projectSlug: 'zova-clothing', onBack: () => {}, onSwitchToStudio: () => {}, onSwitchToWeddings: () => {}, onStartProject: () => {} })));
  render('ProjectDetailPage(dance-covers/admin-created)', wrap(React.createElement(ProjectDetailPage, { projectSlug: 'dance-covers', onBack: () => {}, onSwitchToStudio: () => {}, onSwitchToWeddings: () => {}, onStartProject: () => {} })));
  render('ProjectDetailPage(not-found)', wrap(React.createElement(ProjectDetailPage, { projectSlug: 'does-not-exist', onBack: () => {}, onSwitchToStudio: () => {}, onSwitchToWeddings: () => {}, onStartProject: () => {} })));

  // ── Weddings experience ──
  const w = await import('../src/components/weddings/WeddingExperiencePage');
  render('WeddingExperiencePage', wrap(React.createElement(w.WeddingExperiencePage, { onSwitchToStudio: () => {} })));
  const wh = await import('../src/components/weddings/WeddingHero');
  render('WeddingHero', wrap(React.createElement(wh.WeddingHero)));

  // ── Admin Panel (all modules mount through menu state) ──
  const { AdminPanel } = await import('../src/admin/AdminPanel');
  render('AdminPanel(closed state)', wrap(React.createElement(AdminPanel, { onClose: () => {} })));
  const admin = await import('../src/admin/components/HomepageSection');
  render('Admin/HomepageSection', wrap(React.createElement(admin.HomepageSection, { content: DEFAULT_CONTENT, update: () => {} })));
  const ws = await import('../src/admin/components/WorksSection');
  render('Admin/WorksSection(list)', wrap(React.createElement(ws.WorksSection, { item: 'All Projects', content: DEFAULT_CONTENT, update: () => {} })));
  render('Admin/WorksSection(add)', wrap(React.createElement(ws.WorksSection, { item: 'Add Project', content: DEFAULT_CONTENT, update: () => {} })));
  const wa = await import('../src/admin/components/WeddingsAdmin');
  for (const tab of ['Hero', 'Timeline', 'Stories', 'Approach']) {
    render(`Admin/WeddingsAdmin(${tab})`, wrap(React.createElement(wa.WeddingsAdmin, { tab, content: DEFAULT_CONTENT, update: () => {} })));
  }
  const sa = await import('../src/admin/components/ServicesAdmin');
  render('Admin/ServicesAdmin', wrap(React.createElement(sa.ServicesAdmin, { content: DEFAULT_CONTENT, update: () => {} })));
  const aa = await import('../src/admin/components/AboutAdmin');
  render('Admin/AboutAdmin', wrap(React.createElement(aa.AboutAdmin, { content: DEFAULT_CONTENT, update: () => {} })));
  const ps = await import('../src/admin/components/PagesSection');
  render('Admin/PagesSection(Works)', wrap(React.createElement(ps.PagesSection, { item: 'Works', content: DEFAULT_CONTENT, update: () => {} })));
  render('Admin/PagesSection(Contact)', wrap(React.createElement(ps.PagesSection, { item: 'Contact', content: DEFAULT_CONTENT, update: () => {} })));
  const web = await import('../src/admin/components/WebsiteSection');
  for (const item of ['Navigation', 'Footer', 'Page Visibility']) {
    render(`Admin/WebsiteSection(${item})`, wrap(React.createElement(web.WebsiteSection, { item, content: DEFAULT_CONTENT, update: () => {} })));
  }
  const seo = await import('../src/admin/components/SEOSection');
  render('Admin/SEOSection', wrap(React.createElement(seo.SEOSection, { content: DEFAULT_CONTENT, update: () => {} })));
  const theme = await import('../src/admin/components/ThemeSection');
  render('Admin/ThemeSection', wrap(React.createElement(theme.ThemeSection, { content: DEFAULT_CONTENT, update: () => {} })));
  const settings = await import('../src/admin/components/SettingsSection');
  render('Admin/SettingsSection', wrap(React.createElement(settings.SettingsSection, { content: DEFAULT_CONTENT, update: () => {}, resetContent: async () => {} })));
  const users = await import('../src/admin/components/AdminUsersSection');
  render('Admin/AdminUsersSection', wrap(React.createElement(users.AdminUsersSection)));

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('SMOKE TEST CRASH:', e);
  process.exit(1);
});
