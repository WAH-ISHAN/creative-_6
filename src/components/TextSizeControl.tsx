import React, { useEffect, useState } from 'react';

type TextMode = 'default' | 'large' | 'xlarge';

const STORAGE_KEY = 'cfx_text_size';
const HIDDEN_KEY = 'cfx_text_size_hidden';

/**
 * Floating accessibility control — TEXT SIZE  A− / A / A+
 * Always visible (permanently shown), bottom-left.
 * Switches html[data-text-size] which re-scales the whole typography
 * token system (see index.css) without touching any component.
 * Includes a hide option that collapses it to a small floating dot.
 */
export const TextSizeControl: React.FC = () => {
  const [mode, setMode] = useState<TextMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'large' || saved === 'xlarge' ? saved : 'default';
  });
  const [hidden, setHidden] = useState<boolean>(() => localStorage.getItem(HIDDEN_KEY) === '1');

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'default') root.removeAttribute('data-text-size');
    else root.setAttribute('data-text-size', mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0');
  }, [hidden]);

  const options: { key: TextMode; label: string; title: string; className?: string }[] = [
    { key: 'default', label: 'A−', title: 'Default text size' },
    { key: 'large', label: 'A', title: 'Large text' },
    { key: 'xlarge', label: 'A+', title: 'Extra large text', className: 'text-sm' },
  ];

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        title="Show text size controls"
        aria-label="Show text size controls"
        className="fixed bottom-6 left-5 z-[130] w-9 h-9 rounded-full border border-white/25 bg-black/80 backdrop-blur-md text-[10px] font-bold tracking-widest text-white/70 hover:text-white hover:border-white transition-colors select-none"
      >
        Aa
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 left-5 z-[130] flex items-center gap-1 select-none rounded-full border border-white/25 bg-black/80 backdrop-blur-md p-1"
      role="group"
      aria-label="Text size"
    >
      <span className="pl-2 pr-0.5 text-[10px] font-bold tracking-widest text-white/50 uppercase">Aa</span>
      {options.map(o => (
        <button
          key={o.key}
          type="button"
          onClick={() => setMode(o.key)}
          aria-pressed={mode === o.key}
          title={o.title}
          className={`h-8 w-9 rounded-full transition-colors font-semibold ${o.className ?? 'text-xs'} ${
            mode === o.key
              ? 'bg-[var(--fx-yellow)] text-black'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setHidden(true)}
        title="Hide panel"
        aria-label="Hide text size panel"
        className="h-8 w-8 ml-0.5 mr-0.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
