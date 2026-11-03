"use client";
/*
  Pantalla de carga: cortina verde con el ícono de marca dibujándose y una
  línea de progreso al mínimo. Sin nombre ni tagline: solo el logo.

  Secuencia: el filete del ícono se traza solo, el relleno aparece detrás y
  el filete se apaga dejando el ícono plano; una línea fina avanza abajo.
  Cuando la foto principal está lista (o pasado un tiempo máximo) la cortina
  sube y descubre la página. Recién en ese momento arranca la entrada
  de la portada (foto que se acomoda, título que sube): si arrancara antes,
  correría tapada por la cortina y no se vería.

  - Espera la foto principal (la imagen con fetchpriority alta) para que la
    portada no aparezca a medio cargar. Tiene mínimo y máximo: no parpadea en
    conexiones rápidas ni deja a nadie esperando en las lentas.

  - Va en el layout y no en cada página, así que corre una vez al abrir el
    sitio y NO se repite al navegar entre secciones.

  - Avisa con el evento "aluva:intro" cuando la cortina empieza a subir;
    SiteEffects lo escucha para disparar la entrada de la portada.

  Con prefers-reduced-motion no se muestra: el sitio aparece directo. Sin
  JavaScript, una animación de CSS la saca sola a los pocos segundos.
*/
import { useEffect, useState } from "react";

const MINIMO = 900;
const MAXIMO = 3000;
const SALIDA = 1100;
export const EVENTO_INTRO = "aluva:intro";

/** Promesa que se cumple cuando la foto principal de la página está lista para mostrarse. */
function fotoPrincipal(): Promise<void> {
  const img = document.querySelector<HTMLImageElement>('img[fetchpriority="high"]');
  if (!img) return Promise.resolve();
  if (img.complete) return img.decode().catch(() => {});
  return new Promise((ok) => {
    img.addEventListener("load", () => img.decode().catch(() => {}).then(() => ok()), { once: true });
    img.addEventListener("error", () => ok(), { once: true });
  });
}

export default function Intro() {
  const [fase, setFase] = useState<"carga" | "sale" | "fin">("carga");

  useEffect(() => {
    const root = document.documentElement;
    const avisar = () => dispatchEvent(new Event(EVENTO_INTRO));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFase("fin");
      avisar();
      return;
    }
    root.classList.add("intro-corriendo");
    let vivo = true;
    let tFin: ReturnType<typeof setTimeout>;
    const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const listo = Promise.all([espera(MINIMO), fotoPrincipal(), document.fonts?.ready]);
    Promise.race([listo, espera(MAXIMO)]).then(() => {
      if (!vivo) return;
      setFase("sale");
      root.classList.remove("intro-corriendo");
      avisar();
      tFin = setTimeout(() => setFase("fin"), SALIDA);
    });
    return () => {
      vivo = false;
      clearTimeout(tFin);
      root.classList.remove("intro-corriendo");
    };
  }, []);

  if (fase === "fin") return null;

  return (
    <div className={`intro${fase === "sale" ? " is-saliendo" : ""}`} aria-hidden="true">
      <div className="intro__centro">
        <span className="intro__halo" />
        {/* Mismo trazo que /brand/icon-principal.svg, dibujado en dos pasadas:
            primero el filete lima, después el relleno. Al terminar, el filete
            se apaga y queda el ícono plano de marca. */}
        <svg className="intro__iso" viewBox="0 0 325.36 277.57" focusable="false" aria-hidden="true">
          <polygon className="intro__relleno" points="242.77 162.68 210.47 194.99 130.37 114.9 152.02 157.86 114.9 194.99 82.59 162.68 162.68 82.59" />
          <polygon className="intro__trazo" points="242.77 162.68 210.47 194.99 130.37 114.9 152.02 157.86 114.9 194.99 82.59 162.68 162.68 82.59" />
        </svg>
        <span className="intro__linea"><span /></span>
      </div>
    </div>
  );
}
