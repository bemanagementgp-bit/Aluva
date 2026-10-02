import type { NextConfig } from "next";

// Las direcciones viejas del sitio en HTML (/pvc.html, /blindex.html…) redirigen a las nuevas.
const viejas: [string, string][] = [
  ["index", "/"], ["productos", "/productos"], ["pvc", "/pvc"], ["aluminio", "/aluminio"],
  ["vidrieria", "/vidrieria"], ["templados", "/templados"], ["blindex", "/templados"],
  ["empresa", "/empresa"], ["contacto", "/contacto"], ["staff", "/staff"],
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      ...viejas.map(([v, n]) => ({ source: `/${v}.html`, destination: n, permanent: true })),
      { source: "/blindex", destination: "/templados", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:dir(photos|og|brand|fonts)/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
    ];
  },
};

export default nextConfig;
