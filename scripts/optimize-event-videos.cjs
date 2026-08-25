const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const FFMPEG_BIN = `"${ffmpeg.path}"`;

const eventsDir = path.join(__dirname, '..', 'public', 'video', 'Events');
if (!fs.existsSync(eventsDir)) fs.mkdirSync(eventsDir, { recursive: true });

const files = [
  { in: path.join(__dirname, '..', 'video', 'Events', 'finalWasthi.mp4'), out: path.join(eventsDir, 'finalWasthi.mp4') },
  { in: path.join(__dirname, '..', 'video', 'Events', 'ColoredFinalEuphoria (1).mp4'), out: path.join(eventsDir, 'ColoredFinalEuphoria (1).mp4') }
];

for (const f of files) {
  if (!fs.existsSync(f.in)) {
    console.log('Source not found:', f.in);
    continue;
  }
  const stat = fs.statSync(f.in);
  console.log(`Optimizing ${path.basename(f.in)} (${(stat.size/1024/1024).toFixed(1)} MB)...`);
  const cmd = `${FFMPEG_BIN} -y -i "${f.in}" -c:v libx264 -crf 26 -preset fast -vf "scale='min(1080,iw)':-2" -pix_fmt yuv420p -movflags +faststart -an "${f.out}"`;
  execSync(cmd, { stdio: 'inherit' });
  const outStat = fs.statSync(f.out);
  console.log(` -> Done: ${path.basename(f.out)} (${(outStat.size/1024/1024).toFixed(1)} MB)`);
}

console.log('Event videos successfully prepared for web streaming!');
