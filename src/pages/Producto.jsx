import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FotoDiferida from "@/components/FotoDiferida";
import Tipologia from "@/components/Tipologia";
import Pie from "@/components/Pie";
import BarraNav from "@/components/BarraNav";
import VentanaCorrediza, { FOTO_CORREDIZA } from "@/components/VentanaCorrediza";
import { PRODUCTOS, COMPARATIVA } from "@/content/catalogo";

/*
  Página dedicada de una línea de producto.

  Sigue el recorrido de las fichas de máquina de Hitachi CM: portada a sangre,
  un índice fijo con las secciones de la ficha, ficha técnica en tabla, las
  tipologías dibujadas como en un plano, para qué conviene, el comparador
  PVC/aluminio (solo en esas dos líneas), los encuadres y el llamado.

  La portada carga de inmediato (es lo primero que se ve); el resto de las
  fotos se piden recién cuando se acercan a la pantalla.

  Las secciones se arman con lo que cada línea tiene cargado en el catálogo:
  si una línea no tiene aperturas o fotos extra, esa sección no aparece y el
  índice y la numeración se ajustan solos.
*/
const CON_COMPARATIVA = ["pvc", "aluminio"];

export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = PRODUCTOS.find((p) => p.id === id);
  const otras = PRODUCTOS.filter((p) => p.id !== id);
  const [activa, setActiva] = useState("linea");

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

  const portada = producto.fotos[0];
  const altPortada = portada?.caption ? `${producto.nombre} — ${portada.caption}` : producto.nombre;
  // La misma foto no se repite: si está de portada, no vuelve en la galería
  const resto = producto.fotos.slice(1).filter((f) => !portada || f.src !== portada.src);
  const comparativa = CON_COMPARATIVA.includes(producto.id);

  const secciones = [
    { id: "linea", nombre: "La línea" },
    producto.aperturas?.length ? { id: "aperturas", nombre: "Aperturas" } : null,
    producto.idealPara?.length ? { id: "ideal", nombre: "Ideal para" } : null,
    comparativa ? { id: "comparativa", nombre: "PVC o aluminio" } : null,
    resto.length ? { id: "encuadres", nombre: "Encuadres" } : null,
    { id: "presupuesto", nombre: "Presupuesto" },
  ].filter(Boolean);
  const num = (sid) => String(secciones.findIndex((s) => s.id === sid) + 1).padStart(2, "0");

  // Las secciones claras intermedias alternan papel y blanco, así nunca quedan
  // dos del mismo tono pegadas aunque falte alguna.
  const intermedias = ["aperturas", "ideal", "comparativa", "encuadres"].filter((sid) => secciones.some((s) => s.id === sid));
  const tono = (sid) => (intermedias.indexOf(sid) % 2 === 0 ? "section--paper" : "section--white");

  return (
    <div className="pp" data-testid={`pagina-producto-${producto.id}`}>
      <BarraNav siempreSolida onPresupuesto={() => navigate(`/?consulta=${producto.id}#contacto`)} />

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
        </div>
      </header>

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

      {/* Descripción + ficha técnica */}
      <section id="linea" data-seccion className="section section--white">
        <div className="container pp-dos-col">
          <div>
            <p className="eyebrow"><span className="eyebrow-num">{num("linea")}</span>La línea</p>
            <p className="pp-desc">{producto.desc}</p>
          </div>
          <div>
            <p className="eyebrow">Ficha técnica</p>
            {producto.ficha ? (
              <dl className="pp-ficha" data-testid="pp-ficha">
                {producto.ficha.map(([rotulo, valor]) => (
                  <div key={rotulo} className="pp-ficha-fila">
                    <dt>{rotulo}</dt>
                    <dd>{valor}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <ul className="pp-specs">
                {producto.specs.filter((s) => s && String(s).trim()).map((s) => (
                  <li key={s} className="pp-spec">
                    <span className="pp-spec-n" aria-hidden="true" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
        <section id="aperturas" data-seccion className={`section ${tono("aperturas")}`}>
          <div className="container">
            <p className="eyebrow"><span className="eyebrow-num">{num("aperturas")}</span>Aperturas</p>
            <h2 className="font-display section-title">Tipologías que fabricamos en esta línea.</h2>
            <div className="pp-tipos" data-testid="pp-tipos">
              {producto.aperturas.map((t) => <Tipologia key={t} tipo={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* Ideal para */}
      {producto.idealPara?.length > 0 && (
        <section id="ideal" data-seccion className={`section ${tono("ideal")}`}>
          <div className="container">
            <p className="eyebrow"><span className="eyebrow-num">{num("ideal")}</span>Ideal para</p>
            <ul className="pp-ideal" data-testid="pp-ideal">
              {producto.idealPara.map(([titulo, texto]) => (
                <li key={titulo} className="pp-ideal-item">
                  <h3 className="font-display pp-ideal-tit">{titulo}</h3>
                  <p className="pp-ideal-txt">{texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Comparador PVC / aluminio: la duda número uno del rubro */}
      {comparativa && (
        <section id="comparativa" data-seccion className={`section ${tono("comparativa")}`}>
          <div className="container">
            <p className="eyebrow"><span className="eyebrow-num">{num("comparativa")}</span>PVC o aluminio</p>
            <h2 className="font-display section-title">
              <span style={{ fontWeight: 300 }}>No hay uno mejor:</span> <strong>hay uno para cada vano.</strong>
            </h2>
            <div className="pp-comp-marco">
              <table className="pp-comp" data-testid="pp-comparativa">
                <thead>
                  <tr>
                    <th scope="col"><span className="sr-only">Criterio</span></th>
                    <th scope="col" className={producto.id === "pvc" ? "is-actual" : ""}>PVC</th>
                    <th scope="col" className={producto.id === "aluminio" ? "is-actual" : ""}>Aluminio</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARATIVA.map(([criterio, pvc, alu]) => (
                    <tr key={criterio}>
                      <th scope="row">{criterio}</th>
                      <td className={producto.id === "pvc" ? "is-actual" : ""}>{pvc}</td>
                      <td className={producto.id === "aluminio" ? "is-actual" : ""}>{alu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pp-comp-nota">
              ¿Buscás PVC económico? Te vamos a recomendar aluminio: a igual presupuesto, rinde más.
              {producto.id === "pvc"
                ? <> <Link to="/productos/aluminio" className="pp-comp-link">Ver aluminio →</Link></>
                : <> <Link to="/productos/pvc" className="pp-comp-link">Ver PVC →</Link></>}
            </p>
          </div>
        </section>
      )}

      {/* Encuadres */}
      {resto.length > 0 && (
        <section id="encuadres" data-seccion className={`section ${tono("encuadres")}`}>
          <div className="container">
            <p className="eyebrow"><span className="eyebrow-num">{num("encuadres")}</span>Encuadres</p>
            <div className="pp-galeria">
              {resto.map((f) => (
                <figure key={f.src} className={`pp-shot${f.encuadre === "producto" ? " es-producto" : ""}`}>
                  <FotoDiferida src={f.src} alt={`${producto.nombre} — ${f.caption}`} />
                  <figcaption>{f.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Llamado, con el acceso directo para profesionales */}
      <section id="presupuesto" data-seccion className="section section--ink pp-cta">
        <div className="container pp-cta-grid">
          <div>
            <p className="eyebrow" style={{ color: "var(--aluva-green-soft)" }}>
              <span className="eyebrow-num">{num("presupuesto")}</span>Siguiente paso
            </p>
            <h2 className="font-display section-title">Pedí tu presupuesto de {producto.nombre.toLowerCase()}.</h2>
            <p className="section-lead">
              Contanos medidas y ubicación y te enviamos una cotización clara. Si preferís, un
              especialista pasa a medir sin compromiso.
            </p>
            <button
              className="btn-primary"
              data-testid="pp-cta"
              onClick={() => navigate(`/?consulta=${producto.id}#contacto`)}
              style={{ marginTop: 36 }}
            >
              Pedir presupuesto
              <span className="arrow">→</span>
            </button>
          </div>
          <aside className="pp-cta-pro" data-testid="pp-cta-pro">
            <p className="label">¿Arquitecto, estudio o constructora?</p>
            <p className="pp-cta-pro-txt">
              Escribinos directo a ventas y coordinamos la medición y el presupuesto de toda la obra.
            </p>
            <a className="pp-cta-pro-link" href={`mailto:ventas@aluva.com.ar?subject=${encodeURIComponent("Consulta profesional · " + producto.nombre)}`}>
              ventas@aluva.com.ar <span aria-hidden="true">→</span>
            </a>
          </aside>
        </div>
      </section>

      {/* Otras líneas */}
      <section className="section section--white">
        <div className="container">
          <p className="eyebrow"><span className="eyebrow-num">—</span>Otras líneas</p>
          <div className="pp-otras">
            {otras.map((p) => (
              <Link key={p.id} to={`/productos/${p.id}`} className="pp-otra" data-testid={`pp-otra-${p.id}`}>
                {p.fotos[0]
                  ? <FotoDiferida src={p.fotos[0].src} alt={p.nombre} />
                  : <span className="pp-otra-vacia" aria-hidden="true">{p.sigla}</span>}
                <span className="pp-otra-linea label">{p.linea}</span>
                <span className="font-display pp-otra-nombre">{p.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Pie />
    </div>
  );
}
