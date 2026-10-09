/*
  Rehace las dos fotos equivocadas de la galería "PVC de cerca.".

    node scripts/fotos-galeria.mjs

  ── Por qué ──

  El cliente marcó dos de las cinco (2026-10-07): son productos de PVC, sí,
  pero no son aberturas.

  - "Terminaciones foliadas" mostraba tablas de Wall Panel de exterior, con el
    ranurado decorativo a la vista. Es revestimiento.
  - "Perfil multicámara" mostraba perfiles de DECK —los de agujeros redondos en
    fila— y un poste de Parasol. Un perfil de ventana tiene forma escalonada,
    cámara para el refuerzo de acero y rebaje para el burlete; nada de eso
    aparecía.

  ── Encuadre ──

  La galería recorta a 2:3 por CSS (.drag figure.tall) y la tarjeta mide como
  mucho 400px de ancho, así que 800x1200 alcanza y sobra para pantallas
  retina. Las fotos salen ya en esa proporción para no desperdiciar recorte.

  ── Origen ──

  - perfil: Wikimedia Commons, "5-chamber plastic window profile". Es la única
    de licencia libre de todo lo que se revisó, y encima es la mejor: foto real
    de un perfil cortado, con el refuerzo de acero galvanizado adentro y las
    cámaras contándose solas.
  - foliado: toma de estudio de un perfil de ventana laminado en roble.

  Se descartó una foto de banco de trabajo con muestrarios, que era la que
  mejor ilustraba "terminaciones" en plural, porque el archivo se llamaba
  AdobeStock_..._comp: es una previsualización de stock, no licenciada para uso
  comercial.
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

/*
  Dos formatos, los mismos que usa la galería por CSS: las fichas de detalle
  (.drag figure.tall) se recortan a 2:3 y las anchas a 3:2.
*/
const FORMATOS = { alto: [800, 1200], ancho: [1200, 800] };

// salida -> origen y caja de recorte en proporciones de la foto
const FOTOS = [
  { slug: "det-pvc-perfil", src: "src-det-perfil.jpg", caja: [0.0, 0.0, 0.93, 1.0], formato: "alto" },
  { slug: "det-pvc-foliado", src: "src-det-foliado.jpg", caja: [0.15, 0.0, 0.82, 1.0], formato: "alto" },

  /*
    La corrediza de tres hojas de la galería de Aluminio venía de la imagen de
    Open Graph, que es 1200x630 y está pensada para una tarjeta de red social.
    La galería la recortaba al centro y se comía la hoja del borde, así que
    parecía de dos. Recortada desde la izquierda se ven las tres: dos manijas y
    los dos montantes quedan dentro.
  */
  { slug: "det-aluminio-corrediza", src: "../../public/og/producto-aluminio.jpg", caja: [0.0, 0.0, 0.7875, 1.0], formato: "ancho" },
];

for (const { slug, src, caja, formato } of FOTOS) {
  const [ANCHO, ALTO] = FORMATOS[formato];
  const origen = path.join(raiz, "scripts/fuente", src);
  if (!fs.existsSync(origen)) {
    console.log(`${slug}: falta ${src}`);
    continue;
  }

  const { width: W, height: H } = await sharp(origen).metadata();
  const [cx0, cy0, cx1, cy1] = caja;
  const left = Math.round(cx0 * W);
  const top = Math.round(cy0 * H);
  const width = Math.round((cx1 - cx0) * W);
  const height = Math.round((cy1 - cy0) * H);

  const salida = path.join(raiz, "public/photos", `${slug}.webp`);
  await sharp(origen)
    .extract({ left, top, width, height })
    .resize({ width: ANCHO, height: ALTO, fit: "cover" })
    .webp({ quality: 86 })
    .toFile(salida);

  const kb = (fs.statSync(salida).size / 1024).toFixed(0);
  const escala = (ANCHO / width).toFixed(2);
  console.log(`${slug}.webp  recorte ${width}x${height}  ·  escala ${escala}x  ·  ${kb} KB`);
}
