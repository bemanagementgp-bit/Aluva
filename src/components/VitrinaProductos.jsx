import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import FotoDiferida from "@/components/FotoDiferida";
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
    <section id="productos" data-testid="vitrina-productos" className="vitrina">
      {/* ── Mitad izquierda: foto a sangre + sigla gigante ── */}
      <div className={`vit-foto${p.fotos.length ? "" : " sin-foto"}`}>
        {PRODUCTOS.map((prod, i) => prod.fotos[0] && (
          <FotoDiferida
            key={prod.id}
            src={prod.fotos[0].src}
            alt={`${prod.nombre} — ${prod.fotos[0].caption}`}
            className={i === activo ? "is-active" : ""}
          />
        ))}

        <p className="vit-volanta">
          Productos
          <span className="vit-regla" aria-hidden="true" />
        </p>

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
          {p.destacado && <p className="vit-destacado">{p.destacado.chip}</p>}

          <h2 className="font-display vit-titulo">
            <span className="vit-titulo-liviano">{p.tituloLiviano}</span>{" "}
            <strong>{p.tituloFuerte}</strong>
          </h2>

          <p className="vit-desc">{p.desc}</p>

          <ul className="vit-specs">
            {p.specs.map((s) => <li key={s} className="vit-spec">{s}</li>)}
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
  );
}
