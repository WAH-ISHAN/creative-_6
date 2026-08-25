/**
 * One-time migration of data/content.json to the unified content model:
 *  - adds the `home` section (featured/selected project references)
 *  - removes the legacy duplicated `portfolio.items`
 *  - aligns `featured` flags with what the homepage actually displays
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'content.json');
const c = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// Featured Work on the live homepage today = these six photography sets
const FEATURED = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06'];
const SELECTED = ['proj-01', 'proj-02', '__weddings__', 'video-graduation', 'video-events', 'photo-casual', 'photo-02', 'proj-05'];

c.home = {
  featuredLabel: 'A curated selection of CreativeFX stories, captured with intention.',
  featuredProjectIds: FEATURED,
  selectedWorkIds: SELECTED,
  showWeddingsTile: true,
};

delete c.portfolio;

if (Array.isArray(c.projects)) {
  c.projects.forEach(p => {
    p.featured = FEATURED.includes(p.id);
    p.status = 'published';
  });
}

fs.writeFileSync(FILE, JSON.stringify(c, null, 2));
console.log('Migrated content.json:', {
  projects: c.projects?.length,
  featured: c.projects?.filter(p => p.featured).map(p => p.id),
});
