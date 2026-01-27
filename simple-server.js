const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIRECTORY = __dirname; // Serve from project root

// Helper to check if file exists
function getFile(url) {
    // 1. Try exact path (e.g., /Supplier/supplier.html)
    let p = path.join(DIRECTORY, url === '/' ? 'Delivery/index.html' : url);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;

    // 2. Try adding .html
    if (fs.existsSync(p + '.html')) return p + '.html';
    
    // 3. Try inside 'Delivery' (for backward compatibility with old relative paths like style.css)
    let pDelivery = path.join(DIRECTORY, 'Delivery', url);
    if (fs.existsSync(pDelivery) && fs.statSync(pDelivery).isFile()) return pDelivery;

    return null;
}

const server = http.createServer((req, res) => {
  const filePath = getFile(req.url);
  
  if (!filePath) {
      res.writeHead(404);
      res.end('File not found');
      return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
       res.writeHead(500);
       res.end('Error: ' + error.code);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
