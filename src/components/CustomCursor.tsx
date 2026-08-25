import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e: MouseEvent) => {
      if (hidden) setHidden(false);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor="pointer"]')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [hidden]);

  if (hidden || window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      {/* Outer View / Normal state */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center mix-blend-difference"
        animate={{
          x: position.x - 24,
          y: position.y - 24,
          scale: hovered ? 1.5 : 1,
          opacity: 1
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          {hovered ? (
            <span className="text-[8px] font-mono-tech tracking-[0.2em] text-[var(--fx-white)] uppercase absolute">VIEW</span>
          ) : (
            <>
              <div className="absolute w-[1px] h-3 bg-[var(--fx-white)]" />
              <div className="absolute w-3 h-[1px] bg-[var(--fx-white)]" />
            </>
          )}
        </div>
      </motion.div>

      {/* Center point */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[101]"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
          opacity: 1
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 40, mass: 0.1 }}
      >
        <div className="w-1 h-1 bg-[var(--fx-white)] rounded-full" />
      </motion.div>
    </>
  );
};
