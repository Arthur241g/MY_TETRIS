function start_html_server() {
    const http = require('http');
    const fs = require('fs');
  
    const hostname = '0.0.0.0';
    const port = 8080;
  
    const server = http.createServer((request, response) => {
      if (request.url === '/') {
        // Serve index.html
        fs.readFile('./index.html', 'utf8', (err, html) => {
          if (err) {
            response.writeHead(500);
            response.end('Error loading index.html');
          } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(html);
          }
        });
      } else if (request.url === '/style.css') {
        // Serve style.css
        fs.readFile('./style.css', 'utf8', (err, css) => {
          if (err) {
            response.writeHead(500);
            response.end('Error loading style.css');
          } else {
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.end(css);
          }
        });
      } else if (request.url.startsWith('/my_tetris.js')) { // Permet de servir le fichier JS à partir de différentes URL (avec ou sans slash à la fin)
        // Serve my_tetris.js
        fs.readFile('./my_tetris.js', 'utf8', (err, js) => {
          if (err) {
            response.writeHead(500);
            response.end('Error loading my_tetris.js');
          } else {
            response.writeHead(200, { 'Content-Type': 'text/javascript' });
            response.end(js);
          }
        });
      } else if (request.url === '/tetrominoes.js') {
        // Serve tetrominoes.js
        fs.readFile('./tetrominoes.js', 'utf8', (err, js) => {
          if (err) {
            response.writeHead(500);
            response.end('Error loading tetrominoes.js');
          } else {
            response.writeHead(200, { 'Content-Type': 'text/javascript' });
            response.end(js);
          }
        });
      } else {
        response.writeHead(404);
        response.end('Not found');
      }
    });
  
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}`);
      console.log('To access the server, enter http://web-g9ae630e3-3614.docode.fi.qwaasr.io in your web browser');
    });
  }
  
  start_html_server();
  