"use client";
/* Diagramas de movimiento en perspectiva isométrica.

   Cada tipología se arma en 3D (ancho x, alto y, profundidad z hacia quien
   mira) y se proyecta con una cámara paralela a la izquierda y un poco
   arriba: las verticales quedan verticales, el ancho sube hacia la derecha y
   lo que se acerca baja hacia la derecha. Esa es la vista de la guía del
   cliente (nov-2026), que pide ver los movimientos "en isométrica" y no planos.

   Se mira desde adentro, igual que los renders de catálogo que van al lado.
   Lo que abre hacia adentro viene hacia el ojo y se dibuja delante del marco;
   lo que sale hacia afuera se aleja y queda detrás. Ese orden marco/hoja es el
   que distingue banderola (abre adentro) de proyectante y desplazable (abren
   afuera). Los colores son solo para separar marco (menta) de hoja (lima),
   como en la guía.

   Con esta cámara una hoja que viene hacia el ojo se ve bien si gira sobre su
   lado izquierdo, y una que se aleja si gira sobre el derecho; al revés se ve
   casi de canto. Por eso las bisagras están donde están.

   Proporciones por tipología según la misma guía: corrediza más chica que la
   puerta balcón, oscilobatiente más vertical que cuadrada, puerta alta y
   angosta, plegadiza larga. No están a medida, pero sí en proporción.

   Revisión del 20-11-2026: toda hoja móvil lleva manija (del lado libre, en
   la cara interior); los paños fijos (paño fijo y piel de vidrio) muestran un
   reflejo de sol que barre el vidrio; corrediza y puerta balcón mueven las dos
   hojas, una después de la otra; la desplazable baja la parte de arriba por
   las jambas mientras la de abajo sale, como hace el herraje tijera real. */
import { useEffect, useState, type ReactNode } from "react";

type V3 = [number, number, number];
type Kind = "fijo" | "rebatible" | "banderola" | "proyectante" | "oscilobatiente" | "desplazable" | "puerta" | "corrediza" | "patagonica" | "monoriel" | "balcon" | "plegadiza" | "piel";

/* ---------- cámara ---------- */
const norm = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]];
/* Punto de una hoja en coordenadas propias (u a lo ancho, v a lo alto) */
const at = (o: V3, U: V3, V: V3, u: number, v: number): V3 => add(add(o, U, u), V, v);

/* El ojo está en dirección (-x, +y, +z): a la izquierda, arriba, del lado interior. */
const EYE = norm([-0.65, 0.55, 1]);
const FWD: V3 = [-EYE[0], -EYE[1], -EYE[2]];
const RIGHT = norm(cross(FWD, [0, 1, 0]));
const UP = norm(cross(RIGHT, FWD));

/* Proyección con escala y centrado para que el marco cerrado entre en el
   viewBox 360x300. `fit` achica las aberturas chicas para que la guía de
   tamaños relativos se respete algo (una ventana no ocupa lo que una plegadiza). */
function makeView(W: number, H: number, fit: number) {
  const corners: V3[] = [[0, 0, 0], [W, 0, 0], [W, H, 0], [0, H, 0]];
  const xs = corners.map((c) => dot(c, RIGHT)), ys = corners.map((c) => -dot(c, UP));
  const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
  const s = fit * Math.min(292 / bw, 232 / bh);
  const ox = 180 - s * (Math.min(...xs) + bw / 2), oy = 150 - s * (Math.min(...ys) + bh / 2);
  return (p: V3): [number, number] => [ox + s * dot(p, RIGHT), oy - s * dot(p, UP)];
}
type Proj = ReturnType<typeof makeView>;
const pt = (P: Proj, p: V3) => P(p).map((n) => n.toFixed(1)).join(",");
const ring = (P: Proj, quads: V3[][]) => quads.map((q) => "M" + q.map((p) => pt(P, p)).join("L") + "Z").join("");

/* Un rectángulo en el espacio: origen, dirección de ancho U, dirección de alto V */
const quad = (o: V3, U: V3, V: V3, w: number, h: number, inset = 0): V3[] => {
  const a = add(add(o, U, inset), V, inset);
  return [a, add(a, U, w - 2 * inset), add(add(a, U, w - 2 * inset), V, h - 2 * inset), add(a, V, h - 2 * inset)];
};

