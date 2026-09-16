/*
  PUNTO ÚNICO DE CONFIGURACIÓN DE FOTOS Y CONTENIDO DEL CATÁLOGO.

  Para cambiar las imágenes del sitio no hace falta tocar ningún componente:
  dejá los archivos en public/photos/ y actualizá las rutas de acá.

  Criterio de foto (ver GUIA-FOTOS.md en la raíz del proyecto):
  - Aberturas de PVC o aluminio reales. Nada de carpintería de madera:
    contradice lo que vende Aluva.
  - Arquitectura del AMBA / La Plata: ladrillo visto, revoque, medianeras,
    dúplex, PH. No cabañas de montaña ni casas norteamericanas.
  - Horizontal, mínimo 1600px de ancho, y con lugar "tranquilo" abajo:
    las tres vistas llevan un epígrafe sobre degradado en el borde inferior.
*/

// Rotan de fondo en el hero.
/*
  El hero ya no lleva pase de fotos. Las que habia eran casas norteamericanas
  de stock: ruido visual y 10 MB en la primera pantalla. Hasta tener fotos
  propias de obra en alta resolucion, la portada es un campo de color de marca.
  Para volver a ponerle foto: exportar aca un HERO y devolver el pase en
  Landing.jsx (esta en el historial de este archivo).
*/

/*
  Sección Obras.
  ATENCIÓN: estos son DATOS DE EJEMPLO para que se vea el diseño funcionando.
  Antes de publicar hay que reemplazarlos por obras reales — localidad, sistema,
  cantidad de aberturas y año son datos que el cliente puede verificar, y si no
  coinciden con la realidad juegan en contra. Si de alguna obra no tenés el dato,
  poné "—": el diseño lo contempla y queda mejor un guion que un número inventado.
*/
/*
  La seccion no se muestra hasta que haya obras reales CON fotos propias.
  Publicar obras inventadas y sin imagen resta credibilidad en vez de sumarla,
  y era justo lo que advertia el comentario de arriba. Poner en true cuando
  esten los datos y las fotos.
*/
export const MOSTRAR_OBRAS = false;

/*
  La galeria larga de productos (scroll horizontal, 9 fotos) queda apagada: la
  vitrina de la segunda seccion ya presenta las cuatro lineas con su ficha, y
  tener las dos hacia recorrer el mismo catalogo dos veces. Encender solo si se
  decide separar "presentacion" de "galeria".
*/
export const MOSTRAR_GALERIA_PRODUCTOS = false;

export const OBRAS = [
  {
    id: "city-bell",
    nombre: "Vivienda unifamiliar",
    localidad: "City Bell",
    sistema: "PVC · DVH 4-9-4",
    aberturas: "14 aberturas",
    anio: "2024",
    medida: "2.40 × 1.60 m",
  },
  {
    id: "gonnet",
    nombre: "Dúplex en esquina",
    localidad: "Gonnet",
    sistema: "Aluminio Módena",
    aberturas: "9 aberturas",
    anio: "2024",
    medida: "3.20 × 2.40 m",
  },
  {
    id: "la-plata",
    nombre: "Reforma de PH",
    localidad: "La Plata",
    sistema: "PVC símil madera",
    aberturas: "6 aberturas",
    anio: "2023",
    medida: "1.80 × 1.20 m",
  },
  {
    id: "berisso",
    nombre: "Galería vidriada",
    localidad: "Berisso",
    sistema: "Aluminio · DVH",
    aberturas: "Cerramiento completo",
    anio: "2023",
    medida: "5.60 × 2.60 m",
  },
  {
    id: "villa-elisa",
    nombre: "Casa de dos plantas",
    localidad: "Villa Elisa",
    sistema: "PVC · Cierre multipunto",
    aberturas: "18 aberturas",
    anio: "2023",
    medida: "2.00 × 2.00 m",
  },
];

