import { useEffect, useRef, useState } from "react";
import AberturaSVG from "@/components/AberturaSVG";

// Paletas reales del rubro
const COLORES_PVC = [
  { value: "#f4f3ef", label: "Blanco", textura: false },
  { value: "#c8923f", label: "Roble Dorado", textura: true },
  { value: "#7d4a1f", label: "Nogal", textura: true },
  { value: "#3a2814", label: "Modena", textura: true },
  { value: "#1c1c1c", label: "Negro", textura: false },
  { value: "#4a4f55", label: "Antracita", textura: false },
];

const COLORES_ALUMINIO = [
  { value: "#f4f3ef", label: "Blanco", textura: false },
  { value: "#1c1c1c", label: "Negro", textura: false },
  { value: "#4a4f55", label: "Antracita", textura: false },
  { value: "#b8b8b8", label: "Natural", textura: false },
  { value: "#c8923f", label: "Símil Roble", textura: true },
  { value: "#3a2814", label: "Símil Modena", textura: true },
];

/**
 * Simulador de aberturas:
 * - Usuario sube una foto de su casa/pared
 * - Aparece una abertura SVG arrastrable y redimensionable sobre la foto
 * - Configurable: tipo, color de perfil, tinte de vidrio, reflejo
 * - Descarga PNG o pide presupuesto con la config actual
 */
