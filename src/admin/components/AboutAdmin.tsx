import React from 'react';
import { TextInput, TextArea, CollapseSection, PageHeader, ImageUpload } from './AdminFields';
import type { SiteContent } from '../../context/ContentContext';

interface AboutAdminProps {
  content: SiteContent;
  update: (path: string[], value: any) => void;
}

/** Admin → About — controls the homepage About / philosophy section. */
export const AboutAdmin: React.FC<AboutAdminProps> = ({ content, update }) => {
  const about = content.about || {};

  return (
    <div className="space-y-6">
      <PageHeader title="About the studio" description="The “About Us” section shown on the homepage." />

      <CollapseSection title="Copy" defaultOpen>
        <TextArea label="Headline (line breaks allowed)" value={about.headline || ''} onChange={v => update(['about', 'headline'], v)} rows={3} />
        <TextArea label="Lead sentence" value={about.lead || ''} onChange={v => update(['about', 'lead'], v)} rows={2} />
        <TextArea label="Body paragraph 1" value={about.body1 || ''} onChange={v => update(['about', 'body1'], v)} rows={3} />
        <TextArea label="Body paragraph 2" value={about.body2 || ''} onChange={v => update(['about', 'body2'], v)} rows={3} />
        <TextArea label="Vision" value={about.vision || ''} onChange={v => update(['about', 'vision'], v)} rows={3} />
        <TextArea label="Mission" value={about.mission || ''} onChange={v => update(['about', 'mission'], v)} rows={4} />
      </CollapseSection>

      <CollapseSection title="Statistics counters">
        {(about.stats || []).map((stat: { value: string; label: string }, i: number) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <TextInput label={`Stat ${i + 1} value`} value={stat.value} onChange={v => update(['about', 'stats', String(i), 'value'], v)} />
            <TextInput label={`Stat ${i + 1} label`} value={stat.label} onChange={v => update(['about', 'stats', String(i), 'label'], v)} />
          </div>
        ))}
      </CollapseSection>
    </div>
  );
};
