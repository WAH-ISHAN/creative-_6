import React, { useState, useEffect, useMemo, useRef } from 'react';
import { smoothScrollTo, resetGlobalScroll } from '../utils/scrollManager';
import { usePublishedProjects, useContent } from '../context/ContentContext';
import { ProjectCase } from '../types';
import { ArrowLeft, Search, X, Camera, Film, Sparkles, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { soundEngine } from '../utils/audio';
import { useSeo } from '../utils/useSeo';

interface WorksPageProps {
  initialFilter?: string | null;
  onSelectProject?: (project: ProjectCase) => void;
  onSwitchToStudio: () => void;
  onSwitchToWeddings: () => void;
}

const PAGE_SIZE = 12;

// Exact Categories specified
const PHOTO_CATEGORIES = [
  'Graduation',
  'Events',
  'Casual Shoots',
  'Birthday',
  'Product',
  'Other'
];

const VIDEO_CATEGORIES = [
  'Graduation',
  'Events',
  'Conceptual Reels',
  'Birthday',
  'Drone',
  'Product',
  'Marketing Reels',
  'Other'
];

/**
 * High-performance, interactive Work Card with B&W to Color & Play on Hover
 */
const WorkCardItem: React.FC<{
  project: ProjectCase;
  idx: number;
  total: number;
  onSelect: (project: ProjectCase) => void;
}> = ({ project, idx, total, onSelect }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isVideo = project.type === 'video' || !!project.videoUrl;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="works-card group cursor-pointer flex flex-col gap-4 bg-[#0a0a0a] border border-white/10 hover:border-[var(--fx-yellow)]/60 p-3 sm:p-4 rounded-sm transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.9)] select-none"
    >
      {/* Media Wrapper */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-black rounded-sm border border-white/10 group-hover:border-white/30 transition-colors fx-media--fill">
        {/* Index Tag */}
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono-tech tracking-widest text-white/90 rounded-sm">
          {String(idx + 1).padStart(2, '0')} // {String(total).padStart(2, '0')}
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

        {/* Cover Image (Default Black & White, turns to full vibrant color on hover) */}
        <img
          src={project.coverImage || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800'}
          alt={project.title}
          loading={idx < PAGE_SIZE ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
            isVideo && isHovered
              ? 'opacity-0'
              : 'opacity-100 filter grayscale contrast-[1.05] group-hover:grayscale-0'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Video Player (Plays & reveals in full color on mouse hover) */}
        {isVideo && project.videoUrl && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.videoPoster || project.coverImage}
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Corner Markers */}
        <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-white/40 pointer-events-none group-hover:border-[var(--fx-yellow)] transition-colors" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-white/40 pointer-events-none group-hover:border-[var(--fx-yellow)] transition-colors" />

        {/* Hover Overlay Button */}
        <div className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
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
};

export const WorksPage: React.FC<WorksPageProps> = ({ initialFilter, onSelectProject, onSwitchToStudio, onSwitchToWeddings }) => {
  const [activeType, setActiveType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
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
    resetGlobalScroll();
    if (initialFilter) {
      const f = initialFilter.toUpperCase();
      if (f === 'PHOTOGRAPHY' || f === 'PHOTO') setActiveType('PHOTO');
      else if (f === 'VIDEO' || f === 'CINEMA') setActiveType('VIDEO');
      else setActiveCategory(initialFilter);
    }
  }, [initialFilter]);

  // Admin-editable page header
  const worksTitle = (content.pages?.worksTitle || 'WORKS /\nPROJECTS').split('\n');
  const worksIntro = content.pages?.worksIntro || '';

  // ── Available category list based on active media type ──
  const categoryChips = useMemo(() => {
    if (activeType === 'PHOTO') {
      return [{ id: 'ALL', label: 'ALL PHOTOS' }, ...PHOTO_CATEGORIES.map(c => ({ id: c, label: c.toUpperCase() }))];
    }
    if (activeType === 'VIDEO') {
      return [{ id: 'ALL', label: 'ALL VIDEOS' }, ...VIDEO_CATEGORIES.map(c => ({ id: c, label: c.toUpperCase() }))];
    }
    // Combined Unique Categories
    const combined = Array.from(new Set([...PHOTO_CATEGORIES, ...VIDEO_CATEGORIES]));
    return [{ id: 'ALL', label: 'ALL WORKS' }, ...combined.map(c => ({ id: c, label: c.toUpperCase() }))];
  }, [activeType]);

  const matchesProject = (p: ProjectCase): boolean => {
    const isPhoto = p.type === 'photography';
    const isVideo = p.type === 'video' || !!p.videoUrl;

    // 1. Type Match
    if (activeType === 'PHOTO' && !isPhoto) return false;
    if (activeType === 'VIDEO' && !isVideo) return false;

    // 2. Category Match
    if (activeCategory !== 'ALL') {
      const pCat = (p.category || '').toLowerCase();
      const pCatLabel = (p.categoryLabel || '').toLowerCase();
      const pTags = (p.tags || []).map(t => t.toLowerCase());
      const targetCat = activeCategory.toLowerCase();

      const matched =
        pCat === targetCat ||
        pCatLabel === targetCat ||
        pTags.includes(targetCat) ||
        pCat.includes(targetCat) ||
        pCatLabel.includes(targetCat);

      if (!matched) return false;
    }

    // 3. Search Query Match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.client || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.categoryLabel || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    return true;
  };

  const filteredProjects = useMemo(() => {
    return allProjects.filter(matchesProject);
  }, [allProjects, activeType, activeCategory, searchQuery]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const handleSelectProject = (project: ProjectCase) => {
    soundEngine.playClick();
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      window.history.pushState(null, '', `/works/${project.slug || project.id}`);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] flex flex-col selection:bg-[var(--fx-yellow)] selection:text-black">
      {/* Universal Header */}
      <Header
        activeTab="work"
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 md:px-12 pt-32 sm:pt-40 pb-24">
        {/* Page Top Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[var(--fx-border-dark)]">
          <div className="space-y-4">
            <button
              onClick={onSwitchToStudio}
              className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest text-[var(--fx-gray)] hover:text-[var(--fx-white)] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              BACK TO HOME
            </button>
            <div className="text-xs font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
              INDEXED PORTFOLIO
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-white)] leading-[0.9]">
              {worksTitle[0]}<br />
              <span className="text-[var(--fx-yellow)]">{worksTitle[1] || ''}</span>
            </h1>
          </div>

          <div className="max-w-md">
            <p className="text-sm sm:text-base font-tech text-[var(--fx-gray)] leading-relaxed">
              {worksIntro || 'A curated selection of our commercial, editorial, and documentary commissions spanning photography and cinema.'}
            </p>
          </div>
        </div>

        {/* Modern High-Contrast Filter & Category Engine */}
        <div className="my-8 p-4 sm:p-6 bg-[#0c0c0c] border border-white/20 rounded-md shadow-2xl space-y-5">
          {/* Row 1: Media Type Switcher & Search Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            {/* Primary Media Format Tabs */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => { soundEngine.playClick(); setActiveType('ALL'); setActiveCategory('ALL'); }}
                className={`px-4 sm:px-5 py-2 rounded-sm text-xs font-mono-tech tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeType === 'ALL'
                    ? 'bg-[var(--fx-yellow)] text-black font-bold border border-[var(--fx-yellow)] shadow-[0_0_18px_rgba(252,191,19,0.35)] scale-[1.02]'
                    : 'bg-[#181818] text-white font-semibold border border-white/20 hover:border-white/60 hover:bg-[#222222]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>ALL COMMISSIONS</span>
              </button>

              <button
                onClick={() => { soundEngine.playClick(); setActiveType('PHOTO'); setActiveCategory('ALL'); }}
                className={`px-4 sm:px-5 py-2 rounded-sm text-xs font-mono-tech tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeType === 'PHOTO'
                    ? 'bg-[var(--fx-yellow)] text-black font-bold border border-[var(--fx-yellow)] shadow-[0_0_18px_rgba(252,191,19,0.35)] scale-[1.02]'
                    : 'bg-[#181818] text-white font-semibold border border-white/20 hover:border-white/60 hover:bg-[#222222]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>PHOTO</span>
              </button>

              <button
                onClick={() => { soundEngine.playClick(); setActiveType('VIDEO'); setActiveCategory('ALL'); }}
                className={`px-4 sm:px-5 py-2 rounded-sm text-xs font-mono-tech tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeType === 'VIDEO'
                    ? 'bg-[var(--fx-yellow)] text-black font-bold border border-[var(--fx-yellow)] shadow-[0_0_18px_rgba(252,191,19,0.35)] scale-[1.02]'
                    : 'bg-[#181818] text-white font-semibold border border-white/20 hover:border-white/60 hover:bg-[#222222]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>VIDEO</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, category, tag..."
                className="w-full pl-9 pr-8 py-2 bg-[#181818] border border-white/20 rounded-sm text-xs font-mono-tech text-white placeholder:text-gray-400 focus:outline-none focus:border-[var(--fx-yellow)] focus:ring-1 focus:ring-[var(--fx-yellow)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Crisp, High-Contrast Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap sm:flex-nowrap">
            {categoryChips.map(cat => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => { soundEngine.playClick(); setActiveCategory(cat.id); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono-tech tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[var(--fx-yellow)] text-black font-bold border border-[var(--fx-yellow)] shadow-[0_0_14px_rgba(252,191,19,0.4)] scale-105'
                      : 'bg-[#181818] text-white font-medium border border-white/25 hover:border-[var(--fx-yellow)] hover:text-[var(--fx-yellow)] hover:bg-[#222222]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Bar */}
        <div className="pb-6 flex justify-between items-center text-xs font-mono-tech tracking-widest text-gray-400 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--fx-yellow)] animate-pulse-subtle" />
            <span>
              SHOWING <strong className="text-white">{visibleProjects.length}</strong> OF <strong className="text-white">{filteredProjects.length}</strong> RELEASES
            </span>
          </div>
          {(activeCategory !== 'ALL' || activeType !== 'ALL' || searchQuery) && (
            <button
              onClick={() => { setActiveType('ALL'); setActiveCategory('ALL'); setSearchQuery(''); }}
              className="text-[var(--fx-yellow)] hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>✕ RESET ALL FILTERS</span>
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="pt-4">
          {filteredProjects.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-sm">
              <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-4" />
              <p className="text-xl font-editorial uppercase text-gray-400">NO PROJECTS FOUND IN THIS CATEGORY</p>
              <p className="text-xs font-mono-tech text-gray-600 mt-2">TRY CLEARING YOUR SEARCH OR CHOOSING ANOTHER CATEGORY</p>
              <button
                onClick={() => { setActiveType('ALL'); setActiveCategory('ALL'); setSearchQuery(''); }}
                className="mt-6 px-6 py-2.5 bg-[var(--fx-yellow)] text-black font-mono-tech text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                SHOW ALL WORKS
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                {visibleProjects.map((project, idx) => (
                  <WorkCardItem
                    key={project.id || idx}
                    project={project}
                    idx={idx}
                    total={filteredProjects.length}
                    onSelect={handleSelectProject}
                  />
                ))}
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
