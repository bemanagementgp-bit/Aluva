"use client";
/* Componentes con interacción: galería arrastrable, vitrinas, tipologías, componentes del sistema y configurador DVH. */
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Arrow, ArrowL } from "./Icon";
import { Eyebrow, sec } from "./blocks";
import type { FotoGaleria, Linea } from "@/content/site";

const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(matchMedia("(hover: hover) and (pointer: fine)").matches), []);
  return fine;
};

/* ---------- Galería arrastrable ---------- */
/*
  El carrusel gira sin fin. No hay forma de lograrlo con una sola tanda de
  fotos: el scroll nativo termina donde termina el contenido. Así que se
  dibujan tres tandas seguidas, se arranca parado en la del medio, y cada vez
  que el scroll se aleja del centro se lo corre una tanda entera para el otro
  lado. El salto es una asignación directa, sin animación, y cae justo sobre la
  foto gemela: para el que mira no pasó nada, pero siempre quedan fotos de
  sobra a los dos lados.

  Dos cuidados, cada uno de un problema real:

  - El arrastre guarda de dónde partió el scroll al apoyar el dedo. Si se gira
    en medio del arrastre hay que correr ese punto de partida lo mismo que el
    scroll, o la foto pega un salto bajo el dedo.

  - Las flechas animan hacia una posición absoluta. Girar con esa animación en
    curso deja el destino viejo y la animación se vuelve para atrás. Por eso se
    recentra ANTES de animar y se deja de girar mientras dura.

  Si una tanda entera entrara en pantalla no habría nada que girar, y además se
  verían las copias al lado de los originales. En ese caso se dibuja una sola
  tanda y el carrusel queda como antes.
*/
export function DragGallery({ n, title, items, light }: { n: string; title: string; items: FotoGaleria[]; light: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [gira, setGira] = useState(true);
  const st = useRef({ down: false, sx: 0, sl: 0, moved: false });
  const paso = useRef(0);       // ancho de una tanda; 0 = sin giro
  const animando = useRef(0);   // temporizador de la animación de las flechas
  const girarRef = useRef<() => void>(() => {});

  const tandas = gira ? 3 : 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const medir = (inicial: boolean) => {
      const h = el.children;
      if (h.length < items.length * 2) { paso.current = 0; return; }
      const p = (h[items.length] as HTMLElement).offsetLeft - (h[0] as HTMLElement).offsetLeft;
      if (p <= el.clientWidth) { paso.current = 0; setGira(false); return; }
      paso.current = p;
      // dejarlo siempre dentro de la tanda del medio, en [p, 2p)
      el.scrollLeft = inicial ? p : ((el.scrollLeft % p) + p) % p + p;
    };

    const girar = () => {
      const p = paso.current;
      if (!p || animando.current) return;
      const x = el.scrollLeft;
      // margen cómodo: media tanda a la izquierda, una entera a la derecha.
      // Mientras esté ahí no se toca nada, para no pelearle al scroll-snap.
      if (x >= p * 0.5 && x < p * 2) return;
      // Se normaliza de una, no restando una tanda: con un envión fuerte el
      // scroll puede quedar a varias tandas y restando de a una haría falta un
      // evento por tanda para volver.
      const dentro = ((x % p) + p) % p + p; // siempre cae en [p, 2p)
      st.current.sl += dentro - x;
      el.scrollLeft = dentro;
    };
    girarRef.current = girar;

    const move = (e: PointerEvent) => {
      const s = st.current; if (!s.down) return;
      const d = e.clientX - s.sx;
      if (Math.abs(d) > 4) { s.moved = true; setDragging(true); }
      el.scrollLeft = s.sl - d;
      girar();
    };
    const up = () => { if (st.current.down) { st.current.down = false; setDragging(false); } };

    medir(true);
    const ro = new ResizeObserver(() => medir(false));
    ro.observe(el);
    el.addEventListener("scroll", girar, { passive: true });
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", girar);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      clearTimeout(animando.current);
    };
  }, [items, gira]);

  const step = (dir: number) => {
    const el = ref.current!;
    const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 400;
    const p = paso.current;
    if (p) {
      // recentrar primero: así un paso nunca se sale de las tres tandas y la
      // animación no necesita que giremos abajo suyo
      const dentro = ((el.scrollLeft % p) + p) % p + p;
      if (Math.abs(dentro - el.scrollLeft) > 1) el.scrollLeft = dentro;
      clearTimeout(animando.current);
      animando.current = window.setTimeout(() => { animando.current = 0; girarRef.current(); }, 600);
    }
    el.scrollBy({ left: dir * (w + 18), behavior: "smooth" });
  };

  return (
    <section className={sec("section", light)} style={{ paddingBottom: 0 }}>
      <div className="wrap drag-hint">
        <div><Eyebrow n={n}>Ambientes</Eyebrow><h2 className="h-lg rv">{title}</h2></div>
        <div className="drag-nav">
          <button type="button" aria-label="Anterior" onClick={() => step(-1)}><ArrowL /></button>
          <button type="button" aria-label="Siguiente" onClick={() => step(1)}><Arrow /></button>
        </div>
      </div>
      <div
        ref={ref}
        className={`drag${dragging ? " is-dragging" : ""}`}
        style={{ paddingBottom: 80 }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") return; st.current = { down: true, sx: e.clientX, sl: ref.current!.scrollLeft, moved: false }; }}
        onClickCapture={(e) => { if (st.current.moved) e.preventDefault(); }}
      >
        {Array.from({ length: tandas }, (_, t) =>
          items.map(([src, alt, tall], i) => (
            // las copias no se leen: para un lector de pantalla la galería
            // tiene las fotos que dice tener, una sola vez
            <figure key={`${t}-${i}`} className={tall ? "tall" : ""} aria-hidden={t > 0 || undefined}>
              <img src={src} alt={t === 0 ? alt : ""} loading="lazy" />
              <figcaption>{alt}</figcaption>
            </figure>
          )),
        )}
      </div>
    </section>
  );
}

