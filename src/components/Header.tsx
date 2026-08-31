import React, { useState, useEffect } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import { useContent } from '../context/ContentContext';
import { X } from 'lucide-react';

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
  const contact = content.contact || {};

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
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open + handle Escape
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
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-out ${
          scrolled 
            ? 'bg-[var(--fx-black)]/95 backdrop-blur-xl border-b border-white/10 py-3 sm:py-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
            : 'bg-gradient-to-b from-black/40 to-transparent border-b border-transparent py-4 sm:py-6'
        }`}
        style={announcementEnabled && announcementText ? { top: '28px' } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 md:px-12 flex items-center justify-between gap-4">
          
          {/* BRAND TITLE / LOGO */}
          <div 
            className="cursor-pointer select-none relative group flex items-center flex-shrink-0 min-h-[44px] flex items-center"
            onClick={() => {
              if (onLogoClick) onLogoClick();
              else scrollToSection('hero');
            }}
          >
            <span className="text-[20px] sm:text-2xl font-editorial font-normal tracking-[0.14em] text-white uppercase transition-transform duration-300 group-hover:scale-[1.02]">
              CREATIVE<span className="text-[var(--fx-yellow)] font-bold">FX</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full hidden sm:block" />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 xl:gap-10 flex-shrink-0">
            {showWorks && (
              <button 
                onClick={() => scrollToSection('section-portfolio', onOpenWork)} 
                className={`px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] ${
                  activeView === 'work' || activeView === 'works' ? 'text-[var(--fx-yellow)]' : 'text-white/70 hover:text-[var(--fx-yellow)]'
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
                  activeView === 'services' ? 'text-[var(--fx-yellow)]' : 'text-white/70 hover:text-[var(--fx-yellow)]'
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
                  activeView === 'weddings' ? 'text-[var(--fx-yellow)]' : 'text-white/70 hover:text-[var(--fx-yellow)]'
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
                  activeView === 'about' ? 'text-[var(--fx-yellow)]' : 'text-white/70 hover:text-[var(--fx-yellow)]'
                } transition-all duration-300 uppercase cursor-pointer relative group`}
              >
                <span>{navLabels.about}</span>
                <span className={`absolute -bottom-1 left-0 ${activeView === 'about' ? 'w-full' : 'w-0'} h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full`} />
              </button>
            )}

            {customLinks.filter(l => l.active !== false).map(l => (
              <a
                key={l.id}
                href={l.url}
                target={l.isExternal ? '_blank' : '_self'}
                rel={l.isExternal ? 'noopener noreferrer' : undefined}
                className="px-2 py-1 text-xs sm:text-sm font-mono-tech tracking-[0.22em] text-white/70 hover:text-[var(--fx-yellow)] transition-all duration-300 uppercase cursor-pointer relative group"
              >
                <span>{l.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--fx-yellow)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            
            {showCta && (
              <button
                onClick={handleCtaClick}
                className="ml-2 lg:ml-6 px-5 lg:px-6 py-2.5 border border-white/50 text-white text-xs sm:text-sm font-mono-tech tracking-[0.22em] font-semibold hover:bg-[var(--fx-yellow)] hover:border-[var(--fx-yellow)] hover:text-black transition-all duration-300 uppercase rounded-sm cursor-pointer"
              >
                {navLabels.cta}
              </button>
            )}
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[5px] z-[110] cursor-pointer rounded-md border border-white/15 bg-white/[0.06] backdrop-blur-md active:scale-95 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-6'}`} />
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 w-0' : 'w-4'}`} />
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-6'}`} />
          </button>
        </div>
      </header>

      {/* Announcement Bar - fixed */}
      {announcementEnabled && announcementText && (
        <div className="fixed top-0 left-0 w-full bg-[var(--fx-yellow)] text-black text-center py-2 px-4 text-[11px] sm:text-xs font-mono-tech tracking-[0.18em] uppercase overflow-hidden whitespace-nowrap z-[101] font-semibold">
          {announcementUrl ? (
            <a href={announcementUrl} className="hover:underline font-bold inline-flex items-center gap-1">
              <span className="truncate">{announcementText}</span> <span>→</span>
            </a>
          ) : (
            <span className="truncate block">{announcementText}</span>
          )}
        </div>
      )}

      {/* MOBILE NAV OVERLAY BACKDROP */}
      <div 
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* MOBILE NAV DRAWER */}
      <div 
        className={`fixed inset-y-0 right-0 w-[88%] max-w-[340px] bg-[#0a0a0a] z-[95] md:hidden flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[ -20px_0_60px_rgba(0,0,0,0.6)] border-l border-white/10 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <span className="text-lg font-editorial tracking-[0.14em] text-white uppercase">CREATIVE<span className="text-[var(--fx-yellow)]">FX</span></span>
          <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 flex flex-col gap-1">
          {showWorks && (
            <button onClick={() => scrollToSection('section-portfolio', onOpenWork)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10 group">
              <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase group-active:text-[var(--fx-yellow)]">{navLabels.work}</span>
              <span className="text-white/30 group-hover:text-white transition-colors">›</span>
            </button>
          )}
          {showServices && (
            <button onClick={() => scrollToSection('section-services', onOpenServices)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10 group">
              <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase group-active:text-[var(--fx-yellow)]">{navLabels.services}</span>
              <span className="text-white/30">›</span>
            </button>
          )}
          {showWeddings && (
            <button onClick={() => scrollToSection('weddings', onOpenWeddings)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10 group">
              <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase group-active:text-[var(--fx-yellow)]">{navLabels.weddings}</span>
              <span className="text-white/30">›</span>
            </button>
          )}
          {showAbout && (
            <button onClick={() => scrollToSection('section-about', onOpenAbout)} className="flex items-center justify-between w-full text-left py-4 border-b border-white/10 group">
              <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase group-active:text-[var(--fx-yellow)]">{navLabels.about}</span>
              <span className="text-white/30">›</span>
            </button>
          )}
          {customLinks.filter(l => l.active !== false).map(l => (
            <a
              key={l.id}
              href={l.url}
              target={l.isExternal ? '_blank' : '_self'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between w-full text-left py-4 border-b border-white/10"
            >
              <span className="text-[15px] font-mono-tech tracking-[0.2em] text-white uppercase">{l.label}</span>
              <span className="text-white/30">›</span>
            </a>
          ))}

          {showCta && (
            <button onClick={handleCtaClick} className="mt-6 w-full bg-[var(--fx-yellow)] text-black font-mono-tech text-sm tracking-[0.18em] font-bold uppercase py-4 rounded-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              {navLabels.cta} <span>→</span>
            </button>
          )}

          <div className="mt-auto pt-8 space-y-4">
            <div className="h-px bg-white/10" />
            <div className="space-y-2">
              <a href={`tel:${(contact.phone||'+94777548671').replace(/\s/g,'')}`} className="flex items-center gap-3 text-sm font-tech text-white/70 hover:text-white">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">☎</span>
                <span>{contact.phone || '+94 77 754 8671'}</span>
              </a>
              <a href={`mailto:${contact.email||'hello@creativefx.lk'}`} className="flex items-center gap-3 text-sm font-tech text-white/70 hover:text-white">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">✉</span>
                <span>{contact.email || 'hello@creativefx.lk'}</span>
              </a>
            </div>
            <div className="flex gap-2 pt-2">
              <a href={contact.instagram||'https://instagram.com/creativefx.lk'} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-white/10 border border-white/15 rounded-sm text-[11px] font-mono-tech tracking-widest text-white text-center uppercase">IG</a>
              <a href={contact.facebook||'https://facebook.com/creativefx.lk'} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-white/10 border border-white/15 rounded-sm text-[11px] font-mono-tech tracking-widest text-white text-center uppercase">FB</a>
              <a href={`https://wa.me/${(contact.whatsapp||'94777548671').replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-[#25D366] text-black rounded-sm text-[11px] font-mono-tech tracking-widest font-bold text-center uppercase">WA</a>
            </div>
            <p className="text-[10px] font-mono-tech tracking-widest text-white/30 uppercase text-center pt-2">© {new Date().getFullYear()} CreativeFX Studio</p>
          </div>
        </div>
      </div>
    </>
  );
};

