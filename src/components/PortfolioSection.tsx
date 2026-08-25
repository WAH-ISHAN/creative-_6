import React, { useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // In-View Autoplay Controller
  useEffect(() => {
    if (!project.videoUrl || !containerRef.current) return;

    const currentVideo = videoRef.current;
    if (currentVideo) {
      currentVideo.play().catch(() => {});
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.15, rootMargin: '100px 0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [project.videoUrl]);

  const handleClick = () => {
    if (project.isWedding && onSwitchToWeddings) {
      onSwitchToWeddings();
    } else if (onSelectProject && !project.isWedding) {
      onSelectProject(project as ProjectCase);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="group cursor-pointer flex flex-col items-center text-center gap-4"
    >
      <div className="relative w-full aspect-[4/5] bg-[#0c0c0c] border border-[var(--fx-border-dark)] overflow-hidden rounded-sm group-hover:border-[var(--fx-yellow)]/60 transition-colors">
        {/* High-Performance Video / Photo Display */}
        {project.videoUrl ? (
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.coverImage}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <img
            src={project.coverImage || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop'}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Video Badge */}
        {project.videoUrl && (
          <div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-sm border border-white/20 text-[9px] font-mono-tech text-[var(--fx-yellow)] tracking-widest uppercase flex items-center gap-1 pointer-events-none">
            <Play className="w-2.5 h-2.5 fill-[var(--fx-yellow)]" />
            <span>4K CINEMA</span>
          </div>
        )}

        {/* Hover overlay indicator */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
          <div className="text-[10px] font-mono-tech tracking-widest text-[var(--fx-white)] flex items-center gap-2 px-6 py-3 border border-[var(--fx-white)] backdrop-blur-sm shadow-2xl">
            <span className="w-1.5 h-1.5 bg-[var(--fx-yellow)] rounded-full animate-pulse-subtle" />
            {project.isWedding ? 'VIEW WEDDINGS' : 'VIEW PROJECT'}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 w-full">
        <span className="text-[10px] font-mono-tech tracking-widest text-[var(--fx-gray)] uppercase">
          {project.categoryLabel || ''}
        </span>
        <h3 className="text-lg sm:text-xl md:text-2xl font-editorial tracking-wide uppercase text-[var(--fx-white)] group-hover:text-[var(--fx-yellow)] transition-colors duration-300 flex items-center gap-2">
          {project.isWedding && <Heart className="w-4 h-4 text-[var(--fx-yellow)]" />}
          {project.title}
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
          coverImage: content.weddings?.heroImage || '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
          isWedding: true,
        }]
      : []),
  ];

  return (
    <section id="section-portfolio" className="w-full bg-[var(--fx-black)] text-[var(--fx-white)] py-12 sm:py-20 md:py-28 px-6 sm:px-8 md:px-12 select-none border-t border-[var(--fx-border-dark)]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono-tech tracking-[0.28em] text-[var(--fx-gray)] uppercase">
              <span className="text-[var(--fx-white)]">04</span>
              <span>/ Selected Work</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-white)] leading-none">
              SELECTED<br />WORK
            </h2>
          </div>

          <div className="flex items-center pb-2">
             <button
              onClick={onViewAllWork}
              className="flex items-center gap-4 text-xs font-mono-tech tracking-widest uppercase text-[var(--fx-white)] hover:text-[var(--fx-yellow)] transition-colors group cursor-pointer"
             >
               VIEW ALL WORK
               <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

        {/* Grid */}
        {cards.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-sm">
            <p className="text-lg font-editorial text-gray-400 uppercase">NO SELECTED WORK YET</p>
            <p className="text-xs font-mono-tech text-gray-600 mt-2">Choose projects in Admin → Homepage → Selected Work</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-12">
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
