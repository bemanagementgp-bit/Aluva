import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import { WA, IPin } from "@/components/Icon";
import { Eyebrow } from "@/components/blocks";
import { CONTACTO, waLink } from "@/content/site";
// @ts-ignore - Next.js handles CSS side-effect imports at build time.
import "@/styles/empresa.css";

export const metadata: Metadata = {
  title: " ",
  description: "",
};


const MOSAICO: [string, string][] = [
  ["/photos/em-54.webp", "Máquinas de mecanizado en nuestra planta"],
  ["/photos/em-64.webp", "Perforado de un perfil de PVC"],
  ["/photos/em-60.webp", "Fresadora de perfiles"],
  ["/photos/em-49.webp", "Tronzadora de perfiles de aluminio"],
];

const FICHA: [string, string][] = [
  ["Líneas", "PVC, aluminio, vidriería, templados y revestimientos"],
  ["Planta", "Propia en La Plata, con doble vidriado hermético de fabricación propia"],
  ["Equipo", "Propio, de medición en obra y colocación"],
];

const VALORES: [string, string, string][] = [
  ["Materiales", "Perfilería y herrajes de primera línea, porque una abertura dura lo que duran sus componentes.", "/photos/em-172.webp"],
  ["Precisión", "Medición propia: el relevamiento en obra lo hace nuestro equipo.", "/photos/em-101.webp"],
  ["Producción", "Planta de PVC y aluminio, con DVH de fabricación propia.", "/photos/em-59.webp"],
  ["Postventa", "Garantía y atención finalizada la obra.", "/photos/em-130.webp"],
];

const SERVICIO: [string, string, string][] = [
  ["Medición propia", "Nuestro equipo técnico releva la obra y asesora en opciones de perfiles, vidrios y colores. Sin sorpresas: el presupuesto es exacto.", "/photos/em-29.webp"],
  ["Fabricación en planta", "Cortamos, armamos y preparamos cada abertura con control de calidad. Contamos con fabricación propia de DVH. Garantía en cada producto.", "/photos/em-63.webp"],
  ["Equipo de colocación", "Personal calificado que instala la abertura respetando los tiempos y los detalles de la obra.", "/photos/em-96.webp"],
  ["Postventa", "Garantía y atención finalizada la obra.", "/photos/em-35.webp"],
];

const OBRAS: [string, string][] = [
  ["/photos/em-157.webp", "Fábrica con revestimiento símil madera"],
  ["/photos/em-104.webp", "Corrediza de aluminio con vista al verde"],
  ["/photos/em-136.webp", "Puerta de PVC símil madera"],
  ["/photos/em-139.webp", "Ventanas en la fachada"],
  ["/photos/em-107.webp", "Banderola de aluminio"],
  ["/photos/em-118.webp", "Puerta de vidrio templado"],
  ["/photos/em-96.webp", "Baranda de vidrio en terraza"],
  ["/photos/em-133.webp", "Ventana corrediza símil madera"],
  ["/photos/obra-templado.webp", "Puerta de templado en un hall"],
];

