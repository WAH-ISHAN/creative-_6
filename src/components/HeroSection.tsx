import React, { useEffect, useRef } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';

// Served statically from /public/video
const HERO_VIDEO_URL = '/video/intro-hero.mp4';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const { content } = useContent();

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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });

      tl.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0);

      // Dramatic text reveal for BEYOND CREATIVITY
      if (mainTitleRef.current) {
        tl.fromTo(mainTitleRef.current, 
          { scale: 1.08, opacity: 0, filter: 'blur(10px)', letterSpacing: '0.1em' }, 
          { scale: 1, opacity: 1, filter: 'blur(0px)', letterSpacing: 'normal', duration: 1.8, ease: 'power3.out' }, 
          0.1
        );
      }

      // Subtext fade in
      if (subTextRef.current) {
        tl.fromTo(subTextRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, 0.5);
      }
      
      if (scrollIndicatorRef.current) {
        tl.fromTo(scrollIndicatorRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.8);
      }

      if (heroRef.current && bgTitleRef.current) {
        gsap.to(bgTitleRef.current, { yPercent: -12, scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToNextSection = () => {
    const target = document.getElementById('section-introduction');
    if (target) {
      smoothScrollTo(target);
    }
  };

  return (
    <section ref={heroRef} id="hero" className="no-parallax relative w-full min-h-[100svh] h-[100svh] max-h-[1200px] flex flex-col justify-center items-center overflow-hidden select-none bg-black text-[var(--fx-white)] pt-24 pb-8 sm:pb-10 px-6 sm:px-10 md:px-14 lg:px-16">
      
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
        {/* Dark Vignette & Gradient Overlays for Razor Sharp Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
      </div>

      {/* ─── FOREGROUND: HERO HEADLINE & NARRATIVE (SCALED TO ~75%) ─── */}
      <div ref={bgTitleRef} className="relative z-20 pointer-events-none flex flex-col items-center justify-center px-6 text-center">
        <div ref={subTextRef} className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 max-w-3xl mx-auto drop-shadow-2xl">
          <h1
            ref={mainTitleRef}
            className="will-change-transform font-editorial uppercase tracking-tight font-normal select-none leading-[0.9] text-white"
            style={{ fontSize: 'clamp(3.15rem, 9.4vw, 8.6rem)' }}
          >
            BEYOND<br />
            <span className="text-[var(--fx-yellow)]">CREATIVITY</span>
          </h1>
          
          <p className="font-tech text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-md">
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
