import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function serveLocalMediaPlugin(): Plugin {
  return {
    name: 'serve-local-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const decodedUrl = decodeURIComponent(req.url?.split('?')[0] || '');
          if (
            decodedUrl.startsWith('/img/') ||
            decodedUrl.startsWith('/video/') ||
            decodedUrl.startsWith('/uploads/') ||
            decodedUrl.startsWith('/web intro/')
          ) {
            let filePath = path.join(__dirname, decodedUrl);
            if (!fs.existsSync(filePath) && decodedUrl.startsWith('/uploads/')) {
              filePath = path.join(__dirname, 'public', decodedUrl);
            }
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const stat = fs.statSync(filePath);
              const fileSize = stat.size;
              const ext = path.extname(filePath).toLowerCase();
              const mimeTypes: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.mov': 'video/quicktime',
                '.mp3': 'audio/mpeg',
              };
              const contentType = mimeTypes[ext] || 'application/octet-stream';
              const range = req.headers.range;

              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunkSize = end - start + 1;
                const file = fs.createReadStream(filePath, { start, end });
                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunkSize,
                  'Content-Type': contentType,
                });
                file.pipe(res);
                return;
              } else {
                res.writeHead(200, {
                  'Content-Length': fileSize,
                  'Content-Type': contentType,
                  'Accept-Ranges': 'bytes',
                  'Cache-Control': 'public, max-age=86400',
                });
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
          }
        } catch (e) {
          // fallback to next
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serveLocalMediaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-gsap': ['gsap'],
            'vendor-lenis': ['lenis'],
          },
        },
      },
      chunkSizeWarningLimit: 700,
      assetsInlineLimit: 4096,
    },
    server: {
      proxy: {
        '/api': 'http://localhost:4000',
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/img/**', '**/video/**', '**/data/**', '**/*.txt']
      },
    },
  };
});
