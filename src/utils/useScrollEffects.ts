import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollEffects(dependencies: any[]) {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    let ctx = gsap.context(() => {
      setTimeout(() => {
        // Global Cover/Stack effect — desktop only (too heavy on mobile)
        if (!isMobile) {
          const sections = gsap.utils.toArray<HTMLElement>('section:not(#hero):not(.no-parallax)');
          sections.forEach((section, i) => {
            if (i !== sections.length - 1) {
              gsap.set(section, { zIndex: i + 1 });
              gsap.to(section, {
                yPercent: 10,
                scale: 0.98,
                opacity: 0.7,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'bottom bottom',
                  end: 'bottom top',
                  scrub: true,
                }
              });
            }
          });
        }

        // Text reveal — runs on all devices
        const textElements = gsap.utils.toArray<HTMLElement>('.animate-text-on-scroll');
        textElements.forEach((el) => {
          gsap.fromTo(el, 
            { opacity: 0, y: isMobile ? 15 : 30 },   // smaller shift on mobile
            { 
              opacity: 1, 
              y: 0, 
              duration: isMobile ? 0.8 : 1.2, 
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'  // don't reverse on scroll back (cheaper)
              }
            }
          );
        });

        ScrollTrigger.refresh();
      }, 200);
    });

    return () => ctx.revert();
  }, dependencies);
}
