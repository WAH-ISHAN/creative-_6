import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Play, ZoomIn, Images, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { WeddingStory } from '../../types';
import { soundEngine } from '../../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface WeddingSelectedStoriesProps {
  onSelectStory: (story: WeddingStory) => void;
  onPlayFilm: (story: WeddingStory) => void;
  onOpenLightbox?: (images: { url: string; caption?: string }[], startIdx?: number) => void;
}

export const WeddingSelectedStories: React.FC<WeddingSelectedStoriesProps> = ({
  onSelectStory,
  onPlayFilm,
  onOpenLightbox,
}) => {
  const { content } = useContent();
  const stories = (content.weddingStories || []).filter(s => (s.status ?? 'published') === 'published');
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRefs = useRef<HTMLDivElement[]>([]);

  const addToStoryRefs = (el: HTMLDivElement | null) => {
    if (el && !storyRefs.current.includes(el)) {
      storyRefs.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      storyRefs.current.forEach((storyEl) => {
        const imageEl = storyEl.querySelector('.story-image-reveal');
        const textEl = storyEl.querySelector('.story-text-reveal');

        if (imageEl) {
          gsap.fromTo(
            imageEl,
            { clipPath: 'inset(100% 0 0 0)', scale: 1.08, opacity: 0.8 },
            {
              clipPath: 'inset(0% 0 0 0)',
              scale: 1,
              opacity: 1,
              duration: 1.4,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: storyEl,
                start: 'top 75%',
              }
            }
          );
        }

        if (textEl) {
          gsap.fromTo(
            textEl,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: storyEl,
                start: 'top 70%',
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="wedding-selected-stories"
      className="relative w-full bg-[var(--fx-black)] text-[var(--fx-white)] py-24 sm:py-36 px-6 sm:px-10 md:px-14 lg:px-16 select-none border-t border-white/10 no-parallax"
    >
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-20 sm:mb-28 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs sm:text-sm font-mono-tech tracking-[0.3em] font-bold text-[var(--fx-yellow)] flex items-center gap-2 mb-3">
              <span>02</span>
              <span>/ FEATURED REAL WEDDINGS</span>
            </span>
            <h2 className="font-editorial font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white">
              REAL WEDDINGS &<br />
              <span className="text-[var(--fx-yellow)]">LOVE STORIES.</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-white/70 max-w-sm font-tech leading-relaxed">
            Every celebration captured with warm natural colors, candid storytelling, and timeless cinema films.
          </p>
        </div>

        {/* Alternating Stories */}
        {stories.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-sm">
            <p className="text-lg font-editorial text-white/60 uppercase">No published wedding stories yet</p>
            <p className="text-xs font-mono-tech text-white/40 mt-2 uppercase">Add stories in Admin → Weddings → Stories</p>
          </div>
        ) : (
        <div className="flex flex-col gap-28 sm:gap-36">
          {stories.map((story, index) => {
            const isImageLeft = index % 2 === 0;
            const galleryImages = story.gallery.map((g) => ({ url: g.url, caption: g.caption }));

            return (
              <div
                key={story.id}
                ref={addToStoryRefs}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                {/* Image Column */}
                <div
                  className={`lg:col-span-7 ${
                    isImageLeft ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div
                    onClick={() => {
                      if (onOpenLightbox) {
                        onOpenLightbox(galleryImages, 0);
                      } else {
                        soundEngine.playOpen();
                        onSelectStory(story);
                      }
                    }}
                    className="story-image-reveal relative w-full h-[460px] sm:h-[600px] lg:h-[660px] overflow-hidden bg-black cursor-zoom-in group border border-white/20 rounded-sm shadow-2xl"
                  >
                    <img
                      src={encodeURI(story.heroImage)}
                      alt={story.couple}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Lightbox Badge */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-mono-tech tracking-widest text-white uppercase font-bold">
                      <Images className="w-3.5 h-3.5 text-[var(--fx-yellow)]" />
                      <span>{story.gallery.length} REAL WEDDING PHOTOS</span>
                    </div>

                    {/* Floating Film Reel Trigger */}
                    {story.videoUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playClick();
                          onPlayFilm(story);
                        }}
                        className="absolute bottom-6 right-6 z-20 flex items-center gap-2.5 bg-[var(--fx-yellow)] text-black hover:bg-white px-4 py-2.5 rounded-full text-xs font-mono-tech tracking-widest uppercase font-bold transition-all cursor-pointer shadow-2xl hover:scale-105"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>PLAY 4K CINEMA FILM</span>
                      </button>
                    )}

                    {/* Bottom Photos Trigger Banner */}
                    <div className="absolute bottom-6 left-6 text-xs font-mono-tech tracking-widest text-white/90 uppercase hidden sm:flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-sm border border-white/20">
                      <ZoomIn className="w-4 h-4 text-[var(--fx-yellow)]" />
                      <span>CLICK TO VIEW ALL PHOTOS</span>
                    </div>
                  </div>

                  {/* Thumbnail Row under main photo */}
                  <div className="grid grid-cols-4 gap-2.5 mt-3">
                    {story.gallery.slice(0, 4).map((g, thumbIdx) => (
                      <div
                        key={thumbIdx}
                        onClick={() => onOpenLightbox && onOpenLightbox(galleryImages, thumbIdx)}
                        className="relative h-20 sm:h-24 overflow-hidden bg-black border border-white/10 hover:border-[var(--fx-yellow)] rounded-sm cursor-zoom-in group transition-all"
                      >
                        <img
                          src={encodeURI(g.url)}
                          alt={g.caption || story.couple}
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                        />
                        {thumbIdx === 3 && story.gallery.length > 4 && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs font-mono-tech font-bold text-[var(--fx-yellow)]">
                            +{story.gallery.length - 4} MORE
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative Typography Column */}
                <div
                  className={`story-text-reveal lg:col-span-5 flex flex-col justify-center ${
                    isImageLeft ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'
                  }`}
                >
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-mono-tech tracking-[0.25em] text-[var(--fx-yellow)] uppercase mb-4 font-bold">
                    <span>{story.storyNumber}</span>
                    <span className="w-8 h-[1px] bg-[var(--fx-yellow)]" />
                    <span>{story.location}</span>
                  </div>

                  <h3
                    onClick={() => {
                      soundEngine.playOpen();
                      onSelectStory(story);
                    }}
                    className="font-editorial font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-tight uppercase text-white mb-6 hover:text-[var(--fx-yellow)] cursor-pointer transition-colors"
                  >
                    {story.couple}
                  </h3>

                  <div className="text-xs sm:text-sm font-mono-tech tracking-widest text-white/80 uppercase mb-6 block border-l-2 border-[var(--fx-yellow)] pl-3 font-semibold">
                    VENUE // {story.venue} • {story.date}
                  </div>

                  <p className="text-base sm:text-lg text-white/80 font-tech leading-relaxed mb-8">
                    {story.storyParagraphs[0]}
                  </p>

                  {/* Highlights List */}
                  <div className="flex flex-col gap-3 mb-10 bg-white/5 border border-white/10 p-5 rounded-sm">
                    {story.highlights.map((h, i) => (
                      <div key={i} className="text-sm sm:text-base font-tech text-white/90">
                        <span className="font-mono-tech text-xs text-[var(--fx-yellow)] tracking-wider uppercase font-bold mr-2">
                          [{h.title}]
                        </span>
                        {h.desc}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onOpenLightbox && onOpenLightbox(galleryImages, 0)}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[var(--fx-yellow)] text-black hover:bg-white font-mono-tech font-bold text-xs sm:text-sm tracking-widest uppercase transition-all cursor-pointer rounded-sm shadow-xl"
                    >
                      <Images className="w-4 h-4" />
                      <span>VIEW ALL PHOTOS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playOpen();
                        onSelectStory(story);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3.5 border border-white/30 hover:border-white text-white hover:text-[var(--fx-yellow)] font-mono-tech font-bold text-xs sm:text-sm tracking-widest uppercase transition-all cursor-pointer rounded-sm"
                    >
                      <span>READ FULL STORY</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

      </div>
    </section>
  );
};
