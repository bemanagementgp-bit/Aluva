import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import ContactForm from "@/components/ContactForm";
import { Eyebrow } from "@/components/blocks";
import { IClock, IMail, IPhone, IPin, WA } from "@/components/Icon";
import { CONTACTO, waLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto · Pedí tu presupuesto | Aluva La Plata",
  description: "Pedí presupuesto de aberturas de PVC y aluminio, vidrio templado, DVH, mamparas y revestimientos en La Plata. Respondemos por WhatsApp.",
};

/* Las tres vias directas, para el que no quiere llenar un formulario. Van
   arriba del formulario, no al costado: en un telefono el costado no existe y
   terminaban debajo de todo, que es donde menos sirven. */
const VIAS = [
  { icono: <WA />, rotulo: "WhatsApp", dato: CONTACTO.waVisible, href: waLink(), fuera: true },
  { icono: <IPhone />, rotulo: "Teléfono", dato: CONTACTO.telVisible, href: `tel:${CONTACTO.telLink}`, fuera: false },
  { icono: <IMail />, rotulo: "Email", dato: CONTACTO.email, href: `mailto:${CONTACTO.email}`, fuera: false },
];

export default function Contacto() {
  return (
    <Shell active="contacto">
      {/* 01 · Portada y formulario, sobre verde. */}
      <section className="phero blueprint">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Contacto</span></div>
          <Eyebrow n="01">Presupuesto sin cargo</Eyebrow>
          <div className="phero__row">
            <h1 className="h-giant"><span>Hablemos.</span></h1>
            <p className="lead">Contanos qué necesitás y te respondemos por WhatsApp. Medimos, fabricamos y colocamos con equipo propio.</p>
          </div>

          {/* Las tres vias directas reusan la tarjeta de contacto que ya existe:
              trae resuelto el comportamiento en celular (a sangre, con filete
              entre una y otra, y el icono contra el margen derecho). */}
          <div className="cards cards--3 cto-vias">
            {VIAS.map((v, i) => (
              <a
                key={v.rotulo}
                className={`ccard rv rv-d${i}`}
                href={v.href}
                {...(v.fuera ? { target: "_blank", rel: "noopener" } : {})}
              >
                {v.icono}
                <div><small>{v.rotulo}</small><b>{v.dato}</b></div>
              </a>
            ))}
          </div>

          <div className="cto-form">
            <h2 className="h-md">O contanos tu proyecto.</h2>
            <p className="small cto-form__p">Cuantos más datos nos des, más preciso es el presupuesto. Podés adjuntar fotos o planos.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 02 · Donde estamos, sobre blanco: ficha de datos y mapa. */}
      <section className="section section--paper" id="donde">
        <div className="wrap">
          <Eyebrow n="02">Dónde estamos</Eyebrow>
          <div className="sec-title">
            <h2 className="h-lg rv">Fábrica<br />en La Plata.</h2>
            <p className="small">Acá se corta, se arma y se controla cada abertura. Coordinamos la visita por WhatsApp.</p>
          </div>
          <div className="cto-donde">
            <div className="rv">
              <dl className="specs cto-datos">
                <div><dt><IPin /> Fábrica</dt><dd>{CONTACTO.direccion}</dd></div>
                <div><dt><IClock /> Horario</dt><dd>{CONTACTO.horario}</dd></div>
                <div><dt><IPhone /> Teléfono</dt><dd><a href={`tel:${CONTACTO.telLink}`}>{CONTACTO.telVisible}</a></dd></div>
                <div><dt><IMail /> Email</dt><dd><a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a></dd></div>
              </dl>
              <div className="btn-row cto-botones">
                <a className="btn btn--dark" href={CONTACTO.maps} target="_blank" rel="noopener"><IPin /> Cómo llegar <span className="arr">→</span></a>
                <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noopener"><WA /> Escribinos</a>
              </div>
            </div>
            <div className="map rv">
              <iframe title="Ubicación de la fábrica de Aluva en La Plata" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Calle+7+1714+La+Plata+Buenos+Aires&output=embed" />
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
