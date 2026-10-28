import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import { Cta, Eyebrow, Pillars } from "@/components/blocks";
import { Esencia } from "@/components/interactive";
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
      {/* 01 Nosotros: carta de presentación de la marca, con la estructura de
          https://hitachicm.com.au/landcros-australia/ que eligió el cliente:
          presentación centrada, frase tipográfica grande y bloque partido
          (panel con pestañas + foto). Solo datos confirmados. */}
      <section className="nos-intro section--paper">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Empresa</span></div>
          <div className="nos-intro__c">
            <p className="nos-intro__ey">01 · Nosotros</p>
            <span className="nos-intro__regla" aria-hidden="true" />
            <h1 className="nos-intro__t"><b>Aluva</b><br />más de 20 años fabricando aberturas</h1>
            <p className="nos-intro__p">Desde hace más de 20 años fabricamos e instalamos aberturas a medida. En nuestra planta de La Plata producimos aberturas de PVC y aluminio, DVH, vidriería, templados y revestimientos, y las colocamos con nuestro propio equipo. La misma gente, el mismo compromiso, obra tras obra.</p>
          </div>
        </div>
        <p className="nos-intro__big" aria-hidden="true">Fabricamos<br />lo que<br />instalamos.</p>
      </section>

      <section className="esencia">
        <Esencia />
        <figure className="esencia__fig">
          <img src="/photos/proceso-fabricacion.webp" alt="Mecanizado de un perfil en nuestra planta" loading="lazy" />
        </figure>
        <p className="esencia__label" aria-hidden="true">Nuestra esencia</p>
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
