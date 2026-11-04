/*
  Datos del negocio y de las líneas. Todo el texto del sitio que se repite
  vive acá: cambiarlo en un solo lugar alcanza.
*/
import type { IconName } from "@/components/Icon";

export const CONTACTO = {
  // El fijo y el WhatsApp son numeros distintos, como figuran en aluva.com.ar.
  telVisible: "(0221) 483-0222",
  telLink: "+542214830222",
  whatsapp: "5492216755077", // con código de país, sin "+" ni espacios
  email: "info@aluva.com.ar",
  direccion: "Calle 7 N° 1714, La Plata, Buenos Aires",
  horario: "Lun a Vie 8 a 17 h · Sáb 9 a 13 h", // TODO: sin confirmar, aluva.com.ar no publica horarios
  maps: "https://www.google.com/maps/search/?api=1&query=Calle+7+1714+La+Plata+Buenos+Aires",
} as const;

export const waLink = (texto = "Hola Aluva, quiero hacer una consulta.") =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

export type Slug = "pvc" | "aluminio" | "templados" | "vidrieria" | "revestimientos";

export interface Linea {
  slug: Slug;
  name: string;
  short: string;
  vit: string;
  /** encuadre de la foto en la vitrina (object-position) */
  vitPos?: string;
  chips: string[];
}

export const LINEAS: Linea[] = [
  // Orden de productos en todo el sitio: PVC, Aluminio, Vidriería, Templados,
  // Revestimientos (pedido del cliente, revisión del 2026-10-28).
  { slug: "pvc", name: "PVC", short: "La mejor aislación. Perfilería de primera línea, con DVH fabricado en planta propia.", vit: "/photos/vit-pvc.webp", chips: ["Perfilería multicámara", "DVH propio", "Cierre multipunto", "Símil madera"] },
  // Las líneas de aluminio van siempre A30, Módena, Herrero: es el orden de
  // mejor a peor que pidió el cliente, no alfabético. Vale en todo el sitio.
  { slug: "aluminio", name: "Aluminio", short: "Líneas A30, Módena y Herrero. Distintas prestaciones para cada necesidad.", vit: "/photos/vit-aluminio.webp", chips: ["A30", "Módena", "Herrero", "Grandes paños"] },
  { slug: "vidrieria", name: "Vidriería", short: "Vidrios cortados a medida, mamparas para baño y doble vidriado hermético. Todo fabricado en nuestra planta.", vit: "/photos/vit-vidrieria.webp", chips: ["Mamparas", "DVH propio", "Laminado", "Templado"] },
  { slug: "templados", name: "Templados", short: "Frentes, puertas y paños de vidrio templado.", vit: "/photos/vit-templados.webp", chips: ["Frentes", "Puertas", "Piel de vidrio", "Seguridad"] },
  { slug: "revestimientos", name: "Revestimientos", short: "Wall panel para interiores y fachadas, deck para exteriores y parasoles de PVC.", vit: "/photos/vit-revestimientos.webp", chips: ["Wall panel", "Deck", "Parasol", "Sin mantenimiento"] },
];

/** Pilar: ícono, título y texto. */
export type Pilar = [IconName, string, string];

/** Sistema: foto (prefijo "cut:" = producto sobre fondo blanco, "top:" = encuadre superior), título y texto. */
export type Sistema = [string, string, string];

/** Foto de galería: ruta, epígrafe y si es vertical. */
export type FotoGaleria = [string, string, boolean];

export interface Producto {
  slug: Slug;
  name: string;
  og: string;
  title: string;
  desc: string;
  lead: string;
  cover: string;
  coverAlt: string;
  whyT: string[];
  pillars: Pilar[];
  sysEyebrow: string;
  sysT: string[];
  systems: Sistema[];
  galT: string;
  gallery: FotoGaleria[];
  faq: [string, string][];
  ctaT: string;
  cta: string;
}

