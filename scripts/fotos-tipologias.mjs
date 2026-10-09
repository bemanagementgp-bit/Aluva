/*
  Unifica las fotos de tipologías de la página de PVC.

    node scripts/fotos-tipologias.mjs

  Sale por public/photos/tip-<slug>.webp, todas en 4:3, 1200x900, con el mismo
  fondo y el producto a la misma escala y en el mismo lugar.

  ── Por qué ──

  Pedido del cliente: "mejores fotos, coincidentes en fondos y paredes, para
  tener una sección unificada visualmente". La grilla venía mezclando recortes
  de estudio sobre blanco, fotos de ambiente (un baño, un living, un lago) y
  fondos grises, beige y casi blancos. Cada tarjeta parecía de otro catálogo.

  ── Cómo ──

  Las fotos de estudio ya existían, pero cada una con su fondo. El script las
  recorta contra ese fondo y las vuelve a montar sobre uno solo:

  1. Toma el color del borde de la foto, que es el fondo.
  2. Hace un relleno por inundación desde los cuatro lados: todo lo que sea
     parecido a ese color y esté conectado con el borde, se vuelve transparente.
     Por inundación y no por color suelto, para no agujerear el vidrio ni las
     partes claras de la abertura, que suelen parecerse al fondo.
  3. Recorta al rectángulo que ocupa el producto.
  4. Lo centra en un lienzo fijo, con un margen igual para todas, de modo que
     todas terminen del mismo tamaño relativo.

  La tolerancia va declarada por foto: el fondo gris de una tiene degradé y
  necesita más margen que el blanco plano de otra.
*/
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const req = createRequire(import.meta.url);
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sharp = (() => {
  try {
    return req("sharp");
  } catch {
    return req(`${process.env.LOCALAPPDATA}/npm-cache/_npx/76dc10efc80ca823/node_modules/sharp`);
  }
})();

const ANCHO = 1200;
const ALTO = 900;              // 4:3, el mismo que usa la tarjeta
const FONDO = { r: 243, g: 244, b: 242, alpha: 1 };  // --paper-2 del sitio
const MARGEN = 0.09;           // aire alrededor del producto, igual para todas

