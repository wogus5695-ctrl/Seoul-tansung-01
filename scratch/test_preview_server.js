import http from 'http';
import fs from 'fs';
import path from 'path';
import seoHandler from '../api/seo.js';

const PORT = 3333;

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = urlObj.pathname;
  const queryK = urlObj.searchParams.get('k');

  // Static Assets Bypass (/assets/*, favicon, images)
  if (pathname.startsWith('/assets/') || pathname === '/favicon.png' || pathname.startsWith('/images/')) {
    const filePath = path.join(process.cwd(), 'dist', pathname.replace(/^\//, ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      let mime = 'application/octet-stream';
      if (ext === '.js') mime = 'application/javascript; charset=utf-8';
      else if (ext === '.css') mime = 'text/css; charset=utf-8';
      else if (ext === '.png') mime = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
      else if (ext === '.svg') mime = 'image/svg+xml';

      res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
      return res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
  }

  // Rewrite matching logic according to vercel.json
  if (pathname === '/sitemap-seoul' || pathname === '/privacy-policy' || (pathname === '/' && queryK) || (pathname === '/index.html' && queryK)) {
    // Dynamic SEO or special routes handled by api/seo.js
    const mockReq = {
      url: req.url,
      headers: req.headers,
      query: Object.fromEntries(urlObj.searchParams.entries())
    };

    let responseStatus = 200;
    let responseHeaders = {};
    let responseBody = '';

    const mockRes = {
      status(code) {
        responseStatus = code;
        return this;
      },
      setHeader(name, val) {
        responseHeaders[name.toLowerCase()] = val;
        return this;
      },
      send(body) {
        responseBody = body;
        res.writeHead(responseStatus, responseHeaders);
        res.end(responseBody);
        return this;
      },
      end() {
        res.writeHead(responseStatus, responseHeaders);
        res.end();
        return this;
      }
    };

    await seoHandler(mockReq, mockRes);
    return;
  }

  // Default SPA / Main Root -> serve dist/index.html
  const indexPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(indexPath, 'utf-8'));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Preview test server running at http://localhost:${PORT}`);
});
