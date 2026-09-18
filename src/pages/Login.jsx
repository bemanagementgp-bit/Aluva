import Logo from "@/components/Logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--aluva-ink)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: "var(--r-card)", padding: 40, boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>
        <Logo variant="dark" size={38} style={{ marginBottom: 24 }} />
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 400, margin: 0, letterSpacing: "var(--track-display)" }}>Acceso staff</h1>
        <p style={{ color: "var(--aluva-mute)", marginTop: 6, fontSize: 14 }}>Próximamente. Volvé al sitio mientras tanto.</p>
        <form onSubmit={(e) => { e.preventDefault(); alert("Login deshabilitado por ahora."); }} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
          <input className="al-input" placeholder="Usuario" value={u} onChange={(e) => setU(e.target.value)} />
          <input className="al-input" type="password" placeholder="Contraseña" value={p} onChange={(e) => setP(e.target.value)} />
          <button type="submit" className="btn-primary" style={{ justifyContent: "center" }}>Ingresar <span className="arrow">→</span></button>
        </form>
        <button onClick={() => navigate("/")} className="btn-ghost" style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>← Volver al sitio</button>
      </div>
    </div>
  );
}
