import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import NavProductos from "@/components/NavProductos";
import MenuMovil from "@/components/MenuMovil";


/*
  Barra de navegación del sitio: la misma en la home y en cada ficha.

  - Productos (desplegable con las cuatro líneas), Profesionales y Contacto.
  - Los enlaces a secciones van como "/#seccion": desde una ficha llevan a la
    home y bajan a esa sección; en la home, la propia home atiende el hash.
  - En la home arranca transparente sobre la portada clara y se vuelve sólida
    al scrollear. En las fichas la portada es una foto oscura, así que ahí va
    siempre sólida (`siempreSolida`).
  - "Pedir presupuesto" hace lo que le pase cada página (`onPresupuesto`); si
    no le pasan nada, lleva al formulario de la home.
  - El menú móvil vive acá, junto con el botón que lo abre.
*/
export default function BarraNav({ siempreSolida = false, onPresupuesto }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolleada, setScrolleada] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const iniciarSesion = () => navigate("/login");
  

  useEffect(() => {
    if (siempreSolida) return;
    const onScroll = () => setScrolleada(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [siempreSolida]);

  const solida = siempreSolida || scrolleada;
  const pedirPresupuesto = onPresupuesto || (() => navigate("/#contacto"));

  // En la home, el logo sube al principio en vez de "navegar" a la misma página
  const alLogo = (e) => {
    if (location.pathname === "/" && !location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <nav data-testid="main-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: solida ? "var(--aluva-white)" : "transparent",
        borderBottom: solida ? "1px solid var(--aluva-line)" : "1px solid transparent",
        transition: "background .3s ease, border-color .3s ease",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "18px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28,
        }}>
          <Link to="/" onClick={alLogo} aria-label="Aluva, inicio" data-testid="nav-logo" style={{ lineHeight: 0 }}>
            <Logo variant="dark" size={30} />
          </Link>

          <div className="nav-links" style={{ display: "flex", gap: 32, color: "var(--aluva-ink)" }}>
            <NavProductos />
            <Link data-testid="nav-link-profesionales" to="/#profesionales" className="nav-link" style={{ color: "inherit" }}>Profesionales</Link>
            <Link data-testid="nav-link-contacto" to="/#contacto" className="nav-link" style={{ color: "inherit" }}>Contacto</Link>
          </div>


          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={iniciarSesion}
              style={{
                padding: "8px 12px",
                fontSize: 11.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid",
                cursor: "pointer",
              }}
            >
              Iniciar Sesión
            </button>

            <button
              onClick={pedirPresupuesto}
              style={{
                padding: "8px 12px",
                fontSize: 11.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid var(--aluva-line)",
                cursor: "pointer",
                background: "rgb(6, 185, 0)",
              }}
            >
              Pedir presupuesto
            </button>
          </div>

          <button
            data-testid="nav-burger"
            className="nav-burger"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 8 }}
          >
            <span style={{ width: 22, height: 2, background: "rgba(14,42,26,0.06)" }} />
            <span style={{ width: 22, height: 2, background: "var(--aluva-ink)" }} />
          </button>
        </div>
      </nav>

      <MenuMovil abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
    </>
  );
}
