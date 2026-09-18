/*
  Pre-render para SEO. Corre solo después de `npm run build` (script "postbuild").

  El sitio es una app de React: sin esto, cada URL devuelve un HTML vacío con
  la misma cabecera, y los buscadores (y las vistas previas de WhatsApp o
  redes) no ven el contenido ni distinguen una página de otra. Este script:

  1. Empaqueta las rutas con esbuild y las renderiza en Node (StaticRouter).
  2. Escribe cada URL pública como HTML real, con su contenido y su cabecera:
     título, descripción, canónica, Open Graph y datos estructurados
     (todo sale de src/content/seo.js).
       /                  -> build/index.html
       /productos/<id>    -> build/productos/<id>/index.html y build/productos/<id>.html
                             (según el hosting, sirve una u otra)
  3. Genera build/sitemap.xml y build/robots.txt.

  En el navegador, React reemplaza ese HTML por la app interactiva.
*/
import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(raiz, "src");
const dist = path.join(raiz, "build");
const paquete = path.join(raiz, "node_modules", ".cache", "prerender", "entrada.cjs");

// "@/..." es el alias de src que usa craco
const aliasArroba = {
  name: "alias-arroba",
  setup(b) {
    b.onResolve({ filter: /^@\// }, (a) => b.resolve(`./${a.path.slice(2)}`, { resolveDir: src, kind: a.kind }));
  },
};

await build({
  entryPoints: [path.join(raiz, "scripts", "prerender-entrada.jsx")],
  outfile: paquete,
  bundle: true,
  platform: "node",
  format: "cjs",
  jsx: "automatic",
  packages: "external",
  plugins: [aliasArroba],
  loader: { ".js": "jsx", ".css": "empty", ".svg": "empty", ".png": "empty", ".jpg": "empty", ".webp": "empty" },
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.REACT_APP_BACKEND_URL": '""',
  },
  logLevel: "warning",
});

const require = createRequire(import.meta.url);
const { renderizar, seoDeRuta, cabeceraHtml, rutasPublicas, SITIO } = require(paquete);

const plantilla = readFileSync(path.join(dist, "index.html"), "utf8");
if (!plantilla.includes('<div id="root"></div>')) {
  throw new Error("build/index.html no tiene <div id=\"root\"></div>: ¿ya estaba pre-renderizado? Corré el build de nuevo.");
}

// Saca la cabecera genérica de la plantilla para poner la de cada ruta
const sinCabeceraSeo = plantilla
  .replace(/<title>[\s\S]*?<\/title>/g, "")
  .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g, "")
  .replace(/<link\s+rel="canonical"[^>]*>/g, "")
  .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, "");

const escribir = (rel, html) => {
  const destino = path.join(dist, rel);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, html);
};

const rutas = rutasPublicas();
for (const ruta of rutas) {
  const cabecera = seoDeRuta(ruta);
  const cuerpo = renderizar(ruta);
  const html = sinCabeceraSeo
    .replace("</head>", `${cabeceraHtml(cabecera)}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);

  if (ruta === "/") {
    escribir("index.html", html);
  } else {
    escribir(path.join(ruta.slice(1), "index.html"), html);
    escribir(`${ruta.slice(1)}.html`, html);
  }
  console.log(`  pre-render ${ruta.padEnd(22)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB  · ${cabecera.titulo}`);
}

// Sitemap: solo las rutas públicas e indexables
const hoy = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${rutas.map((ruta) => {
  const c = seoDeRuta(ruta);
  return `  <url>
    <loc>${c.canonica}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${ruta === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${ruta === "/" ? "1.0" : "0.8"}</priority>
    <image:image><image:loc>${c.imagen}</image:loc></image:image>
  </url>`;
}).join("\n")}
</urlset>
`;
writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

writeFileSync(path.join(dist, "robots.txt"), `User-agent: *
Allow: /
Disallow: /login

Sitemap: ${SITIO.url}/sitemap.xml
`);

console.log(`  sitemap.xml (${rutas.length} URL) y robots.txt listos`);
