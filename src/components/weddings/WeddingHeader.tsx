import React, { useState, useEffect } from 'react';
import { smoothScrollTo } from '../../utils/smoothScroll';
import { X } from 'lucide-react';
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
  onSwitchToStudio,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prev;
        document.documentElement.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = (fn: () => void) => {
    soundEngine.playClick();
    fn();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-out ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 py-3 sm:py-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
            : 'bg-gradient-to-b from-black/50 to-transparent border-b border-transparent py-4 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <div 
            className="text-[18px] sm:text-xl md:text-2xl font-editorial tracking-[0.08em] uppercase text-white cursor-pointer select-none relative group flex items-center gap-2 min-h-[44px]"
            onClick={() => handleLinkClick(onSwitchToStudio)}
            title="Return to CreativeFX Studio"
          >
            CREATIVE<span className="text-[var(--fx-yellow)] font-bold">FX</span>
            <span className="text-[10px] font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase mt-1 hidden sm:inline-block">/ WEDDINGS</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full hidden sm:block" />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
            <button onClick={() => handleLinkClick(onNavigateToStories)} className="px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] text-white/70 hover:text-[var(--fx-yellow)] transition-all duration-300 uppercase cursor-pointer relative group">
              <span>STORIES</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full" />
            </button>
            <button onClick={() => handleLinkClick(onNavigateToTimeline)} className="px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] text-white/70 hover:text-[var(--fx-yellow)] transition-all duration-300 uppercase cursor-pointer relative group">
              <span>TIMELINE</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full" />
            </button>
            <button onClick={() => handleLinkClick(onNavigateToApproach)} className="px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] text-white/70 hover:text-[var(--fx-yellow)] transition-all duration-300 uppercase cursor-pointer relative group">
              <span>APPROACH</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full" />
            </button>

            <button 
              onClick={() => handleLinkClick(onInquire)} 
              className="ml-2 lg:ml-6 px-5 lg:px-6 py-2.5 border border-white/40 text-white text-xs sm:text-sm font-mono-tech tracking-[0.24em] font-semibold hover:bg-[var(--fx-yellow)] hover:border-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm cursor-pointer"
            >
              INQUIRE
            </button>
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[5px] z-[110] cursor-pointer rounded-md border border-white/15 bg-white/[0.06] backdrop-blur-md active:scale-95 transition-all"
            onClick={() => {
              soundEngine.playOpen();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-6'}`} />
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 w-0' : 'w-4'}`} />
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-6'}`} />
          </button>
        </div>
      </header>

      {/* BACKDROP */}
      <div 
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* DRAWER */}
      <div 
        className={`fixed inset-y-0 right-0 w-[88%] max-w-[340px] bg-[#0a0a0a] z-[95] md:hidden flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[-20px_0_60px_rgba(0,0,0,0.6)] border-l border-white/10 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Wedding navigation"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <span className="text-lg font-editorial tracking-[0.14em] text-white uppercase">CREATIVE<span className="text-[var(--fx-yellow)]">FX</span> <span className="text-[10px] tracking-[0.2em] text-white/50">/ WEDDINGS</span></span>
          <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
          <button onClick={() => handleLinkClick(onNavigateToStories)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10">
            <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase">STORIES</span>
            <span className="text-white/30">›</span>
          </button>
          <button onClick={() => handleLinkClick(onNavigateToTimeline)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10">
            <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase">TIMELINE</span>
            <span className="text-white/30">›</span>
          </button>
          <button onClick={() => handleLinkClick(onNavigateToApproach)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10">
            <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase">APPROACH</span>
            <span className="text-white/30">›</span>
          </button>
          <button onClick={() => handleLinkClick(onSwitchToStudio)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10">
            <span className="text-[15px] font-mono-tech tracking-[0.2em] text-[var(--fx-yellow)] uppercase">MAIN STUDIO</span>
            <span className="text-[var(--fx-yellow)]/60">›</span>
          </button>
          <button onClick={() => handleLinkClick(onInquire)} className="mt-6 w-full bg-[var(--fx-yellow)] text-black font-mono-tech text-sm tracking-[0.18em] font-bold uppercase py-4 rounded-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            INQUIRE NOW <span>→</span>
          </button>

          <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-3">
            <p className="text-[11px] font-mono-tech tracking-widest text-white/30 uppercase text-center">WEDDINGS BY CREATIVEFX</p>
            <p className="text-xs font-tech text-white/50 text-center leading-relaxed">Cinematic wedding photography & films — capturing timeless love stories across Sri Lanka.</p>
          </div>
        </nav>
      </div>
    </>
  );
};
