/**
 * CreativeFX Image Optimizer — Windows-safe version
 * Reads each file via Buffer, optimizes with sharp, writes back.
 * Works around Windows "unknown error" on paths with special characters by
 * reading the file as a buffer first (sharp .toBuffer() output pipeline).
 *
 * Usage: node scripts/optimize-images.cjs
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

const IMG_ROOT = path.join(__dirname, '..', 'img');
const MAX_WIDTH = 1920;
const QUALITY = 82;

let processed = 0;
let skipped = 0;
let errors = 0;
let savedBytes = 0;

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  let stat;
  try { stat = fs.statSync(filePath); } catch { return; }
  
  // Skip already-small files (< 200KB)
  if (stat.size < 200 * 1024) { skipped++; return; }

  const originalSize = stat.size;

  try {
    // Read file as buffer first (avoids Windows UNC/special-char path issues)
    const inputBuffer = fs.readFileSync(filePath);
    
    const image = sharp(inputBuffer);
    const meta = await image.metadata();
    
    const buffer = await image
      .rotate()
      .resize(meta.width > MAX_WIDTH ? { width: MAX_WIDTH, withoutEnlargement: true } : undefined)
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    if (buffer.length < originalSize) {
      fs.writeFileSync(filePath, buffer);
      const saved = originalSize - buffer.length;
      savedBytes += saved;
      const pct = ((saved / originalSize) * 100).toFixed(0);
      const rel = filePath.replace(IMG_ROOT, '').substring(1);
      console.log(`✓ ${rel.substring(0, 55).padEnd(55)} ${(originalSize/1024/1024).toFixed(1)}MB → ${(buffer.length/1024/1024).toFixed(1)}MB  -${pct}%`);
      processed++;
    } else {
      skipped++;
    }
  } catch (err) {
    const rel = filePath.replace(IMG_ROOT, '').substring(1);
    console.error(`✗ ${rel}: ${err.message}`);
    errors++;
  }
}

function walkDir(dir, callback) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, callback);
    } else if (entry.isFile()) {
      callback(full);
    }
  }
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  CreativeFX Image Optimizer (Windows-safe)');
  console.log('═══════════════════════════════════════════════════\n');

  const allFiles = [];
  walkDir(IMG_ROOT, (f) => allFiles.push(f));
  
  console.log(`  Found ${allFiles.length} files to check...\n`);

  for (const file of allFiles) {
    await optimizeImage(file);
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  ✓ Optimized : ${processed} images`);
  console.log(`  → Skipped   : ${skipped} (small / unchanged)`);
  console.log(`  ✗ Errors    : ${errors}`);
  console.log(`  💾 Saved    : ${(savedBytes / 1024 / 1024).toFixed(1)} MB total`);
  console.log('═══════════════════════════════════════════════════\n');
}

main().catch(console.error);