export default function SimuladorAberturas({ onPedirPresupuesto }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [material, setMaterial] = useState("pvc"); // pvc | aluminio
  const [tipo, setTipo] = useState("ventana-corrediza");
  const [colorPerfil, setColorPerfil] = useState("#c8923f"); // roble dorado default
  const [vidrio, setVidrio] = useState({ tint: "#bcd4e3", reflect: 0.55, label: "Transparente" });
  const [box, setBox] = useState({ x: 90, y: 90, w: 320, h: 220 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const stageRef = useRef(null);
  const startRef = useRef({});
  const fileInputRef = useRef(null);

  // Reset position when stage changes
  useEffect(() => {
    if (!stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    setBox(b => ({ ...b, x: Math.min(b.x, r.width - b.w - 10), y: Math.min(b.y, r.height - b.h - 10) }));
  }, [photoUrl]);

  // Resetear color cuando se cambia de material si el color no existe en la nueva paleta
  useEffect(() => {
    const palette = material === "pvc" ? COLORES_PVC : COLORES_ALUMINIO;
    if (!palette.find(c => c.value === colorPerfil)) {
      setColorPerfil(palette[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material]);

  // Colores reales del rubro
  const colores = material === "pvc" ? COLORES_PVC : COLORES_ALUMINIO;
  const currentColor = colores.find(c => c.value === colorPerfil) || colores[0];

  const vidrios = [
    { tint: "#bcd4e3", reflect: 0.55, label: "Transparente" },
    { tint: "#6e8fa6", reflect: 0.75, label: "DVH Azulado" },
    { tint: "#2c4a5f", reflect: 0.9, label: "Espejado" },
    { tint: "#e8e4d8", reflect: 0.35, label: "Esmerilado" },
  ];

  const tipos = [
    { id: "ventana-corrediza", label: "Corrediza", icon: "⇄" },
    { id: "ventana-oscilo", label: "Oscilobatiente", icon: "◰" },
    { id: "ventana-banderola", label: "Con banderola", icon: "▤" },
    { id: "puerta-balcon", label: "Puerta balcón", icon: "▥" },
    { id: "puerta", label: "Puerta de entrada", icon: "P" },
  ];

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhotoUrl(url);
  };

  // Drag
  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const point = getPoint(e);
    startRef.current = { px: point.x, py: point.y, bx: box.x, by: box.y };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };
  const onPointerMove = (e) => {
    const point = getPoint(e);
    const dx = point.x - startRef.current.px;
    const dy = point.y - startRef.current.py;
    const stage = stageRef.current.getBoundingClientRect();
    setBox(b => ({
      ...b,
      x: clamp(startRef.current.bx + dx, 0, stage.width - b.w),
      y: clamp(startRef.current.by + dy, 0, stage.height - b.h),
    }));
  };
  const onPointerUp = () => {
    setDragging(false);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  // Resize
  const onResizeDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    const point = getPoint(e);
    startRef.current = { px: point.x, py: point.y, bw: box.w, bh: box.h };
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeUp);
  };
  const onResizeMove = (e) => {
    const point = getPoint(e);
    const dx = point.x - startRef.current.px;
    const dy = point.y - startRef.current.py;
    const stage = stageRef.current.getBoundingClientRect();
    setBox(b => ({
      ...b,
      w: clamp(startRef.current.bw + dx, 80, stage.width - b.x),
      h: clamp(startRef.current.bh + dy, 60, stage.height - b.y),
    }));
  };
  const onResizeUp = () => {
    setResizing(false);
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeUp);
  };

  const reset = () => {
    setPhotoUrl(null);
    setBox({ x: 90, y: 90, w: 320, h: 220 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const config = {
    material: material === "pvc" ? "PVC" : "Aluminio",
    tipo,
    color_perfil: currentColor.label,
    vidrio: vidrio.label,
    medidas_aprox: `${Math.round(box.w)}px × ${Math.round(box.h)}px (referencia visual)`,
  };

  const pedirPresupuesto = () => {
    onPedirPresupuesto?.(config);
  };

  // Descarga: compone imagen + svg en canvas
  const descargar = async () => {
    if (!photoUrl) return;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = photoUrl;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const stage = stageRef.current.getBoundingClientRect();
      const scale = img.naturalWidth / stage.width;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Serializar el SVG actual
      const svgEl = stageRef.current.querySelector(".sim-overlay svg");
      if (svgEl) {
        const svgStr = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        const svgImg = new Image();
        svgImg.src = svgUrl;
        await new Promise((res, rej) => { svgImg.onload = res; svgImg.onerror = rej; });
        ctx.drawImage(svgImg, box.x * scale, box.y * scale, box.w * scale, box.h * scale);
        URL.revokeObjectURL(svgUrl);
      }
      const link = document.createElement("a");
      link.download = "aluva-simulacion.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      alert("No se pudo descargar la imagen.");
      console.error(err);
    }
  };

  return (
    <div data-testid="simulador-aberturas" className="sim-layout">
      {/* STAGE */}
      <div>
        {!photoUrl ? (
          <label
            data-testid="sim-dropzone"
            htmlFor="sim-file"
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: "100%", aspectRatio: "16/10",
              border: "1px dashed var(--aluva-line)",
              borderRadius: 0, background: "#fff",
              cursor: "pointer", textAlign: "center", padding: 24,
              transition: "border-color .2s, background .2s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--aluva-green)"; e.currentTarget.style.background = "var(--aluva-paper)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "var(--aluva-line)"; e.currentTarget.style.background = "#fff"; }}
          >
            <div style={{ width: 60, height: 60, border: "1px solid var(--aluva-green)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--aluva-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="font-display" style={{ fontSize: 20, fontWeight: 500, color: "var(--aluva-ink)", margin: 0, marginBottom: 8 }}>Subí una foto de tu casa o pared</p>
            <p style={{ color: "var(--aluva-mute)", fontSize: 14, margin: 0, maxWidth: 360 }}>
              Tomá una foto del lugar donde querés instalar la abertura. Vas a poder superponer y ajustar el modelo en tiempo real.
            </p>
            <input id="sim-file" ref={fileInputRef} data-testid="sim-file-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            <span style={{ marginTop: 22, padding: "10px 22px", borderRadius: 0, background: "var(--aluva-ink)", color: "white", fontSize: 13, letterSpacing: "0.06em", fontWeight: 600 }}>
              Elegir foto
            </span>
          </label>
        ) : (
          <div
            ref={stageRef}
            className="sim-wrap"
            style={{
              position: "relative", width: "100%", aspectRatio: "16/10",
              borderRadius: 0, overflow: "hidden", background: "var(--aluva-ink)",
              border: "1px solid var(--aluva-line)",
            }}
          >
            <img
              src={photoUrl}
              alt="tu casa"
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
            />
            <div
              data-testid="sim-overlay"
              className={`sim-overlay ${dragging || resizing ? "dragging" : ""}`}
              style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
              onPointerDown={onPointerDown}
            >
              <AberturaSVG type={tipo} material={material} frameColor={colorPerfil} woodGrain={currentColor.textura} glassTint={vidrio.tint} glassReflect={vidrio.reflect} width={box.w} height={box.h} />
              <div className="sim-handle" onPointerDown={onResizeDown} />
            </div>
            <button
              data-testid="sim-reset-btn"
              onClick={reset}
              style={{
                position: "absolute", top: 12, right: 12,
                padding: "8px 14px", borderRadius: 0,
                background: "rgba(255,255,255,0.92)", border: "none",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                color: "var(--aluva-ink)", cursor: "pointer",
              }}
            >
              Otra foto
            </button>
          </div>
        )}

        {photoUrl && (
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <button data-testid="sim-download-btn" onClick={descargar} className="btn-ghost">
              Descargar simulación
            </button>
            <button data-testid="sim-presupuesto-btn" onClick={pedirPresupuesto} className="btn-primary" style={{ padding: "14px 26px", fontSize: 14 }}>
              Pedir presupuesto con esta config
              <span className="arrow">→</span>
            </button>
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div data-testid="sim-controls" style={{ background: "white", borderRadius: "var(--r-card)", padding: 22, border: "1px solid var(--aluva-line)" }}>
        <p className="eyebrow" style={{ marginBottom: 16 }}>Configurar</p>

        <div style={{ marginBottom: 18 }}>
          <p className="al-label">Material</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--aluva-line)" }}>
            {[
              { id: "pvc", label: "PVC", sub: "Aislante térmico" },
              { id: "aluminio", label: "Aluminio", sub: "Diseño moderno" },
            ].map(m => (
              <button
                key={m.id}
                data-testid={`sim-material-${m.id}`}
                onClick={() => setMaterial(m.id)}
                style={{
                  padding: "10px 8px",
                  background: material === m.id ? "var(--aluva-ink)" : "var(--aluva-paper)",
                  color: material === m.id ? "white" : "var(--aluva-ink)",
                  border: "none", borderRadius: 0,
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all .2s",
                  lineHeight: 1.2, letterSpacing: "0.02em",
                }}
              >
                {m.label}
                <span style={{ display: "block", fontSize: 10, fontWeight: 500, opacity: 0.7, marginTop: 2, letterSpacing: "0.04em" }}>{m.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <p className="al-label">Tipo de abertura</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {tipos.map(t => (
              <button
                key={t.id}
                data-testid={`sim-tipo-${t.id}`}
                onClick={() => setTipo(t.id)}
                style={{
                  padding: "10px 8px",
                  background: tipo === t.id ? "var(--aluva-ink)" : "var(--aluva-paper)",
                  color: tipo === t.id ? "white" : "var(--aluva-ink)",
                  border: "none", borderRadius: 0,
                  fontSize: 12, fontFamily: "inherit", fontWeight: 600,
                  cursor: "pointer", transition: "all .2s",
                  textAlign: "left", lineHeight: 1.2,
                }}
              >
                <span style={{ fontSize: 16, display: "block", marginBottom: 2 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <p className="al-label">Color de perfil</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
            {colores.map(c => (
              <button
                key={c.value}
                data-testid={`sim-color-${c.label.toLowerCase().replace(/\s+/g, "-")}`}
                title={c.label}
                onClick={() => setColorPerfil(c.value)}
                style={{
                  width: 30, height: 30, borderRadius: 0,
                  background: c.value,
                  border: colorPerfil === c.value ? "2px solid var(--aluva-green)" : "1px solid var(--aluva-line)",
                  cursor: "pointer", padding: 0,
                  boxShadow: colorPerfil === c.value ? "0 0 0 2px rgba(63,90,52,0.18)" : "none",
                  transition: "all .2s",
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--aluva-mute)", marginTop: 8, letterSpacing: "0.04em" }}>
            {currentColor.label} {currentColor.textura ? "· con veta" : ""}
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <p className="al-label">Tipo de vidrio</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {vidrios.map(v => (
              <button
                key={v.label}
                data-testid={`sim-vidrio-${v.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setVidrio(v)}
                style={{
                  padding: "10px 8px",
                  background: vidrio.label === v.label ? "var(--aluva-ink)" : "var(--aluva-paper)",
                  color: vidrio.label === v.label ? "white" : "var(--aluva-ink)",
                  border: "none", borderRadius: 0,
                  fontSize: 12, fontFamily: "inherit", fontWeight: 600,
                  cursor: "pointer", transition: "all .2s",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--aluva-line)", paddingTop: 16, marginTop: 8 }}>
          <p style={{ fontSize: 11, color: "var(--aluva-mute)", letterSpacing: "var(--track-label)", textTransform: "uppercase", margin: 0, marginBottom: 6 }}>
            Tu configuración
          </p>
          <p style={{ fontSize: 13, color: "var(--aluva-ink)", margin: 0, lineHeight: 1.6 }}>
            <strong>{material === "pvc" ? "PVC" : "Aluminio"}</strong> · {tipos.find(t => t.id === tipo)?.label}<br />
            Perfil: {currentColor.label}<br />
            Vidrio: {vidrio.label}
          </p>
        </div>
      </div>
    </div>
  );
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const getPoint = (e) => ({ x: e.clientX, y: e.clientY });
