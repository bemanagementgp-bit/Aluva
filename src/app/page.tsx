import Link from "next/link";
import Shell from "@/components/Shell";
import { Arrow } from "@/components/Icon";
import { Cta, Eyebrow, Pillars, Profesionales } from "@/components/blocks";
import { LINEAS, PROCESO } from "@/content/site";

/* Fotos de obra propias que mandó el cliente (revisión del 2026-10-28):
   PVC, Aluminio y Mamparas. Templados espera la suya.
   PVC y Aluminio van arriba y grandes: son los productos principales y tienen
   que pesar más que vidriería, mamparas y templados, que van en la fila de
   abajo junto al local. */
const OBRAS = [
  { c: "b1", d: "", src: "/photos/obra-pvc.webp", alt: "Corrediza de PVC símil madera hacia una terraza", t: "PVC", sub: "Corrediza símil madera" },
  { c: "b2", d: " rv-d1", src: "/photos/obra-aluminio.webp", alt: "Corrediza de aluminio blanco hacia un balcón", t: "Aluminio", sub: "Corrediza al balcón" },
  { c: "b3", d: "", src: "/og/producto-vidrieria.jpg", alt: "Cerramiento vidriado de balcón", t: "Vidriería", sub: "Cerramiento de balcón", pos: "right bottom" },
  { c: "b4", d: " rv-d1", src: "/photos/obra-mampara.webp", alt: "Paño de vidrio esmerilado en un baño de mármol", t: "Mamparas", sub: "Vidrio esmerilado a medida" },
  { c: "b5", d: " rv-d2", src: "/photos/det-blindex-1.webp", alt: "Puerta de vidrio templado con tirador", t: "Templados", sub: "Puerta de templado" },
  { c: "b6", d: " rv-d3", src: "/photos/local-aluva.jpg", alt: "Frente del local de Aluva en La Plata", t: "Nuestro local", sub: "Showroom · La Plata", pos: "50% 40%" },
];

export default function Inicio() {
  return (
    <Shell active="inicio" lightFooter>
      <section className="hero">
        <div className="hero__media"><img src="/photos/portada-inicio-proyectantes.jpg" alt="Ventanas proyectantes de aluminio negro abiertas hacia el jardín" fetchPriority="high" /></div>
        <div className="wrap">
          <Eyebrow n="01">PVC · Aluminio · Vidriería · Templados · Revestimientos</Eyebrow>
          <div className="hero__grid">
            {/* La marca va primero y más grande que "Aberturas a medida" (pedido del cliente, 2026-10-28) */}
            <h1 className="hero__title">
              <span className="row"><span><img className="hero__marca" src="/brand/marca-negativa-ajustada.svg" alt="Aluva" width={699} height={141} /></span></span>
              <span className="row hero__sub"><span>Aberturas a medida</span></span>
            </h1>
            <div className="hero__side">
              <p className="lead">Fabricamos e instalamos aberturas de PVC y aluminio, templados y revestimientos. Más de 20 años de trayectoria en el mercado.</p>
              <div className="btn-row">
                <Link className="btn btn--lime" href="/productos">Ver productos <span className="arr">→</span></Link>
                <Link className="btn btn--ghost" href="/contacto">Pedí presupuesto</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="que-fabricamos" className="section--fx section--hondo section section--paper s-lineas">
        <div className="wrap">
          <Eyebrow n="02">Qué fabricamos</Eyebrow>
          <h2 className="h-lg rv">Cinco soluciones,<br />una fábrica.</h2>
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
          <div style={{ marginTop: 40 }}><Link className="link-arrow" href="/productos">Ver todos los productos <span>→</span></Link></div>
        </div>
      </section>

      <section id="por-que" className="section--fx section--aire section">
        <div className="wrap">
          <Eyebrow n="03">Por qué Aluva</Eyebrow>
          <h2 className="h-lg rv">No revendemos.<br />Fabricamos.</h2>
          <Pillars items={[
            ["factory", "Fábrica propia", "Planta en La Plata.", "/photos/det-pvc-perfil.webp"],
            ["ruler", "Medición en obra", "Relevamiento preciso.", "/photos/medicion-cinta.jpg"],
            ["thermo", "DVH de fabricación propia", "Realizado íntegramente en nuestras instalaciones.", "/photos/dvh-perfiles.jpg"],
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

      <section id="obras" className="section--fx section--brillo section section--paper">
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
