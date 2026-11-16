/*
  Medición: Pixel de Meta en el navegador + datos de qué anuncio trajo la visita.

  - El ID del pixel sale de NEXT_PUBLIC_META_PIXEL_ID (se fija al compilar).
    Sin ID no se carga nada: la web funciona igual, sin medir.
  - Atribución: al entrar desde un anuncio la URL trae utm_* y fbclid. Se
    guardan (último clic, 90 días) para mandarlos con la consulta a Kommo,
    aunque la persona navegue otras páginas antes de escribir.
  - El evento Lead se manda dos veces con el mismo event_id: desde el navegador
    (pixel) y desde el servidor (lead.php → API de Conversiones). Meta los une
    y cuenta uno solo; si un bloqueador frena el pixel, queda el del servidor.
*/
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded?: boolean; version?: string; push?: unknown };
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

export function cargarPixel() {
  if (!PIXEL_ID || typeof window === "undefined" || window.fbq) return;
  const f = function (...args: unknown[]) {
    if (f.callMethod) f.callMethod(...args); else f.queue.push(args);
  } as Fbq;
  f.push = f; f.loaded = true; f.version = "2.0"; f.queue = [];
  window.fbq = window._fbq = f;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  f("init", PIXEL_ID);
}

export function evento(nombre: string, datos?: Record<string, unknown>, eventID?: string) {
  if (!PIXEL_ID || !window.fbq) return;
  window.fbq("track", nombre, datos ?? {}, eventID ? { eventID } : undefined);
}

/* ---- Atribución ---- */
const CLAVE = "aluva-origen";
const DURACION = 90 * 864e5;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;

export type Origen = Partial<Record<(typeof PARAMS)[number], string>> & { landing?: string; referrer?: string; t?: number };

export function capturarOrigen() {
  try {
    const q = new URLSearchParams(location.search);
    if (!PARAMS.some((p) => q.get(p))) return; // visita sin datos de anuncio: se conserva el último
    const o: Origen = { landing: location.pathname, referrer: document.referrer || undefined, t: Date.now() };
    PARAMS.forEach((p) => { const v = q.get(p); if (v) o[p] = v.slice(0, 200); });
    localStorage.setItem(CLAVE, JSON.stringify(o));
    // Cookie _fbc con el formato que pide Meta, para la API de Conversiones
    if (o.fbclid) document.cookie = `_fbc=fb.1.${o.t}.${o.fbclid}; path=/; max-age=${DURACION / 1e3}; SameSite=Lax`;
  } catch { /* sin almacenamiento: se sigue sin atribución */ }
}

export function leerOrigen(): Origen {
  try {
    const o: Origen = JSON.parse(localStorage.getItem(CLAVE) || "{}");
    if (o.t && Date.now() - o.t > DURACION) return {};
    return o;
  } catch { return {}; }
}

export const cookie = (nombre: string) =>
  document.cookie.split("; ").find((c) => c.startsWith(nombre + "="))?.slice(nombre.length + 1);

export const nuevoEventId = () =>
  (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
