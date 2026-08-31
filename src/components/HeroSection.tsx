import React, { useEffect, useRef, useState } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, useSectionStyle } from '../context/ContentContext';

// Served statically from /public/video or fallback
const HERO_VIDEO_URL = '/video/intro-hero.webm';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
        gsap.to(bgTitleRef.current, { yPercent: -10, scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [sec.animationsEnabled]);

  const scrollToNextSection = () => {
    const nextSec = document.getElementById('section-introduction') || document.getElementById('section-featured-work') || document.getElementById('section-introduction');
    if (nextSec) {
      smoothScrollTo(nextSec);
    }
  };

  const heroHeadingBase = 2.8 * sec.headingScale;
  const heroHeadingVw = 11 * sec.headingScale;
  const heroHeadingMax = 7.5 * sec.headingScale;

  return (
    <section 
      ref={heroRef} 
      id="hero" 
      style={sec.style}
      className="relative w-full h-[100svh] min-h-[560px] sm:min-h-[640px] flex items-center justify-center overflow-hidden select-none bg-[var(--fx-black)] text-white"
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
          poster="/img/studio-workflow.webp"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] transition-opacity duration-1000"
        />
        {/* Dark Vignette & Gradient Overlays for Cinematic Contrast - stronger on mobile for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/60 sm:via-black/40 sm:to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.92)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 sm:bg-transparent pointer-events-none" />
      </div>

      {/* ─── FOREGROUND: HERO HEADLINE & NARRATIVE ─── */}
      <div ref={bgTitleRef} className="relative z-20 pointer-events-none flex flex-col items-center justify-center px-4 sm:px-6 text-center w-full max-w-[92%] sm:max-w-3xl mx-auto">
        <div ref={subTextRef} className="flex flex-col items-center w-full drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
          <h1
            ref={mainTitleRef}
            className="will-change-transform font-editorial uppercase tracking-tight font-normal select-none leading-[0.9] text-white text-center"
            style={{ fontSize: `clamp(${heroHeadingBase}rem, ${heroHeadingVw}vw, ${heroHeadingMax}rem)` }}
          >
            {content.hero?.title && content.hero.title.includes('\n') ? (
              <>
                {content.hero.title.split('\n')[0]}<br />
                <span style={{ color: sec.accent || '#fcbf13' }}>
                  {content.hero.title.split('\n')[1]}
                </span>
              </>
            ) : (
              <>
                BEYOND<br />
                <span style={{ color: sec.accent || '#fcbf13' }}>
                  CREATIVITY
                </span>
              </>
            )}
          </h1>
          
          <p 
            className="font-mono-tech text-white/85 leading-[1.6] font-normal max-w-[320px] sm:max-w-lg mx-auto drop-shadow-md text-center mt-4 sm:mt-6 uppercase tracking-[0.14em] sm:tracking-[0.2em] px-2 sm:px-0"
            style={{ fontSize: `clamp(${10 * sec.bodyScale}px, ${2.6 * sec.bodyScale}vw, ${11 * sec.bodyScale}px)` }}
          >
            <span className="sm:hidden">CREATIVEFX IS A CREATIVE AGENCY SPECIALIZING IN PHOTOGRAPHY, VIDEOGRAPHY & DIGITAL MARKETING FOR MODERN BRANDS.</span>
            <span className="hidden sm:inline">CREATIVEFX IS A CREATIVE AGENCY SPECIALIZING IN PHOTOGRAPHY,<br />VIDEOGRAPHY, CONTENT CREATION, AND DIGITAL MARKETING SOLUTIONS<br />FOR MODERN BRANDS.</span>
          </p>

          {/* Mobile CTA */}
          <div className="sm:hidden mt-7 flex flex-col gap-3 w-full max-w-[280px] pointer-events-auto">
            <button
              onClick={scrollToNextSection}
              className="w-full bg-[var(--fx-yellow)] text-black font-mono-tech text-xs tracking-[0.2em] font-bold uppercase py-4 rounded-sm active:scale-[0.98] transition-transform"
            >
              EXPLORE WORK
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator - hidden on mobile, replaced by button */}
      <div className="absolute bottom-6 sm:bottom-8 z-30 w-full hidden sm:flex items-center justify-center text-[10px] font-mono-tech uppercase tracking-[0.22em] text-white/60">
        <div ref={scrollIndicatorRef} className="flex items-center gap-3">
          <button id="hero-scroll-btn" type="button" onClick={scrollToNextSection} className="group flex flex-col items-center gap-2 text-white hover:opacity-85 transition-opacity cursor-pointer font-bold drop-shadow-md pointer-events-auto min-h-[64px] min-w-[64px] justify-center">
            <div className="relative w-px h-10 sm:h-12 bg-white/20 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-white animate-[pulse-subtle_2s_infinite]" />
            </div>
            <span className="text-[9px] tracking-[0.3em]">SCROLL</span>
          </button>
        </div>
      </div>

      {/* Mobile swipe hint */}
      <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 opacity-70 pointer-events-none">
        <div className="w-6 h-10 rounded-full border border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full animate-[float-indicator_1.6s_ease-in-out_infinite]" />
        </div>
      </div>

    </section>
  );
};
