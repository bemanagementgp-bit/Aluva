import { useEffect, useRef, useState } from "react";
import FotoDiferida from "@/components/FotoDiferida";
import Reveal from "@/components/Reveal";
import { PRODUCTOS } from "@/content/catalogo";

/*
  Catálogo de productos.
  Split: izquierda la ficha del producto, derecha sus fotos.
  Al hacer scroll vertical las fotos se DESLIZAN HORIZONTALMENTE (3 por producto) y,
  al entrar en el primer plano de un producto nuevo, la ficha de la izquierda cambia.
  En mobile cada producto muestra su ficha y un carrusel horizontal deslizable con el dedo.
  Los datos y las fotos salen de content/catalogo.js.
*/
// Todas las fotos en una sola pista horizontal.
const SLIDES = PRODUCTOS.flatMap((p, pi) =>
  p.fotos.map((f, fi) => ({ ...f, pi, fi, producto: p.nombre }))
);
const TOTAL = SLIDES.length;
const PEEK = 92;              // ancho de cada foto, en % del viewport (deja ver la siguiente)
const SCROLL_POR_FOTO = 60;   // vh de scroll que consume cada foto
const BREAKPOINT = "(min-width: 981px)";
// Desplazamiento máximo de la pista, en % de su propio ancho: deja la última foto
// alineada con el borde derecho del marco.
const RECORRIDO = (1 - 100 / (TOTAL * PEEK)) * 100;

