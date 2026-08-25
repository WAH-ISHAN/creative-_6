import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface WeddingFooterProps {
  onNavigateToStories: () => void;
  onNavigateToTimeline: () => void;
  onNavigateToApproach: () => void;
  onSwitchToStudio: () => void;
  onInquire: () => void;
}

export const WeddingFooter: React.FC<WeddingFooterProps> = ({
  onNavigateToStories,
  onNavigateToTimeline,
  onNavigateToApproach,
  onSwitchToStudio,
  onInquire,
}) => {
  return (
    <footer className="w-full bg-[var(--fx-black)] text-[var(--fx-white)] border-t border-white/10 py-16 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-16 select-none">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-14 sm:gap-20">
        
        {/* Top Row: Brand logotype + Core Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/10 pb-14">
          
          {/* Brand Info */}
          <div>
            <span className="font-editorial font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-white block mb-3">
              CREATIVEFX
            </span>
            <div className="text-xs sm:text-sm md:text-base font-mono-tech tracking-[0.28em] text-[var(--fx-yellow)] uppercase flex flex-col gap-1 font-bold">
              <span>WEDDING STORIES</span>
              <span className="text-white/60">PHOTOGRAPHY & CINEMATOGRAPHY</span>
            </div>
          </div>

          {/* Quick Nav links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm sm:text-base md:text-lg font-mono-tech font-bold tracking-[0.2em] uppercase text-white/80">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onNavigateToStories();
              }}
              className="hover:text-[var(--fx-yellow)] transition-colors cursor-pointer"
            >
              STORIES
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onNavigateToTimeline();
              }}
              className="hover:text-[var(--fx-yellow)] transition-colors cursor-pointer"
            >
              TIMELINE
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onNavigateToApproach();
              }}
              className="hover:text-[var(--fx-yellow)] transition-colors cursor-pointer"
            >
              APPROACH
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onInquire();
              }}
              className="text-[var(--fx-yellow)] hover:text-white transition-colors cursor-pointer underline underline-offset-4"
            >
              INQUIRE
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSwitchToStudio();
              }}
              className="hover:text-[var(--fx-yellow)] transition-colors cursor-pointer flex items-center gap-1.5 text-white/90"
            >
              <span>MAIN STUDIO</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Metadata & Legal Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-xs sm:text-sm font-mono-tech tracking-widest text-white/70 uppercase font-semibold">
          
          <div>
            <span>© CREATIVEFX 2026 — ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-8">
            <span className="hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">TERMS OF SERVICE</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/40">FOLLOW</span>
            <a href="https://instagram.com/creativefx.lk" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[var(--fx-yellow)] transition-colors font-bold">
              IG
            </a>
            <span className="text-white/30">|</span>
            <a href="https://facebook.com/creativefx.lk" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[var(--fx-yellow)] transition-colors font-bold">
              FB
            </a>
            <span className="text-white/30">|</span>
            <a href="https://tiktok.com/@creativefx.lk" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[var(--fx-yellow)] transition-colors font-bold">
              TT
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};
