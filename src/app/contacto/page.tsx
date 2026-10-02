import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import ContactForm from "@/components/ContactForm";
import { Eyebrow } from "@/components/blocks";
import { IClock, IMail, IPhone, IPin, WA } from "@/components/Icon";
import { CONTACTO, waLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto · Pedí tu presupuesto | Aluva La Plata",
  description: "Pedí presupuesto de aberturas de PVC, aluminio, DVH, mamparas y vidrio templado en La Plata. Respondemos por WhatsApp.",
};

export default function Contacto() {
  return (
    <Shell active="contacto">
      <section className="phero blueprint">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Contacto</span></div>
          <Eyebrow n="01">Presupuesto sin cargo</Eyebrow>
          <div className="phero__row">
            <h1 className="h-giant"><span>Hablemos</span></h1>
            <p className="lead">Respondemos por WhatsApp.</p>
          </div>
        </div>
        <div className="wrap contact" style={{ marginTop: 48 }}>
          <ContactForm />
          <div className="cards">
            <a className="ccard rv" href={waLink()} target="_blank" rel="noopener"><WA /><div><small>WhatsApp</small><b>{CONTACTO.telVisible}</b></div></a>
            <a className="ccard rv rv-d1" href={`tel:${CONTACTO.telLink}`}><IPhone /><div><small>Teléfono</small><b>{CONTACTO.telVisible}</b></div></a>
            <a className="ccard rv rv-d2" href={`mailto:${CONTACTO.email}`}><IMail /><div><small>Email</small><b>{CONTACTO.email}</b></div></a>
            <div className="ccard rv rv-d3"><IPin /><div><small>Fábrica</small><b>{CONTACTO.direccion}</b></div></div>
            <div className="ccard rv rv-d3"><IClock /><div><small>Horario</small><b>{CONTACTO.horario}</b></div></div>
          </div>
        </div>
      </section>

      <section className="section--tight section--paper">
        <div className="wrap">
          <div className="map rv">
            <iframe title="Mapa de La Plata" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=La+Plata,+Buenos+Aires&output=embed" />
          </div>
        </div>
      </section>
    </Shell>
  );
}
