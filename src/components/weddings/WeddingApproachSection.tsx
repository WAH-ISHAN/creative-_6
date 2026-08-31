import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export const WeddingApproachSection: React.FC = () => {
  const { content } = useContent();
  const principles = content.weddingApproach || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="wedding-approach-section"
      className="relative w-full bg-[var(--fx-black)] text-[var(--fx-white)] py-12 md:py-24 sm:py-36 px-6 sm:px-10 md:px-14 lg:px-4 md:px-16 select-none border-t border-white/10 no-parallax"
    >
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-4xl mb-16 sm:mb-24">
          <span className="text-xs sm:text-sm font-mono-tech tracking-[0.3em] font-bold text-[var(--fx-yellow)] flex items-center gap-2 mb-4">
            <span>03</span>
            <span>/ OUR PHILOSOPHY</span>
          </span>
          <h2 className="font-editorial font-bold text-2xl md:text-4xl sm:text-2xl md:text-4xl md:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white mb-6">
            NOT AS PROPS.<br />
            <span className="text-[var(--fx-yellow)]">AS WITNESSES TO YOUR DAY.</span>
          </h2>
          <p className="text-base sm:text-xl text-white/80 font-tech leading-relaxed">
            We reject the artificial theater of staged wedding production. Our cameras operate with silence, deep reverence, and the patience required for genuine history to reveal itself.
          </p>
        </div>

        {/* 3 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-8 border-t border-white/10">
          {principles.map((principle) => (
            <div
              key={principle.number}
              ref={addToCardsRef}
              className="group flex flex-col justify-between border border-white/15 p-8 sm:p-10 bg-white/5 hover:border-[var(--fx-yellow)] transition-all rounded-sm shadow-xl"
            >
              <div>
                <span className="font-mono-tech text-xs tracking-widest text-[var(--fx-yellow)] uppercase block mb-4 font-bold">
                  PRINCIPLE // {principle.number}
                </span>
                <h3 className="font-editorial font-bold text-2xl sm:text-xl md:text-3xl lg:text-2xl md:text-4xl tracking-wide uppercase text-white mb-4">
                  {principle.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70 font-tech leading-relaxed">
                  {principle.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono-tech tracking-[0.25em] text-white/40 uppercase font-semibold">
                CREATIVEFX STANDARD
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

