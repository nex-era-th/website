// use this script to test nex-web
// @devster, 2025-1-15 11:56 +7
// start website by: $ node test-web.js

const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {

  //set CORS
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, xcert')

  // handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  //main response
  //res.writeHead(200, { 'Content-Type': 'text/plain' })
  //res.end('CORS is configured for your basic HTTP server.')





  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404: file not found', 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`500: server error: ${err.code}`, 'utf-8');
      }
    } else {
      // Specify UTF-8 encoding for HTML files
      if (contentType === 'text/html') {
        res.writeHead(200, { 'Content-Type': `${contentType}; charset=UTF-8` });
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
      }
      res.end(content, 'utf-8');
    }
  });

}).listen(3100, () => {
  console.log('test-web-server running at http://localhost:3100/');
});