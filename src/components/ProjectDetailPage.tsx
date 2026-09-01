import React, { useEffect, useState, useCallback } from 'react';
import { detectMediaKind, GalleryMedia, ProjectCase, SocialPostItem, toGalleryItems } from '../types';
import { usePublishedProjects, useContent } from '../context/ContentContext';

import { ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn, Film, Camera, ArrowUpRight } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FinalCtaSection } from './FinalCtaSection';
import { soundEngine } from '../utils/audio';
import { resetGlobalScroll, smoothScrollTo } from '../utils/scrollManager';
import { useSeo } from '../utils/useSeo';

const isIOS = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{ images: GalleryMedia[]; startIdx: number; onClose: () => void }> = ({ images, startIdx, onClose }) => {
  const [idx, setIdx] = useState(startIdx);
  const src = images[idx];

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 text-white/60 hover:text-white transition-colors z-10 cursor-pointer"
        aria-label="Close"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-mono text-white/50 tracking-widest">
        {idx + 1} / {images.length}
      </span>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-10 cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Image — full uncropped */}
      <div className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
        <img
          src={encodeURI(src.url)}
          alt={src.alt || src.caption || `Photo ${idx + 1}`}
          className="max-w-full max-h-[82vh] object-contain rounded-sm shadow-2xl select-none"
          draggable={false}
        />
        {src.caption && (
          <p className="mt-3 text-xs font-mono-tech tracking-wider uppercase text-white/70 text-center max-w-[80vw]">{src.caption}</p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-10 cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

// ── GalleryGrid ───────────────────────────────────────────────────────────────
const GalleryGrid: React.FC<{ project: ProjectCase }> = ({ project }) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const gallery = toGalleryItems(project.gallery);
  // Attach detected kinds for legacy string entries
  const items: GalleryMedia[] = gallery.map(m => ({ ...m, kind: m.kind || detectMediaKind(m.url) }));
  const isPhotoProject = project.type === 'photography';
  const deviceIsIOS = isIOS();

  const photos = items.filter(m => m.kind === 'image');

  if (isPhotoProject) {
    // ── Photography: masonry-style column layout ──
    return (
      <>
        {lightboxIdx !== null && photos[lightboxIdx] && (
          <Lightbox images={photos} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {items.map((media, idx) => (
            <div
              key={idx}
              className="gallery-item-wrapper break-inside-avoid overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-sm relative group transition-all duration-300 hover:border-[var(--fx-yellow)]/50 cursor-pointer"
              onClick={() => media.kind === 'image' && setLightboxIdx(Math.max(0, photos.indexOf(media)))}
            >
              {media.kind === 'video' && media.url.endsWith('.webm') && deviceIsIOS ? (
                <div className="w-full relative">
                  <img
                    src={encodeURI(media.poster || project.coverImage)}
                    alt={media.caption || `${project.title} frame ${idx + 1}`}
                    className="w-full h-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-black/80 rounded-full p-2.5 shadow-xl border border-white/20">
                      <Film className="w-4 h-4 text-[var(--fx-yellow)]" />
                    </div>
                  </div>
                </div>
              ) : media.kind === 'video' ? (
                <video
                  src={encodeURI(media.url)}
                  poster={media.poster ? encodeURI(media.poster) : undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                />
              ) : media.kind === 'embed' ? (
                <iframe src={encodeURI(media.url)} className="w-full aspect-video border-0" allow="autoplay" title={`${project.title} video ${idx + 1}`} />
              ) : (
                <>
                  <img
                    src={encodeURI(media.url)}
                    loading="lazy"
                    decoding="async"
                    alt={media.alt || media.caption || `${project.title} ${idx + 1}`}
                    className="w-full h-auto max-h-[85vh] object-contain block filter grayscale group-hover:grayscale-0 transition-all duration-500 cursor-zoom-in"
                    referrerPolicy="no-referrer"
                  />
                  {/* Zoom hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/75 rounded-full p-2.5 shadow-xl border border-white/20">
                      <ZoomIn className="w-5 h-5 text-[var(--fx-yellow)]" />
                    </div>
                  </div>
                  {media.caption && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/75 text-white/90 text-[10px] font-mono-tech tracking-widest uppercase rounded-sm pointer-events-none">
                      {media.caption}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }

  // ── Video / mixed: standard grid with cinematic aspect ratios ──
  const isPortraitProject = project.aspectRatio === 'portrait';

  return (
    <>
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <Lightbox images={photos} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
      <div className={`grid grid-cols-1 ${isPortraitProject ? 'sm:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
        {items.map((media, idx) => {
          const spanFull = !isPortraitProject && idx % 5 === 0;
          return (
            <div
              key={idx}
              className={`gallery-item-wrapper overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-sm relative group transition-all duration-300 hover:border-[var(--fx-yellow)]/50 ${
                spanFull ? 'md:col-span-2 aspect-video' : 'aspect-[4/5]'
              }`}
              onClick={() => media.kind === 'image' && setLightboxIdx(Math.max(0, photos.indexOf(media)))}
            >
              {media.kind === 'embed' ? (
                <iframe
                  src={encodeURI(media.url)}
                  className="w-full h-full border-0"
                  allow="autoplay"
                  title={`${project.title} video ${idx + 1}`}
                />
              ) : media.kind === 'video' && media.url.endsWith('.webm') && deviceIsIOS ? (
                <div className="w-full h-full relative">
                  <img
                    src={encodeURI(media.poster || project.coverImage)}
                    alt={media.caption || `${project.title} frame ${idx + 1}`}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-black/80 rounded-full p-3 shadow-xl border border-white/20">
                      <Film className="w-5 h-5 text-[var(--fx-yellow)]" />
                    </div>
                  </div>
                </div>
              ) : media.kind === 'video' ? (
                <video
                  src={encodeURI(media.url)}
                  poster={media.poster ? encodeURI(media.poster) : undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  style={{ objectPosition: isPortraitProject ? 'center 20%' : 'center center' }}
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105"
                />
              ) : (
                <>
                  <img
                    src={encodeURI(media.url)}
                    loading="lazy"
                    decoding="async"
                    alt={media.alt || media.caption || `${project.title} frame ${idx + 1}`}
                    style={{ objectPosition: isPortraitProject ? 'center 20%' : 'center center' }}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105 cursor-zoom-in"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/75 rounded-full p-2.5 shadow-xl border border-white/20">
                      <ZoomIn className="w-5 h-5 text-[var(--fx-yellow)]" />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

interface ProjectDetailPageProps {
  projectSlug: string;
  onBack: () => void;
  onSwitchToStudio: () => void;
  onSwitchToServices: () => void;
  onSwitchToWeddings: () => void;
  onStartProject: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectSlug,
  onBack,
  onSwitchToStudio,
  onSwitchToServices,
  onSwitchToWeddings,
  onStartProject
}) => {
  const { isLoading } = useContent();
  const allProjects = usePublishedProjects();
  const project = allProjects.find(
    p => p.slug === projectSlug ||
         p.id === projectSlug ||
         (p.slug && p.slug.toLowerCase() === (projectSlug || '').toLowerCase()) ||
         (p.id && p.id.toLowerCase() === (projectSlug || '').toLowerCase())
  );

  const [deviceIsIOS, setDeviceIsIOS] = useState(false);
  useEffect(() => {
    setDeviceIsIOS(isIOS());
    resetGlobalScroll();
  }, [projectSlug]);

  // Per-project SEO
  useSeo({
    title: project ? `${project.title} — CreativeFX` : 'Project Not Found — CreativeFX',
    description: project?.seoDescription || project?.summary,
    image: project?.coverImage,
    index: !!project,
  });

  if (isLoading && !project) {
    return (
      <div className="min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--fx-yellow)] border-t-transparent rounded-full animate-spin" />
        <span className="mt-4 text-xs font-mono-tech tracking-widest text-gray-400 uppercase">LOADING PROJECT...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] flex flex-col">
        <Header
          activeView="work"
          onLogoClick={onSwitchToStudio}
          onOpenWork={onBack}
          onOpenServices={onSwitchToServices}
          onOpenAbout={() => { onSwitchToStudio(); setTimeout(() => document.getElementById('section-about')?.scrollIntoView(), 100); }}
          onOpenContact={onStartProject}
          onOpenWeddings={onSwitchToWeddings}
        />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-24">
          <span className="text-xs font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase mb-4">404 / INVALID SLUG</span>
          <h1 className="text-4xl sm:text-6xl font-editorial uppercase">PROJECT NOT FOUND</h1>
          <p className="text-sm font-tech text-[var(--fx-gray)] mt-4 max-w-md">This project may have been unpublished, renamed, or the link is incorrect.</p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-[var(--fx-yellow)] text-black text-xs font-mono-tech tracking-widest uppercase font-semibold hover:bg-white transition-colors cursor-pointer"
            >
              RETURN TO WORKS
            </button>
            <button
              onClick={onSwitchToStudio}
              className="px-6 py-3 border border-white/30 text-white text-xs font-mono-tech tracking-widest uppercase font-semibold hover:border-white transition-colors cursor-pointer"
            >
              GO TO HOME
            </button>
          </div>
        </main>
        <Footer
          onNavigateHome={onSwitchToStudio}
          onNavigateWorks={onBack}
          onNavigateServices={onSwitchToServices}
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
  }

  // Related works — same master dataset, prefer same category then type
  const relatedWorks = allProjects
    .filter(p => p.id !== project.id)
    .sort((a, b) => {
      const score = (x: ProjectCase) =>
        (x.category === project.category ? 2 : 0) + (x.type === project.type ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, 2);

  // Admin-configurable hero framing with sensible fallbacks
  const heroPosition = project.heroPosition || (project.aspectRatio === 'portrait' ? 'center 20%' : 'center center');
  const heroVideoPoster = project.videoPoster || project.heroVideoPoster || project.coverImage;

  return (
    <div className="min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] flex flex-col">
      <Header
        activeView="work"
        onLogoClick={onSwitchToStudio}
        onOpenWork={onBack}
        onOpenServices={onSwitchToServices}
        onOpenAbout={() => { onSwitchToStudio(); setTimeout(() => document.getElementById('section-about')?.scrollIntoView(), 100); }}
        onOpenContact={onStartProject}
        onOpenWeddings={onSwitchToWeddings}
      />

      <main className="flex-1 w-full pt-28 sm:pt-32 pb-0">

        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 mb-12 md:mb-16">
          <button
            onClick={() => { soundEngine.playClick(); onBack(); }}
            className="group flex items-center gap-3 text-xs font-mono-tech tracking-widest uppercase text-[var(--fx-gray)] hover:text-[var(--fx-white)] transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            BACK TO WORKS
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            <div className="lg:col-span-8">
               <div className="flex items-center gap-4 mb-6">
                 <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[var(--fx-yellow)] uppercase border border-[var(--fx-yellow)]/30 px-3 py-1 rounded-full bg-[var(--fx-yellow)]/5">
                   {project.categoryLabel || project.category}
                 </span>
                 <span className="text-[10px] font-mono-tech tracking-widest text-[var(--fx-gray)]">
                   {project.year || ''}
                 </span>
               </div>
               <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial font-normal uppercase tracking-tight text-[var(--fx-white)] leading-none mb-6">
                 {project.title}
               </h1>
            </div>
            <div className="lg:col-span-4 pb-2">
              <p className="text-sm sm:text-base font-light tracking-wide text-[var(--fx-gray)] leading-relaxed">
                {project.summary}
              </p>
              {project.socialUrl && (
                <div className="mt-5">
                  <a
                    href={project.socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full text-xs font-mono-tech tracking-widest uppercase transition-all duration-200 shadow-lg font-bold cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>{project.socialLabel || (project.type === 'video' ? 'WATCH REELS ON FACEBOOK' : 'VIEW ALBUM ON FACEBOOK')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HERO MEDIA */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] max-h-[78vh] bg-[#0d0d0d] mb-16 md:mb-24 overflow-hidden relative border-y border-white/10">
          {project.videoUrl && !(project.videoUrl.endsWith('.webm') && deviceIsIOS) ? (
            <video
              src={encodeURI(project.videoUrl)}
              autoPlay
              muted
              loop
              playsInline
              poster={heroVideoPoster ? encodeURI(heroVideoPoster) : undefined}
              style={{ objectPosition: heroPosition }}
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <img
              src={encodeURI(project.coverImage)}
              alt={project.title}
              style={{ objectPosition: heroPosition }}
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* STORY / DETAILS */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 mb-20 md:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

            {/* Left: Metadata */}
            <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-8 border-t border-[var(--fx-border-dark)] pt-8">
              {project.client && (
                <div>
                  <h4 className="text-[10px] font-mono-tech tracking-widest text-[var(--fx-gray)] uppercase mb-2">Client</h4>
                  <p className="text-sm font-light tracking-wide text-[var(--fx-white)] uppercase">{project.client}</p>
                </div>
              )}

              {project.deliverables && project.deliverables.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono-tech tracking-widest text-[var(--fx-gray)] uppercase mb-3">Deliverables</h4>
                  <ul className="flex flex-col gap-2">
                    {project.deliverables.map((item, i) => (
                      <li key={i} className="text-sm font-light tracking-wide text-[var(--fx-white)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--fx-yellow)] rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.tags && project.tags.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono-tech tracking-widest text-[var(--fx-gray)] uppercase mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono-tech tracking-widest text-[var(--fx-gray)] bg-white/5 border border-[var(--fx-border-dark)] px-3 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col gap-10">
                 {project.challenge && (
                  <div>
                    <h3 className="text-2xl font-editorial uppercase text-[var(--fx-white)] mb-4">The Challenge</h3>
                    <p className="text-base md:text-lg font-light tracking-wide text-[var(--fx-gray)] leading-relaxed whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                 )}
                 {project.solution && (
                  <div>
                    <h3 className="text-2xl font-editorial uppercase text-[var(--fx-white)] mb-4">The Solution</h3>
                    <p className="text-base md:text-lg font-light tracking-wide text-[var(--fx-gray)] leading-relaxed whitespace-pre-line">
                      {project.solution}
                    </p>
                  </div>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* OFFICIAL SOCIAL REELS & POSTS (FACEBOOK & INSTAGRAM) */}
        {project.socialPosts && project.socialPosts.length > 0 && (() => {
          const reels = project.socialPosts.filter(p => p.type === 'reel' || p.type === 'video');
          const photos = project.socialPosts.filter(p => p.type === 'post' || p.type === 'album');
          const hasBoth = reels.length > 0 && photos.length > 0;

          const renderSocialCard = (post: SocialPostItem, pIdx: number) => {
            const isInstagram = post.url.includes('instagram.com');
            const isPhoto = post.type === 'post' || post.type === 'album';

            return (
              <a
                key={pIdx}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/post flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-sm transition-all duration-200 cursor-pointer ${
                  isInstagram
                    ? 'hover:bg-[#E1306C]/15 hover:border-[#E1306C]/60'
                    : 'hover:bg-[#1877F2]/15 hover:border-[#1877F2]/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-sm bg-black/80 border flex items-center justify-center flex-shrink-0 transition-colors ${
                    isInstagram
                      ? 'border-white/10 group-hover/post:border-[#E1306C]/60 text-[#E1306C]'
                      : 'border-white/10 group-hover/post:border-[#1877F2]/60 text-[#1877F2]'
                  }`}>
                    {isInstagram ? (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium text-white transition-colors truncate ${
                      isInstagram ? 'group-hover/post:text-[#ff6b9d]' : 'group-hover/post:text-[#4ea0ff]'
                    }`}>
                      {post.name}
                    </p>
                    <span className="text-[10px] font-mono-tech text-gray-500 uppercase tracking-wider block">
                      {isInstagram ? (isPhoto ? 'INSTAGRAM POST ↗' : 'INSTAGRAM REEL ↗') : (isPhoto ? 'FACEBOOK ALBUM ↗' : 'FACEBOOK REEL ↗')}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover/post:text-white group-hover/post:translate-x-0.5 group-hover/post:-translate-y-0.5 transition-transform flex-shrink-0 ml-2" />
              </a>
            );
          };

          return (
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 mb-16 md:mb-20">
              <div className="p-6 sm:p-8 bg-[#0a0a0a] border border-white/15 rounded-sm space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center -space-x-2">
                      <div className="w-9 h-9 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] z-10">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#E1306C]/20 border border-[#E1306C]/40 flex items-center justify-center text-[#E1306C]">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-editorial uppercase text-white tracking-wide">
                        Verified Facebook & Instagram Releases
                      </h3>
                      <p className="text-xs font-mono-tech text-gray-400 mt-0.5">
                        Watch verified 4K cinema reels and explore full high-res photo albums directly on CreativeFX
                      </p>
                    </div>
                  </div>

                  {project.socialUrl && (
                    <a
                      href={project.socialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-sm text-xs font-mono-tech tracking-widest uppercase transition-colors self-start sm:self-auto font-bold shadow-lg cursor-pointer"
                    >
                      <span>{project.socialLabel || 'VIEW ALL ON SOCIAL'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {hasBoth ? (
                  <div className="space-y-6">
                    {/* Cinema Reels Section */}
                    {reels.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-mono-tech tracking-widest text-[var(--fx-yellow)] uppercase">
                          <Film className="w-4 h-4" />
                          <span>CINEMA VIDEO REELS ({reels.length})</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {reels.map((post, pIdx) => renderSocialCard(post, pIdx))}
                        </div>
                      </div>
                    )}

                    {/* Photo Shoot Albums Section */}
                    {photos.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs font-mono-tech tracking-widest text-[#4ea0ff] uppercase">
                          <Camera className="w-4 h-4" />
                          <span>PHOTO SHOOT ALBUMS ({photos.length})</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {photos.map((post, pIdx) => renderSocialCard(post, pIdx))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {project.socialPosts.map((post, pIdx) => renderSocialCard(post, pIdx))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* GALLERY */}
        {project.gallery && toGalleryItems(project.gallery).length > 0 && (
          <div className="project-gallery max-w-7xl mx-auto px-6 sm:px-8 md:px-12 mb-24 md:mb-32">
            <div className="mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-editorial uppercase text-white tracking-wider">
                Project Gallery ({toGalleryItems(project.gallery).length} Frames)
              </h3>
              <span className="text-[11px] font-mono-tech tracking-widest text-gray-400 uppercase hidden sm:inline">
                Click any photo to expand
              </span>
            </div>
            <GalleryGrid project={project} />
          </div>
        )}

        {/* RELATED WORK */}
        {relatedWorks.length > 0 && (
          <div className="w-full border-t border-[var(--fx-border-dark)] pt-20 pb-20 px-6 sm:px-8 md:px-12 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                <h3 className="text-3xl md:text-4xl font-editorial uppercase tracking-tight text-[var(--fx-white)]">
                  More Selected Work
                </h3>
                <button
                  onClick={onBack}
                  className="group flex items-center gap-3 text-xs font-mono-tech tracking-widest uppercase text-[var(--fx-gray)] hover:text-[var(--fx-white)] transition-colors cursor-pointer"
                >
                  VIEW ALL WORKS
                  <ArrowLeft className="w-4 h-4 transform group-hover:translate-x-1 transition-transform rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedWorks.map((rw) => (
                  <div
                    key={rw.id}
                    onClick={() => {
                      soundEngine.playClick();
                      window.history.pushState(null, '', `/#!project=${rw.slug}`);
                      window.dispatchEvent(new Event('hashchange'));
                      resetGlobalScroll();
                    }}
                    className="group cursor-pointer bg-[#0a0a0a] border border-white/10 hover:border-[var(--fx-yellow)]/60 p-4 transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black mb-4 border border-white/10 rounded-sm">
                      <img
                        src={encodeURI(rw.coverImage)}
                        alt={rw.title}
                        loading="lazy"
                        style={{ objectPosition: rw.heroPosition || 'center center' }}
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono-tech tracking-widest text-gray-500 uppercase">{rw.categoryLabel || rw.category}</span>
                    <h4 className="text-xl font-editorial uppercase text-white group-hover:text-[var(--fx-yellow)] transition-colors mt-1">{rw.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <FinalCtaSection onStartProject={onStartProject} />
      </main>

      <Footer
        onNavigateHome={onSwitchToStudio}
        onNavigateWorks={onBack}
        onNavigateServices={onSwitchToServices}
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