/*
  slug -> foto de origen, método de recorte y tolerancia.

  Dos métodos, porque no todas las fotos se dejan recortar igual:

  - "fondo": inundación desde el borde contra el color del fondo. Sirve cuando
    hay un fondo de estudio liso. La tolerancia es delicada: el producto es
    blanco y el fondo también suele serlo, así que pasarse de tolerancia se
    come la abertura. A la oscilobatiente le pasó con 48 y quedó en puros
    contornos; con 14 sale bien.

  - "oscuro": toma el rectángulo que ocupa lo que está por debajo de cierto
    brillo. Es para la monoriel, que no está sobre un fondo de estudio sino
    apoyada contra una pared beige con sombra: por inundación la pared no se
    va nunca. Como la abertura es oscura y rectangular, recortar por brillo la
    aísla limpio.

  - "caja": recorte a mano, con la caja declarada en proporciones de la foto.
    Es para las fotos de ambiente, que no tienen fondo de estudio que quitar:
    una puerta abierta a un balcón, una ventana en un dormitorio. No hay forma
    automática de separar el producto de la pared, así que se recorta al vano y
    se lo monta en el mismo lienzo, con el mismo margen. Queda la pared de la
    foto alrededor en vez del fondo liso, pero al ser pared blanca la diferencia
    con --paper-2 es chica y la grilla sigue leyéndose pareja.

    La caja también sirve para sacar marcas de agua: la de la ventana fija va
    recortada por encima del logo del fabricante que traía abajo.
*/
const TIPOS = [
  /*
    La corrediza de tres hojas tampoco era lo que decía: la foto vieja mostraba
    una ventana corrediza común, no una puerta de tres hojas. La nueva viene de
    un catálogo que nombra los renders con el código de la industria, donde "o"
    es paño fijo y "x" hoja que corre: "oxo" son tres hojas con la del medio
    móvil, que es exactamente el producto. Es frontal y más plana que las otras
    del armado, pero muestra las tres hojas sin lugar a duda, y eso pesa más.
  */
  { slug: "corrediza-3hojas", src: "../../scripts/fuente/src-corrediza-3hojas.png", metodo: "alfa" },

  // Las que trajo el cliente el 2026-10-06, en scripts/fuente/
  { slug: "banderola", src: "../../scripts/fuente/src-banderola.webp", metodo: "fondo", tol: 10 },
  { slug: "puerta-balcon", src: "../../scripts/fuente/src-puerta-balcon.webp", metodo: "ambiente", caja: [0.07, 0.00, 0.83, 0.95], pared: [0xd3, 0xcd, 0xc6] },
  // la caja deja afuera la planta de la izquierda y la marca de agua del pie
  /*
    Las cinco que faltaban, bajadas el 2026-10-06 de catálogos de fabricante.
    Vienen en PNG con canal alfa, así que no hay que inundar ningún fondo: el
    recorte ya está hecho en el archivo. Cuatro son del mismo renderizador
    (windowforce.ca), que es lo que las deja parejas entre sí.

    Patagónica y Monoriel, que venían confundidas, se separan así:

    - Monoriel: un riel y una sola hoja. Lo que la acompaña es vidrio fijo
      montado en el marco, no una hoja. Todo queda en un mismo plano.
    - Patagónica: dos hojas montadas como tales, en rieles distintos, y una se
      traba fija. Por eso la móvil corre POR DELANTE de la otra y se ve la
      profundidad entre las dos.

    Esa profundidad es lo único que las separa a simple vista, así que cada
    foto está elegida por eso: la monoriel es el render frontal, con los dos
    paños a ras; la patagónica es el render angulado, donde la hoja se ve
    montada por delante. Estaban al revés y se corrigió el 2026-10-07.

    Queda por confirmar con el cliente, porque la definición salió de una
    deducción y no de su catálogo.
  */
  { slug: "proyectante", src: "../../scripts/fuente/src-proyectante.png", metodo: "alfa" },
  { slug: "rebatible", src: "../../scripts/fuente/src-rebatible.png", metodo: "alfa" },
  { slug: "patagonica", src: "../../scripts/fuente/src-patagonica.png", metodo: "alfa" },
  { slug: "monoriel", src: "../../scripts/fuente/src-monoriel.png", metodo: "alfa" },
  /*
    La oscilobatiente va volcada, no abierta de costado. Abierta de costado
    hace el mismo movimiento que la rebatible y las dos tarjetas terminan
    mostrando lo mismo; volcar hacia adentro desde abajo es lo único que una
    rebatible no puede hacer, así que es lo que tiene que mostrar la foto.
  */
  { slug: "oscilobatiente", src: "../../scripts/fuente/src-oscilobatiente.png", metodo: "alfa" },

  /*
    ── Línea de aluminio ──

    Mismo arreglo que en PVC, con el mismo diagnóstico: la grilla mezclaba una
    oficina con mamparas en "Corredizas", un baño en "Batientes", la misma foto
    que servía para la oscilobatiente de PVC, y una proyectante negra bajo el
    título "Banderolas". Van todas en negro o antracita, que es lo que
    corresponde a esta línea.

    La banderola viene de un render de 300x300 ampliado a 1600: es lo único que
    apareció que sea de verdad una banderola (hoja que vuelca desde abajo) y no
    una proyectante. Ampliar aguanta porque es CGI de superficies planas, no
    una foto; igual es la más blanda de las seis y conviene reemplazarla si
    aparece una mejor.
  */
  // La proyectante la mandó el cliente el 2026-10-06. Viene en JPG sobre blanco,
  // no recortada, así que va por inundación y no por alfa.
  { slug: "alu-proyectante", src: "../../scripts/fuente/src-proyectante-aluminio.jpg", metodo: "fondo", tol: 30 },
  { slug: "alu-corrediza", src: "../../scripts/fuente/src-alu-corrediza.png", metodo: "alfa" },
  { slug: "alu-oscilobatiente", src: "../../scripts/fuente/src-alu-oscilobatiente.png", metodo: "alfa" },
  /*
    Desplazable: la hoja abre hacia afuera sobre tijeras de acero y se corre, lo
    que deja limpiar el vidrio desde adentro. Esta imagen es la que servía para
    "Batiente", tipología que el cliente sacó del catálogo el 2026-10-07; se
    recicla porque el movimiento que muestra —hoja que abre de costado hacia
    afuera— es el más cercano que hay. PROVISORIA: no se le ven las tijeras, que
    son lo que define la tipología. Pide una foto del local.
  */
  { slug: "alu-desplazable", src: "../../scripts/fuente/src-alu-desplazable.png", metodo: "alfa" },
  { slug: "alu-banderola", src: "../../scripts/fuente/src-alu-banderola.png", metodo: "alfa" },
  { slug: "alu-fijo", src: "../../scripts/fuente/src-alu-fijo.png", metodo: "alfa" },
  // Puerta balcón: el cliente la define como corrediza de tres vías de grandes
  // dimensiones, no como dos hojas batientes, que es lo que mostraba la imagen
  // anterior (con el logo del fabricante encima, que había que borrar).
  { slug: "alu-puerta-balcon", src: "../../scripts/fuente/src-alu-puerta-balcon.png", metodo: "alfa" },

  { slug: "fijo", src: "../../scripts/fuente/src-fija-mas-hoja.jpg", metodo: "ambiente", caja: [0.30, 0.03, 0.95, 0.88], pared: [0xb4, 0xb2, 0xae], tope: 1.12 },
];

