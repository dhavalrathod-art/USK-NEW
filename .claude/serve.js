// Tiny static server for previewing the project folder
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.resolve(process.argv[2] || "."), port = +process.argv[3] || 5173;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(p).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  });
}).listen(port, () => console.log("Serving on http://localhost:" + port));
