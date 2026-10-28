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
      <section className="phero blueprint">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Empresa</span></div>
          {/* 01 Nosotros va antes de Fábrica (revisión del cliente, 2026-10-28) */}
          <Eyebrow n="01">Nosotros</Eyebrow>
          <div className="phero__row">
            <h1 className="h-giant"><span>Aluva</span></h1>
            <p className="lead">Más de 20 años de trayectoria en el mercado, fabricando e instalando aberturas a medida.</p>
          </div>
          <div className="nos">
            <p>Fabricamos en nuestra planta de La Plata aberturas de PVC y aluminio, DVH, vidriería, templados y revestimientos. Medimos, fabricamos y colocamos con personal propio: un mismo equipo de principio a fin.</p>
            <dl className="nos__datos">
              <div><dt>+20 años</dt><dd>de trayectoria en el mercado</dd></div>
              <div><dt>Planta propia</dt><dd>en La Plata</dd></div>
              <div><dt>Equipo propio</dt><dd>de medición y colocación</dd></div>
            </dl>
          </div>
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