// Fuente: src/content/catalogo.js del proyecto Aluva original
// (líneas, terminaciones, tipologías y beneficios confirmados por el cliente).
export const PRODUCTOS: Producto[] = [
  {
    slug: "pvc", name: "PVC", og: "/photos/esc-pvc-1.webp",
    title: "Ventanas y puertas de PVC a medida en La Plata | Aluva",
    desc: "Ventanas y puertas de PVC con perfilería multicámara y DVH de fabricación propia, a medida en La Plata.",
    lead: "Perfilería multicámara de primera línea, con DVH de fabricación propia.",
    cover: "/photos/portada-pvc-seccion.webp", coverAlt: "Corte de un perfil de PVC multicámara con doble vidriado hermético, sobre el alféizar de una ventana",
    whyT: ["La mejor", "aislación."],
    pillars: [
      ["thermo", "Eficiencia energética", "Mayor eficiencia de energía en calefacción y refrigeración."],
      ["sound", "Aislación acústica", "Alta reducción del ruido exterior."],
      ["layers", "DVH de fabricación propia", "Realizado íntegramente en nuestras instalaciones."],
      ["leaf", "Sin mantenimiento", "Foliados de fábrica: no se pintan ni se descascaran."],
    ],
    sysEyebrow: "Tipologías", sysT: ["Una abertura", "para cada vano."],
    /* Nombres, orden y descripciones de la revisión del 04-11-2026. Antes eran
       nueve y ahora son doce: entran Proyectante, Desplazable, Patagónica,
       Monoriel y Plegadiza, y Batiente pasa a llamarse Rebatible.

       Los renders salen de la carpeta de Drive que indica el deck, uno por
       tipología sobre fondo blanco. Van con el prefijo "cut:", que es el que
       encuadra el producto entero en vez de recortarlo. */
    systems: [
      ["cut:/photos/tip-pvc-fijo.webp", "Paño fijo", "Vidrio fijo sin hojas móviles."],
      ["cut:/photos/tip-pvc-rebatible.webp", "Rebatible", "Giro sobre bisagras laterales. Apertura interior o exterior."],
      ["cut:/photos/tip-pvc-banderola.webp", "Banderola", "Giro sobre marco inferior."],
      ["cut:/photos/tip-pvc-proyectante.webp", "Proyectante", "Giro sobre marco superior."],
      ["cut:/photos/tip-pvc-oscilo-2.webp", "Oscilobatiente", "Vuelca para ventilar o abre lateralmente."],
      ["cut:/photos/tip-pvc-desplazable.webp", "Desplazable", "Apertura exterior mediante sistema de herrajes tijera."],
      ["cut:/photos/tip-pvc-puerta.webp", "Puerta", "Hoja móvil con marco fijo."],
      ["cut:/photos/tip-pvc-corrediza.webp", "Corrediza", "Hojas que deslizan paralelas sobre rieles. 2, 3, 4 y 6 hojas."],
      ["cut:/photos/tip-pvc-patagonica.webp", "Patagónica", "Combinación de paño fijo y rebatible u oscilobatiente."],
      ["cut:/photos/tip-pvc-monoriel.webp", "Monoriel", "Un paño fijo y una hoja que desliza sobre riel."],
      ["cut:/photos/tip-pvc-puerta-balcon.webp", "Puerta balcón", "Hojas que deslizan paralelas sobre rieles. 2, 3, 4 y 6 hojas."],
      ["cut:/photos/tip-pvc-plegadiza.webp", "Plegadiza", "Hojas que se pliegan lateralmente, con posibilidad de tener puerta."],
    ],
    galT: "PVC de cerca.",
    gallery: [["/photos/pvc-puerta-corrediza.webp", "Puerta corrediza", true], ["/photos/det-pvc-2.webp", "Manija sobre hoja en nogal", true], ["/photos/pvc-foliado-corte.webp", "Terminaciones foliadas", true], ["/photos/det-pvc-perfil.webp", "Perfil multicámara", true], ["/photos/det-pvc-3.webp", "Cierre multipunto", true]],
    faq: [
      ["¿Qué perfilería usan?", "Perfilería multicámara de primera línea, con refuerzo interno de acero galvanizado. Estamos capacitados por los fabricantes para fabricar e instalar sus sistemas."],
      ["¿Qué colores hay?", "Blanco, roble dorado, nogal y Spectral, un foliado ultramate, sedoso al tacto y sin reflejos."],
      ["¿El DVH lo hacen ustedes?", "Sí. Fabricamos el doble vidriado hermético en nuestra planta, junto con la ventana."],
      ["¿Conviene PVC o aluminio?", "La elección del tipo de abertura adecuada para tu proyecto depende de varios factores, desde su funcionalidad hasta sus prestaciones, y cada una puede ser más eficaz en distintos escenarios. Contactanos para un asesoramiento específico a tu caso."],
    ],
    ctaT: "Tus aberturas de PVC, a medida.",
    cta: "Medimos tus vanos y fabricamos tus aberturas de PVC en nuestra planta de La Plata.",
  },
  {
    slug: "aluminio", name: "Aluminio", og: "/og/producto-aluminio.jpg",
    title: "Aberturas de aluminio a medida en La Plata | Aluva",
    desc: "Aberturas de aluminio a medida en La Plata: líneas A30, Módena y Herrero, en nueve acabados, con DVH de fabricación propia.",
    lead: "Líneas A30, Módena y Herrero. Distintas prestaciones para cada necesidad.",
    cover: "/photos/portada-aluminio-seccion.webp", coverAlt: "Corte de un perfil de aluminio negro con doble vidriado hermético, en el umbral de una corrediza",
    whyT: ["Más vidrio,", "menos marco."],
    pillars: [
      ["sun", "Más luz", "Perfil compacto: más superficie de vidrio."],
      ["shield", "Cierre hermético", "Burletes de EPDM y opción de DVH."],
      ["palette", "Nueve acabados", "Lacados, anodizado y símil madera."],
      ["tools", "Variedad de tipologías", "Una solución adecuada para cada uso."],
    ],
    sysEyebrow: "Tipologías", sysT: ["Una abertura", "para cada vano."],
    /* Mismos nombres, orden y descripciones que PVC, con la revisión del
       04-11-2026. Aluminio no lleva Monoriel ni Plegadiza. */
    systems: [
      ["cut:/photos/tip-al-fijo.webp", "Paño fijo", "Vidrio fijo sin hojas móviles."],
      ["cut:/photos/tip-al-rebatible.webp", "Rebatible", "Giro sobre bisagras laterales. Apertura interior o exterior."],
      ["cut:/photos/tip-al-banderola.webp", "Banderola", "Giro sobre marco inferior."],
      ["cut:/photos/tip-al-proyectante.webp", "Proyectante", "Giro sobre marco superior."],
      ["cut:/photos/tip-al-oscilo-2.webp", "Oscilobatiente", "Vuelca para ventilar o abre lateralmente."],
      ["cut:/photos/tip-al-desplazable.webp", "Desplazable", "Apertura exterior mediante sistema de herrajes tijera."],
      ["cut:/photos/tip-al-puerta.webp", "Puerta", "Hoja móvil con marco fijo."],
      ["cut:/photos/tip-al-corrediza.webp", "Corrediza", "Hojas que deslizan paralelas sobre rieles. 2, 3, 4 y 6 hojas."],
      ["cut:/photos/tip-al-patagonica.webp", "Patagónica", "Combinación de paño fijo y rebatible u oscilobatiente."],
      ["cut:/photos/tip-al-puerta-balcon.webp", "Puerta balcón", "Hojas que deslizan paralelas sobre rieles. 2, 3, 4 y 6 hojas."],
    ],
    galT: "Aluminio de cerca.",
    gallery: [["/photos/al-corrediza-3hojas.webp", "Corrediza de tres hojas", true], ["/photos/det-aluminio-2.webp", "Herraje de proyectante", true], ["/photos/al-corrediza-balcon.webp", "Corrediza al balcón", false], ["/photos/al-puerta.jpg", "Puerta de aluminio", true]],
    faq: [
      ["¿Qué líneas trabajan?", "A30, Módena y Herrero. Te recomendamos la que corresponde según el tamaño del vano y el uso."],
      ["¿Qué colores hay?", "Nueve acabados: natural, blanco, negro, gris RAL 7016, bronce, champagne, símil roble, símil nogal y anodizado mate. Lacado poliéster, anodizado y símil madera, todos resistentes a la intemperie."],
      ["¿Puede llevar DVH?", "Sí. Dependiendo de la línea, es posible el uso de DVH."],
      ["¿Conviene PVC o aluminio?", "La elección del tipo de abertura adecuada para tu proyecto depende de varios factores, desde su funcionalidad hasta sus prestaciones, y cada una puede ser más eficaz en distintos escenarios. Contactanos para un asesoramiento específico a tu caso."],
    ],
    ctaT: "Tus aberturas de aluminio, a medida.",
    cta: "Líneas A30, Módena y Herrero a medida. Te visitamos, medimos y cotizamos.",
  },
  {
    slug: "templados", name: "Templados", og: "/og/producto-blindex.jpg",
    title: "Vidrio templado: frentes, puertas y piel de vidrio en La Plata | Aluva",
    desc: "Frentes comerciales, puertas de vidrio templado y piel de vidrio para fachadas, a medida en La Plata. Medición en obra y colocación propia.",
    lead: "Frentes y puertas de vidrio templado, y piel de vidrio para fachadas.",
    cover: "/photos/portada-templados-esmerilado.webp", coverAlt: "Paño de vidrio templado esmerilado, con el canto pulido a la vista",
    whyT: ["El local", "a la vista."],
    pillars: [
      ["shield", "Templado de seguridad", "En puertas, frentes y fachadas."],
      ["sun", "El local a la vista", "Frentes que muestran el interior desde la vereda."],
      ["sparkle", "Líneas limpias", "Puertas y frentes sin marcos."],
      ["ruler", "Medido y colocado", "Medición en obra y colocación propia."],
    ],
    sysEyebrow: "Aplicaciones", sysT: ["Frentes, puertas", "y fachadas."],
    systems: [
      ["/photos/frente-comercial.jpg", "Frentes comerciales", "Vidrieras y accesos de locales."],
      ["/photos/blindex.webp", "Puertas de vidrio", "Hoja entera de vidrio templado."],
      ["/photos/esc-blindex-3.webp", "Piel de vidrio", "Fachadas y frentes completos en vidrio."],
      ["/photos/mampara-division.jpg", "Oficinas y accesos", "Divisiones y puertas en vidrio templado."],
      ["/photos/templado-pano.webp", "Paños fijos", "Vidrio templado cortado a medida."],
      ["/photos/templado-puerta.webp", "Puertas con tirador", "Sin marco: vidrio, herraje y tirador."],
    ],
    galT: "Templado de cerca.",
    gallery: [["/og/producto-blindex.jpg", "Nuestro local", false], ["/photos/templado-puerta.webp", "Puerta de templado", true], ["/photos/templado-pano.webp", "Canto del paño", true], ["/photos/frente-comercial.jpg", "Frente comercial", false], ["/photos/mampara-division.jpg", "Oficina", true], ["/photos/esc-blindex-3.webp", "Piel de vidrio", true]],
    faq: [
      ["¿Es lo mismo que Blindex?", "Blindex es una marca registrada de vidrio templado; en el uso cotidiano se le dice así a cualquier templado. Nosotros trabajamos vidrio templado de seguridad."],
      ["¿Se puede cortar después de templado?", "No: el vidrio se corta y perfora antes del templado. Por eso medimos en obra con precisión."],
      ["¿Hacen piel de vidrio?", "Sí, para frentes y fachadas completas. Medimos en obra y cotizamos a medida."],
      ["¿Cuánto tarda?", "Depende del proyecto. Te damos un plazo concreto al confirmar la medición."],
    ],
    ctaT: "Tu vidrio templado, a medida.",
    cta: "Frentes, puertas y piel de vidrio a medida. Medimos, fabricamos y colocamos.",
  },
  {
    slug: "vidrieria", name: "Vidriería", og: "/og/producto-vidrieria.jpg",
    title: "Vidriería y mamparas a medida en La Plata | Aluva",
    desc: "Vidriería y mamparas a medida en La Plata: DVH de fabricación propia, laminado y templado, con colocación y taller propios.",
    lead: "Vidrios cortados a medida, mamparas para baño y DVH fabricado en nuestra planta.",
    cover: "/photos/portada-vidrieria-templado.webp", coverAlt: "Esquina de un cerramiento de vidrio templado sin marco, con herrajes de acero inoxidable",
    whyT: ["Vidrio a la", "medida exacta."],
    pillars: [
      ["layers", "DVH de fabricación propia", "Realizado íntegramente en nuestras instalaciones."],
      ["ruler", "Mamparas a medida", "Para tu espacio, no de catálogo."],
      ["shield", "Vidrios de seguridad", "Templados y laminados."],
      ["tools", "Taller propio", "Vidriado en el momento y reparación."],
    ],
    sysEyebrow: "Soluciones", sysT: ["Vidrio para", "cada espacio."],
    systems: [
      ["/photos/vidrieria-mampara-corrediza.png", "Mamparas corredizas", "A medida, con perfil a elección."],
      ["/photos/mampara-ducha-fija.jpg", "Paños fijos de ducha", "En vidrio templado o laminado."],
      ["/photos/mampara-ducha-negra.jpg", "Mamparas batientes", "Medición, fabricación y colocación propias."],
      ["/photos/vidrio-cerramiento-cocina.webp", "Divisiones interiores", "Separan ambientes sin restar luz."],
      ["cut:/photos/dvh-perfiles.jpg", "Doble vidriado hermético", "Fabricado en nuestra planta."],
      ["/photos/det-vidrieria-1.webp", "Taller", "Traés la hoja y la vidriamos en el momento."],
    ],
    galT: "Vidrio de cerca.",
    gallery: [["/og/producto-vidrieria.jpg", "Cerramiento vidriado", false], ["/photos/det-vidrieria-3.webp", "Baranda de vidrio", true], ["/photos/det-vidrieria-2.webp", "Anclaje de baranda", true], ["/photos/dvh-cerramiento.jpg", "Cerramiento vidriado", true], ["/photos/esc-vidrieria-2.webp", "Mampara corrediza", false], ["/photos/vidrio-mampara-ducha.webp", "Mampara", true]],
    faq: [
      ["¿Hacen mamparas a medida?", "Sí. Las fabricamos a la medida de tu baño y las colocamos con nuestro equipo. Podés elegir tanto el color del perfil de aluminio como el del vidrio."],
      ["¿Puedo poner DVH en mis ventanas actuales?", "En muchas aberturas sí, adaptando el contravidrio. Lo evaluamos en la visita de medición."],
      ["¿Qué diferencia hay entre laminado y templado?", "El laminado tiene una lámina entre dos vidrios que los mantiene unidos si se rompe. El templado es más resistente y, si se rompe, se fragmenta en trozos pequeños sin filo."],
      ["¿Reparan vidrios?", "Sí. Traés la hoja al taller y la vidriamos en el momento."],
    ],
    ctaT: "Tu vidrio, a medida.",
    cta: "Contanos qué vidrio necesitás. Pasá por el taller o pedinos una visita.",
  },
  {
    slug: "revestimientos", name: "Revestimientos", og: "/photos/revestimiento-fachada.webp",
    title: "Revestimientos de PVC para interior y exterior en La Plata | Aluva",
    desc: "Revestimientos de PVC en La Plata: wall panel para interiores y fachadas, deck para exteriores y perfiles parasol. Medición y colocación propias.",
    lead: "Wall panel para interiores y fachadas, deck para exteriores y perfiles parasol, en PVC.",
    cover: "/photos/revestimiento-fachada.webp", coverAlt: "Fachada revestida con wall panel negro",
    whyT: ["Terminación", "de fachada."],
    pillars: [
      ["leaf", "Sin mantenimiento", "No se pintan, no se pudren ni se descascaran."],
      ["drop", "Interior y exterior", "Van en ambientes interiores y resisten la intemperie afuera."],
      ["palette", "Aspecto de madera", "Texturas y colores símil madera."],
      ["tools", "Colocación propia", "Medimos y colocamos con nuestro equipo."],
    ],
    sysEyebrow: "Productos", sysT: ["Tres formas", "de revestir."],
    systems: [
      ["/photos/revestimiento-muestra.webp", "Wall panel", "Listones para revestir paredes, por dentro y por fuera."],
      ["/photos/revest-deck.jpg", "Deck", "Tablas para pisos exteriores, galerías y bordes de pileta."],
      ["/photos/revest-parasol.jpg", "Parasol", "Perfiles para quiebravistas, cercos y protección solar."],
    ],
    galT: "Revestimientos de cerca.",
    gallery: [["/photos/revestimiento-fachada.webp", "Fachada con wall panel", true], ["/photos/revest-wallpanel.jpg", "Wall panel en colores", true], ["/photos/det-pvc-1.webp", "Perfiles de deck y parasol", true], ["/photos/revestimiento-muestra.webp", "Muestra de wall panel", true]],
    faq: [
      ["¿Son de PVC?", "Sí. Son perfiles de PVC diseñados para resistir la intemperie."],
      ["¿Necesitan mantenimiento?", "No. No se pintan ni barnizan. Son impermeables y no se oxidan."],
      ["¿Los colocan ustedes?", "Sí. Medimos en obra y colocamos con nuestro equipo."],
      ["¿Qué colores hay?", "Tenemos un amplio catálogo de colores y terminaciones. Te invitamos a conocerlos en nuestro local."],
    ],
    ctaT: "Tu revestimiento, a medida.",
    cta: "Wall panel para interior y exterior, deck y parasoles. Te visitamos, medimos y cotizamos.",
  },
];

