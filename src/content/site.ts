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

export type Slug = "pvc" | "templados" | "aluminio" | "vidrieria";

export interface Linea {
  slug: Slug;
  name: string;
  short: string;
  vit: string;
  chips: string[];
}

export const LINEAS: Linea[] = [
  { slug: "pvc", name: "PVC", short: "La mejor aislación, con perfilería VEKA y DVH fabricado en planta propia.", vit: "/photos/portada-pvc.jpg", chips: ["VEKA Clase A", "DVH propio", "Cierre multipunto", "Símil madera"] },
  { slug: "templados", name: "Templados", short: "Frentes, puertas y paños de vidrio templado de seguridad.", vit: "/photos/portada-blindex.jpg", chips: ["Frentes", "Puertas", "Piel de vidrio", "Seguridad"] },
  { slug: "aluminio", name: "Aluminio", short: "Líneas Módena, Herrero y A30: livianas, resistentes y aptas para aberturas grandes.", vit: "/photos/portada-aluminio.jpg", chips: ["Módena", "Herrero", "A30", "Grandes paños"] },
  { slug: "vidrieria", name: "Vidriería", short: "Vidrios cortados a medida, mamparas para baño y doble vidriado hermético hecho en nuestra planta.", vit: "/photos/esc-vidrieria-1.webp", chips: ["Mamparas", "DVH propio", "Laminado", "Templado"] },
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
  cta: string;
}

