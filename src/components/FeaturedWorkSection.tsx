import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveFeaturedWork, useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWorkSectionProps {
  onSelectProject?: (project: { slug: string; title: string; category: string }) => void;
}

/**
 * Homepage "Featured Work" — Responsive side-by-side pinned scroll layout.
 * Features the exact same interactive image-stack pinning animation, side-by-side columns,
 * background curve, and metadata synchronization on all viewports, dynamically scaled to fit small screens.
 */
export const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({ onSelectProject }) => {
  const { content } = useContent();
  const featuredWorks = resolveFeaturedWork(content);
  const featuredLabel = content.home?.featuredLabel || 'A curated selection of CreativeFX stories, captured with intention.';

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef(featuredWorks);
  worksRef.current = featuredWorks;

  // On phones/small tablets we swap the pinned GSAP scroll for a native
  // touch carousel. Desktop (>=768px) keeps the exact original behavior.
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Desktop-only: skip the expensive pinned ScrollTrigger timeline on mobile.
    if (isMobile) return;
    if (!worksRef.current.length) return;

    const slots = [
      { x: '-9.375rem', y: '-31.25rem', scale: 0.9, rot: -10, op: 0,   z: 0 },
      { x: '0rem',      y: '0rem',      scale: 1.0, rot: 0,   op: 1,   z: 50 },
      { x: '7.5rem',    y: '21.875rem', scale: 0.85, rot: 6,   op: 0.8,  z: 40 },
      { x: '12.5rem',   y: '37.5rem',   scale: 0.75, rot: -4,  op: 0.5,  z: 30 },
      { x: '16.25rem',  y: '50rem',     scale: 0.65, rot: 8,   op: 0.2,  z: 20 },
      { x: '18.75rem',  y: '59.375rem', scale: 0.55, rot: -3,  op: 0,    z: 10 },
      { x: '18.75rem',  y: '59.375rem', scale: 0.55, rot: 0,   op: 0,    z: 5 }
    ];

    const ctx = gsap.context(() => {
      gsap.from('.fw-curve', {
        xPercent: -20, opacity: 0, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });

      gsap.from('.fw-title', {
        y: '2.5rem', opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });

      const total = worksRef.current.length;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${Math.max(2, total - 1) * 80}%`,
          scrub: true,
          pin: true,
          pinType: 'transform',
          anticipatePin: 1,
          onUpdate: (self) => {
            const rawProgress = self.progress;
            const idx = Math.min(total - 1, Math.floor(rawProgress * total));
            const work = worksRef.current[idx];
            if (!work) return;
            if (progressRef.current) progressRef.current.innerHTML = `<span class="text-black">0${idx + 1}</span> / 0${total}`;
            if (categoryRef.current) categoryRef.current.innerText = work.category || work.categoryLabel || '';
            if (titleRef.current) titleRef.current.innerText = work.title;
          }
        }
      });

      const images = gsap.utils.toArray<HTMLElement>('.fw-image');

      images.forEach((img, i) => {
        const startSlot = Math.min(slots.length - 1, i + 1);
        gsap.set(img, {
          x: slots[startSlot].x,
          y: slots[startSlot].y,
          scale: slots[startSlot].scale,
          rotation: slots[startSlot].rot,
          opacity: slots[startSlot].op,
          zIndex: slots[startSlot].z,
        });
        const imgElement = img.querySelector('img');
        if (imgElement) {
          gsap.set(imgElement, {
            filter: startSlot === 1 ? 'grayscale(0%)' : 'grayscale(100%)'
          });
        }
      });

      const transitions = images.length - 1;
      for (let step = 0; step < transitions; step++) {
        const stepTl = gsap.timeline();
        images.forEach((img, i) => {
          const currentSlot = i + 1 - step;
          const nextSlot = currentSlot - 1;
          const safeNext = Math.max(0, Math.min(slots.length - 1, nextSlot));
          stepTl.to(img, {
            x: slots[safeNext].x,
            y: slots[safeNext].y,
            scale: slots[safeNext].scale,
            rotation: slots[safeNext].rot,
            opacity: slots[safeNext].op,
            zIndex: slots[safeNext].z,
            duration: 1,
            ease: 'none'
          }, 0);
          const imgElement = img.querySelector('img');
          if (imgElement) {
            stepTl.to(imgElement, {
              filter: safeNext === 1 ? 'grayscale(0%)' : 'grayscale(100%)',
              duration: 1,
              ease: 'none'
            }, 0);
          }
        });
        tl.add(stepTl);
      }

      tl.to('.fw-curve', {
        scale: 1.05,
        xPercent: -18,
        duration: transitions,
        ease: 'none'
      }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (!featuredWorks.length) return null;

  return (
    <section ref={sectionRef} id="section-featured-work" className="relative w-full md:h-screen md:supports-[height:100svh]:h-[100svh] bg-white text-[#050505] select-none overflow-hidden no-parallax">

      {/* Curved Background - responsive width & height (desktop scroll animation only) */}
      <div className="fw-curve hidden md:block absolute left-[-45vw] top-[-35vh] w-[95vw] h-[170vh] bg-white rounded-r-full z-20 shadow-[40px_0_60px_rgba(0,0,0,0.06)] pointer-events-none" />

      {isMobile ? (
        /* ── MOBILE: native, touch-friendly horizontal carousel (no GSAP pin) ── */
        <div className="relative z-30 w-full py-12">
          <div className="px-6">
            <h2 className="text-4xl font-editorial tracking-tight uppercase leading-[0.95] text-black">
              Featured<br />Work
            </h2>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#666666] max-w-[280px] leading-relaxed font-mono-tech">
              {featuredLabel}
            </p>
          </div>

          <div
            className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {featuredWorks.map((work, i) => (
              <div
                key={work.id}
                onClick={() => onSelectProject?.(work)}
                role="button"
                tabIndex={0}
                aria-label={`Open project ${work.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectProject?.(work); } }}
                className="snap-center shrink-0 w-[78vw] max-w-[330px] bg-white p-2 pb-3 shadow-2xl border border-black/5 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="w-full aspect-[4/5] relative overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 text-[10px] font-mono-tech tracking-[0.25em] text-white bg-black/45 px-2 py-0.5 backdrop-blur-sm">
                    0{i + 1} / 0{featuredWorks.length}
                  </div>
                </div>
                <div className="pt-3 px-1 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-editorial tracking-widest uppercase text-[#050505] leading-none truncate">
                      {work.category || work.categoryLabel || ''}
                    </div>
                    <div className="mt-1 text-[10px] text-[#666666] font-mono-tech tracking-widest uppercase truncate">
                      {work.title}
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono-tech tracking-widest text-[#050505] whitespace-nowrap">VIEW →</span>
                </div>
              </div>
            ))}
          </div>

          <p className="px-6 mt-1 text-[10px] font-mono-tech tracking-[0.3em] text-[#999999] uppercase">Swipe to explore →</p>
        </div>
      ) : (
      <div className="relative w-full h-full z-30 flex flex-row items-stretch">
        
        {/* Left Column (Text Info) */}
        <div className="w-[50vw] shrink-0 flex flex-col justify-center pl-6 sm:pl-12 md:pl-24 xl:pl-32 z-30 relative">
          <div className="fw-title overflow-hidden">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-editorial tracking-tight uppercase leading-[0.95] text-black">
              Featured<br />Work
            </h2>
          </div>

          <div className="fw-title mt-4 sm:mt-6 lg:mt-8">
            <p className="text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.25em] text-[#666666] max-w-[160px] sm:max-w-[280px] lg:max-w-[340px] leading-relaxed font-mono-tech">
              {featuredLabel}
            </p>
          </div>

          {/* Active Work Info - absolute positioned bottom-left */}
          <div className="fw-title absolute bottom-8 sm:bottom-16 lg:bottom-24 left-6 sm:left-12 md:left-24 xl:left-32">
            <div ref={progressRef} className="text-[10px] sm:text-xs font-mono-tech tracking-[0.3em] text-[#888888] mb-2 md:mb-3">
              <span className="text-black font-bold">01</span> / 0{featuredWorks.length}
            </div>
            <div ref={categoryRef} className="text-base sm:text-2xl lg:text-3xl font-editorial tracking-widest uppercase text-[#050505] mb-0.5 sm:mb-1 leading-none">
              {featuredWorks[0]?.category || featuredWorks[0]?.categoryLabel || ''}
            </div>
            <div ref={titleRef} className="text-[9px] sm:text-xs text-[#666666] font-mono-tech tracking-widest uppercase">
              {featuredWorks[0]?.title || ''}
            </div>
          </div>
        </div>

        {/* Right Column (Stacked Cards) */}
        <div className="w-[50vw] flex-1 flex items-center justify-center z-10 relative overflow-hidden">
          <div className="relative w-[42vw] md:w-[40vw] max-w-[700px] aspect-[4/5] mr-[4vw] md:mr-[8vw]">
            {featuredWorks.map((work) => (
              <div
                key={work.id}
                onClick={() => onSelectProject?.(work)}
                className="fw-image absolute inset-0 bg-white p-2 sm:p-3 md:p-5 pb-8 sm:pb-16 md:pb-24 shadow-2xl pointer-events-auto cursor-pointer group origin-center border border-black/5"
              >
                <div className="w-full h-full relative overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-2 sm:bottom-6 md:bottom-8 left-2 sm:left-6 md:left-8 text-[8px] sm:text-xs font-mono-tech tracking-widest text-[#050505] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  VIEW PROJECT →
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      )}
    </section>
  );
};
