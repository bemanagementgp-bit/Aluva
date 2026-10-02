/* ==========================================================================
   ALUVA — interacciones del sitio (sin dependencias)
   ========================================================================== */

// Datos de contacto: cambiarlos acá y en _build/build.py (CONTACTO).
const ALUVA = {
  whatsapp: "5492216755077", // con código de país, sin "+" ni espacios
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Carga ---------- */
addEventListener("DOMContentLoaded", () => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded")));

/* ---------- Header ---------- */
(() => {
  const hdr = $(".hdr");
  if (!hdr) return;
  // El header toma el tono de la sección que tiene debajo.
  const blocks = $$("main > section, main > div, footer");
  const isLight = el => el.classList.contains("section--paper") || el.classList.contains("section--gray") || el.dataset.theme === "light";
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const probe = hdr.querySelector(".hdr__in").getBoundingClientRect().top + 32;
    const under = blocks.find(b => { const r = b.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    hdr.classList.toggle("on-light", !!under && isLight(under));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  const burger = $(".burger");
  burger?.addEventListener("click", () => {
    const open = document.documentElement.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  $$(".mnav a").forEach(a => a.addEventListener("click", () => document.documentElement.classList.remove("menu-open")));
  addEventListener("keydown", e => { if (e.key === "Escape") document.documentElement.classList.remove("menu-open"); });
})();

/* ---------- Desplegable de Productos ---------- */
(() => {
  const drop = $(".nav__drop");
  if (!drop) return;
  const btn = $("button", drop);
  const set = open => { drop.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open); };
  btn.setAttribute("aria-expanded", "false");
  btn.addEventListener("click", e => { e.stopPropagation(); set(!drop.classList.contains("is-open")); });
  drop.addEventListener("mouseleave", () => set(false));
  document.addEventListener("click", e => { if (!drop.contains(e.target)) set(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") { set(false); } });
})();

/* ---------- Reveal on scroll ---------- */
(() => {
  const els = $$(".rv, .clip, .cmp");
  if (!("IntersectionObserver" in window) || reduced) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach(e => io.observe(e));
})();

/* ---------- Imagen flotante en la lista de líneas ---------- */
(() => {
  const box = $(".float-img");
  if (!box || !fine) return;
  const imgs = $$("img", box);
  let x = 0, y = 0, tx = 0, ty = 0, raf;
  const loop = () => {
    x += (tx - x) * 0.14; y += (ty - y) * 0.14;
    box.style.left = x + "px"; box.style.top = y + "px";
    raf = requestAnimationFrame(loop);
  };
  $$(".line-row").forEach((row, i) => {
    row.addEventListener("mouseenter", e => {
      tx = x = e.clientX; ty = y = e.clientY;
      imgs.forEach((im, j) => im.classList.toggle("is-on", j === i));
      box.classList.add("is-on");
      cancelAnimationFrame(raf); loop();
    });
    row.addEventListener("mousemove", e => { tx = e.clientX + 170; ty = e.clientY; });
    row.addEventListener("mouseleave", () => { box.classList.remove("is-on"); setTimeout(() => cancelAnimationFrame(raf), 400); });
  });
})();

/* ---------- Vitrinas (acordeón) ---------- */
(() => {
  const vits = $$(".vit");
  if (!vits.length) return;
  const activate = v => vits.forEach(o => { o.classList.toggle("is-active", o === v); o.setAttribute("aria-expanded", o === v); });
  vits.forEach(v => {
    if (fine) v.addEventListener("mouseenter", () => activate(v));
    v.addEventListener("click", e => { if (!v.classList.contains("is-active")) { e.preventDefault(); activate(v); } });
    v.addEventListener("focusin", () => activate(v));
  });
})();

/* ---------- Tipologías ---------- */
(() => {
  const root = $("#tipologias");
  if (!root) return;
  const W = 300, H = 300;
  const frame = (w = W, h = H) => `<rect class="dg-frame" x="0" y="0" width="${w}" height="${h}" rx="4"/>`;
  const sash = (x, y, w, h, cls = "", extra = "") =>
    `<g class="${cls}" ${extra}><rect class="dg-sash" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/><rect class="dg-glass" x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}"/></g>`;
  const T = {
    corrediza: {
      name: "Corrediza", img: "photos/tipo-corrediza.webp", mats: ["PVC", "Aluminio", "Vidriería"],
      txt: "Las hojas se deslizan sobre rieles, sin ocupar espacio hacia adentro ni hacia afuera. Ideal para balcones, livings y lugares donde el espacio cuenta.",
      svg: () => `<svg viewBox="-10 -10 320 320">${frame()}${sash(8, 8, 142, 284)}${sash(150, 8, 142, 284, "anim-slide")}</svg>`
    },
    batiente: {
      name: "Batiente", img: "photos/tipo-batiente.webp", mats: ["PVC", "Aluminio", "Vidriería"],
      txt: "Abre girando sobre bisagras laterales, como una puerta. Da ventilación total y el mejor cierre hermético: la opción más eficiente en aislación.",
      svg: () => `<svg viewBox="-10 -10 320 320">${frame()}${sash(8, 8, 142, 284, "anim-swing")}${sash(150, 8, 142, 284, "anim-swing swing-r")}<circle class="dg-hinge" cx="8" cy="60" r="5"/><circle class="dg-hinge" cx="8" cy="240" r="5"/><circle class="dg-hinge" cx="292" cy="60" r="5"/><circle class="dg-hinge" cx="292" cy="240" r="5"/></svg>`
    },
    oscilobatiente: {
      name: "Oscilobatiente", img: "photos/tipo-oscilobatiente.webp", mats: ["PVC", "Aluminio"],
      txt: "Dos movimientos en un mismo manijón: se inclina desde arriba para ventilar con seguridad, o abre como batiente para limpiar y ventilar a fondo.",
      svg: () => `<svg viewBox="-10 -10 320 320">${frame()}${sash(8, 8, 284, 284, "anim-oscilo")}<rect x="268" y="130" width="8" height="40" rx="3" fill="#eef6e8"/></svg>`
    },
    banderola: {
      name: "Banderola", img: "photos/tipo-banderola.webp", mats: ["Aluminio"],
      txt: "Ventana que se proyecta desde arriba. Ventila aún con lluvia; perfecta en baños, cocinas y sobre puertas.",
      svg: () => `<svg viewBox="-10 -10 320 180">${frame(300, 160)}${sash(8, 8, 284, 144, "anim-tilt")}<circle class="dg-hinge" cx="60" cy="152" r="5"/><circle class="dg-hinge" cx="240" cy="152" r="5"/></svg>`
    },
    fijo: {
      name: "Paño fijo", img: "photos/tipo-fijo.webp", mats: ["PVC", "Aluminio", "Vidriería", "Templados"],
      txt: "Grandes superficies de vidrio sin hojas móviles. Máxima luz, vistas limpias y la mejor relación aislación / costo.",
      svg: () => `<svg viewBox="-10 -10 320 320"><defs><clipPath id="cf"><rect x="20" y="20" width="260" height="260"/></clipPath></defs>${frame()}${sash(8, 8, 284, 284)}<g clip-path="url(#cf)"><rect class="anim-glint" x="20" y="-40" width="60" height="400" fill="rgba(238,246,232,.22)"/></g></svg>`
    },
    puerta: {
      name: "Puerta", img: "photos/tipo-puerta.webp", mats: ["PVC", "Templados"],
      txt: "Puertas de PVC con cierre multipunto, y puertas de vidrio templado para locales y oficinas.",
      svg: () => `<svg viewBox="-10 -10 200 320">${frame(180, 300)}<g class="anim-swing"><rect class="dg-sash" x="8" y="8" width="164" height="292" rx="3"/><rect class="dg-glass" x="28" y="28" width="124" height="120"/><rect x="140" y="160" width="8" height="46" rx="3" fill="#eef6e8"/></g></svg>`
    },
    balcon: {
      name: "Puerta balcón", img: "photos/tipo-puerta-balcon.webp", mats: ["PVC", "Aluminio"],
      txt: "Puertas vidriadas de dos hojas que conectan interior y exterior. Batientes u oscilobatientes, con umbral bajo.",
      svg: () => `<svg viewBox="-10 -10 320 320">${frame()}${sash(8, 8, 142, 284, "anim-swing")}${sash(150, 8, 142, 284, "anim-swing swing-r")}<line x1="150" y1="8" x2="150" y2="292" stroke="#c6f29c" stroke-width="2"/></svg>`
    },
    frente: {
      name: "Frente vidriado", img: "photos/tipo-frente.webp", mats: ["Templados"],
      txt: "Frentes comerciales y vidrieras de locales en vidrio templado, con puertas de acceso integradas.",
      svg: () => `<svg viewBox="-10 -10 340 240">${frame(320, 220)}${sash(8, 8, 100, 204)}${sash(110, 8, 100, 204, "anim-swing")}${sash(212, 8, 100, 204)}</svg>`
    },
    piel: {
      name: "Piel de vidrio", img: "photos/tipo-piel.webp", mats: ["Templados"],
      txt: "Fachadas continuas de vidrio para frentes completos de locales, edificios y oficinas.",
      svg: () => {
        let g = "";
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) g += `<rect class="dg-sash" x="${c * 100 + 4}" y="${r * 100 + 4}" width="92" height="92" rx="2" style="opacity:${0.55 + ((r + c) % 3) * 0.2}"/>`;
        return `<svg viewBox="-10 -10 320 320"><defs><clipPath id="cp"><rect x="0" y="0" width="300" height="300"/></clipPath></defs>${g}<g clip-path="url(#cp)"><rect class="anim-glint" x="0" y="-60" width="70" height="420" fill="rgba(238,246,232,.18)"/></g></svg>`;
      }
    }
  };
  const list = $(".tipo__list", root), dg = $(".tipo__diagram .svg-slot", root), nm = $(".dg-name", root),
    ph = $(".tipo__photo img", root), tx = $(".tipo__info p", root), mats = $$(".mat .chip", root);
  const keys = Object.keys(T);
  list.innerHTML = keys.map((k, i) => `<button type="button" data-k="${k}" role="tab">${T[k].name}<span>0${i + 1}</span></button>`).join("");
  const show = k => {
    const t = T[k];
    $$("button", list).forEach(b => { b.classList.toggle("is-active", b.dataset.k === k); b.setAttribute("aria-selected", b.dataset.k === k); });
    dg.innerHTML = t.svg(); nm.textContent = t.name; tx.textContent = t.txt;
    ph.style.opacity = 0;
    const im = new Image(); im.src = t.img;
    im.onload = () => { ph.src = t.img; ph.alt = "Abertura " + t.name.toLowerCase(); ph.style.opacity = 1; };
    mats.forEach(c => { const on = t.mats.includes(c.dataset.m); c.classList.toggle("is-on", on); c.classList.toggle("is-off", !on); });
  };
  list.addEventListener("click", e => { const b = e.target.closest("button"); if (b) show(b.dataset.k); });
  show("corrediza");
})();


/* ---------- Anatomía (hotspots) ---------- */
(() => {
  const root = $("#anatomia");
  if (!root) return;
  const hs = $$(".hs", root), li = $$(".anat__list li", root);
  const set = i => { hs.forEach((h, j) => h.classList.toggle("is-active", i === j)); li.forEach((l, j) => l.classList.toggle("is-active", i === j)); };
  hs.forEach((h, i) => { h.addEventListener("click", () => set(i)); if (fine) h.addEventListener("mouseenter", () => set(i)); });
  li.forEach((l, i) => l.addEventListener("click", () => set(i)));
  set(0);
})();

/* ---------- Configurador DVH ---------- */
(() => {
  const root = $("#dvh");
  if (!root) return;
  const GL = { simple: { t: 4, lam: false, n: "Float 4 mm" }, lam: { t: 6, lam: true, n: "Laminado 3+3" }, lowe: { t: 4, lam: false, lowe: true, n: "Low-E 4 mm" } };
  const state = { ext: "simple", cam: 9, int: "simple" };
  const svg = $("svg", root);
  const total = $(".dvh__read b", root), desc = $(".dvh__read small", root);
  const draw = () => {
    const e = GL[state.ext], i = GL[state.int], c = +state.cam;
    const tot = e.t + c + i.t, S = 10; // escala px por mm
    const w = tot * S, x0 = 210 - w / 2, H = 300, y0 = 40;
    const pane = (x, g, side) => {
      const pw = g.t * S;
      let out = `<rect class="dvh-layer" x="${x}" y="${y0}" width="${pw}" height="${H}" fill="${g.lowe ? "rgba(140,210,255,.55)" : "rgba(198,242,156,.38)"}" stroke="#c6f29c" stroke-width="1.5"/>`;
      if (g.lam) out += `<rect class="dvh-layer" x="${x + pw / 2 - 2}" y="${y0}" width="4" height="${H}" fill="#5ac80f"/>`;
      if (g.lowe) out += `<rect class="dvh-layer" x="${side === "ext" ? x + pw - 3 : x}" y="${y0}" width="3" height="${H}" fill="#8fd4ff"/>`;
      return out;
    };
    const xc = x0 + e.t * S, cw = c * S;
    const lbl = (x, y, t, anchor = "middle") => `<text x="${x}" y="${y}" fill="#a3bca9" font-size="13" text-anchor="${anchor}" font-family="LG EI Text, sans-serif">${t}</text>`;
    svg.innerHTML = `
      <text x="20" y="22" fill="#c6f29c" font-size="12" letter-spacing="2" font-family="LG EI Text, sans-serif">EXTERIOR</text>
      <text x="540" y="22" fill="#c6f29c" font-size="12" letter-spacing="2" text-anchor="end" font-family="LG EI Text, sans-serif">INTERIOR</text>
      ${pane(x0, e, "ext")}
      <rect class="dvh-layer" x="${xc}" y="${y0 + 30}" width="${cw}" height="${H - 60}" fill="rgba(90,200,15,.06)"/>
      <rect class="dvh-layer" x="${xc}" y="${y0 + H - 34}" width="${cw}" height="30" fill="#5d6b62" rx="2"/>
      <rect class="dvh-layer" x="${xc}" y="${y0 + 4}" width="${cw}" height="30" fill="#5d6b62" rx="2"/>
      <rect class="dvh-layer" x="${xc - 2}" y="${y0 + H - 4}" width="${cw + 4}" height="14" fill="#1f2b24" rx="2"/>
      <rect class="dvh-layer" x="${xc - 2}" y="${y0 - 10}" width="${cw + 4}" height="14" fill="#1f2b24" rx="2"/>
      ${Array.from({ length: 6 }, (_, k) => `<circle cx="${xc + 6 + (k * (cw - 12)) / 5}" cy="${y0 + 19}" r="2" fill="#c6f29c" opacity=".7"/>`).join("")}
      ${pane(xc + cw, i, "int")}
      ${lbl(x0 + (e.t * S) / 2, y0 + H + 42, e.t + " mm")}
      ${lbl(xc + cw / 2, y0 + H + 42, c + " mm")}
      ${lbl(xc + cw + (i.t * S) / 2, y0 + H + 42, i.t + " mm")}
      ${lbl(xc + cw / 2, y0 + H / 2 + 5, "cámara")}
      <path d="M${xc + cw + i.t * S + 16} ${y0 + 20} h40" stroke="#5ac80f" stroke-width="1"/>
      <text x="${xc + cw + i.t * S + 60}" y="${y0 + 24}" fill="#eef6e8" font-size="12" font-family="LG EI Text, sans-serif">separador + desecante</text>
      <path d="M${xc + cw + i.t * S + 16} ${y0 + H + 2} h40" stroke="#5ac80f" stroke-width="1"/>
      <text x="${xc + cw + i.t * S + 60}" y="${y0 + H + 6}" fill="#eef6e8" font-size="12" font-family="LG EI Text, sans-serif">sellado perimetral</text>`;
    total.textContent = tot + " mm";
    desc.textContent = `${e.n} + cámara ${c} mm + ${i.n}`;
  };
  $$(".opts", root).forEach(g => g.addEventListener("click", ev => {
    const b = ev.target.closest(".opt"); if (!b) return;
    $$(".opt", g).forEach(o => o.setAttribute("aria-pressed", o === b));
    state[g.dataset.q] = b.dataset.v; draw();
  }));
  draw();
})();

/* ---------- Galerías arrastrables ---------- */
$$(".drag").forEach(el => {
  let down = false, sx = 0, sl = 0, moved = false;
  el.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; });
  addEventListener("pointermove", e => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 4) { moved = true; el.classList.add("is-dragging"); } el.scrollLeft = sl - d; });
  addEventListener("pointerup", () => { if (!down) return; down = false; el.classList.remove("is-dragging"); });
  el.addEventListener("click", e => { if (moved) e.preventDefault(); }, true);
  const nav = el.previousElementSibling?.querySelector?.(".drag-nav") || $(".drag-nav", el.parentElement);
  if (nav) {
    const step = () => (el.firstElementChild?.offsetWidth || 400) + 18;
    $("[data-dir='-1']", nav)?.addEventListener("click", () => el.scrollBy({ left: -step(), behavior: "smooth" }));
    $("[data-dir='1']", nav)?.addEventListener("click", () => el.scrollBy({ left: step(), behavior: "smooth" }));
  }
});

/* ---------- Tilt de la tarjeta de producto ---------- */
$$(".prod-card").forEach(card => {
  if (!fine || reduced) return;
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

/* ---------- Parallax de bandas ---------- */
(() => {
  const bands = $$(".band img, [data-parallax]");
  if (!bands.length || reduced) return;
  const tick = () => {
    bands.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translate3d(0, ${p * -12 - 10}%, 0)`;
    });
  };
  addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true });
  tick();
})();

/* ---------- Límite de envíos de formularios ----------
   El sitio es estático: esto frena el reenvío repetido y los bots simples
   desde el navegador. Si algún formulario pasa a enviar a un servidor, el
   límite tiene que aplicarse también ahí (el del navegador se puede saltear). */
const RATE = { max: 3, ventana: 10 * 60e3, espera: 30e3, minLlenado: 3e3 };
const rateLimit = (clave) => {
  const k = "aluva-envios-" + clave;
  let lista = [];
  try { lista = JSON.parse(localStorage.getItem(k) || "[]"); } catch (_) {}
  const ahora = Date.now();
  lista = lista.filter(t => ahora - t < RATE.ventana);
  const ultimo = lista[lista.length - 1] || 0;
  if (ahora - ultimo < RATE.espera) return { ok: false, seg: Math.ceil((RATE.espera - (ahora - ultimo)) / 1e3) };
  if (lista.length >= RATE.max) return { ok: false, seg: Math.ceil((RATE.ventana - (ahora - lista[0])) / 1e3) };
  return { ok: true, registrar: () => { lista.push(ahora); try { localStorage.setItem(k, JSON.stringify(lista)); } catch (_) {} } };
};
const esperaTexto = seg => seg > 90 ? `${Math.ceil(seg / 60)} minutos` : `${seg} segundos`;

/* ---------- Formulario → WhatsApp ---------- */
(() => {
  const f = $("#form-presupuesto");
  if (!f) return;
  const abierto = Date.now();
  const aviso = $(".form-aviso", f);
  const avisar = t => { if (aviso) { aviso.textContent = t; aviso.hidden = !t; } };
  f.addEventListener("submit", e => {
    e.preventDefault();
    // Campo trampa: invisible para personas, los bots lo completan
    if (f.elements.web && f.elements.web.value) return;
    if (Date.now() - abierto < RATE.minLlenado) { avisar("Revisá los datos y volvé a enviar."); return; }
    const r = rateLimit("presupuesto");
    if (!r.ok) { avisar(`Ya recibimos tu consulta. Podés volver a enviar en ${esperaTexto(r.seg)}.`); return; }
    r.registrar();
    avisar("");
    const d = new FormData(f);
    const prods = d.getAll("producto").join(", ") || "sin especificar";
    const msg = [
      "Hola Aluva, quiero pedir un presupuesto.",
      `Nombre: ${d.get("nombre") || ""}`,
      d.get("zona") ? `Zona: ${d.get("zona")}` : "",
      `Productos: ${prods}`,
      d.get("tipo") ? `Tipo de obra: ${d.get("tipo")}` : "",
      d.get("mensaje") ? `Detalle: ${d.get("mensaje")}` : ""
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${ALUVA.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });
})();

/* ---------- Links genéricos de WhatsApp ---------- */
$$("[data-wa]").forEach(a => {
  const t = a.dataset.wa || "Hola Aluva, quiero hacer una consulta.";
  a.href = `https://wa.me/${ALUVA.whatsapp}?text=${encodeURIComponent(t)}`;
  a.target = "_blank"; a.rel = "noopener";
});

/* ---------- Año del footer ---------- */
$$("[data-year]").forEach(e => e.textContent = new Date().getFullYear());