// Fuente: src/content/catalogo.js del proyecto Aluva original
// (líneas, terminaciones, tipologías y beneficios confirmados por el cliente).
export const PRODUCTOS: Producto[] = [
  {
    slug: "pvc", name: "PVC", og: "/og/producto-pvc.jpg",
    title: "Ventanas y puertas de PVC a medida en La Plata | Aluva",
    desc: "Ventanas y puertas de PVC con perfilería VEKA Clase A y DVH de fabricación propia, a medida en La Plata.",
    lead: "Perfilería VEKA Clase A con DVH fabricado en nuestra planta.",
    cover: "/photos/portada-pvc.jpg", coverAlt: "Puerta corrediza de marco blanco que da a un balcón",
    whyT: ["La mejor", "aislación."],
    pillars: [
      ["thermo", "Aislación térmica", "Menos horas de calefacción y aire."],
      ["sound", "Silencio adentro", "La opción que más corta el ruido de la calle."],
      ["layers", "DVH propio", "Fabricado en nuestra planta."],
      ["leaf", "Sin mantenimiento", "Foliados de fábrica: no se pintan ni se descascaran."],
    ],
    sysEyebrow: "Tipologías", sysT: ["Una abertura", "para cada vano."],
    systems: [
      ["cut:/photos/pvc-corrediza-blanca.webp", "Ventana corrediza", "Práctica y sin ocupar espacio."],
      ["cut:/photos/pvc-corrediza-3hojas.jpg", "Corrediza de tres hojas", "Para vanos anchos."],
      ["/photos/pvc-puerta-corrediza.webp", "Puerta corrediza", "Hacia galerías, patios y balcones."],
      ["/photos/pvc-puerta-doble.webp", "Puerta balcón", "Dos hojas batientes."],
      ["cut:/photos/pvc-oscilobatiente-abierta.jpg", "Oscilobatiente", "Ventila inclinada o abre por completo."],
      ["/photos/tipo-fijo.webp", "Paño fijo", "Más luz, sin hojas móviles."],
    ],
    galT: "PVC de cerca.",
    gallery: [["/og/producto-pvc.jpg", "Puerta corrediza", false], ["/photos/det-pvc-2.webp", "Manija sobre hoja en nogal", true], ["/photos/det-pvc-4.webp", "Terminaciones foliadas", true], ["/photos/esc-pvc-2.webp", "Cocina", false], ["/photos/det-pvc-1.webp", "Perfil multicámara", true], ["/photos/det-pvc-3.webp", "Cierre multipunto", true]],
    faq: [
      ["¿Qué perfilería usan?", "VEKA Clase A. Estamos capacitados por VEKA para fabricar e instalar sus sistemas."],
      ["¿Qué terminaciones hay?", "Blanco, roble dorado, nogal y VEKA Spectral, un foliado ultramate, sedoso al tacto y sin reflejos."],
      ["¿El DVH lo hacen ustedes?", "Sí. Fabricamos el doble vidriado hermético en nuestra planta, junto con la ventana."],
      ["¿Conviene PVC o aluminio?", "El PVC aísla mejor y es la opción para quien busca confort térmico y acústico. El aluminio permite perfiles más finos y paños más grandes. En la consulta te decimos cuál conviene para tu caso."],
    ],
    cta: "Medimos tus vanos y fabricamos tus aberturas de PVC en nuestra planta de La Plata.",
  },
  {
    slug: "aluminio", name: "Aluminio", og: "/og/producto-aluminio.jpg",
    title: "Aberturas de aluminio a medida en La Plata | Aluva",
    desc: "Aberturas de aluminio a medida en La Plata: líneas Módena, Herrero y A30, en blanco, anodizado o negro, con DVH de fabricación propia.",
    lead: "Líneas Módena, Herrero y A30. Livianas, resistentes y aptas para aberturas grandes.",
    cover: "/photos/portada-aluminio.jpg", coverAlt: "Ventana corrediza de aluminio negro con vista a los árboles",
    whyT: ["Más vidrio,", "menos marco."],
    pillars: [
      ["sun", "Más luz", "Marcos de poca sección: más superficie de vidrio."],
      ["shield", "Cierre hermético", "Burletes de EPDM y opción de DVH."],
      ["palette", "Tres terminaciones", "Blanco, anodizado o negro."],
      ["tools", "Rinde el presupuesto", "Si buscabas PVC económico, el aluminio rinde más."],
    ],
    sysEyebrow: "Tipologías", sysT: ["Una abertura", "para cada vano."],
    systems: [
      ["/photos/tipo-corrediza.webp", "Corredizas", "Uno o varios rieles, también en gran formato."],
      ["cut:/photos/al-oscilobatiente.jpg", "Oscilobatientes", "Ventilación segura y apertura total."],
      ["/photos/tipo-batiente.webp", "Batientes", "Abren como una puerta, con cierre hermético."],
      ["/photos/tipo-banderola.webp", "Banderolas", "Ventilación superior para baños y cocinas."],
      ["/photos/tipo-fijo.webp", "Paños fijos", "Para aberturas de gran tamaño."],
      ["/photos/tipo-puerta-balcon.webp", "Puerta balcón", "Conecta interior y exterior."],
    ],
    galT: "Aluminio de cerca.",
    gallery: [["/og/producto-aluminio.jpg", "Corrediza de tres hojas", false], ["/photos/det-aluminio-2.webp", "Herraje de proyectante", true], ["/photos/det-aluminio-4.webp", "Proyectante abierta", true], ["/photos/esc-aluminio-2.webp", "Comedor", false], ["/photos/det-aluminio-3.webp", "Encuentro de marco y hoja", true], ["/photos/det-aluminio-1.webp", "Perfil y burlete", true]],
    faq: [
      ["¿Qué líneas trabajan?", "Módena, Herrero y A30. Te recomendamos la que corresponde según el tamaño del vano y el uso."],
      ["¿Qué terminaciones hay?", "Blanco, anodizado y negro, en anodizado o pintado."],
      ["¿Puede llevar DVH?", "Sí. El vidrio puede ser simple o DVH, que fabricamos en nuestra planta."],
      ["¿Conviene aluminio o PVC?", "El aluminio permite perfiles más finos y paños más grandes, y rinde más si el presupuesto es ajustado. El PVC aísla mejor. En la consulta te decimos cuál conviene para tu caso."],
    ],
    cta: "Líneas Módena, Herrero y A30 a medida. Te visitamos, medimos y cotizamos.",
  },
  {
    slug: "vidrieria", name: "Vidriería", og: "/og/producto-vidrieria.jpg",
    title: "Vidriería y mamparas a medida en La Plata | Aluva",
    desc: "Vidriería y mamparas a medida en La Plata: DVH de fabricación propia, laminado y templado, con colocación y taller propios.",
    lead: "Vidrios cortados a medida, mamparas para baño y doble vidriado hermético hecho en nuestra planta.",
    cover: "/photos/esc-vidrieria-1.webp", coverAlt: "Ducha con paño fijo de vidrio sobre pared de mármol",
    whyT: ["Vidrio a la", "medida exacta."],
    pillars: [
      ["layers", "DVH propio", "Fabricado en nuestra planta."],
      ["ruler", "Mamparas a medida", "Para tu espacio, no de catálogo."],
      ["shield", "Laminado y templado", "Vidrios de seguridad."],
      ["tools", "Taller propio", "Vidriado en el momento y reparación."],
    ],
    sysEyebrow: "Soluciones", sysT: ["Vidrio para", "cada espacio."],
    systems: [
      ["/photos/vidrieria-mampara-corrediza.png", "Mamparas corredizas", "A medida, con perfil a elección."],
      ["/photos/mampara-ducha-fija.jpg", "Paños fijos de ducha", "Templado o laminado."],
      ["/photos/mampara-ducha-negra.jpg", "Mamparas batientes", "Con colocación propia."],
      ["/photos/vidrio-cerramiento-cocina.webp", "Divisiones interiores", "Separan sin quitar luz."],
      ["cut:/photos/dvh-perfiles.jpg", "Doble vidriado hermético", "Fabricado en nuestra planta."],
      ["/photos/det-vidrieria-1.webp", "Taller", "Traés la hoja y la vidriamos en el momento."],
    ],
    galT: "Vidrio de cerca.",
    gallery: [["/og/producto-vidrieria.jpg", "Cerramiento vidriado", false], ["/photos/det-vidrieria-3.webp", "Baranda de vidrio", true], ["/photos/det-vidrieria-2.webp", "Anclaje de baranda", true], ["/photos/dvh-cerramiento.jpg", "Cerramiento vidriado", true], ["/photos/esc-vidrieria-2.webp", "Mampara corrediza", false], ["/photos/vidrio-mampara-ducha.webp", "Mampara", true]],
    faq: [
      ["¿Hacen mamparas a medida?", "Sí. Las fabricamos a la medida de tu baño y las colocamos con nuestro equipo. En aluminio elegís el color del perfil y el del vidrio."],
      ["¿Puedo poner DVH en mis ventanas actuales?", "En muchas aberturas sí, adaptando el contravidrio. Lo evaluamos en la visita de medición."],
      ["¿Qué diferencia hay entre laminado y templado?", "El laminado tiene una lámina entre dos vidrios que los mantiene unidos si se rompe. El templado es más resistente y, si se rompe, se fragmenta en trozos pequeños sin filo."],
      ["¿Reparan vidrios?", "Sí. Traés la hoja al taller y la vidriamos en el momento."],
    ],
    cta: "Contanos qué vidrio necesitás. Pasá por el taller o pedinos una visita.",
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
      ["ruler", "Medido y colocado", "Medición en obra y colocación a cargo nuestro."],
    ],
    sysEyebrow: "Aplicaciones", sysT: ["Frentes, puertas", "y fachadas."],
    systems: [
      ["/photos/frente-comercial.jpg", "Frentes comerciales", "Vidrieras y accesos de locales."],
      ["/photos/blindex.webp", "Puertas de vidrio", "Templado, limpias y resistentes."],
      ["/photos/esc-blindex-3.webp", "Piel de vidrio", "Para frentes y fachadas completas."],
      ["/photos/mampara-division.jpg", "Oficinas y accesos", "Separan con vidrio templado."],
      ["/photos/det-blindex-2.webp", "Paños fijos", "Vidrio templado a medida."],
      ["/photos/det-blindex-1.webp", "Puertas con tirador", "Sin marco, solo vidrio y herraje."],
    ],
    galT: "Templado de cerca.",
    gallery: [["/og/producto-blindex.jpg", "Nuestro local", false], ["/photos/det-blindex-1.webp", "Puerta de templado", true], ["/photos/det-blindex-2.webp", "Canto del paño", true], ["/photos/frente-comercial.jpg", "Frente comercial", false], ["/photos/mampara-division.jpg", "Oficina", true], ["/photos/esc-blindex-3.webp", "Piel de vidrio", true]],
    faq: [
      ["¿Es lo mismo que Blindex?", "Blindex es una marca registrada de vidrio templado; en el uso cotidiano se le dice así a cualquier templado. Nosotros trabajamos vidrio templado de seguridad."],
      ["¿Se puede cortar después de templado?", "No: el vidrio se corta y perfora antes del templado. Por eso medimos en obra con precisión."],
      ["¿Hacen piel de vidrio?", "Sí, para frentes y fachadas completas. Medimos en obra y cotizamos a medida."],
      ["¿Cuánto tarda?", "Depende del proyecto. Te damos un plazo concreto al confirmar la medición."],
    ],
    cta: "Frentes, puertas y piel de vidrio a medida. Medimos, fabricamos y colocamos.",
  },
];

