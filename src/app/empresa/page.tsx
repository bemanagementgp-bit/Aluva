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

const PASOS: [string, string, string, string][] = [
  ["01", "Consulta", "Asesoramiento técnico y presupuesto estimado.", "/photos/em-166.webp"],
  ["02", "Medición", "Relevamiento en obra con personal propio.", "/photos/proceso-medicion.webp"],
  ["03", "Fabricación", "Corte, armado, herrajes y control en planta.", "/photos/proceso-fabricacion.webp"],
  ["04", "Instalación", "Colocación profesional con personal calificado.", "/photos/instalacion-obra.webp"],
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
      {/* 01 Nosotros. Lo primero son los 20 años de trayectoria (pedido del
          cliente, 2026-10-28), con el diseño de bloque verde + foto que pasó. */}
      <section className="mg-tapa section--paper">
        <div className="mg-pres">
          <span className="mg-pres__bloque" aria-hidden="true" />
          <figure className="mg-pres__fig">
            <img src="/photos/em-35.webp" alt="Operario cargando un perfil en la prensa de nuestra planta" fetchPriority="high" />
            <figcaption>
              <h1 className="mg-pres__arriba"><b>+20 años</b><span>de trayectoria<br />fabricando aberturas</span></h1>
              <p className="mg-pres__abajo"><span>Hechas en</span><b>La Plata.</b></p>
            </figcaption>
          </figure>
        </div>
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

      {/* 04 Cómo trabajamos */}
      <section className="mg-proc section--paper" id="proceso">
        <div className="wrap">
          <div className="mg-c">
            <p className="mg-kicker">04 · Cómo trabajamos</p>
            <span className="mg-regla" aria-hidden="true" />
            <h2 className="mg-t">Cuatro pasos, <b>un mismo equipo</b></h2>
          </div>
          <ol className="mg-proc__list">
            {PASOS.map(([n, t, d, img]) => (
              <li key={n} className="rv">
                <figure><img src={img} alt={t} loading="lazy" /><span>{n}</span></figure>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
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
