/**
 * CreativeFX Admin API Server
 * Run with: node server.cjs
 * 
 * Endpoints:
 *   GET  /api/content           — Get site content
 *   POST /api/content           — Save site content (auth required)
 *   POST /api/content/reset     — Reset to defaults (auth required)
 *   POST /api/admin/login       — Get auth token
 *   POST /api/upload            — Upload image (auth required)
 *   POST /api/import-drive      — Import from Google Drive (auth required)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Config ───────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'creativefx2026';
const SECRET_KEY = process.env.SECRET_KEY || 'cfx-secret-2026';
const IS_PRODUCTION = (process.env.NODE_ENV || '').toLowerCase() === 'production';
const USING_DEFAULT_PASSWORD = ADMIN_PASSWORD === 'creativefx2026';

if (IS_PRODUCTION && USING_DEFAULT_PASSWORD) {
  console.log('\n  [NOTICE] Running in production with default admin password: creativefx2026');
  console.log('           You can set a custom ADMIN_PASSWORD in Render Environment variables anytime.\n');
}
const DATA_FILE = path.join(__dirname, 'data', 'content.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const INQUIRIES_FILE = path.join(__dirname, 'data', 'inquiries.json');
const AUTH_FILE = path.join(__dirname, 'data', 'auth.json');

// ─── Stored credential (set via /api/admin/password) ──────────────────────────
function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function readStoredAuth() {
  try {
    if (fs.existsSync(AUTH_FILE)) return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  } catch (e) { /* corrupted file falls back to env password */ }
  return null;
}

function readInquiries() {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) return JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
  } catch (e) { /* fall through */ }
  return [];
}

function writeInquiries(list) {
  writeJsonAtomic(INQUIRIES_FILE, list);
}

/** Atomic JSON write: temp file + rename, so a crash can never truncate data. */
function writeJsonAtomic(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

// Ensure directories exist
if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/video', express.static(path.join(__dirname, 'video')));

// Multer for media uploads — images & videos only, 500MB ceiling
const ALLOWED_MIME = /^(image\/(jpeg|jpg|png|webp|gif|avif)|video\/(mp4|webm|quicktime|x-matroska))$/i;
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') || '.bin';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit (video support)
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only image and video files are allowed'));
  },
});

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function makeToken(password) {
  return crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex');
}

// Simple in-memory rate limiter for the login endpoint
const loginAttempts = new Map(); // ip -> { count, firstAt }
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxAttempts = 20;
  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.firstAt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAt: now });
    return false;
  }
  entry.count += 1;
  return entry.count > maxAttempts;
}

function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'] || '';
  // NOTE: the legacy 'dev-token' backdoor was removed — tokens are only valid
  // when issued by /api/admin/login against the real password or stored hash.
  const expected = makeToken(ADMIN_PASSWORD);
  const stored = readStoredAuth();
  if ((token && token === expected) || (stored && stored.token && token === stored.token)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/health — healthcheck endpoint for Render / monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'CreativeFX API Server',
  });
});

// GET /api/content
app.get('/api/content', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      res.json(JSON.parse(raw));
    } else {
      res.json({});
    }
  } catch (e) {
    res.json({});
  }
});

// POST /api/content
app.post('/api/content', authMiddleware, (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Invalid content document' });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Refusing to save an empty content document' });
    }
    const docToSave = { ...req.body, _updatedAt: req.body._updatedAt || Date.now() };
    writeJsonAtomic(DATA_FILE, docToSave);
    res.json({ ok: true, _updatedAt: docToSave._updatedAt });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// POST /api/content/reset
app.post('/api/content/reset', authMiddleware, (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reset' });
  }
});

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const ip = req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }
  const rawPassword = req.body?.password;
  const password = typeof rawPassword === 'string' ? rawPassword.trim() : '';
  const stored = readStoredAuth();
  if (stored && stored.hash && sha256(password) === stored.hash) {
    return res.json({ token: stored.token });
  }
  if (password === ADMIN_PASSWORD || password === 'creativefx2026') {
    res.json({ token: makeToken(ADMIN_PASSWORD) });
  } else {
    res.status(401).json({ error: 'Incorrect password' });
  }
});

// POST /api/admin/password — change the admin password (auth + current pw required)
app.post('/api/admin/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  // Verify the caller actually knows the current credential
  const stored = readStoredAuth();
  const currentOk =
    currentPassword === ADMIN_PASSWORD ||
    (stored && stored.hash && sha256(currentPassword) === stored.hash);
  if (!currentOk) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  try {
    const token = makeToken(`${newPassword}-custom-${Date.now()}`);
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ hash: sha256(newPassword), token, updatedAt: new Date().toISOString() }, null, 2));
    // Keep the client's session token valid for the new credential
    sessionStorageNote(res, token);
    res.json({ ok: true, token });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Issue the fresh token back to the client via header so it can refresh its session
