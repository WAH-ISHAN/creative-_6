import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onStartProject: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartProject }) => {
  const { content } = useContent();
  const cta = content.cta || {};
  const headlineLines = (cta.headline || 'WANT YOUR BRAND\nTO BE OUR NEXT\nPROJECT?').split('\n');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
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
          start: 'top 85%',
          toggleActions: 'play none none none',
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
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="no-parallax w-full bg-[#050505] text-[var(--fx-white)] py-20 sm:py-28 md:py-36 px-6 sm:px-8 md:px-12 lg:px-16 border-t border-[var(--fx-border-dark)] select-none overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div ref={containerRef} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 sm:p-16 md:p-20 text-center space-y-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] group hover:border-white/20 transition-colors">
          
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[var(--fx-yellow)]/70" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[var(--fx-yellow)]/70" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[var(--fx-yellow)]/70" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[var(--fx-yellow)]/70" />

          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

          {/* Tag */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase font-bold">
            <Sparkles className="w-4 h-4" />
            <span>{cta.tagline || 'START A COLLABORATION'}</span>
          </div>

          {/* Title & Body */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial tracking-tight uppercase text-white leading-[0.92]">
              {headlineLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <div className="pt-2 font-tech text-base sm:text-lg text-gray-300 max-w-xl mx-auto space-y-2 leading-relaxed">
              <p className="uppercase font-mono-tech tracking-widest text-xs sm:text-sm text-gray-400 font-semibold">{cta.subHeadline || 'NEED SOMETHING CUSTOM?'}</p>
              <p>{cta.body || "Tell us what you have in mind — we'll craft a bespoke visual solution for your goals."}</p>
            </div>
          </div>

          {/* CTA Button */}
          <div ref={buttonRef} className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onStartProject();
              }}
              className="inline-flex items-center gap-3 bg-white text-black font-mono-tech font-bold text-xs sm:text-sm tracking-widest uppercase px-10 py-4.5 rounded-sm hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_35px_rgba(252,191,19,0.4)] cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{cta.buttonLabel || 'START A PROJECT'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
