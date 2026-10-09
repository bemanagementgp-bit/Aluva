"use client";
/*
  Pantalla de carga: el sitio se abre a través de la forma del logo.

  Secuencia: fondo verde pleno con el galón de Aluva en lima, y enseguida ese
  mismo galón se convierte en un hueco que crece hasta descubrir la página.

  Dos decisiones que vale aclarar:

  - La forma sale de /brand/icon-principal.svg, el archivo de marca, usado como
    máscara. No es una copia del contorno: si mañana cambia el isotipo, la
    intro cambia sola. Un SVG redibujado a mano se desincroniza el día que
    nadie está mirando.

  - Va en el layout y no en cada página, así que corre una vez al abrir el
    sitio y NO se repite al navegar entre secciones. Eso es lo que la hace
    tolerable: una cortina que aparece en cada clic es un peaje.

  Con prefers-reduced-motion no se monta nada: el sitio aparece directo.
*/
import { useEffect, useState } from "react";

const DURACION = 2000;

export default function Intro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Si la persona pidió menos movimiento, la cortina se saca al instante.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    document.documentElement.classList.add("intro-corriendo");
    const t = setTimeout(() => {
      setVisible(false);
      document.documentElement.classList.remove("intro-corriendo");
    }, DURACION);
    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove("intro-corriendo");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="intro" aria-hidden="true">
    </div>
  );
}
