import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Debug log endpoint for browser errors
  if (req.method === 'POST' && req.url === '/__debug_log') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      console.log(`\n🔴 [BROWSER LOG/ERROR]:\n${body}\n`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    });
    return;
  }

  // Runtime environment config for Supabase
  if (req.url.startsWith('/api/config')) {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    res.end(JSON.stringify({
      supabaseUrl,
      supabaseAnonKey,
      configured: Boolean(supabaseUrl && supabaseAnonKey)
    }));
    return;
  }

  // Handle analytics proxy and event tracking mocks
  if (req.url.startsWith('/~api/') || req.url.startsWith('/__l5e/trackevents')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"status":"ok"}');
    return;
  }

  const urlPath = req.url.split('?')[0];

  // Redirect /book to /cart
  if (urlPath === '/book') {
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    console.log(`[302 Redirect] ${req.url} -> /cart${query}`);
    res.writeHead(302, { 'Location': `/cart${query}` });
    res.end();
    return;
  }

  // Map Lovable CDN asset paths: /__l5e/assets-v1/.../<filename> -> images/<filename>
  let safePath;
  if (urlPath.startsWith('/__l5e/assets-v1/')) {
    const filename = path.basename(urlPath);
    safePath = path.join('images', filename);
  } else {
    safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  }

  let filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        const ext = path.extname(urlPath).toLowerCase();
        // If it's a file request (has known static file extension), DO NOT return index.html!
        if (MIME_TYPES[ext]) {
          console.log(`[404] ${req.method} ${req.url} -> File Not Found`);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }

        // SPA Fallback for client-side routing (HTML pages only)
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, 'utf8', (indexErr, indexHtml) => {
          if (indexErr) {
            console.log(`[404] ${req.method} ${req.url} -> Not Found`);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
          }

          // Strip SSR Home page content so only the target subpage is rendered without flashing Home!
          const startMarker = '<body><!--$-->';
          const endMarker = '<!--/$-->';
          let responseHtml = indexHtml;
          const idx1 = indexHtml.indexOf(startMarker);
          const idx2 = indexHtml.indexOf(endMarker);
          if (idx1 !== -1 && idx2 !== -1 && idx2 > idx1) {
            const cleanShell = '<div class="min-h-screen bg-background text-foreground"></div>';
            responseHtml = indexHtml.substring(0, idx1 + startMarker.length) + cleanShell + indexHtml.substring(idx2);
          }

          console.log(`[SPA 200] ${req.method} ${req.url} -> clean subpage fallback`);
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          });
          res.end(responseHtml);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      console.log(`[200] ${req.method} ${req.url} (${contentType})`);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Website is running at: http://localhost:${PORT}`);
});
