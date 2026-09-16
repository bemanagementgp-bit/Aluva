import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FotoDiferida from "@/components/FotoDiferida";
import Tipologia from "@/components/Tipologia";
import Pie from "@/components/Pie";
import BarraNav from "@/components/BarraNav";
import VentanaCorrediza, { FOTO_CORREDIZA } from "@/components/VentanaCorrediza";
import { PRODUCTOS } from "@/content/catalogo";

/*
  Página dedicada de una línea de producto — ficha corporativa.

  Pocas piezas y en este orden: portada con velo y título, una franja oscura
  con cuatro credenciales de la línea (datos confirmados del catálogo), la
  ficha técnica en tabla ancha, la banda destacada (Spectral, mamparas), las
  tipologías dibujadas como en un plano, la galería y el pedido de
  presupuesto. Nada de texto de relleno: lo que convence son los datos.

  La portada carga de inmediato; el resto de las fotos se piden recién cuando
  se acercan a la pantalla. Si una línea no tiene aperturas o fotos extra, esa
  sección no aparece y el índice y la numeración se ajustan solos.
*/
export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = PRODUCTOS.find((p) => p.id === id);
  const [activa, setActiva] = useState("ficha");

  useEffect(() => {
    if (producto) document.title = `${producto.nombre} · Aluva`;
    return () => { document.title = "Aluva · Tecnología en aberturas"; };
  }, [producto]);

  // El índice marca la sección que está a la vista
  useEffect(() => {
    if (!producto || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll(".pp [data-seccion]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [producto]);

  if (!producto) {
    return (
      <div className="pp-404">
        <p className="eyebrow">Error 404</p>
        <h1 className="font-display">Esa línea no existe.</h1>
        <Link to="/" className="btn-primary">Volver al inicio<span className="arrow">→</span></Link>
      </div>
    );
  }

  const pedirPresupuesto = () => navigate(`/?consulta=${producto.id}#contacto`);
  const portada = producto.fotos[0];
  const altPortada = portada?.caption ? `${producto.nombre} — ${portada.caption}` : producto.nombre;
  // La misma foto no se repite: si está de portada, no vuelve en la galería
  const resto = producto.fotos
    .slice(1)
    .filter((f, i, lista) => (!portada || f.src !== portada.src) && lista.findIndex((g) => g.src === f.src) === i);
  const ficha = producto.ficha || producto.specs.filter((s) => s && String(s).trim()).map((s) => ["", s]);

  const secciones = [
    { id: "ficha", nombre: "Ficha técnica" },
    producto.aperturas?.length ? { id: "aperturas", nombre: "Aperturas" } : null,
    resto.length ? { id: "galeria", nombre: "Galería" } : null,
    { id: "presupuesto", nombre: "Presupuesto" },
  ].filter(Boolean);
  const num = (sid) => String(secciones.findIndex((s) => s.id === sid) + 1).padStart(2, "0");

  return (
    <div className="pp" data-testid={`pagina-producto-${producto.id}`}>
      <BarraNav siempreSolida onPresupuesto={pedirPresupuesto} />

      {/* Portada */}
      <header className={`pp-portada${portada ? "" : " sin-foto"}`}>
        {portada
          ? (portada.src === FOTO_CORREDIZA
              // La corrediza de PVC se abre arrastrando la hoja, como en la home
              ? <VentanaCorrediza activa alt={altPortada} />
              : <img className="pp-portada-foto" src={portada.src} alt={altPortada} decoding="async" />)
          : <span className="pp-portada-sigla" aria-hidden="true">{producto.sigla}</span>}
        <div className="pp-portada-texto">
          <p className="eyebrow" style={{ color: "var(--aluva-green-soft)" }}>{producto.linea}</p>
          <h1 className="font-display pp-titulo">{producto.nombre}</h1>
          {producto.resumen && <p className="pp-portada-resumen">{producto.resumen}</p>}
          <div className="pp-portada-acciones">
            <button className="btn-primary" data-testid="pp-portada-cta" onClick={pedirPresupuesto}>
              Pedir presupuesto
              <span className="arrow">→</span>
            </button>
            <a className="pp-portada-link" href="#ficha">Ver ficha técnica</a>
          </div>
        </div>
      </header>

      {/* Credenciales de la línea */}
      {producto.credenciales?.length > 0 && (
        <section className="pp-cred" aria-label="Credenciales de la línea" data-testid="pp-credenciales">
          <ul className="pp-cred-in">
            {producto.credenciales.map(([rotulo, valor]) => (
              <li key={rotulo} className="pp-cred-item">
                <p className="pp-cred-rot">{rotulo}</p>
                <p className="pp-cred-val">{valor}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Índice fijo de la ficha */}
      <nav className="pp-indice" aria-label="Secciones de la ficha">
        <div className="pp-indice-in">
          {secciones.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`pp-indice-link${activa === sec.id ? " is-active" : ""}`}
              data-testid={`pp-indice-${sec.id}`}
            >
              <span className="pp-indice-n">{num(sec.id)}</span>
              {sec.nombre}
            </a>
          ))}
        </div>
      </nav>

      {/* Ficha técnica */}
      <section id="ficha" data-seccion className="section section--white">
        <div className="container pp-ficha-grid">
          <div>
            <p className="eyebrow"><span className="eyebrow-num">{num("ficha")}</span>Ficha técnica</p>
            <h2 className="font-display pp-ficha-tit">{producto.nombre}</h2>
            <p className="pp-desc">{producto.desc}</p>
          </div>
          <dl className="pp-ficha" data-testid="pp-ficha">
            {ficha.map(([rotulo, valor]) => (
              <div key={`${rotulo}-${valor}`} className="pp-ficha-fila">
                <dt>{rotulo}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Banda destacada: lo que la línea tiene y nadie sabe */}
      {producto.destacado && (
        <section className="pp-destacado" data-testid="pp-destacado">
          <div className="container">
            <p className="label pp-destacado-etq">{producto.destacado.etiqueta}</p>
            <h2 className="font-display pp-destacado-tit">
              <span className="pp-destacado-liviano">{producto.destacado.liviano}</span>{" "}
              <strong>{producto.destacado.fuerte}</strong>
            </h2>
            <p className="pp-destacado-txt">{producto.destacado.texto}</p>
            {producto.destacado.lista && (
              <ul className="pp-destacado-lista">
                {producto.destacado.lista.map((c) => <li key={c}>{c}</li>)}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Aperturas: dibujadas como en un plano */}
      {producto.aperturas?.length > 0 && (
        <section id="aperturas" data-seccion className="section section--paper">
          <div className="container">
            <p className="eyebrow"><span className="eyebrow-num">{num("aperturas")}</span>Aperturas</p>
            <h2 className="font-display section-title">Tipologías que fabricamos en esta línea.</h2>
            <div className="pp-tipos" data-testid="pp-tipos">
              {producto.aperturas.map((t) => <Tipologia key={t} tipo={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* Galería */}
      {resto.length > 0 && (
        <section id="galeria" data-seccion className="section section--white">
          <div className="container">
            <p className="eyebrow"><span className="eyebrow-num">{num("galeria")}</span>Galería</p>
            <div className={`pp-gal pp-gal--${Math.min(resto.length, 3)}`} data-testid="pp-galeria">
              {resto.slice(0, 3).map((f) => (
                <figure key={f.src} className={`pp-gal-item${f.encuadre === "producto" ? " es-producto" : ""}`}>
                  <FotoDiferida src={f.src} alt={f.caption ? `${producto.nombre} — ${f.caption}` : producto.nombre} />
                  {f.caption && <figcaption>{f.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Presupuesto, con el acceso directo para profesionales */}
      <section id="presupuesto" data-seccion className="section section--ink pp-cta">
        <div className="container pp-cta-grid">
          <div>
            <p className="eyebrow" style={{ color: "var(--aluva-green-soft)" }}>
              <span className="eyebrow-num">{num("presupuesto")}</span>Presupuesto
            </p>
            <h2 className="font-display section-title">Pedí tu presupuesto de {producto.nombre.toLowerCase()}.</h2>
            <p className="section-lead">Medimos en obra y te enviamos una cotización clara, sin compromiso.</p>
            <button className="btn-primary" data-testid="pp-cta" onClick={pedirPresupuesto} style={{ marginTop: 36 }}>
              Pedir presupuesto
              <span className="arrow">→</span>
            </button>
          </div>
          <aside className="pp-cta-pro" data-testid="pp-cta-pro">
            <p className="label">¿Arquitecto, estudio o constructora?</p>
            <p className="pp-cta-pro-txt">Coordinamos medición y presupuesto de toda la obra.</p>
            <a className="pp-cta-pro-link" href={`mailto:ventas@aluva.com.ar?subject=${encodeURIComponent("Consulta profesional · " + producto.nombre)}`}>
              ventas@aluva.com.ar <span aria-hidden="true">→</span>
            </a>
          </aside>
        </div>
      </section>

      <Pie />
    </div>
  );
}
