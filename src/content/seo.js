import { PRODUCTOS, FAQ } from "@/content/catalogo";

/*
  SEO del sitio: una sola fuente para el título, la descripción, la URL
  canónica, la imagen para compartir y los datos estructurados (schema.org)
  de cada ruta.

  La usan dos lados:
  - el navegador (components/SeoRuta.jsx) al cambiar de página;
  - el build (scripts/prerender.mjs), que escribe cada página como HTML real
    con esta cabecera ya puesta, más sitemap.xml y robots.txt.

  Todo lo que dicen los textos está confirmado en el catálogo o el pie. No
  agregar reseñas, precios ni coordenadas que no estén confirmados: Google
  penaliza los datos estructurados que no coinciden con la realidad.
*/

export const SITIO = {
  url: "https://www.aluva.com.ar",
  nombre: "Aluva",
  eslogan: "Tecnología en aberturas",
  telefono: "+54 221 483-0222",
  whatsapp: "+54 9 221 675-5077",
  email: "info@aluva.com.ar",
  calle: "Calle 7 N° 1714",
  localidad: "La Plata",
  provincia: "Buenos Aires",
  codigoPostal: "1900",
  pais: "AR",
  imagen: "/brand/og-aluva.jpg",
  logo: "/brand/icon-512.png",
};

const abs = (ruta) => (ruta.startsWith("http") ? ruta : `${SITIO.url}${ruta}`);
const NEGOCIO_ID = `${SITIO.url}/#negocio`;

// Título y descripción de cada línea: la búsqueda real es "producto + ciudad".
const SEO_PRODUCTO = {
  pvc: {
    titulo: "Ventanas y puertas de PVC en La Plata · VEKA | Aluva",
    descripcion: "Ventanas y puertas de PVC con perfilería VEKA Clase A y DVH de fabricación propia: corredizas, oscilobatientes y de abrir. Fabricadas a medida en La Plata.",
    servicio: "Fabricación e instalación de ventanas y puertas de PVC",
  },
  aluminio: {
    titulo: "Aberturas de aluminio en La Plata · Módena y Herrero | Aluva",
    descripcion: "Ventanas y puertas de aluminio líneas Módena, Herrero y A30, anodizadas o pintadas, con DVH propio. Fabricación en planta propia y medición en obra en La Plata.",
    servicio: "Fabricación e instalación de aberturas de aluminio",
  },
  vidrieria: {
    titulo: "Vidriería, DVH y mamparas a medida en La Plata | Aluva",
    descripcion: "Mamparas de baño a medida, DVH de fabricación propia y vidrio laminado y templado. Vidriado en el momento y reparación en taller en La Plata.",
    servicio: "Vidriería, doble vidriado hermético y mamparas a medida",
  },
  blindex: {
    titulo: "Frentes de Blindex y piel de vidrio en La Plata | Aluva",
    descripcion: "Frentes comerciales, puertas de vidrio templado y piel de vidrio para fachadas. Medición en obra, presupuesto a medida y colocación en La Plata.",
    servicio: "Frentes de vidrio templado (Blindex) y piel de vidrio",
  },
};

function negocio() {
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": NEGOCIO_ID,
    name: SITIO.nombre,
    slogan: SITIO.eslogan,
    description: "Fábrica de aberturas de PVC y aluminio a medida, vidriería, DVH, mamparas y frentes de Blindex en La Plata.",
    url: `${SITIO.url}/`,
    logo: abs(SITIO.logo),
    image: abs(SITIO.imagen),
    telephone: SITIO.telefono,
    email: SITIO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITIO.calle,
      addressLocality: SITIO.localidad,
      addressRegion: SITIO.provincia,
      postalCode: SITIO.codigoPostal,
      addressCountry: SITIO.pais,
    },
    areaServed: [
      { "@type": "City", name: "La Plata" },
      { "@type": "AdministrativeArea", name: "Gran La Plata" },
    ],
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    }],
    contactPoint: [
      { "@type": "ContactPoint", contactType: "sales", telephone: SITIO.whatsapp, email: "ventas@aluva.com.ar", areaServed: "AR", availableLanguage: "es" },
    ],
    knowsAbout: ["Ventanas de PVC", "Aberturas de aluminio", "Doble vidriado hermético (DVH)", "Mamparas de baño", "Vidrio templado", "Perfilería VEKA"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Líneas de producto",
      itemListElement: PRODUCTOS.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: p.nombre, url: `${SITIO.url}/productos/${p.id}` },
      })),
    },
  };
}

function migas(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([nombre, ruta], i) => ({ "@type": "ListItem", position: i + 1, name: nombre, item: abs(ruta) })),
  };
}