export const PROCESO = [
  { img: "/photos/local-aluva.jpg", alt: "Frente del local de Aluva en La Plata", t: "Consulta", d: "Asesoramiento y presupuesto.", dato: "Respuesta en 24 h hábiles" },
  { img: "/photos/proceso-medicion.webp", alt: "Operario midiendo un paño de vidrio", t: "Medición", d: "Relevamiento de vanos en obra.", dato: "En tu obra, sin cargo" },
  { img: "/photos/proceso-fabricacion.webp", alt: "Perfil sujeto en la máquina de la planta", t: "Fabricación", d: "Corte, armado y control en planta.", dato: "En planta propia" },
  { img: "/photos/proceso-obra.webp", alt: "Ambiente con la abertura corrediza instalada", t: "Instalación", d: "Colocación, sellado y regulación.", dato: "Con posventa" },
];

export const TERMINACIONES = [
  {
    nombre: "PVC", href: "/pvc", sub: "Perfilería VEKA", items: [
      ["Blanco", "linear-gradient(135deg,#fbfbf8,#e6e6e0)"],
      ["Roble dorado", "repeating-linear-gradient(100deg,#b07a40 0 6px,#a26e37 6px 9px,#b8844a 9px 16px)"],
      ["Nogal", "repeating-linear-gradient(100deg,#6a4a2e 0 6px,#5c3f26 6px 9px,#72523a 9px 16px)"],
      ["VEKA Spectral", "linear-gradient(135deg,#40464b,#2f3438)"],
    ],
  },
  {
    nombre: "Aluminio", href: "/aluminio", sub: "Módena · Herrero · A30", items: [
      ["Blanco", "linear-gradient(135deg,#fafaf6,#e4e4de)"],
      ["Anodizado", "linear-gradient(135deg,#d3d6d9,#a7abaf 55%,#c4c7ca)"],
      ["Negro", "linear-gradient(135deg,#2a2c2e,#141516)"],
    ],
  },
] as const;
