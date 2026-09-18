/*
  Render de una abertura: SVG generado con geometría, no dibujado a mano.

  Por qué así: un dibujo plano de rectángulos se lee como ícono. Acá la
  abertura es un cuerpo con ancho, alto y profundidad; la hoja gira sobre su
  eje de bisagras; todo se proyecta en perspectiva y cada cara se sombrea
  según cómo le da la luz. Eso es lo que da el volumen de un render.

  Cómo funciona:
  - Los puntos se definen en 3D (x a la derecha, y hacia abajo, z hacia el que
    mira) y se rotan sobre el eje vertical para lograr la vista de tres cuartos.
  - `proyectar` aplica la perspectiva: lo que está más cerca se agranda.
  - `cara` recibe cuatro puntos, calcula la normal y de ahí el brillo (Lambert)
    con una luz alta a la izquierda. El color de la terminación entra una sola
    vez y todas las caras se derivan de él.
  - Las caras se dibujan de atrás hacia adelante, para que se tapen bien.

  Tipos: "corrediza", "oscilobatiente", "mampara" y "frente".
*/
const ALFA = 0.42;        // giro de la vista, en radianes (≈24°)
const FOCO = 1500;        // distancia de cámara: cuanto mayor, menos deformación
const LUZ = normalizar([-0.45, -0.55, 0.7]);

function normalizar(v) {
  const m = Math.hypot(...v);
  return v.map((c) => c / m);
}

const mezclar = (hex, con, p) => {
  const n = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const d = [0, 2, 4].map((i) => parseInt(con.slice(i, i + 2), 16));
  return `#${c.map((v, i) => Math.round(v + (d[i] - v) * p).toString(16).padStart(2, "0")).join("")}`;
};

// Gira un punto sobre el eje vertical que pasa por `cx`
const girar = ([x, y, z], a, cx = 0) => {
  const dx = x - cx;
  return [cx + dx * Math.cos(a) + z * Math.sin(a), y, -dx * Math.sin(a) + z * Math.cos(a)];
};

const proyectar = ([x, y, z]) => {
  const s = FOCO / (FOCO - z);
  return [188 + x * s, 132 + y * s];
};

const puntos = (ps) => ps.map((p) => proyectar(girar(p, ALFA)).map((n) => n.toFixed(1)).join(",")).join(" ");

// Brillo de una cara según su orientación: de 0.35 (contraluz) a 1.15 (de frente a la luz)
function brillo(ps) {
  const [a, b, c] = ps.map((p) => girar(p, ALFA));
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = normalizar([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]);
  const d = Math.abs(n[0] * LUZ[0] + n[1] * LUZ[1] + n[2] * LUZ[2]);
  return 0.42 + d * 0.73;
}

function tono(base, b) {
  return b >= 1 ? mezclar(base, "ffffff", Math.min(0.42, (b - 1) * 2.2)) : mezclar(base, "000000", Math.min(0.72, (1 - b) * 0.95));
}

// Una cara: cuatro puntos en 3D, pintados con el color de la terminación
function Cara({ ps, base, extra = 0, opacidad = 1 }) {
  const b = brillo(ps) + extra;
  return <polygon points={puntos(ps)} fill={tono(base, b)} opacity={opacidad} />;
}

/* Un marco: cuatro tramos con su cara frontal y su jamba interior (la
   profundidad que se ve por la perspectiva). */
