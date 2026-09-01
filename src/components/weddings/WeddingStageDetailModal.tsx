import React, { useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { WeddingTimelineStage } from '../../types';
import { soundEngine } from '../../utils/audio';

interface WeddingStageDetailModalProps {
  stage: WeddingTimelineStage;
  onClose: () => void;
  onInquire: () => void;
}

export const WeddingStageDetailModal: React.FC<WeddingStageDetailModalProps> = ({
  stage,
  onClose,
  onInquire,
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      id="wedding-stage-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-[var(--fx-black)]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-10 select-none animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-[#0A0A0A] border border-[var(--fx-border-dark)] p-6 sm:p-10 text-[var(--fx-white)] shadow-2xl">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--fx-yellow)] flex items-center justify-center text-white hover:text-black border border-white/20 transition-all cursor-pointer z-20 shadow-xl"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-6">
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-tech tracking-widest text-[#777777] uppercase">
              CHAPTER {stage.stageNumber}
            </span>
            <span className="w-8 h-[1px] bg-[var(--fx-border-dark)]" />
            <span className="text-[10px] font-mono-tech tracking-widest text-[#555555] uppercase">
              {stage.moodNote}
            </span>
          </div>

          <h2 className="font-editorial font-black text-4xl sm:text-5xl uppercase tracking-tight text-[var(--fx-white)]">
            {stage.title}
          </h2>

          {/* Image */}
          <div className="w-full h-64 sm:h-80 bg-[#111111] overflow-hidden border border-[var(--fx-border-dark)]">
            <img
            loading="lazy"
            decoding="async"
              src={stage.image}
              alt={stage.title}
              className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
              referrerPolicy="no-referrer"
            />
          </div>

          <p className="text-xs sm:text-sm text-[#AAAAAA] font-tech leading-relaxed">
            {stage.fullDesc}
          </p>

          {/* Key Captured Moments */}
          <div className="border-t border-[#1C1C1C] pt-4">
            <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#777777] uppercase block mb-3">
              PRIMARY DOCUMENTARY BEATS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stage.moments.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-tech text-[#CCCCCC]">
                  <span className="w-1.5 h-1.5 bg-[var(--fx-black)] rounded-full flex-shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-[#1C1C1C]">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono-tech tracking-widest text-[#888888] hover:text-[var(--fx-yellow)] uppercase cursor-pointer"
            >
              ← RETURN TO TIMELINE
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire();
              }}
              className="px-5 py-2.5 bg-[var(--fx-black)] text-[var(--fx-white)] text-xs font-mono-tech tracking-widest uppercase font-bold hover:bg-[#E0E0E0] cursor-pointer"
            >
              COMMISSION THIS EXPERIENCE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
