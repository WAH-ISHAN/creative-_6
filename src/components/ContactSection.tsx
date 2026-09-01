import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, API_BASE, useSectionStyle } from '../context/ContentContext';
import { MessageCircle, CheckCircle2, Quote, Phone, Mail, MapPin, Clock, Star, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection: React.FC = () => {
  const { content } = useContent();
  const sec = useSectionStyle('contact');
  const contact = content.contact || {};
  const pageCopy = content.contactPage || {};
  const testimonials = content.testimonials?.length ? content.testimonials : [];

  const sectionRef = useRef<HTMLElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    if (!sec.animationsEnabled) {
      // Just ensure they are visible if disabled
      gsap.set('.contact-left-card, .contact-right-form', { opacity: 1, y: 0 });
      return;
    }

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.from('.contact-left-card', {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            once: true,
          }
        });
        gsap.from('.contact-right-form', {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            once: true,
          }
        });
        ScrollTrigger.refresh();
      }, sectionRef);
      return () => ctx.revert();
    }, 100);
    return () => clearTimeout(timer);
  }, [sec.animationsEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!formData.name.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!formData.message.trim() && !formData.service.trim()) {
      setSubmitError('Tell us a little about your project or the service you need.');
      return;
    }

    const whatsappNumber = (contact.whatsapp || '94777548671').replace(/[^0-9]/g, '');

    const textLines = [
      `*✦ NEW PROJECT INQUIRY — CREATIVEFX ✦*`,
      ``,
      `• *Client Name:* ${formData.name.trim()}`,
      `• *Email:* ${formData.email.trim() || 'N/A'}`,
      `• *WhatsApp / Phone:* ${formData.phone.trim() || 'N/A'}`,
      `• *Company / Service Needed:* ${formData.service.trim() || 'General Production'}`,
      `• *Project Details / Message:*`,
      `${formData.message.trim() || 'Hello CreativeFX, I would like to discuss a creative project.'}`,
      ``,
      `_Sent via CreativeFX Studio Portfolio_`
    ];

    const fullMessage = textLines.join('\n');
    const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(fullMessage)}`;

    setIsSubmitting(true);
    try {
      await fetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          source: 'contact',
        }),
      });
    } catch {
    }

    setIsSubmitting(false);
    setSubmitted(true);
    window.open(waUrl, '_blank');
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section
      ref={sectionRef}
      id="section-contact"
      className="no-parallax relative w-full bg-white text-black py-10 sm:py-24 md:py-28 px-4 sm:px-8 md:px-12 lg:px-16 border-t border-neutral-200 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-start">

        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="contact-left-card lg:col-span-5 w-full flex flex-col justify-between space-y-6 sm:space-y-10 order-1">
          
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono-tech tracking-[0.28em] text-neutral-500 uppercase">
              <span className="text-black font-bold">07</span>
              <span>/ Contact</span>
            </div>
            <h2 className="text-[32px] sm:text-5xl lg:text-6xl font-editorial tracking-tight text-black uppercase leading-[0.92] sm:leading-[0.95] whitespace-pre-line">
              {pageCopy.headline || "LET'S CREATE\nTOGETHER."}
            </h2>
            <p className="text-[14px] sm:text-base font-tech text-neutral-600 leading-relaxed max-w-md">
              {pageCopy.description || "Have a vision for your brand, film, or wedding? Reach out and let's craft something unforgettable."}
            </p>
            {/* Mobile quick actions */}
            <div className="sm:hidden flex gap-2 pt-1">
              <a href={`tel:${(contact.phone||'+94777548671').replace(/\s/g,'')}`} className="flex-1 bg-black text-white font-mono-tech text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                <Phone className="w-4 h-4" /> CALL
              </a>
              <a href={`https://wa.me/${(contact.whatsapp||'94777548671').replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-black font-mono-tech text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                <MessageCircle className="w-4 h-4" /> WHATSAPP
              </a>
            </div>
          </div>

          {/* Studio Quick Info */}
          <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-2 border-t border-neutral-200">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xl sm:rounded-none p-3 sm:p-0">
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-1 font-semibold tracking-widest uppercase"><Phone className="w-3 h-3 sm:hidden" /> DIRECT LINE</span>
                <a href={`tel:${contact.phone || '+94777548671'}`} className="text-[13px] sm:text-sm font-tech font-bold text-black hover:text-[var(--fx-yellow)] transition-colors">
                  {contact.phone || '+94 77 754 8671'}
                </a>
              </div>
              <div className="bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xl sm:rounded-none p-3 sm:p-0">
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-1 font-semibold tracking-widest uppercase"><Mail className="w-3 h-3 sm:hidden" /> EMAIL</span>
                <a href={`mailto:${contact.email || 'hello@creativefx.lk'}`} className="text-[13px] sm:text-sm font-tech font-bold text-black hover:text-[var(--fx-yellow)] transition-colors break-all">
                  {contact.email || 'hello@creativefx.lk'}
                </a>
              </div>
              <div className="bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xl sm:rounded-none p-3 sm:p-0">
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-1 font-semibold tracking-widest uppercase"><MapPin className="w-3 h-3 sm:hidden" /> STUDIO LOCATION</span>
                <p className="text-[13px] sm:text-sm font-tech font-bold text-black">
                  {contact.location || 'Kaduwela, Sri Lanka'}
                </p>
              </div>
              <div className="bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xl sm:rounded-none p-3 sm:p-0">
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-1 font-semibold tracking-widest uppercase"><Clock className="w-3 h-3 sm:hidden" /> WORKING HOURS</span>
                <p className="text-[13px] sm:text-sm font-tech font-bold text-black">
                  Mon – Sat / 9AM – 6PM
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial / Google Reviews Card */}
          {currentTestimonial && (
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f8f8fa] border border-neutral-200 p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5">
              
              {/* Header with Google Logo & Verified Rating Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono-tech tracking-[0.2em] text-neutral-800 uppercase font-bold flex items-center gap-1.5">
                    CLIENT EXPERIENCES
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono-tech tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> GOOGLE VERIFIED
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] font-mono-tech tracking-widest text-neutral-600 font-bold ml-1">
                    5.0
                  </span>
                </div>
              </div>

              {/* Review Stars & Quote */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] font-mono-tech font-bold text-neutral-800 ml-1">5.0 Star Rating</span>
                  </div>
                  <span className="text-[10px] font-mono-tech tracking-widest text-neutral-400 font-semibold">
                    0{activeTestimonial + 1} / 0{testimonials.length}
                  </span>
                </div>

                <p className="font-editorial text-[17px] sm:text-xl text-neutral-900 leading-snug tracking-tight">
                  "{currentTestimonial.quote}"
                </p>
              </div>

              {/* Author Info, Avatar & Google Action Links */}
              <div className="pt-3 border-t border-neutral-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative">
                      <img
                        src={encodeURI(currentTestimonial.avatar || '/img/creativefx-bgr-logo.webp')}
                        alt={currentTestimonial.author}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-neutral-300 shadow-2xs"
                        loading="lazy"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[13px] sm:text-sm font-tech font-bold text-black leading-tight flex items-center gap-1.5">
                        {currentTestimonial.author}
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                      </h4>
                      <p className="text-[10px] sm:text-[11px] font-mono-tech text-neutral-500 uppercase tracking-wider mt-0.5">
                        {currentTestimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestimonial(idx)}
                        aria-label={`Testimonial ${idx + 1}`}
                        className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer min-h-0 min-w-0 ${
                          activeTestimonial === idx
                            ? 'w-5 bg-black'
                            : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Direct Google Reviews CTAs */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="https://www.google.com/search?q=creativefx+pvt+ltd+kaduwela+reviews#lrd=0xbfe9d365346670d:0x60fdaf92bd3171c7,1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono-tech font-bold tracking-wider text-black bg-white border border-neutral-300 hover:border-black px-3 py-1.5 rounded-md transition-all shadow-2xs hover:shadow-xs uppercase"
                  >
                    <span>READ REVIEWS ON GOOGLE</span>
                    <ExternalLink className="w-3 h-3 text-neutral-500" />
                  </a>
                  <a
                    href="https://www.google.com/search?q=creativefx+pvt+ltd+kaduwela+reviews#lrd=0xbfe9d365346670d:0x60fdaf92bd3171c7,3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono-tech font-bold tracking-wider text-amber-700 bg-amber-50/80 border border-amber-200 hover:border-amber-400 hover:bg-amber-100 px-3 py-1.5 rounded-md transition-all uppercase"
                  >
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>WRITE A GOOGLE REVIEW</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ════════════════ RIGHT COLUMN: FORM ════════════════ */}
        <div className="contact-right-form lg:col-span-7 w-full order-2 lg:order-2">
          <div className="bg-[#fafafa] border border-neutral-200 rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.03)]">
            
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-3xl font-editorial uppercase tracking-tight text-black mb-1.5 sm:mb-2">
                SEND AN INQUIRY
              </h3>
              <p className="text-[13px] sm:text-sm font-tech text-neutral-500">
                Fill in your details and connect directly on WhatsApp.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial uppercase text-black tracking-wide">
                  Connecting on WhatsApp!
                </h3>
                <p className="text-[13px] sm:text-sm font-tech text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been formatted. If WhatsApp didn't open, tap below.
                </p>
                <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto px-6 py-3.5 bg-black text-white font-mono-tech text-xs font-bold uppercase rounded-xl hover:bg-[var(--fx-yellow)] hover:text-black transition-colors cursor-pointer"
                  >
                    Re-Open WhatsApp
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-6 py-3.5 border border-neutral-300 text-black font-mono-tech text-xs uppercase rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Send Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate={false}>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="cfx-name" className="block text-[11px] sm:text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    id="cfx-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Ruwan Perera"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-[15px] sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="cfx-email" className="block text-[11px] sm:text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                      Email Address
                    </label>
                    <input
                      id="cfx-email"
                      type="email"
                      inputMode="email"
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-[15px] sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="cfx-phone" className="block text-[11px] sm:text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                      WhatsApp / Phone
                    </label>
                    <input
                      id="cfx-phone"
                      type="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-[15px] sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="cfx-service" className="block text-[11px] sm:text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                    Service Needed
                  </label>
                  <input
                    id="cfx-service"
                    type="text"
                    list="cfx-service-options"
                    value={formData.service}
                    onChange={(e) => setFormData(p => ({ ...p, service: e.target.value }))}
                    placeholder="e.g. Wedding Film, Commercial Shoot"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-[15px] sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                  />
                  <datalist id="cfx-service-options">
                    {(content.services || []).map(s => (
                      <option key={s.id} value={s.title} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="cfx-message" className="block text-[11px] sm:text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                    Message / Project Details
                  </label>
                  <textarea
                    id="cfx-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your project, timelines, location..."
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-[15px] sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech resize-none shadow-sm"
                  />
                </div>

                {submitError && (
                  <p className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">{submitError}</p>
                )}

                <div className="pt-1 sm:pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white font-tech font-bold text-[13px] sm:text-sm tracking-wider uppercase py-4 rounded-xl hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{isSubmitting ? 'Opening WhatsApp...' : 'Submit via WhatsApp'}</span>
                  </button>
                  <p className="text-[11px] font-tech text-neutral-400 text-center mt-2.5">We reply within 2 hours • No spam</p>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
