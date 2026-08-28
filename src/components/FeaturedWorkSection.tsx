import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveFeaturedWork, useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWorkSectionProps {
  onSelectProject?: (project: { slug: string; title: string; category: string }) => void;
}

/**
 * Homepage "Featured Work" pinned scroll.
 * Content is selected from the MASTER PROJECT DATABASE via Admin → Homepage →
 * Featured Work (falls back to projects flagged `featured`).
 */
export const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({ onSelectProject }) => {
  const { content } = useContent();
  const featuredWorks = resolveFeaturedWork(content);
  const featuredLabel = content.home?.featuredLabel || 'A curated selection of CreativeFX stories, captured with intention.';

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  // Keep a stable ref to the latest list so the GSAP timeline never goes stale
  const worksRef = useRef(featuredWorks);
  worksRef.current = featuredWorks;

  useEffect(() => {
    // Responsive GSAP: each breakpoint owns its animation setup and
    // automatically reverts/re-applies when the viewport crosses it
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      if (!worksRef.current.length) return;

      // Initial entry animation for text and curve
      gsap.from('.fw-curve', {
        xPercent: -20, opacity: 0, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });

      gsap.from('.fw-title', {
        y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });

      // The main pinned scroll animation
      const total = worksRef.current.length;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${Math.max(2, total - 1) * 80}%`,
          scrub: true, // Let Lenis handle the smoothing natively
          pin: true,
          // Move the section with transforms instead of swapping it to
          // position:fixed — identical visuals under Lenis, and avoids
          // full-viewport layout-shift (CLS ~1.0) at pin engage/release.
          pinType: 'transform',
          anticipatePin: 1,
          onUpdate: (self) => {
            const rawProgress = self.progress;
            const idx = Math.min(total - 1, Math.floor(rawProgress * total));
            const work = worksRef.current[idx];
            if (!work) return;
            if (progressRef.current) progressRef.current.innerHTML = `<span class="text-[var(--fx-white)]">0${idx + 1}</span> / 0${total}`;
            if (categoryRef.current) categoryRef.current.innerText = work.category || work.categoryLabel || '';
            if (titleRef.current) titleRef.current.innerText = work.title;
          }
        }
      });

      const images = gsap.utils.toArray<HTMLElement>('.fw-image');

      // Spatial slots for photos travel through (generalized for any count ≤ 7)
      const slots = [
        { x: -150, y: -500, scale: 0.9, rot: -10, op: 0, z: 0 },    // 0: Exited top
        { x: 0,    y: 0,    scale: 1.0, rot: 0,   op: 1, z: 50 },   // 1: Active Center
        { x: 120,  y: 350,  scale: 0.85, rot: 6,   op: 0.8, z: 40 }, // 2: Waiting Next
        { x: 200,  y: 600,  scale: 0.75, rot: -4,  op: 0.5, z: 30 }, // 3: Waiting
        { x: 260,  y: 800,  scale: 0.65, rot: 8,   op: 0.2, z: 20 }, // 4: Waiting
        { x: 300,  y: 950,  scale: 0.55, rot: -3,  op: 0,   z: 10 }, // 5: Waiting
        { x: 300,  y: 950,  scale: 0.55, rot: 0,   op: 0,   z: 5 }   // 6: Hidden
      ];

      // Set initial state based on slots & initial grayscale (Slot 1 is COLOR, all other slots are Black & White)
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

      // Build continuous transition sequence
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
            ease: 'none' // Linear easing is required for smooth scrolling!
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

      // Add subtle animation to the background curve
      tl.to('.fw-curve', {
        scale: 1.05,
        xPercent: -18,
        duration: transitions,
        ease: 'none'
      }, 0);
    });

    mm.add('(max-width: 767px)', () => {
      // Mobile fallback animation
      gsap.utils.toArray<HTMLElement>('.fw-mobile-item').forEach((item) => {
        const img = item.querySelector('img');
        if (img) {
          gsap.fromTo(
            img,
            { filter: 'grayscale(100%)' },
            {
              filter: 'grayscale(0%)',
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top 65%',
                end: 'bottom 35%',
                toggleActions: 'play reverse play reverse',
              }
            }
          );
        }
        gsap.from(item, {
          y: 50, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%' }
        });
      });
    });

    return () => mm.revert();
  }, []);

  if (!featuredWorks.length) return null;

  return (
    <section ref={sectionRef} id="section-featured-work" className="relative w-full bg-white text-[#050505] select-none overflow-hidden no-parallax">

      {/* DESKTOP PINNED EXPERIENCE */}
      <div className="hidden md:block h-screen supports-[height:100svh]:h-[100svh] w-full relative overflow-hidden">

        {/* Massive White Curve masking the photos */}
        <div className="fw-curve absolute left-[-45vw] top-[-35vh] w-[95vw] h-[170vh] bg-white rounded-r-full z-20 shadow-[40px_0_60px_rgba(0,0,0,0.06)] pointer-events-none" />

        {/* Left Side: Typography (Z-30 above curve) */}
        <div className="absolute left-0 top-0 w-[50vw] h-full z-30 flex flex-col justify-center pl-16 lg:pl-24 xl:pl-32">

          <div className="fw-title overflow-hidden">
            <h2 className="text-6xl lg:text-7xl xl:text-8xl font-editorial tracking-tight uppercase leading-[0.95]">
              Featured<br />Work
            </h2>
          </div>

          <div className="fw-title mt-8">
            <p className="text-xs lg:text-sm uppercase tracking-[0.25em] text-[#666666] w-64 lg:w-80 leading-relaxed font-mono-tech">
              {featuredLabel}
            </p>
          </div>

          <div className="fw-title absolute bottom-16 lg:bottom-24 left-16 lg:left-24 xl:left-32">
            <div ref={progressRef} className="text-[10px] lg:text-xs font-mono-tech tracking-[0.3em] text-[#888888] mb-3">
              <span className="text-[var(--fx-white)]">01</span> / 0{featuredWorks.length}
            </div>
            <div ref={categoryRef} className="text-2xl lg:text-3xl font-editorial tracking-widest uppercase text-[#050505] mb-1">
              {featuredWorks[0]?.category || featuredWorks[0]?.categoryLabel || ''}
            </div>
            <div ref={titleRef} className="text-xs text-[#666666] font-mono-tech tracking-widest uppercase">
              {featuredWorks[0]?.title || ''}
            </div>
          </div>

        </div>

        {/* Right Side: Photo Composition (Z-10 behind curve) */}
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
                {/* Photo metadata (polaroid style bottom) */}
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 text-[10px] md:text-xs font-mono-tech tracking-widest text-[#050505] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  VIEW PROJECT →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE SCROLL EXPERIENCE */}
      <div className="md:hidden w-full pt-8 pb-24 px-6 flex flex-col items-center">
        <div className="w-full text-center mb-16">
          <h2 className="text-5xl font-editorial tracking-tight uppercase leading-none mb-6">
            Featured<br />Work
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#666666] font-mono-tech max-w-[250px] mx-auto leading-relaxed">
            {featuredLabel}
          </p>
        </div>

        <div className="w-full flex flex-col gap-12">
          {featuredWorks.map((work, idx) => (
            <div key={work.id} onClick={() => onSelectProject?.(work)} className="fw-mobile-item flex flex-col w-full group cursor-pointer">
              <div className="w-full aspect-[4/5] bg-white p-2 pb-12 shadow-xl relative overflow-hidden mb-4">
                <img
                  src={work.coverImage}
                  alt={work.title}
                  className="w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono-tech tracking-[0.3em] text-[#888888] mb-1">
                  0{idx + 1} / 0{featuredWorks.length}
                </span>
                <span className="text-xl font-editorial tracking-widest uppercase text-[#050505]">
                  {work.category}
                </span>
                <span className="text-[10px] text-[#666666] font-mono-tech tracking-wider uppercase mt-1">
                  {work.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
