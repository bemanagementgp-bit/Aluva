import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { Arrow, WA } from "@/components/Icon";
import { Cta, Eyebrow, Faq, Lines, Pillars } from "@/components/blocks";
import { Anatomia, DragGallery, DvhConfigurator } from "@/components/interactive";
import { COLORES, LINEAS, PRODUCTOS, waLink, type Slug } from "@/content/site";

type Props = { params: Promise<{ linea: string }> };

const buscar = (slug: string) => PRODUCTOS.find((p) => p.slug === slug);

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ linea: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = buscar((await params).linea);
  if (!p) return {};
  return { title: p.title, description: p.desc, openGraph: { title: p.title, description: p.desc, images: [p.og] } };
}

/* Sección propia de cada línea (la segunda de la página) */
const figStyle = { margin: 0, borderRadius: 2, overflow: "hidden" } as const;
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" } as const;

/* Comparativa de las tres lineas de aluminio. Fuente: diapositiva 51 del deck
   "Correcciones web" del 04-11-2026. OJO: la propia nota aclara que es un
   resumen armado con Google y que queda "a confirmar con ALUVA". Mientras no
   lo confirmen, la tabla va con la salvedad de que es orientativa. */
const LINEAS_AL = ["A30", "Módena", "Herrero"] as const;
const COMPARATIVA: [string, string, string, string][] = [
  ["Tipo de perfil", "Reforzado / Superior", "Principal / Mediano de alta prestación", "Estándar / Liviano"],
  ["Peso y solidez", "Perfiles 30 % más grandes y pesados", "Mayor cantidad de aluminio, más robusto", "Liviano"],
  ["Hermeticidad", "Muy buena a superior", "Excelente", "Buena"],
  ["Compatibilidad DVH", "Total (hasta 24-28 mm)", "Total (hasta 19 mm)", "Parcial (limitada)"],
  ["Aislación acústica y térmica", "Muy alta, especial para grandes superficies", "Alta", "Baja a moderada"],
  ["Uso ideal", "Ventanales grandes, zonas con vientos fuertes o frío extremo", "Viviendas permanentes, obra nueva, ventanas estándar", "Obras económicas, renovaciones rápidas o interiores"],
];

