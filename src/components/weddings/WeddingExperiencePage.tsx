import React, { useState, useEffect } from 'react';
import { smoothScrollTo, resetGlobalScroll } from '../../utils/scrollManager';
import { WeddingHeader } from './WeddingHeader';
import { WeddingHero } from './WeddingHero';
import { WeddingStorySection } from './WeddingStorySection';
import { WeddingSelectedStories } from './WeddingSelectedStories';
import { WeddingApproachSection } from './WeddingApproachSection';
import { WeddingFilmsSection } from './WeddingFilmsSection';
import { WeddingWhiteCta } from './WeddingWhiteCta';
import { WeddingFooter } from './WeddingFooter';
import { WeddingCaseStudyModal } from './WeddingCaseStudyModal';
import { WeddingInquiryModal } from './WeddingInquiryModal';
import { WeddingStageDetailModal } from './WeddingStageDetailModal';
import { WeddingFilmModal } from './WeddingFilmModal';
import { WeddingLightboxModal } from './WeddingLightboxModal';
import { WeddingStory, WeddingTimelineStage } from '../../types';
import { useContent } from '../../context/ContentContext';
import { soundEngine } from '../../utils/audio';
import { useSeo } from '../../utils/useSeo';

interface WeddingExperiencePageProps {
  onSwitchToStudio: () => void;
}

export const WeddingExperiencePage: React.FC<WeddingExperiencePageProps> = ({
  onSwitchToStudio,
}) => {
  const { content } = useContent();
  const stories = (content.weddingStories || []).filter(s => (s.status ?? 'published') === 'published');
  const featuredStory = stories[0] || null;

  useSeo({
    title: 'Weddings by CreativeFX — Cinematic Wedding Photography & Films',
    description: content.weddings?.heroDescription || content.seo?.description,
    image: content.weddings?.heroImage || content.seo?.ogImage,
  });
  const [selectedStory, setSelectedStory] = useState<WeddingStory | null>(null);
  const [selectedStage, setSelectedStage] = useState<WeddingTimelineStage | null>(null);
  const [activeFilmStory, setActiveFilmStory] = useState<WeddingStory | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ images: { url: string; caption?: string }[]; startIdx: number } | null>(null);

  useEffect(() => {
    resetGlobalScroll();
  }, []);

  const handleSelectStory = (story: WeddingStory) => {
    soundEngine.playOpen();
    setSelectedStory(story);
    // Use hash routing so the URL stays clean (no /weddings/slug path exposed)
    const slug = story.slug || story.id || story.couple.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    window.history.pushState({ weddingStoryId: story.id }, '', `/#!view=weddings&story=${slug}`);
  };

  const handleCloseStory = () => {
    setSelectedStory(null);
    window.history.pushState(null, '', '/#!view=weddings');
  };

  useEffect(() => {
    const syncRouteWithState = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#!view=weddings&story=')) {
        const slug = new URLSearchParams(hash.replace('#!view=weddings&', '')).get('story');
        if (slug) {
          const match = stories.find(s =>
            (s.slug && s.slug.toLowerCase() === slug) ||
            (s.id && s.id.toLowerCase() === slug) ||
            s.couple.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
          );
          if (match) {
            setSelectedStory(match);
            return;
          }
        }
      }
      setSelectedStory(null);
    };

    syncRouteWithState();
    window.addEventListener('popstate', syncRouteWithState);
    window.addEventListener('hashchange', syncRouteWithState);
    return () => {
      window.removeEventListener('popstate', syncRouteWithState);
      window.removeEventListener('hashchange', syncRouteWithState);
    };
  }, [stories]);


  const scrollToSection = (id: string) => {
    soundEngine.playClick();
    const el = document.getElementById(id);
    if (el) {
      smoothScrollTo(el);
    }
  };

  const handleOpenInquiry = () => {
    soundEngine.playOpen();
    setInquiryOpen(true);
  };

  const handleOpenLightbox = (images: { url: string; caption?: string }[], startIdx = 0) => {
    soundEngine.playOpen();
    setLightboxData({ images, startIdx });
  };

  return (
    <div className="min-h-svh bg-[var(--fx-black)] text-[var(--fx-white)] selection:bg-[var(--fx-yellow)] selection:text-black relative overflow-x-hidden">
      
      {/* Minimalist Wedding Header */}
      <WeddingHeader
        onInquire={handleOpenInquiry}
        onNavigateToStories={() => scrollToSection('wedding-selected-stories')}
        onNavigateToTimeline={() => scrollToSection('wedding-story-timeline')}
        onNavigateToApproach={() => scrollToSection('wedding-approach-section')}
        onNavigateToFilms={() => scrollToSection('wedding-films-section')}
        onSwitchToStudio={onSwitchToStudio}
      />

      {/* Main Story Flow */}
      <main className="w-full">
        
        {/* 00 / WEDDING HERO */}
        <WeddingHero
          onBeginStory={() => scrollToSection('wedding-story-timeline')}
          onExploreFeaturedStory={() => {
            if (featuredStory) handleSelectStory(featuredStory);
          }}
          onPlayReel={() => { if (featuredStory) setActiveFilmStory(featuredStory); }}
        />

        {/* 01 / STORY TIMELINE */}
        <WeddingStorySection
          onSelectStory={(story) => handleSelectStory(story)}
          onExploreStageDetail={(stage) => setSelectedStage(stage)}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 02 / SELECTED WEDDINGS */}
        <WeddingSelectedStories
          onSelectStory={(story) => handleSelectStory(story)}
          onPlayFilm={(story) => setActiveFilmStory(story)}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 03 / APPROACH & PHILOSOPHY */}
        <WeddingApproachSection />

        {/* 04 / CINEMATIC FILMS */}
        <WeddingFilmsSection
          onPlayFilm={(story) => setActiveFilmStory(story)}
        />

        {/* 05 / HIGH-CONTRAST CTA SECTION */}
        <WeddingWhiteCta onInquire={handleOpenInquiry} />

      </main>

      {/* 06 / MINIMAL BLACK FOOTER */}
      <WeddingFooter
        onNavigateToStories={() => scrollToSection('wedding-selected-stories')}
        onNavigateToTimeline={() => scrollToSection('wedding-story-timeline')}
        onNavigateToApproach={() => scrollToSection('wedding-approach-section')}
        onSwitchToStudio={onSwitchToStudio}
        onInquire={handleOpenInquiry}
      />

      {/* Lightbox Modal */}
      {lightboxData && (
        <WeddingLightboxModal
          images={lightboxData.images}
          startIdx={lightboxData.startIdx}
          onClose={() => setLightboxData(null)}
        />
      )}

      {/* Story Case Study Modal */}
      {selectedStory && (
        <WeddingCaseStudyModal
          story={selectedStory}
          onClose={handleCloseStory}
          onSelectStory={(s) => handleSelectStory(s)}
          onPlayFilm={(s) => setActiveFilmStory(s)}
          onInquire={() => {
            handleCloseStory();
            setInquiryOpen(true);
          }}
        />
      )}

      {/* Stage Detail Modal */}
      {selectedStage && (
        <WeddingStageDetailModal
          stage={selectedStage}
          onClose={() => setSelectedStage(null)}
          onInquire={() => {
            setSelectedStage(null);
            setInquiryOpen(true);
          }}
        />
      )}

      {/* Film Cinema Player Modal */}
      {activeFilmStory && (
        <WeddingFilmModal
          story={activeFilmStory}
          onClose={() => setActiveFilmStory(null)}
        />
      )}

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <WeddingInquiryModal
          onClose={() => setInquiryOpen(false)}
        />
      )}

    </div>
  );
};
