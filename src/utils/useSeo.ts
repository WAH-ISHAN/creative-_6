import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description?: string;
  /** Optional absolute-path image (e.g. project cover) for social cards */
  image?: string;
  /** When false, asks crawlers not to index the current view */
  index?: boolean;
}

function setMeta(attr: string, key: string, val: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', val);
}

/**
 * Registry so the global ContentProvider SEO effect knows a specific view
 * owns the current <title> (and must not overwrite it when content loads).
 */
const routeTitle = { active: false, value: '' };
(globalThis as unknown as Record<string, unknown>).__cfxRouteTitle = routeTitle;

/**
 * Per-view SEO manager. The global defaults live in ContentContext; this hook
 * layers route/project-specific values on top and restores them on unmount.
 */
export function useSeo({ title, description, image, index = true }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    document.title = title;
    routeTitle.active = true;
    routeTitle.value = title;

    const origin = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href?.replace(/\/$/, '');
    let base = '';
    try { base = origin ? new URL(origin).origin : window.location.origin; } catch { base = window.location.origin; }
    const abs = (url?: string) => (!url || /^https?:\/\//i.test(url) ? url : `${base}${url}`);

    if (description) setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    if (description) setMeta('property', 'og:description', description);
    if (image) setMeta('property', 'og:image', abs(image) || image);
    setMeta('name', 'twitter:title', title);
    if (image) setMeta('name', 'twitter:image', abs(image) || image);
    setMeta('name', 'robots', index ? 'index, follow' : 'noindex, nofollow');

    return () => {
      if (routeTitle.active && routeTitle.value === title) routeTitle.active = false;
      document.title = prevTitle;
    };
  }, [title, description, image, index]);
}
