import { useEffect, useRef, useState } from "react";

/*
  Ventana corrediza que se abre de verdad (primera foto de la línea PVC).

  La foto está armada en dos capas, generadas a partir de la misma imagen:
  - pvc-corrediza-base.webp: la ventana sin la hoja izquierda. Lo que la hoja
    tapaba (montante, rieles, la pared del hueco y el montante de la hoja fija)
    está reconstruido con piezas de la propia foto; cerrada se ve igual que la
    original.
  - pvc-corrediza-hoja.webp: solo la hoja izquierda con su manija, con fondo
    transparente y el vidrio casi transparente, para que al correrse se vea la
    hoja fija a través.

  La hoja se arrastra con el mouse o el dedo; un toque la abre o la cierra, y
  con el teclado funciona como un control deslizante (flechas, Inicio, Fin).
  La foto va entera (ajustada al ancho) y no recortada como las demás: si no,
  la manija y el marco quedaban afuera del cuadro.

  Sobre el vidrio de la hoja, un aviso muy sutil ("Deslizá para abrir la
  ventana") queda hasta que el visitante la corre por primera vez; después no
  vuelve, ni en la home ni en la ficha.

  Las medidas son de esta foto en particular, en píxeles de la imagen de
  1448 × 1086: si se cambia la foto, hay que regenerar las capas.
*/
export const FOTO_CORREDIZA = "/photos/pvc-ventana-corrediza.webp";

const ANCHO = 1448;
const ALTO = 1086;
const HOJA = { x: 94, y: 266, w: 691 };
// Hasta dónde se corre la hoja: hasta tapar el tirador de la hoja fija
const RECORRIDO = 526;

const pct = (v, total) => `${(v / total) * 100}%`;
const acotar = (v) => Math.min(1, Math.max(0, v));

const CLAVE_AVISO = "aluva:ventana-aviso-visto";
const avisoYaVisto = () => { try { return window.localStorage.getItem(CLAVE_AVISO) === "1"; } catch { return false; } };
const marcarAvisoVisto = () => { try { window.localStorage.setItem(CLAVE_AVISO, "1"); } catch { /* sin almacenamiento: vale solo por esta visita */ } };

export default function VentanaCorrediza({ activa, alt }) {
  const marco = useRef(null);
  const arrastre = useRef(null);
  const [apertura, setApertura] = useState(0); // 0 cerrada · 1 abierta del todo
  const [arrastrando, setArrastrando] = useState(false);
  const [tocada, setTocada] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [avisoVisto] = useState(avisoYaVisto);

  // El amague de la hoja espera a que la ventana esté en pantalla: la vitrina
  // carga activa debajo del hero y, si no, ocurría sin que nadie lo viera
  useEffect(() => {
    const el = marco.current;
    if (!el || typeof IntersectionObserver === "undefined") { setEnVista(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Al pasar a otra línea, la ventana se vuelve a cerrar
  useEffect(() => { if (!activa) setApertura(0); }, [activa]);

  const tocar = () => {
    if (tocada) return;
    setTocada(true);
    marcarAvisoVisto();
  };

  const alBajar = (e) => {
    if (!activa || (e.pointerType === "mouse" && e.button !== 0)) return;
    arrastre.current = { x: e.clientX, desde: apertura, movio: false };
    // La captura hace que el arrastre siga aunque el puntero salga de la hoja;
    // si el navegador la rechaza (puntero ya liberado), el arrastre anda igual
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* sin captura */ }
    tocar();
  };

  const alMover = (e) => {
    const a = arrastre.current;
    if (!a) return;
    const dx = e.clientX - a.x;
    if (!a.movio && Math.abs(dx) < 4) return;
    a.movio = true;
    setArrastrando(true);
    const recorridoPx = ((marco.current?.offsetWidth || 0) * RECORRIDO) / ANCHO;
    if (recorridoPx) setApertura(acotar(a.desde + dx / recorridoPx));
  };

  // Soltar sin haber arrastrado es un toque: abre o cierra
  const alSoltar = () => {
    const a = arrastre.current;
    arrastre.current = null;
    setArrastrando(false);
    if (a && !a.movio) setApertura((v) => (v > 0.5 ? 0 : 1));
  };

  // Si el navegador se queda con el gesto (el usuario estaba scrolleando), no se alterna
  const alCancelar = () => {
    arrastre.current = null;
    setArrastrando(false);
  };

  const alTeclado = (e) => {
    const pasos = { ArrowRight: 0.1, ArrowUp: 0.1, ArrowLeft: -0.1, ArrowDown: -0.1 };
    let v = null;
    if (e.key in pasos) v = apertura + pasos[e.key];
    else if (e.key === "Home") v = 0;
    else if (e.key === "End") v = 1;
    else if (e.key === "Enter" || e.key === " ") v = apertura > 0.5 ? 0 : 1;
    if (v === null) return;
    e.preventDefault();
    tocar();
    setApertura(acotar(v));
  };

  const porcentaje = Math.round(apertura * 100);
  const sombra = Math.min(1, apertura * 4) * 0.3;
  const invita = activa && enVista && !tocada && !avisoVisto;

  return (
    <div
      className={`vit-ventana${activa ? " is-active" : ""}${tocada ? " is-tocada" : ""}${invita ? " is-invita" : ""}`}
      aria-hidden={!activa}
    >
      <div ref={marco} className="vit-ventana-marco">
        <img src="/photos/pvc-corrediza-base.webp" alt={alt} className="vit-ventana-base" decoding="async" draggable="false" />
        <div
          className={`vit-ventana-hoja${arrastrando ? " is-arrastrando" : ""}`}
          role="slider"
          tabIndex={activa ? 0 : -1}
          aria-label="Abrir la ventana corrediza"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={porcentaje}
          aria-valuetext={porcentaje ? `Abierta ${porcentaje}%` : "Cerrada"}
          data-testid="ventana-hoja"
          style={{
            left: pct(HOJA.x, ANCHO),
            top: pct(HOJA.y, ALTO),
            width: pct(HOJA.w, ANCHO),
            transform: `translateX(${((apertura * RECORRIDO) / HOJA.w) * 100}%)`,
            filter: sombra ? `drop-shadow(10px 0 12px rgba(0, 0, 0, ${sombra.toFixed(2)}))` : "none",
          }}
          onPointerDown={alBajar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alCancelar}
          onKeyDown={alTeclado}
        >
          <img src="/photos/pvc-corrediza-hoja.webp" alt="" decoding="async" draggable="false" />
          {!avisoVisto && (
            <span className={`vit-ventana-aviso${tocada ? " is-oculto" : ""}`} aria-hidden="true" data-testid="ventana-aviso">
              <span className="vit-ventana-aviso-largo">Deslizá para abrir la ventana</span>
              <span className="vit-ventana-aviso-corto">Deslizá para abrir</span>
              <i>→</i>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