export default function Empresa() {
  return (
    <Shell active="empresa">
      {/* 01 Nosotros. Hero a pantalla completa con la foto del frente del
          local, y el título apoyado en el cielo.

          Llegó la foto que faltaba (el frente con el cartel "aluva ·
          tecnología en aberturas"), la que el cliente venía pidiendo y la que
          resolvía de paso el reclamo de que el texto blanco se pegoteaba con
          el blanco de la foto anterior. Con esta foto el texto va en tinta
          oscura sobre el cielo: es la única zona legible, porque contra el
          cartel verde la tinta da 1,0:1 (la sombra de las letras es casi
          negra). El detalle de las medidas está en empresa.css.

          Por eso el titular bajó de cuatro líneas a dos: tiene que entrar
          entero arriba del techo del cartel, y por eso se fue el indicador
          de scroll: su único lugar posible era abajo, sobre la vidriera,
          donde la tinta oscura tampoco se lee. */}
      <section className="em-hero section--paper">
        <img className="em-hero__bg" src="/photos/em-frente.webp" alt="Frente del local de Aluva, con el cartel de la marca sobre la vidriera" width={1536} height={1024} fetchPriority="high" />
        <div className="wrap em-hero__in">
          <p className="em-hero__ey">Más de 20 años</p>
          <h1 className="em-hero__t">
            <span>Fabricamos <b>aberturas</b>{" "}</span>
            <span>a medida <b>en La Plata.</b></span>
          </h1>
          <p className="em-hero__p">Planta y equipo propios. Fabricamos, instalamos y respondemos por cada obra.</p>
        </div>
      </section>

      <section className="mg-tapa section--paper" id="nosotros">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Empresa</span></div>
          <div className="em-ficha rv">
            <p className="em-ficha__cifra"><b>+20</b><span>años fabricando aberturas a medida en La Plata</span></p>
            <dl className="em-ficha__lista">
              {FICHA.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
          <div className="em-intro">
            <div>
              <Eyebrow n="01">Nosotros</Eyebrow>
              <h2 className="h-lg em-intro__t">Una fábrica<br />con oficio.</h2>
            </div>
            <p className="lead em-intro__p">Desde hace más de 20 años fabricamos e instalamos aberturas a medida. En nuestra planta de La Plata producimos aberturas de PVC, aluminio, DVH, vidriería, templados y revestimientos. La misma gente, el mismo compromiso, obra tras obra.</p>
          </div>
          <div className="mg-mosaico">
            {MOSAICO.map(([src, alt], i) => (
              <figure key={src} className={`rv rv-d${i}`}><img src={src} alt={alt} loading="lazy" /></figure>
            ))}
          </div>
        </div>
      </section>

      {/* 02 Fábrica (nota principal) + 03 Lo que nos mueve (tarjetas) */}
      <section className="mg-nota">
        <div className="wrap mg-nota__grid">
          <article className="mg-feat">
            <figure><img src="/photos/em-63.webp" alt="Mecanizado de un perfil en nuestra planta" loading="lazy" /></figure>
            <Eyebrow n="02">Fábrica</Eyebrow>
            <h2 className="h-lg">Una planta propia<br />en La Plata.</h2>
            <p>Todo lo que instalamos sale de nuestra fábrica: cortamos los perfiles, armamos cada abertura, fabricamos el doble vidriado hermético y controlamos la calidad antes de que llegue a la obra.</p>
            <Link className="mg-mas" href="/productos">Ver productos</Link>
          </article>
          <div className="mg-cards">
            <Eyebrow n="03">Lo que nos mueve</Eyebrow>
            <ol>
              {VALORES.map(([t, d, img]) => (
                <li key={t} className="rv">
                  <figure><img src={img} alt="" loading="lazy" /></figure>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Banner a todo el ancho */}
      <section className="mg-banner">
        <img src="/photos/em-126.webp" alt="" aria-hidden="true" loading="lazy" />
        <div className="wrap mg-banner__in">
          <p className="mg-banner__t">Fabricamos lo que instalamos.</p>
          <p className="mg-banner__p">No revendemos: cada abertura sale de nuestra planta y la coloca nuestro equipo.</p>
        </div>
      </section>

      {/* 04 Garantía y servicio */}
      <section className="em-servicio section--paper" id="servicio">
        <div className="wrap">
          <div className="em-servicio__header">
            <Eyebrow n="04">Garantía y servicio</Eyebrow>
            <h2 className="h-lg">Nuestro equipo<br />en cada paso.</h2>
          </div>
          <div className="em-servicio__grid">
            {SERVICIO.map(([t, d, img], i) => (
              /* Un solo orden en el markup; la alternancia la hace el CSS. Antes
                 se invertía acá Y otra vez con direction:rtl en la hoja, así que
                 las dos vueltas se cancelaban y las cuatro fotos caían a la
                 izquierda: la alternancia no existía. */
              <article key={t} className={`em-servicio__item rv rv-d${i}`}>
                <figure className="em-servicio__fig"><img src={img} alt={t} loading="lazy" /></figure>
                <div className="em-servicio__txt">
                  <span className="em-servicio__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Frase central + muro de obras */}
      <section className="mg-obras">
        <div className="wrap">
          <div className="em-obras__head">
            <Eyebrow n="05">Obras</Eyebrow>
            <h2 className="h-lg">Fábrica local,<br />calidad de primera línea.</h2>
            <p className="lead">Algunas de las aberturas que fabricamos e instalamos. Cada una medida, producida y colocada por nuestro equipo.</p>
          </div>
          <div className="mg-obras__grid">
            {OBRAS.map(([src, alt]) => (
              <figure key={src} className="rv"><img src={src} alt={alt} loading="lazy" /><figcaption>{alt}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre con la marca */}
      <section className="mg-cierre section--paper">
        <div className="wrap">
          <div className="mg-c">
            <img className="mg-cierre__logo" src="/brand/marca-negro.svg" alt="Aluva" width={220} height={73} />
            <span className="mg-cierre__tag">Tecnología en aberturas</span>
            <h2 className="h-lg">Visitá nuestra fábrica.</h2>
            <p className="lead mg-p">Muestras de perfiles, vidrios y herrajes, para ver y tocar antes de decidir.</p>
            <div className="btn-row mg-cierre__btns">
              <Link className="btn btn--lime" href="/contacto">Pedí tu presupuesto <span className="arr">→</span></Link>
              <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noopener"><WA /> WhatsApp</a>
              <a className="btn btn--ghost" href={CONTACTO.maps} target="_blank" rel="noopener"><IPin /> Cómo llegar</a>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