// Catálogo: cada línea con su ficha y sus 3 fotos.
export const PRODUCTOS = [
  {
  
    id: "pvc",
    sigla: "PVC",
    tituloLiviano: "Ventanas y puertas de",
    tituloFuerte: "PVC",
    nombre: "Ventanas y puertas de PVC",
    linea: "Perfilería VEKA Clase A",
    desc: "La opción con mejor aislación. Fabricamos la ventana y también su doble vidriado hermético en nuestra planta, con perfilería VEKA Clase A: corta el frío, el calor y el ruido de la calle.",
    // La vitrina de la home muestra solo esta linea; la descripcion completa va en la ficha.
    resumen: "La mejor aislación, con DVH fabricado en planta propia.",
    specs: ["DVH de fabricación propia", "Cierre multipunto", "Foliado VEKA Spectral", "Símil madera"],
    // Franja de credenciales bajo la portada de la ficha (datos confirmados)
    credenciales: [["Perfilería", "VEKA Clase A"], ["DVH", "Fabricación propia"], ["Asesoramiento", "Capacitados por VEKA"], ["Medición", "En obra"]],
    ficha: [
      ["Perfilería", "VEKA Clase A"],
      ["Vidrio", "DVH de fabricación propia"],
      ["Cierre", "Multipunto"],
      ["Terminaciones", "Blanco, símil madera y VEKA Spectral"],
      ["Fabricación", "Planta propia, La Plata"],
    ],
    aperturas: ["corrediza", "oscilobatiente", "batiente", "fijo", "puerta", "puerta-balcon"],
    idealPara: [
      ["Ambientes que dan a la calle", "El PVC con DVH es la opción que más corta el ruido."],
      ["Bajar el consumo", "La temperatura se sostiene con menos horas de calefacción y aire."],
      ["Estética a elección", "Blanco, símil madera o el ultramate de VEKA Spectral."],
    ],
    // Producto estrella según el brief. Los datos del acabado salen de la página
    // de VEKA (veka.es/particular/colores-y-acabados/veka-spectral). "Único en
    // el mercado" es afirmación de VEKA: no presentarlo como exclusivo de Aluva
    // sin confirmarlo.
    destacado: {
      etiqueta: "Nuevo acabado VEKA",
      liviano: "Foliado",
      fuerte: "VEKA Spectral",
      texto: "Una superficie ultramate, sedosa al tacto y sin reflejos, de alta resistencia a climas exigentes. VEKA la desarrolló para diferenciarse de los foliados estándar del mercado.",
      lista: ["Blanco ultramate", "Gris antracita", "Gris ultramate", "Negro grafito ultramate", "Umbra ultramate", "Verde pino ultramate", "Marrón sepia ultramate"],
    },
    // encuadre "producto" = imagen sobre fondo blanco: se muestra entera, sin recortar.
    fotos: [
      { src: "/photos/pvc-ventana-corrediza.webp"},
      { src: "/photos/pvc-puerta-doble.webp"},
      { src: "/photos/pvc-puerta-corrediza.webp"},
      { src: "/photos/pvc-despiece-sistema.webp", encuadre: "producto" },
    ],
  },
  {
    id: "aluminio",
    sigla: "ALU",
    tituloLiviano: "Aberturas de",
    tituloFuerte: "aluminio",
    nombre: "Aberturas de aluminio",
    linea: "Líneas Módena, Herrero y A30",
    desc: "Perfiles más finos y una estética limpia para fachadas contemporáneas. Ideal para grandes paños vidriados donde se busca la mayor superficie de vidrio posible con la menor interrupción visual.",
    // La vitrina de la home muestra solo esta linea; la descripcion completa va en la ficha.
    resumen: "Perfil fino para grandes paños vidriados.",
    specs: ["Módena", "Herrero reforzado", "Anodizado y pintado", "Grandes luces"],
    credenciales: [["Líneas", "Módena, Herrero y A30"], ["Fabricación", "Planta propia, La Plata"], ["Vidrio", "DVH de fabricación propia"], ["Medición", "En obra"]],
    ficha: [
      ["Líneas", "Módena, Herrero y A30"],
      ["Terminación", "Anodizado o pintado"],
      ["Vidrio", "Simple o DVH de fabricación propia"],
      ["Paños", "Grandes luces, perfil fino"],
      ["Fabricación", "Planta propia, La Plata"],
    ],
    // Banderola y puerta balcón: el simulador ya las mapea a aluminio.
    aperturas: ["corrediza", "oscilobatiente", "batiente", "banderola", "fijo", "puerta-balcon"],
    idealPara: [
      ["Grandes paños vidriados", "Perfil fino: más vidrio y menos marco a la vista."],
      ["Galerías y fachadas", "Estética contemporánea, en anodizado o pintado."],
      ["Presupuesto ajustado", "Si buscabas PVC económico, el aluminio rinde más."],
    ],
    fotos: [
      { src: "/photos/aluminio-ventana-oscilobatiente.webp"},
    ],
  },
  {
    id: "vidrieria",
    sigla: "VIDRIO",
    tituloLiviano: "Vidriería y",
    tituloFuerte: "mamparas",
    nombre: "Vidriería y mamparas",
    linea: "DVH de fabricación propia",
    desc: "Vidrios, DVH y mamparas a medida. Fabricamos nuestro propio doble vidriado hermético, y resolvemos el vidriado en el momento o la reparación en taller, sin tercerizar.",
    // La vitrina de la home muestra solo esta linea; la descripcion completa va en la ficha.
    resumen: "Mamparas y vidrios a medida, con DVH propio.",
    specs: ["Mamparas a medida", "DVH de fabricación propia", "Laminado y templado", "Perfil y vidrio a elección"],
    credenciales: [["DVH", "Fabricación propia"], ["Mamparas", "A medida"], ["Colocación", "Equipo propio"], ["Taller", "Vidriado en el momento"]],
    ficha: [
      ["Mamparas", "A medida, con colocación propia"],
      ["Perfil de mampara", "Color a elección"],
      ["Vidrio", "DVH de fabricación propia, laminado y templado"],
      ["Taller", "Vidriado en el momento y reparación"],
    ],
    // Tipologías de mampara.
    aperturas: ["corrediza", "batiente", "fijo"],
    idealPara: [
      ["Baños y duchas", "Mamparas a la medida exacta del espacio."],
      ["Divisiones interiores", "Cerramientos vidriados que separan sin quitar luz."],
      ["Reparaciones en taller", "Traés la hoja y la vidriamos en el momento."],
    ],
    // La gente no sabe que fabrican mamparas a medida (brief): por eso la
    // mampara va primera y la línea la nombra.
    destacado: {
      etiqueta: "Fabricación y colocación propia",
      liviano: "Mamparas",
      fuerte: "hechas a la medida de tu baño",
      texto: "Las fabricamos a medida y las colocamos con nuestro equipo. En aluminio elegís el color del perfil y el del vidrio.",
    },
    fotos: [
      { src: "/photos/vidrio-mampara-ducha.webp"},
      { src: "/photos/vidrio-cerramiento-cocina.webp", caption: "Cerramiento vidriado con perfilería negra · división de cocina" },
    ],
  },
  {
    // Reemplaza a "Revestimientos", que no está en el listado de productos del
    // brief (los paneles WPC son un plan a futuro). SIN FOTOS TODAVÍA: la
    // vitrina y la ficha muestran un panel con la sigla hasta que las haya.
    id: "blindex",
    sigla: "BLIND",
    tituloLiviano: "Frentes de",
    tituloFuerte: "Blindex",
    nombre: "Frentes de Blindex y piel de vidrio",
    linea: "Vidrio templado para frentes y fachadas",
    desc: "Frentes y puertas de vidrio templado para locales, oficinas y accesos, y piel de vidrio para fachadas. Medimos en obra, cotizamos a medida y colocamos.",
    // La vitrina de la home muestra solo esta linea; la descripcion completa va en la ficha.
    resumen: "Frentes y puertas de vidrio templado.",
    specs: ["Vidrio templado", "Frentes comerciales", "Puertas de vidrio", "Piel de vidrio"],
    credenciales: [["Vidrio", "Templado de seguridad"], ["Aplicaciones", "Frentes, puertas y fachadas"], ["Medición", "En obra, a medida"], ["Colocación", "A cargo nuestro"]],
    ficha: [
      ["Vidrio", "Templado de seguridad"],
      ["Aplicaciones", "Frentes comerciales, puertas y fachadas"],
      ["Sistemas", "Puertas de vidrio y piel de vidrio"],
      ["Medición", "En obra, presupuesto a medida"],
    ],
    aperturas: ["puerta", "fijo", "frente", "piel"],
    idealPara: [
      ["Locales comerciales", "Frentes vidriados que muestran el interior."],
      ["Oficinas y accesos", "Puertas de vidrio templado, limpias y resistentes."],
      ["Fachadas", "Piel de vidrio para frentes completos."],
    ],
    fotos: [{ src: "/photos/blindex.webp"},
    { src: "/photos/blindex.webp", caption: "Marca registrada de vidrio de seguridad laminado" }],
  },
];


