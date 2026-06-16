var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var publicDir = path.join(__dirname, 'public');
var port = process.env.PORT || 3000;

var mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    'Content-Type': contentType || 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function resolveRequestPath(requestUrl) {
  var parsed = url.parse(requestUrl);
  var pathname = decodeURIComponent(parsed.pathname || '/');
  var relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  var resolvedPath = path.normalize(path.join(publicDir, relativePath));

  if (resolvedPath.indexOf(publicDir) !== 0) {
    return null;
  }

  return resolvedPath;
}

var server = http.createServer(function (req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method Not Allowed');
    return;
  }

  var requestedPath;

  try {
    requestedPath = resolveRequestPath(req.url);
  } catch (error) {
    send(res, 400, 'Bad Request');
    return;
  }

  if (!requestedPath) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.stat(requestedPath, function (statError, stats) {
    if (statError) {
      send(res, 404, 'Not Found');
      return;
    }

    var filePath = stats.isDirectory() ? path.join(requestedPath, 'index.html') : requestedPath;
    var extension = path.extname(filePath).toLowerCase();
    var contentType = mimeTypes[extension] || 'application/octet-stream';

    fs.readFile(filePath, function (readError, contents) {
      if (readError) {
        send(res, 500, 'Internal Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      res.end(contents);
    });
  });
});

server.listen(port, function () {
  console.log('Radha portfolio running at http://localhost:' + port);
});
