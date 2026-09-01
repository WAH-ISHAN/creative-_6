import React, { useEffect } from 'react';
import { AgencyService } from '../types';
import { CornerBracket, FourCornerFrame } from './CornerBracket';
import { soundEngine } from '../utils/audio';
import { X, ArrowRight } from 'lucide-react';

interface ServiceDetailModalProps {
  service: AgencyService | null;
  onClose: () => void;
  onStartProjectForService: (serviceName: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onStartProjectForService
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!service) return null;

  return (
    <div
      id="service-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-[var(--fx-black)] text-[var(--fx-white)] animate-in fade-in duration-300"
    >
      {/* Top Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-[var(--fx-black)]/90 backdrop-blur-md border-b border-[var(--fx-light-gray)] px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-[var(--fx-white)]" />
          <span className="text-base font-mono-tech tracking-[0.25em] text-[var(--fx-white)] font-bold uppercase">
            {service.number} // {service.code}
          </span>
          <span className="text-lg font-mono-tech text-[var(--fx-gray)] uppercase hidden sm:inline-block">
            // SERVICE DISCIPLINE
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          data-cursor="cta"
          className="flex items-center gap-2 border border-[var(--fx-white)] hover:bg-[var(--fx-black)] hover:text-[var(--fx-white)] px-4 py-2 text-base font-mono-tech uppercase tracking-widest transition-colors cursor-pointer"
        >
          <span>CLOSE</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20 space-y-16 sm:space-y-20">
        
        {/* Service Header */}
        <div className="space-y-6">
          <div className="text-base font-mono-tech uppercase tracking-[0.25em] text-[var(--fx-gray)]">
            CREATIVEFX DISCIPLINE // {service.number}
          </div>

          <h1 className="text-4xl sm:text-7xl md:text-8xl font-display font-black uppercase tracking-tight text-[var(--fx-white)] leading-none">
            {service.title}
          </h1>

          <p className="text-xl sm:text-2xl font-mono-tech text-[var(--fx-white)] uppercase max-w-3xl leading-relaxed pt-2">
            {service.shortDesc}
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative border border-[var(--fx-light-gray)] bg-[#FAFAFA] overflow-hidden">
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <CornerBracket position="top-left" size={18} thickness={1.5} color="#050505" />
          </div>
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <CornerBracket position="top-right" size={18} thickness={1.5} color="#050505" />
          </div>
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <CornerBracket position="bottom-left" size={18} thickness={1.5} color="#050505" />
          </div>
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <CornerBracket position="bottom-right" size={18} thickness={1.5} color="#050505" />
          </div>

          <img
            loading="lazy"
            decoding="async"
            src={service.previewImage}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full max-h-[60vh] object-cover filter grayscale contrast-125"
          />
        </div>

        {/* Capabilities & Deliverables Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-[var(--fx-light-gray)]">
          
          {/* Left Column: Full Description & Capabilities */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-3">
              <span className="text-base font-mono-tech tracking-[0.25em] uppercase text-[var(--fx-gray)] font-bold">
                01 // STRATEGIC APPROACH
              </span>
              <p className="text-xl sm:text-lg text-[var(--fx-white)] font-sans leading-relaxed">
                {service.fullDesc}
              </p>
            </div>

            <div className="space-y-4 border-t border-[#EBEBEB] pt-8">
              <span className="text-base font-mono-tech tracking-[0.25em] uppercase text-[var(--fx-gray)] font-bold">
                02 // WHAT'S INCLUDED
              </span>
              <ul className="space-y-3">
                {service.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-baseline gap-3 text-lg sm:text-xl font-mono-tech uppercase text-[var(--fx-white)]">
                    <span className="text-[var(--fx-gray)] font-bold">0{i + 1}</span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Deliverables Box & CTA */}
          <div className="lg:col-span-5 space-y-8">
            <FourCornerFrame
              bracketSize={16}
              bracketColor="#050505"
              className="p-8 border border-[var(--fx-light-gray)] bg-[#FAFAFA] space-y-6"
            >
              <div className="border-b border-[var(--fx-light-gray)] pb-4">
                <span className="text-base font-mono-tech tracking-[0.25em] uppercase text-[var(--fx-white)] font-bold block">
                  STANDARD DELIVERABLES
                </span>
                <span className="text-lg font-mono-tech uppercase text-[var(--fx-gray)] mt-1 block">
                  {service.highlight}
                </span>
              </div>

              <ul className="space-y-2.5 text-base font-mono-tech uppercase text-[var(--fx-gray)]">
                {service.deliverables.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[var(--fx-white)] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-[var(--fx-light-gray)]">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playOpen();
                    onStartProjectForService(service.title);
                  }}
                  data-cursor="cta"
                  className="w-full bg-[var(--fx-black)] text-[var(--fx-white)] py-4 px-6 text-base font-mono-tech font-bold uppercase tracking-[0.2em] hover:bg-[#222222] transition-colors flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>INQUIRE FOR THIS SERVICE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </FourCornerFrame>
          </div>

        </div>

      </div>
    </div>
  );
};
