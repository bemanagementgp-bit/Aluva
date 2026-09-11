/*
  Dibujo técnico de una tipología de apertura, en el lenguaje de un plano de
  carpintería: marco, hoja y el triángulo que indica hacia dónde abre (el
  vértice apunta al lado de las bisagras). Trazo fino, canto vivo, sin
  redondeos; el color de las líneas de apertura es el verde de marca.
*/
export const NOMBRES_TIPOLOGIA = {
  corrediza: "Corrediza",
  oscilobatiente: "Oscilobatiente",
  batiente: "De abrir",
  banderola: "Banderola",
  fijo: "Paño fijo",
  puerta: "Puerta",
  "puerta-balcon": "Puerta balcón",
  frente: "Frente con puerta",
  piel: "Piel de vidrio",
};

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "miter", strokeLinecap: "square" };
const apertura = { fill: "none", stroke: "var(--aluva-green-dark)", strokeWidth: 1.3, strokeLinejoin: "miter" };
const punteada = { ...apertura, strokeDasharray: "3 3" };

function Dibujo({ tipo }) {
  switch (tipo) {
    case "corrediza":
      return (
        <>
          <rect x="4" y="4" width="56" height="72" {...trazo} />
          <rect x="8" y="8" width="26" height="64" {...trazo} />
          <rect x="30" y="10" width="26" height="60" {...trazo} />
          <path d="M50 40 H38 M42 36 L38 40 L42 44" {...apertura} />
        </>
      );
    case "oscilobatiente":
      return (
        <>
          <rect x="4" y="4" width="56" height="72" {...trazo} />
          <rect x="9" y="9" width="46" height="62" {...trazo} />
          <path d="M55 9 L9 40 L55 71" {...apertura} />
          <path d="M9 9 L32 71 L55 9" {...punteada} />
        </>
      );
    case "batiente":
      return (
        <>
          <rect x="4" y="4" width="56" height="72" {...trazo} />
          <rect x="9" y="9" width="46" height="62" {...trazo} />
          <path d="M55 9 L9 40 L55 71" {...apertura} />
        </>
      );
    case "banderola":
      return (
        <>
          <rect x="4" y="16" width="56" height="48" {...trazo} />
          <rect x="9" y="21" width="46" height="38" {...trazo} />
          <path d="M9 21 L32 59 L55 21" {...apertura} />
        </>
      );
    case "fijo":
      return (
        <>
          <rect x="4" y="4" width="56" height="72" {...trazo} />
          <rect x="9" y="9" width="46" height="62" {...trazo} />
          <path d="M9 9 L55 71 M55 9 L9 71" {...punteada} />
        </>
      );
    case "puerta":
      return (
        <>
          <rect x="14" y="4" width="36" height="72" {...trazo} />
          <rect x="18" y="8" width="28" height="68" {...trazo} />
          <path d="M46 8 L18 42 L46 76" {...apertura} />
          <path d="M42 40 V46" {...trazo} />
        </>
      );
    case "puerta-balcon":
      return (
        <>
          <rect x="4" y="4" width="56" height="72" {...trazo} />
          <path d="M32 4 V76" {...trazo} />
          <path d="M8 8 L30 40 L8 72" {...apertura} />
          <path d="M56 8 L34 40 L56 72" {...apertura} />
          <path d="M28 37 V43 M36 37 V43" {...trazo} />
        </>
      );
    case "frente":
      return (
        <>
          <rect x="2" y="4" width="60" height="72" {...trazo} />
          <path d="M20 4 V76 M44 4 V76" {...trazo} />
          <path d="M44 8 L20 42 L44 76" {...apertura} />
          <path d="M2 8 L20 8 M44 8 L62 8" {...trazo} />
        </>
      );
    case "piel":
      return (
        <>
          <rect x="4" y="4" width="56" height="72" {...trazo} />
          <path d="M22.7 4 V76 M41.3 4 V76 M4 28 H60 M4 52 H60" {...trazo} />
        </>
      );
    default:
      return <rect x="4" y="4" width="56" height="72" {...trazo} />;
  }
}

export default function Tipologia({ tipo }) {
  return (
    <figure className="tipo" data-testid={`tipologia-${tipo}`}>
      <svg viewBox="0 0 64 80" width="64" height="80" aria-hidden="true" focusable="false">
        <Dibujo tipo={tipo} />
      </svg>
      <figcaption className="label">{NOMBRES_TIPOLOGIA[tipo] || tipo}</figcaption>
    </figure>
  );
}
