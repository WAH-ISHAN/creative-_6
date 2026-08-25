import React, { useEffect, useRef } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, useSectionStyle } from '../context/ContentContext';

// Served statically from /public/video or fallback
const HERO_VIDEO_URL = '/video/intro-hero.mp4';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const { content } = useContent();
  const sec = useSectionStyle('hero');

  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgTitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);

  // Ensure video plays smoothly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!sec.animationsEnabled) {
      if (heroRef.current) heroRef.current.style.opacity = '1';
      if (mainTitleRef.current) { mainTitleRef.current.style.opacity = '1'; mainTitleRef.current.style.filter = 'none'; }
      if (subTextRef.current) subTextRef.current.style.opacity = '1';
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });

      tl.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0);

      // Dramatic text reveal for BEYOND CREATIVITY
      if (mainTitleRef.current) {
        tl.fromTo(mainTitleRef.current, 
          { scale: 1.05, opacity: 0, filter: 'blur(8px)' }, 
          { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out' }, 
          0.1
        );
      }

      // Subtext fade in
      if (subTextRef.current) {
        tl.fromTo(subTextRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.45);
      }
      
      if (scrollIndicatorRef.current) {
        tl.fromTo(scrollIndicatorRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.7);
      }

      if (heroRef.current && bgTitleRef.current) {
        gsap.to(bgTitleRef.current, { yPercent: -12, scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [sec.animationsEnabled]);

  const scrollToNextSection = () => {
    const nextSec = document.getElementById('section-intro') || document.getElementById('section-featured-work');
    if (nextSec) {
      smoothScrollTo(nextSec);
    }
  };

  const heroHeadingBase = 3.5 * sec.headingScale;
  const heroHeadingVw = 8.5 * sec.headingScale;
  const heroHeadingMax = 7.5 * sec.headingScale;

  return (
    <section 
      ref={heroRef} 
      id="hero" 
      style={sec.style}
      className="relative w-full h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden select-none bg-[var(--fx-black)] text-[var(--fx-white)]"
    >
      
      {/* ─── FULL HIGH-DEFINITION BACKGROUND HERO VIDEO ─── */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={HERO_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.08] transition-opacity duration-1000"
        />
        {/* Dark Vignette & Gradient Overlays for Cinematic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
      </div>

      {/* ─── FOREGROUND: HERO HEADLINE & NARRATIVE ─── */}
      <div ref={bgTitleRef} className="relative z-20 pointer-events-none flex flex-col items-center justify-center px-6 text-center">
        <div ref={subTextRef} className="flex flex-col items-center max-w-2xl mx-auto drop-shadow-2xl">
          <h1
            ref={mainTitleRef}
            className="will-change-transform font-editorial uppercase tracking-tight font-normal select-none leading-[0.92] text-white text-center"
            style={{ fontSize: `clamp(${heroHeadingBase}rem, ${heroHeadingVw}vw, ${heroHeadingMax}rem)` }}
          >
            {content.hero?.title?.split('\n')[0] || 'BEYOND'}<br />
            <span style={{ color: sec.accent || '#fcbf13' }}>
              {content.hero?.title?.split('\n')[1] || 'CREATIVITY'}
            </span>
          </h1>
          
          <p 
            className="font-tech text-white/90 leading-relaxed font-normal max-w-xl mx-auto drop-shadow-md text-center mt-6 sm:mt-8"
            style={{ fontSize: `clamp(${13 * sec.bodyScale}px, ${1.05 * sec.bodyScale}vw, ${16 * sec.bodyScale}px)` }}
          >
            {content.hero?.description || 'CreativeFX is a creative agency specializing in photography, videography, content creation, and digital marketing solutions for modern brands.'}
          </p>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-8 z-30 w-full flex items-center justify-center text-[10px] font-mono-tech uppercase tracking-[0.22em] text-[var(--fx-gray)]">
        <div ref={scrollIndicatorRef} className="flex items-center gap-3">
          <button id="hero-scroll-btn" type="button" onClick={scrollToNextSection} className="group flex flex-col items-center gap-2 text-[var(--fx-white)] hover:opacity-85 transition-opacity cursor-pointer font-bold drop-shadow-md pointer-events-auto">
            <div className="relative w-px h-12 bg-white/20 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-white animate-[pulse-subtle_2s_infinite]" />
            </div>
            <span className="text-[9px] tracking-[0.3em]">SCROLL</span>
          </button>
        </div>
      </div>

    </section>
  );
};