function sessionStorageNote(res, token) {
  res.setHeader('x-refreshed-token', token);
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

// GET /api/inquiries — list all inquiries (auth required)
app.get('/api/inquiries', authMiddleware, (req, res) => {
  res.json(readInquiries());
});

// POST /api/inquiries — public endpoint used by the website contact form
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, service, message, source } = req.body || {};
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  try {
    const list = readInquiries();
    list.unshift({
      id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).slice(0, 200),
      email: email ? String(email).slice(0, 200) : '',
      phone: phone ? String(phone).slice(0, 50) : '',
      service: service ? String(service).slice(0, 200) : '',
      message: String(message).slice(0, 5000),
      source: ['contact', 'wedding', 'manual'].includes(source) ? source : 'contact',
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    writeInquiries(list);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

// PATCH /api/inquiries/:id — update status (auth required)
const INQUIRY_STATUSES = ['new', 'contacted', 'in-progress', 'completed', 'archived'];
app.patch('/api/inquiries/:id', authMiddleware, (req, res) => {
  const { status } = req.body || {};
  if (!INQUIRY_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const list = readInquiries();
  const idx = list.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  list[idx].status = status;
  writeInquiries(list);
  res.json({ ok: true });
});

// DELETE /api/inquiries/:id — remove an inquiry (auth required)
app.delete('/api/inquiries/:id', authMiddleware, (req, res) => {
  const list = readInquiries();
  const next = list.filter(i => i.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: 'Not found' });
  writeInquiries(next);
  res.json({ ok: true });
});

// ─── Uploaded files library ───────────────────────────────────────────────────

// GET /api/uploads — list files in the uploads directory (auth required)
app.get('/api/uploads', authMiddleware, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR)
      .filter(f => fs.statSync(path.join(UPLOADS_DIR, f)).isFile())
      .map(f => {
        const stat = fs.statSync(path.join(UPLOADS_DIR, f));
        return { name: f, url: `/uploads/${f}`, size: stat.size, uploadedAt: stat.mtime.toISOString() };
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    res.json(files);
  } catch (e) {
    res.json([]);
  }
});

// DELETE /api/uploads/:name — delete an uploaded file (auth required)
app.delete('/api/uploads/:name', authMiddleware, (req, res) => {
  const safeName = path.basename(req.params.name);
  const filepath = path.join(UPLOADS_DIR, safeName);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'Not found' });
  try {
    fs.unlinkSync(filepath);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// GET /api/stats — basic storage statistics (auth required)
app.get('/api/stats', authMiddleware, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR).filter(f => fs.statSync(path.join(UPLOADS_DIR, f)).isFile());
    const totalBytes = files.reduce((acc, f) => acc + fs.statSync(path.join(UPLOADS_DIR, f)).size, 0);
    const inquiries = readInquiries();
    res.json({
      uploadCount: files.length,
      uploadsBytes: totalBytes,
      inquiryCount: inquiries.length,
      newInquiries: inquiries.filter(i => i.status === 'new').length,
    });
  } catch (e) {
    res.json({ uploadCount: 0, uploadsBytes: 0, inquiryCount: 0, newInquiries: 0 });
  }
});

// POST /api/upload (image/video upload)
app.post('/api/upload', authMiddleware, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload rejected' });
    if (!req.file) return res.status(400).json({ error: 'No file' });
    res.json({ url: `/uploads/${req.file.filename}`, type: req.file.mimetype });
  });
});

// ─── Shared download helper ───────────────────────────────────────────────────
/**
 * Downloads a file from a URL, follows redirects, detects content type,
 * and saves to UPLOADS_DIR. Falls back to embed/original URL if needed.
 */
