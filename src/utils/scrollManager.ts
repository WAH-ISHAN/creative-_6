import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface LenisInstance {
  scrollTo: (
    target: HTMLElement | number | string,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      force?: boolean;
      lock?: boolean;
    }
  ) => void;
  stop: () => void;
  start: () => void;
  raf: (time: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    __lenis?: LenisInstance;
  }
}

/**
 * Configure browser history to prevent automatic scroll restoration
 * that clashes with client-side SPA routing.
 */
export function initScrollRestoration(): void {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
}

/**
 * Authoritative global scroll reset.
 * Immediately resets window, documentElement, body, and Lenis virtual scroll
 * to absolute top (0, 0) without smooth delay or inherited offset.
 */
export function resetGlobalScroll(): void {
  if (typeof window === 'undefined') return;

  // 1. Reset Lenis virtual scroll state
  const lenis = window.__lenis;
  if (lenis) {
    try {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true, force: true, lock: true });
      lenis.start();
    } catch (_) {}
  }

  // 2. Instant native window & document scroll reset
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  } catch (_) {
    window.scrollTo(0, 0);
  }

  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;

  // 3. Double-check on next Animation Frame (catches layout reflows during React route swap)
  requestAnimationFrame(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    } catch (_) {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    if (lenis) {
      try {
        lenis.scrollTo(0, { immediate: true, force: true });
      } catch (_) {}
    }

    // 4. Refresh ScrollTrigger cleanly once new route layout has mounted
    try {
      ScrollTrigger.refresh();
    } catch (_) {}
  });
}

/**
 * Programmatic smooth scroll to an element or position within the current page.
 */
export function smoothScrollTo(target: HTMLElement | number | null | undefined, offset = -84): void {
  if (target === null || target === undefined || typeof window === 'undefined') return;

  const lenis = window.__lenis;

  if (lenis && !(typeof target !== 'number' && !target.isConnected)) {
    lenis.scrollTo(target, typeof target === 'number' ? { duration: 1.1 } : { offset, duration: 1.1 });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
