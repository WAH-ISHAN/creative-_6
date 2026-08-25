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
      window.dispatchEvent(new Event('popstate'));
      resetGlobalScroll();
    }
  };

  const handleServicesLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateServices) {
      onNavigateServices();
    } else {
      window.history.pushState(null, '', '/services');
      window.dispatchEvent(new Event('popstate'));
      resetGlobalScroll();
    }
  };

  const handleSectionLink = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection(sectionId);
      return;
    }

    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
    const el = document.getElementById(sectionId);

    if (isHomePage && el) {
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
      window.history.pushState(null, '', '/works');
      window.dispatchEvent(new Event('popstate'));
      resetGlobalScroll();
    }
  };

  return (
    <footer style={sec.style} className="w-full bg-[#050505] text-[var(--fx-white)] py-14 sm:py-20 px-6 sm:px-8 md:px-12 lg:px-16 select-none border-t border-[var(--fx-border-dark)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
        
        {/* Left: Brand */}
        <div className="flex flex-col gap-4 max-w-md">
          <button 
            type="button"
            onClick={handleLogoClick}
            className="text-left cursor-pointer group focus:outline-none w-fit"
            aria-label="CreativeFX Home"
          >
            <span className="text-3xl sm:text-4xl font-editorial tracking-[0.08em] uppercase text-[var(--fx-white)] group-hover:text-[var(--fx-yellow)] transition-colors">
              CREATIVE<span className="text-[var(--fx-yellow)] font-bold">FX</span>
            </span>
          </button>
          <p className="text-sm sm:text-base font-tech tracking-wide text-gray-300 uppercase leading-relaxed whitespace-pre-line font-medium">
            {tagline}
          </p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <a 
              href={contact.instagram || 'https://instagram.com/creativefx.lk'} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="px-3.5 py-1.5 bg-white/5 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/10 rounded-sm text-xs sm:text-sm font-mono-tech tracking-widest text-gray-300 transition-all uppercase"
            >
              INSTAGRAM
            </a>
            <a 
              href={contact.facebook || 'https://facebook.com/creativefx.lk'} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              className="px-3.5 py-1.5 bg-white/5 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/10 rounded-sm text-xs sm:text-sm font-mono-tech tracking-widest text-gray-300 transition-all uppercase"
            >
              FACEBOOK
            </a>
            <a 
              href={contact.tiktok || 'https://tiktok.com/@creativefx.lk'} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok" 
              className="px-3.5 py-1.5 bg-white/5 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/10 rounded-sm text-xs sm:text-sm font-mono-tech tracking-widest text-gray-300 transition-all uppercase"
            >
              TIKTOK
            </a>
            <a 
              href={`https://wa.me/${(contact.whatsapp || '94777548671').replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp" 
              className="px-3.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-black border border-[#25D366]/30 rounded-sm text-xs sm:text-sm font-mono-tech tracking-widest text-[#25D366] transition-all uppercase font-semibold"
            >
              WHATSAPP
            </a>
          </div>
        </div>

        {/* Right: Links */}
        <div className="flex gap-14 sm:gap-24 font-tech tracking-wider">
          <div className="flex flex-col gap-4">
            <span className="text-xs sm:text-sm font-mono-tech tracking-[0.2em] text-[var(--fx-yellow)] font-bold uppercase">SERVICES</span>
            <button 
              type="button"
              onClick={handleWorksLink}
              className="text-left text-sm sm:text-base text-gray-300 hover:text-[var(--fx-yellow)] hover:translate-x-1 transition-all cursor-pointer"
            >
              Portfolio
            </button>
            <button 
              type="button"
              onClick={handleServicesLink}
              className="text-left text-sm sm:text-base text-gray-300 hover:text-[var(--fx-yellow)] hover:translate-x-1 transition-all cursor-pointer"
            >
              Services
            </button>
            <button 
              type="button"
              onClick={(e) => handleSectionLink(e, 'section-about')}
              className="text-left text-sm sm:text-base text-gray-300 hover:text-[var(--fx-yellow)] hover:translate-x-1 transition-all cursor-pointer"
            >
              About
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs sm:text-sm font-mono-tech tracking-[0.2em] text-[var(--fx-yellow)] font-bold uppercase">CONNECT</span>
            <a href={contact.instagram || 'https://instagram.com/creativefx.lk'} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-300 hover:text-[var(--fx-yellow)] hover:translate-x-1 transition-all">Instagram</a>
            <a href={contact.facebook || 'https://facebook.com/creativefx.lk'} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-300 hover:text-[var(--fx-yellow)] hover:translate-x-1 transition-all">Facebook</a>
            <button 
              type="button"
              onClick={(e) => handleSectionLink(e, 'section-contact')}
              className="text-left text-sm sm:text-base text-gray-300 hover:text-[var(--fx-yellow)] hover:translate-x-1 transition-all cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-[var(--fx-border-dark)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm font-mono-tech tracking-[0.2em] text-gray-400 uppercase">
        <p>&copy; {new Date().getFullYear()} {copyright}</p>
        <a href={`tel:${(contact.phone || '+94 77 754 8671').replace(/\s/g, '')}`} className="text-white hover:text-[var(--fx-yellow)] font-semibold transition-colors">
          {contact.phone || '+94 77 754 8671'}
        </a>
      </div>
    </footer>
  );
};
