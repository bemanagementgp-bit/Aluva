import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { Arrow, WA } from "@/components/Icon";
import { Cta, Eyebrow, Faq, Lines, Pillars } from "@/components/blocks";
import { Anatomia, DragGallery, DvhConfigurator } from "@/components/interactive";
import { LINEAS, PRODUCTOS, waLink, type Slug } from "@/content/site";

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

function Especial({ slug }: { slug: Slug }) {
  if (slug === "pvc") {
    return (
      <section className="section--fx section--aire section" id="componentes">
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
          <DvhConfigurator />
          <div className="duo">
            <figure className="rv"><img src="/photos/dvh-perfiles.jpg" alt="Cortes de perfiles de PVC con doble vidriado hermético" loading="lazy" /></figure>
            <figure className="rv rv-d1"><img src="/photos/dvh-corte.jpg" alt="Corte de una abertura con doble vidriado hermético" loading="lazy" /></figure>
          </div>
        </div>
      </section>
    );
  }
  if (slug === "aluminio") {
    const sw: [string, string][] = [["#f4f4f0", "Blanco"], ["#b9bdc1", "Anodizado"], ["#1b1d1f", "Negro"]];
    return (
      <section id="lineas" className="section--fx section--aire section">
        <div className="wrap">
          <Eyebrow n="02">Líneas y terminaciones</Eyebrow>
          <h2 className="h-lg rv">A30, Módena<br />y Herrero.</h2>
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 50, maxWidth: 720 }}>
            {sw.map(([c, n]) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ display: "block", aspectRatio: "1", borderRadius: "var(--r-box)", background: c, border: "1px solid rgba(0,40,40,.15)" }} />
                <b style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase" }}>{n}</b>
              </div>
            ))}
          </div>
          <div className="split" style={{ marginTop: 60, gap: 18, alignItems: "stretch" }}>
            <figure className="clip" style={{ ...figStyle, aspectRatio: "4/5" }}><img src="/photos/aluminio-ventana-oscilobatiente.webp" alt="Ventana de aluminio negro abierta, en un ambiente" loading="lazy" style={imgStyle} /></figure>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <figure className="clip" style={{ ...figStyle, flex: 1, minHeight: 260 }}><img src="/photos/det-aluminio-3.webp" alt="Esquina del marco, con el canto y el burlete" loading="lazy" style={imgStyle} /></figure>
              <div style={{ background: "var(--bg-2)", color: "var(--ink)", borderRadius: "var(--r-box)", padding: 28 }}>
                <h3 className="h-md" style={{ marginBottom: 6 }}>Ficha</h3>
                <dl className="specs">
                  <div><dt>Líneas</dt><dd>A30, Módena y Herrero</dd></div>
                  <div><dt>Terminación</dt><dd>Anodizado o pintado</dd></div>
                  <div><dt>Vidrio</dt><dd>Simple o DVH de fabricación propia</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="templado" className="section--fx section--hondo section">
      <div className="wrap">
        <Eyebrow n="02">Vidrio templado</Eyebrow>
        <h2 className="h-lg rv">Solo vidrio.<br />Nada más.</h2>
        <div className="split" style={{ marginTop: 48, gap: 18 }}>
          <figure className="clip" style={{ ...figStyle, aspectRatio: "4/5" }}><img src="/photos/det-blindex-1.webp" alt="Puerta de vidrio templado con tirador, sin marco" loading="lazy" style={imgStyle} /></figure>
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
  const idx = LINEAS.findIndex((l) => l.slug === p.slug);
  const nxt = LINEAS[(idx + 1) % LINEAS.length];

  return (
    <Shell active={p.slug}>
      <section className="cover">
        <img className="cover__img" src={p.cover} alt={p.coverAlt} fetchPriority="high" />
        <div className="wrap cover__in">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><Link href="/productos">Aberturas</Link><span>/</span><span>{p.name}</span></div>
          <h1 className="cover__title">{p.name}</h1>
          <p className="cover__lead">{p.lead}</p>
          <div className="btn-row">
            <Link className="btn btn--lime" href="/contacto">Cotizar {p.name} <span className="arr">→</span></Link>
            <a className="btn btn--ghost" href={waLink(`Hola Aluva, quiero consultar por ${p.name}.`)} target="_blank" rel="noopener"><WA /> Consultar</a>
          </div>
        </div>
      </section>

      <section id="beneficios" className="section--fx section--brillo section section--paper">
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

      <section className="section--tight">
        <div className="wrap">
          <Link className="next" href={`/${nxt.slug}`}><small>Siguiente línea</small><span className="next__t">{nxt.name} <Arrow /></span></Link>
        </div>
      </section>

      <Cta title={p.ctaT} text={p.cta} light />
    </Shell>
  );
}
