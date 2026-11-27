import type { NextConfig } from "next";

// Las direcciones viejas del sitio en HTML (/pvc.html, /blindex.html…) redirigen a las nuevas.
const viejas: [string, string][] = [
  ["index", "/"], ["productos", "/productos"], ["pvc", "/pvc"], ["aluminio", "/aluminio"],
  ["vidrieria", "/vidrieria"], ["templados", "/vidrieria"], ["blindex", "/vidrieria"],
  ["empresa", "/empresa"], ["contacto", "/contacto"], ["staff", "/staff"],
];

/* Dos formas de publicar:
   - Vercel (por defecto): servidor Next, con las redirecciones y cabeceras de abajo.
   - Hosting compartido (aluva.com.ar): `npm run hosting` exporta HTML estático a `out/`.
     Ahí las redirecciones y cabeceras las pone Apache con hosting/.htaccess, por eso
     acá se omiten (Next no las puede aplicar en una exportación). */
const exportar = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(exportar ? { output: "export" as const } : {}),
  // Permite compilar pruebas en otra carpeta sin pisar la de `npm run dev`
  distDir: process.env.NEXT_DIST_DIR || ".next",
  ...(exportar ? {} : {
    async redirects() {
      return [
        ...viejas.map(([v, n]) => ({ source: `/${v}.html`, destination: n, permanent: true })),
        { source: "/blindex", destination: "/vidrieria", permanent: true },
        { source: "/templados", destination: "/vidrieria", permanent: true },
      ];
    },
    async headers() {
      return [
        { source: "/:dir(photos|og|brand|fonts)/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
      ];
    },
  }),
};

export default nextConfig;
