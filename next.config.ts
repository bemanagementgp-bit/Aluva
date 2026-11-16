import type { NextConfig } from "next";

/*
  La web se compila como sitio estático (carpeta out/) para subirla a un
  hosting compartido con Apache + PHP (lead.php recibe el formulario).
  Lo que antes resolvía el servidor de Next ahora está en public/.htaccess:
  redirecciones de las direcciones viejas (/pvc.html, /blindex…), caché de
  fotos y direcciones sin ".html".
*/
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  // Permite compilar pruebas en otra carpeta sin pisar la de `npm run dev`
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
