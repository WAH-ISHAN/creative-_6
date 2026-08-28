import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, DEFAULT_CONTENT, useSectionStyle } from '../context/ContentContext';
import type { AgencyService } from '../types';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ServicesSection: React.FC<{ onSelectService?: (service: AgencyService) => void }> = ({ onSelectService }) => {
  const { content } = useContent();
  const sec = useSectionStyle('services');
  const rawServices = (content.services && content.services.length > 0) ? content.services : DEFAULT_CONTENT.services;
  const services = (rawServices as AgencyService[]).filter(s => (s.status ?? 'published') === 'published');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sec.animationsEnabled) {
      if (titleRef.current) titleRef.current.style.opacity = '1';
      return;
    }
    let ctx = gsap.context(() => {
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
    <section ref={sectionRef} id="section-services" style={sec.style} className="relative w-full bg-[#fafafa] sm:bg-[var(--fx-white)] text-[var(--fx-black)] py-10 sm:py-20 md:py-28 px-4 sm:px-8 md:px-12 select-none border-t border-black/10 overflow-hidden no-parallax">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-24 relative">

        {/* Left: Section Header & Narrative */}
        <div className="lg:w-4/12 space-y-4 sm:space-y-6 lg:sticky lg:top-24 self-start">
          <div className="flex items-center gap-2 text-[11px] sm:text-sm font-mono-tech tracking-[0.28em] text-black/50 uppercase">
            <span className="text-black font-bold">05</span>
            <span>/ Services</span>
          </div>
          <h2 ref={titleRef} className="text-[34px] sm:text-5xl md:text-6xl font-editorial font-normal uppercase tracking-tight text-black leading-[0.92] sm:leading-[0.95]">
            WE TURN<br />
            <span className="text-[var(--fx-yellow)] sm:text-[var(--fx-yellow)]">IDEAS INTO<br />
            VISUALS.</span>
          </h2>
          <p className="text-[14px] sm:text-base font-tech text-black/60 leading-relaxed max-w-sm pt-1 sm:pt-2">
            We deliver high-end photography, cinematic video production, brand strategy, and social content systems for modern brands and visionary creators.
          </p>
          <div className="hidden sm:block pt-4">
            <button onClick={() => { const el=document.getElementById('section-contact'); if(el) el.scrollIntoView({behavior:'smooth'}); }} className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase border border-black/15 px-5 py-3 hover:bg-black hover:text-white hover:border-black transition-colors">
              START A PROJECT <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Clean Service List */}
        <div ref={listRef} className="lg:w-8/12 flex flex-col relative z-20 w-full">
          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {services.map((service, idx) => (
              <div
                key={service.id || idx}
                onClick={() => onSelectService?.(service)}
                className={`group bg-white border ${onSelectService ? 'active:bg-black active:text-white' : ''} border-black/10 p-5 rounded-xl shadow-sm flex flex-col gap-3 ${onSelectService ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-mono-tech tracking-[0.2em] text-black/40 group-active:text-white/60 border border-black/10 group-active:border-white/20 px-2 py-1 rounded-full">
                    {service.number || `0${idx + 1}`}
                  </span>
                  {onSelectService && <ArrowUpRight className="w-4 h-4 text-black/20 group-active:text-white/60 shrink-0 mt-1" />}
                </div>
                <h3 className="text-[22px] font-editorial tracking-wide uppercase text-black group-active:text-white leading-none">
                  {service.title}
                </h3>
                <p className="text-[13px] font-tech text-black/60 group-active:text-white/70 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop list */}
          <div className="hidden sm:flex flex-col">
            {services.map((service, idx) => (
              <div
                key={service.id || idx}
                onClick={() => onSelectService?.(service)}
                className={`flex flex-col sm:flex-row sm:items-start justify-between border-b border-black/10 py-8 sm:py-10 transition-colors duration-300 px-4 -mx-4 sm:mx-0 sm:px-4 select-none group ${onSelectService ? 'hover:bg-black/[0.02] cursor-pointer' : ''}`}
              >
                <div className="flex flex-col gap-4 max-w-xl w-full">
                  <div className="flex items-start sm:items-center gap-6 md:gap-8">
                    <span className="text-xs sm:text-sm font-mono-tech tracking-widest text-black/40 pt-1 sm:pt-0 shrink-0 group-hover:text-black transition-colors">
                      {service.number || service.id || `0${idx + 1}`}
                    </span>
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-editorial tracking-wide uppercase text-black leading-none group-hover:tracking-wider transition-all">
                      {service.title}
                    </span>
                    {onSelectService && <ArrowUpRight className="hidden sm:block w-5 h-5 text-black/0 group-hover:text-black/30 ml-auto transition-colors" />}
                  </div>
                  <p className="text-base sm:text-[15px] font-tech text-black/60 md:pl-[3.5rem] leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="sm:hidden mt-4">
            <button onClick={() => { const el=document.getElementById('section-contact'); if(el) el.scrollIntoView({behavior:'smooth'}); }} className="w-full bg-black text-white font-mono-tech text-xs tracking-[0.18em] font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              START A PROJECT <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