function Marco({ x0, x1, y0, y1, g, z0, z1, base }) {
  const ix0 = x0 + g, ix1 = x1 - g, iy0 = y0 + g, iy1 = y1 - g;
  const frente = [
    [[x0, y0, z1], [x1, y0, z1], [ix1, iy0, z1], [ix0, iy0, z1]],   // travesaño superior
    [[x0, y1, z1], [ix0, iy1, z1], [ix1, iy1, z1], [x1, y1, z1]],   // inferior
    [[x0, y0, z1], [ix0, iy0, z1], [ix0, iy1, z1], [x0, y1, z1]],   // parante izquierdo
    [[x1, y0, z1], [x1, y1, z1], [ix1, iy1, z1], [ix1, iy0, z1]],   // derecho
  ];
  const jambas = [
    [[ix0, iy0, z1], [ix1, iy0, z1], [ix1, iy0, z0], [ix0, iy0, z0]],
    [[ix0, iy1, z1], [ix0, iy1, z0], [ix1, iy1, z0], [ix1, iy1, z1]],
    [[ix0, iy0, z1], [ix0, iy0, z0], [ix0, iy1, z0], [ix0, iy1, z1]],
    [[ix1, iy0, z1], [ix1, iy1, z1], [ix1, iy1, z0], [ix1, iy0, z0]],
  ];
  return (
    <g>
      {jambas.map((c, i) => <Cara key={`j${i}`} ps={c} base={base} extra={-0.12} />)}
      {frente.map((c, i) => <Cara key={`f${i}`} ps={c} base={base} />)}
    </g>
  );
}

/* Una hoja: su propio marco y el vidrio, girada sobre el eje de bisagras. */
function Hoja({ x0, x1, y0, y1, g, z0, z1, base, abrir = 0, id }) {
  const gira = (p) => (abrir ? girar(p, -abrir, x0) : p);
  const m = (ps) => ps.map(gira);
  const ix0 = x0 + g, ix1 = x1 - g, iy0 = y0 + g, iy1 = y1 - g;
  const caras = [
    [[x0, y0, z1], [x1, y0, z1], [ix1, iy0, z1], [ix0, iy0, z1]],
    [[x0, y1, z1], [ix0, iy1, z1], [ix1, iy1, z1], [x1, y1, z1]],
    [[x0, y0, z1], [ix0, iy0, z1], [ix0, iy1, z1], [x0, y1, z1]],
    [[x1, y0, z1], [x1, y1, z1], [ix1, iy1, z1], [ix1, iy0, z1]],
  ];
  const canto = [
    [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]],       // canto de cierre
    [[x0, y0, z1], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]],       // canto superior
  ];
  // el junquillo: un escalon mas adentro, que es lo que separa marco de hoja
  const j = 3.5, jz = z1 - 2.5;
  const junquillo = [
    [[ix0, iy0, z1], [ix1, iy0, z1], [ix1 - j, iy0 + j, jz], [ix0 + j, iy0 + j, jz]],
    [[ix0, iy1, z1], [ix0 + j, iy1 - j, jz], [ix1 - j, iy1 - j, jz], [ix1, iy1, z1]],
    [[ix0, iy0, z1], [ix0 + j, iy0 + j, jz], [ix0 + j, iy1 - j, jz], [ix0, iy1, z1]],
    [[ix1, iy0, z1], [ix1, iy1, z1], [ix1 - j, iy1 - j, jz], [ix1 - j, iy0 + j, jz]],
  ];
  const vidrio = m([[ix0 + j, iy0 + j, jz], [ix1 - j, iy0 + j, jz], [ix1 - j, iy1 - j, jz], [ix0 + j, iy1 - j, jz]]);
  return (
    <g>
      {canto.map((c, i) => <Cara key={`c${i}`} ps={m(c)} base={base} extra={-0.18} />)}
      <polygon points={puntos(vidrio)} fill={`url(#${id}-vidrio)`} />
      <polygon points={puntos(vidrio)} fill={`url(#${id}-reflejo)`} opacity="0.5" />
      <polygon points={puntos(vidrio)} fill={`url(#${id}-cielo)`} opacity="0.45" />
      {junquillo.map((c, i) => <Cara key={`q${i}`} ps={m(c)} base={base} extra={-0.06} />)}
      {caras.map((c, i) => <Cara key={`h${i}`} ps={m(c)} base={base} />)}
    </g>
  );
}

