import React, { useState, useEffect } from 'react';
import { smoothScrollTo, resetGlobalScroll, initScrollRestoration } from './utils/scrollManager';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntroductionSection } from './components/IntroductionSection';
import { FeaturedWorkSection } from './components/FeaturedWorkSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { PageLoader } from './components/PageLoader';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { WeddingExperiencePage } from './components/weddings/WeddingExperiencePage';
import { WorksPage } from './components/WorksPage';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { AgencyService } from './types';
import { soundEngine } from './utils/audio';
import { useScrollReveal } from './utils/useScrollReveal';
import { useScrollEffects } from './utils/useScrollEffects';
import { ContentProvider, useContent } from './context/ContentContext';
import { AdminPanel } from './admin/AdminPanel';
import { AdminLogin } from './admin/AdminLogin';
import { TextSizeControl } from './components/TextSizeControl';

type View = 'studio' | 'weddings' | 'works' | 'project';

function parsePath(pathname: string): { view: View; slug: string | null; worksFilter: string | null } {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';

  if (path === '/admin') return { view: 'studio', slug: null, worksFilter: null };

  // Hash-based project routing (#project-slug)
  if (hash && hash.startsWith('#project-')) {
    const slug = hash.replace('#project-', '').trim();
    if (slug) return { view: 'project', slug, worksFilter: null };
  }

  // Path-based project routing (/works/slug or /projects/slug)
  if (path.startsWith('/works/') || path.startsWith('/projects/')) {
    const slug = path.replace('/works/', '').replace('/projects/', '').trim();
    if (slug) return { view: 'project', slug: slug || null, worksFilter: null };
  }

  if (path.includes('wedding')) return { view: 'weddings', slug: null, worksFilter: null };

  if (path === '/works' || path === '/projects' || path.startsWith('/works') || path.startsWith('/projects')) {
    const f = new URLSearchParams(window.location.search).get('f');
    return { view: 'works', slug: null, worksFilter: f ? f.toUpperCase() : null };
  }

  // Category shortcuts → Works page with a preset filter
  if (/^\/(photography|photos)\b/.test(path)) return { view: 'works', slug: null, worksFilter: 'PHOTOGRAPHY' };
  if (/^\/(video|videos|cinema)\b/.test(path)) return { view: 'works', slug: null, worksFilter: 'VIDEO' };

  return { view: 'studio', slug: null, worksFilter: null };
}

