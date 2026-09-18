import { useState } from "react";
import { Link } from "react-router-dom";
import AberturaRender from "@/components/AberturaRender";
import { PRODUCTOS } from "@/content/catalogo";

/*
  Colores y medidas — armada como una hoja de catálogo técnico.

  Tres partes: a la izquierda el índice numerado de las cuatro líneas; en el
  medio el producto dibujado sobre una grilla de plano, con las cotas que
  dicen "a medida" sin escribirlo; a la derecha el muestrario de terminaciones
  y la ficha corta (apertura, vidrio, medidas).

  El dibujo (AberturaRender) se pinta con la terminación elegida: no hay fotos,
  así cualquier color del catálogo se ve en el producto.
*/
const COLOR_BASE = "#2b2b2c";

function colorInicial(producto) {
  const item = (producto.colores || []).flatMap((g) => g.items).find(([, c]) => c);
  return item ? { nombre: item[0], color: item[1] } : { nombre: null, color: COLOR_BASE };
}

function Muestra({ color, grande = false }) {
  const fondo = color === "madera"
    ? "repeating-linear-gradient(100deg, #8a5a34 0 5px, #9b6a40 5px 9px, #7c4f2d 9px 12px)"
    : color;
  return <span className={`var-muestra${grande ? " es-grande" : ""}`} style={{ background: fondo }} aria-hidden="true" />;
}

export default function VariantesProductos() {
  const [activo, setActivo] = useState(0);
  const p = PRODUCTOS[activo];
  const [elegido, setElegido] = useState(() => colorInicial(PRODUCTOS[0]));

  const cambiarLinea = (i) => {
    setActivo(i);
    setElegido(colorInicial(PRODUCTOS[i]));
  };

  const sinColor = (p.colores || []).flatMap((g) => g.items).filter(([, c]) => !c);

  return (
    <section id="lineas" data-testid="variantes-productos" className="section section--paper">
      <div className="container">
        <p className="eyebrow"><span className="eyebrow-num">04</span>Colores y medidas</p>
        <h2 className="font-display section-title">
          Cada línea, <strong>a medida.</strong>
        </h2>

        <div className="var-hoja">
          {/* Índice de líneas */}
          <div className="var-indice" role="tablist" aria-label="Líneas de producto">
            {PRODUCTOS.map((prod, i) => (
              <button
                key={prod.id}
                type="button"
                role="tab"
                id={`var-tab-${prod.id}`}
                aria-selected={i === activo}
                aria-controls="var-panel"
                className={`var-item${i === activo ? " is-active" : ""}`}
                data-testid={`variantes-tab-${prod.id}`}
                onClick={() => cambiarLinea(i)}
              >
                <span className="var-item-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="var-item-txt">
                  <span className="var-item-linea">{prod.tituloLiviano}</span>
                  <span className="var-item-nombre">{prod.tituloFuerte}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Plano */}
          <div id="var-panel" role="tabpanel" aria-labelledby={`var-tab-${p.id}`} className="var-plano">
            <p className="var-plano-rot">{p.nombre}</p>
            <AberturaRender
              tipo={p.render}
              color={elegido.color}
              cotas
              titulo={elegido.nombre ? `${p.nombre} en ${elegido.nombre.toLowerCase()}` : p.nombre}
            />
          </div>

          {/* Muestrario */}
          <div className="var-muestrario">
            <p className="var-grupo-tit">Terminación</p>
            {elegido.nombre && (
              <p className="var-elegida">
                <Muestra color={elegido.color} grande />
                <span>{elegido.nombre}</span>
              </p>
            )}

            {p.colores?.filter((g) => g.items.some(([, c]) => c)).map((grupo) => (
              <div key={grupo.titulo} className="var-grupo">
                <p className="var-grupo-sub">{grupo.titulo}</p>
                <ul className="var-grilla">
                  {grupo.items.filter(([, c]) => c).map(([nombre, color]) => (
                    <li key={nombre}>
                      <button
                        type="button"
                        className={`var-chip${nombre === elegido.nombre ? " is-active" : ""}`}
                        aria-pressed={nombre === elegido.nombre}
                        data-testid={`variante-${p.id}-${nombre}`}
                        onClick={() => setElegido({ nombre, color })}
                      >
                        <Muestra color={color} />
                        <span>{nombre}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {sinColor.length > 0 && (
              <ul className="var-sin-color">
                {sinColor.map(([nombre]) => <li key={nombre}>{nombre}</li>)}
              </ul>
            )}

            <Link className="link-cta var-cta" to={`/productos/${p.id}`} data-testid={`variantes-ver-${p.id}`}>
              <span>Ver la línea</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