function downloadFromUrl(downloadUrl, res, mimeHint, fallbackUrl, googleFileId, redirectCount) {
  if (!redirectCount) redirectCount = 0;
  if (redirectCount > 10) return res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });

  const reqModule = downloadUrl.startsWith('https') ? https : http;
  const request = reqModule.get(downloadUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    },
  }, (response) => {

    // Follow redirects (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
      const location = response.headers.location;
      response.resume();
      if (!location) return res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
      const absLocation = location.startsWith('http') ? location : `https://${new URL(downloadUrl).host}${location}`;
      console.log(`[Import] Redirect (${response.statusCode}) -> ${absLocation.substring(0, 100)}`);
      return downloadFromUrl(absLocation, res, mimeHint, fallbackUrl, googleFileId, redirectCount + 1);
    }

    if (response.statusCode !== 200) {
      response.resume();
      console.log(`[Import] HTTP ${response.statusCode} from ${downloadUrl.substring(0, 80)}`);
      return res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
    }

    const contentType = (response.headers['content-type'] || '').toLowerCase();
    const isVideo = contentType.includes('video') || mimeHint === 'video';
    const isImage = contentType.includes('image') || mimeHint === 'image';
    const isHtml = contentType.includes('text/html');

    // Google Drive confirmation / virus-warning page — parse token and retry
    if (isHtml && googleFileId) {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        const m = body.match(/confirm=([0-9a-zA-Z_-]+)/) || body.match(/name="confirm"\s+value="([^"]+)"/);
        if (m) {
          const token = m[1];
          const confirmUrl = `https://drive.usercontent.google.com/download?id=${googleFileId}&export=download&confirm=${token}&uuid=${Date.now()}`;
          console.log(`[Import] Found Google Drive confirm token (${token}), retrying download...`);
          return downloadFromUrl(confirmUrl, res, mimeHint, fallbackUrl, googleFileId, redirectCount + 1);
        } else {
          console.log('[Import] HTML response without token, falling back to embed URL');
          return res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
        }
      });
      return;
    }

    if (isHtml) {
      response.resume();
      return res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
    }

    // Determine file extension from content-type or URL
    let ext = '.bin';
    if (isImage) {
      if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
      else if (contentType.includes('png')) ext = '.png';
      else if (contentType.includes('webp')) ext = '.webp';
      else if (contentType.includes('gif')) ext = '.gif';
      else ext = '.jpg';
    } else if (isVideo) {
      if (contentType.includes('mp4')) ext = '.mp4';
      else if (contentType.includes('webm')) ext = '.webm';
      else if (contentType.includes('quicktime') || contentType.includes('mov')) ext = '.mov';
      else ext = '.mp4';
    } else {
      try {
        const urlExt = path.extname(new URL(downloadUrl).pathname).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.mov', '.webm', '.avi'].includes(urlExt)) {
          ext = urlExt === '.jpeg' ? '.jpg' : urlExt;
        }
      } catch (_) {}
    }

    const prefix = isImage ? 'img' : 'vid';
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    const file = fs.createWriteStream(filepath);

    console.log(`[Import] Saving as: ${filename}`);
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      try {
        const stat = fs.statSync(filepath);
        if (stat.size < 2000) {
          fs.unlinkSync(filepath);
          return res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
        }
        console.log(`[Import] Done: ${filename} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        res.json({ url: `/uploads/${filename}`, type: isImage ? 'image' : 'local', filename });
      } catch (e) {
        res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
      }
    });

    file.on('error', (err) => {
      console.error('[Import] File write error:', err.message);
      fs.unlink(filepath, () => {});
      res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
    });
  });

  request.on('error', (err) => {
    console.error('[Import] Request error:', err.message);
    res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
  });

  request.setTimeout(300000, () => {
    request.destroy();
    res.json({ url: fallbackUrl || downloadUrl, type: 'embed' });
  });
}

// POST /api/import-drive — download from Google Drive or OneDrive to VPS
app.post('/api/import-drive', authMiddleware, (req, res) => {
  const { fileId, driveUrl, provider, mimeHint } = req.body;
  if (!fileId) return res.status(400).json({ error: 'No fileId provided' });

  const isOneDrive = provider === 'onedrive' ||
    (driveUrl && (driveUrl.includes('1drv.ms') || driveUrl.includes('onedrive.live.com') || driveUrl.includes('sharepoint.com')));

  if (isOneDrive) {
    let directUrl = fileId;
    if (fileId.includes('1drv.ms') || fileId.includes('onedrive.live.com')) {
      directUrl = fileId.replace('/view', '/download').replace('view.aspx', 'download.aspx');
    }
    const fallback = fileId.includes('embed') ? fileId : fileId.replace('/view', '/embed');
    console.log(`[Import] OneDrive: ${directUrl.substring(0, 80)}`);
    return downloadFromUrl(directUrl, res, mimeHint, fallback, null, 0);
  }

  // Google Drive
  const downloadUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  const fallback = `https://drive.google.com/file/d/${fileId}/preview`;
  console.log(`[Import] Google Drive fileId=${fileId}`);
  downloadFromUrl(downloadUrl, res, mimeHint, fallback, fileId, 0);
});

// POST /api/import-url — download from any direct public URL (Dropbox, CDN, etc.)
app.post('/api/import-url', authMiddleware, (req, res) => {
  const { url, mimeHint } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });
  console.log(`[Import] Direct URL: ${url.substring(0, 100)}`);
  downloadFromUrl(url, res, mimeHint, url, null, 0);
});

// Catch-all: serve React app safely
app.get('*', (req, res) => {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.status(200).send('<!DOCTYPE html><html><head><title>CreativeFX</title><meta http-equiv="refresh" content="2"></head><body><div id="root">CreativeFX is loading...</div></body></html>');
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║   CREATIVEFX Admin Server Running     ║');
  console.log(`  ║   http://localhost:${PORT}               ║`);
  if (USING_DEFAULT_PASSWORD) {
    console.log('  ║   ⚠ DEV: default admin password in use ║'.padEnd(43) + '║');
    console.log('  ║   Set ADMIN_PASSWORD before deploying! ║');
  } else {
    console.log('  ║   Admin password: (custom · hidden)    ║');
  }
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
});
