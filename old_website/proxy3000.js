const http = require('http');

http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  const proxyReq = http.request(options, proxyRes => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  req.pipe(proxyReq);
  proxyReq.on('error', e => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Backend warming up');
  });
}).listen(3000, '0.0.0.0', () => {
  console.log('Port 3000 proxying to http://127.0.0.1:5000');
});

