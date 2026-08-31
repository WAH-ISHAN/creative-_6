import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { WeddingStory } from '../../types';
import { soundEngine } from '../../utils/audio';

interface WeddingFilmsSectionProps {
  onPlayFilm: (story: WeddingStory) => void;
}

export const WeddingFilmsSection: React.FC<WeddingFilmsSectionProps> = ({ onPlayFilm }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { content } = useContent();
  const publishedStories = (content.weddingStories || []).filter(s => (s.status ?? 'published') === 'published');
  const featuredFilmStory =
    publishedStories.find(s => !!s.videoUrl) || publishedStories[0];
  const posterSrc = featuredFilmStory?.videoPoster || featuredFilmStory?.coverImage || '';

  const toggleSound = () => {
    soundEngine.playClick();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      id="wedding-films-section"
      className="relative w-full bg-[var(--fx-black)] text-[var(--fx-white)] py-24 sm:py-36 px-6 sm:px-10 md:px-14 lg:px-16 select-none border-t border-white/10 no-parallax"
    >
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 sm:mb-16">
          <div>
            <span className="text-xs sm:text-sm font-mono-tech tracking-[0.3em] font-bold text-[var(--fx-yellow)] flex items-center gap-2 mb-3">
              <span>04</span>
              <span>/ 4K WEDDING CINEMA FILM</span>
            </span>
            <h2 className="font-editorial font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white">
              THE MOVING<br />
              <span className="text-[var(--fx-yellow)]">CINEMA FRAME.</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSound}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black/80 hover:bg-white hover:text-black border border-white/30 text-white text-xs font-mono-tech font-bold tracking-widest uppercase transition-all rounded-sm shadow-xl cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[var(--fx-yellow)]" />}
              <span>{isMuted ? 'UNMUTE SOUND' : 'MUTED'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playOpen();
                if (featuredFilmStory) onPlayFilm(featuredFilmStory);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--fx-yellow)] text-black hover:bg-white text-xs font-mono-tech font-bold tracking-widest uppercase transition-all rounded-sm shadow-xl cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>FULLSCREEN 4K</span>
            </button>
          </div>
        </div>

        {/* Big Live Auto-Playing Video Reel Frame */}
        <div className="relative w-full h-[460px] sm:h-[600px] lg:h-[720px] bg-black border border-white/20 rounded-sm overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
          {featuredFilmStory?.videoUrl ? (
            <video
              ref={videoRef}
              src={featuredFilmStory.videoUrl}
              poster={posterSrc || undefined}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 font-mono-tech text-xs uppercase tracking-widest">
              No wedding film published yet — add one in Admin → Weddings → Stories
            </div>
          )}

          {/* Bottom Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Bottom Telemetry Bar */}
          {featuredFilmStory && (
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex justify-between items-end z-20 border-t border-white/10 bg-black/75 backdrop-blur-md">
              <div>
                <span className="text-xs font-mono-tech tracking-widest text-[var(--fx-yellow)] uppercase block font-bold mb-1">
                  FEATURED CINEMA FILM
                </span>
                <span className="font-editorial font-bold text-xl sm:text-3xl tracking-wider text-white uppercase">
                  {featuredFilmStory.couple} — {featuredFilmStory.location}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-6 text-xs font-mono-tech tracking-widest text-white/70 uppercase font-medium">
                <span>AUDIO // ORIGINAL SOUNDTRACK</span>
                <span>QUALITY // 4K ULTRA HD</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
