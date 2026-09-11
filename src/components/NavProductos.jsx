import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTOS } from "@/content/catalogo";

/*
  "Productos" en la barra: un desplegable con las cuatro líneas, cada una lleva
  a su ficha. Se abre al pasar el mouse o con clic/teclado; Escape, clic afuera
  o salir con Tab lo cierran. Canto vivo y filete verde arriba, como el resto
  del sitio.
*/
const PANEL_ID = "nav-productos-panel";

export default function NavProductos() {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef(null);
  const boton = useRef(null);
  const cierre = useRef(0);
  const hover = useRef(0);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e) => { if (raiz.current && !raiz.current.contains(e.target)) setAbierto(false); };
    const tecla = (e) => {
      if (e.key === "Escape") { setAbierto(false); boton.current?.focus(); }
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  useEffect(() => () => clearTimeout(cierre.current), []);

  const abrirPorHover = () => {
    clearTimeout(cierre.current);
    hover.current = Date.now();
    setAbierto(true);
  };
  // Pequeña demora al salir: da tiempo a llevar el mouse del botón al panel
  const cerrarPronto = () => {
    clearTimeout(cierre.current);
    cierre.current = setTimeout(() => setAbierto(false), 160);
  };
  // Si el hover acaba de abrirlo, el clic que sigue no debe cerrarlo
  const alternar = () => {
    if (abierto && Date.now() - hover.current < 400) return;
    setAbierto((v) => !v);
  };

  return (
    <div
      ref={raiz}
      className={`navp${abierto ? " is-abierto" : ""}`}
      onMouseEnter={abrirPorHover}
      onMouseLeave={cerrarPronto}
      onBlur={(e) => { if (raiz.current && !raiz.current.contains(e.relatedTarget)) setAbierto(false); }}
    >
      <button
        ref={boton}
        type="button"
        className="nav-link navp-boton"
        aria-haspopup="true"
        aria-expanded={abierto}
        aria-controls={PANEL_ID}
        data-testid="nav-productos"
        onClick={alternar}
      >
        Productos
        <span className="navp-flecha" aria-hidden="true" />
      </button>

      {abierto && (
        <div id={PANEL_ID} className="navp-panel" data-testid="nav-productos-panel">
          <ul className="navp-lista">
            {PRODUCTOS.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/productos/${p.id}`}
                  className="navp-item"
                  data-testid={`nav-producto-${p.id}`}
                  onClick={() => setAbierto(false)}
                >
                  <span className="navp-nombre">{p.nombre}</span>
                  <span className="navp-ir" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/#productos" className="navp-todas" onClick={() => setAbierto(false)}>
            Ver todas las líneas
          </Link>
        </div>
      )}
    </div>
  );
}
