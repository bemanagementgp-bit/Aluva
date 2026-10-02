"use client";
/*
  Header: barra fija que toma el tono (claro u oscuro) de la sección que
  tiene debajo. Incluye el desplegable de Productos y el menú de celular.
*/
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CONTACTO, LINEAS, waLink } from "@/content/site";
import { Chev, WA } from "./Icon";

export type Seccion = "inicio" | "productos" | "pvc" | "aluminio" | "vidrieria" | "templados" | "empresa" | "contacto" | "staff";

export default function Header({ active }: { active: Seccion }) {
  const [light, setLight] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const cur = (k: Seccion) => (k === active ? { "aria-current": "page" as const } : {});
  const prodActive = ["productos", "pvc", "aluminio", "vidrieria", "templados"].includes(active);

  // Tono según la sección que queda debajo de la barra
  useEffect(() => {
    let ticking = false;
    const check = () => {
      ticking = false;
      const probe = 40;
      const blocks = document.querySelectorAll<HTMLElement>("main > section, main > div, footer");
      const under = [...blocks].find((b) => { const r = b.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
      setLight(!!under && under.classList.contains("section--paper"));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", check);
    check();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", check); };
  }, [pathname]);

  // Menú de celular: bloquea el scroll de la página
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menu);
    return () => document.documentElement.classList.remove("menu-open");
  }, [menu]);

  useEffect(() => { setMenu(false); setDrop(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setDrop(false); } };
    const onClick = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDrop(false); };
    addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, []);

  return (
    <>
      <header className={`hdr${light ? " on-light" : ""}`}>
        <div className="hdr__in">
          <Link className="hdr__logo" href="/" aria-label="Aluva — inicio">
            <img className="logo-d" src="/brand/marca-negativa-tagline-web.svg" alt="Aluva · Tecnología en aberturas" width={200} height={30} />
            <img className="logo-l" src="/brand/marca-negro-tagline-web.svg" alt="" width={200} height={30} />
          </Link>
          <nav className="nav" aria-label="Principal">
            <Link href="/" {...cur("inicio")}>Inicio</Link>
            <div ref={dropRef} className={`nav__drop${prodActive ? " is-current" : ""}${drop ? " is-open" : ""}`} onMouseLeave={() => setDrop(false)}>
              <button type="button" aria-haspopup="true" aria-expanded={drop} onClick={() => setDrop((d) => !d)}>Productos <Chev /></button>
              <div className="mega">
                {LINEAS.map((l) => (
                  <Link key={l.slug} href={`/${l.slug}`}><b>{l.name}</b><small>{l.short}</small></Link>
                ))}
                <Link className="mega__all" href="/productos">Ver todas las aberturas <span>→</span></Link>
              </div>
            </div>
            <Link href="/empresa" {...cur("empresa")}>Empresa</Link>
            <Link href="/contacto" {...cur("contacto")}>Contacto</Link>
          </nav>
          <div className="hdr__cta">
            <Link className="btn btn--lime" href="/contacto">Pedí presupuesto <span className="arr">→</span></Link>
            <Link className="btn btn--white" href="/staff">Staff</Link>
            <button className="burger" type="button" aria-label={menu ? "Cerrar menú" : "Abrir menú"} aria-expanded={menu} onClick={() => setMenu((m) => !m)}><span /><span /></button>
          </div>
        </div>
      </header>
      <div className="mnav" aria-label="Menú">
        <div>
          <ol>
            <li><Link href="/" {...cur("inicio")}>Inicio</Link></li>
            <li><Link href="/productos" {...cur("productos")}>Productos</Link></li>
          </ol>
          <div className="mnav__sub">
            {LINEAS.map((l) => <Link key={l.slug} href={`/${l.slug}`}>{l.name}</Link>)}
          </div>
          <ol start={3} style={{ counterReset: "m 2" }}>
            <li><Link href="/empresa" {...cur("empresa")}>Empresa</Link></li>
            <li><Link href="/contacto" {...cur("contacto")}>Contacto</Link></li>
          </ol>
        </div>
        <div className="mnav__foot">
          <Link className="btn btn--lime" href="/contacto">Pedí presupuesto <span className="arr">→</span></Link>
          <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noopener"><WA /> Escribinos por WhatsApp</a>
          <Link className="btn btn--white" href="/staff">Acceso staff</Link>
          <span className="small">{CONTACTO.direccion} · {CONTACTO.horario}</span>
        </div>
      </div>
    </>
  );
}
