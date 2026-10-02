import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Acceso staff | Aluva",
  description: "Acceso interno del equipo de Aluva.",
  robots: { index: false, follow: false },
};

// Acceso interno: todavía deshabilitado, igual que en el sitio original.
export default function Staff() {
  return (
    <Shell active="staff" lightFooter>
      <section className="phero staff">
        <div className="wrap">
          <div className="staff__card rv">
            <img src="/brand/marca-negro-tagline.svg" alt="Aluva" width={200} height={50} />
            <h1>Acceso staff</h1>
            <p>Próximamente. Volvé al sitio mientras tanto.</p>
            <form className="staff__form">
              <input placeholder="Usuario" autoComplete="username" disabled />
              <input type="password" placeholder="Contraseña" autoComplete="current-password" disabled />
              <button className="btn btn--dark" type="submit" disabled>Ingresar <span className="arr">→</span></button>
            </form>
            <Link className="link-arrow" href="/">← Volver al sitio</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
