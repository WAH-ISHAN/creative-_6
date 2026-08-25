import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export const IntroductionSection: React.FC = () => {
  const { content } = useContent();
  const intro = content.intro || {};
  const headlineLines = (intro.headline || 'WE CREATE\nWHAT PEOPLE\nREMEMBER.').split('\n');

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Title slide up
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

      // Text fade up
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

      // Image reveal
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-introduction"
      className="relative w-full bg-[var(--fx-white)] text-[var(--fx-black)] py-16 sm:py-24 md:py-32 px-6 sm:px-8 md:px-12 select-none no-parallax"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* Left Column: Title & Intro */}
          <div className="lg:w-7/12 space-y-12">
            <div className="flex items-center gap-2 text-sm sm:text-base font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
              <span className="text-[var(--fx-black)]">{intro.sectionNumber || '01'}</span>
              <span>{intro.label || '/ Studio'}</span>
            </div>

            <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-black)] leading-[0.95]">
              {headlineLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>

            <div className="w-12 h-1 bg-[var(--fx-black)]"></div>
          </div>

          {/* Right Column: Text & Image */}
          <div className="lg:w-5/12 space-y-8 lg:pt-8">
            <div ref={textRef} className="space-y-5 text-base text-[var(--fx-gray)] font-tech leading-relaxed">

              <div className="h-px w-16 bg-[var(--fx-border-light)]"></div>

              <p className="text-base sm:text-lg font-tech text-[var(--fx-gray)] leading-relaxed animate-text-on-scroll whitespace-pre-line">
                {intro.body || ''}
              </p>

              <p className="text-base sm:text-lg font-tech text-[var(--fx-gray)] leading-relaxed animate-text-on-scroll">
                {intro.bodyLine2 || ''}
              </p>
            </div>

            {intro.image && (
              <div ref={imageRef} className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] bg-black border border-[var(--fx-border-light)] overflow-hidden fx-media">
                <img
                  src={intro.image}
                  alt="Studio Workflow"
                  className="w-full h-full object-cover object-center filter grayscale opacity-90 transition-all duration-700 hover:scale-105 hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