function Bisagra({ x, y, z, base }) {
  const w = 5, h = 13, d = 7;
  return (
    <g>
      <Cara ps={[[x, y - h / 2, z], [x + w, y - h / 2, z], [x + w, y + h / 2, z], [x, y + h / 2, z]]} base="#23262a" />
      <Cara ps={[[x + w, y - h / 2, z], [x + w, y - h / 2, z - d], [x + w, y + h / 2, z - d], [x + w, y + h / 2, z]]} base="#23262a" />
      <Cara ps={[[x, y - h / 2, z], [x + w, y - h / 2, z], [x + w, y - h / 2, z - d], [x, y - h / 2, z - d]]} base="#3a3f45" />
      <Cara ps={[[x, y - h / 2, z], [x, y - h / 2, z - d], [x, y + h / 2, z - d], [x, y + h / 2, z]]} base={base} opacidad={0} />
    </g>
  );
}

function Manija({ x, y, z, largo = 34, abrir = 0, eje = 0, barra = false, id }) {
  const gira = (p) => (abrir ? girar(p, -abrir, eje) : p);
  const ancho = barra ? 3.5 : 5;
  const cuerpo = [[x - ancho, y - largo / 2, z], [x + ancho, y - largo / 2, z], [x + ancho, y + largo / 2, z], [x - ancho, y + largo / 2, z]].map(gira);
  const lado = [[x + ancho, y - largo / 2, z], [x + ancho, y - largo / 2, z + 4], [x + ancho, y + largo / 2, z + 4], [x + ancho, y + largo / 2, z]].map(gira);
  const palanca = [[x - 3, y - 2, z + 5], [x + 26, y - 2, z + 5], [x + 26, y + 3, z + 5], [x - 3, y + 3, z + 5]].map(gira);
  return (
    <g>
      <polygon points={puntos(cuerpo)} fill={`url(#${id}-metal)`} />
      <polygon points={puntos(lado)} fill="#0f1113" opacity="0.8" />
      {!barra && <polygon points={puntos(palanca)} fill={`url(#${id}-metal)`} />}
    </g>
  );
}

const MADERA = "#7a4a26";

