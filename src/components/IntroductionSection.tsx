import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, useSectionStyle } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export const IntroductionSection: React.FC = () => {
  const { content } = useContent();
  const sec = useSectionStyle('intro');
  const intro = content.intro || {};
  const headlineLines = (intro.headline || 'WE CREATE\nWHAT PEOPLE\nREMEMBER.').split('\n');

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sec.animationsEnabled) {
      if (titleRef.current) titleRef.current.style.opacity = '1';
      if (textRef.current) textRef.current.style.opacity = '1';
      if (imageRef.current) imageRef.current.style.opacity = '1';
      if (watermarkRef.current) watermarkRef.current.style.opacity = '1';
      return;
    }

    let ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      });

      if (watermarkRef.current) {
        gsap.from(watermarkRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        });
      }

      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      });

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1.2,
          delay: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sec.animationsEnabled]);

  return (
    <section
      ref={sectionRef}
      id="section-introduction"
      style={sec.style}
      className="relative w-full bg-[#fafafa] sm:bg-[var(--fx-white)] text-[var(--fx-black)] py-10 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 select-none no-parallax overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-start">

          {/* Left Column: Title & Watermark */}
          <div className="w-full lg:w-7/12 space-y-5 sm:space-y-8 relative">
            <div className="flex items-center gap-2 text-[11px] sm:text-sm font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
              <span className="text-[var(--fx-black)] font-bold">{intro.sectionNumber || '01'}</span>
              <span className="hidden sm:inline">{intro.label || '/ Studio'}</span>
              <span className="sm:hidden">/ STUDIO</span>
            </div>

            <h2 
              ref={titleRef} 
              className="text-[32px] sm:text-5xl md:text-6xl lg:text-7xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-black)] leading-[0.92] sm:leading-[0.95]"
              style={{ fontSize: sec.headingScale !== 1 ? `clamp(32px, 9vw, ${sec.headingScale * 3.75}rem)` : undefined }}
            >
              {headlineLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>

            <div className="w-10 sm:w-12 h-[2px] sm:h-1 bg-[var(--fx-black)]" style={{ backgroundColor: sec.accent || 'var(--fx-black)' }}></div>
            
            {/* Watermark image: properly aligned and visible on all devices */}
            <div 
              ref={watermarkRef} 
              className="relative w-full pointer-events-none select-none overflow-hidden"
            >
              {/* Desktop: extended from left edge */}
              <div className="hidden lg:block" style={{ marginLeft: 'calc(-50vw + 50%)', width: 'clamp(320px, 42vw, 520px)' }}>
                <img 
                  src="/watermark.png"
                  alt="CreativeFX Watermark" 
                  className="w-full h-auto object-contain object-left opacity-[0.08] pointer-events-none select-none"
                  loading="eager"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/img/creativefx-watermark.png'; (e.target as HTMLImageElement).onerror = () => { (e.target as HTMLImageElement).style.display='none'; }; }}
                />
              </div>
              {/* Tablet */}
              <div className="hidden sm:block lg:hidden w-full max-w-[420px]">
                <img 
                  src="/watermark.png"
                  alt="CreativeFX Watermark" 
                  className="w-full h-auto object-contain object-left opacity-[0.07] pointer-events-none select-none"
                  loading="eager"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/img/creativefx-watermark.png'; (e.target as HTMLImageElement).onerror = () => { (e.target as HTMLImageElement).style.display='none'; }; }}
                />
              </div>
              {/* Mobile: centered, contained, subtle */}
              <div className="sm:hidden w-full flex justify-start pt-1">
                <img 
                  src="/watermark.png"
                  alt="CreativeFX Watermark" 
                  className="w-[72%] max-w-[280px] h-auto object-contain object-left opacity-[0.06] pointer-events-none select-none"
                  loading="eager"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/img/creativefx-watermark.png'; (e.target as HTMLImageElement).onerror = () => { (e.target as HTMLImageElement).style.display='none'; }; }}
                />
              </div>
            </div>
            {/* Fallback text watermark if image fails - always visible */}
            <div className="hidden sm:hidden absolute inset-0 pointer-events-none select-none opacity-[0.04] overflow-hidden flex items-center -z-10">
              <span className="font-editorial text-[84px] leading-none tracking-[0.08em] text-black whitespace-nowrap -rotate-2">CREATIVEFX</span>
            </div>
          </div>

          {/* Right Column: Text & Image */}
          <div className="w-full lg:w-5/12 space-y-6 sm:space-y-8 lg:pt-8">
            <div ref={textRef} className="space-y-4 sm:space-y-5 text-[15px] sm:text-base text-[var(--fx-gray)] font-tech leading-relaxed">

              <div className="hidden sm:block h-px w-16 bg-[var(--fx-border-light)]"></div>

              <p 
                className="text-[15px] sm:text-lg font-tech text-[#2a2a2a] sm:text-[var(--fx-gray)] leading-relaxed whitespace-pre-line"
                style={{ fontSize: sec.bodyScale !== 1 ? `${sec.bodyScale * 1.125}rem` : undefined }}
              >
                {intro.body || ''}
              </p>

              <p 
                className="text-[15px] sm:text-lg font-tech text-[#2a2a2a] sm:text-[var(--fx-gray)] leading-relaxed"
                style={{ fontSize: sec.bodyScale !== 1 ? `${sec.bodyScale * 1.125}rem` : undefined }}
              >
                {intro.bodyLine2 || ''}
              </p>
            </div>

            {intro.image && (
              <div ref={imageRef} className="relative w-full max-w-full sm:max-w-[320px] aspect-[4/3] sm:aspect-[4/5] bg-black border border-black/10 overflow-hidden rounded-sm sm:rounded-none shadow-sm sm:shadow-none">
                <img
                  src={intro.image || '/img/studio-workflow.jpeg'}
                  alt="Studio Workflow"
                  className="w-full h-full object-cover object-center sm:filter sm:grayscale opacity-90 sm:opacity-90 transition-all duration-700 sm:hover:scale-105 sm:hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                />
                {/* Mobile caption */}
                <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span className="text-[10px] font-mono-tech tracking-widest text-white/90 uppercase">STUDIO WORKFLOW // COLOMBO</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
