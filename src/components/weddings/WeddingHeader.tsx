import React, { useState, useEffect } from 'react';
import { smoothScrollTo } from '../../utils/smoothScroll';
import { Menu, X } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface WeddingHeaderProps {
  onInquire: () => void;
  onNavigateToTimeline: () => void;
  onNavigateToStories: () => void;
  onNavigateToApproach: () => void;
  onNavigateToFilms: () => void;
  onSwitchToStudio: () => void;
  activeSection?: string;
}

export const WeddingHeader: React.FC<WeddingHeaderProps> = ({
  onInquire,
  onNavigateToTimeline,
  onNavigateToStories,
  onNavigateToApproach,
  onNavigateToFilms,
  onSwitchToStudio,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (fn: () => void) => {
    soundEngine.playClick();
    fn();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-out ${
          scrolled 
            ? 'bg-[var(--fx-black)]/90 backdrop-blur-md border-b border-[var(--fx-border-dark)] py-4 shadow-sm' 
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* LOGO */}
          <div 
            className="text-xl md:text-2xl font-editorial tracking-[0.08em] uppercase text-white cursor-pointer select-none relative group flex items-center gap-2"
            onClick={() => handleLinkClick(() => smoothScrollTo(0))}
          >
            CREATIVEFX
            <span className="text-[10px] font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase mt-1 hidden sm:inline-block">/ WEDDINGS</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full" />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <button onClick={() => handleLinkClick(onNavigateToStories)} className="px-4 py-2 text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm">
              STORIES
            </button>
            <button onClick={() => handleLinkClick(onNavigateToTimeline)} className="px-4 py-2 text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm">
              TIMELINE
            </button>
            <button onClick={() => handleLinkClick(onNavigateToApproach)} className="px-4 py-2 text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm">
              APPROACH
            </button>
            <button onClick={() => handleLinkClick(onSwitchToStudio)} className="px-4 py-2 text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm">
              STUDIO
            </button>

            {/* INQUIRE CTA */}
            <button 
              onClick={() => handleLinkClick(onInquire)} 
              className="hidden lg:flex items-center gap-2 border border-white/20 px-6 py-2 ml-4 rounded-sm hover:border-[var(--fx-yellow)] hover:text-[var(--fx-yellow)] transition-all group cursor-pointer font-mono-tech text-sm tracking-widest uppercase text-white"
            >
              INQUIRE
            </button>
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => {
              soundEngine.playOpen();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-[90] flex flex-col justify-center items-center transition-all duration-500 ease-in-out md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-8 w-full px-6">
          <button onClick={() => handleLinkClick(onNavigateToStories)} className="text-3xl font-editorial uppercase tracking-widest text-white hover:text-[var(--fx-yellow)] transition-colors w-full text-center border-b border-white/10 pb-4">
            STORIES
          </button>
          <button onClick={() => handleLinkClick(onNavigateToTimeline)} className="text-3xl font-editorial uppercase tracking-widest text-white hover:text-[var(--fx-yellow)] transition-colors w-full text-center border-b border-white/10 pb-4">
            TIMELINE
          </button>
          <button onClick={() => handleLinkClick(onNavigateToApproach)} className="text-3xl font-editorial uppercase tracking-widest text-white hover:text-[var(--fx-yellow)] transition-colors w-full text-center border-b border-white/10 pb-4">
            APPROACH
          </button>
          <button onClick={() => handleLinkClick(onSwitchToStudio)} className="text-3xl font-editorial uppercase tracking-widest text-[var(--fx-yellow)] transition-colors w-full text-center border-b border-white/10 pb-4">
            MAIN STUDIO
          </button>
          <button onClick={() => handleLinkClick(onInquire)} className="text-3xl font-editorial uppercase tracking-widest text-white hover:text-[var(--fx-yellow)] transition-colors w-full text-center pt-4">
            INQUIRE
          </button>
        </nav>
      </div>
    </>
  );
};
