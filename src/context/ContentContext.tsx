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
    image: '/img/studio-workflow.webp',
  },
  // Master services list — rendered by ServicesSection & ServiceDetailModal
  services: [
    {
      id: 'photo-video', code: 'SRV-01', number: '01', title: 'PHOTOGRAPHY & VIDEOGRAPHY',
      shortDesc: 'We capture high quality photos and videos for brands, products, events, and promotional purposes, ensuring visually compelling and professional content.',
      fullDesc: 'From medium-format studio photography and architectural lookbooks to cinematic 8K anamorphic video, we engineer moving and still imagery with uncompromising clarity and emotional resonance.',
      capabilities: ['Event & Lifestyle Photography', 'Product & Brand Photography', 'Promotional & Commercial Videography', 'Social Media Video Content', 'Cinematic & Creative Shoots'],
      deliverables: [],
      highlight: '8K RAW & Medium-Format Still Capture',
      previewImage: '/img/poster/Sprite Shoot- Final.webp',
      status: 'published' as ContentStatus,
    },
    {
      id: 'video-editing-motion', code: 'SRV-02', number: '02', title: 'VIDEO EDITING & MOTION GRAPHICS',
      shortDesc: 'We create engaging video content with smooth editing, visual effects, and motion graphics to enhance storytelling and marketing impact.',
      fullDesc: 'Merging surgical timeline pacing, kinetic typography, 3D product simulation, and holographic UI design to transform raw frames into visceral cinematic stories that retain audience attention.',
      capabilities: ['Reels & Short-Form Video Editing', 'Promotional & Commercial Video Editing', 'Motion Graphics & Animations', 'Visual Effects & Transitions', 'Color Grading & Sound Design'],
      deliverables: [],
      highlight: 'Surgical Rhythm & 3D Procedural Motion',
      previewImage: '/img/poster/finalWasthi.webp',
      status: 'published' as ContentStatus,
    },
    {
      id: 'social-media', code: 'SRV-03', number: '03', title: 'SOCIAL MEDIA CONTENT DESIGN',
      shortDesc: 'Creation of engaging social media graphics and promotional content that increases brand visibility and audience engagement across digital platforms.',
      fullDesc: 'Hook-first visual architectures engineered specifically for TikTok, Instagram Reels, YouTube Shorts, and X. We craft culturally resonant daily asset engines that stop the scroll.',
      capabilities: ['Social Media Post Designs', 'Instagram & Facebook Content', 'Promotional & Campaign Creatives', 'Stories, Reels & Highlight Covers', 'Content Templates & Branded Graphics'],
      deliverables: [],
      highlight: 'Hook-First Retention & Viral Strategy',
      previewImage: '/img/poster/RentMasterFinal.webp',
      status: 'published' as ContentStatus,
    },
    {
      id: 'branding-design', code: 'SRV-04', number: '04', title: 'BRANDING & DESIGN',
      shortDesc: 'We develop strong brand identities through logo design, visual branding, and creative graphic designs that represent your business effectively.',
      fullDesc: 'We build cohesive visual universes with distinctive geometric logotypes, custom typography systems, meticulous grid guidelines, and tactile packaging that elevate brand equity.',
      capabilities: ['Logo Design & Brand Identity', 'Business Cards & Stationery', 'Brand Guidelines & Visual Systems', 'Marketing & Promotional Materials', 'Custom Graphic & Creative Designs'],
      deliverables: [],
      highlight: 'Distinctive Geometric Aesthetics',
      previewImage: '/img/Birthdays/Thathsarani/1st copy.webp',
      status: 'published' as ContentStatus,
    },
    {
      id: 'digital-marketing', code: 'SRV-05', number: '05', title: 'DIGITAL MARKETING',
      shortDesc: 'We provide creative digital marketing solutions, including social media content and campaigns, to help brands reach and engage their target audience.',
      fullDesc: 'Creative that doesn’t just look striking—it drives measurable audience expansion and conversion. We unite high-impact creative bets with full-funnel strategic distribution.',
      capabilities: ['Social Media Management', 'Content Planning & Strategy', 'Social Media Campaigns', 'Audience Engagement & Growth', 'Digital Advertising & Promotions'],
      deliverables: [],
      highlight: 'Creative-Led Measurable Growth',
      previewImage: '/img/Events/Gender Reveal/DSC09470.webp',
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
  googleReviewsConfig: {
    enabled: true,
    placeUrl: 'https://www.google.com/search?q=creativefx+pvt+ltd+kaduwela+reviews#lrd=0xbfe9d365346670d:0x60fdaf92bd3171c7,1',
    writeReviewUrl: 'https://www.google.com/search?q=creativefx+pvt+ltd+kaduwela+reviews#lrd=0xbfe9d365346670d:0x60fdaf92bd3171c7,3',
    rating: 5.0,
    totalReviews: 13,
    badgeLabel: 'Google Verified 5.0 ★ Rating',
    autoSync: true,
    lastSyncedAt: 'Live Synced',
  },
  testimonials: [
    {
      id: 'google-udari-dayarathne',
      quote: 'CreativeFX is highly recommended! They did my graduation shoot and photos are high quality with professional editing. Photos feel cinematic and natural at the same time. They were very supportive at the shoot and guided for beautiful poses too. I am really grateful for the beautiful photos of my special moment. Thank You CreativeFX.',
      author: 'Udari Dayarathne',
      role: 'Graduation Photography Session',
      avatar: '/img/Graduation/Samudi/DSC00131.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/108347296014426068491/reviews?hl=en-GB',
    },
    {
      id: 'google-shachini-kaushalya',
      quote: 'Excellent service from CreativeFx Pvt Ltd! The team was very professional and delivered high-quality video production for our company. Highly recommended.',
      author: 'Shachini Kaushalya',
      role: 'Corporate Video Production',
      avatar: '/img/poster/finalWasthi.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/112879681914980382172/reviews?hl=en-GB',
    },
    {
      id: 'google-dush-chathu',
      quote: 'The team at CreativeFx is very talented and easy to work with. Their video editing and production quality are top level.',
      author: 'Dush Chathu',
      role: 'Video Editing & Production',
      avatar: '/img/poster/RentMasterFinal.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/116599179468633781362/reviews?hl=en-GB',
    },
    {
      id: 'google-tharindu-dhananjaya',
      quote: 'CreativeFx Pvt Ltd provided outstanding service for our video project. The quality of the production and editing was excellent.',
      author: 'Tharindu Dhananjaya',
      role: 'Video Production Project',
      avatar: '/img/poster/Sprite Shoot- Final.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/103841337988468432269/reviews?hl=en-GB',
    },
    {
      id: 'google-pasindu-sandakalum',
      quote: 'CreativeFx is a great choice for corporate video production. The team understands branding very well.',
      author: 'Pasindu Sandakalum',
      role: 'Corporate Video Production',
      avatar: '/img/Products/Gems/DSC01031.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/101554194251946159598/reviews?hl=en-GB',
    },
    {
      id: 'google-ashi-dissanayake',
      quote: 'Amazing experience 🥰 CreativeFx delivered a high quality video that impressed our entire team.',
      author: 'Ashi Dissanayake',
      role: 'Video Production Client',
      avatar: '/img/Products/Zova Clothing/DSC06306.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/108801656409352386211/reviews?hl=en-GB',
    },
    {
      id: 'google-jamintha-chamika',
      quote: 'Very professional and creative team. The final video looked cinematic and high quality.',
      author: 'Jamintha Chamika',
      role: 'Cinematic Video Production',
      avatar: '/img/poster/finalWasthi.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/102471385214950888468/reviews?hl=en-GB',
    },
    {
      id: 'google-tharindu-nilanga',
      quote: 'CreativeFx is a great choice for corporate video production. The team understands branding very well.',
      author: 'Tharindu Nilanga',
      role: 'Corporate Branding & Video',
      avatar: '/img/poster/Sprite Shoot- Final.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/117660627490060122974/reviews?hl=en-GB',
    },
    {
      id: 'google-pasindu-manokantha',
      quote: 'Highly recommended for YouTube video production and content creation.',
      author: 'Pasindu Manokantha',
      role: 'YouTube & Content Production',
      avatar: '/img/poster/RentMasterFinal.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/106047299277837512233/reviews?hl=en-GB',
    },
    {
      id: 'google-hansika-gunapala',
      quote: 'Perfect place for professional photography and video production.',
      author: 'Hansika Gunapala',
      role: 'Photography & Video Client',
      avatar: '/img/Products/Gems/DSC01031.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/110209232047293000487/reviews?hl=en-GB',
    },
    {
      id: 'google-dinuka-rathnayake',
      quote: 'I had my graduation shoot done by Tharindya, and honestly, I don\'t think I need to say much more — he absolutely nailed it. 🔥 The photos turned out way beyond what I had imagined. Every shot had a different creative angle and the editing was absolutely fire.',
      author: 'Dinuka Rathnayake',
      role: 'Graduation Photoshoot',
      avatar: '/img/Graduation/Samudi/DSC00131.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '17 hours ago — New',
      googleReviewUrl: 'https://www.google.com/maps/contrib/110154463813013423341/reviews?hl=en-GB',
    },
    {
      id: 'google-kaveen-chamoda',
      quote: 'We had our graduation photoshoot with Tharindu from CreativeFx, and the entire experience was fantastic. He was professional, friendly, and made us feel comfortable throughout the shoot, which really shows in the final photos.',
      author: 'Kaveen Chamoda',
      role: 'Graduation Photoshoot',
      avatar: '/img/Graduation/Samudi/DSC00131.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '3 weeks ago — New',
      googleReviewUrl: 'https://www.google.com/maps/contrib/107780363515955447339/reviews?hl=en-GB',
    },
    {
      id: 'google-kaveda-gayathri',
      quote: 'Outstanding creative vision and flawless execution. CreativeFX truly captures the essence of every moment with cinematic precision and artistic excellence.',
      author: 'Kaveda Gayathri',
      role: 'Client',
      avatar: '/img/Products/Zova Clothing/DSC06306.webp',
      rating: 5,
      verified: true,
      source: 'google' as const,
      timeAgo: '5 months ago',
      googleReviewUrl: 'https://www.google.com/maps/contrib/115851828606213246409/reviews?hl=en-GB',
    },
  ],
  weddings: {
    heroHeadline: 'MOMENTS\nARE NOT POSED.\nTHEY ARE\nREMEMBERED.',
    heroSubtitle: '/ Weddings by CreativeFX',
    heroDescription: 'We document the most meaningful day of your life with artistry, emotion, and cinematic precision.',
    heroImage: '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
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
    ogImage: '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
    analyticsId: '',
    searchConsoleId: '',
    allowIndexing: true,
  },
  // ─── Theme / branding (admin → Theme section) ──────────────────────────────
  theme: {
    accentColor: '#fcbf13',
    backgroundColor: '#050505',
    textColor: '#ffffff',
    textMutedColor: '#888888',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    logoUrl: '/img/creativefx-bgr-logo.webp',
    fontDisplay: 'Forum',
    fontBody: 'JetBrains Mono',
    fontMono: 'JetBrains Mono',
    customGoogleFontUrl: '',
  },
  // ─── Section-by-section Design & Animation overrides ───────────────────────
  sectionStyles: {
    hero: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    intro: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    featuredWork: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    portfolio: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    services: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    about: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    contact: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    cta: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    footer: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
    weddings: { bg: '', text: '', accent: '', headingScale: 1, bodyScale: 1, animationsEnabled: true, font: '' },
  } as Record<string, { bg?: string; text?: string; accent?: string; border?: string; headingScale?: number; bodyScale?: number; animationsEnabled?: boolean; font?: string }>,
  // ─── Custom CSS code injector ──────────────────────────────────────────────
  customCss: '',
  // ─── Navigation labels and options (admin → Website → Navigation) ───────────
  nav: {
    work: 'PORTFOLIO',
    services: 'SERVICES',
    weddings: 'WEDDINGS',
    about: 'ABOUT',
    cta: 'INQUIRE',
    ctaUrl: '#section-contact',
    showWork: true,
    showServices: true,
    showWeddings: true,
    showAbout: true,
    showCta: true,
    transparentOnTop: true,
    glassBlur: true,
    customLinks: [] as { id: string; label: string; url: string; active: boolean; isExternal?: boolean }[],
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
    animationsMasterEnabled: true,
    announcementEnabled: false,
    announcementText: 'NOW BOOKING COMMERCIALS & WEDDING DATES FOR 2026 / 2027',
    announcementUrl: '',
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

  // FORCE hardcoded services to avoid stale Render API overrides
  merged.services = DEFAULT_CONTENT.services;
    
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

const LOCAL_STORAGE_KEY = 'cfx_site_content_v3';
const LOCAL_STORAGE_TS_KEY = 'cfx_site_content_v3_ts';

function getInitialContent(): SiteContent {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return migrateContent(parsed);
        }
      }
    } catch (e) {
      console.warn('[ContentContext] Failed to load from localStorage', e);
    }
  }
  return DEFAULT_CONTENT;
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(getInitialContent);
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

    // Brand theme & colors → dynamic CSS variables
    const theme = { ...DEFAULT_CONTENT.theme, ...(content.theme || {}) };
    const root = document.documentElement;

    if (theme.accentColor && /^#[0-9a-fA-F]{3,8}$/.test(theme.accentColor)) {
      root.style.setProperty('--fx-yellow', theme.accentColor);
      root.style.setProperty('--fx-accent', theme.accentColor);
    }
    if (theme.backgroundColor && /^#[0-9a-fA-F]{3,8}$/.test(theme.backgroundColor)) {
      root.style.setProperty('--fx-black', theme.backgroundColor);
    }
    if (theme.textColor && /^#[0-9a-fA-F]{3,8}$/.test(theme.textColor)) {
      root.style.setProperty('--fx-white', theme.textColor);
    }
    if (theme.textMutedColor && /^#[0-9a-fA-F]{3,8}$/.test(theme.textMutedColor)) {
      root.style.setProperty('--fx-gray', theme.textMutedColor);
    }
    if (theme.borderColor) {
      root.style.setProperty('--fx-border-dark', theme.borderColor);
    }

    // Font families. Sanitize the font-family name so a value can't break out of
    // the CSS variable declaration (M-2) — keep letters, numbers, spaces, hyphens.
    const cleanFontName = (name: string) => String(name).replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 64);
    if (theme.fontDisplay) {
      root.style.setProperty('--fx-font-display', `'${cleanFontName(theme.fontDisplay)}', 'Forum', 'Cinzel', serif`);
    } else {
      root.style.setProperty('--fx-font-display', `'Forum', 'Cinzel', serif`);
    }
    if (theme.fontBody) {
      root.style.setProperty('--fx-font-body', `'${cleanFontName(theme.fontBody)}', 'JetBrains Mono', monospace`);
    } else {
      root.style.setProperty('--fx-font-body', `'JetBrains Mono', monospace`);
    }
    if (theme.fontMono) {
      root.style.setProperty('--fx-font-mono', `'${cleanFontName(theme.fontMono)}', 'JetBrains Mono', monospace`);
    }

    // Dynamic Google Fonts loader — restricted to the official Google Fonts host
    // so this can't be pointed at an arbitrary external stylesheet (M-2).
    const isTrustedFontUrl = (url: string) => {
      try {
        const u = new URL(url);
        return u.protocol === 'https:' && (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com');
      } catch { return false; }
    };
    if (theme.customGoogleFontUrl && isTrustedFontUrl(theme.customGoogleFontUrl)) {
      let fontLink = document.getElementById('cfx-custom-google-fonts') as HTMLLinkElement | null;
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'cfx-custom-google-fonts';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      fontLink.href = theme.customGoogleFontUrl;
    }

    // Custom CSS code injector
    let customStyle = document.getElementById('cfx-custom-user-styles') as HTMLStyleElement | null;
    if (!customStyle) {
      customStyle = document.createElement('style');
      customStyle.id = 'cfx-custom-user-styles';
      document.head.appendChild(customStyle);
    }
    customStyle.textContent = content.customCss || '';
  }, [content]);

  // Load content from server on mount with smart timestamp sync (Local edits never lost)
  useEffect(() => {
    fetch(`${API_BASE}/api/content`)
      .then(r => r.json())
      .then(serverData => {
        if (!serverData || typeof serverData !== 'object' || Object.keys(serverData).length === 0) {
          setIsLoading(false);
          return;
        }

        const localTs = parseInt(localStorage.getItem(LOCAL_STORAGE_TS_KEY) || '0', 10);
        const serverTs = (serverData as { _updatedAt?: number })._updatedAt || 0;

        // If local edits are newer than server, keep local and sync to server!
        if (localTs > serverTs) {
          console.log('[ContentContext] Local edits are newer than server. Syncing local to server.');
          const currentLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (currentLocal) {
            try {
              const doc = JSON.parse(currentLocal);
              fetch(`${API_BASE}/api/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('cfx_admin_token') || '' },
                body: JSON.stringify(doc),
              }).catch(() => {});
            } catch {}
          }
          setIsLoading(false);
          return;
        }

        // Server is newer or equal — migrate and update local cache
        const migrated = migrateContent(serverData);
        setContent(migrated);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(migrated));
          if (serverTs) localStorage.setItem(LOCAL_STORAGE_TS_KEY, serverTs.toString());
        } catch {}
        setIsLoading(false);
      })
      .catch(() => {
        // Server offline or not reachable — local state already has localStorage content!
        console.warn('[ContentContext] Server not reachable, using local cached content.');
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
      const res = await fetch(`${API_BASE}/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('cfx_admin_token') || '' },
        body: JSON.stringify(doc),
      });
      // Session expired or revoked mid-edit: local edits are safe in localStorage,
      // so drop the dead token and send the admin back to the login screen.
      if (res.status === 401 && sessionStorage.getItem('cfx_admin_token')) {
        sessionStorage.removeItem('cfx_admin_token');
        if (new URLSearchParams(window.location.search).get('admin') === '1') {
          window.location.reload();
        }
        return;
      }
      if (res.ok) setLastSaved(new Date());
    } catch (e) {
      console.error('[ContentContext] Save failed', e);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Update a field by path, persist immediately to localStorage + debounced to server
  const updateContent = useCallback(async (path: string[], value: unknown) => {
    setContent(prev => {
      const next = setNestedValue(prev, path, value) as SiteContent;
      const now = Date.now();
      (next as unknown as { _updatedAt?: number })._updatedAt = now;

      // 1. Instant client-side persistence (Never lost on reload/spin-down)
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        localStorage.setItem(LOCAL_STORAGE_TS_KEY, now.toString());
      } catch (e) {
        console.warn('[ContentContext] localStorage write failed', e);
      }

      // 2. Debounced server persistence
      pendingDoc.current = next;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => { void flushSave(); }, 600);
      return next;
    });
  }, [flushSave]);

  const resetContent = useCallback(async () => {
    setContent(DEFAULT_CONTENT);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_TS_KEY);
    } catch {}
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

/**
 * Returns dynamic styles, fonts, and animation state for any section
 */
export function useSectionStyle(sectionKey: string) {
  const { content } = useContent();
  const styles = content.sectionStyles?.[sectionKey] || {};
  const masterAnim = content.settings?.animationsMasterEnabled ?? true;

  const inlineStyle: React.CSSProperties = {};
  if (styles.bg) inlineStyle.backgroundColor = styles.bg;
  if (styles.text) inlineStyle.color = styles.text;
  if (styles.font) inlineStyle.fontFamily = `'${styles.font}', sans-serif`;

  return {
    style: inlineStyle,
    bg: styles.bg || undefined,
    text: styles.text || undefined,
    accent: styles.accent || content.theme?.accentColor || '#fcbf13',
    headingScale: styles.headingScale ?? 1,
    bodyScale: styles.bodyScale ?? 1,
    animationsEnabled: masterAnim && (styles.animationsEnabled ?? true),
    font: styles.font || undefined,
  };
}

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
