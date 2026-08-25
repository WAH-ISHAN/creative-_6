const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'data', 'content.json');
const projectsDataPath = path.join(__dirname, '..', 'src', 'data', 'projectsData.ts');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// 1. Hero Section Link
content.hero = content.hero || {};
content.hero.socialUrl = 'https://www.facebook.com/share/r/1Br1SqsowT/';
content.hero.socialLabel = 'WATCH 4K HERO REEL';

// Definition of social posts by category/project
const graduationPosts = [
  { name: 'Wayamba University - Convocation Reel', url: 'https://www.facebook.com/share/r/1Ag6mekb7Y/', type: 'reel' },
  { name: 'Sabaragamuwa University - Couples Reel', url: 'https://www.facebook.com/share/r/1DNVuBhp6T/', type: 'reel' },
  { name: 'Layani - Graduation Highlight (Facebook)', url: 'https://www.facebook.com/share/r/1d4gxLvjg5/', type: 'reel' },
  { name: 'Layani - Graduation Reel (Instagram)', url: 'https://www.instagram.com/reel/DbDgsELP4Ty/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Peradeniya University - Parents Edition (Facebook)', url: 'https://www.facebook.com/share/r/1C3QQpmcsq/', type: 'reel' },
  { name: 'Peradeniya University - Parents Reel (Instagram)', url: 'https://www.instagram.com/reel/Daw7mN2v_eZ/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Peradeniya University - Main Convocation Film (Facebook)', url: 'https://www.facebook.com/share/r/18otAnFbdS/', type: 'reel' },
  { name: 'Peradeniya University - Main Reel (Instagram)', url: 'https://www.instagram.com/reel/DaPU_YkCgFp/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Peradeniya University - Couples Highlight (Facebook)', url: 'https://www.facebook.com/share/r/1BLza21hhZ/', type: 'reel' },
  { name: 'Peradeniya University - Couples Reel (Instagram)', url: 'https://www.instagram.com/reel/DaDHvScSqjh/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Dilki - Graduation Reel (Facebook)', url: 'https://www.facebook.com/share/r/1BksPD3i7o/', type: 'reel' },
  { name: 'Dilki - Graduation Reel (Instagram)', url: 'https://www.instagram.com/reel/DVi1w2eDyyW/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'SLIIT - Parents Edition (Facebook)', url: 'https://www.facebook.com/share/r/14ifxdhdF1V/', type: 'reel' },
  { name: 'SLIIT - Parents Reel (Instagram)', url: 'https://www.instagram.com/reel/DVdkcc9DwIS/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Kaveen & Sanuri - Convocation Shoot (Facebook)', url: 'https://www.facebook.com/share/p/1QCxTqzgxv/', type: 'album' },
  { name: 'Kaveen & Sanuri - Convocation Album (Instagram)', url: 'https://www.instagram.com/p/Da2yITZD01b/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' },
  { name: 'Nadeeka - Convocation Album (Facebook)', url: 'https://www.facebook.com/share/p/1GqnJqqrBq/', type: 'album' },
  { name: 'Anupama - Graduation Portrait Session (Facebook)', url: 'https://www.facebook.com/share/p/1Bizpe11G1/', type: 'album' },
  { name: 'Madukanka - Convocation Album (Facebook)', url: 'https://www.facebook.com/share/p/1C2h4LEfW6/', type: 'album' },
  { name: 'Samudi - Convocation Album (Facebook)', url: 'https://www.facebook.com/share/p/1D3Wo59pSv/', type: 'album' },
  { name: 'Vaichaly - Graduation Album (Facebook)', url: 'https://www.facebook.com/share/p/1LVhJb5seU/', type: 'album' },
  { name: 'Vaichaly - Graduation Album (Instagram)', url: 'https://www.instagram.com/p/DRHF34Oj_QH/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' }
];

const eventsPosts = [
  { name: 'Sankalana Concert Film (Facebook)', url: 'https://www.facebook.com/share/r/1HVQWa5Lru/', type: 'reel' },
  { name: 'Sankalana Concert Reel (Instagram)', url: 'https://www.instagram.com/reel/DcV75uAAj4U/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Euphoria Concert Film (Facebook)', url: 'https://www.facebook.com/share/r/1DuRKmj15y/', type: 'reel' },
  { name: 'Euphoria Concert Reel (Instagram)', url: 'https://www.instagram.com/reel/DXlVVaRAJAR/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Bhadrakali Amman Temple Maha Kumbhabhishekam', url: 'https://www.facebook.com/share/v/1CxME63StG/', type: 'video' },
  { name: 'Tezlaa - Opening Ceremony Film', url: 'https://www.facebook.com/share/v/1TXyVzNfTR/', type: 'video' },
  { name: 'SLIIT Wasantha Muwadora - Awurudu Film (Facebook)', url: 'https://www.facebook.com/share/r/1ZACAkZhxo/', type: 'reel' },
  { name: 'SLIIT Wasantha Muwadora - Awurudu Reel (Instagram)', url: 'https://www.instagram.com/reel/DX540RHATGD/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Sankalana Concert - Photo Album (Facebook)', url: 'https://www.facebook.com/share/p/198XMTJp5C/', type: 'album' },
  { name: 'Euphoria Concert - Photo Album (Facebook)', url: 'https://www.facebook.com/share/p/1JmpDsJ1mG/', type: 'album' },
  { name: 'Euphoria Concert - Photo Album (Instagram)', url: 'https://www.instagram.com/p/DXrH1s7D3Lm/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' },
  { name: '25th Anniversary Milestone Album (Facebook)', url: 'https://www.facebook.com/share/p/1E9tWW6g5i/', type: 'album' }
];

const casualPosts = [
  { name: 'Janakalani - Casual Shoot (Facebook)', url: 'https://www.facebook.com/share/p/1GqKQqchBx/', type: 'album' },
  { name: 'Janakalani - Casual Shoot (Instagram)', url: 'https://www.instagram.com/p/DZPzSPMjzrP/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' },
  { name: 'Githmi - Casual Shoot (Facebook)', url: 'https://www.facebook.com/share/p/197ZHfJjdw/', type: 'album' },
  { name: 'Githmi - Casual Shoot (Instagram)', url: 'https://www.instagram.com/p/DYXI32nj5ri/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' },
  { name: 'Dewmini - Casual Shoot (Facebook)', url: 'https://www.facebook.com/share/p/1Dg1TYJARY/', type: 'album' },
  { name: 'Dewmini - Casual Shoot (Instagram)', url: 'https://www.instagram.com/p/DH_ExQgvWpm/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' },
  { name: 'Dinara - Casual Shoot (Instagram)', url: 'https://www.instagram.com/p/DcYoz_-D2yz/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' },
  { name: 'Thathsarani - Birthday & Casual (Facebook)', url: 'https://www.facebook.com/share/p/1EJ3YrVdoc/', type: 'album' },
  { name: 'Thathsarani - Birthday & Casual (Instagram)', url: 'https://www.instagram.com/p/DGdTRmbviRM/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'album' }
];

const conceptualReelsAndBirthday = [
  { name: 'Ayodya - Conceptual Reel (Facebook)', url: 'https://www.facebook.com/share/r/19RQnN5yrG/', type: 'reel' },
  { name: 'Ayodya - Conceptual Reel (Instagram)', url: 'https://www.instagram.com/reel/DZxJOWsv9eo/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'වරාමලී - Conceptual Reel (Facebook)', url: 'https://www.facebook.com/share/r/1bmbVuQEmZ/', type: 'reel' },
  { name: 'වරාමලී - Conceptual Reel (Instagram)', url: 'https://www.instagram.com/reel/DZmyOECvjiF/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Wageesha - Conceptual Reel (Facebook)', url: 'https://www.facebook.com/share/r/1EseuUkCZe/', type: 'reel' },
  { name: 'Wageesha - Conceptual Reel (Instagram)', url: 'https://www.instagram.com/reel/DY3uT--vnSv/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Samara - Conceptual Reel (Facebook)', url: 'https://www.facebook.com/share/r/14otwB5BTGd/', type: 'reel' },
  { name: 'Samara - Conceptual Reel (Instagram)', url: 'https://www.instagram.com/reel/DYhaix1vcEB/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'සඳවති - Conceptual Reel (Facebook)', url: 'https://www.facebook.com/share/r/19KLF3wjxF/', type: 'reel' },
  { name: 'සඳවති - Conceptual Reel (Instagram)', url: 'https://www.instagram.com/reel/DYPRgAYPNjs/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Mi Chico - Dance Cover Reel (Facebook)', url: 'https://www.facebook.com/share/r/19aBu38Jr1/', type: 'reel' },
  { name: 'Kavkaz - Conceptual Reel (Facebook)', url: 'https://www.facebook.com/share/r/1DSUj7yzAE/', type: 'reel' },
  { name: 'Kavkaz - Conceptual Reel (Instagram)', url: 'https://www.instagram.com/reel/DYMr964v98T/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', type: 'reel' },
  { name: 'Chamudi - Birthday Photo Album (Facebook)', url: 'https://www.facebook.com/share/p/1Cxv6RXmgj/', type: 'album' }
];

const anniversaryPosts = [
  { name: '25th Anniversary Milestone Album (Facebook)', url: 'https://www.facebook.com/share/p/1E9tWW6g5i/', type: 'album' }
];

// Update matching projects
for (const p of content.projects) {
  if (p.id === 'proj-03' || p.id === 'video-graduation' || p.id === 'photo-graduation') {
    p.socialUrl = 'https://www.facebook.com/share/r/1Ag6mekb7Y/';
    p.socialLabel = 'EXPLORE GRADUATION ARCHIVE';
    p.socialPosts = graduationPosts;
  } else if (p.id === 'story-meera-arjun' || p.id === 'video-events') {
    p.socialUrl = 'https://www.facebook.com/share/r/1HVQWa5Lru/';
    p.socialLabel = 'WATCH EVENT REELS & ALBUMS';
    p.socialPosts = eventsPosts;
  } else if (p.id === 'photo-casual' || p.id === 'photo-05' || p.id === 'photo-06') {
    p.socialUrl = 'https://www.facebook.com/share/p/1GqKQqchBx/';
    p.socialLabel = 'VIEW CASUAL & PORTRAIT SHOOTS';
    p.socialPosts = casualPosts;
  } else if (p.id === 'proj-05' || p.id === 'video-dance-covers') {
    p.socialUrl = 'https://www.facebook.com/share/r/19RQnN5yrG/';
    p.socialLabel = 'WATCH CONCEPTUAL REELS & FILMS';
    p.socialPosts = conceptualReelsAndBirthday;
  } else if (p.id === 'photo-03') {
    p.socialUrl = 'https://www.facebook.com/share/p/1E9tWW6g5i/';
    p.socialLabel = 'VIEW ANNIVERSARY ALBUM';
    p.socialPosts = anniversaryPosts;
  } else if (p.id === 'proj-01') {
    p.socialUrl = 'https://www.facebook.com/share/r/1Br1SqsowT/';
    p.socialLabel = 'WATCH COMMERCIAL REEL';
    p.socialPosts = [
      { name: 'CreativeFX - Commercial Production Reel (Facebook)', url: 'https://www.facebook.com/share/r/1Br1SqsowT/', type: 'reel' },
      { name: 'CreativeFX - Official Facebook Page', url: 'https://www.facebook.com/creativefx.lk', type: 'post' }
    ];
  }
}

// Write back to content.json
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
console.log('data/content.json updated successfully with all verified social links!');

// Sync to projectsData.ts
let pSrc = fs.readFileSync(projectsDataPath, 'utf8');

// Replace PROJECT_DEFAULTS_RAW with updated JSON
const projectsArrayStr = JSON.stringify(content.projects, null, 2);
pSrc = pSrc.replace(/export const PROJECT_DEFAULTS_RAW: Omit<ProjectCase, 'status'>\[\] = \[[\s\S]*?\];\n\nexport const ALL_PROJECTS/, `export const PROJECT_DEFAULTS_RAW: Omit<ProjectCase, 'status'>[] = ${projectsArrayStr};\n\nexport const ALL_PROJECTS`);
fs.writeFileSync(projectsDataPath, pSrc, 'utf8');
console.log('src/data/projectsData.ts updated successfully with all verified social links!');
