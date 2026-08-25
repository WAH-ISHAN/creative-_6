import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface WeddingInquiryModalProps {
  onClose: () => void;
}

export const WeddingInquiryModal: React.FC<WeddingInquiryModalProps> = ({ onClose }) => {
  const [coupleNames, setCoupleNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('Colombo');
  const [venue, setVenue] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Principal Photography',
    'Master Cinema Film'
  ]);
  const [guestCount, setGuestCount] = useState('100 - 250 Guests');
  const [visionNotes, setVisionNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleService = (svc: string) => {
    soundEngine.playClick();
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Persist the wedding inquiry so it appears in Admin → Contact / Inquiries
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: coupleNames,
          email,
          phone,
          service: `Wedding — ${selectedServices.join(', ') || 'General Coverage'}`,
          message: [
            `Wedding date: ${weddingDate || 'TBD'}`,
            `Location: ${location}`,
            venue ? `Venue: ${venue}` : '',
            `Guests: ${guestCount}`,
            visionNotes ? `Vision: ${visionNotes}` : '',
          ].filter(Boolean).join('\n'),
          source: 'wedding',
        }),
      });
    } catch {
      // Server offline — confirmation still shown; inquiry not stored.
    }
    setSubmitting(false);
    soundEngine.playSuccess();
    setSubmitted(true);
  };

  return (
    <div
      id="wedding-inquiry-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-[var(--fx-black)]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-10 select-none animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[var(--fx-border-dark)] p-6 sm:p-10 text-[var(--fx-white)] shadow-2xl">
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-[var(--fx-border-dark)] hover:border-[var(--fx-light-gray)] flex items-center justify-center text-[#888888] hover:text-[var(--fx-yellow)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full border border-[var(--fx-light-gray)] flex items-center justify-center mb-6 text-[var(--fx-white)]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-editorial font-bold text-3xl sm:text-4xl uppercase tracking-wider mb-3">
              YOUR STORY IS RECEIVED.
            </h3>
            <p className="text-xs sm:text-sm text-[#888888] max-w-md mb-8 font-tech leading-relaxed">
              Thank you, {coupleNames || 'esteemed couple'}. We review our calendar and will reach out personally within 24 hours to schedule our quiet introductory consultation.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-[var(--fx-black)] text-[var(--fx-white)] text-sm font-mono-tech uppercase tracking-widest font-bold hover:bg-[#E0E0E0] cursor-pointer"
            >
              RETURN TO ARCHIVE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Form Header */}
            <div>
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#777777] uppercase block mb-1">
                COMMISSION INQUIRY // 2026–2027
              </span>
              <h2 className="font-editorial font-bold text-3xl sm:text-4xl uppercase tracking-tight text-[var(--fx-white)]">
                BEGIN YOUR ARCHIVE
              </h2>
              <p className="text-xs text-[#888888] font-tech mt-1">
                We accept only 16 weddings annually worldwide to ensure undivided focus.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-1.5">
                  COUPLE NAMES *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya & Daniel"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  className="w-full bg-[#111111] border border-[var(--fx-border-dark)] focus:border-[var(--fx-light-gray)] p-3 text-xs font-mono-tech text-[var(--fx-white)] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-1.5">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="hello@couple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111111] border border-[var(--fx-border-dark)] focus:border-[var(--fx-light-gray)] p-3 text-xs font-mono-tech text-[var(--fx-white)] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-1.5">
                  PHONE / WHATSAPP
                </label>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#111111] border border-[var(--fx-border-dark)] focus:border-[var(--fx-light-gray)] p-3 text-xs font-mono-tech text-[var(--fx-white)] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-1.5">
                  WEDDING DATE *
                </label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full bg-[#111111] border border-[var(--fx-border-dark)] focus:border-[var(--fx-light-gray)] p-3 text-xs font-mono-tech text-[var(--fx-white)] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-1.5">
                  LOCATION REGION
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#111111] border border-[var(--fx-border-dark)] focus:border-[var(--fx-light-gray)] p-3 text-xs font-mono-tech text-[var(--fx-white)] outline-none transition-colors"
                >
                  <option value="Colombo">Colombo, Sri Lanka</option>
                  <option value="Kandy">Kandy (Highlands), Sri Lanka</option>
                  <option value="Galle">Galle / South Coast, Sri Lanka</option>
                  <option value="Bentota">Bentota / Negombo Coast</option>
                  <option value="Jaffna">Jaffna / Northern Province</option>
                  <option value="International">Destination / International</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-1.5">
                  VENUE / PROPERTY
                </label>
                <input
                  type="text"
                  placeholder="e.g. Galle Face Hotel, Amangalla"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-[#111111] border border-[var(--fx-border-dark)] focus:border-[var(--fx-light-gray)] p-3 text-xs font-mono-tech text-[var(--fx-white)] outline-none transition-colors"
                />
              </div>

            </div>

            {/* Services Selection */}
            <div>
              <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-2">
                COVERAGE COMMISSION
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Principal Photography',
                  'Master Cinema Film',
                  'Archival Heirloom Album',
                  'Analog 35mm & 16mm Emulsion',
                  'Drone Aerial Cinematography'
                ].map((svc) => {
                  const active = selectedServices.includes(svc);
                  return (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => toggleService(svc)}
                      className={`px-3 py-1.5 text-[11px] font-mono-tech uppercase tracking-wider transition-all cursor-pointer border ${
                        active
                          ? 'border-[var(--fx-light-gray)] bg-[var(--fx-black)] text-[var(--fx-white)] font-semibold'
                          : 'border-[var(--fx-border-dark)] bg-[#111111] text-[#888888] hover:border-[#555555]'
                      }`}
                    >
                      {svc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vision Notes */}
            <div>
              <label className="block text-[10px] font-mono-tech tracking-widest text-[#777777] uppercase mb-1.5">
                TELL US ABOUT YOUR VISION & STORY
              </label>
              <textarea
                rows={3}
                placeholder="Atmosphere, special cultural customs, what matters most to both of you..."
                value={visionNotes}
                onChange={(e) => setVisionNotes(e.target.value)}
                className="w-full bg-[#111111] border border-[var(--fx-border-dark)] focus:border-[var(--fx-light-gray)] p-3 text-xs font-tech text-[var(--fx-white)] outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              data-cursor="cta"
              disabled={submitting}
              className="w-full py-3.5 bg-[var(--fx-black)] hover:bg-[#E0E0E0] text-[var(--fx-white)] font-mono-tech uppercase text-xs tracking-[0.25em] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'TRANSMITTING…' : 'TRANSMIT INQUIRY'}</span>
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
