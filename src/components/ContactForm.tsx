"use client";
/*
  Formulario de presupuesto: arma el mensaje y lo abre en WhatsApp.

  Límite de envíos: frena el reenvío repetido y los bots simples desde el
  navegador. Si el formulario pasa a enviar a un servidor, el límite tiene que
  aplicarse también ahí (el del navegador se puede saltear).
*/
import { useRef, useState, type FormEvent } from "react";
import { WA } from "./Icon";
import { waLink } from "@/content/site";

/* Adjuntos: un enlace de WhatsApp (wa.me) solo lleva texto. En celulares que lo
   permiten se usa "Compartir" del sistema con archivos y texto (se elige
   WhatsApp y el chat de Aluva). Si no, se abre WhatsApp con el texto y se avisa
   que hay que adjuntar los archivos en el chat. */
const MAX_ARCHIVOS = 5;
const MAX_MB = 15;
const RATE = { max: 3, ventana: 10 * 60e3, espera: 30e3, minLlenado: 3e3 };
const PRODUCTOS: [string, string][] = [["pvc", "PVC"], ["alu", "Aluminio"], ["tem", "Templados"], ["dvh", "DVH / Vidrios"], ["mam", "Mamparas"], ["rev", "Revestimientos"], ["otr", "Otro"]];

function rateLimit(clave: string): { ok: true; registrar: () => void } | { ok: false; seg: number } {
  const k = "aluva-envios-" + clave;
  let lista: number[] = [];
  try { lista = JSON.parse(localStorage.getItem(k) || "[]"); } catch { /* sin almacenamiento */ }
  const ahora = Date.now();
  lista = lista.filter((t) => ahora - t < RATE.ventana);
  const ultimo = lista[lista.length - 1] || 0;
  if (ahora - ultimo < RATE.espera) return { ok: false, seg: Math.ceil((RATE.espera - (ahora - ultimo)) / 1e3) };
  if (lista.length >= RATE.max) return { ok: false, seg: Math.ceil((RATE.ventana - (ahora - lista[0])) / 1e3) };
  return { ok: true, registrar: () => { lista.push(ahora); try { localStorage.setItem(k, JSON.stringify(lista)); } catch { /* */ } } };
}
const esperaTexto = (seg: number) => (seg > 90 ? `${Math.ceil(seg / 60)} minutos` : `${seg} segundos`);

export default function ContactForm() {
  const abierto = useRef(Date.now());
  const [aviso, setAviso] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);

  const elegir = (lista: FileList | null) => {
    const fs = Array.from(lista ?? []).slice(0, MAX_ARCHIVOS);
    const total = fs.reduce((t, f) => t + f.size, 0) / 1048576;
    if (total > MAX_MB) { setAviso(`Los archivos superan ${MAX_MB} MB. Elegí menos o más livianos.`); setArchivos([]); return; }
    setAviso("");
    setArchivos(fs);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    if (d.get("web")) return; // campo trampa: invisible para personas, los bots lo completan
    if (Date.now() - abierto.current < RATE.minLlenado) { setAviso("Revisá los datos y volvé a enviar."); return; }
    const r = rateLimit("presupuesto");
    if (!r.ok) { setAviso(`Ya recibimos tu consulta. Podés volver a enviar en ${esperaTexto(r.seg)}.`); return; }
    r.registrar();
    setAviso("");
    const prods = d.getAll("producto").join(", ") || "sin especificar";
    const msg = [
      "Hola Aluva, quiero pedir un presupuesto.",
      `Nombre: ${d.get("nombre") || ""}`,
      d.get("zona") ? `Zona: ${d.get("zona")}` : "",
      `Productos: ${prods}`,
      d.get("tipo") ? `Tipo de obra: ${d.get("tipo")}` : "",
      d.get("mensaje") ? `Detalle: ${d.get("mensaje")}` : "",
      archivos.length ? `Adjunto ${archivos.length} archivo${archivos.length > 1 ? "s" : ""}: ${archivos.map((f) => f.name).join(", ")}` : "",
    ].filter(Boolean).join("\n");

    // Con archivos: "Compartir" del sistema, si el navegador puede compartirlos
    if (archivos.length && typeof navigator.canShare === "function" && navigator.canShare({ files: archivos })) {
      try {
        await navigator.share({ files: archivos, text: msg });
        setAviso("Elegí WhatsApp y el chat de Aluva para enviar la consulta con tus archivos.");
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // la persona canceló
      }
    }
    window.open(waLink(msg), "_blank", "noopener");
    if (archivos.length) setAviso("Se abrió WhatsApp con tu consulta. Adjuntá ahí tus archivos con el clip 📎 antes de enviar.");
  };

  return (
    <form className="form rv" id="form-presupuesto" onSubmit={onSubmit}>
      <div className="two">
        <div className="field"><label htmlFor="f-nombre">Nombre</label><input id="f-nombre" name="nombre" required autoComplete="name" maxLength={80} placeholder="Tu nombre" /></div>
        <div className="field"><label htmlFor="f-zona">Zona / localidad</label><input id="f-zona" name="zona" maxLength={80} placeholder="La Plata, City Bell, Gonnet…" /></div>
      </div>
      <div className="field">
        <label>¿Qué necesitás?</label>
        <div className="pick">
          {PRODUCTOS.map(([k, v]) => (
            <span key={k} style={{ display: "contents" }}>
              <input type="checkbox" id={`p-${k}`} name="producto" value={v} /><label htmlFor={`p-${k}`}>{v}</label>
            </span>
          ))}
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-tipo">Tipo de obra</label>
        <select id="f-tipo" name="tipo" defaultValue="">
          <option value="">Elegí una opción</option><option>Casa nueva</option><option>Reemplazo de aberturas</option><option>Local comercial</option><option>Edificio / desarrollo</option><option>Otro</option>
        </select>
      </div>
      <div className="field"><label htmlFor="f-msg">Contanos tu proyecto</label><textarea id="f-msg" name="mensaje" maxLength={1000} placeholder="Cantidad de aberturas, medidas aproximadas, color de perfil…" /></div>
      <div className="field">
        <label htmlFor="f-arch">Fotos o planos <span className="opt-label">(opcional)</span></label>
        <input id="f-arch" className="file-in" type="file" multiple accept="image/*,application/pdf" onChange={(e) => elegir(e.target.files)} />
        <label htmlFor="f-arch" className="file-btn">📎 {archivos.length ? `${archivos.length} archivo${archivos.length > 1 ? "s" : ""} elegido${archivos.length > 1 ? "s" : ""}` : "Adjuntar archivos"}</label>
        {archivos.length > 0 && <ul className="file-list">{archivos.map((f) => <li key={f.name}>{f.name}</li>)}</ul>}
        <small className="file-hint">Hasta {MAX_ARCHIVOS} archivos (imágenes o PDF), {MAX_MB} MB en total.</small>
      </div>
      <div className="hp" aria-hidden="true"><label htmlFor="f-web">No completar</label><input id="f-web" name="web" tabIndex={-1} autoComplete="off" /></div>
      <p className="form-aviso" role="status" hidden={!aviso}>{aviso}</p>
      <button className="btn btn--lime" type="submit" style={{ justifySelf: "start" }}><WA /> Enviar por WhatsApp <span className="arr">→</span></button>
      <p className="small" style={{ margin: 0 }}>Se abre WhatsApp con tu consulta.</p>
    </form>
  );
}
