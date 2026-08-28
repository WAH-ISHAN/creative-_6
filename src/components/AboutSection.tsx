import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, useSectionStyle } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const { content } = useContent();
  const sec = useSectionStyle('about');
  const about = content.about || {};
  const headlineLines = (about.headline || 'WE CREATE\nWHAT PEOPLE\nREMEMBER.').split('\n');

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textGroup1Ref = useRef<HTMLDivElement>(null);
  const textGroup2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sec.animationsEnabled) {
      if (titleRef.current) titleRef.current.style.opacity = '1';
      return;
    }
    let ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });

      if (textGroup1Ref.current) {
        gsap.from(textGroup1Ref.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textGroup1Ref.current,
            start: 'top 85%',
          }
        });
      }

      if (textGroup2Ref.current) {
        gsap.from(textGroup2Ref.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textGroup2Ref.current,
            start: 'top 85%',
          }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [sec.animationsEnabled]);

  return (
    <section ref={sectionRef} id="section-about" style={sec.style} className="relative w-full bg-[#050505] text-white py-10 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 select-none border-t border-white/10 overflow-hidden no-parallax">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-16 md:gap-24 items-start">

        {/* Left Column: Title */}
        <div className="w-full md:w-5/12 space-y-5 sm:space-y-8">
          <div className="flex items-center gap-2 text-[11px] sm:text-sm font-mono-tech tracking-[0.28em] text-white/40 uppercase">
            <span className="text-white font-bold">06</span>
            <span>/ About Us</span>
          </div>
          <h2 ref={titleRef} className="text-[32px] sm:text-5xl md:text-6xl font-editorial font-normal uppercase tracking-tight text-white leading-[0.92] sm:leading-[0.95]">
            {headlineLines.map((line, i) => (
              <React.Fragment key={i}>
                {line.includes('CREATIVEFX.') ? (
                  <>
                    CREATIVE<span className="text-[var(--fx-yellow)]">FX.</span>
                  </>
                ) : line.includes('CREATIVEFX') ? (
                  <>
                    CREATIVE<span className="text-[var(--fx-yellow)]">FX</span>
                  </>
                ) : line.includes('FX.') ? (
                  <>
                    {line.split('FX.')[0]}<span className="text-[var(--fx-yellow)]">FX.</span>
                  </>
                ) : line.includes('FX') ? (
                  <>
                    {line.split('FX')[0]}<span className="text-[var(--fx-yellow)]">FX</span>{line.split('FX')[1] || ''}
                  </>
                ) : (
                  line
                )}
                {i < headlineLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <div className="w-10 sm:w-12 h-px bg-white/60"></div>
          <div className="sm:hidden text-[13px] font-mono-tech tracking-[0.18em] text-[var(--fx-yellow)] uppercase font-bold">
            EST. COLOMBO // SINCE 2018
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="w-full md:w-7/12 space-y-8 sm:space-y-16 text-[15px] sm:text-lg md:text-xl text-white/60 font-tech leading-relaxed">

          <div ref={textGroup1Ref} className="space-y-4 sm:space-y-6">
            <p className="text-white text-[18px] sm:text-xl md:text-2xl font-editorial tracking-wide uppercase leading-tight">
              {about.lead}
            </p>
            <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/60 whitespace-pre-line">
              {about.body1}
            </p>
            <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/60">
              {about.body2}
            </p>
          </div>

          {(about.vision || about.mission) && (
            <div ref={textGroup2Ref} className="space-y-5 sm:space-y-8 pt-6 sm:pt-8 border-t border-white/10">
              {about.vision && (
                <div className="bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-none sm:bg-transparent sm:border-0 sm:p-0 p-4 space-y-2 sm:space-y-2">
                  <h3 className="text-white font-mono-tech uppercase tracking-[0.2em] text-[11px] sm:text-base mb-1 sm:mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-[var(--fx-yellow)] rounded-full sm:hidden" /> Vision
                  </h3>
                  <p className="text-[14px] sm:text-[17px] leading-relaxed text-white/60">{about.vision}</p>
                </div>
              )}

              {about.mission && (
                <div className="bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-none sm:bg-transparent sm:border-0 sm:p-0 p-4 space-y-2 sm:space-y-2">
                  <h3 className="text-white font-mono-tech uppercase tracking-[0.2em] text-[11px] sm:text-base mb-1 sm:mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-[var(--fx-yellow)] rounded-full sm:hidden" /> Mission
                  </h3>
                  <p className="text-[14px] sm:text-[17px] leading-relaxed text-white/60">{about.mission}</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