function Especial({ slug }: { slug: Slug }) {
  if (slug === "pvc") {
    return (
      <section className="section" id="componentes">
        <div className="wrap">
          <Eyebrow n="02">Componentes de una ventana</Eyebrow>
          <div className="sec-title">
            <h2 className="h-lg rv">Componentes<br />del sistema.</h2>
            <p className="small">Tocá cada punto.</p>
          </div>
          <Anatomia />
        </div>
      </section>
    );
  }
  if (slug === "vidrieria") {
    return (
      <section className="section" id="dvh">
        <div className="wrap">
          <Eyebrow n="02">Configurador DVH</Eyebrow>
          <div className="sec-title">
            <h2 className="h-lg rv">Configurador<br />DVH.</h2>
            <p className="small">Combiná vidrios y cámara.</p>
          </div>
          {/* Sin fotos abajo: la de perfiles era de PVC y la del corte, de IA.
              El cliente decide si hace falta alguna (revisión del 2026-10-28). */}
          <DvhConfigurator />
        </div>
      </section>
    );
  }
  if (slug === "aluminio") {
    /* Los nueve acabados que publica aluva.com.ar. La lista vive en COLORES,
       asi que esta pagina y la home no se pueden desincronizar. */
    const sw: readonly (readonly [string, string])[] =
      COLORES.find((c) => c.nombre === "Aluminio")!.items;
    return (
      <section id="lineas" className="section">
        <div className="wrap">
          <Eyebrow n="02">Líneas y colores</Eyebrow>
          <h2 className="h-lg rv">A30, Módena<br />y Herrero.</h2>
          {/* Comparativa de las tres lineas (diapositiva 51 del deck del
              04-11-2026). Las columnas van A30, Modena, Herrero —de mejor a
              peor, como en todo el sitio—, no en el orden de la diapositiva.

              En celular la tabla se da vuelta: cada caracteristica pasa a ser
              una ficha con las tres lineas adentro. Una tabla de cuatro
              columnas en 358px solo se puede resolver con scroll horizontal, y
              el scroll horizontal esconde justo lo que se quiere comparar. */}
          <table className="tabla-lineas rv">
            <thead>
              <tr>
                <th scope="col">Característica</th>
                {LINEAS_AL.map((l) => <th key={l} scope="col">{l}</th>)}
              </tr>
            </thead>
            <tbody>
              {COMPARATIVA.map(([k, ...vals]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  {vals.map((v, i) => <td key={LINEAS_AL[i]} data-l={LINEAS_AL[i]}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tabla-lineas__pie">Orientativo. Te asesoramos según el vano y la obra.</p>
          {/* Nueve muestras chicas, con el nombre al lado: una lista de colores,
              no una grilla de cuadros grandes. Tres columnas en escritorio, dos
              en celular. */}
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "14px 24px", marginTop: 36, maxWidth: 560 }}>
            {sw.map(([n, c]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ flex: "0 0 auto", width: 26, height: 26, borderRadius: 4, background: c, border: "1px solid rgba(0,40,40,.18)" }} />
                <span style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", opacity: .78 }}>{n}</span>
              </div>
            ))}
          </div>
          <div className="split" style={{ marginTop: 48, gap: 18, alignItems: "stretch" }}>
            <figure className="clip" style={{ ...figStyle, aspectRatio: "4/5" }}><img src="/photos/aluminio-ventana-oscilobatiente.webp" alt="Ventana de aluminio negro abierta, en un ambiente" loading="lazy" style={imgStyle} /></figure>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <figure className="clip" style={{ ...figStyle, flex: 1, minHeight: 260 }}><img src="/photos/tipo-corrediza.webp" alt="Corrediza de aluminio negro en un ambiente" loading="lazy" style={imgStyle} /></figure>
              <div className="ficha">
                <h3 className="h-md" style={{ marginBottom: 6 }}>Ficha</h3>
                <dl className="specs">
                  <div><dt>Líneas</dt><dd>A30, Módena y Herrero</dd></div>
                  <div><dt>Terminación</dt><dd>Anodizado, pintado o símil madera</dd></div>
                  <div><dt>Vidrio</dt><dd>Simple o DVH de fabricación propia</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (slug === "revestimientos") {
    return (
      <section id="revestimientos" className="section">
        <div className="wrap">
          <Eyebrow n="02">Wall panel</Eyebrow>
          <h2 className="h-lg rv">La fachada,<br />terminada.</h2>
          <div className="split" style={{ marginTop: 48, gap: 18 }}>
            <figure className="clip" style={{ ...figStyle, aspectRatio: "4/5" }}><img src="/photos/revestimiento-fachada.webp" alt="Fachada revestida con wall panel negro" loading="lazy" style={imgStyle} /></figure>
            <figure className="clip" style={{ ...figStyle, aspectRatio: "4/5" }}><img src="/photos/revest-wallpanel.jpg" alt="Listones de wall panel en distintos colores" loading="lazy" style={imgStyle} /></figure>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="templado" className="section">
      <div className="wrap">
        <Eyebrow n="02">Vidrio templado</Eyebrow>
        <h2 className="h-lg rv">Solo vidrio.<br />Nada más.</h2>
        <div className="split" style={{ marginTop: 48, gap: 18 }}>
          <figure className="clip" style={{ ...figStyle, aspectRatio: "4/5" }}><img src="/photos/templado-puerta.webp" alt="Puerta de vidrio templado con tirador, sin marco" loading="lazy" style={imgStyle} /></figure>
          <figure className="clip" style={{ ...figStyle, aspectRatio: "4/5" }}><img src="/photos/blindex.webp" alt="Puerta de vidrio templado" loading="lazy" style={imgStyle} /></figure>
        </div>
      </div>
    </section>
  );
}

/* Foto de sistema: el prefijo "cut:" o "top:" agrega una clase de encuadre */
function SysFig({ src, alt }: { src: string; alt: string }) {
  const m = src.match(/^(cut|top):(.*)$/);
  return <figure className={m ? m[1] : ""}><img src={m ? m[2] : src} alt={alt} loading="lazy" /></figure>;
}

export default async function Linea({ params }: Props) {
  const p = buscar((await params).linea);
  if (!p) notFound();
  const otras = LINEAS.filter((l) => l.slug !== p.slug);
  const cotizar = `/contacto?producto=${p.slug}`;

  return (
    <Shell active={p.slug}>
      <section className="cover">
        <img className="cover__img" src={p.cover} alt={p.coverAlt} fetchPriority="high" />
        <div className="wrap cover__in">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><Link href="/productos">Productos</Link><span>/</span><span>{p.name}</span></div>
          <h1 className="cover__title">{p.name}</h1>
          <p className="cover__lead">{p.lead}</p>
          <div className="btn-row">
            <Link className="btn btn--lime" href={cotizar}>Cotizar {p.name} <span className="arr">→</span></Link>
            <a className="btn btn--ghost" href={waLink(`Hola Aluva, quiero consultar por ${p.name}.`)} target="_blank" rel="noopener"><WA /> Consultar</a>
          </div>
        </div>
      </section>

      <section id="beneficios" className="section section--paper">
        <div className="wrap">
          <Eyebrow n="01">Beneficios</Eyebrow>
          <h2 className="h-lg rv"><Lines lines={p.whyT} /></h2>
          <Pillars items={p.pillars} />
        </div>
      </section>

      <Especial slug={p.slug} />

      <section className="section section--paper section--plano">
        <div className="wrap">
          <Eyebrow n="03">{p.sysEyebrow}</Eyebrow>
          <h2 className="h-lg rv"><Lines lines={p.sysT} /></h2>
          <div className="systems">
            {p.systems.map(([img, t, d], i) => (
              <article key={t} className={`sys rv rv-d${i % 3}`}><SysFig src={img} alt={t} /><div><h3>{t}</h3><p>{d}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <DragGallery n="04" title={p.galT} items={p.gallery} light={false} />

      <Faq n="05" items={p.faq} light />

      {/* Primero el presupuesto y después el resto de los productos, que se
          pueden recorrer en cualquier sentido (antes solo había "siguiente") */}
      <Cta title={p.ctaT} text={p.cta} href={cotizar} />

      <section className="section--tight section--paper">
        <div className="wrap">
          <nav className="explora" aria-label="Otros productos">
            <small>Seguí explorando</small>
            <ul>{otras.map((l) => <li key={l.slug}><Link href={`/${l.slug}`}>{l.name} <Arrow /></Link></li>)}</ul>
          </nav>
        </div>
      </section>
    </Shell>
  );
}
