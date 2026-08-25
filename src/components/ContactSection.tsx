import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, API_BASE, useSectionStyle } from '../context/ContentContext';
import { MessageCircle, CheckCircle2, Quote } from 'lucide-react';

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
    if (!sec.animationsEnabled) return;

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
      className="no-parallax relative w-full bg-white text-black py-20 sm:py-24 md:py-28 px-6 sm:px-8 md:px-12 lg:px-16 border-t border-neutral-200 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">

        {/* ════════════════ LEFT COLUMN: STUDIO DETAILS & TESTIMONIAL ════════════════ */}
        <div className="contact-left-card lg:col-span-5 w-full flex flex-col justify-between space-y-10">
          
          {/* Header & Sub-narrative */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono-tech tracking-[0.28em] text-neutral-500 uppercase">
              <span className="text-black font-bold">07</span>
              <span>/ Contact</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-editorial tracking-tight text-black uppercase leading-[0.95] whitespace-pre-line">
              {pageCopy.headline || "LET'S CREATE\nTOGETHER."}
            </h2>
            <p className="text-base font-tech text-neutral-600 leading-relaxed max-w-md">
              {pageCopy.description || "Have a vision for your brand, film, or wedding? Reach out and let's craft something unforgettable."}
            </p>
          </div>

          {/* Studio Quick Info & Direct Access */}
          <div className="space-y-5 pt-2 border-t border-neutral-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono-tech tracking-wider uppercase text-neutral-500">
              <div>
                <span className="block text-[10px] text-neutral-400 mb-1 font-semibold">DIRECT LINE</span>
                <a href={`tel:${contact.phone || '+94777548671'}`} className="text-sm font-tech font-bold text-black hover:text-[var(--fx-yellow)] transition-colors normal-case">
                  {contact.phone || '+94 77 754 8671'}
                </a>
              </div>
              <div>
                <span className="block text-[10px] text-neutral-400 mb-1 font-semibold">EMAIL</span>
                <a href={`mailto:${contact.email || 'hello@creativefx.lk'}`} className="text-sm font-tech font-bold text-black hover:text-[var(--fx-yellow)] transition-colors normal-case">
                  {contact.email || 'hello@creativefx.lk'}
                </a>
              </div>
              <div>
                <span className="block text-[10px] text-neutral-400 mb-1 font-semibold">STUDIO LOCATION</span>
                <p className="text-sm font-tech font-bold text-black normal-case">
                  {contact.location || 'Kaduwela, Sri Lanka'}
                </p>
              </div>
              <div>
                <span className="block text-[10px] text-neutral-400 mb-1 font-semibold">WORKING HOURS</span>
                <p className="text-sm font-tech font-bold text-black normal-case">
                  Mon – Sat / 9AM – 6PM
                </p>
              </div>
            </div>
          </div>

          {/* Pure White Frosted Client Experience Card */}
          {currentTestimonial && (
            <div className="relative overflow-hidden rounded-3xl bg-[#f8f8fa] border border-neutral-200/80 p-7 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono-tech tracking-[0.25em] text-neutral-600 uppercase font-bold">
                    CLIENT EXPERIENCES
                  </span>
                </div>
                <span className="text-[10px] font-mono-tech tracking-widest text-neutral-400 font-semibold">
                  0{activeTestimonial + 1} / 0{testimonials.length}
                </span>
              </div>

              <div className="space-y-3">
                <Quote className="w-6 h-6 text-neutral-300 transform -scale-x-100" />
                <p className="font-editorial text-lg sm:text-xl text-neutral-900 leading-snug tracking-tight">
                  "{currentTestimonial.quote}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60">
                <div className="flex items-center gap-3">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.author}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-300 shadow-sm"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-sm font-tech font-bold text-black leading-tight">
                      {currentTestimonial.author}
                    </h4>
                    <p className="text-[11px] font-mono-tech text-neutral-500 uppercase tracking-wider mt-0.5">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      aria-label={`Testimonial ${idx + 1}`}
                      className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                        activeTestimonial === idx
                          ? 'w-5 bg-black'
                          : 'w-1.5 bg-neutral-300 hover:bg-neutral-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ════════════════ RIGHT COLUMN: EDITORIAL CONTACT FORM ════════════════ */}
        <div className="contact-right-form lg:col-span-7 w-full">
          <div className="bg-[#fafafa] border border-neutral-200 rounded-3xl p-8 sm:p-10 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.03)]">
            
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-editorial uppercase tracking-tight text-black mb-2">
                SEND AN INQUIRY
              </h3>
              <p className="text-sm font-tech text-neutral-500">
                Fill in your details below and connect with us directly on WhatsApp.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-white border border-neutral-200 rounded-2xl text-center space-y-4 shadow-sm animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-editorial uppercase text-black tracking-wide">
                  Connecting on WhatsApp!
                </h3>
                <p className="text-sm font-tech text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been formatted. If WhatsApp didn't open automatically, click below.
                </p>
                <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
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
              <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>

                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="cfx-name" className="block text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    id="cfx-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Ruwan Perera"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="cfx-email" className="block text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                      Email Address
                    </label>
                    <input
                      id="cfx-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cfx-phone" className="block text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                      WhatsApp / Phone
                    </label>
                    <input
                      id="cfx-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                    />
                  </div>
                </div>

                {/* Company / Service Needed */}
                <div className="space-y-2">
                  <label htmlFor="cfx-service" className="block text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                    Service Needed / Category
                  </label>
                  <input
                    id="cfx-service"
                    type="text"
                    list="cfx-service-options"
                    value={formData.service}
                    onChange={(e) => setFormData(p => ({ ...p, service: e.target.value }))}
                    placeholder="e.g. Wedding Film, Commercial Shoot, Brand Identity"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech shadow-sm"
                  />
                  <datalist id="cfx-service-options">
                    {(content.services || []).map(s => (
                      <option key={s.id} value={s.title} />
                    ))}
                  </datalist>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="cfx-message" className="block text-xs font-mono-tech tracking-widest text-neutral-700 uppercase font-semibold">
                    Message / Project Details
                  </label>
                  <textarea
                    id="cfx-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your project, timelines, location or vision..."
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-tech resize-none shadow-sm"
                  />
                </div>

                {submitError && (
                  <p className="text-red-600 text-xs font-medium" role="alert">{submitError}</p>
                )}

                {/* Submit Pill CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white font-tech font-bold text-sm tracking-wider uppercase py-4 rounded-xl hover:bg-[var(--fx-yellow)] hover:text-black transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{isSubmitting ? 'Opening WhatsApp...' : 'Submit via WhatsApp'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
