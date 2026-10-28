import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import { WA, IPin } from "@/components/Icon";
import { CONTACTO, waLink } from "@/content/site";
import "@/styles/empresa.css";

export const metadata: Metadata = {
  title: "Empresa · Fábrica de aberturas en La Plata | Aluva",
  description: "Conocé Aluva: más de 20 años fabricando aberturas de PVC y aluminio, vidriería, vidrio templado y revestimientos en La Plata, con planta y equipo propios.",
};

/*
  Empresa, con el formato de revista de
  https://hitachicm.com.au/orange-family/magazine/ que eligió el cliente
  (2026-10-28): título gigante con bajada en dos pesos, mosaico de fotos,
  nota principal junto a tarjetas, banner a todo el ancho, frase central,
  muro de obras y cierre con la marca. Se mantiene el intercalado
  blanco / verde del sitio.

  Solo datos confirmados por Aluva: más de 20 años, planta propia en La Plata,
  equipo propio de medición y colocación, perfilería y herrajes de primera
  línea, garantía y atención después de la obra.
*/

const MOSAICO: [string, string][] = [
  ["/photos/em-54.webp", "Máquinas de mecanizado en nuestra planta"],
  ["/photos/em-64.webp", "Perforado de un perfil de PVC"],
  ["/photos/em-60.webp", "Fresadora de perfiles"],
  ["/photos/em-49.webp", "Tronzadora de perfiles de aluminio"],
];

/* Datos de la marca: solo lo confirmado por Aluva */
const DATOS: [string, string][] = [
  ["+20", "años de trayectoria en el mercado"],
  ["5", "líneas: PVC, aluminio, vidriería, templados y revestimientos"],
  ["Planta", "propia en La Plata, con DVH de fabricación propia"],
  ["Equipo", "propio de medición y colocación"],
];

/* Lo que nos mueve, en el orden que pidió el cliente */
const VALORES: [string, string, string][] = [
  ["Materiales", "Perfilería y herrajes de primera línea, porque una abertura dura lo que duran sus componentes.", "/photos/em-172.webp"],
  ["Precisión", "Medición propia: el relevamiento en obra lo hace nuestro equipo.", "/photos/em-101.webp"],
  ["Producción", "Planta de PVC y aluminio, con DVH de fabricación propia.", "/photos/em-59.webp"],
  ["Posventa", "Garantía y atención finalizada la obra.", "/photos/em-130.webp"],
];

const SERVICIO: [string, string, string][] = [
  ["Medición propia", "Nuestro equipo técnico relevá la obra y asesora en opciones de perfiles, vidrios y colores. Sin sorpresas: el presupuesto es exacto.", "/photos/em-29.webp"],
  ["Fabricación en planta", "Cortamos, armamos y sellamos cada abertura con control de calidad. El DVH lo fabricamos nosotros también. Garantía en cada producto.", "/photos/em-63.webp"],
  ["Equipo de colocación", "Personal calificado que instala la abertura respetando los tiempos y los detalles de la obra.", "/photos/em-96.webp"],
  ["Servicio después", "No nos vamos cuando termina la obra. Atendemos reclamos y hacemos mantenimiento si hace falta.", "/photos/em-35.webp"],
];

