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

/* Las tres vias directas van en el mismo formato de tabla que el formulario:
   rotulo en celda gris a la izquierda, dato a la derecha. Un solo lenguaje
   para toda la pagina. */
const VIAS = [
  { icono: <WA />, rotulo: "WhatsApp", dato: CONTACTO.waVisible, href: waLink(), fuera: true, nota: "Respondemos en horario de atención" },
  { icono: <IPhone />, rotulo: "Teléfono", dato: CONTACTO.telVisible, href: `tel:${CONTACTO.telLink}`, fuera: false, nota: "Fábrica, La Plata" },
  { icono: <IMail />, rotulo: "Email", dato: CONTACTO.email, href: `mailto:${CONTACTO.email}`, fuera: false, nota: "Presupuestos y consultas" },
];

export default function Contacto() {
  return (
    <Shell active="contacto" lightFooter>
      {/* 01 · Sobre blanco: titulo, vias directas y formulario. El formato de
          toda la seccion es el de un formulario corporativo: filas con rotulo
          y dato, filetes finos, barras de seccion, mucho aire. */}
      <section className="phero section--paper cto">
        <div className="wrap">
          <div className="phero__crumbs"><Link href="/">Inicio</Link><span>/</span><span>Contacto</span></div>
          <Eyebrow n="01">Presupuesto sin cargo</Eyebrow>
          <div className="phero__row">
            <h1 className="h-giant"><span>Hablemos.</span></h1>
            <p className="lead">Contanos qué necesitás y te respondemos por WhatsApp. Medimos, fabricamos y colocamos con equipo propio.</p>
          </div>

          <div className="cto-bloque">
            <h2 className="form__titulo">Vías directas</h2>
            <dl className="cto-tabla rv">
              {VIAS.map((v) => (
                <div key={v.rotulo}>
                  <dt>{v.icono} {v.rotulo}</dt>
                  <dd>
                    <a href={v.href} {...(v.fuera ? { target: "_blank", rel: "noopener" } : {})}>{v.dato}</a>
                    <small>{v.nota}</small>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="cto-bloque cto-form">
            <h2 className="form__titulo">Formulario de presupuesto</h2>
            <p className="small cto-form__p">Cuantos más datos nos des, más preciso es el presupuesto. Podés adjuntar fotos o planos.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 02 · Sobre verde: donde estamos. La ficha usa la misma lista de
          especificaciones que la ficha tecnica de aluminio. */}
      <section className="section" id="donde">
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
                <a className="btn btn--lime" href={CONTACTO.maps} target="_blank" rel="noopener"><IPin /> Cómo llegar <span className="arr">→</span></a>
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
