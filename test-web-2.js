// test-web.js - Refined for nex-web
// @devster, 2025 (Refined Version)
// Start website by: $ node test-web.js

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');
const PORT  = 3100;

const server = http.createServer((req, res) => {
  // 1. SET CORS HEADERS -----------------------------------------------------------
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, xcert');

  // Handle Preflight (Browser security check)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let requestPath = parsedUrl.pathname;
  const method = req.method;

  // 2. API ROUTE WORK -------------------------------------------------------------
  if (requestPath === '/api/test' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>this is response from nex-web</h1>');
    console.log('→ API: /api/test triggered');
    return;
  }

  if (requestPath === '/api/new-post' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('→ API: /api/new-post received:', data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ msg: 'Success from nex-web', attach: data }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('error: invalid json format');
      }
    });
    return;
  }

  // 3. STATIC FILE HANDLING -------------------------------------------------------

  // Map root and sub-directories to index.html
  if (requestPath === '/' || requestPath === '') {
    requestPath = '/index.html';
  } else if (requestPath === '/pump' || requestPath === '/pump/') {
    requestPath = '/pump/index.html';
  }

  const filePath = path.join(__dirname, requestPath);
  const extname = String(path.extname(filePath)).toLowerCase();

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // --- 404 LOGIC ---
        const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.json'];
        const isAsset = assetExtensions.includes(extname);

        if (isAsset) {
          // It's a broken file/image: Send real 404
          console.warn(`× 404 Not Found (Asset): ${requestPath}`);
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end(`404: Asset not found: ${requestPath}`);
        } else {
          // It's a broken page: Redirect to root index.html
          console.warn(`× 404 Redirect (Page): ${requestPath} -> index.html`);
          const rootPath = path.join(__dirname, 'index.html');
          
          fs.readFile(rootPath, (rootErr, rootContent) => {
            if (rootErr) {
              res.writeHead(500);
              res.end("Critical Error: Main index.html not found.");
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
              res.end(rootContent);
            }
          });
        }
      } else {
        // General Server Error
        res.writeHead(500);
        res.end(`500: Server Error: ${err.code}`);
      }
    } else {
      // SUCCESS: Serve the file
      const charset = contentType.includes('text') ? '; charset=UTF-8' : '';
      res.writeHead(200, { 'Content-Type': contentType + charset });
      console.log(`→ 200 OK: ${requestPath}`);
      res.end(content);
    }
  });

});

// 4. START THE SERVER ------------------------------------------------------------
server.listen(PORT, () => {
  console.log('------------------------------------------------------------');
  console.log(`Nex-Web server running at http://localhost:${PORT}/`);
  console.log(`Base directory: ${__dirname}`);
  console.log('------------------------------------------------------------');
});