import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    
    // Simulate loading
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        
        // Outro animation
        gsap.to('.loader-content', {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'power2.inOut',
          delay: 0.2
        });
        
        gsap.to('.loader-container', {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          delay: 0.6,
          onComplete: onComplete
        });
      }
    }, 150);

    return () => clearInterval(interval);
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
              className="absolute top-0 left-0 h-full bg-[var(--fx-white)] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-8 text-right text-[var(--fx-white)]">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