/* Marco: anillo exterior menos una o más luces (las luces se separan con parantes) */
function Frame({ P, W, H, lights }: { P: Proj; W: number; H: number; lights: [number, number, number, number][] }) {
  const outer = quad([0, 0, 0], [1, 0, 0], [0, 1, 0], W, H);
  const holes = lights.map(([x, y, w, h]) => quad([x, y, 0], [1, 0, 0], [0, 1, 0], w, h));
  return <path className="iso-frame" fillRule="evenodd" d={ring(P, [outer, ...holes])} />;
}
/* Hoja: perfil (anillo) + vidrio, en cualquier posición del espacio */
function Sash({ P, o, U, V, w, h, b = 6 }: { P: Proj; o: V3; U: V3; V: V3; w: number; h: number; b?: number }) {
  const out = quad(o, U, V, w, h), inn = quad(o, U, V, w, h, b);
  return (
    <g>
      <path className="iso-glass" d={ring(P, [inn])} />
      <path className="iso-sash" fillRule="evenodd" d={ring(P, [out, inn])} />
    </g>
  );
}
/* Vidrio fijo dentro de una luz del marco (paño fijo, lado fijo de patagónica y monoriel) */
const Glass = ({ P, x, y, w, h }: { P: Proj; x: number; y: number; w: number; h: number }) => <path className="iso-glass" d={ring(P, [quad([x, y, 0], [1, 0, 0], [0, 1, 0], w, h)])} />;

/* Manija: un vástago corto que sale del plano de la hoja hacia el interior y
   la palanca, apoyada en el plano. `dir` es hacia dónde apunta la palanca
   (unitario, en el plano de la hoja). La cara interior es la que mira al ojo,
   así que la normal se elige siempre con z positivo. */
function Handle({ P, base, U, V, dir, len = 18 }: { P: Proj; base: V3; U: V3; V: V3; dir: V3; len?: number }) {
  let N = norm(cross(U, V));
  if (N[2] < 0) N = neg(N);
  const a = add(base, N, 5), b = add(a, dir, len);
  return <path className="iso-handle" d={`M${pt(P, base)}L${pt(P, a)}L${pt(P, b)}`} />;
}

/* Recorte de un polígono convexo contra un rectángulo (Sutherland–Hodgman),
   en coordenadas del plano del vidrio. Evita usar clipPath con ids. */
type P2 = [number, number];
function clipRect(poly: P2[], x0: number, y0: number, x1: number, y1: number): P2[] {
  const sides: ((p: P2) => number)[] = [(p) => p[0] - x0, (p) => x1 - p[0], (p) => p[1] - y0, (p) => y1 - p[1]];
  return sides.reduce((pts, f) => {
    const out: P2[] = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if (fa >= 0 !== fb >= 0) { const r = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]); }
    }
    return out;
  }, poly);
}
/* Reflejo de sol: bandas claras en diagonal, una dentro de otra, que barren
   el vidrio de izquierda a derecha. `u` va de 0 (todavía afuera, a la
   izquierda) a 1 (ya salió por la derecha). */
function Glare({ P, x, y, w, h, u }: { P: Proj; x: number; y: number; w: number; h: number; u: number }) {
  const sl = 0.45; /* inclinación: cuánto corre la banda hacia la izquierda por unidad de alto */
  const bands: [number, number][] = [[0.42, 0.1], [0.24, 0.12], [0.09, 0.3]]; /* [ancho relativo, opacidad] */
  const bw0 = bands[0][0] * w;
  const c = x - bw0 + u * (w + bw0 + sl * h);
  return (
    <g>
      {bands.map(([bw, op], i) => {
        const b = bw * w, off = (bw0 - b) / 2;
        const poly = clipRect([[c + off, y], [c + off + b, y], [c + off + b - sl * h, y + h], [c + off - sl * h, y + h]], x, y, x + w, y + h);
        return poly.length > 2 ? <path key={i} className="iso-glare" opacity={op} d={"M" + poly.map(([px, py]) => pt(P, [px, py, 0])).join("L") + "Z"} /> : null;
      })}
    </g>
  );
}

