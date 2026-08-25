import React from 'react';
import { Search, Globe } from 'lucide-react';
import { TextInput, TextArea, CollapseSection, ImageUpload, ToggleSwitch, PageHeader } from './AdminFields';
import type { SiteContent } from '../../context/ContentContext';

interface SEOSectionProps {
  content: SiteContent;
  update: (path: string[], value: any) => void;
}

export const SEOSection: React.FC<SEOSectionProps> = ({ content, update }) => {
  const seo = { ...content.seo };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="Search engine optimization"
        description="Metadata used by Google and by social platforms when your links are shared."
      />

      {/* Google Search Live Preview */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 space-y-3">
        <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> Google search result preview
        </span>
        <div className="bg-[#202124] p-4 rounded-md space-y-1 font-sans max-w-2xl">
          <div className="text-xs text-[#bdc1c6] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">FX</span>
            <span>{seo.canonicalUrl?.replace(/^https?:\/\//, '') || 'creativefx.lk'}</span>
            <span className="text-gray-500">›</span>
          </div>
          <h4 className="text-[#8ab4f8] text-base hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
            {seo.title}
          </h4>
          <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
            {seo.description}
          </p>
        </div>
      </div>

      {/* Primary Meta Tags */}
      <CollapseSection title="Primary metadata" defaultOpen>
        <TextInput
          label="Meta title (max 65 characters)"
          value={seo.title}
          onChange={v => update(['seo', 'title'], v)}
          hint={`${(seo.title || '').length}/65 characters`}
        />
        <TextArea
          label="Meta description (max 160 characters)"
          value={seo.description}
          onChange={v => update(['seo', 'description'], v)}
          rows={3}
          hint={`${(seo.description || '').length}/160 characters`}
        />
        <TextInput
          label="Target keywords (comma-separated)"
          value={seo.keywords}
          onChange={v => update(['seo', 'keywords'], v)}
        />
        <TextInput
          label="Canonical website URL"
          value={seo.canonicalUrl}
          onChange={v => update(['seo', 'canonicalUrl'], v)}
          placeholder="https://yourdomain.lk"
        />
      </CollapseSection>

      {/* Social Media OpenGraph Card */}
      <CollapseSection title="Social share card (Open Graph)" defaultOpen>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Image shown when your website link is shared on WhatsApp, Facebook, LinkedIn and other platforms.
          </p>
          <ImageUpload
            label="Share banner image (1200 × 630px recommended)"
            currentSrc={seo.ogImage}
            onUpload={url => update(['seo', 'ogImage'], url)}
          />
        </div>
      </CollapseSection>

      {/* Indexing */}
      <ToggleSwitch
        label="Allow search engine indexing"
        checked={seo.allowIndexing ?? true}
        onChange={v => update(['seo', 'allowIndexing'], v)}
        description="When disabled, search engines are asked not to index the site"
      />
    </div>
  );
};
