import React, { useRef } from 'react';
import { Settings as SettingsIcon, Download, Upload, RotateCcw, ShieldAlert } from 'lucide-react';
import { TextInput, CollapseSection, PageHeader } from './AdminFields';
import type { SiteContent } from '../../context/ContentContext';

interface SettingsSectionProps {
  content: SiteContent;
  update: (path: string[], value: any) => void;
  resetContent: () => Promise<void>;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ content, update, resetContent }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const identity = { ...(content.settings?.identity || {}) };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `creativefx-content-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        update([], parsed);
        alert('Backup imported and synced to the server.');
      } catch {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = async () => {
    if (!confirm('This will reset ALL studio content, projects and media links back to the original defaults. This cannot be reversed. Continue?')) return;
    await resetContent();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Studio identity, data backups and server options."
      />

      {/* General Studio Info */}
      <CollapseSection title="Studio identity" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput label="Brand name" value={identity.brandName || ''} onChange={v => update(['settings', 'identity', 'brandName'], v)} />
          <TextInput label="Operating timezone" value={identity.timezone || ''} onChange={v => update(['settings', 'identity', 'timezone'], v)} />
          <TextInput label="Primary currency" value={identity.currency || ''} onChange={v => update(['settings', 'identity', 'currency'], v)} />
          <TextInput label="System language" value={identity.language || ''} onChange={v => update(['settings', 'identity', 'language'], v)} />
        </div>
      </CollapseSection>

      {/* Database Backup & Restore */}
      <CollapseSection title="Backup & restore" defaultOpen>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Download a complete JSON snapshot of the website content — projects, copy, media links
            and settings — or restore a previous backup.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-5 py-2.5 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Export JSON backup
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleImportBackup}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 text-xs font-medium px-5 py-2.5 rounded-md transition-colors"
            >
              <Upload className="w-4 h-4" /> Import backup
            </button>
          </div>
        </div>
      </CollapseSection>

      {/* Danger Zone */}
      <div className="border border-red-200 bg-red-50 p-6 rounded-lg space-y-3">
        <div className="flex items-center gap-2 text-red-700">
          <ShieldAlert className="w-5 h-5" />
          <h4 className="text-sm font-semibold">Danger zone</h4>
        </div>
        <p className="text-sm text-red-600/90 max-w-xl">
          Reset all modified content, projects and gallery items back to the original factory defaults.
        </p>

        <button
          type="button"
          onClick={handleFactoryReset}
          className="flex items-center gap-2 bg-white border border-red-300 text-red-700 hover:bg-red-100 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Factory reset
        </button>
      </div>
    </div>
  );
};
