import { useState } from "react";
import { FAQ } from "@/content/catalogo";

/*
  Preguntas frecuentes.

  Mismo lenguaje que la cinta: numeral, filete y nada de cajas. Se abre de a una
  para que la sección no crezca sin control.
*/
export default function Faq() {
  const [abierta, setAbierta] = useState(0);

  return (
    <section id="faq" data-testid="faq" className="section section--white">
      <div className="container">
        <p className="eyebrow"><span className="eyebrow-num">05</span>Preguntas frecuentes</p>
        <h2 className="font-display section-title section-title--wide">
          Lo que casi siempre nos preguntan antes de empezar.
        </h2>

        <div className="faq-lista">
          {FAQ.map((f, i) => {
            const activa = i === abierta;
            return (
              <div key={f.p} className={`faq-item${activa ? " is-abierta" : ""}`}>
                <button
                  type="button"
                  className="faq-boton"
                  data-testid={`faq-${i}`}
                  aria-expanded={activa}
                  onClick={() => setAbierta(activa ? -1 : i)}
                >
                  <span className="faq-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq-pregunta font-display">{f.p}</span>
                  <span className="faq-signo" aria-hidden="true" />
                </button>
                <div className="faq-cuerpo" hidden={!activa}>
                  <p>{f.r}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
