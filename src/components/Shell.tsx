/* Estructura común de cada página: header, contenido, pie y WhatsApp flotante. */
import Link from "next/link";
import type { ReactNode } from "react";
import Header, { type Seccion } from "./Header";
import SiteEffects from "./SiteEffects";
import { WA } from "./Icon";
import { CONTACTO, LINEAS, waLink } from "@/content/site";

function Footer({ light }: { light: boolean }) {
  return (
    <footer className={light ? "ftr section--paper ftr--light" : "ftr"}>
      <div className="wrap">
        <p className="ftr__big" aria-hidden="true">Tecnología<br />en aberturas.</p>
        <div className="ftr__grid">
          <div>
            <Link className="ftr__logo" href="/"><img src="/brand/marca-principal-tagline-web.svg" alt="Aluva" width={260} height={40} /></Link>
            <p className="small" style={{ maxWidth: "34ch" }}>Fábrica de aberturas a medida · La Plata</p>
          </div>
          <div>
            <h4>Productos</h4>
            <ul>
              {LINEAS.map((l) => <li key={l.slug}><Link href={`/${l.slug}`}>{l.name}</Link></li>)}
              <li><Link href="/productos">Todas las aberturas</Link></li>
            </ul>
          </div>
          <div>
            <h4>Aluva</h4>
            <ul>
              <li><Link href="/empresa">Empresa</Link></li>
              <li><Link href="/empresa#proceso">Cómo trabajamos</Link></li>
              <li><Link href="/#profesionales">Profesionales</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
              <li><Link href="/staff">Acceso staff</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a href={`tel:${CONTACTO.telLink}`}>{CONTACTO.telVisible}</a></li>
              <li><a href={waLink()} target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a></li>
              <li><span className="small">{CONTACTO.direccion}</span></li>
            </ul>
          </div>
        </div>
        <div className="ftr__bottom">
          <span>© {new Date().getFullYear()} Aluva · Tecnología en aberturas. La Plata, Buenos Aires.</span>
        </div>
      </div>
    </footer>
  );
}

/**
 * @param active  sección marcada en el menú
 * @param lightFooter  el pie toma el tono contrario a la última sección
 */
export default function Shell({ active, lightFooter = false, children }: { active: Seccion; lightFooter?: boolean; children: ReactNode }) {
  return (
    <div className={`page-${active}`}>
      <Header active={active} />
      <main id="main">{children}</main>
      <Footer light={lightFooter} />
      <a className="wa" href={waLink()} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp"><WA /></a>
      <SiteEffects />
    </div>
  );
}
