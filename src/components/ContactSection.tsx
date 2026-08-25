import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, API_BASE } from '../context/ContentContext';
import { MessageCircle, CheckCircle2, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection: React.FC = () => {
  const { content } = useContent();
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

  // Auto cycle testimonials every 6 seconds
  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-left-card', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
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
          start: 'top 75%'
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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

    // Format the WhatsApp message text clearly
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
      // Persist the inquiry so it appears in Admin → Contact / Inquiries
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
      // Server offline — WhatsApp fallback still works; inquiry not stored.
    }

    setIsSubmitting(false);
    setSubmitted(true);
    // Immediate direct opening (prevents browser popup blocking)
    window.open(waUrl, '_blank');
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section
      ref={sectionRef}
      id="section-contact"
      className="no-parallax relative w-full bg-white text-black py-20 sm:py-28 md:py-36 px-6 sm:px-8 md:px-12 lg:px-16 border-t border-neutral-200 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">

        {/* ════════════════ LEFT: RADIANT PURE WHITE FROSTED TESTIMONIAL CARD ════════════════ */}
        {currentTestimonial && (
        <div className="contact-left-card lg:col-span-6 w-full">
          <div className="relative overflow-hidden rounded-[36px] sm:rounded-[44px] bg-[#f9f9fb] border border-neutral-200/70 text-black p-7 sm:p-10 min-h-[500px] sm:min-h-[580px] flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)] group">

            {/* Pure white ambient glows */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-white rounded-full blur-[50px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white rounded-full blur-[50px] pointer-events-none" />

            {/* Top Label */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-mono-tech tracking-[0.25em] text-black uppercase font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--fx-yellow)] shadow-[0_0_8px_rgba(252,191,19,0.8)]" />
                CLIENT EXPERIENCES
              </span>
              <span className="text-xs font-mono-tech tracking-widest text-neutral-500 font-bold">
                0{activeTestimonial + 1} / 0{testimonials.length}
              </span>
            </div>

            {/* Center Floating Pure White Testimonial Box */}
            <div className="relative z-10 my-auto py-6">
              <div className="relative overflow-hidden bg-white border border-neutral-100 rounded-3xl p-7 sm:p-9 text-neutral-900 shadow-[0_15px_40px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-500">

                {/* Gloss Reflection Highlight */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-100 to-transparent pointer-events-none" />

                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-2xl bg-black text-[var(--fx-yellow)] flex items-center justify-center mb-6 shadow-sm">
                  <Quote className="w-5 h-5 fill-[var(--fx-yellow)]" />
                </div>

                {/* Quote Text */}
                <p className="text-base sm:text-[17px] font-tech text-neutral-900 leading-relaxed font-normal mb-7">
                  "{currentTestimonial.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-5 border-t border-neutral-100">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-neutral-100 shadow-sm flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-base font-tech font-bold text-black leading-tight">
                      {currentTestimonial.author}
                    </h4>
                    <p className="text-xs font-mono-tech text-neutral-500 uppercase tracking-wider mt-1 font-semibold">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pagination Dots */}
            <div className="relative z-10 flex justify-center items-center gap-2.5 pt-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  aria-label={`Testimonial ${idx + 1}`}
                  className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                    activeTestimonial === idx
                      ? 'w-8 bg-black shadow-[0_0_8px_rgba(0,0,0,0.2)]'
                      : 'w-2 bg-neutral-300 hover:bg-neutral-500'
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
        )}

        {/* ════════════════ RIGHT: EDITORIAL CONTACT FORM ════════════════ */}
        <div className={`contact-right-form w-full max-w-xl ${currentTestimonial ? 'lg:col-span-6' : 'lg:col-span-12 mx-auto'}`}>
          <div className="space-y-3 mb-8">
            {pageCopy.label && (
              <span className="text-xs font-mono-tech tracking-[0.25em] text-neutral-500 uppercase font-bold">{pageCopy.label}</span>
            )}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-editorial tracking-tight text-black uppercase leading-none whitespace-pre-line">
              {pageCopy.headline || 'Contact Us'}
            </h2>
            <p className="text-sm sm:text-base font-tech text-neutral-600 leading-relaxed max-w-md">
              {pageCopy.description || "Please reach out to us and we will get back to you at the speed of light."}
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-2xl text-center space-y-4 animate-fadeIn shadow-sm">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-editorial uppercase text-black tracking-wide">
                Connecting on WhatsApp!
              </h3>
              <p className="text-xs sm:text-sm font-tech text-neutral-600 max-w-xs mx-auto leading-relaxed">
                Your inquiry has been formatted. If WhatsApp didn't open automatically, click the button below.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-black text-white font-mono-tech text-xs font-bold uppercase rounded-full hover:bg-[var(--fx-yellow)] hover:text-black transition-colors cursor-pointer"
                >
                  Re-Open WhatsApp
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 border border-neutral-300 text-black font-mono-tech text-xs uppercase rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="cfx-name" className="block text-xs font-mono-tech tracking-wider text-neutral-800 uppercase font-semibold">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <input
                  id="cfx-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Ruwan Perera"
                  className="w-full bg-[#f8f8f8] border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="cfx-email" className="block text-xs font-mono-tech tracking-wider text-neutral-800 uppercase font-semibold">
                  Email Address
                </label>
                <input
                  id="cfx-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-[#f8f8f8] border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-2">
                <label htmlFor="cfx-phone" className="block text-xs font-mono-tech tracking-wider text-neutral-800 uppercase font-semibold">
                  WhatsApp / Phone Number
                </label>
                <input
                  id="cfx-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                  className="w-full bg-[#f8f8f8] border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech"
                />
              </div>

              {/* Service / Company */}
              <div className="space-y-2">
                <label htmlFor="cfx-service" className="block text-xs font-mono-tech tracking-wider text-neutral-800 uppercase font-semibold">
                  Company / Service Needed
                </label>
                <input
                  id="cfx-service"
                  type="text"
                  list="cfx-service-options"
                  value={formData.service}
                  onChange={(e) => setFormData(p => ({ ...p, service: e.target.value }))}
                  placeholder="Wedding Film / Commercial Shoot / Branding"
                  className="w-full bg-[#f8f8f8] border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech"
                />
                <datalist id="cfx-service-options">
                  {(content.services || []).map(s => (
                    <option key={s.id} value={s.title} />
                  ))}
                </datalist>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="cfx-message" className="block text-xs font-mono-tech tracking-wider text-neutral-800 uppercase font-semibold">
                  Message
                </label>
                <textarea
                  id="cfx-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about your project or event date..."
                  className="w-full bg-[#f8f8f8] border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech resize-none"
                />
              </div>

              {submitError && (
                <p className="text-red-600 text-xs font-medium" role="alert">{submitError}</p>
              )}

              {/* Direct Submit Pill Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-tech font-bold text-sm tracking-wider uppercase py-4 rounded-full hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_30px_rgba(252,191,19,0.3)] disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Opening WhatsApp...' : 'Submit via WhatsApp'}</span>
                </button>
              </div>

              {/* Studio Info Footnote */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono-tech text-neutral-700 border-t border-neutral-200">
                <span className="flex items-center gap-1.5"><strong className="text-black font-bold">DIRECT LINE:</strong> {contact.phone || '+94 77 754 8671'}</span>
                <span className="flex items-center gap-1.5"><strong className="text-black font-bold">STUDIO:</strong> {(contact.location || 'Kaduwela, Sri Lanka').toUpperCase()}</span>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};
