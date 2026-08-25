import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, DEFAULT_CONTENT, useSectionStyle } from '../context/ContentContext';
import type { AgencyService } from '../types';

gsap.registerPlugin(ScrollTrigger);

export const ServicesSection: React.FC<{ onSelectService?: (service: AgencyService) => void }> = ({ onSelectService }) => {
  const { content } = useContent();
  const sec = useSectionStyle('services');
  const rawServices = (content.services && content.services.length > 0) ? content.services : DEFAULT_CONTENT.services;
  const services = (rawServices as AgencyService[]).filter(s => (s.status ?? 'published') === 'published');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sec.animationsEnabled) {
      if (titleRef.current) titleRef.current.style.opacity = '1';
      return;
    }

    let ctx = gsap.context(() => {
      // Scroll animation for title
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });

      // Scroll animation for service list items
      if (listRef.current) {
        gsap.from(listRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 85%',
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sec.animationsEnabled]);

  return (
    <section ref={sectionRef} id="section-services" style={sec.style} className="relative w-full bg-[var(--fx-white)] text-[var(--fx-black)] py-12 sm:py-20 md:py-28 px-6 sm:px-8 md:px-12 select-none border-t border-[var(--fx-border-light)] overflow-hidden no-parallax">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">

        {/* Left: Section Header & Narrative */}
        <div className="lg:w-4/12 space-y-6">
          <div className="flex items-center gap-2 text-sm sm:text-base font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
            <span className="text-[var(--fx-black)]">05</span>
            <span>/ Services</span>
          </div>
          <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-black)] leading-[0.95]">
            WE TURN<br />
            <span className="text-[var(--fx-yellow)]">IDEAS INTO<br />
            VISUALS.</span>
          </h2>
          <p className="text-sm sm:text-base font-tech text-[var(--fx-gray)] leading-relaxed max-w-sm pt-2">
            We deliver high-end photography, cinematic video production, brand strategy, and social content systems for modern brands and visionary creators.
          </p>
        </div>

        {/* Right: Clean Service List */}
        <div ref={listRef} className="lg:w-8/12 flex flex-col relative z-20">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[var(--fx-border-light)] py-8 sm:py-10 transition-colors duration-300 px-4 -mx-4 sm:mx-0 sm:px-4 select-none"
            >
              <div className="flex flex-col gap-4 max-w-xl">
                <div className="flex items-start sm:items-center gap-6 md:gap-8">
                  <span className="text-xs sm:text-sm font-mono-tech tracking-widest text-[var(--fx-gray)] pt-1 sm:pt-0 shrink-0">
                    {service.number || service.id || `0${idx + 1}`}
                  </span>
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-editorial tracking-wide uppercase text-[var(--fx-black)] leading-none sm:leading-none md:leading-none lg:leading-none">
                    {service.title}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-tech text-[var(--fx-gray)] md:pl-[3.5rem] leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
