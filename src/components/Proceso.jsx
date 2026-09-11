import FotoDiferida from "@/components/FotoDiferida";
import { PROCESO } from "@/content/catalogo";

/*
  Proceso de trabajo.

  La foto cuenta el paso; el texto solo lo nombra. Cada paso es una columna alta
  con la imagen a sangre, el numeral en un recuadro y dos líneas encima: el
  nombre del paso y un dato concreto. Nada de párrafos: si hace falta explicar
  más, eso va en las Preguntas frecuentes.

  En angosto las columnas pasan a un carrusel deslizable con la siguiente foto
  asomando por el borde, que es lo que invita a seguir.
*/
export default function Proceso({ onEmpezar }) {
  return (
    <section id="proceso" data-testid="proceso" className="section section--white proc">
      <div className="container proc-cabecera">
        <div>
          <p className="eyebrow"><span className="eyebrow-num">02</span>Proceso</p>
          <h2 className="font-display section-title section-title--wide proc-titulo">
            De la consulta a la obra terminada, <strong>con un solo responsable.</strong>
          </h2>
        </div>
        <button className="btn-primary" data-testid="proceso-cta" onClick={onEmpezar}>
          Empezar por la consulta
          <span className="arrow">→</span>
        </button>
      </div>

      <ol className="proc-pista">
        {PROCESO.map((paso, i) => (
          <li key={paso.titulo} className="proc-paso" data-testid={`proceso-paso-${i + 1}`}>
            <FotoDiferida src={paso.foto} alt={paso.alt} />
            <span className="proc-n">{String(i + 1).padStart(2, "0")}</span>
            <div className="proc-texto">
              <h3 className="font-display proc-nombre">{paso.titulo}</h3>
              <p className="proc-dato">{paso.dato}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
