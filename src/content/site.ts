/*
  Datos del negocio y de las líneas. Todo el texto del sitio que se repite
  vive acá: cambiarlo en un solo lugar alcanza.
*/
import type { IconName } from "@/components/Icon";

export const CONTACTO = {
  telVisible: "221 675-5077",
  telLink: "+5492216755077",
  whatsapp: "5492216755077", // con código de país, sin "+" ni espacios
  email: "ventas@aluva.com.ar",
  direccion: "La Plata, Buenos Aires", // TODO: dirección real
  horario: "Lun a Vie 8 a 17 h · Sáb 9 a 13 h", // TODO: horario real
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
  { slug: "pvc", name: "PVC", short: "La mejor aislación. Perfilería de primera línea, con DVH fabricado en planta propia.", vit: "/photos/portada-pvc-fabrica.jpg", chips: ["Perfilería multicámara", "DVH propio", "Cierre multipunto", "Símil madera"] },
  // Las líneas de aluminio van siempre A30, Módena, Herrero: es el orden de
  // mejor a peor que pidió el cliente, no alfabético. Vale en todo el sitio.
  { slug: "aluminio", name: "Aluminio", short: "Líneas A30, Módena y Herrero. Distintas prestaciones para cada necesidad.", vit: "/photos/portada-aluminio.jpg", vitPos: "14% 50%", chips: ["A30", "Módena", "Herrero", "Grandes paños"] },
  { slug: "vidrieria", name: "Vidriería", short: "Vidrios cortados a medida, mamparas para baño y doble vidriado hermético. Todo fabricado en nuestra planta.", vit: "/photos/mampara-ducha-negra.jpg", chips: ["Mamparas", "DVH propio", "Laminado", "Templado"] },
  { slug: "templados", name: "Templados", short: "Frentes, puertas y paños de vidrio templado.", vit: "/photos/det-blindex-1.webp", chips: ["Frentes", "Puertas", "Piel de vidrio", "Seguridad"] },
  { slug: "revestimientos", name: "Revestimientos", short: "Wall panel para fachadas, deck para exteriores y parasoles de PVC.", vit: "/photos/revestimiento-fachada.webp", chips: ["Wall panel", "Deck", "Parasol", "Sin mantenimiento"] },
];

