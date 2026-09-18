import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { seoDeRuta } from "@/content/seo";

/*
  Actualiza la cabecera (título, descripción, canónica, Open Graph, robots y
  datos estructurados) cada vez que cambia la ruta. El HTML que genera el
  build ya trae la cabecera correcta de cada página; esto la mantiene al día
  cuando el usuario navega dentro del sitio sin recargar.
*/
function meta(atributo, clave, valor) {
  let el = document.head.querySelector(`meta[${atributo}="${clave}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(atributo, clave);
    document.head.appendChild(el);
  }
  el.setAttribute("content", valor);
}

export default function SeoRuta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const h = seoDeRuta(pathname);
    document.title = h.titulo;
    meta("name", "description", h.descripcion);
    meta("name", "robots", h.robots);
    meta("property", "og:title", h.titulo);
    meta("property", "og:description", h.descripcion);
    meta("property", "og:url", h.canonica);
    meta("property", "og:image", h.imagen);
    meta("name", "twitter:title", h.titulo);
    meta("name", "twitter:description", h.descripcion);
    meta("name", "twitter:image", h.imagen);

    let canonica = document.head.querySelector('link[rel="canonical"]');
    if (!canonica) {
      canonica = document.createElement("link");
      canonica.setAttribute("rel", "canonical");
      document.head.appendChild(canonica);
    }
    canonica.setAttribute("href", h.canonica);

    let ld = document.getElementById("seo-jsonld");
    if (h.jsonld) {
      if (!ld) {
        ld = document.createElement("script");
        ld.type = "application/ld+json";
        ld.id = "seo-jsonld";
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(h.jsonld);
    } else if (ld) {
      ld.remove();
    }
  }, [pathname]);

  return null;
}
