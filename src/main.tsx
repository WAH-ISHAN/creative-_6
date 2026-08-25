import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScrollRestoration } from './utils/scrollManager';

gsap.registerPlugin(ScrollTrigger);
initScrollRestoration();

function Root() {
  useEffect(() => {
    initScrollRestoration();
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // On mobile: use 100% native scroll — no Lenis overhead at all
    if (isMobile) {
      document.documentElement.style.scrollBehavior = 'smooth';
      return;
    }

    // Desktop only: Lenis smooth scroll
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Expose for utils/smoothScroll so all programmatic jumps use Lenis
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(lenis.raf);
      (window as unknown as { __lenis?: unknown }).__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
