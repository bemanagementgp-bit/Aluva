/* Bloques que se repiten entre páginas (componentes de servidor). */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Icon, WA } from "./Icon";
import { waLink, type Pilar } from "@/content/site";

/** Une líneas de un título con <br> (["Más luz.", "Más vista."]). */
export const Lines = ({ lines }: { lines: string[] }) => (
  <>{lines.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)}</>
);

export const Eyebrow = ({ n, children }: { n: string; children: ReactNode }) => (
  <div className="eyebrow"><span className="n">{n}</span>{children}</div>
);

/** Clase de sección: las páginas alternan verde oscuro y blanco (light). */
export const sec = (base: string, light: boolean) => (light ? `${base} section--paper` : base);

export function Cta({ title = "¿Tenés una obra?", text = "Medición, fabricación e instalación.", light = false }: { title?: string; text?: string; light?: boolean }) {
  return (
    <section className={sec("section--tight", light)}>
      <div className="wrap">
        <div className="cta rv">
          <img className="cta__icon" src="/brand/icon-negro.svg" alt="" aria-hidden="true" />
          <h2 className="h-xl">{title}</h2>
          <div>
            <p>{text}</p>
            <div className="btn-row">
              <Link className="btn btn--lime" href="/contacto">Pedí tu presupuesto <span className="arr">→</span></Link>
              <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noopener"><WA /> WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pillars({ items }: { items: Pilar[] }) {
  return (
    <div className="pillars">
      {items.map(([ic, t, d, img], i) => (
        <div key={t} className={`pillar${img ? " pillar--img" : ""} rv rv-d${i % 4}`}>
          {img && <img className="pillar__bg" src={img} alt="" loading="lazy" />}
          <Icon name={ic} />
          <h3>{t}</h3>
          <p>{d}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ n, items, light }: { n: string; items: [string, string][]; light: boolean }) {
  return (
    <section className={sec("section", light)}>
      <div className="wrap split" style={{ alignItems: "start" }}>
        <div><Eyebrow n={n}>Preguntas frecuentes</Eyebrow><h2 className="h-lg rv">Consultas<br />frecuentes.</h2></div>
        <div className="faq">
          {items.map(([q, a]) => (
            <details key={q}><summary>{q}<i /></summary><p>{a}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Profesionales() {
  return (
    <section className="pro" id="profesionales">
      <img className="pro-perfil" src="/photos/pvc-despiece-lineas.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="pro-in">
        <p className="pro-volanta">Arquitectos · Estudios · Constructoras</p>
        <span className="pro-palabra" aria-hidden="true">Profesionales</span>
        <span className="pro-regla" aria-hidden="true" />
        <h2 className="pro-bajada">Producción al ritmo <strong>de tu obra.</strong></h2>
        <div className="pro-acciones">
          <a className="pro-btn" href="mailto:ventas@aluva.com.ar?subject=Consulta%20profesional">Escribir a ventas<span className="pro-flecha">→</span></a>
          <a className="pro-link" href="https://wa.me/5492216755077" target="_blank" rel="noopener noreferrer">WhatsApp +54 9 221 675-5077</a>
        </div>
      </div>
    </section>
  );
}
