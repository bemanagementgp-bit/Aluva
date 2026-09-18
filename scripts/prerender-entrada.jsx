// Entrada del pre-render (la empaqueta scripts/prerender.mjs con esbuild).
// Renderiza las rutas del sitio con StaticRouter, sin navegador.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Rutas } from "@/App";

export { seoDeRuta, cabeceraHtml, rutasPublicas, SITIO } from "@/content/seo";

export function renderizar(url) {
  return renderToString(
    <StaticRouter location={url}>
      <Rutas />
    </StaticRouter>
  );
}
