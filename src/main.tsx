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

    // Universal Lenis smooth scroll with touch support
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      syncTouch: false, // Native touch scrolling on mobile for optimal performance and zooming
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Expose for utils/smoothScroll so all programmatic jumps use Lenis
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(updateTicker);
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
