import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SimuladorAberturas from "@/components/SimuladorAberturas";
import Reveal from "@/components/Reveal";
import ProductosSection from "@/components/ProductosSection";
import VitrinaProductos from "@/components/VitrinaProductos";
import Proceso from "@/components/Proceso";
import Profesionales from "@/components/Profesionales";
import Faq from "@/components/Faq";
import Logo from "@/components/Logo";
import ObrasSection from "@/components/ObrasSection";
import { MOSTRAR_OBRAS, MOSTRAR_GALERIA_PRODUCTOS, PRODUCTOS } from "@/content/catalogo";
import { useScrollReveal, useScrollProgress } from "@/hooks/useScrollReveal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Landing() {
  const navigate = useNavigate();
  const [modo, setModo] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const scrollP = useScrollProgress();
  const [navSolid, setNavSolid] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const presupRef = useRef(null);
  const simuladorRef = useRef(null);

  const [fPresupuesto, setFPresupuesto] = useState({ nombre: "", telefono: "", email: "", tipo_documento: "DNI", dni: "", tipo: "", descripcion: "", mensaje: "", simulador_config: "" });
  const [fVisita, setFVisita] = useState({ nombre: "", telefono: "", email: "", tipo_documento: "DNI", dni: "", direccion: "", localidad: "", fecha: "", turno: "", mensaje: "" });

  // Nav solid on scroll
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const SIM_TIPO_TO_FORM = {
    "ventana-corrediza": "ventanas-pvc",
    "ventana-oscilo": "ventanas-pvc",
    "ventana-banderola": "ventanas-aluminio",
    "puerta-balcon": "ventanas-aluminio",
    "puerta": "puertas-aluminio",
  };

  // Enlaces desde las fichas de producto. /?consulta=pvc#contacto abre el
  // formulario con la línea ya elegida; /#productos o /#contacto bajan a esa
  // sección. En una SPA el navegador no hace este salto solo: sin esto, los dos
  // enlaces dejaban al usuario arriba de todo en la home.
  const location = useLocation();
  const PRODUCTO_A_FORM = { pvc: "ventanas-pvc", aluminio: "ventanas-aluminio", vidrieria: "vidrieria", blindex: "blindex" };
  useEffect(() => {
    const consulta = new URLSearchParams(location.search).get("consulta");
    const prod = consulta && PRODUCTOS.find((x) => x.id === consulta);
    if (prod) {
      setModo("presupuesto");
      setEnviado(false);
      setFPresupuesto((f) => ({ ...f, tipo: PRODUCTO_A_FORM[prod.id] || "otro", descripcion: f.descripcion || `Consulta por: ${prod.nombre}` }));
    }
    const destino = location.hash.replace("#", "");
    if (!destino) return;
    const t = setTimeout(() => document.getElementById(destino)?.scrollIntoView({ behavior: "instant", block: "start" }), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.hash]);

  const goPresupuestoConSim = (config) => {
    const tipoForm = SIM_TIPO_TO_FORM[config.tipo] || "otro";
    const txt = `Configuración del simulador:\n- Tipo: ${config.tipo}\n- Perfil: ${config.color_perfil}\n- Vidrio: ${config.vidrio}`;
    setModo("presupuesto");
    setFPresupuesto(f => ({ ...f, tipo: tipoForm, descripcion: txt, simulador_config: JSON.stringify(config) }));
    setTimeout(() => presupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const enviarSolicitud = async (payload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
    return axios.post(`${API}/solicitudes`, fd);
  };

  const submitPresupuesto = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await enviarSolicitud({
        nombre: fPresupuesto.nombre,
        telefono: fPresupuesto.telefono,
        email: fPresupuesto.email,
        tipo_documento: fPresupuesto.tipo_documento,
        dni: fPresupuesto.dni,
        tipo_trabajo: fPresupuesto.tipo,
        descripcion: [fPresupuesto.descripcion, fPresupuesto.mensaje].filter(Boolean).join("\n"),
        simulador_config: fPresupuesto.simulador_config,
      });
      setEnviado(true);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al enviar la solicitud. Intentá nuevamente.");
    } finally { setEnviando(false); }
  };

  const submitVisita = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await enviarSolicitud({
        nombre: fVisita.nombre,
        telefono: fVisita.telefono,
        email: fVisita.email,
        tipo_documento: fVisita.tipo_documento,
        dni: fVisita.dni,
        tipo_trabajo: "visita técnica",
        direccion: fVisita.direccion,
        localidad: fVisita.localidad,
        descripcion: [
          fVisita.fecha ? `Fecha preferida: ${fVisita.fecha}` : "",
          fVisita.turno ? `Turno preferido: ${fVisita.turno}` : "",
          fVisita.mensaje,
        ].filter(Boolean).join("\n"),
      });
      setEnviado(true);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al enviar la solicitud. Intentá nuevamente.");
    } finally { setEnviando(false); }
  };

  return (
    <div data-testid="landing-page" style={{ background: "var(--aluva-paper)", color: "var(--aluva-ink)" }}>
      {/* Progress bar top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "rgba(14,42,26,0.06)", zIndex: 100 }}>
        <div style={{ height: "100%", width: `${scrollP * 100}%`, background: "var(--aluva-green)", transition: "width .15s" }} />
      </div>

      {/* NAV */}
      <nav data-testid="main-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: navSolid ? "var(--aluva-white)" : "transparent",
        borderBottom: navSolid ? "1px solid var(--aluva-line)" : "1px solid transparent",
        transition: "background .3s ease, border-color .3s ease",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "18px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28,
        }}>
          <Logo variant="dark" size={30} />
          <div className="nav-links" style={{ display: "flex", gap: 32, color: "var(--aluva-ink)" }}>
            <a data-testid="nav-link-productos" href="#productos" className="nav-link" style={{ color: "inherit" }}>Productos</a>
            <a data-testid="nav-link-proceso" href="#proceso" className="nav-link" style={{ color: "inherit" }}>Proceso</a>
            <a data-testid="nav-link-profesionales" href="#profesionales" className="nav-link" style={{ color: "inherit" }}>Profesionales</a>
            <a data-testid="nav-link-simulador" href="#simulador" className="nav-link" style={{ color: "inherit" }}>Simulador</a>
            {MOSTRAR_OBRAS && <a data-testid="nav-link-trabajos" href="#trabajos" className="nav-link" style={{ color: "inherit" }}>Trabajos</a>}
            <a data-testid="nav-link-contacto" href="#contacto" className="nav-link" style={{ color: "inherit" }}>Contacto</a>
          </div>
          <a
            href="tel:+542214830222"
            className="label nav-desktop-only"
            style={{ color: "var(--aluva-ink)", textDecoration: "none", opacity: 0.85, whiteSpace: "nowrap" }}
          >(221) 483-0222</a>
          <button
            data-testid="nav-staff-btn"
            className="nav-desktop-only"
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px", borderRadius: 0,
              background: navSolid ? "var(--aluva-paper)" : "rgba(255,255,255,0.12)", color: "var(--aluva-ink)",
              fontWeight: 600, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase",
              border: "1px solid var(--aluva-line)", cursor: "pointer",
              transition: "border-color .2s, background .2s",
            }}
          >Pedir presupuesto</button>
          <button
            data-testid="nav-burger"
            className="nav-burger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
            style={{
              display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 8,
            }}
          >
            <span style={{ width: 22, height: 2, background: "var(--aluva-ink)" }} />
            <span style={{ width: 22, height: 2, background: "var(--aluva-ink)" }} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--aluva-ink)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 32px" }}>
            <Logo variant="light" size={30} />
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú" style={{ background: "none", border: "none", color: "white", fontSize: 28, lineHeight: 1, cursor: "pointer" }}>×</button>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "0 32px" }}>
            {[
              { href: "#productos", label: "Productos" },
              { href: "#proceso", label: "Proceso" },
              { href: "#profesionales", label: "Profesionales" },
              { href: "#simulador", label: "Simulador" },
              { href: "#faq", label: "Preguntas" },
              { href: "#contacto", label: "Contacto" },
            ].map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="font-display" style={{ color: "white", textDecoration: "none", fontSize: 32, fontWeight: 700, letterSpacing: "var(--track-display)" }}>{l.label}</a>
            ))}
            <button onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} className="nav-link" style={{ marginTop: 14, background: "none", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 0, padding: "12px 22px", color: "white", width: "fit-content", cursor: "pointer" }}>Acceso staff</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section data-testid="hero" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", color: "var(--aluva-ink)", background: "var(--aluva-ink)" }}>
        {/* Campo de color de marca. Sin foto: mientras no haya imagenes propias
            de obra, una portada de color abre al instante y no compite con el
            titulo. La muesca inferior sigue recortando este campo. */}
        <div className="hero-clip hero-campo" style={{ position: "absolute", inset: 0 }} />

        {/* Content */}
        <div className="hero-content">
          <Reveal className="hero-block">
            <p className="eyebrow" style={{ color: "var(--aluva-green-dark)" }}>Fabricación propia · Perfilería VEKA Clase A</p>

            <h1 className="font-display" style={{
              fontSize: "var(--fs-display)",
              fontWeight: 400, lineHeight: "var(--lh-display)", letterSpacing: "var(--track-display)",
              margin: "26px 0 0", maxWidth: "20ch",
            }}>
              Aberturas de PVC y aluminio, fabricadas a medida.
            </h1>

          </Reveal>

          <div className="hero-foot">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button data-testid="hero-cta-presupuesto" onClick={() => { setModo("presupuesto"); presupRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="btn-primary">
                Pedir presupuesto
                <span className="arrow">→</span>
              </button>
              <button data-testid="hero-cta-simulador" onClick={() => simuladorRef.current?.scrollIntoView({ behavior: "smooth" })} className="link-cta">
                <span>Probar el simulador</span>
                <span className="arrow">→</span>
              </button>
            </div>

          </div>
        </div>

        <button
          className="hero-scroll"
          data-testid="hero-scroll"
          onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Ir a Productos"
        >
          <span className="label">Descubrí</span>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6.5 1v12M1.5 8.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* PRODUCTOS — vitrina */}
      <VitrinaProductos
        onPresupuesto={(producto) => {
          setModo("presupuesto");
          setEnviado(false);
          setFPresupuesto(f => ({ ...f, descripcion: f.descripcion || `Consulta por: ${producto.nombre}` }));
          presupRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* PROCESO — cómo es trabajar con Aluva, de principio a fin */}
      <Proceso
        onEmpezar={() => { setModo("presupuesto"); setEnviado(false); presupRef.current?.scrollIntoView({ behavior: "smooth" }); }}
      />

      {/* PRODUCTOS — galeria larga, oculta: la vitrina de arriba ya presenta
          las cuatro lineas y tenerlas dos veces duplicaba el recorrido */}
      {MOSTRAR_GALERIA_PRODUCTOS && <ProductosSection
        onPresupuesto={(producto) => {
          setModo("presupuesto");
          setEnviado(false);
          setFPresupuesto(f => ({ ...f, descripcion: f.descripcion || `Consulta por: ${producto.nombre}` }));
          presupRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />}

      {/* PROFESIONALES — arquitectos, estudios y constructoras */}
      <Profesionales />

      {/* SIMULADOR */}
      <section id="simulador" ref={simuladorRef} data-testid="simulador-section" className="section section--paper">
        <div className="container">
          <Reveal style={{ marginBottom: 46 }}>
            <p className="eyebrow"><span className="eyebrow-num">04</span>Simulador interactivo</p>
            <h2 className="font-display section-title">
              Probá la abertura antes de instalarla.
            </h2>
            <p className="section-lead">
              Subí una foto de tu casa, arrastrá la ventana o puerta sobre el lugar exacto y elegí color de perfil, vidrio y tipo de apertura. Tu visualización en segundos.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <div style={{ background: "var(--aluva-white)", border: "1px solid var(--aluva-line)", borderRadius: "var(--r-card)", padding: 26 }}>
              <SimuladorAberturas onPedirPresupuesto={goPresupuestoConSim} />
            </div>
          </Reveal>

          <Reveal delay={3} style={{ marginTop: 24, color: "var(--aluva-mute)", fontSize: "var(--fs-meta)", textAlign: "center" }}>
            La simulación es orientativa. Las medidas finales y características técnicas se confirman en la visita de medición.
          </Reveal>
        </div>
      </section>

      {/* OBRAS — oculta hasta tener obras reales con foto propia */}
      {MOSTRAR_OBRAS && <ObrasSection />}

      {/* PREGUNTAS FRECUENTES */}
      <Faq />

      {/* CTA */}
      <section className="section section--ink" style={{ textAlign: "center" }}>
        <Reveal className="container">
          <p className="eyebrow" style={{ color: "var(--aluva-green-soft)", justifyContent: "center", display: "inline-flex" }}>Empecemos</p>
          <h2 className="font-display section-title" style={{ margin: "18px auto 30px" }}>
            Empezá a pensar tu proyecto
          </h2>
          <button onClick={() => { setModo("presupuesto"); presupRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="btn-primary">
            Pedir presupuesto
            <span className="arrow">→</span>
          </button>
        </Reveal>
      </section>

      {/* CONTACTO */}
      <section id="contacto" ref={presupRef} className="section section--white" style={{ borderTop: "1px solid var(--aluva-line)" }}>
        <div className="container--narrow">
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}><span className="eyebrow-num">06</span>Contacto</p>
            <h2 className="font-display section-title" style={{ margin: "16px auto 12px" }}>
              ¿En qué te podemos ayudar?
            </h2>
            <p className="section-lead" style={{ margin: "12px auto 0" }}>Elegí la opción que mejor se adapte a tu necesidad.</p>
          </Reveal>

          <Reveal delay={1} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 1, marginBottom: 40, background: "var(--aluva-line)" }}>
            <ModoCard
              testId="modo-presupuesto"
              selected={modo === "presupuesto"}
              onClick={() => { setModo("presupuesto"); setEnviado(false); }}
              title="Solicitar presupuesto"
              desc="Contanos qué necesitás y te enviamos una cotización clara para tu proyecto."
            />
            <ModoCard
              testId="modo-visita"
              selected={modo === "visita"}
              onClick={() => { setModo("visita"); setEnviado(false); }}
              title="Solicitar visita técnica"
              desc="Un especialista revisa tu espacio, toma medidas y te orienta sin compromiso."
            />
          </Reveal>

          {modo === "presupuesto" && !enviado && (
            <FormCard onSubmit={submitPresupuesto} enviando={enviando} title="Solicitud de presupuesto" subtitle="Te respondemos en menos de 24hs hábiles" testId="form-presupuesto">
              <Row>
                <Field label="Nombre">
                  <input data-testid="pres-nombre" className="al-input" required value={fPresupuesto.nombre} onChange={e => setFPresupuesto({ ...fPresupuesto, nombre: e.target.value })} placeholder="Tu nombre completo" />
                </Field>
                <Field label="Teléfono">
                  <input data-testid="pres-tel" className="al-input" type="tel" required value={fPresupuesto.telefono} onChange={e => setFPresupuesto({ ...fPresupuesto, telefono: e.target.value })} placeholder="(221) 123-4567" />
                </Field>
              </Row>
              <Field label="Email">
                <input data-testid="pres-email" className="al-input" type="email" required value={fPresupuesto.email} onChange={e => setFPresupuesto({ ...fPresupuesto, email: e.target.value })} placeholder="tu@email.com" />
              </Field>
              <Row cols="120px 1fr">
                <Field label="Doc.">
                  <select className="al-input" value={fPresupuesto.tipo_documento} onChange={e => setFPresupuesto({ ...fPresupuesto, tipo_documento: e.target.value })}>
                    <option>DNI</option><option>CUIL</option><option>CUIT</option>
                  </select>
                </Field>
                <Field label="Número">
                  <input data-testid="pres-dni" className="al-input" value={fPresupuesto.dni} onChange={e => setFPresupuesto({ ...fPresupuesto, dni: e.target.value })} placeholder="12345678" />
                </Field>
              </Row>
              <Field label="Tipo de trabajo">
                <select data-testid="pres-tipo" className="al-input" required value={fPresupuesto.tipo} onChange={e => setFPresupuesto({ ...fPresupuesto, tipo: e.target.value })}>
                  <option value="">Seleccioná una opción</option>
                  <option value="ventanas-pvc">Ventanas de PVC</option>
                  <option value="puertas-aluminio">Puertas de aluminio</option>
                  <option value="ventanas-aluminio">Ventanas de aluminio</option>
                  <option value="cerramiento">Cerramiento</option>
                  <option value="vidrieria">Vidriería</option>
                  <option value="mamparas">Mamparas a medida</option>
                  <option value="blindex">Frentes de Blindex / piel de vidrio</option>
                  <option value="otro">Otro</option>
                </select>
              </Field>
              <Field label="Descripción y medidas">
                <textarea data-testid="pres-desc" className="al-input" rows={3} value={fPresupuesto.descripcion} onChange={e => setFPresupuesto({ ...fPresupuesto, descripcion: e.target.value })} placeholder="Ej: 2 ventanas corredizas de 1.20m x 1m..." style={{ resize: "vertical" }} />
              </Field>
              <Field label="Mensaje adicional">
                <textarea className="al-input" rows={2} value={fPresupuesto.mensaje} onChange={e => setFPresupuesto({ ...fPresupuesto, mensaje: e.target.value })} placeholder="¿Algo más que quieras contarnos?" style={{ resize: "vertical" }} />
              </Field>
              {fPresupuesto.simulador_config && (
                <div style={{ background: "var(--aluva-paper)", border: "1px solid var(--aluva-line)", padding: 13, borderRadius: 0, fontSize: 13, color: "var(--aluva-mute)" }}>
                  Configuración del simulador adjuntada a tu pedido.
                </div>
              )}
              <button data-testid="pres-submit" type="submit" disabled={enviando} className="btn-primary" style={{ marginTop: 8, justifyContent: "center" }}>
                {enviando ? "Enviando..." : "Solicitar presupuesto"}
                <span className="arrow">→</span>
              </button>
              <p style={{ textAlign: "center", color: "var(--aluva-mute)", fontSize: 12, marginTop: -4 }}>Te avisaremos cuando tengamos tu presupuesto exclusivo.</p>
            </FormCard>
          )}

          {modo === "visita" && !enviado && (
            <FormCard onSubmit={submitVisita} enviando={enviando} title="Solicitud de visita" subtitle="Un experto irá a tu domicilio a evaluar y asesorarte" testId="form-visita">
              <Row>
                <Field label="Nombre">
                  <input data-testid="vis-nombre" className="al-input" required value={fVisita.nombre} onChange={e => setFVisita({ ...fVisita, nombre: e.target.value })} placeholder="Tu nombre completo" />
                </Field>
                <Field label="Teléfono">
                  <input data-testid="vis-tel" className="al-input" type="tel" required value={fVisita.telefono} onChange={e => setFVisita({ ...fVisita, telefono: e.target.value })} placeholder="(221) 123-4567" />
                </Field>
              </Row>
              <Field label="Email">
                <input data-testid="vis-email" className="al-input" type="email" required value={fVisita.email} onChange={e => setFVisita({ ...fVisita, email: e.target.value })} placeholder="tu@email.com" />
              </Field>
              <Row cols="120px 1fr">
                <Field label="Doc.">
                  <select className="al-input" value={fVisita.tipo_documento} onChange={e => setFVisita({ ...fVisita, tipo_documento: e.target.value })}>
                    <option>DNI</option><option>CUIL</option><option>CUIT</option>
                  </select>
                </Field>
                <Field label="Número">
                  <input data-testid="vis-dni" className="al-input" value={fVisita.dni} onChange={e => setFVisita({ ...fVisita, dni: e.target.value })} placeholder="12345678" />
                </Field>
              </Row>
              <Row>
                <Field label="Dirección">
                  <input data-testid="vis-dir" className="al-input" required value={fVisita.direccion} onChange={e => setFVisita({ ...fVisita, direccion: e.target.value })} placeholder="Calle y número" />
                </Field>
                <Field label="Localidad">
                  <input data-testid="vis-loc" className="al-input" required value={fVisita.localidad} onChange={e => setFVisita({ ...fVisita, localidad: e.target.value })} placeholder="Ej: La Plata" />
                </Field>
              </Row>
              <Row>
                <Field label="Fecha preferida">
                  <input className="al-input" type="date" min={new Date().toISOString().split("T")[0]} value={fVisita.fecha} onChange={e => setFVisita({ ...fVisita, fecha: e.target.value })} />
                </Field>
                <Field label="Turno preferido">
                  <select data-testid="vis-turno" className="al-input" required value={fVisita.turno} onChange={e => setFVisita({ ...fVisita, turno: e.target.value })}>
                    <option value="">Elegí turno</option>
                    <option value="Mañana (9 a 11hs)">Mañana (9 a 11hs)</option>
                    <option value="Tarde (14 a 17hs)">Tarde (14 a 17hs)</option>
                  </select>
                </Field>
              </Row>
              <Field label="Detalle / mensaje">
                <textarea className="al-input" rows={3} value={fVisita.mensaje} onChange={e => setFVisita({ ...fVisita, mensaje: e.target.value })} placeholder="Describí lo que necesitás evaluar..." style={{ resize: "vertical" }} />
              </Field>
              <button data-testid="vis-submit" type="submit" disabled={enviando} className="btn-primary" style={{ justifyContent: "center" }}>
                {enviando ? "Enviando..." : "Solicitar visita"}
                <span className="arrow">→</span>
              </button>
              <p style={{ textAlign: "center", color: "var(--aluva-mute)", fontSize: 12, marginTop: -4 }}>Visita sin cargo. Te confirmamos turno en 24hs.</p>
            </FormCard>
          )}

          {enviado && (
            <div data-testid="form-success" style={{ background: "white", border: "1px solid var(--aluva-line)", borderRadius: 0, padding: "52px 32px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, margin: "0 auto 22px", border: "1px solid var(--aluva-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--aluva-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="font-display" style={{ fontSize: 26, fontWeight: 400, margin: 0, letterSpacing: "var(--track-display)" }}>
                {modo === "visita" ? "Visita solicitada" : "Solicitud recibida"}
              </h3>
              <p style={{ color: "var(--aluva-mute)", maxWidth: 440, margin: "14px auto 26px", fontSize: 15, lineHeight: 1.65 }}>
                Te avisaremos cuando tengamos tu presupuesto exclusivo y adecuado a tus necesidades.
              </p>
              <button onClick={() => { setEnviado(false); setModo(null); }} className="btn-ghost">Hacer otra consulta</button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="section section--ink" style={{ paddingBottom: 30 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, paddingBottom: 48, borderBottom: "1px solid var(--line-ink)", marginBottom: 44 }}>
            <h2 className="font-display section-title" style={{ margin: 0 }}>
              Empezá tu proyecto hoy
            </h2>
            <a href="https://wa.me/5492216755077" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Escribinos por WhatsApp
              <span className="arrow">→</span>
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 48, marginBottom: 44 }}>
            <div>
              <img src="/brand/marca-negativa-tagline-web.svg" alt="Aluva · Tecnología en aberturas" style={{ display: "block", width: "100%", maxWidth: 300, height: "auto", marginBottom: 22 }} />
              <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", lineHeight: 1.75, maxWidth: 260 }}>
                Fabricación propia de aberturas en PVC y aluminio. Perfilería VEKA Clase A.
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ color: "var(--aluva-green-soft)", marginBottom: 16 }}><span className="eyebrow-num" style={{ color: "var(--aluva-green-soft)" }}>—</span>Productos</p>
              {PRODUCTOS.map(p => (
                <Link key={p.id} to={`/productos/${p.id}`} data-testid={`pie-producto-${p.id}`} style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", display: "block", textDecoration: "none", margin: "0 0 10px" }}>{p.nombre}</Link>
              ))}
            </div>
            <div>
              <p className="eyebrow" style={{ color: "var(--aluva-green-soft)", marginBottom: 16 }}><span className="eyebrow-num" style={{ color: "var(--aluva-green-soft)" }}>—</span>Contacto</p>
              <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", margin: "0 0 10px" }}>(221) 483-0222</p>
              <a href="https://wa.me/5492216755077" target="_blank" rel="noopener noreferrer" style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", display: "block", textDecoration: "none", marginBottom: 10 }}>WhatsApp +54 9 221 675-5077</a>
              <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", margin: "0 0 10px" }}>info@aluva.com.ar</p>
              <p style={{ color: "var(--on-ink-50)", fontSize: "var(--fs-meta)", margin: "0 0 10px" }}>7 N° 1714, La Plata, Buenos Aires</p>
              <p style={{ color: "var(--on-ink-32)", fontSize: 12, margin: 0 }}>Atención lunes a viernes de 8 a 18hs</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--line-ink)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <p style={{ color: "var(--on-ink-32)", fontSize: 12 }}>© {new Date().getFullYear()} Aluva · Todos los derechos reservados.</p>
            <button onClick={() => navigate("/login")} className="label" style={{ color: "var(--on-ink-32)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Acceso staff</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────── Subcomponents ───────── */

function ModoCard({ selected, onClick, title, desc, testId }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      style={{
        textAlign: "left", padding: 26, cursor: "pointer",
        background: selected ? "var(--aluva-green)" : "white",
        color: "var(--aluva-ink)",
        border: "none",
        transition: "background .2s ease, color .2s ease",
        display: "block", width: "100%", boxSizing: "border-box",
      }}
    >
      <h3 className="font-display" style={{ fontSize: 19, fontWeight: 500, margin: 0, letterSpacing: "var(--track-display)" }}>{title}</h3>
      <p style={{ color: selected ? "rgba(14,42,26,0.72)" : "var(--aluva-mute)", margin: "10px 0 0", fontSize: "var(--fs-meta)", lineHeight: 1.65 }}>{desc}</p>
      <div className="label" style={{ marginTop: 16, color: selected ? "var(--aluva-ink)" : "var(--aluva-green-dark)" }}>
        {selected ? "Seleccionado" : "Elegir →"}
      </div>
    </button>
  );
}

function FormCard({ children, onSubmit, title, subtitle, testId }) {
  return (
    <form data-testid={testId} onSubmit={onSubmit} style={{ background: "white", borderRadius: "var(--r-card)", padding: 34, display: "flex", flexDirection: "column", gap: 18, border: "1px solid var(--aluva-line)" }}>
      <div style={{ marginBottom: 4 }}>
        <h3 className="font-display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: "var(--track-display)" }}>{title}</h3>
        <p style={{ color: "var(--aluva-mute)", fontSize: "var(--fs-meta)", margin: "6px 0 0" }}>{subtitle}</p>
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--aluva-line)", margin: 0 }} />
      {children}
    </form>
  );
}

function Row({ children, cols = "1fr 1fr" }) {
  return <div style={{ display: "grid", gridTemplateColumns: cols, gap: 14 }}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <div>
      <label className="al-label">{label}</label>
      {children}
    </div>
  );
}