export const PROCESO = [
  { img: "/photos/local-aluva.jpg", alt: "Frente del local de Aluva en La Plata", t: "Consulta", d: "Asesoramiento y presupuesto.", dato: "Respuesta en 24 h hábiles" },
  { img: "/photos/proceso-medicion.webp", alt: "Operario midiendo un paño de vidrio", t: "Medición", d: "Relevamiento en obra con personal propio.", dato: "En tu obra, sin cargo" },
  { img: "/photos/proceso-fabricacion.webp", alt: "Perfil sujeto en la máquina de la planta", t: "Fabricación", d: "Corte, armado y control en planta.", dato: "En planta propia" },
  { img: "/photos/instalacion-obra.webp", alt: "Corrediza símil madera recién instalada, con las herramientas de colocación en el piso", t: "Instalación", d: "Colocación profesional con personal calificado.", dato: "Con posventa" },
];

export const COLORES = [
  {
    nombre: "PVC", href: "/pvc", sub: "Perfilería multicámara", items: [
      ["Blanco", "linear-gradient(135deg,#fbfbf8,#e6e6e0)"],
      ["Roble dorado", "repeating-linear-gradient(96deg,rgba(0,0,0,.07) 0 1px,rgba(255,255,255,.06) 1px 2px,transparent 2px 7px),repeating-linear-gradient(96deg,#b47e44 0 3px,#a87238 3px 4px,#bd8b50 4px 10px)"],
      ["Nogal", "repeating-linear-gradient(96deg,rgba(0,0,0,.09) 0 1px,rgba(255,255,255,.05) 1px 2px,transparent 2px 7px),repeating-linear-gradient(96deg,#6d4c30 0 3px,#5b3e25 3px 4px,#77573d 4px 10px)"],
      ["Spectral", "linear-gradient(135deg,#40464b,#2f3438)"],
    ],
  },
  {
    nombre: "Aluminio", href: "/aluminio", sub: "A30 · Módena · Herrero", items: [
      // Los nueve acabados que publica aluva.com.ar/aluminio
      ["Natural", "linear-gradient(135deg,#dcdedd,#b7bbba 60%,#cfd2d1)"],
      ["Blanco", "linear-gradient(135deg,#fafaf6,#e4e4de)"],
      ["Negro", "linear-gradient(135deg,#2a2c2e,#141516)"],
      ["Gris RAL 7016", "linear-gradient(135deg,#4a4f54,#363b3f)"],
      ["Bronce", "linear-gradient(135deg,#7a5c3a,#54402a)"],
      ["Champagne", "linear-gradient(135deg,#d6c3a3,#b9a483)"],
      ["Símil roble", "repeating-linear-gradient(96deg,rgba(0,0,0,.07) 0 1px,rgba(255,255,255,.06) 1px 2px,transparent 2px 7px),repeating-linear-gradient(96deg,#b47e44 0 3px,#a87238 3px 4px,#bd8b50 4px 10px)"],
      ["Símil nogal", "repeating-linear-gradient(96deg,rgba(0,0,0,.09) 0 1px,rgba(255,255,255,.05) 1px 2px,transparent 2px 7px),repeating-linear-gradient(96deg,#6d4c30 0 3px,#5b3e25 3px 4px,#77573d 4px 10px)"],
      ["Anodizado mate", "linear-gradient(135deg,#c8ccc9,#9ea3a0 55%,#b9bdba)"],
    ],
  },
] as const;