/* ═══════════════════════════════════════════════════════════════════════════
   Proceso de trabajo
   Los plazos no van escritos como numero fijo a proposito: dependen del sistema
   y de la cantidad de aberturas, y prometer una fecha que despues no se cumple
   es peor que no prometerla. Si el cliente quiere comprometer plazos, cambiar
   el campo "dato" de cada paso por el real.
   ═══════════════════════════════════════════════════════════════════════════ */
export const PROCESO = [
  {
    titulo: "Consulta",
    dato: "Respuesta en 24 h hábiles",
    foto: "/photos/proceso-consulta.webp",
    alt: "Planos y casco de obra sobre el escritorio",
  },
  {
    titulo: "Medición",
    dato: "En tu obra, sin cargo",
    foto: "/photos/proceso-medicion.webp",
    alt: "Especialista tomando medidas con cinta métrica",
  },
  {
    titulo: "Fabricación",
    dato: "En planta propia",
    foto: "/photos/proceso-fabricacion.webp",
    alt: "Marco de abertura en la línea de armado",
  },
  {
    titulo: "Obra terminada",
    dato: "Instalada, ajustada y con posventa",
    foto: "/photos/proceso-obra.webp",
    alt: "Apretón de manos al entregar la obra",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Ahorro energético
   Todo lo que se afirma acá es técnico y verificable: DVH 4-9-4, corte de
   puente térmico y cierre multipunto son características del producto, no
   promesas de resultado. NO agregar un porcentaje de ahorro sin tener de dónde
   sacarlo: es el tipo de dato que un cliente informado verifica.
   ═══════════════════════════════════════════════════════════════════════════ */
export const AHORRO = [
  {
    titulo: "El agujero",
    texto: "En una casa bien construida, la abertura suele ser el punto más débil de la envolvente: por ahí se va el calor en invierno y entra en verano, aunque la pared esté aislada.",
    dato: "El punto débil",
  },
  {
    titulo: "Doble vidriado",
    texto: "El DVH son dos vidrios separados por una cámara de aire seco sellada. Esa cámara corta la conducción: el vidrio interior deja de estar a la temperatura de la calle.",
    dato: "DVH 4-9-4",
  },
  {
    titulo: "El perfil",
    texto: "El PVC no conduce temperatura. En aluminio, el corte de puente térmico interrumpe el perfil con un separador aislante para que el frío no cruce de lado a lado.",
    dato: "PVC · RPT en aluminio",
  },
  {
    titulo: "El cierre",
    texto: "El herraje multipunto ajusta la hoja contra el marco en varios puntos a la vez. Sin infiltración de aire no hay corriente, y el equipo de climatización deja de pelear contra la calle.",
    dato: "Cierre multipunto",
  },
  {
    titulo: "El resultado",
    texto: "Menos horas de aire o calefacción encendidos, temperatura más pareja entre ambientes y bastante menos ruido de la calle. El confort se nota antes que la factura.",
    dato: "Confort + factura",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Preguntas frecuentes
   ATENCIÓN: las respuestas están escritas para no comprometer datos que no
   tengo confirmados (plazos exactos, medios de pago, radio de cobertura, años
   de garantía). La cobertura ya está confirmada en CONTEXTO.MD (La Plata y
   alrededores, sin obras lejanas). Falta confirmar la garantía antes de publicar.
   ═══════════════════════════════════════════════════════════════════════════ */
export const FAQ = [
  {
    p: "¿Cuánto demora un trabajo completo?",
    r: "Depende del sistema y de la cantidad de aberturas. El plazo se confirma por escrito en la visita de medición, cuando ya sabemos exactamente qué hay que fabricar. Preferimos dar una fecha real en esa instancia antes que un número aproximado por teléfono.",
  },
  {
    p: "¿La visita de medición tiene costo?",
    r: "No. Un especialista va a tu domicilio, toma las medidas reales de cada vano y revisa el estado del muro, sin cargo y sin compromiso de compra.",
  },
  {
    p: "¿Trabajan en obra nueva o también en refacción?",
    r: "En las dos. En obra nueva coordinamos con la dirección para dejar los premarcos en la etapa que corresponde; en refacción reemplazamos sobre el vano existente y resolvemos la terminación con revestimientos para que no queden retoques pendientes.",
  },
  {
    p: "¿Conviene PVC o aluminio?",
    r: "El PVC aísla mejor y es la opción para quien busca confort térmico y acústico. El aluminio permite perfiles más finos y paños más grandes, y es la opción cuando manda la estética o la superficie vidriada. En la consulta te decimos cuál conviene para tu caso puntual, no para vender el más caro.",
  },
  {
    p: "¿Qué incluye el presupuesto?",
    r: "La fabricación de las aberturas, los herrajes, el vidrio y la instalación con sellado perimetral. Si el vano necesita trabajos de albañilería o hay que reponer revestimiento, va detallado aparte para que veas qué es qué.",
  },
  {
    p: "¿Zona de cobertura?",
    r: "La Plata y alrededores. Trabajamos en esta zona para poder cumplir con los tiempos de medición, fabricación y posventa que prometemos.",
  },
];


/* ═══════════════════════════════════════════════════════════════════════════
   Profesionales
   Todo sale del brief (CONTEXTO.MD): fábrica propia con tiempos regulables,
   DVH propio, capacitación VEKA y medición en obra. No agregar plazos ni
   condiciones comerciales que no estén confirmados.
   ═══════════════════════════════════════════════════════════════════════════ */
export const PROFESIONALES = [
  { titulo: "Fábrica propia", texto: "Regulamos los tiempos de producción según tu obra." },
  { titulo: "DVH in-house", texto: "Fabricamos nuestro propio doble vidriado hermético." },
  { titulo: "Asesoramiento técnico", texto: "Capacitados por VEKA en PVC; el aluminio lo conocemos de primera mano." },
  { titulo: "Medición en obra", texto: "Presupuesto ajustado a la medida real de cada vano." },
];


/* ═══════════════════════════════════════════════════════════════════════════
   Comparador PVC / aluminio (fichas de esas dos líneas)
   Criterios cualitativos, sin cifras: no hay valores técnicos confirmados de
   transmitancia ni de precio. La fila de presupuesto sale del brief: a quien
   pide PVC económico le recomiendan aluminio.
   ═══════════════════════════════════════════════════════════════════════════ */
export const COMPARATIVA = [
  ["Aislación térmica y acústica", "La mejor", "Buena, con DVH"],
  ["Perfil", "Más robusto", "Más fino"],
  ["Paños grandes", "Medianos", "Ideal"],
  ["Terminaciones", "Blanco, símil madera y Spectral", "Anodizado y pintado"],
  ["Presupuesto ajustado", "—", "Rinde más"],
];
