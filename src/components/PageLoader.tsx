import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;

      // Animate to 100 quickly if not there yet
      setProgress(100);

      setTimeout(() => {
        gsap.to('.loader-content', {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.inOut',
        });

        gsap.to('.loader-container', {
          yPercent: -100,
          duration: 0.7,
          ease: 'power4.inOut',
          delay: 0.4,
          onComplete,
        });
      }, 150);
    };

    // Smooth linear progress over 1.0s using requestAnimationFrame
    const DURATION = 1000; // ms
    const start = performance.now();

    const tick = (now: number) => {
      if (done) return;
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    requestAnimationFrame(tick);

    // If the real window 'load' fires before the timer, complete immediately
    const onLoad = () => finish();
    window.addEventListener('load', onLoad);

    // Hard cap at 1.5s regardless
    const cap = window.setTimeout(finish, 1500);

    return () => {
      done = true;
      window.removeEventListener('load', onLoad);
      window.clearTimeout(cap);
    };
  }, [onComplete]);

  return (
    <div className="loader-container fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[var(--fx-black)] select-none">
      <div className="loader-content flex flex-col items-center gap-8 w-full max-w-xs px-8">
        <h1 className="text-2xl font-editorial tracking-[0.1em] text-[var(--fx-white)] uppercase">
          CREATIVE<span className="text-[var(--fx-yellow)]">FX</span>
        </h1>

        {/* Progress Line */}
        <div className="w-full flex items-center justify-between gap-4 text-[10px] font-mono-tech text-[var(--fx-gray)]">
          <div className="flex-1 h-px bg-[var(--fx-border-dark)] overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-[var(--fx-white)] transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="tabular-nums w-8 text-right">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
