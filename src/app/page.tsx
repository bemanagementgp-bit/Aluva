import Link from "next/link";
import Shell from "@/components/Shell";
import { Arrow } from "@/components/Icon";
import { Cta, Eyebrow, Profesionales } from "@/components/blocks";
import { LINEAS, PROCESO } from "@/content/site";

/* Fotos de obra propias que mandó el cliente (revisión del 2026-10-28):
   PVC, Aluminio, Mamparas y Templados.
   PVC y Aluminio van arriba y grandes: son los productos principales y tienen
   que pesar más que vidriería, mamparas y templados, que van en la fila de
   abajo junto al local. */
const OBRAS = [
  { c: "b1", d: "", src: "/photos/obra-pvc.webp", alt: "Corrediza de PVC símil madera hacia una terraza", t: "PVC", sub: "Corrediza símil madera" },
  { c: "b2", d: " rv-d1", src: "/photos/obra-aluminio.webp", alt: "Corrediza de aluminio blanco hacia un balcón", t: "Aluminio", sub: "Corrediza al balcón" },
  { c: "b3", d: "", src: "/og/producto-vidrieria.jpg", alt: "Cerramiento vidriado de balcón", t: "Vidrios", sub: "Cerramiento de balcón", pos: "right bottom" },
  { c: "b4", d: " rv-d1", src: "/photos/obra-mampara.webp", alt: "Paño de vidrio esmerilado en un baño de mármol", t: "Mamparas", sub: "Vidrio esmerilado a medida" },
  { c: "b5", d: " rv-d2", src: "/photos/obra-templado.webp", alt: "Puerta de vidrio templado con tirador en un hall", t: "Vidrios", sub: "Puerta de templado" },
  { c: "b6", d: " rv-d3", src: "/photos/local-aluva.jpg", alt: "Frente del local de Aluva en La Plata", t: "Nuestra fábrica", sub: "Planta propia · La Plata", pos: "50% 40%" },
];

/* Cuatro pruebas de fabricación, sin adornos: índice, foto y nombre. */
const POR_QUE: [string, string, string, string, string][] = [
  ["01", "Fábrica propia", "/photos/proceso-fabricacion.webp", "50% 35%", "Operario perforando un perfil de PVC en la planta de Aluva"],
  ["02", "Medición en obra", "/photos/medicion-cinta.jpg", "50% 35%", "Cinta métrica y lápiz marcando una plancha en obra"],
  ["03", "DVH de fabricación propia", "/photos/det-vidrieria-1.webp", "52% 28%", "Cortando vidrio en el taller propio de Aluva"],
  ["04", "Instalación", "/photos/instalacion-obra.webp", "50% 42%", "Corrediza de PVC símil madera recién instalada, con herramientas sobre el piso"],
];

export default function Inicio() {
  return (
    <Shell active="inicio" lightFooter>
      {/* Portada: a pantalla completa con la foto del frente del local y el
          título apoyado en el cielo. Fue el hero de /empresa hasta la revisión
          del 24-11-2026, cuando el cliente pidió intercambiar las dos portadas.

          Llegó la foto que faltaba (el frente con el cartel "aluva ·
          tecnología en aberturas"), la que el cliente venía pidiendo y la que
          resolvía de paso el reclamo de que el texto blanco se pegoteaba con
          el blanco de la foto anterior. Con esta foto el texto va en tinta
          oscura sobre el cielo: es la única zona legible, porque contra el
          cartel verde la tinta da 1,0:1 (la sombra de las letras es casi
          negra). El detalle de las medidas está en site.css (bloque "Portada de inicio").

          Por eso el titular bajó de cuatro líneas a dos: tiene que entrar
          entero arriba del techo del cartel, y por eso se fue el indicador
          de scroll: su único lugar posible era abajo, sobre la vidriera,
          donde la tinta oscura tampoco se lee. */}
      <section className="em-hero section--paper">
        <img className="em-hero__bg" src="/photos/em-frente.webp" alt="Frente del local de Aluva, con el cartel de la marca sobre la vidriera" width={1536} height={1024} fetchPriority="high" />
        <div className="wrap em-hero__in">
          <div className="em-hero__txt">
            <p className="em-hero__ey">Más de 20 años</p>
            <h1 className="em-hero__t">
              <span>Fabricamos <b>aberturas</b>{" "}</span>
              <span>a medida <b>en La Plata.</b></span>
            </h1>
            <p className="em-hero__p">Planta y equipo propios. Fabricamos, instalamos y respondemos por cada obra.</p>
          </div>
        </div>
        {/* Los botones vinieron de la portada vieja (pedido del 24-11-2026).
            Van sobre la pared verde del cartel, debajo de las letras, con su
            misma inclinación y relieve, y escalan con la foto (las medidas
            están en site.css); por eso son hijos directos de la sección y no
            del bloque de texto. Solo en el teléfono bajan debajo del párrafo. */}
        <div className="wrap btn-row em-hero__cta">
          <Link className="btn btn--lime" href="/productos">Ver productos <span className="arr">→</span></Link>
          <Link className="btn btn--ghost" href="/contacto">Pedí presupuesto</Link>
        </div>
      </section>

      <section id="que-fabricamos" className="section section--paper s-lineas">
        <div className="wrap">
          <Eyebrow n="01">Qué fabricamos</Eyebrow>
          <h2 className="h-lg rv">Cuatro soluciones,<br />una fábrica.</h2>
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
          <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 32px" }}>
            <Link className="btn btn--lime" href="/vidrieria#dvh">Armá tu DVH en el configurador <span className="arr">→</span></Link>
            <Link className="link-arrow" href="/productos">Ver todos los productos <span>→</span></Link>
          </div>
        </div>
      </section>

      <section id="por-que" className="section section--deep">
        <div className="wrap">
          <Eyebrow n="02">Por qué Aluva</Eyebrow>
          <h2 className="h-lg rv">No revendemos.<br />Fabricamos.</h2>
          <p className="por-lead rv rv-d1">Fabricamos en La Plata todo lo que instalamos: medición, producción y colocación con equipo propio.</p>
          <ol className="pillars">
            {POR_QUE.map(([n, t, src, pos, alt], i) => (
              <li key={t} className={`pillar pillar--foto rv rv-d${i}`}>
                <figure className="pillar__frame">
                  <img src={src} alt={alt} loading="lazy" style={{ objectPosition: pos }} />
                </figure>
                <div className="pillar__meta">
                  <span className="pillar__n" aria-hidden="true">{n}</span>
                  <h3>{t}</h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--paper" id="proceso">
        <div className="wrap">
          <Eyebrow n="03">Cómo trabajamos</Eyebrow>
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

      <section id="obras" className="section section--paper">
        <div className="wrap">
          <Eyebrow n="04">Obras e inspiración</Eyebrow>
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