const OBRAS: [string, string][] = [
  ["/photos/em-157.webp", "Showroom con revestimiento símil madera"],
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
      {/* 01 Nosotros. Hero a pantalla completa con el formato de la portada de
          hitachicm.com.au: foto que ocupa toda la pantalla, encima el título
          en bloque a la izquierda en varias líneas, con dos pesos (una línea
          delgada y otra pesada), y una línea volanta arriba.

          La foto que mostró el cliente (el frente del local con el cartel
          "aluva · tecnología en aberturas") no está entre las que llegaron a
          mi carpeta; cuando la suban al proyecto, el `src` de la foto es lo
          único que hay que cambiar. */}
      <section className="em-hero">
        <img className="em-hero__bg" src="/photos/em-cartel.webp" alt="" aria-hidden="true" fetchPriority="high" />
        <div className="wrap em-hero__in">
          <p className="em-hero__ey">Más de 20 años</p>
          <h1 className="em-hero__t">
            <span>Fabricamos</span>
            <b>aberturas</b>
            <span>a medida</span>
            <b>en La Plata.</b>
          </h1>
          <p className="em-hero__p">Planta propia, equipo propio y una misma historia desde hace más de dos décadas.</p>
          <a href="#nosotros" className="em-hero__scroll" aria-label="Ir al contenido"><span /><em>Conocenos</em></a>
        </div>
      </section>

      <section className="mg-tapa section--paper" id="nosotros">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Empresa</span></div>
          <dl className="mg-datos">
            {DATOS.map(([n, t]) => <div key={n} className="rv"><dt>{n}</dt><dd>{t}</dd></div>)}
          </dl>
          <div className="mg-c">
            <p className="mg-kicker">01 · Nosotros</p>
            <span className="mg-regla" aria-hidden="true" />
            <p className="mg-t">Una fábrica con <b>más de 20 años en el mercado</b></p>
            <p className="mg-p">Desde hace más de 20 años fabricamos e instalamos aberturas a medida. En nuestra planta de La Plata producimos aberturas de PVC y aluminio, DVH, vidriería, templados y revestimientos, y las colocamos con nuestro propio equipo. La misma gente, el mismo compromiso, obra tras obra.</p>
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
            <p className="mg-kicker">02 · Fábrica</p>
            <h2>Una planta propia en La Plata</h2>
            <p>Todo lo que instalamos sale de nuestra fábrica: cortamos los perfiles, armamos cada abertura, fabricamos el doble vidriado hermético y controlamos la calidad antes de que llegue a la obra.</p>
            <Link className="mg-mas" href="/productos">Ver productos</Link>
          </article>
          <div className="mg-cards">
            <p className="mg-kicker mg-kicker--izq">03 · Lo que nos mueve</p>
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
          <p className="mg-banner__tag">+20 años</p>
          <p className="mg-banner__t">Fabricamos <b>lo que instalamos</b></p>
          <p className="mg-banner__p">No revendemos: cada abertura sale de nuestra planta y la coloca nuestro equipo.</p>
        </div>
      </section>

      {/* 04 Garantía y servicio */}
      <section className="em-servicio section--paper" id="servicio">
        <div className="wrap">
          <div className="em-servicio__header">
            <p className="mg-kicker">04 · Garantía y servicio</p>
            <span className="mg-regla" aria-hidden="true" />
            <h2 className="mg-t">Nuestro equipo en <b>cada paso</b></h2>
          </div>
          <div className="em-servicio__grid">
            {SERVICIO.map(([t, d, img], i) => (
              <article key={t} className={`em-servicio__item rv rv-d${i}`}>
                {i % 2 === 0 ? (
                  <>
                    <figure className="em-servicio__fig"><img src={img} alt={t} loading="lazy" /></figure>
                    <div className="em-servicio__txt">
                      <h3>{t}</h3>
                      <p>{d}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="em-servicio__txt">
                      <h3>{t}</h3>
                      <p>{d}</p>
                    </div>
                    <figure className="em-servicio__fig"><img src={img} alt={t} loading="lazy" /></figure>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Frase central + muro de obras */}
      <section className="mg-obras">
        <div className="wrap">
          <div className="mg-c">
            <p className="mg-kicker mg-kicker--claro">Tecnología en aberturas</p>
            <p className="mg-t mg-t--claro"><b>Fábrica local,</b> calidad de primera línea</p>
            <p className="mg-p mg-p--claro">Nuestros clientes son el centro de cada obra. Estas son algunas de las aberturas que fabricamos e instalamos.</p>
          </div>
          <p className="mg-obras__h">#Obras<b>Aluva</b></p>
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
            <p className="mg-t">Visitá nuestro <b>showroom</b></p>
            <p className="mg-p">Muestras de perfiles, vidrios y herrajes.</p>
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
