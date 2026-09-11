import { useEffect, useState } from "react";
import FotoDiferida from "@/components/FotoDiferida";
import Reveal from "@/components/Reveal";
import { OBRAS } from "@/content/catalogo";

/*
  Sección Obras — índice + lámina técnica.

  Desktop: arriba el índice de obras (una fila por obra, como el registro de un
  archivo) y debajo la lámina de la obra elegida: la foto con su cota y, al pie,
  el cajetín con los datos en celdas, como el rótulo de un plano.
  Mobile: sin índice interactivo — las láminas se apilan, cada una con su cajetín.

  Los datos salen de content/catalogo.js.
*/

const BREAKPOINT = "(min-width: 981px)";

export default function ObrasSection() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(BREAKPOINT).matches
  );
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(BREAKPOINT);
    const onChange = (e) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const obra = OBRAS[activa];

  return (
    <section
      id="trabajos"
      data-testid="obras-section"
      className="section section--paper"
    >
      <div className="container">
        <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div>
            <p className="eyebrow"><span className="eyebrow-num">05</span>Obras</p>
            <h2 className="font-display section-title section-title--wide">
              Obras recientes.
            </h2>
          </div>
          <p style={{ maxWidth: 320, color: "var(--aluva-mute)", fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>
            Cada obra con su ficha: dónde, qué sistema y cuántas aberturas se fabricaron e instalaron.
          </p>
        </Reveal>

        {desktop ? (
          <>
            {/* Índice */}
            <div className="obra-indice" role="list">
              {OBRAS.map((o, i) => (
                <button
                  key={o.id}
                  role="listitem"
                  data-testid={`obra-fila-${o.id}`}
                  className={`obra-fila ${i === activa ? "is-active" : ""}`}
                  aria-current={i === activa}
                  onMouseEnter={() => setActiva(i)}
                  onFocus={() => setActiva(i)}
                  onClick={() => setActiva(i)}
                >
                  <span className="obra-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="obra-nombre">{o.nombre}</span>
                  <span className="obra-dato">{o.localidad}</span>
                  <span className="obra-dato obra-dato-mute">{o.sistema}</span>
                  <span className="obra-anio">{o.anio}</span>
                  <span className="obra-flecha" aria-hidden="true">→</span>
                </button>
              ))}
            </div>

            {/* Lámina de la obra activa */}
            <figure className="obra-lamina" data-testid="obra-lamina">
              <div className="obra-foto">
                {OBRAS.map((o, i) => (
                  <FotoDiferida
                    key={o.id}
                    src={o.foto}
                    alt={`${o.nombre} · ${o.localidad}`}
                    className={i === activa ? "is-active" : ""}
                  />
                ))}
                <span className="obra-cota">{obra.medida}</span>
                <span className="obra-ref">Obra {String(activa + 1).padStart(2, "0")} / {String(OBRAS.length).padStart(2, "0")}</span>
              </div>

              <figcaption className="obra-cajetin">
                <Celda rotulo="Obra" valor={obra.nombre} />
                <Celda rotulo="Localidad" valor={obra.localidad} />
                <Celda rotulo="Sistema" valor={obra.sistema} />
                <Celda rotulo="Aberturas" valor={obra.aberturas} />
                <Celda rotulo="Año" valor={obra.anio} />
              </figcaption>
            </figure>
          </>
        ) : (
          // Mobile: las láminas se apilan
          <div className="obra-pila">
            {OBRAS.map((o, i) => (
              <figure key={o.id} className="obra-lamina" data-testid={`obra-lamina-${o.id}`}>
                <div className="obra-foto">
                  <FotoDiferida src={o.foto} alt={`${o.nombre} · ${o.localidad}`} className="is-active" />
                  <span className="obra-cota">{o.medida}</span>
                  <span className="obra-ref">Obra {String(i + 1).padStart(2, "0")} / {String(OBRAS.length).padStart(2, "0")}</span>
                </div>
                <figcaption className="obra-cajetin">
                  <Celda rotulo="Obra" valor={o.nombre} />
                  <Celda rotulo="Localidad" valor={o.localidad} />
                  <Celda rotulo="Sistema" valor={o.sistema} />
                  <Celda rotulo="Aberturas" valor={o.aberturas} />
                  <Celda rotulo="Año" valor={o.anio} />
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Celda({ rotulo, valor }) {
  return (
    <div className="obra-celda">
      <span className="obra-rotulo">{rotulo}</span>
      <span className="obra-valor">{valor || "—"}</span>
    </div>
  );
}
