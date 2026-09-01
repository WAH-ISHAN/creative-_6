import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Sparkles, Check, ZoomIn } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { WeddingStory, WeddingTimelineStage } from '../../types';
import { soundEngine } from '../../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface WeddingStorySectionProps {
  onSelectStory: (story: WeddingStory) => void;
  onExploreStageDetail: (stage: WeddingTimelineStage) => void;
  onOpenLightbox?: (images: { url: string; caption?: string }[], startIdx?: number) => void;
}

export const WeddingStorySection: React.FC<WeddingStorySectionProps> = ({
  onSelectStory,
  onExploreStageDetail,
  onOpenLightbox,
}) => {
  const { content } = useContent();
  const stages = content.weddingTimeline?.length ? content.weddingTimeline : [];
  const w = content.weddings || {};
  const headlineLines = (w.timelineHeadline || 'EVERY UNFORGETTABLE\nCHAPTER OF YOUR DAY.').split('\n');

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const currentStage = stages[activeStageIndex];

  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stageImageRef = useRef<HTMLImageElement>(null);
  const stageInfoRef = useRef<HTMLDivElement>(null);

  const allStageImages = stages.map((s) => ({
    url: s.image,
    caption: `${s.stageNumber} // ${s.title} — ${s.shortDesc}`,
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
            }
          }
        );
      }

      if (progressLineRef.current && sectionRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleX: 0.1 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: true,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleStageChange = (index: number) => {
    soundEngine.playClick();
    setActiveStageIndex(index);

    if (stageImageRef.current && stageInfoRef.current) {
      gsap.fromTo(
        stageImageRef.current,
        { opacity: 0.7, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        stageInfoRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  };

  if (!currentStage) return null;

  return (
    <section
      ref={sectionRef}
      id="wedding-story-timeline"
      className="relative w-full bg-[var(--fx-black)] text-[var(--fx-white)] pt-24 sm:pt-36 pb-32 px-6 sm:px-10 md:px-14 lg:px-16 select-none border-t border-white/10 no-parallax"
    >
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Top Label */}
        <div className="mb-6">
          <span className="text-xs sm:text-sm font-mono-tech tracking-[0.3em] font-bold text-[var(--fx-yellow)] flex items-center gap-2">
            <span>01</span>
            <span>/ YOUR WEDDING DAY TIMELINE</span>
          </span>
        </div>

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-16 sm:mb-24">
          <div className="lg:col-span-8">
            <h2
              ref={headlineRef}
              className="font-editorial font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tight uppercase text-[var(--fx-white)]"
            >
              {headlineLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-base sm:text-lg text-white/80 font-tech leading-relaxed">
              {w.timelineIntro || 'We capture the real smiles, spontaneous laughter, and heartwarming moments with natural elegance from start to finish.'}
            </p>
          </div>
        </div>

        {/* Timeline Tabs */}
        <div className="relative mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stages.map((stage, idx) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleStageChange(idx)}
                className={`text-left p-4 sm:p-6 border transition-all duration-300 cursor-pointer rounded-sm ${
                  activeStageIndex === idx
                    ? 'border-[var(--fx-yellow)] bg-white/10 shadow-[0_0_20px_rgba(252,191,19,0.15)]'
                    : 'border-white/10 bg-white/5 hover:border-white/30 text-white/60 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono-tech font-bold tracking-widest text-[var(--fx-yellow)] mb-1">
                  CHAPTER {stage.stageNumber}
                </div>
                <div className="font-editorial font-bold text-lg sm:text-xl uppercase tracking-wider text-white">
                  {stage.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Stage Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center bg-white/5 border border-white/10 p-6 sm:p-10 lg:p-12 rounded-sm shadow-2xl">
          
          {/* Stage Photo with full natural rich color & Lightbox */}
          <div className="lg:col-span-7">
            <div
              onClick={() => onOpenLightbox && onOpenLightbox(allStageImages, activeStageIndex)}
              className="relative w-full h-[420px] sm:h-[520px] lg:h-[580px] overflow-hidden bg-black border border-white/20 rounded-sm cursor-zoom-in group shadow-2xl"
            >
              <img
            loading="lazy"
            decoding="async"
                ref={stageImageRef}
                src={currentStage.image}
                alt={currentStage.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Hover Zoom Hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/85 rounded-full px-5 py-3 border border-[var(--fx-yellow)] text-[var(--fx-yellow)] shadow-2xl flex items-center gap-2 text-xs font-mono-tech font-bold uppercase tracking-widest">
                  <ZoomIn className="w-5 h-5" />
                  <span>CLICK TO VIEW FULL PHOTO</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 text-xs font-mono-tech tracking-widest uppercase text-white bg-black/80 px-3.5 py-1.5 rounded-sm border border-white/20">
                {currentStage.moodNote}
              </div>
            </div>
          </div>

          {/* Stage Info & Key Moments */}
          <div ref={stageInfoRef} className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="text-xs sm:text-sm font-mono-tech tracking-[0.25em] text-[var(--fx-yellow)] uppercase font-bold">
                CHAPTER {currentStage.stageNumber}
              </div>

              <h3 className="font-editorial font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white leading-none">
                {currentStage.title}
              </h3>

              <p className="text-base sm:text-lg text-white/80 font-tech leading-relaxed">
                {currentStage.fullDesc}
              </p>

              {/* Key Moments Checklist */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="text-xs font-mono-tech tracking-widest text-[var(--fx-yellow)] uppercase font-bold">
                  WHAT WE CAPTURE:
                </div>
                {currentStage.moments.map((moment, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm sm:text-base font-tech text-white/90">
                    <Check className="w-4 h-4 text-[var(--fx-yellow)] flex-shrink-0 mt-1" />
                    <span>{moment}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Detail Button */}
            <div className="pt-8">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playOpen();
                  onExploreStageDetail(currentStage);
                }}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-[var(--fx-yellow)] text-black hover:bg-white font-mono-tech font-bold text-xs sm:text-sm tracking-widest uppercase transition-all cursor-pointer rounded-sm shadow-xl"
              >
                <span>VIEW CHAPTER DETAILS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
