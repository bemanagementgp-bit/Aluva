import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import FotoDiferida from "@/components/FotoDiferida";
import VentanaCorrediza, { FOTO_CORREDIZA } from "@/components/VentanaCorrediza";
import { PRODUCTOS } from "@/content/catalogo";

/*
  Vitrina de productos — patrón "Product Range" de Hitachi CM.

  Pantalla partida: la foto ocupa la mitad izquierda a sangre y la sigla de la
  línea entra en tamaño enorme por el borde inferior, cortada por el viewport.
  La mitad derecha es un panel oscuro con la ficha centrada. Entre las dos
  mitades, las flechas en recuadro; abajo, los puntos de paginado.

  Los recursos que hacen a ese diseño y que se reusan en el resto del sitio:
  la volanta centrada con su filete corto, el titular de peso mixto y las
  flechas cuadradas (nunca circulares).
*/
export default function VitrinaProductos({ onPresupuesto }) {
  const [activo, setActivo] = useState(0);
  const total = PRODUCTOS.length;
  const p = PRODUCTOS[activo];

  const ir = useCallback((delta) => {
    setActivo((i) => (i + delta + total) % total);
  }, [total]);

  return (
    <>
    <section id="productos" data-testid="vitrina-productos" data-nav="oscuro" className="vitrina">
      {/* ── Mitad izquierda: foto a sangre + sigla gigante ── */}
      <div className={`vit-foto${p.fotos.length ? "" : " sin-foto"}`}>
        {PRODUCTOS.map((prod, i) => {
          const foto = prod.fotos[0];
          if (!foto) return null;
          const alt = foto.caption ? `${prod.nombre} — ${foto.caption}` : prod.nombre;
          // La corrediza de PVC se abre arrastrando la hoja (ver VentanaCorrediza)
          if (foto.src === FOTO_CORREDIZA) {
            return <VentanaCorrediza key={prod.id} activa={i === activo} alt={alt} />;
          }
          return (
            <FotoDiferida
              key={prod.id}
              src={foto.src}
              alt={alt}
              className={i === activo ? "is-active" : ""}
            />
          );
        })}

        <span key={`s-${p.id}`} className="vit-sigla" aria-hidden="true">{p.sigla}</span>
        {p.fotos[0] && <span className="vit-pie">{p.fotos[0].caption}</span>}
      </div>

      {/* ── Flechas, sobre la juntura de las dos mitades ── */}
      <div className="vit-flechas">
        <button type="button" className="vit-flecha" onClick={() => ir(-1)} data-testid="vitrina-prev" aria-label="Línea anterior">‹</button>
        <button type="button" className="vit-flecha" onClick={() => ir(1)} data-testid="vitrina-next" aria-label="Línea siguiente">›</button>
      </div>

      {/* ── Mitad derecha: ficha ── */}
      <div className="vit-ficha">
        <div className="vit-puntos" role="tablist" aria-label="Líneas de producto">
          {PRODUCTOS.map((prod, i) => (
            <button
              key={prod.id}
              type="button"
              role="tab"
              aria-selected={i === activo}
              aria-label={prod.nombre}
              data-testid={`vitrina-tab-${prod.id}`}
              className={`vit-punto${i === activo ? " is-active" : ""}`}
              onClick={() => setActivo(i)}
            />
          ))}
        </div>

        <div key={`f-${p.id}`} className="vit-ficha-interior">
          <p className="vit-linea">{p.linea}</p>

          <h2 className="font-display vit-titulo">
            <span className="vit-titulo-liviano">{p.tituloLiviano}</span>{" "}
            <strong>{p.tituloFuerte}</strong>
          </h2>

          <ul className="vit-specs">
            {p.specs.filter((s) => s && String(s).trim()).map((s) => <li key={s} className="vit-spec">{s}</li>)}
          </ul>

          <div className="vit-acciones">
            <Link className="vit-cta vit-cta--fuerte" to={`/productos/${p.id}`} data-testid={`vitrina-ver-${p.id}`}>
              Ver la línea
            </Link>
            <button className="vit-cta" data-testid="vitrina-cta" onClick={() => onPresupuesto?.(p)}>
              Pedir presupuesto
            </button>
          </div>
        </div>

        <span className="vit-contador" aria-hidden="true">
          {String(activo + 1).padStart(2, "0")} <i>/</i> {String(total).padStart(2, "0")}
        </span>
      </div>
    </section>

    {/* Filete verde claro bajo la muesca inferior: separa la vitrina de la
        sección siguiente, igual que el del hero la separa de la portada */}
    <div className="vit-filete" aria-hidden="true" />
    </>
  );
}
