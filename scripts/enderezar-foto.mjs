/*
  Endereza la foto de "Instalación" de la tira de Proceso.

    node scripts/enderezar-foto.mjs

  ── Por qué ──

  El cliente notó que la primera y la última foto de la tira "caían para el
  mismo lado". Mirando las cuatro con una retícula encima, la de Instalación
  tenía ~3,5° de cámara torcida: el dintel de la corrediza subía hacia la
  derecha y las dos jambas se iban para el mismo lado, que es la firma de una
  rotación y no de una perspectiva.

  La del local (local-aluva.jpg) también cae hacia la derecha, pero ahí NO es
  cámara torcida: es un contrapicado pegado a la fachada, y la diagonal la hace
  la perspectiva. Se probó rotarla -3, -6 y -9 grados y empeora: el edificio
  se va para el otro lado y la composición se desarma. Tampoco se arregla
  recortando, porque la foto es 2:3 contra el 3:4 del recuadro y sobran apenas
  223 px de alto. Por eso queda como está.

  Enderezando solo la de Instalación, las dos puntas dejan de caer para el
  mismo lado, que era el problema.

  ── Cómo se midió el ángulo (y por qué el primer intento salió mal) ──

  El primer intento usó 3,5°, estimado mirando las jambas en una miniatura. Se
  quedó corto a la mitad: las jambas convergen por perspectiva, así que su
  inclinación NO es el ángulo de cámara y lleva a subestimarlo.

  La referencia buena es una horizontal larga: el dintel de la corrediza. Se
  recorta una franja fina a la altura del dintel, se amplía a 760 px y se le
  tiran líneas horizontales cada 8 px encima. Ahí el ángulo se lee solo. A 6°
  el dintel todavía sube apenas, a 6,5° queda paralelo, a 7° ya cae para el
  otro lado.

  Un ajuste por mínimos cuadrados sobre el borde superior del vidrio también se
  probó y no sirvió: daba 46 px de error porque el detector confundía el
  dintel con el travesaño y con la baranda del balcón.

  El original sin tocar queda en scripts/fuente/, fuera de public/, para poder
  volver sin que pese en el sitio.

  ── Por qué el archivo cambió de nombre ──

  Se llamaba proceso-obra.webp y ahora es proceso-instalacion.webp. No es
  cosmético: al corregir la foto dejando el mismo nombre, el navegador siguió
  mostrando la vieja durante dos rondas de correcciones, porque la URL no
  cambiaba y la tenía en caché. Se comprobó pidiéndole el archivo al servidor:
  entregaba el corregido, byte por byte, mientras la pantalla mostraba el otro.

  Cambiar el nombre cambia la URL y ninguna caché —ni la del navegador, ni la
  de Vercel para quien ya visitó el sitio— puede servir la anterior. Si alguna
  vez hay que volver a corregir esta foto, conviene cambiarle el nombre otra
  vez en lugar de pisarla.
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

const GRADOS = 6.5;   // ver nota de abajo sobre cómo se midió
const origen = path.join(raiz, "scripts/fuente/proceso-obra-original.webp");
const salida = path.join(raiz, "public/photos/proceso-instalacion.webp");

const { width: w, height: h } = await sharp(origen).metadata();

// Al rotar quedan cuñas de fondo en las esquinas. Se recorta el rectángulo 3:4
// centrado más grande que entra entero dentro de la foto girada.
const rad = (GRADOS * Math.PI) / 180;
const cos = Math.cos(rad);
const sin = Math.sin(rad);
const anchoGirado = Math.round(w * cos + h * sin);
const altoGirado = Math.round(w * sin + h * cos);

// Lado del recorte: se va achicando hasta que las cuatro esquinas caen dentro
// de la foto original (girada hacia atrás). Es más corto que la fórmula
// cerrada y no se equivoca.
const dentro = (cw, ch) => {
  const cx = anchoGirado / 2;
  const cy = altoGirado / 2;
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].every(([sx, sy]) => {
    const x = (sx * cw) / 2;
    const y = (sy * ch) / 2;
    // deshacer la rotación para ver dónde cae ese punto en la foto original
    const ox = x * cos + y * sin;
    const oy = -x * sin + y * cos;
    return Math.abs(ox) <= w / 2 - 1 && Math.abs(oy) <= h / 2 - 1;
  });
};

let ancho = w;
while (ancho > 100 && !dentro(ancho, (ancho * 4) / 3)) ancho -= 2;
const alto = Math.round((ancho * 4) / 3);

await sharp(origen)
  .rotate(GRADOS, { background: "#ffffff" })
  .extract({
    left: Math.round((anchoGirado - ancho) / 2),
    top: Math.round((altoGirado - alto) / 2),
    width: ancho,
    height: alto,
  })
  .resize({ width: w })          // vuelve al ancho original para no cambiar el peso
  .webp({ quality: 82 })
  .toFile(salida);

const kb = (fs.statSync(salida).size / 1024).toFixed(0);
console.log(`proceso-instalacion.webp  ${GRADOS}°  ·  recorte ${ancho}x${alto}  ·  ${kb} KB`);
