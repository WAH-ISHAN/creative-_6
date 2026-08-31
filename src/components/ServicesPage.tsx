import React, { useState, useEffect } from 'react';
import { smoothScrollTo, resetGlobalScroll } from '../utils/scrollManager';
import { useContent, DEFAULT_CONTENT } from '../context/ContentContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSeo } from '../utils/useSeo';
import { AgencyService } from '../types';
import { 
  Camera, 
  Film, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  MessageCircle,
  Clock,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';

interface ServicesPageProps {
  onSwitchToStudio: () => void;
  onSwitchToWorks: (filter?: string) => void;
  onSwitchToWeddings: () => void;
  onOpenInquiry?: (serviceName?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onSwitchToStudio,
  onSwitchToWorks,
  onSwitchToWeddings,
  onOpenInquiry,
}) => {
  useSeo({
    title: 'Services & Capabilities — CreativeFX Studio',
    description: 'Commercial photography, 8K videography, motion graphics, video editing, brand design, and digital marketing solutions.',
    canonicalPath: '/services',
  });

  const { content } = useContent();
  const rawServices = (content.services && content.services.length > 0) ? content.services : DEFAULT_CONTENT.services;
  const services = (rawServices as AgencyService[]).filter(s => (s.status ?? 'published') === 'published');

  const [activeTab, setActiveTab] = useState<string>('ALL');

  useEffect(() => {
    resetGlobalScroll();
  }, []);

  const handleInquire = (serviceTitle: string) => {
    if (onOpenInquiry) {
      onOpenInquiry(serviceTitle);
    } else {
      window.location.href = `https://wa.me/94777548671?text=${encodeURIComponent(`Hi CreativeFX! I would like to inquire about ${serviceTitle}.`)}`;
    }
  };

  const processSteps = [
    {
      num: '01',
      title: 'DISCOVERY & VISION',
      desc: 'We unpack your goals, audience, and aesthetic inspirations to build a bespoke creative roadmap, moodboard, and shot list.',
      icon: Sparkles
    },
    {
      num: '02',
      title: 'PRE-PRODUCTION & LOGISTICS',
      desc: 'Location scouting, lighting architecture, talent coordination, and technical pre-visualization for seamless execution.',
      icon: Sliders
    },
    {
      num: '03',
      title: 'PRODUCTION & SHOOT DAY',
      desc: 'Cinematic 8K multi-camera coverage, high-speed lighting, and obsessive art direction on set to capture raw brilliance.',
      icon: Camera
    },
    {
      num: '04',
      title: 'POST-PRODUCTION & DELIVERY',
      desc: 'Precision timeline editing, DaVinci Resolve color grading, custom sound design, and platform-optimized master deliveries.',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] flex flex-col selection:bg-[var(--fx-yellow)] selection:text-black">
      
      {/* Universal Header */}
      <Header
        activeView="services"
        onLogoClick={onSwitchToStudio}
        onOpenWork={() => onSwitchToWorks()}
        onOpenWeddings={onSwitchToWeddings}
        onOpenAbout={() => {
          onSwitchToStudio();
          setTimeout(() => {
            const el = document.getElementById('section-about');
            if (el) smoothScrollTo(el);
          }, 150);
        }}
        onOpenContact={() => {
          onSwitchToStudio();
          setTimeout(() => {
            const el = document.getElementById('section-contact');
            if (el) smoothScrollTo(el);
          }, 150);
        }}
      />

      {/* ─── 1. HERO BANNER - mobile optimized ─── */}
      <section className="relative pt-28 sm:pt-44 md:pt-48 pb-12 sm:pb-24 px-4 sm:px-10 md:px-14 lg:px-4 md:px-16 border-b border-white/10 overflow-hidden bg-gradient-to-b from-neutral-950 via-[#060606] to-[#050505]">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--fx-yellow)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--fx-yellow)] animate-pulse" />
            <span className="text-xs sm:text-sm font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase font-bold">
              02 // STUDIO CAPABILITIES & DISCIPLINES
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-editorial text-[32px] sm:text-2xl md:text-4xl md:text-6xl md:text-7xl lg:text-8xl font-normal uppercase tracking-tight text-white leading-[0.92]">
                FULL-SERVICE<br />
                <span className="text-[var(--fx-yellow)]">CREATIVE PRODUCTION.</span>
              </h1>
            </div>

            <div className="lg:col-span-4">
              <p className="font-tech text-[14px] sm:text-lg text-white/80 leading-relaxed">
                From high-fashion photography and 8K cinema to motion graphics, brand identity, and performance digital campaigns—we build visual assets that command attention.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. SERVICES COMPREHENSIVE LIST ─── */}
      <section className="py-10 sm:py-28 px-4 sm:px-10 md:px-14 lg:px-4 md:px-16 max-w-7xl mx-auto w-full space-y-8 sm:space-y-24">
        
        {services.map((service, index) => {
          const isEven = index % 2 === 1;
          const serviceNumber = String(index + 1).padStart(2, '0');

          return (
            <div 
              key={service.id || index}
              id={`service-${service.id}`}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 items-center p-4 sm:p-10 lg:p-14 bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl sm:rounded-lg shadow-2xl group"
            >
              {/* Image / Media Column */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-md bg-black border border-white/15 group-hover:border-[var(--fx-yellow)]/50 transition-colors shadow-2xl">
                  <img
                    src={service.previewImage || '/img/Products/Zova Clothing/DSC06381.webp'}
                    alt={service.title}
                    className="w-full h-full object-cover filter grayscale contrast-110 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-mono-tech tracking-widest text-[var(--fx-yellow)] rounded-sm font-bold">
                    DISCIPLINE // {serviceNumber}
                  </div>
                  {service.highlight && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md border border-white/15 p-3 text-xs font-mono-tech tracking-wide text-white/90 rounded-sm flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--fx-yellow)] flex-shrink-0" />
                      <span className="truncate">{service.highlight}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Text & Deliverables Column */}
              <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="space-y-3">
                  <span className="text-xs font-mono-tech tracking-[0.25em] text-white/50 uppercase">
                    SERVICE CODE: {service.code || `SRV-${serviceNumber}`}
                  </span>
                  <h2 className="font-editorial text-xl md:text-3xl sm:text-2xl md:text-4xl md:text-5xl font-bold uppercase text-white leading-tight">
                    {service.title}
                  </h2>
                </div>

                <p className="font-tech text-base sm:text-lg text-white/80 leading-relaxed">
                  {service.fullDesc || service.description || service.shortDesc}
                </p>

                {/* Capabilities Checklist */}
                {service.capabilities && service.capabilities.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-mono-tech tracking-widest text-[var(--fx-yellow)] uppercase font-bold block">
                      CORE CAPABILITIES & SPECIALIZATIONS:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
                      {service.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-tech text-white/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--fx-yellow)] flex-shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-md space-y-2">
                    <span className="text-[11px] font-mono-tech tracking-widest text-white/60 uppercase block">
                      TYPICAL CLIENT DELIVERABLES:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {service.deliverables.map((del, i) => (
                        <span key={i} className="text-xs font-tech bg-black/60 border border-white/10 px-2.5 py-1 rounded text-white/80">
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => handleInquire(service.title)}
                    className="inline-flex items-center gap-2 bg-[var(--fx-yellow)] hover:bg-white text-black font-mono-tech text-xs tracking-widest font-bold px-6 py-3 rounded-sm transition-all duration-300 uppercase shadow-md cursor-pointer"
                  >
                    <span>INQUIRE FOR PRICING</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchToWorks(service.id)}
                    className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-mono-tech text-xs tracking-widest px-5 py-3 rounded-sm transition-colors uppercase cursor-pointer"
                  >
                    <span>VIEW RELATED WORKS</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}

      </section>

      {/* ─── 3. OUR PRODUCTION WORKFLOW PROCESS ─── */}
      <section className="py-10 md:py-20 sm:py-28 px-6 sm:px-10 md:px-14 lg:px-4 md:px-16 border-t border-white/10 bg-[#060606]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono-tech tracking-[0.25em] text-[var(--fx-yellow)] uppercase font-bold">
              THE CREATIVE PROTOCOL
            </span>
            <h2 className="font-editorial text-xl md:text-3xl sm:text-xl md:text-3xl md:text-5xl md:text-6xl uppercase font-bold text-white leading-tight">
              FROM CONCEPT TO SCREEN.
            </h2>
            <p className="font-tech text-sm sm:text-base text-white/70">
              A disciplined, high-velocity creative framework designed to eliminate friction and guarantee cinematic perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#0a0a0a] border border-white/10 hover:border-[var(--fx-yellow)]/50 p-8 rounded-lg space-y-6 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-editorial font-bold text-xl md:text-3xl text-[var(--fx-yellow)]">
                      {step.num}
                    </span>
                    <StepIcon className="w-5 h-5 text-white/40 group-hover:text-[var(--fx-yellow)] transition-colors" />
                  </div>
                  
                  <h3 className="font-editorial text-xl font-bold uppercase tracking-wide text-white">
                    {step.title}
                  </h3>

                  <p className="font-tech text-xs sm:text-sm text-white/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 4. FINAL CALL TO ACTION ─── */}
      <section className="py-10 md:py-20 sm:py-28 px-6 sm:px-10 md:px-14 lg:px-4 md:px-16 border-t border-white/10 bg-[var(--fx-black)] text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-xs font-mono-tech tracking-[0.3em] text-[var(--fx-yellow)] uppercase font-bold">
            START YOUR PRODUCTION
          </span>
          <h2 className="font-editorial text-2xl md:text-4xl sm:text-2xl md:text-4xl md:text-6xl md:text-7xl font-bold uppercase text-white leading-tight">
            HAVE A PROJECT IN MIND?
          </h2>
          <p className="font-tech text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            Let's discuss your commercial, brand film, editorial photoshoot, or digital campaign. We reply within 24 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="https://wa.me/94777548671?text=Hi%20CreativeFX%2C%20I%27d%20like%20to%20discuss%20a%20new%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-black px-4 md:px-8 py-4 font-mono-tech text-xs tracking-widest font-bold uppercase transition-all shadow-lg rounded-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>QUICK CHAT ON WHATSAPP</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onSwitchToStudio();
                setTimeout(() => {
                  const el = document.getElementById('section-contact');
                  if (el) smoothScrollTo(el);
                }, 150);
              }}
              className="inline-flex items-center gap-3 bg-[var(--fx-yellow)] hover:bg-white text-black px-4 md:px-8 py-4 font-mono-tech text-xs tracking-widest font-bold uppercase transition-all shadow-lg rounded-sm cursor-pointer"
            >
              <span>SUBMIT INQUIRY FORM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Universal Footer */}
      <Footer
        onNavigateHome={onSwitchToStudio}
        onNavigateWorks={() => onSwitchToWorks()}
        onNavigateWeddings={onSwitchToWeddings}
      />

    </div>
  );
};

