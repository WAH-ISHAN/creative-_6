import React, { useState, useEffect } from 'react';
import {
  X, Save, RotateCcw, Loader, CheckCircle, LayoutDashboard, Globe, FolderKanban,
  Image as ImageIcon, FileText, Briefcase, Heart, Palette, Mail,
  Search, BarChart3, Settings, ShieldCheck, Home
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { DashboardSection } from './components/DashboardSection';
import { WebsiteSection } from './components/WebsiteSection';
import { WorksSection } from './components/WorksSection';
import { MediaLibrarySection } from './components/MediaLibrarySection';
import { PagesSection } from './components/PagesSection';
import { HomepageSection } from './components/HomepageSection';
import { WeddingsAdmin } from './components/WeddingsAdmin';
import { ServicesAdmin } from './components/ServicesAdmin';
import { AboutAdmin } from './components/AboutAdmin';
import { ThemeSection } from './components/ThemeSection';
import { ContactInquiriesSection } from './components/ContactSection';
import { SEOSection } from './components/SEOSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { SettingsSection } from './components/SettingsSection';
import { AdminUsersSection } from './components/AdminUsersSection';

interface AdminPanelProps {
  onClose: () => void;
}

// ─── Menu definitions — each item maps to a public website section ───────────
const MENU = [
  { category: 'Dashboard', items: ['Dashboard'], icon: LayoutDashboard },
  { category: 'Homepage', items: ['Homepage'], icon: Home },
  { category: 'Works / Projects', items: ['All Projects', 'Add Project', 'Photography', 'Video'], icon: FolderKanban },
  { category: 'Weddings', items: ['Stories', 'Timeline', 'Hero', 'Approach'], icon: Heart },
  { category: 'Services', items: ['Services'], icon: Briefcase },
  { category: 'About', items: ['About'], icon: FileText },
  { category: 'Pages', items: ['Works', 'Contact'], icon: FileText },
  { category: 'Media Library', items: ['Images', 'Videos', 'Uploaded Files', 'Upload / Replace'], icon: ImageIcon },
  { category: 'Navigation & Footer', items: ['Navigation', 'Footer', 'Page Visibility'], icon: Globe },
  { category: 'Contact / Inquiries', items: ['Contact / Inquiries'], icon: Mail },
  { category: 'SEO', items: ['SEO'], icon: Search },
  { category: 'Theme / Branding', items: ['Theme / Branding'], icon: Palette },
  { category: 'Analytics', items: ['Analytics'], icon: BarChart3 },
  { category: 'Settings', items: ['Settings'], icon: Settings },
  { category: 'Admin Users', items: ['Admin Users'], icon: ShieldCheck }
];

// ─── Main AdminPanel ──────────────────────────────────────────────────────────
export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { content, updateContent, resetContent, isSaving, lastSaved } = useContent();
  const [activeCategory, setActiveCategory] = useState('Dashboard');
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [localContent, setLocalContent] = useState(content);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Prevent background body scroll while Admin Panel is open
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // Local update (immediate UI) then push to context
  const update = (path: string[], value: any) => {
    const newLocal = JSON.parse(JSON.stringify(localContent));
    if (path.length === 0) {
      setLocalContent(value);
      updateContent([], value);
      return;
    }
    let cur = newLocal;
    for (let i = 0; i < path.length - 1; i++) {
      const k = path[i];
      if (cur[k] === undefined) cur[k] = {};
      cur = cur[k];
    }
    cur[path[path.length - 1]] = value;
    setLocalContent(newLocal);
    updateContent(path, value);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    await updateContent([], localContent as any);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleReset = async () => {
    if (!confirm('Reset ALL content to defaults? This cannot be undone.')) return;
    await resetContent();
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex h-screen w-screen overflow-hidden select-auto"
      data-lenis-prevent="true"
      onWheel={e => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div className="flex-1 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel Container */}
      <div
        className="cfx-admin w-full max-w-6xl bg-gray-100 border-l border-gray-300 flex h-full max-h-screen overflow-hidden shadow-2xl"
        data-lenis-prevent="true"
        onWheel={e => e.stopPropagation()}
      >

        {/* Sidebar */}
        <aside
          className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full overflow-y-auto overscroll-contain"
          data-lenis-prevent="true"
        >
          <div className="px-5 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-sm font-semibold text-gray-900">CreativeFX</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Content management</p>
          </div>
          <nav className="py-3 flex-1 overflow-y-auto">
            {MENU.map(menu => {
              const Icon = menu.icon;
              const catActive = activeCategory === menu.category;
              return (
                <div key={menu.category} className="mb-1">
                  <button
                    type="button"
                    onClick={() => { setActiveCategory(menu.category); setActiveItem(menu.items[0]); }}
                    className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors cursor-pointer ${
                      catActive ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${catActive ? 'text-gray-900' : 'text-gray-400'}`} />
                    <span className="truncate">{menu.category}</span>
                  </button>
                  {catActive && menu.items.length > 1 && (
                    <div className="pb-2">
                      {menu.items.map(item => {
                        const isActive = activeItem === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => { setActiveCategory(menu.category); setActiveItem(item); }}
                            className={`w-full text-left pl-[46px] pr-5 py-2 text-[13px] transition-colors cursor-pointer ${
                              isActive
                                ? 'text-gray-900 font-medium bg-gray-50'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full max-h-screen overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{activeCategory}</span>
                {activeCategory !== activeItem && (
                  <>
                    <span>/</span>
                    <span className="text-gray-700 font-medium">{activeItem}</span>
                  </>
                )}
              </nav>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isSaving
                  ? 'Saving changes…'
                  : lastSaved
                    ? `All changes saved · ${lastSaved.toLocaleTimeString()}`
                    : 'All changes save automatically'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                title="Reset all content to defaults"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Close panel"
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Content Scroll Area */}
          <main
            className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-6 h-full select-auto"
            data-lenis-prevent="true"
            onWheel={e => e.stopPropagation()}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="max-w-4xl space-y-6 pb-16">
              {/* 1. Dashboard */}
              {activeCategory === 'Dashboard' && (
                <DashboardSection
                  content={localContent}
                  onNavigate={(cat, itm) => { setActiveCategory(cat); setActiveItem(itm); }}
                />
              )}

              {/* 2. Homepage */}
              {activeCategory === 'Homepage' && (
                <HomepageSection content={localContent} update={update} />
              )}

              {/* 3. Works / Projects (master project database) */}
              {activeCategory === 'Works / Projects' && (
                <WorksSection item={activeItem} content={localContent} update={update} />
              )}

              {/* 4. Weddings experience */}
              {activeCategory === 'Weddings' && (
                <WeddingsAdmin tab={activeItem} content={localContent} update={update} />
              )}

              {/* 5. Services */}
              {activeCategory === 'Services' && (
                <ServicesAdmin content={localContent} update={update} />
              )}

              {/* 6. About */}
              {activeCategory === 'About' && (
                <AboutAdmin content={localContent} update={update} />
              )}

              {/* 7. Page-level copy */}
              {activeCategory === 'Pages' && (
                <PagesSection item={activeItem} content={localContent} update={update} />
              )}

              {/* 8. Media Library */}
              {activeCategory === 'Media Library' && (
                <MediaLibrarySection item={activeItem} content={localContent} update={update} />
              )}

              {/* 9. Navigation & Footer & Visibility */}
              {(activeCategory === 'Navigation & Footer') && (
                <WebsiteSection item={activeItem} content={localContent} update={update} />
              )}

              {/* 10. Contact / Inquiries */}
              {activeCategory === 'Contact / Inquiries' && (
                <ContactInquiriesSection content={localContent} update={update} />
              )}

              {/* 11. SEO */}
              {activeCategory === 'SEO' && (
                <SEOSection content={localContent} update={update} />
              )}

              {/* 12. Theme / Branding */}
              {activeCategory === 'Theme / Branding' && (
                <ThemeSection content={localContent} update={update} />
              )}

              {/* 13. Analytics */}
              {activeCategory === 'Analytics' && (
                <AnalyticsSection content={localContent} update={update} />
              )}

              {/* 14. Settings */}
              {activeCategory === 'Settings' && (
                <SettingsSection
                  content={localContent}
                  update={update}
                  resetContent={resetContent}
                />
              )}

              {/* 15. Admin Users */}
              {activeCategory === 'Admin Users' && (
                <AdminUsersSection />
              )}
            </div>
          </main>

          {/* Footer Save Bar */}
          <footer className="flex-shrink-0 px-6 sm:px-8 py-3 border-t border-gray-200 bg-white flex items-center justify-between z-10">
            <p className="text-[11px] text-gray-500">
              Changes sync to the server automatically
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-5 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
            >
              {saveStatus === 'saving' ? <Loader className="w-3.5 h-3.5 animate-spin" /> : saveStatus === 'saved' ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Save className="w-3.5 h-3.5" />}
              {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Save all'}
            </button>
          </footer>
        </div>

      </div>
    </div>
  );
};
