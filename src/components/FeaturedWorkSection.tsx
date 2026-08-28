import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveFeaturedWork, useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWorkSectionProps {
  onSelectProject?: (project: { slug: string; title: string; category: string }) => void;
}

/**
 * Homepage "Featured Work" — desktop pinned scroll, mobile swipeable stack.
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

  const [mobileActive, setMobileActive] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop only pinned animation
    mm.add('(min-width: 769px)', () => {
      if (!worksRef.current.length) return;

      gsap.from('.fw-curve', {
        xPercent: -20, opacity: 0, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });

      gsap.from('.fw-title', {
        y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
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

      const slots = [
        { x: -150, y: -500, scale: 0.9, rot: -10, op: 0, z: 0 },
        { x: 0,    y: 0,    scale: 1.0, rot: 0,   op: 1, z: 50 },
        { x: 120,  y: 350,  scale: 0.85, rot: 6,   op: 0.8, z: 40 },
        { x: 200,  y: 600,  scale: 0.75, rot: -4,  op: 0.5, z: 30 },
        { x: 260,  y: 800,  scale: 0.65, rot: 8,   op: 0.2, z: 20 },
        { x: 300,  y: 950,  scale: 0.55, rot: -3,  op: 0,   z: 10 },
        { x: 300,  y: 950,  scale: 0.55, rot: 0,   op: 0,   z: 5 }
      ];

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
    });

    // Mobile: no pin, just fade-in
    mm.add('(max-width: 768px)', () => {
      gsap.from('.fw-mobile-title', {
        y: 24, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
      });
      gsap.from('.fw-mobile-card', {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.fw-mobile-track', start: 'top 85%' }
      });
    });

    return () => mm.revert();
  }, []);

  // Mobile scroll sync
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 300;
      const idx = Math.round(scrollLeft / cardWidth);
      setMobileActive(Math.min(Math.max(0, idx), featuredWorks.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [featuredWorks.length]);

  const scrollToCard = (idx: number) => {
    const el = mobileScrollRef.current;
    if (!el || !el.firstElementChild) return;
    const cardWidth = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    el.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
  };

  if (!featuredWorks.length) return null;

  return (
    <section ref={sectionRef} id="section-featured-work" className="relative w-full bg-white text-[#050505] select-none overflow-hidden no-parallax">

      {/* ── DESKTOP PINNED EXPERIENCE ── */}
      <div className="hidden md:block h-screen supports-[height:100svh]:h-[100svh] w-full relative overflow-hidden">
        <div className="fw-curve absolute left-[-45vw] top-[-35vh] w-[95vw] h-[170vh] bg-white rounded-r-full z-20 shadow-[40px_0_60px_rgba(0,0,0,0.06)] pointer-events-none" />

        <div className="absolute left-0 top-0 w-[50vw] h-full z-30 flex flex-col justify-center pl-12 lg:pl-24 xl:pl-32">
          <div className="fw-title overflow-hidden">
            <h2 className="text-6xl lg:text-7xl xl:text-8xl font-editorial tracking-tight uppercase leading-[0.95]">
              Featured<br />Work
            </h2>
          </div>

          <div className="fw-title mt-6 lg:mt-8">
            <p className="text-xs lg:text-sm uppercase tracking-[0.25em] text-[#666666] w-64 lg:w-80 leading-relaxed font-mono-tech">
              {featuredLabel}
            </p>
          </div>

          <div className="fw-title absolute bottom-16 lg:bottom-24 left-12 lg:left-24 xl:left-32">
            <div ref={progressRef} className="text-xs font-mono-tech tracking-[0.3em] text-[#888888] mb-3">
              <span className="text-black">01</span> / 0{featuredWorks.length}
            </div>
            <div ref={categoryRef} className="text-2xl lg:text-3xl font-editorial tracking-widest uppercase text-[#050505] mb-1">
              {featuredWorks[0]?.category || featuredWorks[0]?.categoryLabel || ''}
            </div>
            <div ref={titleRef} className="text-xs text-[#666666] font-mono-tech tracking-widest uppercase">
              {featuredWorks[0]?.title || ''}
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-[55vw] h-full z-10 flex items-center justify-center pointer-events-none">
          <div className="relative w-[40vw] max-w-[700px] min-w-[400px] aspect-[4/5] mr-[5vw] lg:mr-[8vw]">
            {featuredWorks.map((work) => (
              <div
                key={work.id}
                onClick={() => onSelectProject?.(work)}
                className="fw-image absolute inset-0 bg-white p-3 md:p-5 pb-16 md:pb-24 shadow-2xl pointer-events-auto cursor-pointer group origin-center"
              >
                <div className="w-full h-full relative overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 text-xs font-mono-tech tracking-widest text-[#050505] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  VIEW PROJECT →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE SWIPEABLE STACK ── */}
      <div className="md:hidden bg-white py-10 px-4">
        <div className="fw-mobile-title">
          <div className="flex items-center gap-2 text-[11px] font-mono-tech tracking-[0.28em] text-[#888] uppercase mb-3">
            <span className="text-black font-bold">02</span><span>/ Featured Work</span>
          </div>
          <h2 className="text-[34px] font-editorial tracking-tight uppercase leading-[0.95] text-black">
            FEATURED<br /><span className="text-[#111]">WORK</span>
          </h2>
          <p className="text-[13px] font-tech text-[#666] leading-relaxed mt-3 max-w-[320px]">
            {featuredLabel}
          </p>
        </div>

        {/* Progress + category */}
        <div className="flex items-end justify-between mt-6 mb-3">
          <div>
            <div className="text-[11px] font-mono-tech tracking-[0.28em] text-[#999] mb-1">
              <span className="text-black font-bold">0{mobileActive + 1}</span> / 0{featuredWorks.length}
            </div>
            <div className="text-[15px] font-editorial tracking-[0.16em] uppercase text-black leading-none">
              {featuredWorks[mobileActive]?.category || featuredWorks[mobileActive]?.categoryLabel}
            </div>
            <div className="text-[11px] font-mono-tech tracking-widest text-[#666] uppercase mt-1">
              {featuredWorks[mobileActive]?.title}
            </div>
          </div>
          <div className="flex gap-1.5 mb-1">
            {featuredWorks.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-300 ${mobileActive === i ? 'w-6 bg-black' : 'w-3 bg-black/20'}`}
              />
            ))}
          </div>
        </div>

        <div
          ref={mobileScrollRef}
          className="fw-mobile-track flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as any}
        >
          {featuredWorks.map((work, idx) => (
            <div
              key={work.id}
              onClick={() => onSelectProject?.(work)}
              className="fw-mobile-card snap-center shrink-0 w-[78%] max-w-[300px] bg-white border border-black/10 p-3 pb-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                <img
                  src={work.coverImage}
                  alt={work.title}
                  className="w-full h-full object-cover object-top"
                  loading={idx < 2 ? 'eager' : 'lazy'}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur px-2 py-1 text-[10px] font-mono-tech tracking-widest text-white">
                  0{idx + 1} // 0{featuredWorks.length}
                </div>
                <div className="absolute inset-0 bg-black/0 active:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 active:opacity-100 bg-[var(--fx-yellow)] text-black text-[10px] font-mono-tech tracking-widest font-bold px-3 py-2">VIEW PROJECT →</span>
                </div>
              </div>
              <div className="pt-3 space-y-1">
                <span className="text-[10px] font-mono-tech tracking-widest text-[#888] uppercase block">{work.categoryLabel || work.category}</span>
                <h3 className="text-[15px] font-editorial tracking-wide uppercase text-black leading-tight">{work.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono-tech tracking-widest text-black/40 uppercase mt-1">
          <span>‹ SWIPE ›</span>
        </div>
      </div>
    </section>
  );
};