/* ---------- tiempo ---------- */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/* 0 en [0,a], sube hasta 1 en [a,b], se queda en 1 hasta c, baja a 0 en [c,d] */
const pulse = (t: number, a: number, b: number, c: number, d: number) => (t < a ? 0 : t < b ? ease((t - a) / (b - a)) : t < c ? 1 : t < d ? 1 - ease((t - c) / (d - c)) : 0);
/* 0 antes de a, sube a 1 entre a y b, queda en 1. Suaviza menos que `ease`
   para que el reflejo no se quede clavado en los bordes. Con movimiento
   reducido (t<0) queda a mitad de camino. */
const sweep = (t: number, a: number, b: number) => { if (t < 0) return 0.5; const u = Math.min(1, Math.max(0, (t - a) / (b - a))); return u * u * (3 - 2 * u); };

function useCycle(ms: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setT(-1); return; }
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => { setT(((now - t0) % ms) / ms); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ms]);
  return t;
}

/* ---------- geometría de cada movimiento ---------- */
const rad = (d: number) => (d * Math.PI) / 180;
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0];
/* Dirección de ancho al girar sobre un eje vertical: la hoja empieza
   apuntando en `dir` (±x) y se vuelca `a` radianes hacia el ojo (+z, adentro)
   o alejándose (afuera) */
const turn = (dir: 1 | -1, a: number, inward: boolean): V3 => [dir * Math.cos(a), 0, (inward ? 1 : -1) * Math.sin(a)];
/* Dirección de alto al girar sobre un eje horizontal, ídem */
const tilt = (dir: 1 | -1, a: number, inward: boolean): V3 => [0, dir * Math.cos(a), (inward ? 1 : -1) * Math.sin(a)];

type Lights = [number, number, number, number][];
type Spec = { W: number; H: number; fit: number; ms?: number; draw: (P: Proj, k: number, t: number) => { back?: ReactNode; front?: ReactNode; lights: Lights } };
const F = 7; /* ancho del perfil de marco */
const S = 9; /* separación entre carriles de una corrediza */
const CICLO_DOBLE = 7600; /* tipologías con dos movimientos seguidos */

/* Corrediza de dos hojas, ambas móviles: primero corre la de la derecha (por
   delante) hacia la izquierda y vuelve; después la de la izquierda (por
   detrás) hacia la derecha y vuelve. Sirve para corrediza y puerta balcón.
   Cada hoja lleva la manija en su extremo exterior (la izquierda a la
   izquierda, la derecha a la derecha), no en el encuentro. `hv` es la altura
   de las manijas. */
function corrediza(P: Proj, t: number, W: number, H: number, hv: number) {
  const w = (W - 2 * F) / 2 + 4, h = H - 2 * F, run = (w - 8) * 0.9;
  const dR = t < 0 ? 0.85 : pulse(t, 0.04, 0.2, 0.3, 0.46), dL = t < 0 ? 0 : pulse(t, 0.54, 0.7, 0.8, 0.96);
  const oL: V3 = [F + run * dL, F, 0], oR: V3 = [W - F - w - run * dR, F, S];
  const lights: Lights = [[F, F, W - 2 * F, h]];
  return {
    lights,
    front: (
      <g>
        <Sash P={P} o={oL} U={X} V={Y} w={w} h={h} />
        <Handle P={P} base={at(oL, X, Y, 4, hv + 8)} U={X} V={Y} dir={neg(Y)} len={16} />
        <Sash P={P} o={oR} U={X} V={Y} w={w} h={h} />
        <Handle P={P} base={at(oR, X, Y, w - 4, hv + 8)} U={X} V={Y} dir={neg(Y)} len={16} />
      </g>
    ),
  };
}

