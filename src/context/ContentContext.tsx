import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ALL_PROJECTS } from '../data/projectsData';
import { SELECTED_WEDDINGS, WEDDING_TIMELINE_STAGES, WEDDING_APPROACH_PRINCIPLES } from '../data/weddingData';
import type { ContentStatus, GalleryInput, GalleryMedia, ProjectCase } from '../types';
import { detectMediaKind, toGalleryItems } from '../types';

// ─── Default Content (fallback if no server data) ────────────────────────────
export const DEFAULT_CONTENT = {
  hero: {
    title: 'BEYOND CREATIVITY',
    subtitle: 'BEYOND CREATIVITY',
    description: 'CreativeFX is a creative agency specializing in photography, videography, content creation, and digital marketing solutions for modern brands.',
  },
  intro: {
    sectionNumber: '01',
    label: '/ Studio',
    headline: 'WE CREATE\nWHAT PEOPLE\nREMEMBER.',
    body: 'CreativeFX is a creative agency specializing in photography, videography, content creation, and digital marketing — built to make modern brands stand out.',
    bodyLine2: 'Based in Sri Lanka. Working globally.',
    image: '/img/Products/Zova Clothing/DSC06381.jpg',
  },
  // Master services list — rendered by ServicesSection & ServiceDetailModal
  services: [
    {
      id: 'photo-video', code: 'SRV-01', number: '01', title: 'PHOTOGRAPHY & VIDEOGRAPHY',
      shortDesc: 'We capture high quality photos and videos for brands, products, events, and promotional purposes, ensuring visually compelling and professional content.',
      fullDesc: 'From medium-format studio photography and architectural lookbooks to cinematic 8K anamorphic video, we engineer moving and still imagery with uncompromising clarity and emotional resonance.',
      capabilities: ['Commercial Brand Campaigns', 'High-Speed Product Photography', 'Event & Milestone Visuals', 'Cinematic 8K Video Production', 'Lookdev Lighting & Art Direction'],
      deliverables: ['Master Uncompressed RAW TIFFs', 'Color Graded 4K/8K Video Masters', 'Social Cutdowns (9:16, 4:5, 16:9)', 'High-End Retouched Lookbooks'],
      highlight: '8K RAW & Medium-Format Still Capture',
      previewImage: '/img/poster/Sprite Shoot- Final.jpg',
      status: 'published' as ContentStatus,
    },
    {
      id: 'video-editing-motion', code: 'SRV-02', number: '02', title: 'VIDEO EDITING & MOTION GRAPHICS',
      shortDesc: 'We create engaging video content with smooth editing, visual effects, and motion graphics to enhance storytelling and marketing impact.',
      fullDesc: 'Merging surgical timeline pacing, kinetic typography, 3D product simulation, and holographic UI design to transform raw frames into visceral cinematic stories that retain audience attention.',
      capabilities: ['Dynamic Narrative Assembly', 'Kinetic 3D Typography Systems', 'Visual Effects (VFX) & Compositing', 'Sound Design & Audio Spatialization', 'Brand Motion Toolkits & Idents'],
      deliverables: ['Full Motion Graphics Packages', 'Platform-Native Dynamic Cuts', 'Bespoke Soundscape Masters', 'Lottie & Web-Ready Vector Files'],
      highlight: 'Surgical Rhythm & 3D Procedural Motion',
      previewImage: '/img/poster/finalWasthi.jpg',
      status: 'published' as ContentStatus,
    },
    {
      id: 'social-media', code: 'SRV-03', number: '03', title: 'SOCIAL MEDIA CONTENT DESIGN',
      shortDesc: 'Creation of engaging social media graphics and promotional content that increases brand visibility and audience engagement across digital platforms.',
      fullDesc: 'Hook-first visual architectures engineered specifically for TikTok, Instagram Reels, YouTube Shorts, and X. We craft culturally resonant daily asset engines that stop the scroll.',
      capabilities: ['High-Retention Short-Form Reels', 'Interactive Carousel Architectures', 'Trend Hijacking & Fast Turnarounds', 'Creator & Influencer Asset Direction', 'Visual Content Engine Systems'],
      deliverables: ['Weekly Batch Releases', 'Tested Hook Variations (A/B)', 'Custom Brand Filter & Sticker Sets', 'Monthly Engagement Optimization Data'],
      highlight: 'Hook-First Retention & Viral Strategy',
      previewImage: '/img/poster/RentMasterFinal.jpg',
      status: 'published' as ContentStatus,
    },
    {
      id: 'branding-design', code: 'SRV-04', number: '04', title: 'BRANDING & DESIGN',
      shortDesc: 'We develop strong brand identities through logo design, visual branding, and creative graphic designs that represent your business effectively.',
      fullDesc: 'We build cohesive visual universes with distinctive geometric logotypes, custom typography systems, meticulous grid guidelines, and tactile packaging that elevate brand equity.',
      capabilities: ['Visual Identity & Logotype Design', 'Custom Typography & Type Systems', 'Comprehensive Brand Style Guides', 'Editorial Packaging & Print Collateral', 'Digital Design Systems'],
      deliverables: ['Master Vector Brand Identity System', 'Type Specimen & Font Packages', 'Digital Guidelines Portal', 'Print-Ready Packaging Die-Lines'],
      highlight: 'Distinctive Geometric Aesthetics',
      previewImage: '/img/Birthdays/Thathsarani/1st copy.jpg',
      status: 'published' as ContentStatus,
    },
    {
      id: 'digital-marketing', code: 'SRV-05', number: '05', title: 'DIGITAL MARKETING',
      shortDesc: 'We provide creative digital marketing solutions, including social media content and campaigns, to help brands reach and engage their target audience.',
      fullDesc: 'Creative that doesn’t just look striking—it drives measurable audience expansion and conversion. We unite high-impact creative bets with full-funnel strategic distribution.',
      capabilities: ['Performance Creative Campaigns', 'Launch Activations & PR Stunts', 'Full-Funnel Distribution Strategy', 'Audience Engagement Optimization', 'Data-Backed Creative Iteration'],
      deliverables: ['100+ Ad Creative Variations', 'Omnichannel Campaign Roadmaps', 'Weekly ROAS & Retention Analytics', 'High-Conversion Landing Frameworks'],
      highlight: 'Creative-Led Measurable Growth',
      previewImage: '/img/Events/Gender Reveal/DSC09470.jpg',
      status: 'published' as ContentStatus,
    },
  ],
  about: {
    headline: 'WE CREATE\nWHAT PEOPLE\nREMEMBER.',
    lead: 'CreativeFX is a creative agency focused on turning ideas into meaningful visual experiences.',
    body1: 'We believe great content is more than beautiful visuals. It is about having the right idea, telling the right story, and making people feel something.',
    body2: 'From businesses looking to build their online presence to individuals capturing important milestones, we bring creativity and professional production together to create content that stands out.',
    vision: 'To become a leading creative design studio recognized for innovation, creativity, and impactful visual experiences that inspire brands and audiences.',
    mission: 'To deliver high quality creative solutions that help businesses communicate their ideas effectively through design, digital media, and visual storytelling while maintaining professionalism, creativity, and client satisfaction.',
    stats: [
      { value: '100+', label: 'Projects Completed' },
      { value: '50+', label: 'Happy Clients' },
      { value: '3+', label: 'Years Experience' },
    ],
  },
  contact: {
    phone: '+94 77 754 8671',
    email: 'hello@creativefx.lk',
    location: 'Kaduwela, Sri Lanka',
    instagram: 'https://instagram.com/creativefx.lk',
    facebook: 'https://facebook.com/creativefx.lk',
    tiktok: 'https://tiktok.com/@creativefx.lk',
    whatsapp: '94777548671',
  },
  // Homepage sections driven from the master project database.
  // `featuredSectionTitle` feeds the pinned Featured Work scroll.
  home: {
    featuredLabel: 'A curated selection of CreativeFX stories, captured with intention.',
    /** Project IDs shown in the pinned Featured Work scroll (original beautiful 6-photo collection) */
    featuredProjectIds: ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06'] as string[],
    /** Project IDs shown in the Selected Work grid. `__weddings__` renders the weddings tile. */
    selectedWorkIds: ['proj-01', 'proj-02', '__weddings__', 'video-graduation', 'video-events', 'photo-casual', 'photo-02', 'proj-05'] as string[],
    showWeddingsTile: true,
  },
  // Legacy alias kept so older content.json files don't break — superseded by `home`
  portfolio: {
    items: [] as { id: string; title: string; categoryLabel: string; coverImage: string; videoUrl?: string; isWedding?: boolean }[],
  },
  cta: {
    tagline: 'START A COLLABORATION',
    headline: 'WANT YOUR BRAND\nTO BE OUR NEXT\nPROJECT?',
    subHeadline: 'NEED SOMETHING CUSTOM?',
    body: "Don't see exactly what you're looking for? Tell us what you have in mind. We'll work with you to create a bespoke visual solution that fits your exact goals.",
    buttonLabel: 'START A PROJECT',
  },
  testimonials: [
    {
      quote: 'Our wedding film feels like an international cinema production. The reaction shots and color grading made our memories completely timeless.',
      author: 'Ravindu & Malikshi',
      role: 'Wedding Story Commission',
      avatar: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
    },
    {
      quote: 'CreativeFX redefined how our brand communicates. The social video reels drove a 240% engagement surge in under three weeks.',
      author: 'Zova Clothing',
      role: 'Commercial Fashion Campaign',
      avatar: '/img/Products/Zova Clothing/DSC06306.jpg',
    },
    {
      quote: 'Unmatched artistic vision. From high-speed product visuals to crisp audio identity, their team operates at the bleeding edge.',
      author: 'Ceylon Gems Studio',
      role: 'Product Photography & Cinema',
      avatar: '/img/Products/Gems/DSC01031.jpg',
    },
    {
      quote: 'The graduation coverage was beyond expectations. Every emotional detail was preserved with cinematic finesse.',
      author: 'University Graduation',
      role: 'Documentary Milestone',
      avatar: '/img/Graduation/Samudi/DSC00131.jpg',
    },
  ],
  weddings: {
    heroHeadline: 'MOMENTS\nARE NOT POSED.\nTHEY ARE\nREMEMBERED.',
    heroSubtitle: '/ Weddings by CreativeFX',
    heroDescription: 'We document the most meaningful day of your life with artistry, emotion, and cinematic precision.',
    heroImage: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
    heroCaption: 'RAVINDU & MALIKSHI // COLOMBO',
    heroReelLabel: 'WATCH WEDDING CINEMA REEL',
    timelineHeadline: 'EVERY UNFORGETTABLE\nCHAPTER OF YOUR DAY.',
    timelineIntro: 'We capture the real smiles, spontaneous laughter, and heartwarming moments with natural elegance from start to finish.',
    storiesHeadline: 'SELECTED\nSTORIES.',
    approachHeadline: 'OUR APPROACH\n& PHILOSOPHY.',
  },
  // Wedding content structures (editable via Admin → Weddings)
  weddingTimeline: WEDDING_TIMELINE_STAGES,
  weddingStories: SELECTED_WEDDINGS,
  weddingApproach: WEDDING_APPROACH_PRINCIPLES,
  // ─── Contact page copy (admin → Pages → Contact) ──────────────────────────
  contactPage: {
    label: '07 / CONTACT',
    headline: 'Contact Us',
    description: 'Please reach out to us and we will get back to you at the speed of light.',
    whatsappCta: 'QUICK CHAT ON WHATSAPP',
    ctaText: 'SEND MESSAGE',
    successTitle: 'MESSAGE RECEIVED.',
    successBody: "Thank you for reaching out. We'll be in touch soon.",
  },
  // All master projects — the single source of truth referenced everywhere
  projects: ALL_PROJECTS as ProjectCase[],
  // ─── SEO / metadata (admin → SEO section) ──────────────────────────────────
  seo: {
    title: 'CreativeFX — Photography, Videography & Digital Marketing | Sri Lanka',
    description: 'CreativeFX is a Sri Lanka-based premier creative agency specializing in photography, videography, video editing, social media content, branding, and digital marketing.',
    keywords: 'photography sri lanka, videography, creative agency, wedding photography, product photography, video editing, branding, colombo',
    canonicalUrl: 'https://creativefx.lk',
    ogImage: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
    analyticsId: '',
    searchConsoleId: '',
    allowIndexing: true,
  },
  // ─── Theme / branding (admin → Theme section) ──────────────────────────────
  theme: {
    accentColor: '#fcbf13',
    logoUrl: '/img/creativefx-bgr-logo.png',
  },
  // ─── Navigation labels (admin → Website → Navigation) ──────────────────────
  nav: {
    work: 'WORK',
    services: 'SERVICES',
    weddings: 'WEDDINGS',
    about: 'ABOUT',
    cta: 'INQUIRE',
  },
  // ─── Footer (admin → Website → Footer) ─────────────────────────────────────
  footer: {
    tagline: "LET'S CREATE WHAT PEOPLE REMEMBER.",
    copyright: 'CREATIVEFX STUDIO. ALL RIGHTS RESERVED.',
  },
  // ─── Site settings (admin → Website → Page Visibility, Settings) ───────────
  settings: {
    showWeddings: true,
    showWorks: true,
    customCursor: true,
    maintenanceMode: false,
    announcementEnabled: false,
    announcementText: 'NOW BOOKING COMMERCIALS & WEDDING DATES FOR 2026 / 2027',
    rateCardEnabled: false,
    rateCardUrl: '',
    bookingPolicy: '',
    identity: {
      brandName: 'CreativeFX Studio',
      timezone: 'Asia/Colombo (GMT+5:30)',
      currency: 'LKR (Rs)',
      language: 'English',
    },
  },
  // ─── Editable page headers (admin → Pages → Works) ─────────────────────────
  pages: {
    worksTitle: 'WORKS /\nPROJECTS',
    worksIntro: 'A curated selection of our commercial, editorial, and documentary commissions spanning photography and cinema.',
  },
};

