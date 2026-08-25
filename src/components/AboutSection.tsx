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
    <section ref={sectionRef} id="section-about" style={sec.style} className="relative w-full bg-[var(--fx-black)] text-[var(--fx-white)] py-16 sm:py-24 md:py-32 px-6 sm:px-8 md:px-12 select-none border-t border-[var(--fx-border-dark)] overflow-hidden no-parallax">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">

        {/* Left Column: Title */}
        <div className="md:w-5/12 space-y-8">
          <div className="flex items-center gap-2 text-sm sm:text-base font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
            <span className="text-[var(--fx-white)]">06</span>
            <span>/ About Us</span>
          </div>
          <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-white)] leading-[0.95]">
            {headlineLines.map((line, i) => (
              <React.Fragment key={i}>
                {line.includes('CREATIVEFX.') ? (
                  <>
                    CREATIVE<span className="text-[var(--fx-yellow)]">FX</span>.
                  </>
                ) : line.includes('CREATIVEFX') ? (
                  <>
                    CREATIVE<span className="text-[var(--fx-yellow)]">FX</span>
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
          <div className="w-12 h-px bg-[var(--fx-white)]"></div>
        </div>

        {/* Right Column: Content */}
        <div className="md:w-7/12 space-y-16 text-lg md:text-xl text-[var(--fx-gray)] font-tech leading-relaxed">

          <div ref={textGroup1Ref} className="space-y-6">
            <p className="text-[var(--fx-white)] text-xl md:text-2xl font-editorial tracking-wide uppercase animate-text-on-scroll">
              {about.lead}
            </p>
            <p className="animate-text-on-scroll whitespace-pre-line">
              {about.body1}
            </p>
            <p className="animate-text-on-scroll">
              {about.body2}
            </p>
          </div>

          {(about.vision || about.mission) && (
            <div ref={textGroup2Ref} className="space-y-8 pt-8 border-t border-[#222222]">
              {about.vision && (
                <div className="space-y-2">
                  <h3 className="text-[var(--fx-white)] font-mono-tech uppercase tracking-widest text-base mb-2">Vision</h3>
                  <p>{about.vision}</p>
                </div>
              )}

              {about.mission && (
                <div className="space-y-2">
                  <h3 className="text-[var(--fx-white)] font-mono-tech uppercase tracking-widest text-base mb-2">Mission</h3>
                  <p>{about.mission}</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
