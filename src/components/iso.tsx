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
   angosta, plegadiza larga. No están a medida, pero sí en proporción. */
import { useEffect, useState, type ReactNode } from "react";

type V3 = [number, number, number];
type Kind = "fijo" | "rebatible" | "banderola" | "proyectante" | "oscilobatiente" | "desplazable" | "puerta" | "corrediza" | "patagonica" | "monoriel" | "balcon" | "plegadiza" | "piel";

/* ---------- cámara ---------- */
const norm = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

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
function Frame({ P, W, H, f, lights }: { P: Proj; W: number; H: number; f: number; lights: [number, number, number, number][] }) {
  const outer = quad([0, 0, 0], [1, 0, 0], [0, 1, 0], W, H);
  const holes = lights.map(([x, y, w, h]) => quad([x, y, 0], [1, 0, 0], [0, 1, 0], w, h));
  return <path className="iso-frame" fillRule="evenodd" d={ring(P, [outer, ...holes])} />;
}
/* Hoja: perfil (anillo) + vidrio, en cualquier posición del espacio */
function Sash({ P, o, U, V, w, h, b = 6, fixed = false }: { P: Proj; o: V3; U: V3; V: V3; w: number; h: number; b?: number; fixed?: boolean }) {
  const out = quad(o, U, V, w, h), inn = quad(o, U, V, w, h, b);
  return (
    <g>
      <path className="iso-glass" d={ring(P, [inn])} />
      {!fixed && <path className="iso-sash" fillRule="evenodd" d={ring(P, [out, inn])} />}
    </g>
  );
}
/* Vidrio fijo dentro de una luz del marco (paño fijo, lado fijo de patagónica y monoriel) */
const Glass = ({ P, x, y, w, h }: { P: Proj; x: number; y: number; w: number; h: number }) => <path className="iso-glass" d={ring(P, [quad([x, y, 0], [1, 0, 0], [0, 1, 0], w, h)])} />;

/* ---------- tiempo ---------- */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/* 0 en [0,a], sube hasta 1 en [a,b], se queda en 1 hasta c, baja a 0 en [c,d] */
const pulse = (t: number, a: number, b: number, c: number, d: number) => (t < a ? 0 : t < b ? ease((t - a) / (b - a)) : t < c ? 1 : t < d ? 1 - ease((t - c) / (d - c)) : 0);

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

type Spec = { W: number; H: number; fit: number; ms?: number; draw: (P: Proj, k: number, t: number) => { back?: ReactNode; front?: ReactNode; lights: [number, number, number, number][]; } };
const F = 7; /* ancho del perfil de marco */
const S = 9; /* separación entre carriles de una corrediza */