/* ---------- Vitrinas (acordeón de Nuestras aberturas) ---------- */
export function Vitrinas({ lineas }: { lineas: Linea[] }) {
  const [act, setAct] = useState(0);
  const fine = useFinePointer();
  return (
    <div className="vitrinas">
      {lineas.map((l, i) => (
        <Link
          key={l.slug}
          className={`vit${i === act ? " is-active" : ""}`}
          href={`/${l.slug}`}
          aria-expanded={i === act}
          onMouseEnter={() => fine && setAct(i)}
          onFocus={() => setAct(i)}
          onClick={(e) => { if (i !== act) { e.preventDefault(); setAct(i); } }}
        >
          <img src={l.vit} alt={`Aberturas de ${l.name}`} />
          <span className="vit__n">0{i + 1} / 04</span>
          <span className="vit__label">{l.name}</span>
          <div className="vit__body">
            <h3>{l.name}</h3><p>{l.short}</p>
            <div className="vit__chips">{l.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <span className="btn btn--lime">Explorar línea <span className="arr">→</span></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------- Tipologías: diagrama animado de cada forma de apertura ---------- */
type Tipo = { name: string; img: string; mats: string[]; txt: string; svg: ReactNode };

const Frame = ({ w = 300, h = 300 }: { w?: number; h?: number }) => <rect className="dg-frame" x={0} y={0} width={w} height={h} rx={4} />;
const Sash = ({ x, y, w, h, cls = "" }: { x: number; y: number; w: number; h: number; cls?: string }) => (
  <g className={cls}><rect className="dg-sash" x={x} y={y} width={w} height={h} rx={3} /><rect className="dg-glass" x={x + 12} y={y + 12} width={w - 24} height={h - 24} /></g>
);
const Hinge = ({ cx, cy }: { cx: number; cy: number }) => <circle className="dg-hinge" cx={cx} cy={cy} r={5} />;

const TIPOS: Record<string, Tipo> = {
  corrediza: {
    name: "Corrediza", img: "/photos/tipo-corrediza.webp", mats: ["PVC", "Aluminio", "Vidriería"],
    txt: "Las hojas se deslizan sobre rieles, sin ocupar espacio hacia adentro ni hacia afuera. Ideal para balcones, livings y lugares donde el espacio cuenta.",
    svg: <svg viewBox="-10 -10 320 320"><Frame /><Sash x={8} y={8} w={142} h={284} /><Sash x={150} y={8} w={142} h={284} cls="anim-slide" /></svg>,
  },
  batiente: {
    name: "Batiente", img: "/photos/tipo-batiente.webp", mats: ["PVC", "Aluminio", "Vidriería"],
    txt: "Abre girando sobre bisagras laterales, como una puerta. Da ventilación total y el mejor cierre hermético: la opción más eficiente en aislación.",
    svg: <svg viewBox="-10 -10 320 320"><Frame /><Sash x={8} y={8} w={142} h={284} cls="anim-swing" /><Sash x={150} y={8} w={142} h={284} cls="anim-swing swing-r" /><Hinge cx={8} cy={60} /><Hinge cx={8} cy={240} /><Hinge cx={292} cy={60} /><Hinge cx={292} cy={240} /></svg>,
  },
  oscilobatiente: {
    name: "Oscilobatiente", img: "/photos/tipo-oscilobatiente.webp", mats: ["PVC", "Aluminio"],
    txt: "Dos movimientos en un mismo manijón: se inclina desde arriba para ventilar con seguridad, o abre como batiente para limpiar y ventilar a fondo.",
    svg: <svg viewBox="-10 -10 320 320"><Frame /><Sash x={8} y={8} w={284} h={284} cls="anim-oscilo" /><rect x={268} y={130} width={8} height={40} rx={3} fill="#eef6e8" /></svg>,
  },
  banderola: {
    name: "Banderola", img: "/photos/tipo-banderola.webp", mats: ["Aluminio"],
    txt: "Ventana que se proyecta desde arriba. Ventila aún con lluvia; perfecta en baños, cocinas y sobre puertas.",
    svg: <svg viewBox="-10 -10 320 180"><Frame w={300} h={160} /><Sash x={8} y={8} w={284} h={144} cls="anim-tilt" /><Hinge cx={60} cy={152} /><Hinge cx={240} cy={152} /></svg>,
  },
  fijo: {
    name: "Paño fijo", img: "/photos/tipo-fijo.webp", mats: ["PVC", "Templados", "Aluminio", "Vidriería"],
    txt: "Grandes superficies de vidrio sin hojas móviles. Máxima luz, vistas limpias y la mejor relación aislación / costo.",
    svg: <svg viewBox="-10 -10 320 320"><defs><clipPath id="cf"><rect x={20} y={20} width={260} height={260} /></clipPath></defs><Frame /><Sash x={8} y={8} w={284} h={284} /><g clipPath="url(#cf)"><rect className="anim-glint" x={20} y={-40} width={60} height={400} fill="rgba(238,246,232,.22)" /></g></svg>,
  },
  puerta: {
    name: "Puerta", img: "/photos/tipo-puerta.webp", mats: ["PVC", "Templados"],
    txt: "Puertas de PVC con cierre multipunto, y puertas de vidrio templado para locales y oficinas.",
    svg: <svg viewBox="-10 -10 200 320"><Frame w={180} h={300} /><g className="anim-swing"><rect className="dg-sash" x={8} y={8} width={164} height={292} rx={3} /><rect className="dg-glass" x={28} y={28} width={124} height={120} /><rect x={140} y={160} width={8} height={46} rx={3} fill="#eef6e8" /></g></svg>,
  },
  balcon: {
    name: "Puerta balcón", img: "/photos/tipo-puerta-balcon.webp", mats: ["PVC", "Aluminio"],
    txt: "Puertas vidriadas de dos hojas que conectan interior y exterior. Batientes u oscilobatientes, con umbral bajo.",
    svg: <svg viewBox="-10 -10 320 320"><Frame /><Sash x={8} y={8} w={142} h={284} cls="anim-swing" /><Sash x={150} y={8} w={142} h={284} cls="anim-swing swing-r" /><line x1={150} y1={8} x2={150} y2={292} stroke="#c6f29c" strokeWidth={2} /></svg>,
  },
  frente: {
    name: "Frente vidriado", img: "/photos/tipo-frente.webp", mats: ["Templados"],
    txt: "Frentes comerciales y vidrieras de locales en vidrio templado, con puertas de acceso integradas.",
    svg: <svg viewBox="-10 -10 340 240"><Frame w={320} h={220} /><Sash x={8} y={8} w={100} h={204} /><Sash x={110} y={8} w={100} h={204} cls="anim-swing" /><Sash x={212} y={8} w={100} h={204} /></svg>,
  },
  piel: {
    name: "Piel de vidrio", img: "/photos/tipo-piel.webp", mats: ["Templados"],
    txt: "Fachadas continuas de vidrio para frentes completos de locales, edificios y oficinas.",
    svg: (
      <svg viewBox="-10 -10 320 320">
        <defs><clipPath id="cp"><rect x={0} y={0} width={300} height={300} /></clipPath></defs>
        {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} className="dg-sash" x={c * 100 + 4} y={r * 100 + 4} width={92} height={92} rx={2} style={{ opacity: 0.55 + ((r + c) % 3) * 0.2 }} />
        )))}
        <g clipPath="url(#cp)"><rect className="anim-glint" x={0} y={-60} width={70} height={420} fill="rgba(238,246,232,.18)" /></g>
      </svg>
    ),
  },
};

const MATERIALES = ["PVC", "Templados", "Aluminio", "Vidriería"];

export function Tipologias() {
  const keys = Object.keys(TIPOS);
  const [k, setK] = useState("corrediza");
  const [img, setImg] = useState(TIPOS.corrediza.img);
  const [visible, setVisible] = useState(true);
  const t = TIPOS[k];

  // La foto cambia recién cuando la nueva terminó de cargar
  useEffect(() => {
    if (t.img === img) return;
    setVisible(false);
    const im = new Image();
    im.src = t.img;
    im.onload = () => { setImg(t.img); setVisible(true); };
  }, [t.img, img]);

  return (
    <div className="tipo">
      <div className="tipo__list" role="tablist" aria-label="Tipologías">
        {keys.map((key, i) => (
          <button key={key} type="button" role="tab" aria-selected={key === k} className={key === k ? "is-active" : ""} onClick={() => setK(key)}>
            {TIPOS[key].name}<span>0{i + 1}</span>
          </button>
        ))}
      </div>
      <div className="tipo__stage">
        <div className="tipo__diagram"><span className="dg-hint">Movimiento</span>{t.svg}<span className="dg-name">{t.name}</span></div>
        <div className="tipo__photo"><img src={img} alt={`Abertura ${t.name.toLowerCase()}`} style={{ opacity: visible ? 1 : 0 }} /></div>
        <div className="tipo__info">
          <p>{t.txt}</p>
          <div className="mat">
            {MATERIALES.map((m) => <span key={m} className={`chip ${t.mats.includes(m) ? "is-on" : "is-off"}`}>{m}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Componentes de la ventana de PVC (puntos para tocar) ----------

   Quedaron cuatro. El cliente sacó tres en la revisión del 2026-10-06:

   - "Zócalo con drenaje": el drenaje no es una pieza aparte, así que pasó a la
     descripción del marco, que es donde están las cámaras y los refuerzos.
   - "Alféizar": es obra, no parte de la ventana de PVC.
   - "Perfil de acople": tampoco pertenece al sistema.

   Los puntos del dibujo se numeran por posición en esta lista, así que sacar
   una entrada saca su punto y renumera el resto solo: no hay que tocar nada más.
*/
const PIEZAS: [number, number, string, string][] = [
  [50, 6, "Marco multicámara", "Perfil de PVC con cámaras de aire internas de aislación térmica y acústica, refuerzos galvanizados y drenajes."],
  [13, 58, "Hoja", "Perfil de PVC con cámaras de aire internas de aislación térmica y acústica y refuerzos galvanizados. Soldada a inglete en sus cuatro esquinas para un cierre estanco."],
  [25, 38, "DVH", "Dos o más hojas de vidrio con cámara de aire seco. Mayor aislación térmica y acústica."],
  [37, 27, "Burletes perimetrales", "Juntas de goma que sellan contra agua, viento y polvo."],
];

export function Anatomia() {
  const [act, setAct] = useState(0);
  const fine = useFinePointer();
  return (
    <div className="anat">
      <div className="anat__img rv">
        <img src="/photos/pvc-despiece-sistema.webp" alt="Despiece de una ventana de PVC con doble vidriado hermético" loading="lazy" />
        {PIEZAS.map(([x, y, t], i) => (
          <button key={t} type="button" className={`hs${i === act ? " is-active" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} aria-label={t}
            onClick={() => setAct(i)} onMouseEnter={() => fine && setAct(i)}>{i + 1}</button>
        ))}
      </div>
      <ol className="anat__list">
        {PIEZAS.map(([, , t, d], i) => (
          <li key={t} className={i === act ? "is-active" : ""} onClick={() => setAct(i)}><b>{t}</b><span>{d}</span></li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Configurador DVH: dibuja el corte según vidrios y cámara ---------- */
type Vidrio = { t: number; lam: boolean; n: string };
const VIDRIOS: Record<string, Vidrio> = { simple: { t: 4, lam: false, n: "Float 4 mm" }, lam: { t: 6, lam: true, n: "Laminado 3+3" } };

function Opts({ value, items, onChange }: { value: string; items: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="opts">
      {items.map(([v, t]) => <button key={v} type="button" className="opt" aria-pressed={v === value} onClick={() => onChange(v)}>{t}</button>)}
    </div>
  );
}

export function DvhConfigurator() {
  const [ext, setExt] = useState("simple");
  const [cam, setCam] = useState("9");
  const [int, setInt] = useState("simple");
  const e = VIDRIOS[ext], i = VIDRIOS[int], c = Number(cam);
  const S = 10, H = 300, y0 = 40;
  const tot = e.t + c + i.t;
  const x0 = 210 - (tot * S) / 2, xc = x0 + e.t * S, cw = c * S, xr = xc + cw + i.t * S;
  const font = "LG EI Text, sans-serif";
  const Pane = ({ x, g }: { x: number; g: Vidrio }) => (
    <>
      <rect className="dvh-layer" x={x} y={y0} width={g.t * S} height={H} fill="rgba(198,242,156,.38)" stroke="#c6f29c" strokeWidth={1.5} />
      {g.lam && <rect className="dvh-layer" x={x + (g.t * S) / 2 - 2} y={y0} width={4} height={H} fill="#5ac80f" />}
    </>
  );
  const Lbl = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
    <text x={x} y={y} fill="#a3bca9" fontSize={13} textAnchor="middle" fontFamily={font}>{children}</text>
  );
  const glass: [string, string][] = [["simple", "Float 4 mm"], ["lam", "Laminado 3+3"]];

  return (
    <div className="dvh">
      <div className="dvh__viz">
        <svg viewBox="0 0 560 400" role="img" aria-label="Corte de un doble vidriado hermético">
          <text x={20} y={22} fill="#c6f29c" fontSize={12} letterSpacing={2} fontFamily={font}>EXTERIOR</text>
          <text x={540} y={22} fill="#c6f29c" fontSize={12} letterSpacing={2} textAnchor="end" fontFamily={font}>INTERIOR</text>
          <Pane x={x0} g={e} />
          <rect className="dvh-layer" x={xc} y={y0 + 30} width={cw} height={H - 60} fill="rgba(90,200,15,.06)" />
          <rect className="dvh-layer" x={xc} y={y0 + H - 34} width={cw} height={30} fill="#5d6b62" rx={2} />
          <rect className="dvh-layer" x={xc} y={y0 + 4} width={cw} height={30} fill="#5d6b62" rx={2} />
          <rect className="dvh-layer" x={xc - 2} y={y0 + H - 4} width={cw + 4} height={14} fill="#1f2b24" rx={2} />
          <rect className="dvh-layer" x={xc - 2} y={y0 - 10} width={cw + 4} height={14} fill="#1f2b24" rx={2} />
          {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={xc + 6 + (k * (cw - 12)) / 5} cy={y0 + 19} r={2} fill="#c6f29c" opacity={0.7} />)}
          <Pane x={xc + cw} g={i} />
          <Lbl x={x0 + (e.t * S) / 2} y={y0 + H + 42}>{e.t} mm</Lbl>
          <Lbl x={xc + cw / 2} y={y0 + H + 42}>{c} mm</Lbl>
          <Lbl x={xc + cw + (i.t * S) / 2} y={y0 + H + 42}>{i.t} mm</Lbl>
          <Lbl x={xc + cw / 2} y={y0 + H / 2 + 5}>cámara</Lbl>
          <path d={`M${xr + 16} ${y0 + 20} h40`} stroke="#5ac80f" strokeWidth={1} />
          <text x={xr + 60} y={y0 + 24} fill="#eef6e8" fontSize={12} fontFamily={font}>separador + desecante</text>
          <path d={`M${xr + 16} ${y0 + H + 2} h40`} stroke="#5ac80f" strokeWidth={1} />
          <text x={xr + 60} y={y0 + H + 6} fill="#eef6e8" fontSize={12} fontFamily={font}>sellado perimetral</text>
        </svg>
        <div className="dvh__read">
          <div><small>Espesor total</small><b>{tot} mm</b></div>
          <small style={{ textAlign: "right", maxWidth: "24ch" }}>{`${e.n} + cámara ${c} mm + ${i.n}`}</small>
        </div>
      </div>
      <div className="dvh__ctrl">
        <div className="q"><h3><span>01</span>Vidrio exterior</h3><Opts value={ext} items={glass} onChange={setExt} /></div>
        <div className="q"><h3><span>02</span>Cámara de aire</h3><Opts value={cam} items={[["9", "9 mm"], ["12", "12 mm"]]} onChange={setCam} /></div>
        <div className="q"><h3><span>03</span>Vidrio interior</h3><Opts value={int} items={glass} onChange={setInt} /></div>
      </div>
    </div>
  );
}
