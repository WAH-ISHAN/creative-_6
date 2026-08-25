import React from 'react';
import { Palette, Check } from 'lucide-react';
import { TextInput, CollapseSection, ImageUpload, ToggleSwitch, PageHeader } from './AdminFields';
import type { SiteContent } from '../../context/ContentContext';

interface ThemeSectionProps {
  content: SiteContent;
  update: (path: string[], value: any) => void;
}

const presetColors = [
  { name: 'Signature gold', hex: '#fcbf13' },
  { name: 'Neon cyan', hex: '#00f0ff' },
  { name: 'Electric violet', hex: '#8b5cf6' },
  { name: 'Crimson', hex: '#ff0055' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Platinum', hex: '#ffffff' },
];

export const ThemeSection: React.FC<ThemeSectionProps> = ({ content, update }) => {
  const accentColor: string = content.theme?.accentColor || '#fcbf13';
  const logoUrl: string = content.theme?.logoUrl || '/img/creativefx-bgr-logo.png';

  const setAccent = (hex: string) => update(['theme', 'accentColor'], hex);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Palette}
        title="Theme & branding"
        description="Brand accent color and logo used across the website."
      />

      {/* Accent Color Palette */}
      <CollapseSection title="Accent color" defaultOpen>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Applies to highlights, buttons and hover states across the whole site.
            Current: <span className="font-semibold text-gray-900 uppercase">{accentColor}</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {presetColors.map(preset => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => setAccent(preset.hex)}
                className={`p-3 rounded-md border flex items-center gap-3 transition-all ${
                  accentColor.toLowerCase() === preset.hex.toLowerCase()
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border border-black/10"
                  style={{ backgroundColor: preset.hex }}
                >
                  {accentColor.toLowerCase() === preset.hex.toLowerCase() && <Check className="w-3 h-3 text-white mix-blend-difference" />}
                </div>
                <div className="text-left truncate">
                  <div className="text-xs font-medium text-gray-900 truncate">{preset.name}</div>
                  <div className="text-[11px] text-gray-400 uppercase">{preset.hex}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 max-w-xs">
            <TextInput
              label="Custom hex code"
              value={accentColor}
              onChange={v => /^#[0-9a-fA-F]{0,6}$/.test(v) && setAccent(v)}
              placeholder="#fcbf13"
            />
          </div>

          {/* Live preview strip */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-gray-500">Preview:</span>
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-md text-xs font-semibold text-black"
              style={{ backgroundColor: accentColor }}
            >
              Button label
            </span>
            <span className="text-sm font-medium" style={{ color: accentColor === '#ffffff' ? '#111' : accentColor }}>
              Highlighted text
            </span>
          </div>
        </div>
      </CollapseSection>

      {/* Brand Logos */}
      <CollapseSection title="Logo" defaultOpen>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Upload a transparent PNG to replace the navbar logo. Leave unchanged to keep the default brand mark.
          </p>
          <ImageUpload
            label="Navbar logo (transparent PNG recommended)"
            currentSrc={logoUrl}
            onUpload={url => update(['theme', 'logoUrl'], url)}
          />
        </div>
      </CollapseSection>

      {/* Visual Effects & Animations (FX Toggles) */}
      <CollapseSection title="Visual Effects & Animations" defaultOpen>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Control interactive animation effects and lighting styles across the website.
          </p>

          <ToggleSwitch
            label="Hero Title Shining Yellow Effect"
            description="Enable or disable the smooth continuous golden light sweep (shimmer wave) animation on the main CREATIVEFX headline."
            checked={content.theme?.heroShimmer !== false}
            onChange={checked => update(['theme', 'heroShimmer'], checked)}
          />
        </div>
      </CollapseSection>
    </div>
  );
};
