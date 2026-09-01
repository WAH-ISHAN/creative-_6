import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface WeddingLightboxModalProps {
  images: { url: string; caption?: string }[];
  startIdx?: number;
  onClose: () => void;
}

export const WeddingLightboxModal: React.FC<WeddingLightboxModalProps> = ({
  images,
  startIdx = 0,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(startIdx);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, images.length]);

  const handleNext = () => {
    soundEngine.playClick();
    setIsZoomed(false);
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    soundEngine.playClick();
    setIsZoomed(false);
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentItem = images[currentIdx];
  if (!currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 md:p-8 animate-in fade-in duration-300 select-none"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div
        className="w-full max-w-7xl mx-auto flex items-center justify-between z-50 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-editorial font-bold text-lg sm:text-xl tracking-wider text-[var(--fx-yellow)]">
            CREATIVEFX
          </span>
          <span className="text-xs font-mono-tech tracking-[0.2em] text-white/50 uppercase">
            // FRAME {String(currentIdx + 1).padStart(2, '0')} OF {String(images.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          <a
            href={currentItem.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Open Original"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-[var(--fx-yellow)] hover:text-black text-xs font-mono-tech tracking-widest uppercase transition-all cursor-pointer text-white font-bold"
          >
            <span>CLOSE</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Next/Prev */}
      <div
        className="relative flex-1 flex items-center justify-center w-full max-w-7xl mx-auto my-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/20 text-white transition-all duration-200 cursor-pointer backdrop-blur-md shadow-2xl"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Center High-Res Image */}
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-auto">
          <img
            loading="lazy"
            decoding="async"
            key={currentItem.url}
            src={currentItem.url}
            alt={currentItem.caption || 'Wedding Archival Frame'}
            className={`max-w-full max-h-[75vh] object-contain transition-all duration-300 drop-shadow-2xl ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[var(--fx-yellow)] hover:text-black border border-white/20 text-white transition-all duration-200 cursor-pointer backdrop-blur-md shadow-2xl"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>

      {/* Bottom Caption & Thumbnail Strip */}
      <div
        className="w-full max-w-5xl mx-auto flex flex-col items-center gap-3 z-50 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.caption && (
          <p className="text-xs sm:text-sm font-tech text-white/90 font-medium tracking-wide max-w-2xl px-4">
            {currentItem.caption}
          </p>
        )}

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setIsZoomed(false);
                  setCurrentIdx(idx);
                }}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  currentIdx === idx
                    ? 'border-[var(--fx-yellow)] scale-110 shadow-[0_0_12px_rgba(252,191,19,0.8)]'
                    : 'border-white/20 opacity-50 hover:opacity-100'
                }`}
              >
                <img
            loading="lazy"
            decoding="async"
                  src={img.url}
                  alt={`Thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
