import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    // Only apply on mobile devices
    if (window.innerWidth > 768) return;

    // We use a simple IntersectionObserver to toggle the color-revealed class
    // once the element is meaningfully visible. Color is KEPT after revealing
    // (no un-reveal) so mobile media never falls back to a washed-out state.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('color-revealed');
        }
      });
    }, {
      rootMargin: '-8% 0px -8% 0px', // Reveal as soon as the media is well inside the viewport
      threshold: 0
    });

    // Function to find and observe all targets
    const observeTargets = () => {
      const targets = document.querySelectorAll('.scroll-color-reveal:not(.is-observed)');
      targets.forEach((t) => {
        t.classList.add('is-observed');
        observer.observe(t);
      });
    };

    // Initial observation
    observeTargets();

    // Since we use React and components mount/unmount, a MutationObserver is safest
    const mutationObserver = new MutationObserver(() => {
      observeTargets();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
