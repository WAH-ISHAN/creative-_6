import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollEffects(dependencies: any[]) {
  useEffect(() => {
    // We do NOT kill ALL ScrollTriggers here — doing so would destroy the
    // component-level animation triggers (IntroductionSection, AboutSection, etc.)
    // because React runs child useEffects BEFORE parent useEffects.
    // Instead, each component cleans up its own triggers via ctx.revert() on unmount.
    let ctx = gsap.context(() => {
      // Wait for the new route's DOM to fully mount before scanning for sections
      setTimeout(() => {
        // Global Cover/Stack effect across all devices
        const sections = gsap.utils.toArray<HTMLElement>('section:not(#hero):not(.no-parallax)');
        sections.forEach((section, i) => {
          if (i !== sections.length - 1) {
            gsap.set(section, { zIndex: i + 1 });
            gsap.to(section, {
              yPercent: 8,
              scale: 0.98,
              opacity: 0.75,
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

        // Rich text reveal on scroll
        const textElements = gsap.utils.toArray<HTMLElement>('.animate-text-on-scroll');
        textElements.forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });

        ScrollTrigger.refresh();
      }, 350);
    });

    // ctx.revert() only reverts triggers created WITHIN this context — safe for other components
    return () => {
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
