import FotoDiferida from "@/components/FotoDiferida";
import { PROFESIONALES } from "@/content/catalogo";

/*
  Sección para profesionales: arquitectos, estudios y constructoras.

  Es el objetivo comercial número uno del año y la única sección que le habla a
  ese público. Usa el recurso de la palabra gigante de Hitachi CM ("ORANGE
  FAMILY"): la palabra en verde de marca ocupa todo el ancho, abajo un filete
  corto, un titular de peso mixto y cuatro razones de una línea.

  Un único elemento gráfico: el perfil del sistema de PVC en dibujo de línea,
  al costado (se genera desde la foto de despiece del catálogo). Da el tono
  técnico de obra sin sumar texto ni alargar la sección.

  Todo lo que dice está confirmado en el brief.
*/
export default function Profesionales() {
  return (
    <section id="profesionales" data-testid="profesionales" className="section pro">
      <FotoDiferida className="pro-perfil" src="/photos/pvc-despiece-lineas.webp" alt="" aria-hidden="true" />

      <div className="container pro-in">
        <p className="eyebrow" style={{ color: "var(--aluva-green-soft)" }}>
          <span className="eyebrow-num">03</span>Arquitectos · Estudios · Constructoras
        </p>

        <span className="pro-palabra" aria-hidden="true">Profesionales</span>
        <span className="pro-regla" aria-hidden="true" />

        <h2 className="font-display pro-bajada">
          Un proveedor que <strong>fabrica lo que vende.</strong>
        </h2>

        <ul className="pro-puntos">
          {PROFESIONALES.map((p) => (
            <li key={p.titulo} className="pro-punto">
              <p className="label pro-punto-etq">{p.titulo}</p>
              <p className="pro-punto-txt">{p.texto}</p>
            </li>
          ))}
        </ul>

        <div className="pro-acciones">
          <a
            className="btn-primary"
            href="mailto:ventas@aluva.com.ar?subject=Consulta%20profesional"
            data-testid="pro-mail"
          >
            Escribir a ventas
            <span className="arrow">→</span>
          </a>
          <a
            className="pro-link"
            href="https://wa.me/5492216755077"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="pro-whatsapp"
          >
            WhatsApp +54 9 221 675-5077
          </a>
        </div>

        <p className="pro-zona">Trabajamos en La Plata y alrededores.</p>
      </div>
    </section>
  );
}
