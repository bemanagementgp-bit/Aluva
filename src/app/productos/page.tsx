import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import { Cta, Eyebrow } from "@/components/blocks";
import { Tipologias, Vitrinas } from "@/components/interactive";
import { LINEAS, TERMINACIONES } from "@/content/site";

export const metadata: Metadata = {
  title: "Nuestras aberturas | Aluva La Plata",
  description: "Aberturas de PVC, vidrio templado, aluminio y vidriería DVH a medida. Explorá tipologías y encontrá la abertura ideal.",
};

export default function Productos() {
  return (
    <Shell active="productos">
      <section className="showcase">
        <h1 className="showcase__title">Nuestras aberturas</h1>
        <Vitrinas lineas={LINEAS} />
      </section>

      <section className="section section--paper" id="tipologias">
        <div className="wrap">
          <Eyebrow n="02">Tipologías</Eyebrow>
          <h2 className="h-lg rv">Elegí cómo<br />se abre.</h2>
          <Tipologias />
        </div>
      </section>

      <section className="section" id="terminaciones">
        <div className="wrap">
          <Eyebrow n="03">Terminaciones</Eyebrow>
          <h2 className="h-lg rv">Elegí el color<br />de tus aberturas.</h2>
          <div className="term">
            {TERMINACIONES.map((l) => (
              <div key={l.nombre} className="term__row">
                <div className="term__head"><h3>{l.nombre}</h3><small>{l.sub}</small><Link className="link-arrow" href={l.href}>Ver línea <span>→</span></Link></div>
                <ul className="term__list">
                  {l.items.map(([n, bg]) => <li key={n} className="term__sw rv"><span style={{ background: bg }} /><b>{n}</b></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta title="Cotizá tu obra." text="Planos o medidas aproximadas." light />
    </Shell>
  );
}