/*
  Tres tipologías no están acá y van con la foto que ya tenían, porque no hay
  de dónde sacar un recorte:

  - Banderola: no hay ninguna foto de una banderola.
  - Puerta balcón y Paño fijo: solo hay fotos de ambiente (un pasillo, un lago).
    Una foto de ambiente no se puede convertir en recorte de estudio.

  pvc-oscilobatiente-abierta.jpg se descartó como origen: parece de estudio pero
  es una ventana colocada en una pared, así que no hay fondo que quitar. Con
  tolerancia baja queda la pared y con tolerancia alta se come el marco blanco.
  Las cuatro pruebas están en el historial; ninguna sirvió.
*/

for (const { slug, src, metodo, tol, umbral, caja, pared, tope, borrar } of TIPOS) {
  const origen = path.join(raiz, "public/photos", src);
  if (!fs.existsSync(origen)) {
    console.log(`tip-${slug}: falta ${src}`);
    continue;
  }

  const lector = sharp(origen);
  const { data, info } = await (metodo === "alfa"
    ? lector.ensureAlpha()
    : lector.flatten({ background: "#ffffff" })
  ).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Color del fondo: promedio del borde
  let sr = 0, sg = 0, sb = 0, n = 0;
  const leer = (i) => [data[i * C], data[i * C + 1], data[i * C + 2]];
  for (let x = 0; x < W; x++) {
    for (const i of [x, (H - 1) * W + x]) { const [r, g, b] = leer(i); sr += r; sg += g; sb += b; n++; }
  }
  const fr = sr / n, fg = sg / n, fb = sb / n;

  const esFondo = new Uint8Array(W * H);

  if (metodo === "alfa") {
    /*
      El archivo ya viene recortado: lo transparente es el fondo. El umbral va
      alto a propósito, en la mitad: estos renders traen una sombra difuminada
      abajo y con un umbral bajo la sombra entra en la caja, encoge la ventana
      dentro del recuadro y la descoloca hacia arriba. Así la caja la marca
      sólo la abertura, y la sombra se sigue viendo porque el alfa pasa entero
      a la salida.
    */
    // marcas de agua: se borran antes de medir la caja, para que no la agranden
    for (const [bx0, by0, bx1, by1] of borrar ?? []) {
      for (let y = Math.round(by0 * H); y < Math.round(by1 * H); y++) {
        for (let x = Math.round(bx0 * W); x < Math.round(bx1 * W); x++) data[(y * W + x) * C + 3] = 0;
      }
    }
    for (let i = 0; i < W * H; i++) if (data[i * C + 3] < 128) esFondo[i] = 1;
  } else if (metodo === "caja" || metodo === "ambiente") {
    // Caja declarada a mano: todo lo de afuera es fondo
    const [cx0, cy0, cx1, cy1] = caja;
    const bx0 = Math.round(cx0 * W), by0 = Math.round(cy0 * H);
    const bx1 = Math.round(cx1 * W), by1 = Math.round(cy1 * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (x < bx0 || x > bx1 || y < by0 || y > by1) esFondo[y * W + x] = 1;
    }
  } else if (metodo === "oscuro") {
    // Todo lo que no sea suficientemente oscuro es fondo
    for (let i = 0; i < W * H; i++) {
      const [r, g, b] = leer(i);
      if ((r + g + b) / 3 > umbral) esFondo[i] = 1;
    }
  } else {

  // Inundación desde el borde: marca lo que es fondo y está pegado al borde
  const cola = [];
  const parecido = (i) => {
    const [r, g, b] = leer(i);
    return Math.abs(r - fr) < tol && Math.abs(g - fg) < tol && Math.abs(b - fb) < tol;
  };
  for (let x = 0; x < W; x++) { for (const i of [x, (H - 1) * W + x]) if (!esFondo[i] && parecido(i)) { esFondo[i] = 1; cola.push(i); } }
  for (let y = 0; y < H; y++) { for (const i of [y * W, y * W + W - 1]) if (!esFondo[i] && parecido(i)) { esFondo[i] = 1; cola.push(i); } }
  while (cola.length) {
    const i = cola.pop();
    const x = i % W, y = (i / W) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = ny * W + nx;
      if (!esFondo[j] && parecido(j)) { esFondo[j] = 1; cola.push(j); }
    }
  }
  }

  // Caja del producto
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!esFondo[y * W + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) { console.log(`tip-${slug}: el recorte se comió todo, revisar tol`); continue; }

  // RGBA con el fondo transparente
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = data[i * C]; rgba[i * 4 + 1] = data[i * C + 1]; rgba[i * 4 + 2] = data[i * C + 2];
    // Con "oscuro" no se cala nada: la abertura es un rectángulo macizo y
    // volverle transparente el vidrio la dejaría hueca. Solo se recorta.
    rgba[i * 4 + 3] = metodo === "alfa" ? data[i * C + 3]
      : metodo === "oscuro" || metodo === "caja" ? 255
      : (esFondo[i] ? 0 : 255);
  }

  /*
    "ambiente" es para las fotos tomadas en un ambiente, que no tienen fondo de
    estudio que quitar y que tampoco se pueden calar: la abertura está apoyada
    contra una pared y abierta sobre un balcón.

    El truco es al revés que en los recortes: en vez de sacarle el fondo a la
    foto, se le lleva el fondo al color del lienzo. La foto se aclara con una
    ganancia por canal que mapea el color de su pared a --paper-2, y después se
    encaja entera con ese mismo color de relleno. La pared de la foto y el
    lienzo quedan del mismo tono, así que no se ve el borde del rectángulo y la
    tarjeta se lee como las vecinas.

    La ganancia es pareja sobre toda la imagen, no un retoque local: la
    abertura se aclara en la misma proporción y la foto sigue siendo la misma.

    Se probó antes a sangre, llenando el recuadro: la puerta es más alta que
    ancha, así que para cubrir un 4:3 hay que recortarla arriba y abajo y deja
    de leerse como puerta.
  */
  if (metodo === "ambiente") {
    /*
      "tope" frena la ganancia. La foto de la ventana fija es a contraluz y
      afuera hay nieve: llevarle la pared hasta --paper-2 pedía multiplicar por
      1.37 y eso reventaba el exterior en blanco puro, con la ventana
      desapareciendo dentro de la mancha. Con el tope la pared queda algo más
      oscura que el lienzo y se nota un poco el borde, pero la abertura, que es
      lo que la tarjeta tiene que mostrar, se sigue viendo.
    */
    const ganancia = [FONDO.r / pared[0], FONDO.g / pared[1], FONDO.b / pared[2]]
      .map((g) => (tope ? Math.min(g, tope) : g));
    const salida = path.join(raiz, "public/photos", `tip-${slug}.webp`);
    await sharp(origen)
      .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
      .linear(ganancia, [0, 0, 0])
      .resize({ width: Math.round(ANCHO * (1 - MARGEN * 2)), height: Math.round(ALTO * (1 - MARGEN * 2)), fit: "inside" })
      .extend({
        top: 0, bottom: 0, left: 0, right: 0,
        background: FONDO,
      })
      .resize({ width: ANCHO, height: ALTO, fit: "contain", background: FONDO })
      .webp({ quality: 86 })
      .toFile(salida);
    console.log(`tip-${slug}.webp  ambiente  ·  ${(fs.statSync(salida).size / 1024).toFixed(0)} KB`);
    continue;
  }

  const pw = x1 - x0 + 1, ph = y1 - y0 + 1;
  const util = { w: Math.round(ANCHO * (1 - MARGEN * 2)), h: Math.round(ALTO * (1 - MARGEN * 2)) };
  const pieza = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: x0, top: y0, width: pw, height: ph })
    .resize({ width: util.w, height: util.h, fit: "inside" })
    // png explícito: el buffer viene de una entrada raw y sin formato no se
    // puede componer encima del lienzo
    .png()
    .toBuffer();

  const salida = path.join(raiz, "public/photos", `tip-${slug}.webp`);
  await sharp({ create: { width: ANCHO, height: ALTO, channels: 4, background: FONDO } })
    .composite([{ input: pieza, gravity: "centre" }])
    .webp({ quality: 86 })
    .toFile(salida);

  const kb = (fs.statSync(salida).size / 1024).toFixed(0);
  console.log(`tip-${slug}.webp  producto ${pw}x${ph}  ·  ${kb} KB`);
}
