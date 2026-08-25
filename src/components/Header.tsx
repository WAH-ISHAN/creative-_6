import React, { useState, useEffect } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import { useContent } from '../context/ContentContext';

interface HeaderProps {
  activeView?: string;
  onOpenWork?: () => void;
  onOpenServices?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenWeddings?: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onOpenWork,
  onOpenServices,
  onOpenAbout,
  onOpenContact,
  onOpenWeddings,
  onLogoClick
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useContent();

  // Admin-managed navigation labels & visibility (fall back to brand defaults)
  const navLabels = {
    work: content.nav?.work || 'PORTFOLIO',
    services: content.nav?.services || 'SERVICES',
    weddings: content.nav?.weddings || 'WEDDINGS',
    about: content.nav?.about || 'ABOUT',
    cta: content.nav?.cta || 'INQUIRE',
  };
  const showWeddings = content.settings?.showWeddings ?? true;
  const showWorks = content.settings?.showWorks ?? true;
  const announcementEnabled = content.settings?.announcementEnabled ?? false;
  const announcementText = content.settings?.announcementText || '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, callback?: () => void) => {
    setMobileMenuOpen(false);
    if (callback) {
      callback();
    } else {
      const element = document.getElementById(id);
      if (element) {
        smoothScrollTo(element);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-[var(--fx-black)]/90 backdrop-blur-md border-b border-[var(--fx-border-dark)] py-4 shadow-sm' 
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      {/* Announcement Bar */}
      {announcementEnabled && announcementText && (
        <div className="absolute top-0 left-0 w-full bg-[var(--fx-yellow)] text-black text-center py-1.5 px-4 text-[10px] font-mono-tech tracking-[0.2em] uppercase overflow-hidden whitespace-nowrap">
          {announcementText}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* BRAND TITLE / LOGO */}
        <div 
          className="cursor-pointer select-none relative group flex items-center"
          onClick={() => {
            if (onLogoClick) onLogoClick();
            else scrollToSection('hero');
          }}
        >
          <span className="text-xl sm:text-2xl font-editorial font-normal tracking-[0.14em] text-[var(--fx-white)] uppercase transition-transform duration-300 group-hover:scale-[1.02]">
            CREATIVE<span className="text-[var(--fx-yellow)] font-bold">FX</span>
          </span>
          <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full" />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {showWorks && (
            <button 
              onClick={() => scrollToSection('section-portfolio', onOpenWork)} 
              className="px-3 xl:px-4 py-2 text-lg xl:text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm cursor-pointer"
            >
              {navLabels.work}
            </button>
          )}
          <button 
            onClick={() => scrollToSection('section-services', onOpenServices)} 
            className="px-3 xl:px-4 py-2 text-lg xl:text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm cursor-pointer"
          >
            {navLabels.services}
          </button>
          {showWeddings && (
            <button 
              onClick={() => scrollToSection('weddings', onOpenWeddings)} 
              className="px-3 xl:px-4 py-2 text-lg xl:text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm cursor-pointer"
            >
              {navLabels.weddings}
            </button>
          )}
          <button 
            onClick={() => scrollToSection('section-about', onOpenAbout)} 
            className="px-3 xl:px-4 py-2 text-lg xl:text-xl font-mono-tech tracking-widest text-[var(--fx-light-gray)] hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm cursor-pointer"
          >
            {navLabels.about}
          </button>
          
          <button
            onClick={() => scrollToSection('section-contact', onOpenContact)}
            className="ml-2 xl:ml-4 px-5 xl:px-8 py-2.5 border border-white text-white text-lg xl:text-xl font-mono-tech tracking-widest hover:bg-[var(--fx-yellow)] hover:border-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase cursor-pointer"
          >
            {navLabels.cta}
          </button>
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="md:hidden text-white w-8 h-8 flex flex-col items-end justify-center gap-[5px] z-[110] cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-8'}`} />
          <span className={`h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-6'}`} />
          <span className={`h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-4'}`} />
        </button>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <div 
        className={`fixed inset-0 bg-[var(--fx-black)] z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-center items-center ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col items-center gap-8 w-full px-6">
          {showWorks && (
            <button onClick={() => scrollToSection('section-portfolio', onOpenWork)} className="text-3xl font-editorial tracking-widest text-white uppercase w-full text-center py-4 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.work}</button>
          )}
          <button onClick={() => scrollToSection('section-services', onOpenServices)} className="text-3xl font-editorial tracking-widest text-white uppercase w-full text-center py-4 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.services}</button>
          {showWeddings && (
            <button onClick={() => scrollToSection('weddings', onOpenWeddings)} className="text-3xl font-editorial tracking-widest text-white uppercase w-full text-center py-4 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.weddings}</button>
          )}
          <button onClick={() => scrollToSection('section-about', onOpenAbout)} className="text-3xl font-editorial tracking-widest text-white uppercase w-full text-center py-4 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.about}</button>
          <button onClick={() => scrollToSection('section-contact', onOpenContact)} className="text-3xl font-editorial tracking-widest text-[var(--fx-yellow)] uppercase w-full text-center py-4 border-b border-[var(--fx-border-dark)] hover:text-white transition-colors cursor-pointer">{navLabels.cta}</button>
        </div>
      </div>
    </header>
  );
};
