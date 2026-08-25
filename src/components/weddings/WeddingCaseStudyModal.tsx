import React, { useEffect, useState } from 'react';
import { X, ArrowRight, ArrowLeft, ArrowUpRight, Camera, Film, MapPin, Calendar, Check, Play, ZoomIn, Images } from 'lucide-react';
import { WeddingStory } from '../../types';
import { useContent } from '../../context/ContentContext';
import { soundEngine } from '../../utils/audio';
import { WeddingLightboxModal } from './WeddingLightboxModal';

interface WeddingCaseStudyModalProps {
  story: WeddingStory;
  onClose: () => void;
  onSelectStory: (story: WeddingStory) => void;
  onInquire: () => void;
  onPlayFilm?: (story: WeddingStory) => void;
}

export const WeddingCaseStudyModal: React.FC<WeddingCaseStudyModalProps> = ({
  story,
  onClose,
  onSelectStory,
  onInquire,
  onPlayFilm,
}) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIdx === null) {
        soundEngine.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, lightboxIdx]);

  const { content } = useContent();
  const publishedStories = (content.weddingStories || []).filter(s => (s.status ?? 'published') === 'published');
  const currentIndex = Math.max(0, publishedStories.findIndex((s) => s.id === story.id));
  const nextStory = publishedStories[(currentIndex + 1) % publishedStories.length];
  const prevStory = publishedStories[(currentIndex - 1 + publishedStories.length) % publishedStories.length];

  const galleryImages = story.gallery.map((g) => ({ url: g.url, caption: g.caption }));

  return (
    <>
      {lightboxIdx !== null && (
        <WeddingLightboxModal
          images={galleryImages}
          startIdx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      <div
        id="wedding-case-study-overlay"
        className="fixed inset-0 z-50 overflow-y-auto bg-[var(--fx-black)] text-[var(--fx-white)] animate-in fade-in duration-300"
      >
        {/* Sticky Top Header Navigation */}
        <div className="sticky top-0 z-40 w-full bg-[var(--fx-black)]/95 backdrop-blur-md border-b border-white/10 px-6 sm:px-12 py-5 flex justify-between items-center select-none">
          
          <div className="flex items-center gap-3">
            <span className="font-editorial font-bold text-xl sm:text-2xl tracking-wider text-[var(--fx-yellow)]">
              CREATIVEFX
            </span>
            <span className="text-xs font-mono-tech tracking-[0.25em] text-white/60 uppercase hidden sm:inline">
              // WEDDING ARCHIVE — {story.couple}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--fx-yellow)] text-black hover:bg-white text-xs font-mono-tech uppercase tracking-widest font-bold transition-all cursor-pointer rounded-sm"
            >
              <span>CLOSE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>        {/* Main Case Study Article Body */}
        <article className="w-full max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-14 select-none">
          
          {/* Story Metadata Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono-tech tracking-[0.25em] text-[var(--fx-yellow)] uppercase mb-3 font-bold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white" />
                {story.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white" />
                {story.date}
              </span>
              <span>•</span>
              <span>VENUE: {story.venue}</span>
            </div>

            <h1 className="font-editorial font-normal text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.05] tracking-tight uppercase text-white mb-4">
              {story.couple}
            </h1>

            <p className="font-serif italic text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed border-l-2 border-[var(--fx-yellow)] pl-5 my-5">
              "{story.storyQuote}"
            </p>
          </div>

          {/* Hero Archival Portrait with Click-to-Zoom */}
          <div
            onClick={() => setLightboxIdx(0)}
            className="relative w-full h-[360px] sm:h-[480px] md:h-[540px] bg-black overflow-hidden mb-12 sm:mb-16 border border-white/20 rounded-xl cursor-zoom-in group shadow-2xl"
          >
            <img
              src={story.heroImage}
              alt={story.couple}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono-tech text-white flex items-center gap-2">
              <ZoomIn className="w-3.5 h-3.5 text-[var(--fx-yellow)]" />
              <span>CLICK TO OPEN FULLSCREEN</span>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-[10px] sm:text-xs font-mono-tech tracking-widest text-white uppercase bg-black/80 px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20 rounded-sm">
              {story.couple} // WEDDING PHOTOGRAPHY BY CREATIVEFX
            </div>
          </div>

          {/* Narrative Paragraphs & Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 mb-16 sm:mb-20">
            
            {/* Left Narrative */}
            <div className="md:col-span-8 flex flex-col gap-5 text-sm sm:text-base text-white/80 leading-relaxed font-tech">
              {story.storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Right Technical Details */}
            <div className="md:col-span-4 flex flex-col gap-4 border border-white/20 p-5 sm:p-6 bg-white/5 rounded-xl h-fit">
              <span className="text-xs font-mono-tech tracking-[0.25em] text-[var(--fx-yellow)] uppercase border-b border-white/10 pb-2.5 font-bold">
                COVERAGE HIGHLIGHTS
              </span>

              <div className="text-xs sm:text-sm font-mono-tech tracking-wider text-white/80 flex flex-col gap-3.5">
                <div>
                  <span className="block text-[10px] text-white/50 uppercase font-bold mb-0.5">PHOTOGRAPHY</span>
                  <span className="text-white font-semibold">{story.details.photographer}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-white/50 uppercase font-bold mb-0.5">CINEMATOGRAPHY</span>
                  <span className="text-white font-semibold">{story.details.cinematographer}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-white/50 uppercase font-bold mb-0.5">CAMERA SETUP</span>
                  <span className="text-white font-semibold">{story.details.cameraFormat}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-white/50 uppercase font-bold mb-0.5">DELIVERABLES</span>
                  <span className="text-white font-semibold">{story.details.deliveredFrames}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Curated Archival Gallery with Interactive Lightbox Grid */}
          <div className="mb-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
              <span className="text-xs sm:text-sm font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase font-bold flex items-center gap-2">
                <Images className="w-4 h-4" />
                <span>GALLERY // REAL WEDDING PHOTOS</span>
              </span>
              <span className="text-xs sm:text-sm font-mono-tech tracking-widest text-white/60 uppercase font-bold">
                {story.gallery.length} PHOTOS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {story.gallery.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIdx(idx)}
                  className={`relative overflow-hidden bg-black border border-white/15 rounded-sm cursor-zoom-in group shadow-xl ${
                    img.aspect === 'landscape' ? 'md:col-span-2 h-[420px] sm:h-[560px]' : 'h-[480px] sm:h-[580px]'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.caption || story.couple}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Zoom Badge on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/85 rounded-full p-4 border border-[var(--fx-yellow)] text-[var(--fx-yellow)] flex items-center gap-2 text-xs font-mono-tech font-bold uppercase tracking-widest">
                      <ZoomIn className="w-4 h-4" />
                      <span>CLICK TO VIEW FULL PHOTO</span>
                    </div>
                  </div>

                  {img.caption && (
                    <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 bg-black/85 backdrop-blur-sm text-xs font-mono-tech tracking-widest text-white uppercase border-t border-white/10 font-semibold">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Case Study Footer */}
          <div className="border-t border-white/15 pt-14 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            
            <div>
              <span className="text-xs font-mono-tech tracking-[0.25em] text-[var(--fx-yellow)] uppercase block mb-1 font-bold">
                REAL WEDDING STORY
              </span>
              <span className="font-editorial font-bold text-2xl sm:text-3xl uppercase tracking-wider text-white">
                {story.couple} — {story.location}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playOpen();
                onInquire();
              }}
              className="px-8 py-4 bg-[var(--fx-yellow)] text-black hover:bg-white text-xs sm:text-sm font-mono-tech uppercase tracking-[0.25em] font-bold transition-all cursor-pointer self-stretch sm:self-auto text-center rounded-sm shadow-xl hover:scale-105"
            >
              BOOK YOUR WEDDING DATE
            </button>

          </div>

        </article>
      </div>
    </>
  );
};
