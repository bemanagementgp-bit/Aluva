import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import { Cta, Eyebrow, Pillars } from "@/components/blocks";
import { CONTACTO } from "@/content/site";

export const metadata: Metadata = {
  title: "Empresa · Fábrica de aberturas en La Plata | Aluva",
  description: "Conocé Aluva: fábrica de aberturas de PVC y aluminio, vidriería, vidrio templado y revestimientos en La Plata. Nuestro proceso y servicio para profesionales.",
};

const PASOS = [
  ["01", "Consulta", "Asesoramiento técnico y presupuesto estimado.", "/photos/local-aluva.jpg"],
  ["02", "Medición", "Relevamiento en obra y presupuesto final.", "/photos/proceso-medicion.webp"],
  ["03", "Fabricación", "Corte, armado, herrajes y control en planta.", "/photos/proceso-fabricacion.webp"],
  ["04", "Instalación", "Colocación, sellado y regulación con equipo propio.", "/photos/instalacion-obra.webp"],
];

export default function Empresa() {
  return (
    <Shell active="empresa">
      {/* 01 Nosotros: carta de presentación de la marca (revisión del cliente, 2026-10-28).
          Solo datos confirmados: más de 20 años, planta propia en La Plata y
          equipo propio de medición y colocación. */}
      <section className="nos-hero">
        <div className="wrap nos-hero__grid">
          <div className="nos-hero__txt">
            <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Empresa</span></div>
            <Eyebrow n="01">Nosotros</Eyebrow>
            <h1 className="nos-hero__t">Más de 20 años<br />fabricando aberturas.</h1>
            <p className="nos-hero__lead">Aluva es una fábrica de aberturas de La Plata. Producimos en planta propia aberturas de PVC y aluminio, DVH, vidriería, templados y revestimientos, y las instalamos con nuestro equipo.</p>
          </div>
          <figure className="nos-hero__fig">
            <img src="/photos/proceso-fabricacion.webp" alt="Mecanizado de un perfil en nuestra planta" fetchPriority="high" />
            <figcaption><span className="nos-hero__num" aria-hidden="true">20</span><span>años de trayectoria<br />en el mercado</span></figcaption>
          </figure>
        </div>
        <div className="wrap">
          <ol className="nos-pilares">
            <li><span>01</span><h2>Trayectoria</h2><p>Más de 20 años en el mercado de las aberturas.</p></li>
            <li><span>02</span><h2>Planta propia</h2><p>Corte, armado y control de calidad en La Plata.</p></li>
            <li><span>03</span><h2>Equipo propio</h2><p>Medición en obra y colocación con personal calificado.</p></li>
            <li><span>04</span><h2>De principio a fin</h2><p>Un mismo equipo, del presupuesto a la posventa.</p></li>
          </ol>
        </div>
      </section>

      <section className="band band--fabrica">
        <img src="/og/producto-blindex.jpg" alt="Nuestro local, con aberturas de perfil negro en exhibición" loading="lazy" />
        <div className="band__cap">
          <Eyebrow n="02">Fábrica</Eyebrow>
          <h2 className="h-giant">Fábrica</h2>
          <p>Aberturas de PVC y aluminio, vidriería, templados y revestimientos. La Plata.</p>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap">
          <Eyebrow n="03">Lo que nos mueve</Eyebrow>
          <h2 className="h-lg rv">De punta<br />a punta.</h2>
          <Pillars items={[
            ["shield", "Materiales", "Perfilería y herrajes de primera línea."],
            ["ruler", "Precisión", "Medición propia."],
            ["factory", "Producción", "Planta PVC y aluminio."],
            ["tools", "Posventa", "Garantía y atención finalizada la obra."],
          ]} />
        </div>
      </section>

      <section className="section" id="proceso">
        <div className="wrap">
          <Eyebrow n="04">Cómo trabajamos</Eyebrow>
          <h2 className="h-lg rv">Cuatro pasos.<br />Cero sorpresas.</h2>
          <div className="tl">
            {PASOS.map(([n, t, d, img]) => (
              <div key={n} className="tl__item rv">
                <span className="tl__n">{n}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
                <div className="tl__img clip"><img src={img} alt={t} loading="lazy" style={{ objectPosition: "center 35%" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta title="Visitá nuestro showroom." text="Muestras de perfiles, vidrios y herrajes." maps={CONTACTO.maps} light />
    </Shell>
  );
}
