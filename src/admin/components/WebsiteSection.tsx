import React from 'react';
import { TextInput, CollapseSection, ToggleSwitch, PageHeader } from './AdminFields';
import type { SiteContent } from '../../context/ContentContext';

interface WebsiteSectionProps {
  item: string;
  content: SiteContent;
  update: (path: string[], value: any) => void;
}

/** Admin → Website (Navigation / Footer / Page Visibility). */
export const WebsiteSection: React.FC<WebsiteSectionProps> = ({ item, content, update }) => {
  // ── NAVIGATION ──
  if (item === 'Navigation') {
    const nav = { ...content.nav };
    const settings = { ...content.settings };
    return (
      <div className="space-y-6">
        <PageHeader title="Navigation" description="Labels used in the header menu on desktop and mobile." />

        <CollapseSection title="Menu links" defaultOpen>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">These labels appear in the fixed navbar at the top of every page.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Link 1 — Work" value={nav.work} onChange={v => update(['nav', 'work'], v)} />
              <TextInput label="Link 2 — Services" value={nav.services} onChange={v => update(['nav', 'services'], v)} />
              <TextInput label="Link 3 — Weddings" value={nav.weddings} onChange={v => update(['nav', 'weddings'], v)} />
              <TextInput label="Link 4 — About" value={nav.about} onChange={v => update(['nav', 'about'], v)} />
            </div>
            <TextInput label="Call-to-action button label" value={nav.cta} onChange={v => update(['nav', 'cta'], v)} hint="Primary button in the top-right corner" />
          </div>
        </CollapseSection>

        <CollapseSection title="Announcement bar">
          <div className="space-y-4">
            <ToggleSwitch
              label="Enable announcement bar"
              checked={settings.announcementEnabled ?? false}
              onChange={v => update(['settings', 'announcementEnabled'], v)}
              description="Shows a slim ticker strip above the navbar"
            />
            <TextInput
              label="Announcement text"
              value={settings.announcementText || ''}
              onChange={v => update(['settings', 'announcementText'], v)}
              placeholder="e.g. NOW BOOKING WEDDING DATES FOR 2027"
            />
          </div>
        </CollapseSection>
      </div>
    );
  }

  // ── FOOTER ──
  if (item === 'Footer') {
    return (
      <div className="space-y-6">
        <PageHeader title="Footer" description="Brand line, copyright notice and social links at the bottom of the site." />

        <CollapseSection title="Branding & copyright" defaultOpen>
          <TextInput label="Studio tagline" value={content.footer?.tagline || ''} onChange={v => update(['footer', 'tagline'], v)} />
          <TextInput label="Studio address line" value={content.contact.location} onChange={v => update(['contact', 'location'], v)} />
          <TextInput label="Copyright notice" value={content.footer?.copyright || ''} onChange={v => update(['footer', 'copyright'], v)} hint="The year is added automatically" />
        </CollapseSection>

        <CollapseSection title="Social media URLs" defaultOpen>
          <TextInput label="Instagram" value={content.contact.instagram} onChange={v => update(['contact', 'instagram'], v)} />
          <TextInput label="Facebook" value={content.contact.facebook} onChange={v => update(['contact', 'facebook'], v)} />
          <TextInput label="TikTok" value={content.contact.tiktok} onChange={v => update(['contact', 'tiktok'], v)} />
          <TextInput label="WhatsApp direct number" value={content.contact.whatsapp} onChange={v => update(['contact', 'whatsapp'], v)} />
        </CollapseSection>
      </div>
    );
  }

  // ── PAGE VISIBILITY ──
  if (item === 'Page Visibility') {
    const settings = { ...content.settings };
    return (
      <div className="space-y-4">
        <PageHeader
          title="Page visibility"
          description="Show or hide site features for visitors. Changes apply immediately after saving."
        />

        <ToggleSwitch
          label="Weddings page link"
          checked={settings.showWeddings ?? true}
          onChange={v => update(['settings', 'showWeddings'], v)}
          description="Shows the Weddings link in the main navigation"
        />

        <ToggleSwitch
          label="Works page link"
          checked={settings.showWorks ?? true}
          onChange={v => update(['settings', 'showWorks'], v)}
          description="Shows the Work link in the main navigation"
        />

        <ToggleSwitch
          label="Custom crosshair cursor"
          checked={settings.customCursor ?? true}
          onChange={v => update(['settings', 'customCursor'], v)}
          description="Animated trailing cursor on desktop devices"
        />

        <ToggleSwitch
          label="Maintenance mode"
          checked={settings.maintenanceMode ?? false}
          onChange={v => update(['settings', 'maintenanceMode'], v)}
          description="Visitors see a temporary notice instead of the website. Admins can still open the panel."
        />
      </div>
    );
  }

  return null;
};
