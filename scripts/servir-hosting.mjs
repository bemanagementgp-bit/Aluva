/*
  Sirve la exportación que armó `npm run hosting` igual que lo haría Apache con
  hosting/.htaccess: /pvc -> pvc.html, /pvc/ -> /pvc, /pvc.html -> /pvc,
  /login -> app.aluva.com.ar y 404.html para lo que no existe.
  Sirve para mirar el sitio antes de subirlo. Uso: npm run hosting:ver
*/
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";

const dir = join(tmpdir(), "aluva-hosting-build", "out");
const puerto = Number(process.env.PORT) || 8123;
const tipos = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".json": "application/json" };

if (!existsSync(join(dir, "index.html"))) { console.error("Primero corré `npm run hosting`."); process.exit(1); }

const redir = (res, a, code = 301) => { res.writeHead(code, { Location: a }); res.end(); };
const archivo = (res, ruta, code = 200) => {
  res.writeHead(code, { "Content-Type": tipos[extname(ruta)] || "application/octet-stream" });
  createReadStream(ruta).pipe(res);
};

createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (/^\/login\/?$/.test(p)) return redir(res, "https://app.aluva.com.ar/", 302);
  if (/^\/(templados|blindex|vidriosymamparas)(\.html)?\/?$/.test(p)) return redir(res, "/vidrieria");
  if (/^\/revestimiento(\.html)?\/?$/.test(p)) return redir(res, "/revestimientos");
  if (p === "/index.php" || p === "/index.html") return redir(res, "/");
  const html = p.match(/^\/([a-z-]+)\.html$/); if (html) return redir(res, "/" + html[1]);
  if (p.length > 1 && p.endsWith("/")) return redir(res, p.slice(0, -1));
  if (p === "/") p = "/index.html";
  let ruta = normalize(join(dir, p));
  if (!ruta.startsWith(dir)) return archivo(res, join(dir, "404.html"), 404);
  if (existsSync(ruta) && statSync(ruta).isFile()) return archivo(res, ruta);
  if (!p.includes(".") && existsSync(ruta + ".html")) return archivo(res, ruta + ".html");
  archivo(res, join(dir, "404.html"), 404);
}).listen(puerto, () => console.log(`Sirviendo ${dir} en http://localhost:${puerto}`));
