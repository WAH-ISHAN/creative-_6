import React, { useEffect, useRef, useState } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';
import { ArrowUpRight } from 'lucide-react';

// Served statically from /public/video
const HERO_VIDEO_URL = '/video/intro-hero.mp4';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const { content } = useContent();

  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgTitleRef = useRef<HTMLDivElement>(null);
  const topMetaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  // Live 24fps Cinema Timecode Counter
  const [timecode, setTimecode] = useState('00:00:00:00');

  useEffect(() => {
    let frames = 0;
    const fps = 24;
    const interval = setInterval(() => {
      frames++;
      const f = frames % fps;
      const totalSec = Math.floor(frames / fps);
      const s = totalSec % 60;
      const totalMin = Math.floor(totalSec / 60);
      const m = totalMin % 60;
      const h = Math.floor(totalMin / 60);
      const pad = (n: number) => String(n).padStart(2, '0');
      setTimecode(`${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, []);

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

      // Camera HUD reveal
      if (hudRef.current) {
        tl.fromTo(hudRef.current, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, 0.2);
      }

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

      if (topMetaRef.current) {
        tl.fromTo(topMetaRef.current, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.6);
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

      {/* ─── CINEMA CAMERA VIEWFINDER HUD FRAME ─── */}
      <div ref={hudRef} className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
        
        {/* 4 Focus Reticle Frame Corners */}
        <div className="absolute top-24 sm:top-28 left-4 sm:left-8 md:left-12 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        <div className="absolute top-24 sm:top-28 right-4 sm:right-8 md:left-auto md:right-12 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-20 sm:bottom-24 left-4 sm:left-8 md:left-12 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-20 sm:bottom-24 right-4 sm:right-8 md:left-auto md:right-12 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />

        {/* Top-Left: Camera Telemetry HUD */}
        <div className="absolute top-26 sm:top-30 left-6 sm:left-12 md:left-16 flex items-center gap-3 sm:gap-5 text-[10px] sm:text-xs font-mono-tech tracking-widest text-white/60 uppercase">
          <div>ISO <span className="text-white font-bold">800</span></div>
          <div>FPS <span className="text-white font-bold">24</span></div>
          <div>4K <span className="text-[var(--fx-yellow)] font-bold">RAW</span></div>
        </div>

        {/* Top-Center: Blinking Live REC Indicator */}
        <div className="absolute top-26 sm:top-30 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-[var(--fx-yellow)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--fx-yellow)] shadow-[0_0_8px_var(--fx-yellow)]"></span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono-tech font-bold tracking-[0.2em] text-white uppercase">REC</span>
        </div>

        {/* Top-Right: Live Timecode Counter */}
        <div className="absolute top-26 sm:top-30 right-6 sm:right-12 md:right-16 font-mono-tech text-[10px] sm:text-xs tracking-widest text-white/80">
          {timecode}
        </div>

        {/* Center Cinema Camera Wireframe Blueprint (Subtle focal illustration) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[800px] opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <rect x="180" y="120" width="420" height="220" rx="14" fill="none" stroke="white" strokeWidth="2.5" />
            <rect x="280" y="100" width="220" height="22" rx="4" fill="none" stroke="white" strokeWidth="1.8" />
            <ellipse cx="180" cy="230" rx="90" ry="90" fill="none" stroke="white" strokeWidth="2.2" />
            <ellipse cx="180" cy="230" rx="70" ry="70" fill="none" stroke="white" strokeWidth="1.2" />
            <ellipse cx="180" cy="230" rx="48" ry="48" fill="none" stroke="white" strokeWidth="1" />
            <ellipse cx="180" cy="230" rx="28" ry="28" fill="none" stroke="white" strokeWidth="0.8" />
            <rect x="90" y="150" width="90" height="160" rx="6" fill="none" stroke="white" strokeWidth="1.5" />
            <line x1="600" y1="140" x2="600" y2="320" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="560" y1="140" x2="560" y2="320" stroke="white" strokeWidth="0.8" opacity="0.3" />
            <rect x="350" y="56" width="130" height="46" rx="8" fill="none" stroke="white" strokeWidth="1.8" />
            <rect x="390" y="100" width="50" height="22" rx="2" fill="none" stroke="white" strokeWidth="1.2" />
            <rect x="600" y="148" width="80" height="54" rx="6" fill="none" stroke="white" strokeWidth="1.8" />
            <rect x="680" y="160" width="28" height="30" rx="4" fill="none" stroke="white" strokeWidth="1.4" />
            <rect x="608" y="224" width="72" height="80" rx="4" fill="none" stroke="white" strokeWidth="1.2" />
            <circle cx="630" cy="140" r="10" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="630" cy="140" r="5" fill="white" opacity="0.4" />
            <rect x="220" y="150" width="160" height="100" rx="5" fill="none" stroke="white" strokeWidth="1.2" />
            <circle cx="300" cy="200" r="4" fill="none" stroke="var(--fx-yellow)" strokeWidth="1" opacity="0.8" />
            <rect x="195" y="338" width="390" height="16" rx="3" fill="none" stroke="white" strokeWidth="1.2" />
            <circle cx="440" cy="120" r="22" fill="none" stroke="white" strokeWidth="1.4" />
          </svg>
        </div>
      </div>

      {/* ─── FOREGROUND: HERO HEADLINE & NARRATIVE ─── */}
      <div ref={bgTitleRef} className="relative z-20 pointer-events-none flex flex-col items-center justify-center px-6 text-center">
        <div ref={subTextRef} className="flex flex-col items-center gap-5 md:gap-7 max-w-4xl mx-auto drop-shadow-2xl">
          <h1
            ref={mainTitleRef}
            className="will-change-transform font-editorial uppercase tracking-tight font-normal select-none leading-[0.88] text-white"
            style={{ fontSize: 'clamp(4.2rem, 12.5vw, 11.5rem)' }}
          >
            BEYOND<br />
            <span className="text-[var(--fx-yellow)]">CREATIVITY</span>
          </h1>
          
          <p className="font-tech text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-normal max-w-3xl drop-shadow-md">
            {content.hero?.description || 'CreativeFX is a creative agency specializing in photography, videography, content creation, and digital marketing solutions for modern brands.'}
          </p>

          {/* Hero Action: Watch 4K Cinema Reel on Facebook */}
          <div className="pointer-events-auto mt-2">
            <a
              href={content.hero?.socialUrl || "https://www.facebook.com/share/r/1Br1SqsowT/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#1877F2]/90 hover:bg-[#1877F2] text-white rounded-full text-xs font-mono-tech tracking-widest uppercase transition-all duration-300 shadow-[0_0_24px_rgba(24,119,242,0.4)] hover:shadow-[0_0_36px_rgba(24,119,242,0.7)] font-bold cursor-pointer backdrop-blur-md border border-white/20 hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>{content.hero?.socialLabel || 'WATCH 4K HERO REEL'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
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
