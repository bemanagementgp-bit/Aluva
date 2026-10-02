import Link from "next/link";
import Shell from "@/components/Shell";
import { Arrow } from "@/components/Icon";
import { Cta, Eyebrow, Pillars, Profesionales } from "@/components/blocks";
import { LINEAS, PROCESO } from "@/content/site";

const OBRAS = [
  { c: "b1", d: "", src: "/photos/local-aluva.jpg", alt: "Frente del local de Aluva en La Plata", t: "Nuestro local", sub: "Showroom · La Plata", pos: "50% 40%" },
  { c: "b2", d: " rv-d1", src: "/og/producto-pvc.jpg", alt: "Puerta corrediza de PVC símil madera hacia la pileta", t: "PVC", sub: "Corrediza símil madera" },
  { c: "b3", d: " rv-d2", src: "/og/producto-aluminio.jpg", alt: "Corrediza de aluminio de tres hojas hacia el balcón", t: "Aluminio", sub: "Corrediza de tres hojas" },
  { c: "b4", d: "", src: "/photos/det-blindex-1.webp", alt: "Puerta de vidrio templado con manijón", t: "Templados", sub: "Puerta de templado" },
  { c: "b5", d: " rv-d1", src: "/photos/mampara-ducha-negra.jpg", alt: "Mampara de ducha con perfil negro", t: "Mamparas", sub: "Perfil negro a medida" },
  { c: "b6", d: " rv-d2", src: "/og/producto-vidrieria.jpg", alt: "Cerramiento vidriado de balcón", t: "Vidriería", sub: "Cerramiento de balcón", pos: "right bottom" },
];

export default function Inicio() {
  return (
    <Shell active="inicio" lightFooter>
      <section className="hero">
        <div className="hero__media"><img src="/photos/portada-inicio.jpg" alt="Pared de ventanales con perfiles negros con vista a la ciudad" fetchPriority="high" /></div>
        <div className="hero__sash hero__sash--l" /><div className="hero__sash hero__sash--r" />
        <div className="wrap">
          <Eyebrow n="01">PVC · Aluminio · Vidrio · Templados</Eyebrow>
          <div className="hero__grid">
            <h1 className="hero__title"><span className="row"><span>Aberturas</span></span><span className="row">a medida</span></h1>
            <div className="hero__side">
              <p className="lead">Fábrica de aberturas de PVC y aluminio, vidriería y templados en La Plata.</p>
              <div className="btn-row">
                <Link className="btn btn--lime" href="/productos">Ver productos <span className="arr">→</span></Link>
                <Link className="btn btn--ghost" href="/contacto">Pedí presupuesto</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap">
          <Eyebrow n="02">Qué fabricamos</Eyebrow>
          <h2 className="h-lg rv">Cuatro líneas,<br />una fábrica.</h2>
          <div style={{ height: 8 }} />
          <div className="lines">
            {LINEAS.map((l, i) => (
              <Link key={l.slug} className="line-row rv" href={`/${l.slug}`}>
                <span className="line-row__n">0{i + 1}</span>
                <span className="line-row__t">{l.name}</span>
                <span className="line-row__d">{l.short}</span>
                <span className="line-row__a"><Arrow /></span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 40 }}><Link className="link-arrow" href="/productos">Ver todas las aberturas <span>→</span></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Eyebrow n="03">Por qué Aluva</Eyebrow>
          <h2 className="h-lg rv">No revendemos.<br />Fabricamos.</h2>
          <Pillars items={[
            ["factory", "Fábrica propia", "Planta en La Plata.", "/photos/det-pvc-1.webp"],
            ["ruler", "Medición en obra", "Relevamiento al milímetro.", "/photos/medicion-cinta.jpg"],
            ["thermo", "DVH propio", "Fabricado en planta.", "/photos/dvh-perfiles.jpg"],
            ["tools", "Instalación", "Con equipo propio.", "/og/producto-aluminio.jpg"],
          ]} />
        </div>
      </section>

      <section className="section section--paper" id="proceso">
        <div className="wrap">
          <Eyebrow n="04">Cómo trabajamos</Eyebrow>
          <div className="proc__head">
            <h2 className="h-lg rv">De la idea<br />a tu obra.</h2>
            <p className="proc__note rv rv-d1">Un mismo equipo<br />de principio a fin.</p>
          </div>
        </div>
        <ol className="proc">
          {PROCESO.map((p, k) => (
            <li key={p.t} className={`proc__item rv rv-d${k}`}>
              <div className="proc__rail" aria-hidden="true"><span className="proc__dot" /><span className="proc__n">0{k + 1}</span></div>
              <figure className="proc__fig"><img src={p.img} alt={p.alt} loading="lazy" /><figcaption>{p.dato}</figcaption></figure>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <Profesionales />

      <section className="section section--paper">
        <div className="wrap">
          <Eyebrow n="06">Obras e inspiración</Eyebrow>
          <div className="proc__head">
            <h2 className="h-lg rv">Más luz.<br />Más vista.</h2>
            <p className="proc__note rv rv-d1">Obras, detalles<br />y nuestro local.</p>
          </div>
          <div className="bento">
            {OBRAS.map((o, k) => (
              <figure key={o.c} className={`${o.c} rv${o.d}`}>
                <img src={o.src} alt={o.alt} loading="lazy" style={o.pos ? { objectPosition: o.pos } : undefined} />
                <span className="bento__n">0{k + 1}</span>
                <figcaption><b>{o.t}</b><small>{o.sub}</small></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </Shell>
  );
}
