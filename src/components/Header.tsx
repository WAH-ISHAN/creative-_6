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

  const nav = content.nav || {};
  const settings = content.settings || {};
  const theme = content.theme || {};

  const navLabels = {
    work: nav.work || 'PORTFOLIO',
    services: nav.services || 'SERVICES',
    weddings: nav.weddings || 'WEDDINGS',
    about: nav.about || 'ABOUT',
    cta: nav.cta || 'INQUIRE',
    ctaUrl: nav.ctaUrl || '#section-contact',
  };

  const showWorks = (nav.showWork ?? true) && (settings.showWorks ?? true);
  const showServices = nav.showServices ?? true;
  const showWeddings = (nav.showWeddings ?? true) && (settings.showWeddings ?? true);
  const showAbout = nav.showAbout ?? true;
  const showCta = nav.showCta ?? true;
  const customLinks = Array.isArray(nav.customLinks) ? nav.customLinks : [];

  const announcementEnabled = settings.announcementEnabled ?? false;
  const announcementText = settings.announcementText || '';
  const announcementUrl = settings.announcementUrl || '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (navLabels.ctaUrl?.startsWith('#')) {
      const targetId = navLabels.ctaUrl.replace('#', '');
      scrollToSection(targetId, onOpenContact);
    } else if (navLabels.ctaUrl?.startsWith('http')) {
      window.open(navLabels.ctaUrl, '_blank', 'noopener,noreferrer');
    } else if (navLabels.ctaUrl) {
      window.location.href = navLabels.ctaUrl;
    } else if (onOpenContact) {
      onOpenContact();
    } else {
      scrollToSection('section-contact');
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
        <div className="absolute top-0 left-0 w-full bg-[var(--fx-yellow)] text-black text-center py-1.5 px-4 text-[10px] font-mono-tech tracking-[0.2em] uppercase overflow-hidden whitespace-nowrap z-50">
          {announcementUrl ? (
            <a href={announcementUrl} className="hover:underline font-bold">
              {announcementText} →
            </a>
          ) : (
            <span>{announcementText}</span>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* BRAND TITLE / LOGO */}
        <div 
          className="cursor-pointer select-none relative group flex items-center flex-shrink-0"
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
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 xl:gap-10 flex-shrink-0">
          {showWorks && (
            <button 
              onClick={() => scrollToSection('section-portfolio', onOpenWork)} 
              className={`px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] ${
                activeView === 'work' || activeView === 'works' ? 'text-[var(--fx-yellow)]' : 'text-[var(--fx-light-gray)] hover:text-[var(--fx-yellow)]'
              } transition-all duration-300 uppercase cursor-pointer relative group`}
            >
              <span>{navLabels.work}</span>
              <span className={`absolute -bottom-1 left-0 ${activeView === 'work' || activeView === 'works' ? 'w-full' : 'w-0'} h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full`} />
            </button>
          )}
          {showServices && (
            <button 
              onClick={() => scrollToSection('section-services', onOpenServices)} 
              className={`px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] ${
                activeView === 'services' ? 'text-[var(--fx-yellow)]' : 'text-[var(--fx-light-gray)] hover:text-[var(--fx-yellow)]'
              } transition-all duration-300 uppercase cursor-pointer relative group`}
            >
              <span>{navLabels.services}</span>
              <span className={`absolute -bottom-1 left-0 ${activeView === 'services' ? 'w-full' : 'w-0'} h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full`} />
            </button>
          )}
          {showWeddings && (
            <button 
              onClick={() => scrollToSection('weddings', onOpenWeddings)} 
              className={`px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] ${
                activeView === 'weddings' ? 'text-[var(--fx-yellow)]' : 'text-[var(--fx-light-gray)] hover:text-[var(--fx-yellow)]'
              } transition-all duration-300 uppercase cursor-pointer relative group`}
            >
              <span>{navLabels.weddings}</span>
              <span className={`absolute -bottom-1 left-0 ${activeView === 'weddings' ? 'w-full' : 'w-0'} h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full`} />
            </button>
          )}
          {showAbout && (
            <button 
              onClick={() => scrollToSection('section-about', onOpenAbout)} 
              className={`px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] ${
                activeView === 'about' ? 'text-[var(--fx-yellow)]' : 'text-[var(--fx-light-gray)] hover:text-[var(--fx-yellow)]'
              } transition-all duration-300 uppercase cursor-pointer relative group`}
            >
              <span>{navLabels.about}</span>
              <span className={`absolute -bottom-1 left-0 ${activeView === 'about' ? 'w-full' : 'w-0'} h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full`} />
            </button>
          )}

          {/* Custom user links */}
          {customLinks.filter(l => l.active !== false).map(l => (
            <a
              key={l.id}
              href={l.url}
              target={l.isExternal ? '_blank' : '_self'}
              rel={l.isExternal ? 'noopener noreferrer' : undefined}
              className="px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] text-[var(--fx-light-gray)] hover:text-[var(--fx-yellow)] transition-all duration-300 uppercase cursor-pointer relative group"
            >
              <span>{l.label}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          {showCta && (
            <button
              onClick={handleCtaClick}
              className="ml-4 lg:ml-6 px-6 py-2 border border-white/60 text-white text-xs sm:text-sm font-mono-tech tracking-[0.24em] font-semibold hover:bg-[var(--fx-yellow)] hover:border-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm cursor-pointer shadow-sm"
            >
              {navLabels.cta}
            </button>
          )}
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
        <div className="flex flex-col items-center gap-6 w-full px-6 overflow-y-auto max-h-[85vh]">
          {showWorks && (
            <button onClick={() => scrollToSection('section-portfolio', onOpenWork)} className="text-2xl font-editorial tracking-widest text-white uppercase w-full text-center py-3 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.work}</button>
          )}
          {showServices && (
            <button onClick={() => scrollToSection('section-services', onOpenServices)} className="text-2xl font-editorial tracking-widest text-white uppercase w-full text-center py-3 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.services}</button>
          )}
          {showWeddings && (
            <button onClick={() => scrollToSection('weddings', onOpenWeddings)} className="text-2xl font-editorial tracking-widest text-white uppercase w-full text-center py-3 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.weddings}</button>
          )}
          {showAbout && (
            <button onClick={() => scrollToSection('section-about', onOpenAbout)} className="text-2xl font-editorial tracking-widest text-white uppercase w-full text-center py-3 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer">{navLabels.about}</button>
          )}
          {customLinks.filter(l => l.active !== false).map(l => (
            <a
              key={l.id}
              href={l.url}
              target={l.isExternal ? '_blank' : '_self'}
              className="text-2xl font-editorial tracking-widest text-white uppercase w-full text-center py-3 border-b border-[var(--fx-border-dark)] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          {showCta && (
            <button onClick={handleCtaClick} className="text-2xl font-editorial tracking-widest text-[var(--fx-yellow)] uppercase w-full text-center py-3 border-b border-[var(--fx-border-dark)] hover:text-white transition-colors cursor-pointer">{navLabels.cta}</button>
          )}
        </div>
      </div>
    </header>
  );
};