const SPECS: Record<Kind, Spec> = {
  fijo: {
    /* sin hojas: el vidrio solo, con el reflejo de sol que lo cruza */
    W: 100, H: 120, fit: 0.86, ms: 5600,
    draw: (P, _k, t) => ({
      lights: [[F, F, 100 - 2 * F, 120 - 2 * F]],
      back: <g><Glass P={P} x={F} y={F} w={100 - 2 * F} h={120 - 2 * F} /><Glare P={P} x={F} y={F} w={100 - 2 * F} h={120 - 2 * F} u={sweep(t, 0.1, 0.9)} /></g>,
    }),
  },
  rebatible: {
    /* bisagras a la izquierda, abre hacia adentro: viene hacia el ojo, delante del marco. Manija en el parante libre. */
    W: 100, H: 120, fit: 0.86,
    draw: (P, k) => {
      const U = turn(1, rad(58) * k, true), w = 100 - 2 * F, h = 120 - 2 * F, o: V3 = [F, F, 0];
      return { lights: [[F, F, w, h]], front: <g><Sash P={P} o={o} U={U} V={Y} w={w} h={h} /><Handle P={P} base={at(o, U, Y, w - 4, h / 2 + 8)} U={U} V={Y} dir={neg(Y)} len={16} /></g> };
    },
  },
  banderola: {
    /* bisagras abajo, la parte de arriba entra hacia adentro. Manija en el travesaño de arriba. */
    W: 120, H: 80, fit: 0.86,
    draw: (P, k) => {
      const V = tilt(1, rad(34) * k, true), w = 120 - 2 * F, h = 80 - 2 * F, o: V3 = [F, F, 0];
      return { lights: [[F, F, w, h]], front: <g><Sash P={P} o={o} U={X} V={V} w={w} h={h} /><Handle P={P} base={at(o, X, V, w / 2 - 8, h - 3)} U={X} V={V} dir={X} len={16} /></g> };
    },
  },
  proyectante: {
    /* bisagras arriba, la parte de abajo sale hacia afuera: se aleja, detrás
       del marco. El herraje no es una manija en la hoja sino un brazo de
       proyección (revisión del 24-11-2026, sobre el render de catálogo): un
       cuerpo fijo en el travesaño de abajo del marco, del lado de adentro, y
       un brazo telescópico que sale de ese cuerpo y toma la hoja por el
       centro de su travesaño inferior. Cerrada, el brazo queda recogido en
       el cuerpo; al abrir se extiende y se inclina siguiendo a la hoja. */
    W: 120, H: 80, fit: 0.86,
    draw: (P, k) => {
      const V = tilt(-1, rad(40) * k, false), w = 120 - 2 * F, h = 80 - 2 * F, o: V3 = [F, 80 - F, 0];
      const base: V3 = [60, F / 2, 1.5];          /* pivote del cuerpo, sobre el travesaño del marco */
      const tip = at(o, X, V, w / 2, h - 3);      /* centro del travesaño de abajo de la hoja */
      const mid = add(base, add(tip, base, -1), 0.45); /* hasta acá llega el tramo grueso */
      return {
        lights: [[F, F, w, h]],
        back: <Sash P={P} o={o} U={X} V={V} w={w} h={h} />,
        front: (
          <g>
            <line className="iso-arm-rod" x1={P(mid)[0]} y1={P(mid)[1]} x2={P(tip)[0]} y2={P(tip)[1]} />
            <line className="iso-arm-body" x1={P(base)[0]} y1={P(base)[1]} x2={P(mid)[0]} y2={P(mid)[1]} />
            <line className="iso-arm-body" x1={P([51, F / 2, 1.5])[0]} y1={P([51, F / 2, 1.5])[1]} x2={P([69, F / 2, 1.5])[0]} y2={P([69, F / 2, 1.5])[1]} />
          </g>
        ),
      };
    },
  },
  oscilobatiente: {
    /* primero vuelca (eje abajo), después abre (bisagras a la izquierda); siempre
       hacia adentro. La manija acompaña como en el herraje real: abajo cerrada,
       arriba para volcar, horizontal para abrir. */
    W: 90, H: 130, fit: 0.86, ms: CICLO_DOBLE,
    draw: (P, _k, t) => {
      const v = t < 0 ? 1 : pulse(t, 0.06, 0.2, 0.3, 0.44), b = t < 0 ? 0 : pulse(t, 0.56, 0.7, 0.82, 0.94);
      const phi = t < 0 ? Math.PI : rad(180) * pulse(t, 0, 0.06, 0.44, 0.5) + rad(90) * pulse(t, 0.5, 0.56, 0.94, 1);
      const w = 90 - 2 * F, h = 130 - 2 * F, o: V3 = [F, F, 0];
      const U = turn(1, rad(55) * b, true), V = tilt(1, rad(30) * v, true);
      const dir = add(add([0, 0, 0], V, -Math.cos(phi)), U, -Math.sin(phi));
      return { lights: [[F, F, w, h]], front: <g><Sash P={P} o={o} U={U} V={V} w={w} h={h} /><Handle P={P} base={at(o, U, V, w - 4, h / 2)} U={U} V={V} dir={dir} len={16} /></g> };
    },
  },
  desplazable: {
    /* herraje tijera: la hoja cuelga de arriba por una bisagra a cada lado que
       corre por una guía en la jamba, y un brazo articulado abajo en la jamba
       la sostiene. Al abrir, la parte de abajo sale hacia afuera y la bisagra
       de arriba baja por la guía. El largo del brazo se mantiene: de ahí sale
       cuánto baja la hoja para cada ángulo. Manija en el travesaño de abajo. */
    W: 120, H: 80, fit: 0.86,
    draw: (P, k) => {
      const w = 120 - 2 * F, h = 80 - 2 * F, a = rad(38) * k;
      const m = h * 0.45, yA = F + 2, L = F + h - yA - m; /* m: dónde toma el brazo a la hoja; L: largo del brazo */
      const drop = (ang: number) => F + h - yA - m * Math.cos(ang) - Math.sqrt(L * L - m * m * Math.sin(ang) ** 2);
      const s = drop(a), sMax = drop(rad(38));
      const V = tilt(-1, a, false), o: V3 = [F, F + h - s, 0];
      const sides = [F + 1.5, F + w - 1.5].map((x) => ({
        A: [x, yA, 0] as V3, B: add([x, F + h - s, 0], V, m), /* brazo: pivote en la jamba → hoja */
        T0: [x, F + h, 0] as V3, T1: [x, F + h - sMax, 0] as V3, /* guía por la que baja la bisagra */
        H: [x, F + h - s, 0] as V3, /* bisagra de arriba, sobre la guía */
      }));
      return {
        lights: [[F, F, w, h]],
        back: (
          <g>
            {sides.map(({ A, B, T0, T1 }, i) => (
              <g key={i}>
                <line className="iso-rail" x1={P(T0)[0]} y1={P(T0)[1]} x2={P(T1)[0]} y2={P(T1)[1]} />
                <line className="iso-arm" x1={P(A)[0]} y1={P(A)[1]} x2={P(B)[0]} y2={P(B)[1]} />
              </g>
            ))}
            <Sash P={P} o={o} U={X} V={V} w={w} h={h} />
            {sides.map(({ H }, i) => <circle key={i} className="iso-hinge" cx={P(H)[0]} cy={P(H)[1]} r={3} />)}
            <Handle P={P} base={at(o, X, V, w / 2 - 8, h - 3)} U={X} V={V} dir={X} len={16} />
          </g>
        ),
      };
    },
  },
  puerta: {
    /* bisagras a la izquierda, abre hacia adentro, con manija del lado libre */
    W: 90, H: 210, fit: 0.9,
    draw: (P, k) => {
      const U = turn(1, rad(62) * k, true), w = 90 - 2 * F, h = 210 - 2 * F, o: V3 = [F, F, 0];
      return { lights: [[F, F, w, h]], front: <g><Sash P={P} o={o} U={U} V={Y} w={w} h={h} /><Handle P={P} base={at(o, U, Y, w - 4, h * 0.5 + 10)} U={U} V={Y} dir={neg(Y)} len={20} /></g> };
    },
  },
  corrediza: {
    W: 150, H: 120, fit: 0.9, ms: CICLO_DOBLE,
    draw: (P, _k, t) => corrediza(P, t, 150, 120, (120 - 2 * F) / 2),
  },
  patagonica: {
    /* hoja rebatible a la izquierda (abre adentro), paño fijo a la derecha. Manija en el parante del encuentro. */
    W: 120, H: 170, fit: 0.86,
    draw: (P, k) => {
      const w = (120 - 3 * F) / 2, h = 170 - 2 * F, U = turn(1, rad(58) * k, true), o: V3 = [F, F, 0];
      return {
        lights: [[F, F, w, h], [2 * F + w, F, w, h]],
        back: <Glass P={P} x={2 * F + w} y={F} w={w} h={h} />,
        front: <g><Sash P={P} o={o} U={U} V={Y} w={w} h={h} /><Handle P={P} base={at(o, U, Y, w - 4, h / 2 + 8)} U={U} V={Y} dir={neg(Y)} len={16} /></g>,
      };
    },
  },
  monoriel: {
    /* paño fijo a la izquierda; la hoja corre por un solo riel, por delante del fijo. Manija en el parante del encuentro. */
    W: 150, H: 220, fit: 0.95,
    draw: (P, k) => {
      const w = (150 - 3 * F) / 2, h = 220 - 2 * F, d = (w + F) * 0.9 * k, o: V3 = [2 * F + w - d, F, S];
      return {
        lights: [[F, F, w, h], [2 * F + w, F, w, h]],
        back: <Glass P={P} x={F} y={F} w={w} h={h} />,
        front: <g><Sash P={P} o={o} U={X} V={Y} w={w} h={h} /><Handle P={P} base={at(o, X, Y, 4, h * 0.47 + 10)} U={X} V={Y} dir={neg(Y)} len={20} /></g>,
      };
    },
  },
  balcon: {
    /* igual que la corrediza pero con alto de puerta y manijas a altura de mano */
    W: 150, H: 220, fit: 0.95, ms: CICLO_DOBLE,
    draw: (P, _k, t) => corrediza(P, t, 150, 220, (220 - 2 * F) * 0.47),
  },
  plegadiza: {
    /* cuatro hojas que se pliegan en zigzag hacia afuera y se apilan contra la
       jamba derecha. Los puntos pares de la cadena quedan sobre el riel y los
       impares en los vértices, alejados del ojo. Se dibujan de la más lejana
       (pegada a la jamba) a la más cercana. Manijas en los dos parantes que se
       agarran: el libre de la hoja de punta y el del encuentro entre pares. */
    W: 300, H: 220, fit: 1,
    draw: (P, k) => {
      const n = 4, p = (300 - 2 * F) / n, h = 220 - 2 * F, a = rad(74) * k, hv = h * 0.47 + 10;
      const pnt = (m: number): V3 => [300 - F - m * p * Math.cos(a), F, m % 2 ? -p * Math.sin(a) : 0];
      const panels = [];
      for (let i = 0; i < n; i++) {
        const from = pnt(i), U = norm(add(pnt(i + 1), from, -1));
        panels.push(<Sash key={i} P={P} o={from} U={U} V={Y} w={p} h={h} />);
        if (i === 1 || i === 3) panels.push(<Handle key={`h${i}`} P={P} base={at(from, U, Y, p - 4, hv)} U={U} V={Y} dir={neg(Y)} len={20} />);
      }
      return { lights: [[F, F, 300 - 2 * F, h]], back: <g>{panels}</g> };
    },
  },
  piel: {
    /* retícula de fachada, todos los paños fijos; el reflejo de sol cruza el del medio */
    W: 240, H: 240, fit: 1, ms: 5600,
    draw: (P, _k, t) => {
      const c = (240 - 4 * F) / 3;
      const lights: Lights = [];
      for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) lights.push([F + q * (c + F), F + r * (c + F), c, c]);
      const [mx, my] = lights[4];
      return {
        lights,
        back: (
          <g>
            {lights.map(([x, y, w, h], i) => <Glass key={i} P={P} x={x} y={y} w={w} h={h} />)}
            <Glare P={P} x={mx} y={my} w={c} h={c} u={sweep(t, 0.1, 0.9)} />
          </g>
        ),
      };
    },
  },
};

export function Iso({ kind }: { kind: Kind }) {
  const spec = SPECS[kind];
  const t = useCycle(spec.ms ?? 4400);
  /* Con movimiento reducido se muestra la posición abierta, quieta */
  const k = t < 0 ? 0.85 : pulse(t, 0.12, 0.46, 0.62, 0.96);
  const P = makeView(spec.W, spec.H, spec.fit);
  const { back, front, lights } = spec.draw(P, k, t);
  return (
    <svg viewBox="0 0 360 300" className="iso" role="img" aria-label={`Esquema isométrico del movimiento: ${kind}`}>
      {back}
      <Frame P={P} W={spec.W} H={spec.H} lights={lights} />
      {front}
    </svg>
  );
}
