import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useContent, useSectionStyle } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onStartProject: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartProject }) => {
  const { content } = useContent();
  const sec = useSectionStyle('cta');
  const cta = content.cta || {};
  const headlineLines = (cta.headline || 'WANT YOUR BRAND\nTO BE OUR NEXT\nPROJECT?').split('\n');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sec.animationsEnabled) {
      if (titleRef.current) titleRef.current.style.opacity = '1';
      return;
    }
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            once: true,
          }
        });
        
        gsap.from(titleRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            once: true,
          }
        });
        
        gsap.from(buttonRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            once: true,
          }
        });
        ScrollTrigger.refresh();
      }, sectionRef);
      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [sec.animationsEnabled]);

  return (
    <section ref={sectionRef} style={sec.style} className="no-parallax w-full bg-[#050505] text-white py-10 sm:py-28 md:py-36 px-4 sm:px-4 md:px-8 md:px-12 lg:px-4 md:px-16 border-t border-white/10 select-none overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div ref={containerRef} className="bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-2xl p-6 sm:p-16 md:p-20 text-center space-y-6 sm:space-y-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] group sm:hover:border-white/20 transition-colors">
          
          {/* Corner brackets - smaller on mobile */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[var(--fx-yellow)]/70" />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[var(--fx-yellow)]/70" />
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[var(--fx-yellow)]/70" />
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[var(--fx-yellow)]/70" />

          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

          {/* Tag */}
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-sm font-mono-tech tracking-[0.25em] sm:tracking-[0.3em] text-[var(--fx-yellow)] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{cta.tagline || 'START A COLLABORATION'}</span>
          </div>

          {/* Title & Body */}
          <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
            <h2 ref={titleRef} className="text-[28px] sm:text-xl md:text-3xl md:text-5xl md:text-6xl lg:text-7xl font-editorial tracking-tight uppercase text-white leading-[0.92]">
              {headlineLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <div className="pt-1 sm:pt-2 font-tech text-[14px] sm:text-lg text-white/60 max-w-xl mx-auto space-y-2 leading-relaxed px-2 sm:px-0">
              <p className="uppercase font-mono-tech tracking-widest text-[11px] sm:text-sm text-white/40 font-semibold">{cta.subHeadline || 'NEED SOMETHING CUSTOM?'}</p>
              <p>{cta.body || "Tell us what you have in mind — we'll craft a bespoke visual solution for your goals."}</p>
            </div>
          </div>

          {/* CTA Button */}
          <div ref={buttonRef} className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onStartProject();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black font-mono-tech font-bold text-[12px] sm:text-sm tracking-widest uppercase px-6 sm:px-10 py-4 sm:py-4 rounded-xl sm:rounded-sm hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.15)] sm:shadow-[0_10px_30px_rgba(255,255,255,0.2)] sm:hover:shadow-[0_10px_35px_rgba(252,191,19,0.4)] cursor-pointer active:scale-[0.98] sm:hover:-translate-y-0.5"
            >
              <span>{cta.buttonLabel || 'START A PROJECT'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a href={`https://wa.me/94777548671`} target="_blank" rel="noopener noreferrer" className="sm:hidden w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-black font-mono-tech text-xs tracking-widest font-bold uppercase py-3.5 rounded-xl active:scale-[0.98] transition-transform">
              CHAT ON WHATSAPP
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

