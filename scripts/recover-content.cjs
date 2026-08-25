/**
 * Rebuilds data/content.json from the git baseline + static project defaults,
 * restoring the full master project list after the working-copy file was lost.
 * Also re-applies the unified-content migration (home block, status flags).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data', 'content.json');

// 1) Baseline from git (avoiding PowerShell UTF-16 redirection issues)
const headRaw = execSync('git show HEAD:data/content.json', { cwd: ROOT, encoding: 'utf8' });
const base = JSON.parse(headRaw);

// 2) Extract static defaults array from projectsData.ts (pure JSON object literals)
const ts = fs.readFileSync(path.join(ROOT, 'src', 'data', 'projectsData.ts'), 'utf8');
const marker = 'PROJECT_DEFAULTS_RAW';
const eq = ts.indexOf('=', ts.indexOf(marker));
const start = ts.indexOf('[', eq);
const end = ts.indexOf('];', start);
const staticProjects = JSON.parse(ts.slice(start, end + 1));

// 3) Merge: server records win per-id; static fills gaps; known extras appended
const byId = new Map();
for (const p of base.projects || []) byId.set(p.id, { ...p });
for (const p of staticProjects) {
  byId.set(p.id, { ...p, ...(byId.get(p.id) || {}) });
}
// 4) Recreate the admin-added "dance-covers" record (lost with the old file)
byId.set('video-dance-covers', {
  id: 'video-dance-covers',
  code: 'PROJECT / 009',
  slug: 'dance-covers',
  title: 'DANCE COVERS',
  client: 'CREATIVE VISUALS',
  type: 'video',
  featured: false,
  status: 'published',
  category: 'COMMERCIAL',
  categoryLabel: 'Dance & Choreography Visuals',
  year: '2026',
  coverImage: '/img/poster/FINAL AYODYA REEL .jpg',
  videoUrl: '/video/Birthdays/FINAL AYODYA REEL .MP4',
  aspectRatio: 'portrait',
  summary: 'Energetic and rhythmic dance cover video productions with dynamic lighting and camera movement.',
  challenge: 'Synchronizing camera movement and edits with complex choreography and rhythm.',
  solution: 'Custom gimbal moves, speed ramping, and beat-matched cuts.',
  deliverables: ['Dance Film', 'Instagram Reels', 'TikTok Cuts'],
  gallery: ['/video/Birthdays/FINAL AYODYA REEL .MP4', '/video/Birthdays/Githmi Final Video.mp4'],
  tags: ['Dance', 'Music Video', 'Choreography'],
});

const FEATURED = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06'];
const SELECTED = ['proj-01', 'proj-02', '__weddings__', 'video-graduation', 'video-events', 'photo-casual', 'photo-02', 'proj-05'];

const projects = [...byId.values()].map(p => ({
  ...p,
  featured: FEATURED.includes(p.id),
  status: 'published',
}));

const out = {
  ...base,
  home: {
    featuredLabel: 'A curated selection of CreativeFX stories, captured with intention.',
    featuredProjectIds: FEATURED,
    selectedWorkIds: SELECTED,
    showWeddingsTile: true,
  },
  projects,
};
delete out.portfolio;

fs.mkdirSync(path.dirname(FILE), { recursive: true });
fs.writeFileSync(FILE, JSON.stringify(out, null, 2), 'utf8');

console.log('Recovered content.json:', {
  projects: projects.length,
  ids: projects.map(p => p.id),
});
