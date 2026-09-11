import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { PRODUCTOS } from "@/content/catalogo";

/*
  Menú móvil a pantalla completa. Es el mismo en la home y en las fichas de
  producto, y maneja su propia navegación: por eso los enlaces a secciones van
  como "/#seccion" (desde una ficha llevan a la home y bajan a esa sección; en
  la home, la propia home atiende el cambio de hash). Debajo de Productos
  aparecen las cuatro líneas, cada una a su ficha.

  Antes vivía copiado dentro de la home, y una copia pegada en la ficha sin su
  estado dejaba la página en blanco. Con un solo componente eso no se repite.
*/
const ENLACES = [
  { to: "/#productos", label: "Productos", conLineas: true },
  { to: "/#profesionales", label: "Profesionales" },
  { to: "/#contacto", label: "Contacto" },
];

export default function MenuMovil({ abierto, onCerrar }) {
  const navigate = useNavigate();
  if (!abierto) return null;

  return (
    <div data-testid="menu-movil" style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--aluva-ink)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 32px" }}>
        <Logo variant="light" size={30} />
        <button onClick={onCerrar} aria-label="Cerrar menú" style={{ background: "none", border: "none", color: "white", fontSize: 28, lineHeight: 1, cursor: "pointer" }}>×</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "0 32px" }}>
        {ENLACES.map((l) => (
          <div key={l.to} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <Link to={l.to} onClick={onCerrar} className="font-display" data-testid={`navm-${l.label.toLowerCase()}`} style={{ color: "white", textDecoration: "none", fontSize: 32, fontWeight: 700, letterSpacing: "var(--track-display)" }}>
              {l.label}
            </Link>
            {l.conLineas && (
              <div className="navm-sub" data-testid="navm-productos">
                {PRODUCTOS.map((p) => (
                  <Link key={p.id} to={`/productos/${p.id}`} onClick={onCerrar} data-testid={`navm-producto-${p.id}`}>{p.nombre}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => { onCerrar(); navigate("/login"); }}
          className="nav-link"
          style={{ marginTop: 14, background: "none", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 0, padding: "12px 22px", color: "white", width: "fit-content", cursor: "pointer" }}
        >
          Acceso staff
        </button>
      </div>
    </div>
  );
}
