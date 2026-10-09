import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import { Cta, Eyebrow, Pillars } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Empresa · Fábrica de aberturas en La Plata | Aluva",
  description: "Conocé Aluva: fábrica de aberturas de PVC, vidrio templado, aluminio y vidriería en La Plata. Nuestro proceso y servicio para profesionales.",
};

const PASOS = [
  ["01", "Consulta", "Asesoramiento técnico y presupuesto estimado.", "/photos/local-aluva.jpg"],
  ["02", "Medición", "Relevamiento en obra y presupuesto final.", "/photos/proceso-medicion.webp"],
  ["03", "Fabricación", "Corte, armado, herrajes y control en planta.", "/photos/proceso-fabricacion.webp"],
  ["04", "Instalación", "Colocación, sellado y regulación con equipo propio.", "/photos/proceso-instalacion.webp"],
];

export default function Empresa() {
  return (
    <Shell active="empresa">
      <section className="phero blueprint">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Empresa</span></div>
          <Eyebrow n="01">Nosotros</Eyebrow>
          <div className="phero__row">
            <h1 className="h-giant"><span>Fábrica</span></h1>
            <p className="lead">Aberturas de PVC, templados, aluminio y vidriería. La Plata.</p>
          </div>
        </div>
      </section>

      <section className="band">
        <img src="/og/producto-blindex.jpg" alt="Nuestro local, con aberturas de perfil negro en exhibición" loading="lazy" />
        <p className="band__cap">Nuestro local.</p>
      </section>

      <section className="section section--paper">
        <div className="wrap">
          <Eyebrow n="02">Lo que nos mueve</Eyebrow>
          <h2 className="h-lg rv">De punta<br />a punta.</h2>
          <Pillars items={[
            ["ruler", "Precisión", "Medición propia."],
            ["factory", "Producción", "Planta PVC y aluminio."],
            ["shield", "Materiales", "Perfiles y herrajes de primera."],
            ["tools", "Posventa", "Garantía y atención después de instalar."],
          ]} />
        </div>
      </section>

      <section className="section" id="proceso">
        <div className="wrap">
          <Eyebrow n="03">Cómo trabajamos</Eyebrow>
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

      <Cta title="Visitá la fábrica." text="Muestras de perfiles, vidrios y herrajes." light />
    </Shell>
  );
}
