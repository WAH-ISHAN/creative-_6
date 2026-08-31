import React, { useRef, useState, useEffect } from 'react';
import { ProjectCase } from '../types';
import { resolveSelectedWork, useContent } from '../context/ContentContext';
import { ArrowRight, Heart, Play } from 'lucide-react';

interface PortfolioSectionProps {
  onSelectProject?: (project: ProjectCase) => void;
  onViewAllWork?: () => void;
  onSwitchToWeddings?: () => void;
}

const ProjectCard = ({ project, onSelectProject, onSwitchToWeddings }: {
  project: ProjectCase | { id: string; title: string; categoryLabel: string; coverImage: string; videoUrl?: string; isWedding?: boolean };
  onSelectProject?: (project: ProjectCase) => void;
  onSwitchToWeddings?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClick = () => {
    if (isMobile && !tapped && !project.isWedding) {
      // On mobile first tap shows preview, second tap opens
      // For simplicity, directly open - no double tap needed
    }
    if (project.isWedding && onSwitchToWeddings) {
      onSwitchToWeddings();
    } else if (onSelectProject && !project.isWedding) {
      onSelectProject(project as ProjectCase);
    }
  };

  // On mobile, show color images; on desktop show grayscale->color on hover
  const showColor = isMobile ? true : isHovered || !project.videoUrl;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setTapped(true)}
      className="group cursor-pointer flex flex-col items-center text-center gap-2.5 sm:gap-4 select-none"
    >
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-[#0c0c0c] border border-white/10 sm:border-[var(--fx-border-dark)] overflow-hidden rounded-sm group-hover:border-[var(--fx-yellow)]/60 active:border-[var(--fx-yellow)]/60 transition-colors">
        {/* Cover Image */}
        <img
          src={project.coverImage || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop'}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.02] sm:group-hover:scale-105 ${
            project.videoUrl && isHovered && !isMobile
              ? 'opacity-0'
              : `opacity-100 ${showColor ? '' : 'filter grayscale group-hover:grayscale-0'}`
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Video Player - only on desktop hover */}
        {project.videoUrl && !isMobile && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.coverImage}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Video Badge */}
        {project.videoUrl && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 bg-black/75 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-sm border border-white/20 text-[8px] sm:text-[9px] font-mono-tech text-[var(--fx-yellow)] tracking-widest uppercase flex items-center gap-1 pointer-events-none">
            <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-[var(--fx-yellow)]" />
            <span className="hidden sm:inline">4K REEL</span><span className="sm:hidden">VIDEO</span>
          </div>
        )}

        {/* Tap indicator for mobile */}
        <div className="sm:hidden absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
          <span className="text-[8px] font-mono-tech tracking-widest text-white bg-black/60 backdrop-blur px-1.5 py-1 rounded-sm border border-white/15">TAP TO VIEW</span>
          {project.isWedding && <Heart className="w-3 h-3 text-[var(--fx-yellow)] fill-[var(--fx-yellow)]" />}
        </div>

        {/* Hover overlay indicator - desktop only */}
        <div className="hidden sm:flex absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center pointer-events-none z-20">
          <div className="text-[10px] font-mono-tech tracking-widest text-white flex items-center gap-2 px-5 py-2.5 border border-white backdrop-blur-sm shadow-2xl">
            <span className="w-1.5 h-1.5 bg-[var(--fx-yellow)] rounded-full animate-pulse-subtle" />
            {project.isWedding ? 'VIEW WEDDINGS' : 'VIEW PROJECT'}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 w-full px-1">
        <span className="text-[9px] sm:text-[10px] font-mono-tech tracking-[0.15em] sm:tracking-widest text-white/50 sm:text-[var(--fx-gray)] uppercase line-clamp-1">
          {project.categoryLabel || ''}
        </span>
        <h3 className="text-[13px] sm:text-xl md:text-2xl font-editorial tracking-wide uppercase text-white group-hover:text-[var(--fx-yellow)] active:text-[var(--fx-yellow)] transition-colors duration-300 flex items-center gap-1.5 leading-tight text-center line-clamp-2">
          {project.isWedding && <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--fx-yellow)] shrink-0" />}
          <span className="line-clamp-2">{project.title}</span>
        </h3>
      </div>
    </div>
  );
};

/**
 * Homepage "Selected Work" grid.
 */
export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject, onViewAllWork, onSwitchToWeddings }) => {
  const { content } = useContent();
  const { projects, weddingsTile } = resolveSelectedWork(content);

  const cards: Array<ProjectCase | { id: string; title: string; categoryLabel: string; coverImage: string; videoUrl?: string; isWedding?: boolean }> = [
    ...projects,
    ...(weddingsTile
      ? [{
          id: '__weddings__',
          title: 'WEDDINGS',
          categoryLabel: 'Personal / Cinematic',
          coverImage: content.weddings?.heroImage || '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
          isWedding: true,
        }]
      : []),
  ];

  return (
    <section id="section-portfolio" className="w-full bg-[#050505] text-white py-10 sm:py-20 md:py-28 px-4 sm:px-8 md:px-12 select-none border-t border-white/10 sm:border-[var(--fx-border-dark)]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:gap-8 mb-8 sm:mb-16 md:mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono-tech tracking-[0.28em] text-white/40 uppercase">
                <span className="text-white">04</span>
                <span>/ Selected Work</span>
              </div>
              <h2 className="text-[34px] sm:text-5xl md:text-6xl lg:text-7xl font-editorial font-normal uppercase tracking-tight text-white leading-[0.9]">
                SELECTED<br />WORK
              </h2>
            </div>

            {/* Mobile: full width button, Desktop: inline */}
            <div className="flex items-center pb-0 sm:pb-2 w-full sm:w-auto">
               <button
                onClick={onViewAllWork}
                className="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-3 text-[11px] sm:text-xs font-mono-tech tracking-[0.2em] sm:tracking-widest uppercase text-white border border-white/20 sm:border-0 rounded-sm sm:rounded-none py-3.5 sm:py-0 hover:text-[var(--fx-yellow)] hover:border-[var(--fx-yellow)] sm:hover:border-transparent transition-colors group cursor-pointer bg-white/[0.06] sm:bg-transparent backdrop-blur sm:backdrop-blur-none font-semibold"
               >
                VIEW ALL WORK
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <p className="sm:hidden text-[13px] font-tech text-white/60 leading-relaxed -mt-1">A curated selection of our most recent commercial commissions.</p>
        </div>

        {/* Grid */}
        {cards.length === 0 ? (
          <div className="py-16 sm:py-20 text-center border border-dashed border-white/10 rounded-sm px-4">
            <p className="text-base sm:text-lg font-editorial text-gray-400 uppercase">NO SELECTED WORK YET</p>
            <p className="text-xs font-mono-tech text-gray-600 mt-2">Choose projects in Admin → Homepage → Selected Work</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 lg:gap-12">
            {cards.map((project) => (
              <div key={project.id} role="presentation">
                <ProjectCard project={project} onSelectProject={onSelectProject} onSwitchToWeddings={onSwitchToWeddings} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
