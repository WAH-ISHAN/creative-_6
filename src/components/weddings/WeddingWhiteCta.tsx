import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface WeddingWhiteCtaProps {
  onInquire: () => void;
}

export const WeddingWhiteCta: React.FC<WeddingWhiteCtaProps> = ({ onInquire }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
        );
      }

      if (textRef.current && ctaBtnRef.current) {
        tl.fromTo(
          [textRef.current, ctaBtnRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out' },
          '-=0.7'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="wedding-white-cta"
      className="relative w-full bg-[var(--fx-black)] text-[var(--fx-white)] py-24 sm:py-36 px-6 sm:px-10 md:px-14 lg:px-16 select-none border-t border-white/10 no-parallax"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Big Bold Condensed Headline */}
        <div className="lg:col-span-7">
          <h2
            ref={headlineRef}
            className="font-editorial font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] leading-[0.9] tracking-tight uppercase text-white"
          >
            YOUR STORY.<br />
            PRESERVED<br />
            <span className="text-[var(--fx-yellow)]">BEAUTIFULLY.</span>
          </h2>
        </div>

        {/* Right Column: Narrative Subtext & Inquire CTA */}
        <div className="lg:col-span-5 flex flex-col items-start justify-center pl-0 lg:pl-6 space-y-8">
          <p
            ref={textRef}
            className="text-base sm:text-xl text-white/80 font-tech leading-relaxed max-w-md"
          >
            We take on a limited number of wedding commissions each year to ensure every story receives master-level artistry and undivided devotion.
          </p>

          <button
            ref={ctaBtnRef}
            id="wedding-cta-inquire-now-btn"
            type="button"
            onClick={() => {
              soundEngine.playOpen();
              onInquire();
            }}
            data-cursor="cta"
            className="group inline-flex items-center gap-4 px-8 py-4 bg-[var(--fx-yellow)] text-black hover:bg-white text-xs sm:text-sm font-mono-tech uppercase tracking-[0.25em] font-bold transition-all cursor-pointer rounded-sm shadow-2xl hover:scale-105"
          >
            <span>COMMISSION YOUR DATE</span>
            <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
