import { Link, useNavigate } from "react-router-dom";
import { PRODUCTOS } from "@/content/catalogo";

/*
  Pie del sitio. Es el mismo en la home y en cada ficha de producto: cualquier
  cambio de datos de contacto o de líneas se hace una sola vez, acá.
*/
export default function Pie() {
  const navigate = useNavigate();

  return (
    <footer className="section section--ink" data-testid="pie" style={{ paddingBottom: 30 }}>
      <div className="container">
        <div className="pie-cabecera" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, paddingBottom: 48, borderBottom: "1px solid var(--line-ink)", marginBottom: 44 }}>
          <h2 className="font-display section-title" style={{ margin: 0 }}>
            Empezá tu proyecto hoy
          </h2>
          <a href="https://wa.me/5492216755077" target="_blank" rel="noopener noreferrer" className="btn-primary">
            Escribinos por WhatsApp
            <span className="arrow">→</span>
          </a>
        </div>
        <div className="pie-grilla" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 48, marginBottom: 44 }}>
          <div>
            <img className="pie-logo" src="/brand/marca-negativa-tagline-web.svg" alt="Aluva · Tecnología en aberturas" style={{ display: "block", width: "100%", maxWidth: 300, height: "auto", marginBottom: 22 }} />
            <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", lineHeight: 1.75, maxWidth: 260 }}>
              Fabricación propia de aberturas en PVC y aluminio. Perfilería VEKA Clase A.
            </p>
          </div>
          <div>
            <p className="eyebrow" style={{ color: "var(--aluva-green-soft)", marginBottom: 16 }}><span className="eyebrow-num" style={{ color: "var(--aluva-green-soft)" }}>—</span>Productos</p>
            {PRODUCTOS.map(p => (
              <Link key={p.id} to={`/productos/${p.id}`} data-testid={`pie-producto-${p.id}`} className="pie-link" style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", display: "block", textDecoration: "none", margin: "0 0 10px" }}>{p.nombre}</Link>
            ))}
          </div>
          <div>
            <p className="eyebrow" style={{ color: "var(--aluva-green-soft)", marginBottom: 16 }}><span className="eyebrow-num" style={{ color: "var(--aluva-green-soft)" }}>—</span>Contacto</p>
            <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", margin: "0 0 10px" }}>(221) 483-0222</p>
            <a href="https://wa.me/5492216755077" target="_blank" rel="noopener noreferrer" className="pie-link" style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", display: "block", textDecoration: "none", marginBottom: 10 }}>WhatsApp +54 9 221 675-5077</a>
            <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", margin: "0 0 10px" }}>info@aluva.com.ar</p>
            <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", margin: "0 0 10px" }}>7 N° 1714, La Plata, Buenos Aires</p>
            <p style={{ color: "var(--on-ink-32)", fontSize: 12, margin: 0 }}>Atención lunes a viernes de 8 a 18hs</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--line-ink)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <p style={{ color: "var(--on-ink-32)", fontSize: 12 }}>© {new Date().getFullYear()} Aluva · Todos los derechos reservados.</p>
          <button onClick={() => navigate("/login")} className="label pie-staff" style={{ color: "var(--on-ink-32)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Acceso staff</button>
        </div>
      </div>
    </footer>
  );
}
