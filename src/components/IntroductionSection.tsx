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

  useEffect(() => {
    if (!sec.animationsEnabled) {
      if (titleRef.current) titleRef.current.style.opacity = '1';
      if (textRef.current) textRef.current.style.opacity = '1';
      if (imageRef.current) imageRef.current.style.opacity = '1';
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
      className="relative w-full bg-[var(--fx-white)] text-[var(--fx-black)] py-14 sm:py-20 md:py-28 px-5 sm:px-8 md:px-12 select-none no-parallax overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-14 lg:gap-20 items-start">

          {/* Left Column: Title & Intro Narrative */}
          <div className="w-full lg:w-7/12 space-y-6 sm:space-y-8 relative">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
              <span className="text-[var(--fx-black)] font-bold">{intro.sectionNumber || '01'}</span>
              <span>{intro.label || '/ Studio'}</span>
            </div>

            <h2 
              ref={titleRef} 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-black)] leading-[0.95]"
              style={{ fontSize: sec.headingScale !== 1 ? `clamp(32px, 9vw, ${sec.headingScale * 3.75}rem)` : undefined }}
            >
              {headlineLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>

            <div className="w-12 h-1 bg-[var(--fx-black)]" style={{ backgroundColor: sec.accent || 'var(--fx-black)' }}></div>
          </div>

          {/* Right Column: Text & Image */}
          <div className="w-full lg:w-5/12 space-y-6 sm:space-y-8 lg:pt-8">
            <div ref={textRef} className="space-y-4 sm:space-y-5 text-base text-[var(--fx-gray)] font-tech leading-relaxed">

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