function App() {
  useScrollReveal();
  const { content, isLoading } = useContent();
  const siteSettings = content.settings || {};

  const [loading, setLoading] = useState(true);

  // ─── Admin panel state ──────────────────────────────────────────────────────
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [currentView, setCurrentView] = useState<View>(() => parsePath(window.location.pathname).view);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(() => parsePath(window.location.pathname).slug);
  const [worksFilter, setWorksFilter] = useState<string | null>(() => parsePath(window.location.pathname).worksFilter);

  const [selectedService, setSelectedService] = useState<AgencyService | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'work' | 'services' | 'about' | 'contact' | 'weddings'>('home');

  // Recalculate ScrollTrigger positions once webfonts are ready
  useEffect(() => {
    let cancelled = false;
    const refresh = () => { if (!cancelled) ScrollTrigger.refresh(); };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    window.addEventListener('load', refresh);
    const t = window.setTimeout(refresh, 1200);
    return () => { cancelled = true; window.clearTimeout(t); window.removeEventListener('load', refresh); };
  }, []);

  // Open admin via URL param (?admin=1) or path (/admin)
  useEffect(() => {
    initScrollRestoration();
    const params = new URLSearchParams(window.location.search);
    const isPathAdmin = window.location.pathname.toLowerCase() === '/admin';
    if (params.get('admin') === '1' || isPathAdmin) {
      const token = sessionStorage.getItem('cfx_admin_token');
      if (token) setShowAdminPanel(true);
      else setShowAdminLogin(true);
    }
  }, []);

  // Handle URL history / browser back & forward
  useEffect(() => {
    const handleLocationChange = () => {
      const next = parsePath(window.location.pathname);
      setCurrentView(next.view);
      setSelectedProjectSlug(next.slug);
      setWorksFilter(next.worksFilter);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useScrollEffects([currentView]);

  // Scroll spy to update header active link (when in studio view)
  useEffect(() => {
    if (currentView !== 'studio') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const contactEl = document.getElementById('section-contact');
      const aboutEl = document.getElementById('section-about');
      const servicesEl = document.getElementById('section-services');
      const portfolioEl = document.getElementById('section-portfolio');
      const featuredEl = document.getElementById('section-featured-work');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSection('contact');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveSection('about');
      } else if (servicesEl && scrollPos >= servicesEl.offsetTop) {
        setActiveSection('services');
      } else if (portfolioEl && scrollPos >= portfolioEl.offsetTop) {
        setActiveSection('work');
      } else if (featuredEl && scrollPos >= featuredEl.offsetTop) {
        setActiveSection('work');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // ─── Global Authoritative Scroll Restoration on Route Change ───────────────
  useEffect(() => {
    // If navigating to an anchor section hash on Home (e.g. /#section-contact)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#section-') && currentView === 'studio') {
      const targetId = hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => smoothScrollTo(el), 120);
        return;
      }
    }

    // Otherwise, every normal route navigation starts at the absolute top (0, 0)
    resetGlobalScroll();
  }, [currentView, selectedProjectSlug]);

  const scrollToSection = (sectionId: string) => {
    soundEngine.playClick();
    const el = document.getElementById(sectionId);
    if (el) {
      smoothScrollTo(el);
    }
  };

  const handleStartProject = () => {
    soundEngine.playOpen();
    if (currentView !== 'studio') {
      setCurrentView('studio');
      setSelectedProjectSlug(null);
      window.history.pushState(null, '', '/#section-contact');
      resetGlobalScroll();
      setTimeout(() => scrollToSection('section-contact'), 150);
    } else {
      scrollToSection('section-contact');
    }
  };

  const handleStartProjectForService = (_serviceName: string) => {
    setSelectedService(null);
    scrollToSection('section-contact');
  };

  const handleSwitchToWeddings = () => {
    soundEngine.playOpen();
    setCurrentView('weddings');
    setSelectedProjectSlug(null);
    window.history.pushState(null, '', '/weddings');
    resetGlobalScroll();
  };

  const handleSwitchToStudio = () => {
    soundEngine.playOpen();
    setCurrentView('studio');
    setSelectedProjectSlug(null);
    setWorksFilter(null);
    window.history.pushState(null, '', '/');
    resetGlobalScroll();
  };

  const handleSwitchToWorks = (filter?: string) => {
    soundEngine.playOpen();
    setCurrentView('works');
    setSelectedProjectSlug(null);
    setWorksFilter(filter ?? null);
    window.history.pushState(null, '', filter ? `/works?f=${filter.toLowerCase()}` : '/works');
    resetGlobalScroll();
  };

  const handleSelectProject = (project: any) => {
    soundEngine.playClick();
    const slug = typeof project === 'string' ? project : project.slug;
    setSelectedProjectSlug(slug);
    setCurrentView('project');
    window.history.pushState(null, '', `/works/${slug}`);
    resetGlobalScroll();
  };

  // ─── Maintenance mode: visitors see a notice, admins keep full access ───────
  // NOTE: rendered via early-return BELOW all hooks so React's hook order stays
  // stable when the setting flips at runtime (fixes hooks-order crash).
  const isAdminSession = typeof window !== 'undefined' && (
    sessionStorage.getItem('cfx_admin_token') ||
    new URLSearchParams(window.location.search).get('admin') === '1' ||
    window.location.pathname.toLowerCase() === '/admin'
  );
  const showMaintenance = !!siteSettings.maintenanceMode && !isAdminSession;

  return (
    <div className={`min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] relative`}>
      {/* Page Loader Initializer */}
      {loading && <PageLoader onComplete={() => setLoading(false)} />}

      {showMaintenance ? (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-4xl sm:text-5xl font-editorial uppercase tracking-tight leading-tight">
              We're updating<br />the studio.
            </h1>
            <p className="text-sm font-tech text-[var(--fx-gray)] mt-4 leading-relaxed">
              CreativeFX is being refreshed right now. Please check back shortly —
              or reach us at{' '}
              <a href={`tel:${(content.contact?.phone || '').replace(/\s/g, '')}`} className="text-[var(--fx-yellow)] hover:underline">
                {content.contact?.phone}
              </a>.
            </p>
          </div>
        </div>
      ) : currentView === 'weddings' ? (
        <WeddingExperiencePage onSwitchToStudio={handleSwitchToStudio} />
      ) : currentView === 'works' ? (
        <WorksPage
          key={worksFilter || 'all'}
          initialFilter={worksFilter}
          onSelectProject={handleSelectProject}
          onSwitchToStudio={handleSwitchToStudio}
          onSwitchToWeddings={handleSwitchToWeddings}
        />
      ) : currentView === 'project' && selectedProjectSlug ? (
        <ProjectDetailPage
          projectSlug={selectedProjectSlug}
          onBack={() => handleSwitchToWorks()}
          onSwitchToStudio={handleSwitchToStudio}
          onSwitchToWeddings={handleSwitchToWeddings}
          onStartProject={handleStartProject}
        />
      ) : (
        /* Main Commercial Studio Page */
        <>
          {!isLoading && (
            <>
              {/* Top Header Navigation */}
              <Header
                activeView={activeSection}
                onLogoClick={handleSwitchToStudio}
                onOpenWork={() => scrollToSection('section-featured-work')}
                onOpenServices={() => scrollToSection('section-services')}
                onOpenAbout={() => scrollToSection('section-about')}
                onOpenContact={() => scrollToSection('section-contact')}
                onOpenWeddings={handleSwitchToWeddings}
              />

              {/* Main Page Flow */}
              <main className="w-full">
                {/* 01 — HERO */}
                <HeroSection
                  onExploreWork={() => scrollToSection('section-featured-work')}
                  onStartProject={handleStartProject}
                  onOpenServices={() => scrollToSection('section-services')}
                />

                {/* 02 — STUDIO / INTRO */}
                <IntroductionSection />

                {/* 03 — FEATURED WORK */}
                <FeaturedWorkSection onSelectProject={handleSelectProject} />

                {/* 04 — SELECTED WORK */}
                <PortfolioSection
                  onSelectProject={handleSelectProject}
                  onViewAllWork={() => handleSwitchToWorks()}
                  onSwitchToWeddings={handleSwitchToWeddings}
                />

                {/* 05 — SERVICES / CAPABILITIES */}
                <ServicesSection
                  onSelectService={(service) => setSelectedService(service)}
                />

                {/* 06 — ABOUT / PHILOSOPHY */}
                <AboutSection />

                {/* FINAL COLLABORATION CTA */}
                <FinalCtaSection onStartProject={handleStartProject} />

                {/* 07 — CONTACT / PRODUCTION REQUEST */}
                <ContactSection />
              </main>

              {/* 08 — FOOTER */}
              <Footer
                onNavigateHome={handleSwitchToStudio}
                onNavigateWorks={() => handleSwitchToWorks()}
                onNavigateWeddings={handleSwitchToWeddings}
                onNavigateSection={(sectionId) => scrollToSection(sectionId)}
              />
            </>
          )}

          {/* Single Service Deep Dive Modal View */}
          {selectedService && (
            <ServiceDetailModal
              service={selectedService}
              onClose={() => setSelectedService(null)}
              onStartProjectForService={handleStartProjectForService}
            />
          )}

          {/* Back to Top */}
          <button
            onClick={() => smoothScrollTo(0)}
            aria-label="Back to top"
            title="Back to top"
            className="fixed bottom-6 right-5 z-50 w-11 h-11 bg-[var(--fx-yellow)] text-black flex items-center justify-center text-lg font-bold shadow-lg hover:bg-white transition-colors rounded-sm cursor-pointer"
          >
            ↑
          </button>

          {/* Secret Admin Trigger — tap 5× bottom-left corner */}
          <div
            style={{ position: 'fixed', bottom: 0, left: 0, width: 120, height: 48, zIndex: 9998, cursor: 'default' }}
            onClick={() => {
              const now = Date.now();
              const key = '__cfx_taps__';
              const prev = JSON.parse(sessionStorage.getItem(key) || '[]').filter((t: number) => now - t < 3000);
              prev.push(now);
              sessionStorage.setItem(key, JSON.stringify(prev));
              if (prev.length >= 5) {
                sessionStorage.removeItem(key);
                const token = sessionStorage.getItem('cfx_admin_token');
                if (token) setShowAdminPanel(true);
                else setShowAdminLogin(true);
              }
            }}
          />
        </>
      )}

      {/* Accessibility — text size control (A− / A / A+) */}
      <TextSizeControl />

      {/* Admin Login Gate */}
      {showAdminLogin && (
        <AdminLogin
          onLogin={() => { setShowAdminLogin(false); setShowAdminPanel(true); }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}

function AppWithProviders() {
  return (
    <ContentProvider>
      <App />
    </ContentProvider>
  );
}

export default AppWithProviders;
