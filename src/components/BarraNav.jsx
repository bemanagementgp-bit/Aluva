import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import NavProductos from "@/components/NavProductos";
import MenuMovil from "@/components/MenuMovil";


/*
  Barra de navegación del sitio: la misma en la home y en cada ficha.

  - Productos (desplegable con las cuatro líneas), Profesionales y Contacto.
  - Los enlaces a secciones van como "/#seccion": desde una ficha llevan a la
    home y bajan a esa sección; en la home, la propia home atiende el hash.
  - Se adapta a la sección que tiene debajo: toma su color de fondo y elige
    texto, logo y botones para ese fondo (claro, oscuro o verde de marca).
    Una sección puede fijar el tono con data-nav="claro" | "oscuro" cuando su
    fondo no es un color liso (degradé, foto).
  - En la home arranca transparente sobre la portada y se vuelve sólida al
    scrollear; en las fichas va siempre sólida (`siempreSolida`).
  - "Pedir presupuesto" hace lo que le pase cada página (`onPresupuesto`); si
    no le pasan nada, lleva al formulario de la home.
  - El menú móvil vive acá, junto con el botón que lo abre.
*/

const TONOS = {
  claro: {
    texto: "var(--aluva-ink)", borde: "var(--aluva-line)", logo: undefined,
    login: "rgba(14, 42, 26, 0.45)", presupFondo: "rgb(6, 185, 0)", presupTexto: "var(--aluva-ink)",
  },
  oscuro: {
    texto: "var(--on-ink)", borde: "var(--line-ink)", logo: "#ffffff",
    login: "rgba(255, 255, 255, 0.45)", presupFondo: "rgb(6, 185, 0)", presupTexto: "var(--aluva-ink)",
  },
  // Sobre el verde de marca el logo y el botón verdes se perderían
  verde: {
    texto: "var(--aluva-ink)", borde: "rgba(14, 42, 26, 0.2)", logo: "var(--aluva-ink)",
    login: "rgba(14, 42, 26, 0.45)", presupFondo: "var(--aluva-ink)", presupTexto: "var(--aluva-white)",
  },
};
const FONDO_MARCADO = { claro: "var(--aluva-white)", oscuro: "var(--aluva-ink)" };

// Color de fondo del bloque (sección, portada o pie) que está bajo la barra
function leerFondo(el) {
  const bloque = el.closest("[data-nav], section, header, footer") || el;
  const marcado = bloque.closest("[data-nav]");
  if (marcado) {
    const tono = marcado.getAttribute("data-nav") === "oscuro" ? "oscuro" : "claro";
    return { tono, fondo: FONDO_MARCADO[tono] };
  }
  for (let n = bloque; n && n !== document.documentElement; n = n.parentElement) {
    const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
    if (!m || (m.length === 4 && Number(m[3]) < 0.5)) continue;
    const [r, g, b] = m.slice(0, 3).map(Number);
    const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const luz = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const tono = g > 150 && r < 140 && b < 90 ? "verde" : luz < 0.2 ? "oscuro" : "claro";
    return { tono, fondo: `rgb(${r}, ${g}, ${b})` };
  }
  return { tono: "claro", fondo: "var(--aluva-white)" };
}

export default function BarraNav({ siempreSolida = false, onPresupuesto }) {
  const navigate = useNavigate();
  const location = useLocation();
  const barra = useRef(null);
  const [scrolleada, setScrolleada] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [debajo, setDebajo] = useState({ tono: "claro", fondo: "var(--aluva-white)" });
  const iniciarSesion = () => navigate("/login");

  // Mira qué hay justo debajo del borde inferior de la barra
  const medir = useCallback(() => {
    const nav = barra.current;
    if (!nav || typeof document.elementsFromPoint !== "function") return;
    const y = nav.getBoundingClientRect().bottom + 1;
    const el = document.elementsFromPoint(window.innerWidth / 2, y).find((e) => !nav.contains(e));
    if (!el) return;
    const nuevo = leerFondo(el);
    setDebajo((v) => (v.tono === nuevo.tono && v.fondo === nuevo.fondo ? v : nuevo));
  }, []);

  useEffect(() => {
    let cuadro = 0;
    const onScroll = () => {
      if (!siempreSolida) setScrolleada(window.scrollY > 40);
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(medir);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [siempreSolida, medir]);

  // Al cambiar de página (o de ficha) vuelve a medir cuando la página nueva ya pintó
  useLayoutEffect(() => {
    const t = setTimeout(medir, 60);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash, medir]);

  const solida = siempreSolida || scrolleada;
  const t = TONOS[debajo.tono];
  const pedirPresupuesto = onPresupuesto || (() => navigate("/#contacto"));

  // En la home, el logo sube al principio en vez de "navegar" a la misma página
  const alLogo = (e) => {
    if (location.pathname === "/" && !location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const transicion = "background-color .35s ease, border-color .35s ease, color .35s ease";

  return (
    <>
      <nav ref={barra} data-testid="main-nav" data-tono={debajo.tono} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: solida ? debajo.fondo : "transparent",
        borderBottom: `1px solid ${solida ? t.borde : "transparent"}`,
        color: t.texto,
        transition: transicion,
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "18px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28,
        }}>
          <Link to="/" onClick={alLogo} aria-label="Aluva, inicio" data-testid="nav-logo" style={{ lineHeight: 0 }}>
            <Logo variant="dark" size={30} style={t.logo ? { color: t.logo, transition: "color .35s ease" } : { transition: "color .35s ease" }} />
          </Link>

          <div className="nav-links" style={{ display: "flex", gap: 32, color: "inherit" }}>
            <NavProductos />
            <Link data-testid="nav-link-profesionales" to="/#profesionales" className="nav-link" style={{ color: "inherit" }}>Profesionales</Link>
            <Link data-testid="nav-link-contacto" to="/#contacto" className="nav-link" style={{ color: "inherit" }}>Contacto</Link>
          </div>


          <div className="nav-desktop-only" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={pedirPresupuesto}
              style={{
                padding: "9px 16px",
                borderRadius: 999,
                fontSize: 11.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: `1px solid ${t.presupFondo}`,
                cursor: "pointer",
                background: t.presupFondo,
                color: t.presupTexto,
                transition: transicion,
              }}
            >
              Pedir presupuesto
            </button>

            <button
              onClick={iniciarSesion}
              style={{
                padding: "9px 16px",
                borderRadius: 999,
                fontSize: 11.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: `1px solid ${t.login}`,
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
                transition: transicion,
              }}
            >
              Staff
            </button>
          </div>

          <button
            data-testid="nav-burger"
            className="nav-burger"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 8 }}
          >
            <span style={{ width: 22, height: 2, background: "currentColor" }} />
            <span style={{ width: 22, height: 2, background: "currentColor" }} />
          </button>
        </div>
      </nav>

      <MenuMovil abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
    </>
  );
}
