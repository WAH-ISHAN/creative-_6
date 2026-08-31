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
import { ServicesPage } from './components/ServicesPage';
import { AgencyService } from './types';
import { soundEngine } from './utils/audio';
import { useScrollReveal } from './utils/useScrollReveal';
import { useScrollEffects } from './utils/useScrollEffects';
import { ContentProvider, useContent } from './context/ContentContext';
import { AdminPanel } from './admin/AdminPanel';
import { AdminLogin } from './admin/AdminLogin';
import { TextSizeControl } from './components/TextSizeControl';

type View = 'studio' | 'weddings' | 'works' | 'project' | 'services';

// ─── Hash-based router (URL always stays at /, hash encodes the view) ──────────
// Format: #!view=works&f=video  |  #!project=some-slug  |  #section-contact
function parseHash(hash: string): { view: View; slug: string | null; worksFilter: string | null } {
  // Always fall back gracefully
  if (!hash || hash === '#' || hash === '#!') {
    return { view: 'studio', slug: null, worksFilter: null };
  }

  // Legacy section-anchor hashes stay on studio (home) page
  if (hash.startsWith('#section-')) {
    return { view: 'studio', slug: null, worksFilter: null };
  }

  // Our SPA hashes all start with #!
  if (hash.startsWith('#!')) {
    const qs = hash.slice(2); // strip the #!
    const params = new URLSearchParams(qs);

    const project = params.get('project');
    if (project) return { view: 'project', slug: project, worksFilter: null };

    const view = params.get('view') as View | null;
    if (view === 'weddings') return { view: 'weddings', slug: null, worksFilter: null };
    if (view === 'services') return { view: 'services', slug: null, worksFilter: null };
    if (view === 'works') {
      const f = params.get('f');
      return { view: 'works', slug: null, worksFilter: f ? f.toUpperCase() : null };
    }
  }

  return { view: 'studio', slug: null, worksFilter: null };
}

// Push a new SPA hash without exposing URL paths
function pushHash(hash: string) {
  // Use replaceState to keep the URL clean (no path segments visible)
  window.history.pushState(null, '', '/' + hash);
  // Notify listeners
  window.dispatchEvent(new Event('hashchange'));
}

function App() {
  useScrollReveal();
  const { content, isLoading } = useContent();
  const siteSettings = content.settings || {};

  const [loading, setLoading] = useState(true);

  // ─── Admin panel state ──────────────────────────────────────────────────────
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [currentView, setCurrentView] = useState<View>(() => parseHash(window.location.hash).view);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(() => parseHash(window.location.hash).slug);
  const [worksFilter, setWorksFilter] = useState<string | null>(() => parseHash(window.location.hash).worksFilter);
  // Key that increments every time we return to studio — forces full remount of all home sections
  // so GSAP scroll-triggered animations replay correctly after navigating away and back.
  const [studioKey, setStudioKey] = useState(0);

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

  // Open admin via URL param (?admin=1)
  useEffect(() => {
    initScrollRestoration();
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
      const token = sessionStorage.getItem('cfx_admin_token');
      if (token) setShowAdminPanel(true);
      else setShowAdminLogin(true);
    }
  }, []);

  // Handle browser back & forward using hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const next = parseHash(window.location.hash);
      // If navigating back to studio from another view, bump the key so sections remount
      if (next.view === 'studio') {
        setStudioKey(k => k + 1);
      }
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

  // Global scroll reset on route change
  useEffect(() => {
    // If navigating to an anchor section on Home (e.g. #section-contact)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#section-') && currentView === 'studio') {
      const targetId = hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          smoothScrollTo(el);
          ScrollTrigger.refresh();
        }, 120);
        return;
      }
    }

    resetGlobalScroll();
    setTimeout(() => ScrollTrigger.refresh(), 200);
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
      pushHash('#section-contact');
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
    pushHash('#!view=weddings');
    resetGlobalScroll();
  };

  const handleSwitchToServices = () => {
    soundEngine.playOpen();
    setCurrentView('services');
    setSelectedProjectSlug(null);
    setWorksFilter(null);
    pushHash('#!view=services');
    resetGlobalScroll();
  };

  const handleSwitchToStudio = () => {
    soundEngine.playOpen();
    setCurrentView('studio');
    setSelectedProjectSlug(null);
    setWorksFilter(null);
    pushHash('');
    resetGlobalScroll();
    // Increment key so all home sections fully remount → GSAP animations replay from scratch
    setStudioKey(k => k + 1);
  };

  const handleSwitchToWorks = (filter?: string) => {
    soundEngine.playOpen();
    setCurrentView('works');
    setSelectedProjectSlug(null);
    setWorksFilter(filter ?? null);
    pushHash(filter ? `#!view=works&f=${filter.toLowerCase()}` : '#!view=works');
    resetGlobalScroll();
  };

  const handleSelectProject = (project: any) => {
    soundEngine.playClick();
    const slug = typeof project === 'string' ? project : project.slug;
    setSelectedProjectSlug(slug);
    setCurrentView('project');
    pushHash(`#!project=${slug}`);
    resetGlobalScroll();
  };

  // ─── Maintenance mode ───────────────────────────────────────────────────────
  const isAdminSession = typeof window !== 'undefined' && (
    sessionStorage.getItem('cfx_admin_token') ||
    new URLSearchParams(window.location.search).get('admin') === '1'
  );
  const showMaintenance = !!siteSettings.maintenanceMode && !isAdminSession;

  return (
    <div className={`min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] relative`}>
      {/* Page Loader */}
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
      ) : currentView === 'services' ? (
        <ServicesPage
          onSwitchToStudio={handleSwitchToStudio}
          onSwitchToWorks={handleSwitchToWorks}
          onSwitchToWeddings={handleSwitchToWeddings}
          onOpenInquiry={(_serviceName) => {
            handleSwitchToStudio();
            setTimeout(() => {
              const el = document.getElementById('section-contact');
              if (el) smoothScrollTo(el);
            }, 150);
          }}
        />
      ) : currentView === 'works' ? (
        <WorksPage
          key={worksFilter || 'all'}
          initialFilter={worksFilter}
          onSelectProject={handleSelectProject}
          onSwitchToStudio={handleSwitchToStudio}
          onSwitchToServices={handleSwitchToServices}
          onSwitchToWeddings={handleSwitchToWeddings}
        />
      ) : currentView === 'project' && selectedProjectSlug ? (
        <ProjectDetailPage
          projectSlug={selectedProjectSlug}
          onBack={() => handleSwitchToWorks()}
          onSwitchToStudio={handleSwitchToStudio}
          onSwitchToServices={handleSwitchToServices}
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
                onOpenWork={() => handleSwitchToWorks()}
                onOpenServices={handleSwitchToServices}
                onOpenAbout={() => scrollToSection('section-about')}
                onOpenContact={() => scrollToSection('section-contact')}
                onOpenWeddings={handleSwitchToWeddings}
              />

              {/* Main Page Flow — key forces full remount on every return so GSAP replays */}
              <main key={studioKey} className="w-full">
                {/* 01 — HERO */}
                <HeroSection
                  onExploreWork={() => scrollToSection('section-featured-work')}
                  onStartProject={handleStartProject}
                  onOpenServices={handleSwitchToServices}
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
                onNavigateServices={handleSwitchToServices}
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
        </>
      )}

      {/* Accessibility — text size control */}
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