/** Pilar: ícono, título, texto y foto de fondo opcional. */
export type Pilar = [IconName, string, string, string?];

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
    slug: "pvc", name: "PVC", og: "/og/producto-pvc.jpg",
    title: "Ventanas y puertas de PVC a medida en La Plata | Aluva",
    desc: "Ventanas y puertas de PVC con perfilería multicámara y DVH de fabricación propia, a medida en La Plata.",
    lead: "Perfilería multicámara de primera línea, con DVH de fabricación propia.",
    cover: "/photos/portada-pvc.jpg", coverAlt: "Puerta corrediza de marco blanco que da a un balcón",
    whyT: ["La mejor", "aislación."],
    pillars: [
      ["thermo", "Eficiencia energética", "Mayor eficiencia de energía en calefacción y refrigeración."],
      ["sound", "Aislación acústica", "Alta reducción del ruido exterior."],
      ["layers", "DVH de fabricación propia", "Realizado íntegramente en nuestras instalaciones."],
      ["leaf", "Sin mantenimiento", "Foliados de fábrica: no se pintan ni se descascaran."],
    ],
    sysEyebrow: "Tipologías", sysT: ["Una abertura", "para cada vano."],
    /* Las nueve tipologías que el cliente confirmó el 2026-10-06 como las que
       hay hoy en el local de City Bell. Antes había seis, y dos de aquellas
       ("Ventana corrediza" y "Puerta corrediza", las corredizas genéricas) no
       estaban en su lista: las reemplazan Patagónica y Monoriel, que son las
       corredizas que efectivamente venden.

       Las fotos de patagónica, monoriel y banderola son lo más parecido que hay
       en el repositorio, no la tipología exacta. Están marcadas abajo. */
    /* Las seis tip-*.webp salen de scripts/fotos-tipologias.mjs: mismo lienzo,
       mismo fondo y misma escala, para que la grilla se lea como un catálogo y
       no como nueve fotos sueltas.

       Las tres que siguen con foto de ambiente son las que no tienen recorte
       posible. Están marcadas y esperan foto propia. */
    systems: [
      ["/photos/tip-proyectante.webp", "Proyectante", "Abre hacia afuera, con eje arriba."],
      ["/photos/tip-banderola.webp", "Banderola", "Vuelca hacia adentro, con eje abajo."],
      ["/photos/tip-patagonica.webp", "Patagónica", "Dos hojas: una corre por delante de la fija."],
      ["/photos/tip-puerta-balcon.webp", "Puerta balcón", "Dos hojas batientes, a piso."],
      ["/photos/tip-rebatible.webp", "Batiente", "Abre de costado, sobre bisagras laterales."],
      ["/photos/tip-monoriel.webp", "Monoriel", "Una hoja sobre un riel; el resto, paño fijo."],
      ["/photos/tip-corrediza-3hojas.webp", "Puerta corrediza de tres hojas", "Tres hojas sobre riel, para vanos anchos."],
      ["/photos/tip-oscilobatiente.webp", "Oscilobatiente", "Vuelca para ventilar o abre de costado."],
      ["/photos/tip-fijo.webp", "Paño fijo", "Vidrio fijo, sin hojas que abran."],
    ],
    galT: "PVC de cerca.",
    gallery: [["/og/producto-pvc.jpg", "Puerta corrediza", false], ["/photos/det-pvc-2.webp", "Manija sobre hoja en nogal", true], ["/photos/det-pvc-foliado.webp", "Terminaciones foliadas", true], ["/photos/det-pvc-perfil.webp", "Perfil multicámara", true], ["/photos/det-pvc-3.webp", "Cierre multipunto", true]],
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
    desc: "Aberturas de aluminio a medida en La Plata: líneas A30, Módena y Herrero, en blanco, anodizado o negro, con DVH de fabricación propia.",
    lead: "Líneas A30, Módena y Herrero. Distintas prestaciones para cada necesidad.",
    cover: "/photos/portada-aluminio.jpg", coverAlt: "Ventana corrediza de aluminio negro con vista a los árboles",
    whyT: ["Más vidrio,", "menos marco."],
    pillars: [
      ["sun", "Más luz", "Perfil compacto: más superficie de vidrio."],
      ["shield", "Cierre hermético", "Burletes de EPDM y opción de DVH."],
      ["palette", "Tres terminaciones", "Blanco, anodizado o negro."],
      ["tools", "Variedad de tipologías", "Una solución adecuada para cada uso."],
    ],
    sysEyebrow: "Tipologías", sysT: ["Una abertura", "para cada vano."],
    systems: [
      // Ordenadas por movimiento, con las definiciones del cliente (2026-10-28)
      ["/photos/tip-alu-fijo.webp", "Paño fijo", "Sin apertura, ventana estanca."],
      ["/photos/tip-alu-corrediza.webp", "Corrediza", "Hojas sobre riel, dos o más hojas, sin llegar a piso."],
      ["/photos/tip-alu-puerta-balcon.webp", "Puerta balcón", "Hojas sobre riel, dos o más hojas, llegan a piso."],
      ["/photos/tip-alu-batiente.webp", "Batiente", "Apertura con giro sobre eje lateral."],
      ["/photos/tip-alu-oscilobatiente.webp", "Oscilobatiente", "Doble sistema de apertura, lateral y superior."],
      ["/photos/tip-alu-banderola.webp", "Banderola", "Apertura con giro en eje inferior."],
      ["/photos/tip-alu-proyectante.webp", "Proyectante", "Apertura con giro sobre eje superior."],
      ["/photos/tip-alu-desplazable.webp", "Desplazable", "Apertura hacia el exterior, desplazando la hoja mediante tijeras."],
    ],
    galT: "Aluminio de cerca.",
    gallery: [["/photos/aluminio-corrediza.jpg", "Corrediza de tres hojas", false], ["/photos/det-aluminio-2.webp", "Herraje de proyectante", true], ["/photos/esc-aluminio-2.webp", "Corrediza al balcón", false], ["/photos/al-puerta.jpg", "Puerta de aluminio", true]],
    faq: [
      ["¿Qué líneas trabajan?", "A30, Módena y Herrero. Te recomendamos la que corresponde según el tamaño del vano y el uso."],
      ["¿Qué terminaciones hay?", "Blanco, anodizado y negro, en anodizado o pintado."],
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
    cover: "/photos/portada-blindex.jpg", coverAlt: "Puerta de vidrio templado esmerilado con manija",
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
      ["/photos/det-blindex-2.webp", "Paños fijos", "Vidrio templado cortado a medida."],
      ["/photos/det-blindex-1.webp", "Puertas con tirador", "Sin marco: vidrio, herraje y tirador."],
    ],
    galT: "Templado de cerca.",
    gallery: [["/og/producto-blindex.jpg", "Nuestro local", false], ["/photos/det-blindex-1.webp", "Puerta de templado", true], ["/photos/det-blindex-2.webp", "Canto del paño", true], ["/photos/frente-comercial.jpg", "Frente comercial", false], ["/photos/mampara-division.jpg", "Oficina", true], ["/photos/esc-blindex-3.webp", "Piel de vidrio", true]],
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
    cover: "/photos/esc-vidrieria-1.webp", coverAlt: "Ducha con paño fijo de vidrio sobre pared de mármol",
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
    title: "Revestimientos de PVC: wall panel, deck y parasoles en La Plata | Aluva",
    desc: "Revestimientos de PVC en La Plata: wall panel para fachadas, deck para exteriores y perfiles parasol. Medición y colocación propias.",
    lead: "Wall panel para fachadas, deck para exteriores y perfiles parasol, en PVC.",
    cover: "/photos/revestimiento-fachada.webp", coverAlt: "Fachada revestida con wall panel negro",
    whyT: ["Terminación", "de fachada."],
    pillars: [
      ["leaf", "Sin mantenimiento", "No se pintan, no se pudren ni se descascaran."],
      ["drop", "Para exterior", "Resisten la intemperie."],
      ["palette", "Aspecto de madera", "Texturas y colores símil madera."],
      ["tools", "Colocación propia", "Medimos y colocamos con nuestro equipo."],
    ],
    sysEyebrow: "Productos", sysT: ["Tres formas", "de revestir."],
    systems: [
      ["/photos/revestimiento-muestra.webp", "Wall panel", "Listones para revestir fachadas y paredes exteriores."],
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
    cta: "Wall panel, deck y parasoles. Te visitamos, medimos y cotizamos.",
  },
];

