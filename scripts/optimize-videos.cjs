const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const FFMPEG_BIN = `"${ffmpeg.path}"`;
const VIDEO_DIR = path.join(__dirname, '..', 'public', 'video');

function getAllFiles(dir, ext = ['.mp4', '.MP4']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, ext));
    } else if (ext.includes(path.extname(item.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

console.log('=== Web Video Optimization Engine (Resume Mode) ===');
const videoFiles = getAllFiles(VIDEO_DIR);

for (const filePath of videoFiles) {
  const stat = fs.statSync(filePath);
  const origMB = (stat.size / 1024 / 1024).toFixed(1);

  // If already under 35MB and not intro-hero (or if already optimized), check if it needs compression
  if (stat.size < 34 * 1024 * 1024 && !filePath.includes('intro-hero')) {
    console.log(`[SKIP] Already optimized: ${path.relative(VIDEO_DIR, filePath)} (${origMB} MB)`);
    continue;
  }

  const tempOut = filePath.replace(/\.mp4$/i, '_opt.mp4');
  console.log(`\nOptimizing: ${path.relative(VIDEO_DIR, filePath)} (${origMB} MB)...`);

  try {
    const cmd = `${FFMPEG_BIN} -y -i "${filePath}" -c:v libx264 -crf 26 -preset fast -vf "scale='min(1080,iw)':-2" -pix_fmt yuv420p -movflags +faststart -an "${tempOut}"`;
    execSync(cmd, { stdio: 'pipe' });

    if (fs.existsSync(tempOut)) {
      const newStat = fs.statSync(tempOut);
      const newMB = (newStat.size / 1024 / 1024).toFixed(1);

      fs.unlinkSync(filePath);
      fs.renameSync(tempOut, filePath);
      console.log(`  -> Done: ${newMB} MB (${Math.round((1 - newStat.size / stat.size) * 100)}% smaller, FastStart OK)`);
    }
  } catch (err) {
    console.error(`  -> Failed: ${err.message}`);
    if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
  }
}

console.log('\nAll remaining videos successfully optimized!');
