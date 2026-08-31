import React from 'react';
import { useContent, useSectionStyle } from '../context/ContentContext';
import { resetGlobalScroll, smoothScrollTo } from '../utils/scrollManager';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateWorks?: () => void;
  onNavigateServices?: () => void;
  onNavigateWeddings?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateWorks,
  onNavigateServices,
  onNavigateWeddings: _onNavigateWeddings,
  onNavigateSection,
}) => {
  const { content } = useContent();
  const sec = useSectionStyle('footer');
  const contact = { ...content.contact };
  const tagline = content.footer?.tagline || "LET'S CREATE WHAT PEOPLE REMEMBER.";
  const copyright = content.footer?.copyright || 'CREATIVEFX STUDIO. ALL RIGHTS RESERVED.';

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new Event('hashchange'));
      resetGlobalScroll();
    }
  };

  const handleServicesLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateServices) {
      onNavigateServices();
    } else {
      window.history.pushState(null, '', '/#!view=services');
      window.dispatchEvent(new Event('hashchange'));
      resetGlobalScroll();
    }
  };

  const handleSectionLink = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection(sectionId);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      smoothScrollTo(el);
    } else {
      window.history.pushState(null, '', `/#${sectionId}`);
      window.dispatchEvent(new Event('popstate'));
      resetGlobalScroll();
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) smoothScrollTo(target);
      }, 150);
    }
  };

  const handleWorksLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateWorks) {
      onNavigateWorks();
    } else {
      window.history.pushState(null, '', '/#!view=works');
      window.dispatchEvent(new Event('hashchange'));
      resetGlobalScroll();
    }
  };

  return (
    <footer style={sec.style} className="w-full bg-[#050505] text-white py-10 sm:py-10 md:py-20 px-4 sm:px-4 md:px-8 md:px-12 lg:px-4 md:px-16 select-none border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12 md:flex-row md:justify-between md:items-start md:gap-16">
        
        {/* Left: Brand */}
        <div className="flex flex-col gap-4 max-w-md">
          <button 
            type="button"
            onClick={handleLogoClick}
            className="text-left cursor-pointer group focus:outline-none w-fit"
            aria-label="CreativeFX Home"
          >
            <span className="text-[28px] sm:text-2xl md:text-4xl font-editorial tracking-[0.08em] uppercase text-white group-hover:text-[var(--fx-yellow)] transition-colors">
              CREATIVE<span className="text-[var(--fx-yellow)] font-bold">FX</span>
            </span>
          </button>
          <p className="text-[13px] sm:text-base font-tech tracking-wide text-white/60 sm:text-gray-300 uppercase leading-relaxed whitespace-pre-line font-medium">
            {tagline}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-2.5 mt-1 sm:mt-2">
            <a 
              href={contact.instagram || 'https://instagram.com/creativefx.lk'} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="px-3 py-3 sm:px-3.5 sm:py-1.5 bg-white/[0.06] sm:bg-white/5 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/10 rounded-lg sm:rounded-sm text-[11px] sm:text-sm font-mono-tech tracking-widest text-white/70 sm:text-gray-300 transition-all uppercase text-center font-semibold min-h-[44px] flex items-center justify-center"
            >
              INSTAGRAM
            </a>
            <a 
              href={contact.facebook || 'https://facebook.com/creativefx.lk'} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              className="px-3 py-3 sm:px-3.5 sm:py-1.5 bg-white/[0.06] sm:bg-white/5 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/10 rounded-lg sm:rounded-sm text-[11px] sm:text-sm font-mono-tech tracking-widest text-white/70 sm:text-gray-300 transition-all uppercase text-center font-semibold min-h-[44px] flex items-center justify-center"
            >
              FACEBOOK
            </a>
            <a 
              href={contact.tiktok || 'https://tiktok.com/@creativefx.lk'} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok" 
              className="px-3 py-3 sm:px-3.5 sm:py-1.5 bg-white/[0.06] sm:bg-white/5 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/10 rounded-lg sm:rounded-sm text-[11px] sm:text-sm font-mono-tech tracking-widest text-white/70 sm:text-gray-300 transition-all uppercase text-center font-semibold min-h-[44px] flex items-center justify-center"
            >
              TIKTOK
            </a>
            <a 
              href={`https://wa.me/${(contact.whatsapp || '94777548671').replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp" 
              className="px-3 py-3 sm:px-3.5 sm:py-1.5 bg-[#25D366] hover:bg-[#20b858] text-black border border-[#25D366] rounded-lg sm:rounded-sm text-[11px] sm:text-sm font-mono-tech tracking-widest transition-all uppercase font-bold text-center min-h-[44px] flex items-center justify-center"
            >
              WHATSAPP
            </a>
          </div>
        </div>

        {/* Right: Links - 2 columns on mobile with larger tap targets */}
        <div className="flex gap-8 sm:gap-14 md:gap-24 font-tech tracking-wider w-full md:w-auto">
          <div className="flex-1 sm:flex-none flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] sm:text-sm font-mono-tech tracking-[0.2em] text-[var(--fx-yellow)] font-bold uppercase">SERVICES</span>
            <button 
              type="button"
              onClick={handleWorksLink}
              className="text-left text-[14px] sm:text-base text-white/60 sm:text-gray-300 hover:text-[var(--fx-yellow)] transition-colors cursor-pointer min-h-[32px] sm:min-h-0 flex items-center"
            >
              Portfolio
            </button>
            <button 
              type="button"
              onClick={handleServicesLink}
              className="text-left text-[14px] sm:text-base text-white/60 sm:text-gray-300 hover:text-[var(--fx-yellow)] transition-colors cursor-pointer min-h-[32px] sm:min-h-0 flex items-center"
            >
              Services
            </button>
            <button 
              type="button"
              onClick={(e) => handleSectionLink(e, 'section-about')}
              className="text-left text-[14px] sm:text-base text-white/60 sm:text-gray-300 hover:text-[var(--fx-yellow)] transition-colors cursor-pointer min-h-[32px] sm:min-h-0 flex items-center"
            >
              About
            </button>
            <button 
              type="button"
              onClick={(e) => handleSectionLink(e, 'section-contact')}
              className="sm:hidden text-left text-[14px] text-white/60 hover:text-[var(--fx-yellow)] transition-colors cursor-pointer min-h-[32px] flex items-center"
            >
              Contact
            </button>
          </div>
          <div className="flex-1 sm:flex-none flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] sm:text-sm font-mono-tech tracking-[0.2em] text-[var(--fx-yellow)] font-bold uppercase">CONNECT</span>
            <a href={contact.instagram || 'https://instagram.com/creativefx.lk'} target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-base text-white/60 sm:text-gray-300 hover:text-[var(--fx-yellow)] transition-colors min-h-[32px] sm:min-h-0 flex items-center">Instagram</a>
            <a href={contact.facebook || 'https://facebook.com/creativefx.lk'} target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-base text-white/60 sm:text-gray-300 hover:text-[var(--fx-yellow)] transition-colors min-h-[32px] sm:min-h-0 flex items-center">Facebook</a>
            <button 
              type="button"
              onClick={(e) => handleSectionLink(e, 'section-contact')}
              className="hidden sm:flex text-left text-sm sm:text-base text-gray-300 hover:text-[var(--fx-yellow)] transition-colors cursor-pointer min-h-[32px] sm:min-h-0 items-center"
            >
              Contact
            </button>
            <a href={`mailto:${contact.email||'hello@creativefx.lk'}`} className="sm:hidden text-[14px] text-white/60 hover:text-[var(--fx-yellow)] transition-colors min-h-[32px] flex items-center break-all">Email Us</a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-[11px] sm:text-sm font-mono-tech tracking-[0.14em] sm:tracking-[0.2em] text-white/30 sm:text-gray-400 uppercase text-center sm:text-left">
        <p className="order-2 sm:order-1">&copy; {new Date().getFullYear()} {copyright}</p>
        <a href={`tel:${(contact.phone || '+94 77 754 8671').replace(/\s/g, '')}`} className="order-1 sm:order-2 text-white hover:text-[var(--fx-yellow)] font-semibold transition-colors bg-white/[0.06] sm:bg-transparent border sm:border-0 border-white/10 rounded-full sm:rounded-none py-2.5 sm:py-0 flex items-center justify-center sm:justify-start gap-2">
          <span className="sm:hidden w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> {contact.phone || '+94 77 754 8671'}
        </a>
      </div>
    </footer>
  );
};

