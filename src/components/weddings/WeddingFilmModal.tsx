import React, { useEffect } from 'react';
import { X, Film } from 'lucide-react';
import { WeddingStory } from '../../types';
import { soundEngine } from '../../utils/audio';
import { isDriveUrl, parseDriveUrl } from '../../utils/driveUtils';

interface WeddingFilmModalProps {
  story: WeddingStory;
  onClose: () => void;
}

export const WeddingFilmModal: React.FC<WeddingFilmModalProps> = ({ story, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const videoSrc = story.videoUrl || 'https://drive.google.com/file/d/1MHpO_xdqDku5JxV9k0TYKS-lNAOBsIhr/preview';
  const isCloud = isDriveUrl(videoSrc) || videoSrc.includes('drive.google.com') || videoSrc.includes('/preview');
  const parsed = parseDriveUrl(videoSrc);
  const embedUrl = parsed ? parsed.embedUrl : (videoSrc.includes('drive.google.com') && videoSrc.includes('/view') ? videoSrc.replace('/view', '/preview') : videoSrc);

  return (
    <div
      id="wedding-film-modal-overlay"
      className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none animate-in fade-in duration-300"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase block font-bold mb-1">
            4K WEDDING CINEMA FILM // RAVINDU & MALIKSHI
          </span>
          <span className="font-editorial font-bold text-xl sm:text-3xl tracking-wider text-white uppercase">
            {story.couple} — {story.location}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--fx-yellow)] text-black hover:bg-white text-xs font-mono-tech uppercase tracking-widest font-bold cursor-pointer transition-all rounded-sm shadow-xl"
        >
          <span>CLOSE FILM</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Video Frame */}
      <div className="relative w-full max-w-6xl mx-auto my-auto aspect-video bg-black border border-white/20 rounded-sm overflow-hidden flex items-center justify-center shadow-2xl">
        {isCloud ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={`${story.couple} Wedding Film`}
          />
        ) : (
          <video
            src={videoSrc}
            poster={story.videoPoster || story.heroImage}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Bottom Telemetry */}
      <div className="w-full max-w-6xl mx-auto pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-white/10 text-xs font-mono-tech tracking-widest text-white/70 uppercase">
        <span className="font-bold">PRODUCTION // CREATIVEFX MASTER WEDDING CINEMA UNIT</span>
        <span>LOCATION // GALLE FACE HERITAGE & OCEAN LAWN, COLOMBO</span>
      </div>
    </div>
  );
};