export default function AberturaRender({ tipo = "corrediza", color = "#2b2b2c", titulo, cotas = false }) {
  const base = color === "madera" ? MADERA : color;
  const id = "ab";
  const veta = color === "madera";

  // medidas del cuerpo, en unidades de dibujo
  const A = tipo === "oscilobatiente" ? 78 : 150;   // media anchura
  const H = 104;                                     // media altura
  const P = 16;                                      // profundidad del marco
  const M = 92, MH = 118;                            // mampara: mas angosta y mas alta

  return (
    <svg className="ab-render" viewBox="0 0 380 270" role="img" aria-label={titulo}>
      <defs>
        <linearGradient id={`${id}-vidrio`} x1="0" y1="0" x2="0.45" y2="1">
          <stop offset="0%" stopColor="#9fb7aa" />
          <stop offset="42%" stopColor="#cfe0d5" />
          <stop offset="100%" stopColor="#edf3ee" />
        </linearGradient>
        <linearGradient id={`${id}-reflejo`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="54%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-cielo`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#cfe0ea" stopOpacity="0.85" />
          <stop offset="38%" stopColor="#eaf1f2" stopOpacity="0.5" />
          <stop offset="39%" stopColor="#cbd8cd" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#98a89b" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a4f56" />
          <stop offset="50%" stopColor="#23262a" />
          <stop offset="100%" stopColor="#141619" />
        </linearGradient>
        {veta && (
          <pattern id={`${id}-veta`} width="6" height="60" patternUnits="userSpaceOnUse">
            <rect width="6" height="60" fill={MADERA} />
            <rect width="1.2" height="60" fill={mezclar(MADERA, "000000", 0.22)} opacity="0.55" />
            <rect x="3.4" width="0.8" height="60" fill={mezclar(MADERA, "ffffff", 0.18)} opacity="0.4" />
          </pattern>
        )}
        <filter id={`${id}-piso`} x="-40%" y="-90%" width="180%" height="320%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <ellipse cx="196" cy="246" rx="120" ry="9" fill="#0e2a1a" opacity="0.18" filter={`url(#${id}-piso)`} />

      {tipo === "corrediza" && (
        <g>
          <Marco x0={-A} x1={A} y0={-H} y1={H} g={15} z0={0} z1={P} base={base} />
          <Hoja x0={2} x1={A - 14} y0={-H + 14} y1={H - 14} g={10} z0={0} z1={5} base={base} id={id} />
          <Hoja x0={-A + 14} x1={4} y0={-H + 14} y1={H - 14} g={10} z0={6} z1={13} base={base} id={id} />
          <Manija x={-A + 22} y={0} z={13} id={id} />
          <Manija x={A - 30} y={0} z={5} id={id} />
        </g>
      )}

      {tipo === "oscilobatiente" && (
        <g>
          <Marco x0={-A} x1={A} y0={-H} y1={H} g={14} z0={0} z1={P} base={base} />
          <Cara ps={[[-A + 14, -H + 14, 0], [A - 14, -H + 14, 0], [A - 14, H - 14, 0], [-A + 14, H - 14, 0]]} base="#e8ece7" extra={0.1} />
          <Bisagra x={-A + 4} y={-H + 34} z={P} base={base} />
          <Bisagra x={-A + 4} y={H - 34} z={P} base={base} />
          <Hoja x0={-A + 12} x1={A - 12} y0={-H + 12} y1={H - 12} g={11} z0={P} z1={P + 10} base={base} abrir={0.95} id={id} />
          <Manija x={A - 34} y={0} z={P + 10} abrir={0.95} eje={-A + 12} id={id} />
        </g>
      )}

      {tipo === "mampara" && (
        <g>
          {/* mampara: alta y angosta, perfil fino y sin marco abajo */}
          <Cara ps={[[-M, -MH, 8], [M, -MH, 8], [M, -MH + 6, 8], [-M, -MH + 6, 8]]} base={base} />
          <Cara ps={[[-M, -MH, 8], [-M, MH, 8], [-M + 6, MH, 8], [-M + 6, -MH, 8]]} base={base} />
          <Cara ps={[[M - 6, -MH, 8], [M, -MH, 8], [M, MH, 8], [M - 6, MH, 8]]} base={base} />
          <Hoja x0={2} x1={M - 6} y0={-MH + 6} y1={MH} g={4} z0={0} z1={4} base={base} id={id} />
          <Hoja x0={-M + 6} x1={4} y0={-MH + 6} y1={MH} g={4} z0={5} z1={9} base={base} id={id} />
          <Manija x={-M + 26} y={-6} z={9} largo={40} barra id={id} />
        </g>
      )}

      {tipo === "frente" && (
        <g>
          <Marco x0={-A} x1={A} y0={-H} y1={H} g={9} z0={0} z1={12} base={base} />
          <Hoja x0={2} x1={A - 9} y0={-H + 9} y1={H - 9} g={6} z0={0} z1={5} base={base} id={id} />
          <Hoja x0={-A + 9} x1={4} y0={-H + 9} y1={H - 9} g={6} z0={6} z1={11} base={base} id={id} />
          <Manija x={-22} y={0} z={11} largo={56} barra id={id} />
          <Manija x={20} y={0} z={5} largo={56} barra id={id} />
        </g>
      )}

      {cotas && (
        <g stroke="#8a958c" fill="#8a958c" opacity="0.7">
          <path d="M40 252 h300" strokeWidth="0.6" />
          <path d="M40 248 v8 M340 248 v8" strokeWidth="0.6" />
          <path d="M45 249.5 l-5 2.5 5 2.5 Z M335 249.5 l5 2.5 -5 2.5 Z" stroke="none" />
        </g>
      )}
    </svg>
  );
}
