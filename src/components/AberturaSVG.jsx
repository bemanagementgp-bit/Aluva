import { useMemo } from "react";

/**
 * SVG fotorrealista de abertura — el vidrio es semi-transparente para que
 * se vea la foto detrás (igual que vidrio real). El marco tiene perfil 3D
 * con chaflán, esquinas en miter 45° (soldadura PVC), goma negra interior
 * y herraje metálico real.
 */
export default function AberturaSVG({
  type = "ventana-corrediza",
  material = "pvc",
  frameColor = "#c8923f",
  glassTint = "#bcd4e3",
  glassReflect = 0.55,
  width = 600,
  height = 400,
  woodGrain = true,
}) {
  const id = useMemo(() => `ab-${Math.random().toString(36).slice(2, 9)}`, []);

  const darker = shade(frameColor, -32);
  const darkest = shade(frameColor, -55);
  const lighter = shade(frameColor, 22);
  const highlight = shade(frameColor, 48);

  // Perfilería real
  const marco = material === "aluminio" ? 12 : 22;
  const panelStroke = material === "aluminio" ? 5 : 9;
  const chamfer = material === "aluminio" ? 1.5 : 3; // bisel
  const gasketW = 1.4; // goma negra

  const W = width;
  const H = height;
  const innerX = marco;
  const innerY = marco;
  const innerW = W - marco * 2;
  const innerH = H - marco * 2;

  const isWood = woodGrain && isWoody(frameColor);
  const frameFill = isWood ? `url(#wood-${id})` : `url(#metal-${id})`;
  const profileSide = isWood ? `url(#woodSide-${id})` : `url(#metalSide-${id})`;

  // Panels
  let panels = [];
  if (type === "ventana-corrediza") {
    const half = innerW / 2;
    panels = [
      { x: innerX, y: innerY, w: half, h: innerH, kind: "frame", handle: "right" },
      { x: innerX + half, y: innerY, w: half, h: innerH, kind: "frame", handle: "left" },
    ];
  } else if (type === "ventana-oscilo") {
    panels = [{ x: innerX, y: innerY, w: innerW, h: innerH, kind: "frame", handle: "right", showOscilo: true }];
  } else if (type === "ventana-banderola") {
    const topH = innerH * 0.3;
    panels = [
      { x: innerX, y: innerY, w: innerW, h: topH, kind: "frame", handle: "none", showBanderola: true },
      { x: innerX, y: innerY + topH, w: innerW / 2, h: innerH - topH, kind: "frame", handle: "right" },
      { x: innerX + innerW / 2, y: innerY + topH, w: innerW / 2, h: innerH - topH, kind: "frame", handle: "left" },
    ];
  } else if (type === "puerta") {
    const topH = innerH * 0.2;
    panels = [
      { x: innerX, y: innerY, w: innerW, h: topH, kind: "frame", handle: "none" },
      { x: innerX, y: innerY + topH, w: innerW, h: innerH - topH, kind: "solid-door" },
    ];
  } else if (type === "puerta-balcon") {
    panels = [
      { x: innerX, y: innerY, w: innerW / 2, h: innerH, kind: "frame", handle: "right" },
      { x: innerX + innerW / 2, y: innerY, w: innerW / 2, h: innerH, kind: "frame", handle: "left" },
    ];
  }

  const reflectAlpha = clamp(glassReflect, 0, 1);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{
        display: "block", width: "100%", height: "100%",
        filter: "drop-shadow(0 22px 38px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
      }}
    >
      <defs>
        {/* ── Madera: pattern con veta natural ────────────────────────── */}
        <linearGradient id={`woodBase-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighter} />
          <stop offset="55%" stopColor={frameColor} />
          <stop offset="100%" stopColor={darker} />
        </linearGradient>
        <pattern id={`wood-${id}`} patternUnits="userSpaceOnUse" width="120" height="420" patternTransform="rotate(0)">
          <rect width="120" height="420" fill={`url(#woodBase-${id})`} />
          {/* vetas largas */}
          <path d="M0 20 C 30 22, 80 18, 120 24" stroke={darker} strokeWidth="1.6" fill="none" opacity="0.55" />
          <path d="M0 55 C 30 52, 80 58, 120 54" stroke={darker} strokeWidth="0.8" fill="none" opacity="0.45" />
          <path d="M0 88 C 30 92, 80 84, 120 90" stroke={lighter} strokeWidth="1.1" fill="none" opacity="0.5" />
          <path d="M0 130 C 30 126, 80 134, 120 128" stroke={darker} strokeWidth="0.6" fill="none" opacity="0.42" />
          <path d="M0 170 C 30 174, 80 168, 120 176" stroke={darker} strokeWidth="1.8" fill="none" opacity="0.6" />
          <path d="M0 210 C 30 206, 80 214, 120 208" stroke={lighter} strokeWidth="0.9" fill="none" opacity="0.5" />
          <path d="M0 248 C 30 252, 80 246, 120 250" stroke={darker} strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M0 285 C 30 280, 80 290, 120 282" stroke={darker} strokeWidth="1.3" fill="none" opacity="0.55" />
          <path d="M0 325 C 30 330, 80 322, 120 328" stroke={lighter} strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M0 365 C 30 360, 80 370, 120 364" stroke={darker} strokeWidth="0.6" fill="none" opacity="0.42" />
          <path d="M0 400 C 30 404, 80 396, 120 402" stroke={darker} strokeWidth="1" fill="none" opacity="0.5" />
          {/* nudos sutiles */}
          <ellipse cx="32" cy="155" rx="8" ry="4" fill={darkest} opacity="0.32" />
          <ellipse cx="32" cy="155" rx="3" ry="1.5" fill={darkest} opacity="0.5" />
          <ellipse cx="88" cy="305" rx="6" ry="3" fill={darkest} opacity="0.28" />
        </pattern>

        {/* Madera para perfil lateral (más oscuro, simula corte) */}
        <linearGradient id={`woodSide-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darker} />
          <stop offset="50%" stopColor={frameColor} />
          <stop offset="100%" stopColor={darker} />
        </linearGradient>

        {/* ── Metal/PVC liso ──────────────────────────────────────────── */}
        <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighter} />
          <stop offset="20%" stopColor={highlight} />
          <stop offset="45%" stopColor={frameColor} />
          <stop offset="100%" stopColor={darker} />
        </linearGradient>
        <linearGradient id={`metalSide-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darker} />
          <stop offset="50%" stopColor={highlight} />
          <stop offset="100%" stopColor={darker} />
        </linearGradient>

        {/* ── Reflejos de vidrio ──────────────────────────────────────── */}
        <linearGradient id={`refl1-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={reflectAlpha * 0.35} />
          <stop offset="60%" stopColor="white" stopOpacity={reflectAlpha * 0.05} />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`refl2-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={reflectAlpha * 0.3} />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {/* tinte sutil del vidrio — apenas se nota, sólo para dar matiz frío */}
        <linearGradient id={`tint-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(glassTint, 20)} stopOpacity="0.14" />
          <stop offset="100%" stopColor={shade(glassTint, -15)} stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* ═══════════ MARCO (frame 3D con chaflán) ═══════════ */}
      {/* Sin fondo: solo dibujamos los 4 lados del marco como trapecios. El interior queda transparente para que se vea la foto. */}

      {/* Lados del marco como trapecios para simular profundidad/chaflán */}
      {/* TOP */}
      <polygon
        points={`0,0 ${W},0 ${W - marco},${marco} ${marco},${marco}`}
        fill={profileSide}
      />
      {/* BOTTOM */}
      <polygon
        points={`${marco},${H - marco} ${W - marco},${H - marco} ${W},${H} 0,${H}`}
        fill={profileSide}
      />
      {/* LEFT */}
      <polygon
        points={`0,0 ${marco},${marco} ${marco},${H - marco} 0,${H}`}
        fill={frameFill}
      />
      {/* RIGHT */}
      <polygon
        points={`${W - marco},${marco} ${W},0 ${W},${H} ${W - marco},${H - marco}`}
        fill={frameFill}
      />

      {/* Chaflán exterior (luz superior, sombra inferior) */}
      <line x1="0" y1="0" x2={W} y2="0" stroke="white" strokeWidth="1.5" opacity="0.35" />
      <line x1="0" y1={H} x2={W} y2={H} stroke="black" strokeWidth="1.5" opacity="0.45" />
      <line x1="0" y1="0" x2="0" y2={H} stroke="white" strokeWidth="0.8" opacity="0.18" />
      <line x1={W} y1="0" x2={W} y2={H} stroke="black" strokeWidth="1" opacity="0.35" />

      {/* Esquinas con soldadura PVC: línea 45° en cada esquina interior */}
      <line x1={marco} y1={marco} x2="0" y2="0" stroke={darkest} strokeWidth="0.8" opacity="0.55" />
      <line x1={W - marco} y1={marco} x2={W} y2="0" stroke={darkest} strokeWidth="0.8" opacity="0.55" />
      <line x1={marco} y1={H - marco} x2="0" y2={H} stroke={darkest} strokeWidth="0.8" opacity="0.55" />
      <line x1={W - marco} y1={H - marco} x2={W} y2={H} stroke={darkest} strokeWidth="0.8" opacity="0.55" />

      {/* Bisel chaflán interno del marco */}
      <rect x={marco - chamfer} y={marco - chamfer} width={innerW + chamfer * 2} height={innerH + chamfer * 2} fill="none" stroke="white" strokeWidth={chamfer} opacity="0.18" />

      {/* ═══════════ HUECO INTERIOR (gasket negro perimetral) ═══════════ */}
      {/* Solo el borde negro perimetral — el interior queda transparente para que la foto se vea */}
      <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="none" stroke="#0a0a0a" strokeWidth={gasketW * 2} />

      {/* ═══════════ PANELES ═══════════ */}
      {panels.map((p, i) => {
        if (p.kind === "solid-door") {
          return (
            <g key={`door-${i}`}>
              {/* cuerpo madera */}
              <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={frameFill} />
              {/* sombras laterales del cuerpo */}
              <rect x={p.x} y={p.y} width={p.w} height={3} fill="white" opacity="0.18" />
              <rect x={p.x} y={p.y + p.h - 3} width={p.w} height={3} fill="black" opacity="0.3" />
              {/* listones horizontales con doble línea (luz + sombra) */}
              {Array.from({ length: 7 }).map((_, k) => {
                const ly = p.y + (p.h / 7) * (k + 1);
                return (
                  <g key={k}>
                    <line x1={p.x + 6} y1={ly} x2={p.x + p.w - 6} y2={ly} stroke={darkest} strokeWidth="1.2" opacity="0.6" />
                    <line x1={p.x + 6} y1={ly + 1} x2={p.x + p.w - 6} y2={ly + 1} stroke="white" strokeWidth="0.6" opacity="0.18" />
                  </g>
                );
              })}
              {/* tirador alargado metálico */}
              <g>
                <rect x={p.x + p.w - 26} y={p.y + p.h * 0.3} width="8" height={p.h * 0.4} rx="4" fill="#3a3d42" />
                <rect x={p.x + p.w - 24} y={p.y + p.h * 0.31} width="4" height={p.h * 0.38} rx="2" fill="url(#metal-handle)" />
                <rect x={p.x + p.w - 24} y={p.y + p.h * 0.31} width="1.5" height={p.h * 0.38} fill="white" opacity="0.7" />
              </g>
              <defs>
                <linearGradient id="metal-handle" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#dadde2" />
                  <stop offset="0.5" stopColor="#f4f5f7" />
                  <stop offset="1" stopColor="#8c8f95" />
                </linearGradient>
              </defs>
            </g>
          );
        }

        // ─ PANEL CON VIDRIO ─
        // El vidrio es SEMI-TRANSPARENTE para que se vea la foto detrás (clave del realismo)
        return (
          <g key={`p-${i}`}>
            {/* goma negra (gasket) — ya queda visible porque el "hueco" es #0a0a0a */}

            {/* Marco del panel (perfil con bisel 3D) */}
            {/* outer panel frame */}
            <rect
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              fill="none"
              stroke={frameFill}
              strokeWidth={panelStroke}
            />
            {/* highlight superior + sombra inferior del marco panel */}
            <line x1={p.x + panelStroke / 2} y1={p.y + panelStroke / 2} x2={p.x + p.w - panelStroke / 2} y2={p.y + panelStroke / 2} stroke="white" strokeWidth={panelStroke * 0.18} opacity="0.45" />
            <line x1={p.x + panelStroke / 2} y1={p.y + p.h - panelStroke / 2} x2={p.x + p.w - panelStroke / 2} y2={p.y + p.h - panelStroke / 2} stroke="black" strokeWidth={panelStroke * 0.18} opacity="0.45" />

            {/* GASKET negro alrededor del vidrio */}
            <rect
              x={p.x + panelStroke}
              y={p.y + panelStroke}
              width={p.w - panelStroke * 2}
              height={p.h - panelStroke * 2}
              fill="none"
              stroke="#0a0a0a"
              strokeWidth={gasketW}
            />

            {/* === VIDRIO === */}
            {/* tinte verdoso/azulado SUTIL — la foto se ve a través */}
            <rect
              x={p.x + panelStroke + gasketW}
              y={p.y + panelStroke + gasketW}
              width={p.w - (panelStroke + gasketW) * 2}
              height={p.h - (panelStroke + gasketW) * 2}
              fill={`url(#tint-${id})`}
            />
            {/* reflejo diagonal principal — banda de luz fina */}
            <polygon
              points={`
                ${p.x + p.w * 0.62},${p.y + panelStroke}
                ${p.x + p.w * 0.72},${p.y + panelStroke}
                ${p.x + p.w * 0.22},${p.y + p.h - panelStroke}
                ${p.x + p.w * 0.12},${p.y + p.h - panelStroke}
              `}
              fill="white"
              opacity={reflectAlpha * 0.22}
            />
            {/* reflejo secundario delgado */}
            <polygon
              points={`
                ${p.x + p.w * 0.82},${p.y + panelStroke}
                ${p.x + p.w * 0.86},${p.y + panelStroke}
                ${p.x + p.w * 0.32},${p.y + p.h - panelStroke}
                ${p.x + p.w * 0.28},${p.y + p.h - panelStroke}
              `}
              fill="white"
              opacity={reflectAlpha * 0.32}
            />
            {/* reflejo esquina superior — simula cielo brillante */}
            <rect
              x={p.x + panelStroke + gasketW}
              y={p.y + panelStroke + gasketW}
              width={p.w - (panelStroke + gasketW) * 2}
              height={(p.h - (panelStroke + gasketW) * 2) * 0.35}
              fill={`url(#refl1-${id})`}
            />
            {/* viñeta sombra interior */}
            <rect
              x={p.x + panelStroke + gasketW}
              y={p.y + panelStroke + gasketW}
              width={p.w - (panelStroke + gasketW) * 2}
              height={p.h - (panelStroke + gasketW) * 2}
              fill="none"
              stroke="black"
              strokeWidth="0.6"
              opacity="0.35"
            />

            {/* === HERRAJE === */}
            {p.handle === "right" && <Handle x={p.x + p.w - 14} y={p.y + p.h / 2} h={Math.min(36, p.h * 0.22)} dir="up" />}
            {p.handle === "left" && <Handle x={p.x + 8} y={p.y + p.h / 2} h={Math.min(36, p.h * 0.22)} dir="up" />}

            {/* indicadores apertura */}
            {p.showOscilo && (
              <polyline
                points={`${p.x + p.w * 0.18},${p.y + p.h - 10} ${p.x + p.w / 2},${p.y + 10} ${p.x + p.w * 0.82},${p.y + p.h - 10}`}
                stroke="white" strokeWidth="0.9" fill="none" opacity="0.35" strokeDasharray="4 3"
              />
            )}
            {p.showBanderola && (
              <polyline
                points={`${p.x + 10},${p.y + p.h - 8} ${p.x + p.w / 2},${p.y + 8} ${p.x + p.w - 10},${p.y + p.h - 8}`}
                stroke="white" strokeWidth="0.9" fill="none" opacity="0.35" strokeDasharray="4 3"
              />
            )}
          </g>
        );
      })}

      {/* sombra interior global del marco (depth) */}
      <rect x={innerX - 1} y={innerY - 1} width={innerW + 2} height={innerH + 2} fill="none" stroke="black" strokeWidth="2" opacity="0.5" />
      <rect x={innerX - 0.5} y={innerY - 0.5} width={innerW + 1} height={innerH + 1} fill="none" stroke="black" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

/* Herraje (manija europea) */
function Handle({ x, y, h, dir = "up" }) {
  return (
    <g>
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c8087" />
          <stop offset="0.35" stopColor="#e6e9ee" />
          <stop offset="0.7" stopColor="#c0c3c9" />
          <stop offset="1" stopColor="#5a5e64" />
        </linearGradient>
      </defs>
      {/* roseta */}
      <rect x={x - 4} y={y - 6} width="10" height="12" rx="2" fill="#3a3d42" />
      <rect x={x - 3.2} y={y - 5.2} width="8.4" height="10.4" rx="1.5" fill="url(#hg)" />
      {/* palanca */}
      <rect x={x - 1} y={y - h} width="4" height={h} rx="1.5" fill="url(#hg)" />
      <rect x={x - 0.8} y={y - h} width="1.4" height={h} fill="white" opacity="0.6" />
      {/* sombra debajo de la palanca */}
      <rect x={x - 1.5} y={y - h - 0.5} width="5" height="1.5" rx="0.7" fill="black" opacity="0.25" />
    </g>
  );
}

function isWoody(hex) {
  const { r, g, b } = hexToRgb(hex);
  return r > b + 15 && r > 80 && g > 40;
}
function hexToRgb(hex) {
  const v = hex.replace("#", "");
  const n = parseInt(v.length === 3 ? v.split("").map(c => c + c).join("") : v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const nr = Math.round((t - r) * p) + r;
  const ng = Math.round((t - g) * p) + g;
  const nb = Math.round((t - b) * p) + b;
  return `#${[nr, ng, nb].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0")).join("")}`;
}
function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }
