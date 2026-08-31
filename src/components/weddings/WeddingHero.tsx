import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '../../utils/audio';
import { useContent } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

interface WeddingHeroProps {
  onBeginStory?: () => void;
  onExploreFeaturedStory?: () => void;
  onPlayReel?: () => void;
}

export const WeddingHero: React.FC<WeddingHeroProps> = ({
  onBeginStory,
  onExploreFeaturedStory,
  onPlayReel,
}) => {
  const { content } = useContent();
  const w = content.weddings || {};
  const headlineLines = (w.heroHeadline || 'MOMENTS\nARE NOT POSED.\nTHEY ARE\nREMEMBERED.').split('\n');
  const heroImage = w.heroImage || '/img/wedding/Ravindu & Malikshi/DSC09233.webp';

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.2 });

      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0);

      if (headlineRef.current) {
        tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5 }, 0.4);
      }

      if (imageContainerRef.current) {
        tl.fromTo(imageContainerRef.current, { scale: 1.05, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 2, ease: 'power3.out' }, 0.6);
      }

      if (containerRef.current && imageContainerRef.current) {
        gsap.to(imageContainerRef.current, {
          yPercent: 10,
          scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-[100svh] flex flex-col items-center justify-center bg-[var(--fx-black)] text-[var(--fx-white)] px-6 pt-32 pb-16 overflow-hidden">
      
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10">
        
        {/* Top Meta Badge (In-flow above heading, never overlapping) */}
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
          <span className="text-[var(--fx-yellow)] font-bold">01</span>
          <span className="text-[var(--fx-white)] font-semibold">{w.heroSubtitle || 'WEDDING PHOTOGRAPHY & CINEMATOGRAPHY'}</span>
        </div>

        {/* Elegant Balanced Headline */}
        <h1 ref={headlineRef} className="text-xl md:text-3xl sm:text-xl md:text-3xl md:text-5xl md:text-6xl lg:text-7xl font-editorial tracking-tight uppercase leading-[0.98] text-center text-[var(--fx-white)] max-w-5xl">
          {headlineLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>

        {/* Cinematic Preview Box */}
        <div
          ref={imageContainerRef}
          onClick={onPlayReel || onExploreFeaturedStory}
          className="relative w-full max-w-4xl aspect-video md:aspect-[21/9] overflow-hidden bg-black border border-white/20 rounded-md group cursor-pointer shadow-2xl mt-2"
        >
          <img
            src={heroImage}
            alt="Real Sri Lankan Wedding by CreativeFX"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 pointer-events-none" />

          <div className="absolute bottom-6 left-6 text-xs font-mono-tech tracking-widest uppercase text-white flex items-center gap-2.5 bg-black/70 px-3 py-1.5 rounded-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[var(--fx-yellow)] animate-pulse" />
            <span className="font-bold">{w.heroReelLabel || 'WATCH WEDDING CINEMA REEL'}</span>
          </div>

          {w.heroCaption && (
            <div className="absolute bottom-6 right-6 hidden sm:block text-xs font-mono-tech tracking-widest text-white/80 uppercase bg-black/70 px-3 py-1.5 rounded-sm border border-white/20">
              {w.heroCaption}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pt-8 z-20 w-full flex justify-center text-xs font-mono-tech uppercase tracking-[0.2em] text-[var(--fx-gray)]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 w-full h-4 bg-[var(--fx-yellow)] animate-[pulse-subtle_2s_infinite]" />
          </div>
          <span className="text-[10px] tracking-[0.3em] font-bold text-white/70">SCROLL</span>
        </div>
      </div>

    </section>
  );
};