export default function ProductosSection({ onPresupuesto }) {
  const [desktop, setDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(BREAKPOINT).matches
  );
  const [activo, setActivo] = useState(0); // producto
  const [foto, setFoto] = useState(0);     // foto dentro del producto

  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia(BREAKPOINT);
    const onChange = (e) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // El scroll vertical dentro de la sección se traduce en desplazamiento horizontal.
  useEffect(() => {
    if (!desktop) return;

    const update = () => {
      rafRef.current = 0;
      const el = wrapRef.current;
      if (!el) return;

      const rango = el.offsetHeight - window.innerHeight;
      const avance = rango > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / rango)) : 0;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-avance * RECORRIDO}%, 0, 0)`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(0.02, avance)})`;
      }

      const idx = Math.round(avance * (TOTAL - 1)); // foto en primer plano
      setActivo(SLIDES[idx].pi);
      setFoto(SLIDES[idx].fi);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [desktop]);

  // Saltar a la primera foto de un producto.
  const irA = (pi) => {
    const el = wrapRef.current;
    if (!el) return;
    const rango = el.offsetHeight - window.innerHeight;
    const inicio = el.getBoundingClientRect().top + window.scrollY;
    const primera = SLIDES.findIndex((s) => s.pi === pi);
    const destino = primera / (TOTAL - 1);
    window.scrollTo({ top: inicio + rango * destino, behavior: "smooth" });
  };

  const cabecera = (
    <Reveal style={{ marginBottom: 48, maxWidth: 780 }}>
      <p className="eyebrow"><span className="eyebrow-num">03</span>Productos</p>
      <h2 className="font-display section-title" style={{ margin: "16px 0 18px" }}>
        Nuestra línea de productos
      </h2>
      <p className="section-lead" style={{ marginTop: 0 }}>
        Cada línea con su ficha técnica y sus tres fotos de obra. Bajá para recorrerlas.
      </p>
    </Reveal>
  );

  return (
    <section
      id="productos"
      data-testid="productos-section"
      style={{ background: "var(--aluva-paper)", borderTop: "1px solid var(--aluva-line)" }}
    >
      <div className="container" style={{ padding: "var(--section-y) var(--gutter) 0" }}>
        {cabecera}
      </div>

      {desktop ? (
        // ── Desktop: scroll vertical → deslizamiento horizontal ──
        <div
          ref={wrapRef}
          className="prod-scroll"
          style={{ height: `${TOTAL * SCROLL_POR_FOTO + 100}vh` }}
        >
          <div className="prod-stage">
            <div className="prod-inner">
              {/* Ficha del producto */}
              <div className="prod-left">
                <div className="prod-counter">
                  <span className="prod-counter-now">{String(activo + 1).padStart(2, "0")}</span>
                  <span className="prod-counter-sep">/</span>
                  <span>{String(PRODUCTOS.length).padStart(2, "0")}</span>
                </div>

                <div className="prod-panels">
                  {PRODUCTOS.map((p, i) => (
                    <article
                      key={p.id}
                      data-testid={`producto-panel-${p.id}`}
                      aria-hidden={i !== activo}
                      className={`prod-panel ${i === activo ? "is-active" : "is-out"}`}
                    >
                      <p className="prod-linea">{p.linea}</p>
                      <h3 className="font-display prod-title">{p.nombre}</h3>
                      <p className="prod-desc">{p.desc}</p>
                      <ul className="prod-specs">
                        {p.specs.map((s) => <li key={s} className="prod-spec">{s}</li>)}
                      </ul>
                      <div className="prod-actions">
                        <button onClick={() => onPresupuesto?.(p)} className="btn-primary">
                          Pedir presupuesto
                          <span className="arrow">→</span>
                        </button>
                        <a href="#simulador" className="btn-ghost">Probar en el simulador</a>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Foto activa dentro del producto */}
                <div className="prod-dots" aria-hidden="true">
                  {PRODUCTOS[activo].fotos.map((f, j) => (
                    <span key={f.src + j} className={`prod-dot ${j === foto ? "is-active" : ""}`} />
                  ))}
                  <span className="prod-dots-label">
                    Foto {foto + 1} de {PRODUCTOS[activo].fotos.length}
                  </span>
                </div>

                {/* Índice de productos */}
                <nav className="prod-nav" aria-label="Productos">
                  {PRODUCTOS.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => irA(i)}
                      aria-current={i === activo}
                      className={`prod-nav-item ${i === activo ? "is-active" : ""}`}
                    >
                      <span className="prod-nav-bar" />
                      {p.nombre}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Pista horizontal de fotos */}
              <div className="prod-viewport">
                <div
                  ref={trackRef}
                  className="prod-track"
                  style={{ width: `${TOTAL * PEEK}%` }}
                >
                  {SLIDES.map((s, i) => (
                    <figure
                      key={s.producto + s.src + i}
                      className="prod-slide"
                      data-testid={`producto-slide-${i}`}
                      style={{ flexBasis: `${100 / TOTAL}%` }}
                    >
                      <div className={`prod-slide-inner ${s.encuadre === "producto" ? "is-producto" : ""}`}>
                        <FotoDiferida src={s.src} alt={`${s.producto} — ${s.caption}`} />
                        <figcaption>
                          <span className="prod-shot-num">{String(s.fi + 1).padStart(2, "0")}</span>
                          {s.caption}
                        </figcaption>
                      </div>
                    </figure>
                  ))}
                </div>

                <div className="prod-progress" aria-hidden="true">
                  <span ref={barRef} className="prod-progress-bar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ── Mobile: ficha + carrusel horizontal deslizable ──
        <div className="prod-mobile" style={{ padding: "0 0 90px" }}>
          {PRODUCTOS.map((p, i) => (
            <div key={p.id} className="prod-m-item" data-testid={`producto-fotos-${p.id}`}>
              <div className="prod-m-head">
                <p className="prod-linea">{String(i + 1).padStart(2, "0")} · {p.linea}</p>
                <h3 className="font-display prod-title">{p.nombre}</h3>
                <p className="prod-desc">{p.desc}</p>
                <ul className="prod-specs">
                  {p.specs.map((s) => <li key={s} className="prod-spec">{s}</li>)}
                </ul>
              </div>

              <div className="prod-m-rail no-scrollbar">
                {p.fotos.map((f, j) => (
                  <figure key={f.src + j} className={`prod-m-slide ${f.encuadre === "producto" ? "is-producto" : ""}`}>
                    <FotoDiferida src={f.src} alt={`${p.nombre} — ${f.caption}`} />
                    <figcaption>
                      <span className="prod-shot-num">{String(j + 1).padStart(2, "0")}</span>
                      {f.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="prod-m-cta">
                <button onClick={() => onPresupuesto?.(p)} className="btn-primary">
                  Pedir presupuesto
                  <span className="arrow">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