/*
  Devuelve la cabecera de una ruta:
  { titulo, descripcion, canonica, imagen, robots, jsonld, existe }
*/
export function seoDeRuta(pathname = "/") {
  const ruta = pathname.replace(/\/+$/, "") || "/";

  if (ruta === "/") {
    return {
      existe: true,
      titulo: "Aberturas de PVC y aluminio en La Plata | Aluva",
      descripcion: "Fabricamos aberturas de PVC y aluminio a medida en La Plata: ventanas VEKA Clase A, DVH propio, vidriería, mamparas y frentes de Blindex. Medición sin cargo.",
      canonica: `${SITIO.url}/`,
      imagen: abs(SITIO.imagen),
      robots: "index, follow, max-image-preview:large",
      jsonld: {
        "@context": "https://schema.org",
        "@graph": [
          negocio(),
          {
            "@type": "WebSite",
            "@id": `${SITIO.url}/#sitio`,
            url: `${SITIO.url}/`,
            name: SITIO.nombre,
            inLanguage: "es-AR",
            publisher: { "@id": NEGOCIO_ID },
          },
          {
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.p,
              acceptedAnswer: { "@type": "Answer", text: f.r },
            })),
          },
        ],
      },
    };
  }

  const m = ruta.match(/^\/productos\/([^/]+)$/);
  const producto = m && PRODUCTOS.find((p) => p.id === m[1]);
  if (producto) {
    const s = SEO_PRODUCTO[producto.id] || {};
    const url = `${SITIO.url}/productos/${producto.id}`;
    const foto = producto.fotos[0] ? abs(producto.fotos[0].src) : abs(SITIO.imagen);
    return {
      existe: true,
      titulo: s.titulo || `${producto.nombre} en La Plata | Aluva`,
      descripcion: s.descripcion || producto.desc,
      canonica: url,
      imagen: foto,
      robots: "index, follow, max-image-preview:large",
      jsonld: {
        "@context": "https://schema.org",
        "@graph": [
          negocio(),
          {
            "@type": "Service",
            "@id": `${url}#servicio`,
            name: producto.nombre,
            serviceType: s.servicio || producto.nombre,
            description: producto.desc,
            url,
            image: producto.fotos.map((f) => abs(f.src)).filter((v, i, a) => a.indexOf(v) === i),
            provider: { "@id": NEGOCIO_ID },
            areaServed: { "@type": "City", name: "La Plata" },
            ...(producto.ficha ? {
              additionalProperty: producto.ficha.map(([nombre, valor]) => ({ "@type": "PropertyValue", name: nombre, value: valor })),
            } : {}),
          },
          migas([["Inicio", "/"], ["Productos", "/#productos"], [producto.nombre, `/productos/${producto.id}`]]),
        ],
      },
    };
  }

  // /login y cualquier ruta que no existe: fuera del índice
  return {
    existe: ruta === "/login",
    titulo: ruta === "/login" ? "Acceso staff | Aluva" : "Página no encontrada | Aluva",
    descripcion: "Aluva · Tecnología en aberturas. Fabricación de aberturas de PVC y aluminio en La Plata.",
    canonica: `${SITIO.url}${ruta}`,
    imagen: abs(SITIO.imagen),
    robots: "noindex, follow",
    jsonld: null,
  };
}

// Rutas públicas que van al sitemap y se pre-renderizan en el build
export function rutasPublicas() {
  return ["/", ...PRODUCTOS.map((p) => `/productos/${p.id}`)];
}

// Etiquetas de cabecera como texto HTML (para el build)
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function cabeceraHtml(h) {
  const lineas = [
    `<title>${esc(h.titulo)}</title>`,
    `<meta name="description" content="${esc(h.descripcion)}" />`,
    `<meta name="robots" content="${esc(h.robots)}" />`,
    `<link rel="canonical" href="${esc(h.canonica)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="es_AR" />`,
    `<meta property="og:site_name" content="${esc(SITIO.nombre)}" />`,
    `<meta property="og:title" content="${esc(h.titulo)}" />`,
    `<meta property="og:description" content="${esc(h.descripcion)}" />`,
    `<meta property="og:url" content="${esc(h.canonica)}" />`,
    `<meta property="og:image" content="${esc(h.imagen)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(h.titulo)}" />`,
    `<meta name="twitter:description" content="${esc(h.descripcion)}" />`,
    `<meta name="twitter:image" content="${esc(h.imagen)}" />`,
  ];
  if (h.jsonld) {
    lineas.push(`<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(h.jsonld).replace(/</g, "\\u003c")}</script>`);
  }
  return lineas.join("\n        ");
}
