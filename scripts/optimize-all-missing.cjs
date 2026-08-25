const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const FFMPEG_BIN = `"${ffmpeg.path}"`;

const missing = [
  { in: path.join(__dirname, '..', 'video', 'Marketing', 'RentMasterFinal.mp4'), out: path.join(__dirname, '..', 'public', 'video', 'Marketing', 'RentMasterFinal.mp4') },
  { in: path.join(__dirname, '..', 'video', 'Marketing', 'GreenCosmoPromotion.mp4'), out: path.join(__dirname, '..', 'public', 'video', 'Marketing', 'GreenCosmoPromotion.mp4') },
  { in: path.join(__dirname, '..', 'video', 'Birthdays', 'Final Wageesha Horton.mp4'), out: path.join(__dirname, '..', 'public', 'video', 'Birthdays', 'Final Wageesha Horton.mp4') },
  { in: path.join(__dirname, '..', 'video', 'Graduation', 'Dilki Final 02.mp4'), out: path.join(__dirname, '..', 'public', 'video', 'Graduation', 'Dilki Final 02.mp4') },
  { in: path.join(__dirname, '..', 'video', 'Products', 'Chefa Official Video (1).mp4'), out: path.join(__dirname, '..', 'public', 'video', 'Products', 'Chefa Official Video (1).mp4') }
];

for (const item of missing) {
  if (!fs.existsSync(item.in)) {
    console.log('Skipping not found:', item.in);
    continue;
  }
  const dir = path.dirname(item.out);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const stat = fs.statSync(item.in);
  console.log(`Optimizing ${path.basename(item.in)} (${(stat.size/1024/1024).toFixed(1)} MB)...`);
  const cmd = `${FFMPEG_BIN} -y -i "${item.in}" -c:v libx264 -crf 26 -preset fast -vf "scale='min(1080,iw)':-2" -pix_fmt yuv420p -movflags +faststart -an "${item.out}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    const outStat = fs.statSync(item.out);
    console.log(` -> Done: ${(outStat.size/1024/1024).toFixed(1)} MB`);
  } catch (e) {
    console.error(` -> Error: ${e.message}`);
  }
}

console.log('All missing videos processed!');
