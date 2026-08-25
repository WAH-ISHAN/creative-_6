import React, { useState, useEffect, useMemo } from 'react';
import { smoothScrollTo, resetGlobalScroll } from '../utils/scrollManager';
import { usePublishedProjects, useContent } from '../context/ContentContext';
import { ProjectCase } from '../types';
import { ArrowLeft, Search, X, Camera, Film, Sparkles, ArrowUpRight } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { soundEngine } from '../utils/audio';
import { useSeo } from '../utils/useSeo';

interface WorksPageProps {
  initialFilter?: string | null;
  onSwitchToStudio: () => void;
  onSwitchToWeddings: () => void;
}

const PAGE_SIZE = 12;

/** Friendly labels for known category ids; unknown categories pass through. */
const CATEGORY_LABELS: Record<string, string> = {
  COMMERCIAL: 'COMMERCIAL',
  FASHION: 'FASHION',
  EVENTS: 'EVENTS',
  PORTRAIT: 'PORTRAITS & CASUAL',
  CELEBRATIONS: 'CELEBRATIONS',
  WEDDINGS: 'WEDDINGS',
};

export const WorksPage: React.FC<WorksPageProps> = ({ initialFilter, onSwitchToStudio, onSwitchToWeddings }) => {
  const [activeCategory, setActiveCategory] = useState<string>((initialFilter || 'ALL').toUpperCase());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const allProjects = usePublishedProjects();
  const { content } = useContent();

  useSeo({
    title: `${(content.pages?.worksTitle || 'WORKS').replace(/\n/g, ' ')} — CreativeFX`,
    description: content.pages?.worksIntro || content.seo?.description,
    image: content.seo?.ogImage,
  });

  useEffect(() => {
    // Reset scroll to absolute top immediately on mount
    resetGlobalScroll();
  }, []);

  // Keep the URL shareable when the filter changes (?f=PHOTOGRAPHY)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeCategory === 'ALL') url.searchParams.delete('f');
    else url.searchParams.set('f', activeCategory.toLowerCase());
    window.history.replaceState(null, '', url.pathname + (url.search || '') );
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  // Admin-editable page header
  const worksTitle = (content.pages?.worksTitle || 'WORKS /\nPROJECTS').split('\n');
  const worksIntro = content.pages?.worksIntro || '';

  // ── Filter categories generated dynamically from the master project data ──
  const categories = useMemo(() => {
    const typeChips = [
      { id: 'PHOTOGRAPHY', label: 'PHOTOGRAPHY' },
      { id: 'VIDEO', label: 'CINEMA 4K' },
    ];
    // Unique project categories in list order
    const catIds: string[] = [];
    for (const p of allProjects) {
      const cat = (p.category || '').toUpperCase();
      if (cat && !catIds.includes(cat)) catIds.push(cat);
    }
    return [
      { id: 'ALL', label: 'ALL WORKS' },
      ...typeChips,
      ...catIds.map(id => ({ id, label: CATEGORY_LABELS[id] || id })),
    ];
  }, [allProjects]);

  const matchesCategory = (p: ProjectCase, catId: string): boolean => {
    if (catId === 'ALL') return true;
    if (catId === 'PHOTOGRAPHY') return p.type === 'photography';
    if (catId === 'VIDEO') return p.type === 'video' || !!p.videoUrl;

    const cat = (p.category || '').toUpperCase();
    const catLabel = (p.categoryLabel || '').toUpperCase();
    const tags = (p.tags || []).map(t => t.toUpperCase());

    if (catId === 'WEDDINGS') {
      return cat.includes('WEDDING') || catLabel.includes('WEDDING') || tags.some(t => t.includes('WEDDING'));
    }
    if (catId === 'COMMERCIAL') {
      return cat.includes('COMMERCIAL') || catLabel.includes('COMMERCIAL') || catLabel.includes('PRODUCT') || catLabel.includes('MARKETING') || tags.some(t => t.includes('COMMERCIAL') || t.includes('PRODUCT') || t.includes('MARKETING'));
    }
    if (catId === 'EVENTS') {
      return cat.includes('EVENT') || catLabel.includes('EVENT') || catLabel.includes('GRADUATION') || catLabel.includes('ANNIVERSARY') || tags.some(t => t.includes('EVENT') || t.includes('GRADUATION') || t.includes('ANNIVERSARY'));
    }
    if (catId === 'PORTRAIT') {
      return cat.includes('PORTRAIT') || cat.includes('CELEBRATION') || catLabel.includes('PORTRAIT') || catLabel.includes('BIRTHDAY') || catLabel.includes('CASUAL') || tags.some(t => t.includes('PORTRAIT') || t.includes('CASUAL') || t.includes('BIRTHDAY'));
    }
    if (catId === 'FASHION') {
      return cat.includes('FASHION') || catLabel.includes('FASHION') || tags.some(t => t.includes('FASHION') || t.includes('CLOTHING'));
    }
    return cat === catId;
  };

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (!matchesCategory(p, activeCategory)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = p.title?.toLowerCase().includes(q);
        const clientMatch = p.client?.toLowerCase().includes(q);
        const catMatch = p.categoryLabel?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
        const tagMatch = (p.tags || []).some(t => t.toLowerCase().includes(q));
        return titleMatch || clientMatch || catMatch || tagMatch;
      }
      return true;
    });
  }, [allProjects, activeCategory, searchQuery]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const handleFilterChange = (filterId: string) => {
    if (filterId === activeCategory) return;
    soundEngine.playClick();
    setActiveCategory(filterId);
  };

  const handleSelectProject = (project: ProjectCase) => {
    soundEngine.playClick();
    window.history.pushState(null, '', `/works/${project.slug}`);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] flex flex-col selection:bg-[var(--fx-yellow)] selection:text-black">
      <Header
        activeView="work"
        onLogoClick={onSwitchToStudio}
        onOpenWork={() => smoothScrollTo(0)}
        onOpenServices={() => { onSwitchToStudio(); setTimeout(() => smoothScrollTo(document.getElementById('section-services')), 100); }}
        onOpenAbout={() => { onSwitchToStudio(); setTimeout(() => smoothScrollTo(document.getElementById('section-about')), 100); }}
        onOpenContact={() => { onSwitchToStudio(); setTimeout(() => smoothScrollTo(document.getElementById('section-contact')), 100); }}
        onOpenWeddings={onSwitchToWeddings}
      />

      <main className="flex-1 w-full pt-24 sm:pt-28 pb-24 sm:pb-32 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-[1650px] mx-auto">
          {/* Back button */}
          <button
            onClick={onSwitchToStudio}
            className="group inline-flex items-center gap-3 text-xs font-mono-tech tracking-widest uppercase text-[var(--fx-gray)] hover:text-[var(--fx-white)] transition-colors mb-6 sm:mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            BACK TO HOME
          </button>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 lg:mb-10 border-b border-[var(--fx-border-dark)] pb-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INDEXED PORTFOLIO</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-white)] leading-[0.92]">
                {worksTitle.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < worksTitle.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-sm sm:text-base font-tech text-[var(--fx-gray)] leading-relaxed max-w-lg">
                {worksIntro}
              </p>
            </div>

            {/* Quick Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PROJECTS..."
                aria-label="Search projects"
                className="w-full bg-white/5 border border-[var(--fx-border-dark)] rounded-full pl-10 pr-10 py-3 text-sm font-mono-tech tracking-wider text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--fx-yellow)] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sticky Category Filter Bar — Always visible at top while scrolling */}
          <div className="sticky top-[68px] sm:top-[74px] z-30 bg-[#050505]/95 backdrop-blur-md py-3.5 -mx-5 sm:-mx-8 md:-mx-12 lg:-mx-16 px-5 sm:px-8 md:px-12 lg:px-16 border-y border-white/10 mb-8 sm:mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {categories.map((cat) => {
                  const count = allProjects.filter(p => matchesCategory(p, cat.id)).length;
                  if (count === 0 && cat.id !== 'ALL') return null; // hide empty categories
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleFilterChange(cat.id)}
                      aria-pressed={isActive}
                      className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? 'border-[var(--fx-yellow)] bg-[var(--fx-yellow)] text-black font-semibold shadow-[0_0_20px_rgba(252,191,19,0.35)]'
                          : 'border-[var(--fx-border-dark)] bg-white/5 text-[var(--fx-gray)] hover:border-white/40 hover:text-white'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-gray-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-mono-tech tracking-[0.25em] text-[var(--fx-gray)] uppercase flex-shrink-0 hidden lg:block">
                SHOWING <span className="text-[var(--fx-yellow)] font-bold">{filteredProjects.length}</span> OF {allProjects.length}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-sm">
              <p className="text-lg font-editorial text-gray-400 uppercase">NO PROJECTS FOUND</p>
              <p className="text-xs font-mono-tech text-gray-600 mt-2">TRY CLEARING YOUR SEARCH OR CHOOSING ANOTHER CATEGORY</p>
              <button
                onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); }}
                className="mt-6 px-6 py-2.5 bg-[var(--fx-yellow)] text-black font-mono-tech text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                SHOW ALL WORKS
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                {visibleProjects.map((project, idx) => {
                  const isVideo = project.type === 'video' || !!project.videoUrl;
                  return (
                    <div
                      key={project.id || idx}
                      onClick={() => handleSelectProject(project)}
                      className="works-card group cursor-pointer flex flex-col gap-4 bg-[#0a0a0a] border border-white/10 hover:border-[var(--fx-yellow)]/60 p-3 sm:p-4 rounded-sm transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.9)]"
                    >
                      {/* Media Wrapper */}
                      <div className="relative w-full aspect-[4/5] overflow-hidden bg-black rounded-sm border border-white/10 group-hover:border-white/30 transition-colors fx-media--fill">
                        {/* Index Tag */}
                        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono-tech tracking-widest text-white/90 rounded-sm">
                          {String(idx + 1).padStart(2, '0')} // {String(filteredProjects.length).padStart(2, '0')}
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono-tech tracking-widest rounded-sm flex items-center gap-1.5">
                          {isVideo ? (
                            <>
                              <Film className="w-3 h-3 text-[var(--fx-yellow)]" />
                              <span className="text-[var(--fx-yellow)] font-semibold">CINEMA 4K</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-3 h-3 text-white/90" />
                              <span className="text-white/90 font-semibold">PHOTO</span>
                            </>
                          )}
                        </div>

                        {/* Cover Image */}
                        <img
                          src={project.coverImage || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800'}
                          alt={project.title}
                          loading={idx < PAGE_SIZE ? 'eager' : 'lazy'}
                          decoding="async"
                          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
                            isVideo
                              ? 'filter grayscale group-hover:opacity-0'
                              : 'filter grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:opacity-100'
                          }`}
                          referrerPolicy="no-referrer"
                        />

                        {/* Hover Video Stream */}
                        {isVideo && project.videoUrl && (
                          <video
                            src={project.videoUrl}
                            poster={project.videoPoster || project.coverImage}
                            muted
                            loop
                            playsInline
                            preload="none"
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
                          />
                        )}

                        {/* Corner Markers */}
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-white/40 pointer-events-none group-hover:border-[var(--fx-yellow)] transition-colors" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-white/40 pointer-events-none group-hover:border-[var(--fx-yellow)] transition-colors" />

                        {/* Hover Overlay Button */}
                        <div className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-xs font-mono-tech tracking-widest text-black bg-[var(--fx-yellow)] font-bold flex items-center gap-2 px-5 py-2.5 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span>EXPLORE PROJECT</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Metadata Info */}
                      <div className="flex flex-col gap-1.5 px-1 py-1">
                        <div className="flex justify-between items-center text-[10px] font-mono-tech tracking-widest text-[var(--fx-gray)] uppercase">
                          <span>{project.categoryLabel || project.category}</span>
                          <span>{project.year || ''}</span>
                        </div>

                        <h3 className="works-card-title text-lg sm:text-xl font-editorial tracking-wide uppercase text-[var(--fx-white)] group-hover:text-[var(--fx-yellow)] transition-colors duration-300 leading-tight">
                          {project.title}
                        </h3>

                        {project.client && (
                          <p className="text-[11px] font-mono-tech tracking-wider text-gray-500 uppercase">
                            CLIENT // {project.client}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load more */}
              {visibleCount < filteredProjects.length && (
                <div className="mt-14 text-center">
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="px-10 py-4 bg-transparent border border-[var(--fx-border-dark)] hover:border-[var(--fx-yellow)] hover:text-[var(--fx-yellow)] text-white font-mono-tech text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                  >
                    LOAD MORE ({filteredProjects.length - visibleCount} REMAINING)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer
        onNavigateHome={onSwitchToStudio}
        onNavigateWorks={() => smoothScrollTo(0)}
        onNavigateWeddings={onSwitchToWeddings}
        onNavigateSection={(sectionId) => {
          onSwitchToStudio();
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) smoothScrollTo(el);
          }, 150);
        }}
      />
    </div>
  );
};
