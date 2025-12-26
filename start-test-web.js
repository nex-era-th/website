// use this script to test nex-web
// @devster, 2025-1-15 11:56 +7
// start website by: $ node test-web.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url')

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




  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const method = req.method




  // ROUTE WORK ---------------------------------------------------------------------------

  if (pathname === '/api/test' && method === 'GET') {
    res.writeHead(200,{'Content-Type':'text/html'})
    res.end('<h1>this is response from nex-web</h1>')
    console.log('got api/test')
    return
    // test=ok

  } else if (pathname === '/api/new-post' && method === 'POST') {
    
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        console.log('/api/new-post gets POST data =', data)
        res.writeHead(201,{'Content-Type':'application/json'})
        res.end( JSON.stringify({
          msg:'this is response from nex-web/api/new-post',
          attach: data
        }))

      } catch (error) {
        res.writeHead(400,{'Content-Type':'text/plain'})
        res.end('error: invalid json format')
      }
    })

    return
    // test=ok
  }




  // STATIC WORK ------------------------------------------------------------------------




  /*
  let filePath = path.join(
    __dirname, parsedUrl === '/' ? 'index.html' : parsedUrl.pathname
  );



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
        console.warn(`× 404 Not Found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404: file not found', 'utf-8');
      } else {
        console.error(`× 500 Server Error (${err.code}): ${filePath}`);
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
      console.log(`→ 200 OK: ${filePath}`);
      res.end(content, 'utf-8');
    }
  });
  */





  // 1. Get the clean pathname
  let requestPath = parsedUrl.pathname;

  // 2. If the user hits "localhost:3100/", serve index.html from the pump folder
  if (requestPath === '/' || requestPath === '/pump' || requestPath === '/pump/') {
    requestPath = '/pump/index.html';
  }

  // 3. Construct the absolute file path on your hard drive
  // This will join /home/nex-era/dev-vold/website/ + /pump/index.html
  // or /home/nex-era/dev-vold/website/ + /js/w3.css
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
        // LOG THIS: It will show you exactly where Node is looking
        console.warn(`× 404 Not Found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404: file not found');
      } else {
        res.writeHead(500);
        res.end(`500: server error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType + (contentType.includes('text') ? '; charset=UTF-8' : '') });
      console.log(`→ 200 OK: ${requestPath}`);
      res.end(content);
    }
  });







  // START WEB SITE -------------------------------------------------------------------

}).listen(3100, () => {
  console.log('test-web-server running at http://localhost:3100/');
});