import { useEffect, useRef, useState } from "react";

/*
  <img loading="lazy"> no alcanza: el umbral de Chrome es una heuristica que
  depende de la conexion, y con fibra pide igual todo lo que este a ~3000px del
  viewport. En la home eso significaba bajar las fotos de Productos y Obras
  mientras el hero todavia estaba pintando.

  Este componente no pone el src hasta que la imagen entra en un margen acotado
  (por defecto 400px), asi el navegador no puede adelantarse. Mantiene
  loading="lazy" como red de seguridad y decoding="async" para no bloquear el
  hilo principal al pintar.
*/
export default function FotoDiferida({ src, alt, margen = "400px", ...rest }) {
  const ref = useRef(null);
  const [pedir, setPedir] = useState(false);

  useEffect(() => {
    if (pedir) return;
    const el = ref.current;
    if (!el) return;

    // Sin IntersectionObserver (navegadores viejos) cargamos de una: es
    // preferible una foto de mas que una imagen que nunca aparece.
    if (typeof IntersectionObserver === "undefined") {
      setPedir(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setPedir(true);
        io.disconnect();
      },
      { rootMargin: margen }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pedir, margen]);

  return (
    <img
      ref={ref}
      src={pedir ? src : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  );
}