// Deep-merge helper: server values win, but nested defaults are preserved so
// newly-added fields always exist even when the stored JSON is older.
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base)) return (override === undefined ? base : override) as T;
  if (!isPlainObject(override)) return base;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const o = (override as Record<string, unknown>)[key];
    const b = (base as Record<string, unknown>)[key];
    out[key] = isPlainObject(b) && isPlainObject(o) ? deepMerge(b, o) : o === undefined ? b : o;
  }
  return out as T;
}

export type SiteContent = typeof DEFAULT_CONTENT;

/** Migrates legacy fields (portfolio.items, missing home ids) into the current shape. */
function migrateContent(raw: unknown): SiteContent {
  const merged = deepMerge(DEFAULT_CONTENT, raw) as SiteContent & { portfolio?: { items?: { id: string; isWedding?: boolean }[] } };

  // If the new `home.selectedWorkIds` was never saved but legacy portfolio items exist,
  // convert them once into project references.
  const legacyItems = merged.portfolio?.items || [];
  const hasLegacy = legacyItems.length > 0;
  const homeAny = merged.home as unknown as { _migrated?: boolean };
  if (hasLegacy && !homeAny._migrated) {
    const ids = legacyItems
      .map((it: { id: string; isWedding?: boolean }) => (it.isWedding ? '__weddings__' : it.id))
      .filter(id => id === '__weddings__' || merged.projects.some(p => p.id === id));
    if (ids.length > 0) {
      merged.home = { ...merged.home, selectedWorkIds: ids };
    }
  }
  return merged as SiteContent;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface ContentContextType {
  content: SiteContent;
  updateContent: (path: string[], value: unknown) => Promise<void>;
  resetContent: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

const ContentContext = createContext<ContentContextType>({
  content: DEFAULT_CONTENT,
  updateContent: async () => {},
  resetContent: async () => {},
  isLoading: false,
  isSaving: false,
  lastSaved: null,
});

// Helper: set nested value by path array
function setNestedValue(obj: unknown, path: string[], value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const idx = parseInt(head, 10);
  if (!isNaN(idx) && Array.isArray(obj)) {
    const arr = [...obj];
    arr[idx] = setNestedValue(arr[idx], rest, value);
    return arr;
  }
  return { ...(obj as Record<string, unknown>), [head]: setNestedValue((obj as Record<string, unknown>)?.[head], rest, value) };
}

// ─── API base URL (same origin via Vite proxy in dev/mobile, or custom env) ──
export const API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) || '';

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveTimer = useRef<number | null>(null);
  const pendingDoc = useRef<SiteContent | null>(null);

  // Apply SEO metadata + brand accent to the document whenever content changes
  useEffect(() => {
    const seo = { ...DEFAULT_CONTENT.seo, ...(content.seo || {}) };

    // A route-level useSeo() owns the title when one is active (e.g. a project
    // detail page) — the global default must not win the race against it.
    const routeOwnsTitle = (globalThis as unknown as { __cfxRouteTitle?: { active: boolean } }).__cfxRouteTitle?.active;
    if (!routeOwnsTitle) document.title = seo.title;

    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };
    setMeta('name', 'description', seo.description);
    setMeta('name', 'keywords', seo.keywords);
    setMeta('name', 'robots', seo.allowIndexing ? 'index, follow' : 'noindex, nofollow');

    // Open Graph requires ABSOLUTE image URLs — absolutize against canonical origin
    let origin = '';
    try { origin = seo.canonicalUrl ? new URL(seo.canonicalUrl).origin : ''; } catch { origin = ''; }
    const abs = (url: string) => {
      if (!url) return url;
      if (/^https?:\/\//i.test(url)) return url;
      return `${origin}${url}`;
    };

    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:image', abs(seo.ogImage));
    setMeta('property', 'og:url', seo.canonicalUrl || window.location.href);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setMeta('name', 'twitter:image', abs(seo.ogImage));

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical && seo.canonicalUrl) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    if (canonical && seo.canonicalUrl) canonical.setAttribute('href', seo.canonicalUrl);

    // Brand accent color → drives the whole public site via CSS variable
    const theme = { ...DEFAULT_CONTENT.theme, ...(content.theme || {}) };
    if (theme.accentColor && /^#[0-9a-fA-F]{3,8}$/.test(theme.accentColor)) {
      document.documentElement.style.setProperty('--fx-yellow', theme.accentColor);
    }
  }, [content]);

  // Load content from server on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/content`)
      .then(r => r.json())
      .then(data => {
        setContent(migrateContent(data));
        setIsLoading(false);
      })
      .catch(() => {
        // Server not reachable — use defaults (works in dev without server)
        console.warn('[ContentContext] Server not reachable, using defaults.');
        setIsLoading(false);
      });
  }, []);

  // Flush the newest document to the server (debounced coalescing of rapid edits)
  const flushSave = useCallback(async () => {
    const doc = pendingDoc.current;
    pendingDoc.current = null;
    if (!doc) return;
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('cfx_admin_token') || '' },
        body: JSON.stringify(doc),
      });
      setLastSaved(new Date());
    } catch (e) {
      console.error('[ContentContext] Save failed', e);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Update a field by path, persist to server (debounced ~600ms)
  const updateContent = useCallback(async (path: string[], value: unknown) => {
    setContent(prev => {
      const next = setNestedValue(prev, path, value) as SiteContent;
      pendingDoc.current = next;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => { void flushSave(); }, 600);
      return next;
    });
  }, [flushSave]);

  const resetContent = useCallback(async () => {
    setContent(DEFAULT_CONTENT);
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/api/content/reset`, {
        method: 'POST',
        headers: { 'x-admin-token': sessionStorage.getItem('cfx_admin_token') || '' },
      });
      setLastSaved(new Date());
    } catch (e) {
      console.error('[ContentContext] Reset failed', e);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, isLoading, isSaving, lastSaved }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);

// ─── Master project helpers (single source of truth) ─────────────────────────
/**
 * Builds the authoritative project dataset: records edited in the Admin Panel
 * (data/content.json) win; static defaults fill any missing fields. Projects
 * created in the Admin Panel are included even though they have no static entry.
 */
function buildProjects(content: SiteContent): ProjectCase[] {
  const serverProjects: ProjectCase[] = Array.isArray(content.projects) ? content.projects : [];
  if (!serverProjects.length) return ALL_PROJECTS;

  const staticById = new Map(ALL_PROJECTS.map(p => [p.id, p]));
  const seen = new Set<string>();
  const out: ProjectCase[] = [];

  for (const sp of serverProjects) {
    seen.add(sp.id);
    const base = staticById.get(sp.id);
    out.push(base ? {
      ...base,
      ...sp,
      socialPosts: (sp.socialPosts && sp.socialPosts.length > 0) ? sp.socialPosts : base.socialPosts,
      socialUrl: sp.socialUrl || base.socialUrl,
      socialLabel: sp.socialLabel || base.socialLabel,
    } : { ...sp });
  }
  for (const [id, base] of staticById.entries()) {
    if (!seen.has(id)) {
      out.push(base);
    }
  }
  return out;
}

/** Every project record (including drafts/archived — for the Admin Panel). */
export const useAllProjects = (): ProjectCase[] => buildProjects(useContent().content);

const STATUS_ORDER: Record<ContentStatus, number> = { published: 0, draft: 1, archived: 2 };

/** Published only — what the public website is allowed to display. */
export function filterPublished<T extends { status?: ContentStatus }>(items: T[]): T[] {
  return items.filter(p => (p.status ?? 'published') === 'published');
}

export const usePublishedProjects = (): ProjectCase[] => filterPublished(buildProjects(useContent().content));

/**
 * Legacy hook name kept for compatibility. Returns ALL records merged with
 * defaults (used by Admin); prefer usePublishedProjects() on the public site.
 */
export const useProjects = (): ProjectCase[] => buildProjects(useContent().content);

/** Resolves `home.selectedWorkIds` (and legacy featured flags) to project cards. */
export function resolveSelectedWork(content: SiteContent): { projects: ProjectCase[]; weddingsTile: boolean } {
  const all = buildProjects(content);
  const published = filterPublished(all);
  const ids = content.home?.selectedWorkIds?.length
    ? content.home.selectedWorkIds
    : (content.portfolio?.items || []).map(it => (it.isWedding ? '__weddings__' : it.id));

  const weddingsTile = content.home?.showWeddingsTile ?? ids.includes('__weddings__');
  const projects = ids
    .filter((id): id is string => id !== '__weddings__')
    .map(id => published.find(p => p.id === id))
    .filter((p): p is ProjectCase => !!p);
  return { projects, weddingsTile };
}

/** Featured Work for the homepage pinning scroll — max 6, order follows list. */
export function resolveFeaturedWork(content: SiteContent): ProjectCase[] {
  const published = filterPublished(buildProjects(content));
  const explicit = (content.home?.featuredProjectIds || [])
    .map(id => published.find(p => p.id === id))
    .filter((p): p is ProjectCase => !!p);
  if (explicit.length > 0) return explicit.slice(0, 6);

  // Fallback to the original beautiful 6 photo editorial collection:
  const defaultPhotoIds = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06'];
  const defaultCollection = defaultPhotoIds
    .map(id => published.find(p => p.id === id))
    .filter((p): p is ProjectCase => !!p);
  if (defaultCollection.length > 0) return defaultCollection;

  return published.filter(p => p.featured).slice(0, 6);
}

export { toGalleryItems, detectMediaKind };
export type { GalleryMedia, GalleryInput };

// Sort helper used by admin lists
export function sortByStatusThenOrder<T extends { status?: ContentStatus }>(list: T[]): T[] {
  return [...list].sort((a, b) => (STATUS_ORDER[a.status ?? 'published'] - STATUS_ORDER[b.status ?? 'published']));
}