const SPECS: Record<Kind, Spec> = {
  fijo: {
    W: 100, H: 120, fit: 0.86,
    draw: (P, _k, _t) => ({ lights: [[F, F, 100 - 2 * F, 120 - 2 * F]], back: <Glass P={P} x={F} y={F} w={100 - 2 * F} h={120 - 2 * F} /> }),
  },
  rebatible: {
    /* bisagras a la izquierda, abre hacia adentro: viene hacia el ojo, delante del marco */
    W: 100, H: 120, fit: 0.86,
    draw: (P, k) => ({ lights: [[F, F, 100 - 2 * F, 120 - 2 * F]], front: <Sash P={P} o={[F, F, 0]} U={turn(1, rad(58) * k, true)} V={Y} w={100 - 2 * F} h={120 - 2 * F} /> }),
  },
  banderola: {
    /* bisagras abajo, la parte de arriba entra hacia adentro */
    W: 120, H: 80, fit: 0.86,
    draw: (P, k) => ({ lights: [[F, F, 120 - 2 * F, 80 - 2 * F]], front: <Sash P={P} o={[F, F, 0]} U={X} V={tilt(1, rad(34) * k, true)} w={120 - 2 * F} h={80 - 2 * F} /> }),
  },
  proyectante: {
    /* bisagras arriba, la parte de abajo sale hacia afuera: se aleja, detrás del marco */
    W: 120, H: 80, fit: 0.86,
    draw: (P, k) => ({ lights: [[F, F, 120 - 2 * F, 80 - 2 * F]], back: <Sash P={P} o={[F, 80 - F, 0]} U={X} V={tilt(-1, rad(40) * k, false)} w={120 - 2 * F} h={80 - 2 * F} /> }),
  },
  oscilobatiente: {
    /* primero vuelca (eje abajo), después abre (bisagras a la izquierda); siempre hacia adentro */
    W: 90, H: 130, fit: 0.86, ms: 7000,
    draw: (P, _k, t) => {
      const v = t < 0 ? 1 : pulse(t, 0.06, 0.22, 0.34, 0.48), b = t < 0 ? 0 : pulse(t, 0.54, 0.7, 0.82, 0.96);
      return { lights: [[F, F, 90 - 2 * F, 130 - 2 * F]], front: <Sash P={P} o={[F, F, 0]} U={turn(1, rad(55) * b, true)} V={tilt(1, rad(30) * v, true)} w={90 - 2 * F} h={130 - 2 * F} /> };
    },
  },
  desplazable: {
    /* la hoja sale paralela hacia afuera, sostenida por los brazos tijera en las esquinas */
    W: 120, H: 80, fit: 0.86,
    draw: (P, k) => {
      const d = -30 * k, w = 120 - 2 * F, h = 80 - 2 * F;
      const corners: V3[] = [[F, F, 0], [F + w, F, 0], [F + w, F + h, 0], [F, F + h, 0]];
      return {
        lights: [[F, F, w, h]],
        back: (
          <g>
            <Sash P={P} o={[F, F, d]} U={X} V={Y} w={w} h={h} />
            {corners.map((c, i) => <line key={i} className="iso-arm" x1={P(c)[0]} y1={P(c)[1]} x2={P(add(c, [0, 0, 1], d))[0]} y2={P(add(c, [0, 0, 1], d))[1]} />)}
          </g>
        ),
      };
    },
  },
  puerta: {
    /* bisagras a la izquierda, abre hacia adentro, con manija del lado libre */
    W: 90, H: 210, fit: 0.9,
    draw: (P, k) => {
      const U = turn(1, rad(62) * k, true), w = 90 - 2 * F, h = 210 - 2 * F;
      const hA = add(add([F, F, 0], U, w - 14), Y, 92), hB = add(hA, Y, 22);
      return { lights: [[F, F, w, h]], front: <g><Sash P={P} o={[F, F, 0]} U={U} V={Y} w={w} h={h} /><line className="iso-handle" x1={P(hA)[0]} y1={P(hA)[1]} x2={P(hB)[0]} y2={P(hB)[1]} /></g> };
    },
  },
  corrediza: {
    /* dos hojas en dos carriles: la de adelante corre sobre la de atrás */
    W: 150, H: 120, fit: 0.9,
    draw: (P, k) => {
      const w = (150 - 2 * F) / 2 + 4, h = 120 - 2 * F, d = (w - 8) * 0.9 * k;
      return { lights: [[F, F, 150 - 2 * F, h]], front: <g><Sash P={P} o={[F, F, 0]} U={X} V={Y} w={w} h={h} /><Sash P={P} o={[150 - F - w - d, F, S]} U={X} V={Y} w={w} h={h} /></g> };
    },
  },
  patagonica: {
    /* hoja rebatible a la izquierda (abre adentro), paño fijo a la derecha */
    W: 120, H: 170, fit: 0.86,
    draw: (P, k) => {
      const w = (120 - 3 * F) / 2, h = 170 - 2 * F;
      return { lights: [[F, F, w, h], [2 * F + w, F, w, h]], back: <Glass P={P} x={2 * F + w} y={F} w={w} h={h} />, front: <Sash P={P} o={[F, F, 0]} U={turn(1, rad(58) * k, true)} V={Y} w={w} h={h} /> };
    },
  },
  monoriel: {
    /* paño fijo a la izquierda; la hoja corre por un solo riel, por delante del fijo */
    W: 150, H: 220, fit: 0.95,
    draw: (P, k) => {
      const w = (150 - 3 * F) / 2, h = 220 - 2 * F, d = (w + F) * 0.9 * k;
      return { lights: [[F, F, w, h], [2 * F + w, F, w, h]], back: <Glass P={P} x={F} y={F} w={w} h={h} />, front: <Sash P={P} o={[2 * F + w - d, F, S]} U={X} V={Y} w={w} h={h} /> };
    },
  },
  balcon: {
    /* igual que la corrediza pero con alto de puerta */
    W: 150, H: 220, fit: 0.95,
    draw: (P, k) => {
      const w = (150 - 2 * F) / 2 + 4, h = 220 - 2 * F, d = (w - 8) * 0.9 * k;
      return { lights: [[F, F, 150 - 2 * F, h]], front: <g><Sash P={P} o={[F, F, 0]} U={X} V={Y} w={w} h={h} /><Sash P={P} o={[150 - F - w - d, F, S]} U={X} V={Y} w={w} h={h} /></g> };
    },
  },
  plegadiza: {
    /* cuatro hojas que se pliegan en zigzag hacia afuera y se apilan contra la
       jamba derecha. Los puntos pares de la cadena quedan sobre el riel y los
       impares en los vértices, alejados del ojo. Se dibujan de la más lejana
       (pegada a la jamba) a la más cercana. */
    W: 300, H: 220, fit: 1,
    draw: (P, k) => {
      const n = 4, p = (300 - 2 * F) / n, h = 220 - 2 * F, a = rad(74) * k;
      const pnt = (m: number): V3 => [300 - F - m * p * Math.cos(a), F, m % 2 ? -p * Math.sin(a) : 0];
      const panels = [];
      for (let i = 0; i < n; i++) {
        const from = pnt(i), U = norm(add(pnt(i + 1), from, -1));
        panels.push(<Sash key={i} P={P} o={from} U={U} V={Y} w={p} h={h} />);
      }
      return { lights: [[F, F, 300 - 2 * F, h]], back: <g>{panels}</g> };
    },
  },
  piel: {
    /* retícula de fachada; un paño del medio abre como proyectante, hacia afuera, para ventilar */
    W: 240, H: 240, fit: 1,
    draw: (P, k) => {
      const c = (240 - 4 * F) / 3;
      const lights: [number, number, number, number][] = [];
      for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) lights.push([F + q * (c + F), F + r * (c + F), c, c]);
      const ox = F + (c + F), oy = F + (c + F);
      return {
        lights,
        back: (
          <g>
            {lights.filter((_, i) => i !== 4).map(([x, y, w, h], i) => <Glass key={i} P={P} x={x} y={y} w={w} h={h} />)}
            <Sash P={P} o={[ox, oy + c, 0]} U={X} V={tilt(-1, rad(36) * k, false)} w={c} h={c} b={4} />
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
      <Frame P={P} W={spec.W} H={spec.H} f={F} lights={lights} />
      {front}
    </svg>
  );
}
