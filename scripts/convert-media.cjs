const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const sharp = require('sharp');

const FFMPEG_BIN = `"${ffmpeg.path}"`;

// Directories to scan for media
const MEDIA_DIRS = [
  path.join(__dirname, '..', 'img'),
  path.join(__dirname, '..', 'video'),
  path.join(__dirname, '..', 'public', 'img'),
  path.join(__dirname, '..', 'public', 'video'),
  path.join(__dirname, '..', 'public', 'uploads'),
];

// Directories to search and replace extensions in code
const CODE_DIRS = [
  path.join(__dirname, '..', 'src'),
  path.join(__dirname, '..', 'data'),
];

const imageExts = ['.jpg', '.jpeg', '.png'];
const videoExts = ['.mp4', '.mov', '.avi', '.mkv'];

function getAllFiles(dir, exts) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else {
      const ext = path.extname(item.name).toLowerCase();
      if (!exts || exts.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function convertImage(filePath) {
  const ext = path.extname(filePath);
  const outPath = filePath.slice(0, -ext.length) + '.webp';
  
  if (fs.existsSync(outPath)) {
    console.log(`[SKIP] Already exists: ${outPath}`);
    if (fs.existsSync(filePath) && filePath !== outPath) {
       fs.unlinkSync(filePath);
    }
    return;
  }
  
  console.log(`Converting Image: ${filePath} -> ${outPath}`);
  try {
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outPath);
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(`Failed to convert image ${filePath}: ${err.message}`);
  }
}

function convertVideo(filePath) {
  const ext = path.extname(filePath);
  const outPath = filePath.slice(0, -ext.length) + '.webm';
  
  if (fs.existsSync(outPath)) {
    console.log(`[SKIP] Already exists: ${outPath}`);
    if (fs.existsSync(filePath) && filePath !== outPath) {
       fs.unlinkSync(filePath);
    }
    return;
  }
  
  console.log(`Converting Video: ${filePath} -> ${outPath}`);
  try {
    // libvpx (VP8) with scale to 720p max for fast processing
    const cmd = `${FFMPEG_BIN} -y -i "${filePath}" -vf "scale='min(1280,iw)':-2" -c:v libvpx -cpu-used 5 -deadline realtime -crf 30 -b:v 1M -c:a libvorbis "${outPath}"`;
    execSync(cmd, { stdio: 'pipe' });
    if (fs.existsSync(outPath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to convert video ${filePath}: ${err.message}`);
  }
}

async function processMedia() {
  console.log('=== Media Optimization to WebP/WebM ===');
  for (const dir of MEDIA_DIRS) {
    const images = getAllFiles(dir, imageExts);
    for (const img of images) {
      await convertImage(img);
    }
    
    const videos = getAllFiles(dir, videoExts);
    for (const vid of videos) {
      convertVideo(vid);
    }
  }
  console.log('Media conversion complete.');
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  // Replace .jpg, .jpeg, .png with .webp (case insensitive)
  newContent = newContent.replace(/\.(jpg|jpeg|png)(["'\b\?])/gi, '.webp$2');
  
  // Replace .mp4, .mov, .avi with .webm (case insensitive)
  newContent = newContent.replace(/\.(mp4|mov|avi)(["'\b\?])/gi, '.webm$2');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated references in: ${filePath}`);
  }
}

function processCode() {
  console.log('=== Updating References in Code ===');
  for (const dir of CODE_DIRS) {
    const files = getAllFiles(dir, null); // All files
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (['.ts', '.tsx', '.json', '.js', '.jsx'].includes(ext)) {
        replaceInFile(file);
      }
    }
  }
}

async function main() {
  await processMedia();
  processCode();
  console.log('=== Committing and Pushing to Git ===');
  try {
    execSync('git add -A', { stdio: 'inherit' });
    execSync('git commit -m "Optimize all images to WebP and videos to WebM"', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    console.log('Git push successful!');
  } catch (err) {
    console.error('Git push failed:', err.message);
  }
  console.log('All done!');
}

main().catch(console.error);