export const PROCESO = [
  { img: "/photos/local-aluva.jpg", alt: "Frente del local de Aluva en La Plata", t: "Consulta", d: "Asesoramiento y presupuesto.", dato: "Respuesta en 24 h hábiles" },
  { img: "/photos/proceso-medicion.webp", alt: "Operario midiendo un paño de vidrio", t: "Medición", d: "Relevamiento en obra con personal propio.", dato: "En tu obra, sin cargo" },
  { img: "/photos/proceso-fabricacion.webp", alt: "Perfil sujeto en la máquina de la planta", t: "Fabricación", d: "Corte, armado y control en planta.", dato: "En planta propia" },
  { img: "/photos/instalacion-obra.webp", alt: "Corrediza símil madera recién instalada, con las herramientas de colocación en el piso", t: "Instalación", d: "Colocación profesional con personal calificado.", dato: "Con posventa" },
];

export const TERMINACIONES = [
  {
    nombre: "PVC", href: "/pvc", sub: "Perfilería multicámara", items: [
      ["Blanco", "linear-gradient(135deg,#fbfbf8,#e6e6e0)"],
      ["Roble dorado", "repeating-linear-gradient(100deg,#b07a40 0 6px,#a26e37 6px 9px,#b8844a 9px 16px)"],
      ["Nogal", "repeating-linear-gradient(100deg,#6a4a2e 0 6px,#5c3f26 6px 9px,#72523a 9px 16px)"],
      ["Spectral", "linear-gradient(135deg,#40464b,#2f3438)"],
    ],
  },
  {
    nombre: "Aluminio", href: "/aluminio", sub: "A30 · Módena · Herrero", items: [
      ["Blanco", "linear-gradient(135deg,#fafaf6,#e4e4de)"],
      ["Anodizado", "linear-gradient(135deg,#d3d6d9,#a7abaf 55%,#c4c7ca)"],
      ["Negro", "linear-gradient(135deg,#2a2c2e,#141516)"],
    ],
  },
] as const;
