"""
Genera las páginas HTML del sitio de Aluva.

    python _build/build.py

Header, footer y los bloques repetidos viven acá, así se editan una sola vez.
Los estilos están en assets/css/site.css y las interacciones en assets/js/site.js.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Datos del negocio — TODO: completar con los datos reales
# ---------------------------------------------------------------------------
CONTACTO = {
    "tel_visible": "221 675-5077",
    "tel_link": "+5492216755077",
    "email": "ventas@aluva.com.ar",
    "direccion": "La Plata, Buenos Aires",
    "horario": "Lun a Vie 8 a 17 h · Sáb 9 a 13 h",
    "sitio": "https://aluva.com.ar",
}



# ---------------------------------------------------------------------------
# Iconos
# ---------------------------------------------------------------------------
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18.1L0 24l6-1.6A12 12 0 1 0 12 0z"/></svg>'
I_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>'
I_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>'
I_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>'
I_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'

ICONS = {
    "ruler": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="13" width="32" height="14" rx="2"/><path d="M10 13v6M16 13v4M22 13v6M28 13v4"/></svg>',
    "factory": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 34V18l9 6v-6l9 6v-6l9 6V6h5v28z"/><path d="M4 34h32"/></svg>',
    "thermo": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 24V7a3 3 0 0 1 6 0v17a7 7 0 1 1-6 0z"/><path d="M20 14v14"/><circle cx="20" cy="29" r="2.5" fill="currentColor"/></svg>',
    "sound": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15h6l8-7v24l-8-7H6z"/><path d="M27 14l8 12M35 14l-8 12"/></svg>',
    "shield": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4l13 5v10c0 8-6 14-13 17C13 33 7 27 7 19V9z"/><path d="M14 20l4 4 8-8"/></svg>',
    "tools": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 6a8 8 0 0 0-8 10L5 27l6 6 11-11a8 8 0 0 0 10-8l-5 3-4-4z"/></svg>',
    "sun": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><circle cx="20" cy="20" r="7"/><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M8 32l3.5-3.5M28.5 11.5L32 8"/></svg>',
    "drop": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 5s11 12 11 20a11 11 0 0 1-22 0c0-8 11-20 11-20z"/></svg>',
    "palette": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4a16 16 0 1 0 0 32c2 0 3-1 3-3s-2-3-1-5 3-2 6-2c4 0 8-2 8-7C36 10 29 4 20 4z"/><circle cx="12" cy="18" r="2"/><circle cx="18" cy="11" r="2"/><circle cx="27" cy="12" r="2"/></svg>',
    "leaf": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 32C8 16 18 7 34 6c0 16-9 26-24 26z"/><path d="M8 32l14-14"/></svg>',
    "layers": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 5l16 8-16 8-16-8z"/><path d="M4 20l16 8 16-8M4 27l16 8 16-8"/></svg>',
    "sparkle": '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4l3.5 12.5L36 20l-12.5 3.5L20 36l-3.5-12.5L4 20l12.5-3.5z"/></svg>',
}

LINEAS = [
    {"slug": "pvc", "name": "PVC", "short": "La mejor aislación, con perfilería VEKA y DVH fabricado en planta propia.", "img": "photos/linea-pvc.webp", "vit": "photos/portada-pvc.jpg", "mega": "photos/producto-pvc.webp"},
    {"slug": "aluminio", "name": "Aluminio", "short": "Líneas Módena, Herrero y A30: livianas, resistentes y aptas para aberturas grandes.", "img": "photos/linea-aluminio.webp", "vit": "photos/portada-aluminio.jpg", "mega": "photos/producto-aluminio.webp"},
    {"slug": "vidrieria", "name": "Vidriería", "short": "Vidrios cortados a medida, mamparas para baño y doble vidriado hermético hecho en nuestra planta.", "img": "photos/linea-vidrieria.webp", "vit": "photos/esc-vidrieria-1.webp", "mega": "photos/detalle-vidrieria.webp"},
    {"slug": "templados", "name": "Templados", "short": "Frentes, puertas y paños de vidrio templado de seguridad.", "img": "photos/linea-blindex.webp", "vit": "photos/portada-blindex.jpg", "mega": "photos/producto-blindex.webp"},
]


# ---------------------------------------------------------------------------
# Layout
# ---------------------------------------------------------------------------
def head(title, desc, og="brand/og-aluva.jpg"):
    return f"""<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0d2a1e">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{og}">
<meta property="og:locale" content="es_AR">
<link rel="icon" href="brand/icon-principal.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="brand/icon-192.png">
<link rel="preload" href="fonts/lgei-headline-bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
<link rel="stylesheet" href="assets/css/profesionales.css">
</head>
"""


def header(active):
    def cur(k):
        return ' aria-current="page"' if k == active else ""

    mega = "".join(
        f'<a href="{l["slug"]}.html"><b>{l["name"]}</b><small>{l["short"]}</small></a>'
        for l in LINEAS
    )
    prod_active = active in ("productos", "pvc", "aluminio", "vidrieria", "templados")
    sub = "".join(f'<a href="{l["slug"]}.html">{l["name"]}</a>' for l in LINEAS)
    return f"""<body class="page-{active}">
<a class="sr-only" href="#main" style="position:absolute;left:-9999px">Saltar al contenido</a>
<header class="hdr">
  <div class="hdr__in">
    <a class="hdr__logo" href="index.html" aria-label="Aluva — inicio"><img class="logo-d" src="brand/marca-negativa-tagline-web.svg" alt="Aluva · Tecnología en aberturas" width="200" height="30"><img class="logo-l" src="brand/marca-negro-tagline-web.svg" alt="" width="200" height="30"></a>
    <nav class="nav" aria-label="Principal">
      <a href="index.html"{cur("inicio")}>Inicio</a>
      <div class="nav__drop{' is-current' if prod_active else ''}">
        <button type="button" aria-haspopup="true">Productos {CHEV}</button>
        <div class="mega">{mega}<a class="mega__all" href="productos.html">Ver todas las aberturas <span>→</span></a></div>
      </div>
      <a href="empresa.html"{cur("empresa")}>Empresa</a>
      <a href="contacto.html"{cur("contacto")}>Contacto</a>
    </nav>
    <div class="hdr__cta">
      <a class="btn btn--lime" href="contacto.html">Pedí presupuesto <span class="arr">→</span></a>
      <a class="btn btn--white" href="staff.html">Staff</a>
      <button class="burger" type="button" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mnav" aria-label="Menú">
  <div>
    <ol>
      <li><a href="index.html"{cur("inicio")}>Inicio</a></li>
      <li><a href="productos.html"{cur("productos")}>Productos</a></li>
    </ol>
    <div class="mnav__sub">{sub}</div>
    <ol start="3" style="counter-reset:m 2">
      <li><a href="empresa.html"{cur("empresa")}>Empresa</a></li>
      <li><a href="contacto.html"{cur("contacto")}>Contacto</a></li>
    </ol>
  </div>
  <div class="mnav__foot">
    <a class="btn btn--lime" href="contacto.html">Pedí presupuesto <span class="arr">→</span></a>
    <a class="btn btn--ghost" href="#" data-wa>{WA} Escribinos por WhatsApp</a>
    <a class="btn btn--white" href="staff.html">Acceso staff</a>
    <span class="small">{CONTACTO['direccion']} · {CONTACTO['horario']}</span>
  </div>
</div>
<main id="main">
"""


def footer():
    prods = "".join(f'<li><a href="{l["slug"]}.html">{l["name"]}</a></li>' for l in LINEAS)
    return f"""</main>
<footer class="ftr">
  <div class="wrap">
    <p class="ftr__big" aria-hidden="true">Tecnología<br>en aberturas.</p>
    <div class="ftr__grid">
      <div>
        <a class="ftr__logo" href="index.html"><img src="brand/marca-principal-tagline-web.svg" alt="Aluva" width="260" height="40"></a>
        <p class="small" style="max-width:34ch">Fábrica de aberturas a medida · La Plata</p>
      </div>
      <div><h4>Productos</h4><ul>{prods}<li><a href="productos.html">Todas las aberturas</a></li></ul></div>
      <div><h4>Aluva</h4><ul><li><a href="empresa.html">Empresa</a></li><li><a href="empresa.html#proceso">Cómo trabajamos</a></li><li><a href="index.html#profesionales">Profesionales</a></li><li><a href="contacto.html">Contacto</a></li><li><a href="staff.html">Acceso staff</a></li></ul></div>
      <div><h4>Contacto</h4><ul>
        <li><a href="tel:{CONTACTO['tel_link']}">{CONTACTO['tel_visible']}</a></li>
        <li><a href="#" data-wa>WhatsApp</a></li>
        <li><a href="mailto:{CONTACTO['email']}">{CONTACTO['email']}</a></li>
        <li><span class="small">{CONTACTO['direccion']}</span></li>
      </ul></div>
    </div>
    <div class="ftr__bottom">
      <span>© <span data-year>2026</span> Aluva · Tecnología en aberturas. La Plata, Buenos Aires.</span>
    </div>
  </div>
</footer>
<a class="wa" href="#" data-wa aria-label="Escribinos por WhatsApp">{WA}</a>
<script src="assets/js/site.js" defer></script>
</body>
</html>
"""


def profesionales(numero="03"):
    """Sección Profesionales, tal cual el paquete Profesionales.zip (prueba.html)."""
    return f"""<section class="pro" id="profesionales">
  <img class="pro-perfil" src="photos/pvc-despiece-lineas.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <div class="pro-in">
    <p class="pro-volanta">Arquitectos · Estudios · Constructoras</p>
    <span class="pro-palabra" aria-hidden="true">Profesionales</span>
    <span class="pro-regla" aria-hidden="true"></span>
    <h2 class="pro-bajada">Producción al ritmo <strong>de tu obra.</strong></h2>
    <div class="pro-acciones">
      <a class="pro-btn" href="mailto:ventas@aluva.com.ar?subject=Consulta%20profesional">Escribir a ventas<span class="pro-flecha">→</span></a>
      <a class="pro-link" href="https://wa.me/5492216755077" target="_blank" rel="noopener noreferrer">WhatsApp +54 9 221 675-5077</a>
    </div>
  </div>
</section>"""


def terminaciones():
    lineas = [
        ("PVC", "pvc.html", "Perfilería VEKA", [
            ("Blanco", "linear-gradient(135deg,#fbfbf8,#e6e6e0)"),
            ("Roble dorado", "repeating-linear-gradient(100deg,#b07a40 0 6px,#a26e37 6px 9px,#b8844a 9px 16px)"),
            ("Nogal", "repeating-linear-gradient(100deg,#6a4a2e 0 6px,#5c3f26 6px 9px,#72523a 9px 16px)"),
            ("VEKA Spectral", "linear-gradient(135deg,#40464b,#2f3438)"),
        ]),
        ("Aluminio", "aluminio.html", "Módena · Herrero · A30", [
            ("Blanco", "linear-gradient(135deg,#fafaf6,#e4e4de)"),
            ("Anodizado", "linear-gradient(135deg,#d3d6d9,#a7abaf 55%,#c4c7ca)"),
            ("Negro", "linear-gradient(135deg,#2a2c2e,#141516)"),
        ]),
    ]
    rows = ""
    for nombre, href, sub, items in lineas:
        sw = "".join(f'<li class="term__sw rv"><span style="background:{bg}"></span><b>{n}</b></li>' for n, bg in items)
        rows += f'''<div class="term__row">
    <div class="term__head"><h3>{nombre}</h3><small>{sub}</small><a class="link-arrow" href="{href}">Ver línea <span>→</span></a></div>
    <ul class="term__list">{sw}</ul>
  </div>'''
    return f'<div class="term">{rows}</div>'


def proceso_items():
    # Datos de cada paso: src/content/catalogo.js (PROCESO) del proyecto Aluva
    pasos = [
        ("photos/local-aluva.jpg", "Frente del local de Aluva en La Plata", "Consulta", "Asesoramiento y presupuesto.", "Respuesta en 24 h hábiles"),
        ("photos/proceso-medicion.webp", "Operario midiendo un paño de vidrio", "Medición", "Relevamiento de vanos en obra.", "En tu obra, sin cargo"),
        ("photos/proceso-fabricacion.webp", "Perfil sujeto en la máquina de la planta", "Fabricación", "Corte, armado y control en planta.", "En planta propia"),
        ("photos/proceso-obra.webp", "Ambiente con la abertura corrediza instalada", "Instalación", "Colocación, sellado y regulación.", "Con posventa"),
    ]
    return "".join(
        f'''<li class="proc__item rv rv-d{k}">
      <div class="proc__rail" aria-hidden="true"><span class="proc__dot"></span><span class="proc__n">0{k + 1}</span></div>
      <figure class="proc__fig"><img src="{img}" alt="{alt}" loading="lazy"><figcaption>{dato}</figcaption></figure>
      <h3>{t}</h3>
      <p>{d}</p>
    </li>'''
        for k, (img, alt, t, d, dato) in enumerate(pasos)
    )


def eyebrow(n, text):
    return f'<div class="eyebrow"><span class="n">{n}</span>{text}</div>'


def cta(title="¿Tenés una obra?", text="Medición, fabricación e instalación."):
    return f"""<section class="section--tight section--paper"><div class="wrap">
  <div class="cta rv">
    <img class="cta__icon" src="brand/icon-negro.svg" alt="" aria-hidden="true">
    <h2 class="h-xl">{title}</h2>
    <div>
      <p>{text}</p>
      <div class="btn-row">
        <a class="btn btn--lime" href="contacto.html">Pedí tu presupuesto <span class="arr">→</span></a>
        <a class="btn btn--ghost" href="#" data-wa>{WA} WhatsApp</a>
      </div>
    </div>
  </div>
</div></section>"""


def pillars(items, paper=False):
    def cell(i, it):
        ic, t, d = it[:3]
        img = it[3] if len(it) > 3 else None
        bg = f'<img class="pillar__bg" src="{img}" alt="" loading="lazy">' if img else ""
        return f'<div class="pillar{" pillar--img" if img else ""} rv rv-d{i % 4}">{bg}{ICONS[ic]}<h3>{t}</h3><p>{d}</p></div>'
    cells = "".join(cell(i, it) for i, it in enumerate(items))
    return f'<div class="pillars">{cells}</div>'


def drag_gallery(n, title, items):
    figs = "".join(
        f'<figure class="{"tall" if tall else ""}"><img src="{src}" alt="{alt}" loading="lazy"><figcaption>{alt}</figcaption></figure>'
        for src, alt, tall in items
    )
    return f"""<section class="section section--paper" style="padding-bottom:0"><div class="wrap drag-hint">
  <div>{eyebrow(n, "Ambientes")}<h2 class="h-lg rv">{title}</h2></div>
  <div class="drag-nav"><button type="button" data-dir="-1" aria-label="Anterior">{ARROW_L}</button><button type="button" data-dir="1" aria-label="Siguiente">{ARROW}</button></div>
</div>
<div class="drag" style="padding-bottom:80px">{figs}</div></section>"""


def faq(n, items):
    qs = "".join(f"<details><summary>{q}<i></i></summary><p>{a}</p></details>" for q, a in items)
    return f"""<section class="section section--paper"><div class="wrap split" style="align-items:start">
  <div>{eyebrow(n, "Preguntas frecuentes")}<h2 class="h-lg rv">Consultas<br>frecuentes.</h2></div>
  <div class="faq">{qs}</div>
</div></section>"""


THEMES = {"section--paper", "section--gray", "section--black", "section--deep"}


def alternate(html):
    """Intercala verde oscuro y blanco entre secciones consecutivas (y el pie).

    La portada de cada página es siempre oscura; las bandas de foto no cuentan
    como color. El pie toma el tono contrario a la última sección.
    """
    i0, i1 = html.index('<main id="main">'), html.index("</main>")
    main = html[i0:i1]
    n = 0

    def fix(m):
        nonlocal n
        classes = [c for c in m.group(1).split() if c not in THEMES]
        if "band" in classes:
            return m.group(0)
        if "pro" in classes:  # Profesionales es siempre oscura
            if n % 2 == 1:
                print("  ! Profesionales cayó en un lugar claro; reordenar secciones")
            n += 1
            return m.group(0)
        if n % 2 == 1:
            classes.append("section--paper")
        n += 1
        return f'<section class="{" ".join(classes)}"'

    import re
    main = re.sub(r'<section class="([^"]*)"', fix, main)
    html = html[:i0] + main + html[i1:]
    if n % 2 == 0:  # la última sección quedó blanca → pie oscuro (por defecto)
        return html
    return html.replace('<footer class="ftr">', '<footer class="ftr section--paper ftr--light">')


def write(name, html):
    html = alternate(html)
    (ROOT / name).write_text(html, encoding="utf-8")
    print("  ✓", name)


# ---------------------------------------------------------------------------
# INICIO
# ---------------------------------------------------------------------------
def page_index():
    rows = "".join(
        f"""<a class="line-row rv" href="{l['slug']}.html">
  <span class="line-row__n">0{i + 1}</span>
  <span class="line-row__t">{l['name']}</span>
  <span class="line-row__d">{l['short']}</span>
  <span class="line-row__a">{ARROW}</span>
</a>"""
        for i, l in enumerate(LINEAS)
    )
    float_imgs = "".join(f'<img src="{l["vit"]}" alt="">' for l in LINEAS)
    body = f"""
<section class="hero">
  <div class="hero__media"><img src="photos/portada-inicio.jpg" alt="Pared de ventanales con perfiles negros con vista a la ciudad" fetchpriority="high"></div>
  <div class="hero__sash hero__sash--l"></div><div class="hero__sash hero__sash--r"></div>
  <div class="wrap">
    {eyebrow("01", "PVC · Aluminio · Vidrio · Templados")}
    <div class="hero__grid">
      <h1 class="hero__title"><span class="row"><span>Aberturas</span></span><span class="row">a medida</span></h1>
      <div class="hero__side">
        <p class="lead">Fábrica de aberturas de PVC y aluminio, vidriería y templados en La Plata.</p>
        <div class="btn-row">
          <a class="btn btn--lime" href="productos.html">Ver productos <span class="arr">→</span></a>
          <a class="btn btn--ghost" href="contacto.html">Pedí presupuesto</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper"><div class="wrap">
  {eyebrow("02", "Qué fabricamos")}
  <h2 class="h-lg rv">Cuatro líneas,<br>una fábrica.</h2>
  <div style="height:8px"></div>
  <div class="lines">{rows}</div>
  <div style="margin-top:40px"><a class="link-arrow" href="productos.html">Ver todas las aberturas <span>→</span></a></div>
</div></section>

<section class="section section--paper"><div class="wrap">
  {eyebrow("03", "Por qué Aluva")}
  <h2 class="h-lg rv">No revendemos.<br>Fabricamos.</h2>
  {pillars([
      ("factory", "Fábrica propia", "Planta en La Plata.", "photos/det-pvc-1.webp"),
      ("ruler", "Medición en obra", "Relevamiento al milímetro.", "photos/medicion-cinta.jpg"),
      ("thermo", "DVH propio", "Fabricado en planta.", "photos/dvh-perfiles.jpg"),
      ("tools", "Instalación", "Con equipo propio.", "og/producto-aluminio.jpg"),
  ])}
</div></section>

<section class="section section--paper" id="proceso">
  <div class="wrap">
    {eyebrow("04", "Cómo trabajamos")}
    <div class="proc__head">
      <h2 class="h-lg rv">De la idea<br>a tu obra.</h2>
      <p class="proc__note rv rv-d1">Un mismo equipo<br>de principio a fin.</p>
    </div>
  </div>
  <ol class="proc">
    {proceso_items()}
  </ol>
</section>

{profesionales("03")}

<section class="section section--paper"><div class="wrap">
  {eyebrow("06", "Obras e inspiración")}
  <div class="proc__head">
    <h2 class="h-lg rv">Más luz.<br>Más vista.</h2>
    <p class="proc__note rv rv-d1">Obras, detalles<br>y nuestro local.</p>
  </div>
  <div class="bento">
    <figure class="b1 rv"><img src="photos/local-aluva.jpg" alt="Frente del local de Aluva en La Plata" loading="lazy" style="object-position:50% 40%"><span class="bento__n">01</span><figcaption><b>Nuestro local</b><small>Showroom · La Plata</small></figcaption></figure>
    <figure class="b2 rv rv-d1"><img src="og/producto-pvc.jpg" alt="Puerta corrediza de PVC símil madera hacia la pileta" loading="lazy"><span class="bento__n">02</span><figcaption><b>PVC</b><small>Corrediza símil madera</small></figcaption></figure>
    <figure class="b3 rv rv-d2"><img src="og/producto-aluminio.jpg" alt="Corrediza de aluminio de tres hojas hacia el balcón" loading="lazy"><span class="bento__n">03</span><figcaption><b>Aluminio</b><small>Corrediza de tres hojas</small></figcaption></figure>
    <figure class="b4 rv"><img src="photos/det-blindex-1.webp" alt="Puerta de vidrio templado con manijón" loading="lazy"><span class="bento__n">04</span><figcaption><b>Templados</b><small>Puerta de templado</small></figcaption></figure>
    <figure class="b5 rv rv-d1"><img src="photos/mampara-ducha-negra.jpg" alt="Mampara de ducha con perfil negro" loading="lazy"><span class="bento__n">05</span><figcaption><b>Mamparas</b><small>Perfil negro a medida</small></figcaption></figure>
    <figure class="b6 rv rv-d2"><img src="og/producto-vidrieria.jpg" alt="Cerramiento vidriado de balcón" loading="lazy" style="object-position:right bottom"><span class="bento__n">06</span><figcaption><b>Vidriería</b><small>Cerramiento de balcón</small></figcaption></figure>
  </div>
</div></section>

{cta()}
"""
    write("index.html", head("Aluva · Aberturas de PVC y aluminio a medida en La Plata",
                             "Fábrica de aberturas de PVC y aluminio a medida, vidriería, DVH, mamparas y frentes de vidrio templado en La Plata.")
          + header("inicio") + body + footer())


# ---------------------------------------------------------------------------
# SHOWROOM (productos)
# ---------------------------------------------------------------------------
def page_productos():
    chips = {
        "pvc": ["VEKA Clase A", "DVH propio", "Cierre multipunto", "Símil madera"],
        "aluminio": ["Módena", "Herrero", "A30", "Grandes paños"],
        "vidrieria": ["Mamparas", "DVH propio", "Laminado", "Templado"],
        "templados": ["Frentes", "Puertas", "Piel de vidrio", "Seguridad"],
    }
    vits = "".join(
        f"""<a class="vit{' is-active' if i == 0 else ''}" href="{l['slug']}.html" aria-expanded="{'true' if i == 0 else 'false'}">
  <img src="{l['vit']}" alt="Aberturas de {l['name']}" loading="eager">
  <span class="vit__n">0{i + 1} / 04</span>
  <span class="vit__label">{l['name']}</span>
  <div class="vit__body">
    <h3>{l['name']}</h3><p>{l['short']}</p>
    <div class="vit__chips">{''.join(f'<span class="chip">{c}</span>' for c in chips[l['slug']])}</div>
    <span class="btn btn--lime">Explorar línea <span class="arr">→</span></span>
  </div>
</a>"""
        for i, l in enumerate(LINEAS)
    )


    def opts(q, items, sel):
        return f'<div class="opts" data-q="{q}">' + "".join(
            f'<button type="button" class="opt" data-v="{v}" aria-pressed="{"true" if v == sel else "false"}">{t}</button>' for v, t in items
        ) + "</div>"

    body = f"""
<section class="showcase">
  <h1 class="showcase__title">Nuestras aberturas</h1>
  <div class="vitrinas">{vits}</div>
</section>

<section class="section section--paper" id="tipologias"><div class="wrap">
  {eyebrow("02", "Tipologías")}
  <h2 class="h-lg rv">Elegí cómo<br>se abre.</h2>
  <div class="tipo">
    <div class="tipo__list" role="tablist" aria-label="Tipologías"></div>
    <div class="tipo__stage">
      <div class="tipo__diagram"><span class="dg-hint">Movimiento</span><div class="svg-slot" style="display:contents"></div><span class="dg-name"></span></div>
      <div class="tipo__photo"><img src="photos/tipo-corrediza.webp" alt="" loading="lazy"></div>
      <div class="tipo__info">
        <p></p>
        <div class="mat">{''.join(f'<span class="chip" data-m="{m}">{m}</span>' for m in ["PVC", "Aluminio", "Vidriería", "Templados"])}</div>
      </div>
    </div>
  </div>
</div></section>

<section class="section" id="terminaciones"><div class="wrap">
  {eyebrow("03", "Terminaciones")}
  <h2 class="h-lg rv">Elegí el color<br>de tus aberturas.</h2>
  {terminaciones()}
</div></section>

{cta("Cotizá tu obra.", "Planos o medidas aproximadas.")}
"""
    write("productos.html", head("Nuestras aberturas | Aluva La Plata",
                                 "Aberturas de PVC, aluminio, vidriería DVH y vidrio templado a medida. Explorá tipologías y encontrá la abertura ideal.")
          + header("productos") + body + footer())


# ---------------------------------------------------------------------------
# PÁGINAS DE PRODUCTO
# ---------------------------------------------------------------------------
def product_page(p, idx):
    nxt = LINEAS[(idx + 1) % len(LINEAS)]
    def fig(img, t):
        cls = ""
        if ":" in img.split("/")[0]:
            cls, img = img.split(":", 1)
        return f'<figure class="{cls}"><img src="{img}" alt="{t}" loading="lazy"></figure>'
    systems = "".join(
        f'<article class="sys rv rv-d{i % 3}">{fig(img, t)}<div><h3>{t}</h3><p>{d}</p></div></article>'
        for i, (img, t, d) in enumerate(p["systems"])
    )
    body = f"""
<section class="cover">
  <img class="cover__img" src="{p['cover']}" alt="{p['cover_alt']}" fetchpriority="high">
  <div class="wrap cover__in">
    <div class="phero__crumbs"><a href="index.html">Inicio</a><span>/</span><a href="productos.html">Aberturas</a><span>/</span><span>{p['name']}</span></div>
    <h1 class="cover__title">{p['name']}</h1>
    <p class="cover__lead">{p['lead']}</p>
    <div class="btn-row">
      <a class="btn btn--lime" href="contacto.html">Cotizar {p['name']} <span class="arr">→</span></a>
      <a class="btn btn--ghost" href="#" data-wa="Hola Aluva, quiero consultar por {p['name']}.">{WA} Consultar</a>
    </div>
  </div>
</section>

<section class="section section--paper"><div class="wrap">
  {eyebrow("01", "Beneficios")}
  <h2 class="h-lg rv">{p['why_t']}</h2>
  {pillars(p['pillars'])}
</div></section>

{p['special']}

<section class="section section--paper"><div class="wrap">
  {eyebrow("03", p['sys_eyebrow'])}
  <h2 class="h-lg rv">{p['sys_t']}</h2>
  <div class="systems">{systems}</div>
</div></section>

{drag_gallery("04", p['gal_t'], p['gallery'])}

{faq("05", p['faq'])}

<section class="section--tight"><div class="wrap">
  <a class="next" href="{nxt['slug']}.html"><small>Siguiente línea</small><span class="next__t">{nxt['name']} {ARROW}</span></a>
</div></section>

{cta(f"Tu {p['name']}, a medida.", p['cta'])}
"""
    write(f"{p['slug']}.html", head(p["title"], p["desc"], p["og"]) + header(p["slug"]) + body + footer())


def special_pvc():
    items = [
        (50, 6, "Marco multicámara", "Perfil de PVC con cámaras internas que frenan el paso del frío y del calor."),
        (13, 58, "Hoja", "La parte móvil, soldada a inglete en sus cuatro esquinas para un cierre continuo."),
        (25, 38, "Doble vidriado hermético", "Dos vidrios con cámara de aire deshidratado: el corazón de la aislación."),
        (37, 27, "Burletes perimetrales", "Juntas de goma que sellan contra agua, viento y polvo."),
        (47, 73, "Zócalo con drenaje", "Perfil inferior que evacúa el agua de lluvia hacia afuera."),
        (40, 90, "Alféizar", "Terminación exterior que protege el muro y aleja el agua de la ventana."),
        (94, 45, "Perfil de acople", "Permite unir ventanas y paños para formar grandes composiciones."),
    ]
    hs = "".join(f'<button type="button" class="hs" style="left:{x}%;top:{y}%" aria-label="{t}">{i + 1}</button>' for i, (x, y, t, d) in enumerate(items))
    li = "".join(f"<li><b>{t}</b><span>{d}</span></li>" for x, y, t, d in items)
    return f"""<section class="section section--paper" id="anatomia"><div class="wrap">
  {eyebrow("02", "Anatomía de una ventana")}
  <div class="sec-title">
    <h2 class="h-lg rv">Anatomía<br>del sistema.</h2>
    <p class="small">Tocá cada punto.</p>
  </div>
  <div class="anat">
    <div class="anat__img rv"><img src="photos/pvc-despiece-sistema.webp" alt="Despiece de una ventana de PVC con doble vidriado hermético" loading="lazy">{hs}</div>
    <ol class="anat__list">{li}</ol>
  </div>
</div></section>"""


def special_vidrieria():
    def opts(q, items, sel):
        return f'<div class="opts" data-q="{q}">' + "".join(
            f'<button type="button" class="opt" data-v="{v}" aria-pressed="{"true" if v == sel else "false"}">{t}</button>' for v, t in items
        ) + "</div>"
    glass = [("simple", "Float 4 mm"), ("lam", "Laminado 3+3")]
    return f"""<section class="section" id="dvh"><div class="wrap">
  {eyebrow("02", "Configurador DVH")}
  <div class="sec-title">
    <h2 class="h-lg rv">Configurador<br>DVH.</h2>
    <p class="small">Combiná vidrios y cámara.</p>
  </div>
  <div class="dvh">
    <div class="dvh__viz">
      <svg viewBox="0 0 560 400" role="img" aria-label="Corte de un doble vidriado hermético"></svg>
      <div class="dvh__read"><div><small>Espesor total</small><b>17 mm</b></div><small style="text-align:right;max-width:24ch"></small></div>
    </div>
    <div class="dvh__ctrl">
      <div class="q"><h3><span>01</span>Vidrio exterior</h3>{opts("ext", glass, "simple")}</div>
      <div class="q"><h3><span>02</span>Cámara de aire</h3>{opts("cam", [("9", "9 mm"), ("12", "12 mm")], "9")}</div>
      <div class="q"><h3><span>03</span>Vidrio interior</h3>{opts("int", glass, "simple")}</div>
    </div>
  </div>
  <div class="duo">
    <figure class="rv"><img src="photos/dvh-perfiles.jpg" alt="Cortes de perfiles de PVC con doble vidriado hermético" loading="lazy"></figure>
    <figure class="rv rv-d1"><img src="photos/dvh-corte.jpg" alt="Corte de una abertura con doble vidriado hermético" loading="lazy"></figure>
  </div>
</div></section>"""


def special_aluminio():
    # Terminaciones confirmadas en el catálogo de Aluva (iguales en Módena y A30)
    sw = [("#f4f4f0", "Blanco"), ("#b9bdc1", "Anodizado"), ("#1b1d1f", "Negro")]
    swatches = "".join(
        f'<div style="display:flex;flex-direction:column;gap:10px"><span style="display:block;aspect-ratio:1;border-radius:var(--r-box);background:{c};border:1px solid rgba(13,42,30,.15)"></span><b style="font-size:12px;letter-spacing:.12em;text-transform:uppercase">{n}</b></div>'
        for c, n in sw
    )
    return f"""<section class="section section--paper"><div class="wrap">
  {eyebrow("02", "Líneas y terminaciones")}
  <h2 class="h-lg rv">Módena, Herrero<br>y A30.</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:50px;max-width:720px" class="rv">{swatches}</div>
  <div class="split" style="margin-top:60px;gap:18px;align-items:stretch">
    <figure class="clip" style="margin:0;border-radius:2px;overflow:hidden;aspect-ratio:4/5"><img src="photos/det-aluminio-1.webp" alt="Perfil de aluminio de cerca, con su burlete y la manija" loading="lazy" style="width:100%;height:100%;object-fit:cover"></figure>
    <div style="display:flex;flex-direction:column;gap:18px">
      <figure class="clip" style="margin:0;border-radius:2px;overflow:hidden;flex:1;min-height:260px"><img src="photos/det-aluminio-3.webp" alt="Esquina del marco, con el canto y el burlete" loading="lazy" style="width:100%;height:100%;object-fit:cover"></figure>
      <div style="background:var(--bg-2);color:var(--ink);border-radius:var(--r-box);padding:28px">
        <h3 class="h-md" style="margin-bottom:6px">Ficha</h3>
        <dl class="specs"><div><dt>Líneas</dt><dd>Módena, Herrero y A30</dd></div><div><dt>Terminación</dt><dd>Anodizado o pintado</dd></div><div><dt>Vidrio</dt><dd>Simple o DVH de fabricación propia</dd></div></dl>
      </div>
    </div>
  </div>
</div></section>"""


def special_blindex():
    return f"""<section class="section section--paper"><div class="wrap">
  {eyebrow("02", "Vidrio templado")}
  <h2 class="h-lg rv">Solo vidrio.<br>Nada más.</h2>
  <div class="split" style="margin-top:48px;gap:18px">
    <figure class="clip" style="margin:0;border-radius:2px;overflow:hidden;aspect-ratio:4/5"><img src="photos/det-blindex-1.webp" alt="Puerta de vidrio templado con tirador, sin marco" loading="lazy" style="width:100%;height:100%;object-fit:cover"></figure>
    <figure class="clip" style="margin:0;border-radius:2px;overflow:hidden;aspect-ratio:4/5"><img src="photos/blindex.webp" alt="Puerta de vidrio templado" loading="lazy" style="width:100%;height:100%;object-fit:cover"></figure>
  </div>
</div></section>"""


# Contenido de cada línea. Fuente: src/content/catalogo.js del proyecto Aluva
# (líneas, terminaciones, tipologías y beneficios confirmados por el cliente).
PRODUCTS = [
    {
        "slug": "pvc", "name": "PVC", "og": "og/producto-pvc.jpg",
        "title": "Ventanas y puertas de PVC a medida en La Plata | Aluva",
        "desc": "Ventanas y puertas de PVC con perfilería VEKA Clase A y DVH de fabricación propia, a medida en La Plata.",
        "lead": "Perfilería VEKA Clase A con DVH fabricado en nuestra planta.",
        "cover": "photos/portada-pvc.jpg", "cover_alt": "Puerta corrediza de marco blanco que da a un balcón",
        "why_t": "La mejor<br>aislación.",
        "pillars": [
            ("thermo", "Aislación térmica", "Menos horas de calefacción y aire."),
            ("sound", "Silencio adentro", "La opción que más corta el ruido de la calle."),
            ("layers", "DVH propio", "Fabricado en nuestra planta."),
            ("leaf", "Sin mantenimiento", "Foliados de fábrica: no se pintan ni se descascaran."),
        ],
        "special": special_pvc(),
        "sys_eyebrow": "Tipologías", "sys_t": "Una abertura<br>para cada vano.",
        "systems": [
            ("cut:photos/pvc-corrediza-blanca.webp", "Ventana corrediza", "Práctica y sin ocupar espacio."),
            ("cut:photos/pvc-corrediza-3hojas.jpg", "Corrediza de tres hojas", "Para vanos anchos."),
            ("photos/pvc-puerta-corrediza.webp", "Puerta corrediza", "Hacia galerías, patios y balcones."),
            ("photos/pvc-puerta-doble.webp", "Puerta balcón", "Dos hojas batientes."),
            ("cut:photos/pvc-oscilobatiente-abierta.jpg", "Oscilobatiente", "Ventila inclinada o abre por completo."),
            ("photos/tipo-fijo.webp", "Paño fijo", "Más luz, sin hojas móviles."),
        ],
        "gal_t": "PVC de cerca.",
        "gallery": [("og/producto-pvc.jpg", "Puerta corrediza", False), ("photos/det-pvc-2.webp", "Manija sobre hoja en nogal", True), ("photos/det-pvc-4.webp", "Terminaciones foliadas", True), ("photos/esc-pvc-2.webp", "Cocina", False), ("photos/det-pvc-1.webp", "Perfil multicámara", True), ("photos/det-pvc-3.webp", "Cierre multipunto", True)],
        "faq": [
            ("¿Qué perfilería usan?", "VEKA Clase A. Estamos capacitados por VEKA para fabricar e instalar sus sistemas."),
            ("¿Qué terminaciones hay?", "Blanco, roble dorado, nogal y VEKA Spectral, un foliado ultramate, sedoso al tacto y sin reflejos."),
            ("¿El DVH lo hacen ustedes?", "Sí. Fabricamos el doble vidriado hermético en nuestra planta, junto con la ventana."),
            ("¿Conviene PVC o aluminio?", "El PVC aísla mejor y es la opción para quien busca confort térmico y acústico. El aluminio permite perfiles más finos y paños más grandes. En la consulta te decimos cuál conviene para tu caso."),
        ],
        "cta": "Medimos tus vanos y fabricamos tus aberturas de PVC en nuestra planta de La Plata.",
    },
    {
        "slug": "aluminio", "name": "Aluminio", "og": "og/producto-aluminio.jpg",
        "title": "Aberturas de aluminio a medida en La Plata | Aluva",
        "desc": "Aberturas de aluminio a medida en La Plata: líneas Módena, Herrero y A30, en blanco, anodizado o negro, con DVH de fabricación propia.",
        "lead": "Líneas Módena, Herrero y A30. Livianas, resistentes y aptas para aberturas grandes.",
        "cover": "photos/portada-aluminio.jpg", "cover_alt": "Ventana corrediza de aluminio negro con vista a los árboles",
        "why_t": "Más vidrio,<br>menos marco.",
        "pillars": [
            ("sun", "Más luz", "Marcos de poca sección: más superficie de vidrio."),
            ("shield", "Cierre hermético", "Burletes de EPDM y opción de DVH."),
            ("palette", "Tres terminaciones", "Blanco, anodizado o negro."),
            ("tools", "Rinde el presupuesto", "Si buscabas PVC económico, el aluminio rinde más."),
        ],
        "special": special_aluminio(),
        "sys_eyebrow": "Tipologías", "sys_t": "Una abertura<br>para cada vano.",
        "systems": [
            ("photos/tipo-corrediza.webp", "Corredizas", "Uno o varios rieles, también en gran formato."),
            ("cut:photos/al-oscilobatiente.jpg", "Oscilobatientes", "Ventilación segura y apertura total."),
            ("photos/tipo-batiente.webp", "Batientes", "Abren como una puerta, con cierre hermético."),
            ("photos/tipo-banderola.webp", "Banderolas", "Ventilación superior para baños y cocinas."),
            ("photos/tipo-fijo.webp", "Paños fijos", "Para aberturas de gran tamaño."),
            ("photos/tipo-puerta-balcon.webp", "Puerta balcón", "Conecta interior y exterior."),
        ],
        "gal_t": "Aluminio de cerca.",
        "gallery": [("og/producto-aluminio.jpg", "Corrediza de tres hojas", False), ("photos/det-aluminio-2.webp", "Herraje de proyectante", True), ("photos/det-aluminio-4.webp", "Proyectante abierta", True), ("photos/esc-aluminio-2.webp", "Comedor", False), ("photos/det-aluminio-3.webp", "Encuentro de marco y hoja", True), ("photos/det-aluminio-1.webp", "Perfil y burlete", True)],
        "faq": [
            ("¿Qué líneas trabajan?", "Módena, Herrero y A30. Te recomendamos la que corresponde según el tamaño del vano y el uso."),
            ("¿Qué terminaciones hay?", "Blanco, anodizado y negro, en anodizado o pintado."),
            ("¿Puede llevar DVH?", "Sí. El vidrio puede ser simple o DVH, que fabricamos en nuestra planta."),
            ("¿Conviene aluminio o PVC?", "El aluminio permite perfiles más finos y paños más grandes, y rinde más si el presupuesto es ajustado. El PVC aísla mejor. En la consulta te decimos cuál conviene para tu caso."),
        ],
        "cta": "Líneas Módena, Herrero y A30 a medida. Te visitamos, medimos y cotizamos.",
    },
    {
        "slug": "vidrieria", "name": "Vidriería", "og": "og/producto-vidrieria.jpg",
        "title": "Vidriería y mamparas a medida en La Plata | Aluva",
        "desc": "Vidriería y mamparas a medida en La Plata: DVH de fabricación propia, laminado y templado, con colocación y taller propios.",
        "lead": "Vidrios cortados a medida, mamparas para baño y doble vidriado hermético hecho en nuestra planta.",
        "cover": "photos/esc-vidrieria-1.webp", "cover_alt": "Ducha con paño fijo de vidrio sobre pared de mármol",
        "why_t": "Vidrio a la<br>medida exacta.",
        "pillars": [
            ("layers", "DVH propio", "Fabricado en nuestra planta."),
            ("ruler", "Mamparas a medida", "Para tu espacio, no de catálogo."),
            ("shield", "Laminado y templado", "Vidrios de seguridad."),
            ("tools", "Taller propio", "Vidriado en el momento y reparación."),
        ],
        "special": special_vidrieria(),
        "sys_eyebrow": "Soluciones", "sys_t": "Vidrio para<br>cada espacio.",
        "systems": [
            ("photos/vidrieria-mampara-corrediza.png", "Mamparas corredizas", "A medida, con perfil a elección."),
            ("photos/mampara-ducha-fija.jpg", "Paños fijos de ducha", "Templado o laminado."),
            ("photos/mampara-ducha-negra.jpg", "Mamparas batientes", "Con colocación propia."),
            ("photos/vidrio-cerramiento-cocina.webp", "Divisiones interiores", "Separan sin quitar luz."),
            ("cut:photos/dvh-perfiles.jpg", "Doble vidriado hermético", "Fabricado en nuestra planta."),
            ("photos/det-vidrieria-1.webp", "Taller", "Traés la hoja y la vidriamos en el momento."),
        ],
        "gal_t": "Vidrio de cerca.",
        "gallery": [("og/producto-vidrieria.jpg", "Cerramiento vidriado", False), ("photos/det-vidrieria-3.webp", "Baranda de vidrio", True), ("photos/det-vidrieria-2.webp", "Anclaje de baranda", True), ("photos/dvh-cerramiento.jpg", "Cerramiento vidriado", True), ("photos/esc-vidrieria-2.webp", "Mampara corrediza", False), ("photos/vidrio-mampara-ducha.webp", "Mampara", True)],
        "faq": [
            ("¿Hacen mamparas a medida?", "Sí. Las fabricamos a la medida de tu baño y las colocamos con nuestro equipo. En aluminio elegís el color del perfil y el del vidrio."),
            ("¿Puedo poner DVH en mis ventanas actuales?", "En muchas aberturas sí, adaptando el contravidrio. Lo evaluamos en la visita de medición."),
            ("¿Qué diferencia hay entre laminado y templado?", "El laminado tiene una lámina entre dos vidrios que los mantiene unidos si se rompe. El templado es más resistente y, si se rompe, se fragmenta en trozos pequeños sin filo."),
            ("¿Reparan vidrios?", "Sí. Traés la hoja al taller y la vidriamos en el momento."),
        ],
        "cta": "Contanos qué vidrio necesitás. Pasá por el taller o pedinos una visita.",
    },
    {
        "slug": "templados", "name": "Templados", "og": "og/producto-blindex.jpg",
        "title": "Vidrio templado: frentes, puertas y piel de vidrio en La Plata | Aluva",
        "desc": "Frentes comerciales, puertas de vidrio templado y piel de vidrio para fachadas, a medida en La Plata. Medición en obra y colocación propia.",
        "lead": "Frentes y puertas de vidrio templado, y piel de vidrio para fachadas.",
        "cover": "photos/portada-blindex.jpg", "cover_alt": "Puerta de vidrio templado esmerilado con manija",
        "why_t": "El local<br>a la vista.",
        "pillars": [
            ("shield", "Templado de seguridad", "En puertas, frentes y fachadas."),
            ("sun", "El local a la vista", "Frentes que muestran el interior desde la vereda."),
            ("sparkle", "Líneas limpias", "Puertas y frentes sin marcos."),
            ("ruler", "Medido y colocado", "Medición en obra y colocación a cargo nuestro."),
        ],
        "special": special_blindex(),
        "sys_eyebrow": "Aplicaciones", "sys_t": "Frentes, puertas<br>y fachadas.",
        "systems": [
            ("photos/frente-comercial.jpg", "Frentes comerciales", "Vidrieras y accesos de locales."),
            ("photos/blindex.webp", "Puertas de vidrio", "Templado, limpias y resistentes."),
            ("photos/esc-blindex-3.webp", "Piel de vidrio", "Para frentes y fachadas completas."),
            ("photos/mampara-division.jpg", "Oficinas y accesos", "Separan con vidrio templado."),
            ("photos/det-blindex-2.webp", "Paños fijos", "Vidrio templado a medida."),
            ("photos/det-blindex-1.webp", "Puertas con tirador", "Sin marco, solo vidrio y herraje."),
        ],
        "gal_t": "Templado de cerca.",
        "gallery": [("og/producto-blindex.jpg", "Nuestro local", False), ("photos/det-blindex-1.webp", "Puerta de templado", True), ("photos/det-blindex-2.webp", "Canto del paño", True), ("photos/frente-comercial.jpg", "Frente comercial", False), ("photos/mampara-division.jpg", "Oficina", True), ("photos/esc-blindex-3.webp", "Piel de vidrio", True)],
        "faq": [
            ("¿Es lo mismo que Blindex?", "Blindex es una marca registrada de vidrio templado; en el uso cotidiano se le dice así a cualquier templado. Nosotros trabajamos vidrio templado de seguridad."),
            ("¿Se puede cortar después de templado?", "No: el vidrio se corta y perfora antes del templado. Por eso medimos en obra con precisión."),
            ("¿Hacen piel de vidrio?", "Sí, para frentes y fachadas completas. Medimos en obra y cotizamos a medida."),
            ("¿Cuánto tarda?", "Depende del proyecto. Te damos un plazo concreto al confirmar la medición."),
        ],
        "cta": "Frentes, puertas y piel de vidrio a medida. Medimos, fabricamos y colocamos.",
    },
]


# ---------------------------------------------------------------------------
# EMPRESA
# ---------------------------------------------------------------------------
def page_empresa():
    steps = [
        ("01", "Consulta", "Asesoramiento técnico y presupuesto estimado.", "photos/local-aluva.jpg"),
        ("02", "Medición", "Relevamiento en obra y presupuesto final.", "photos/proceso-medicion.webp"),
        ("03", "Fabricación", "Corte, armado, herrajes y control en planta.", "photos/proceso-fabricacion.webp"),
        ("04", "Instalación", "Colocación, sellado y regulación con equipo propio.", "photos/proceso-obra.webp"),
    ]
    tl = "".join(
        f'<div class="tl__item rv"><span class="tl__n">{n}</span><div><h3>{t}</h3><p>{d}</p></div><div class="tl__img clip"><img src="{img}" alt="{t}" loading="lazy" style="object-position:center 35%"></div></div>'
        for n, t, d, img in steps
    )
    body = f"""
<section class="phero blueprint"><div class="wrap">
  <div class="phero__crumbs"><a href="index.html">Inicio</a><span>/</span><span>Empresa</span></div>
  {eyebrow("01", "Nosotros")}
  <div class="phero__row">
    <h1 class="h-giant"><span>Fábrica</span></h1>
    <p class="lead">Aberturas de PVC y aluminio, vidriería y templados. La Plata.</p>
  </div>
</div></section>

<section class="band"><img src="og/producto-blindex.jpg" alt="Nuestro local, con aberturas de perfil negro en exhibición" loading="lazy"><p class="band__cap">Nuestro local.</p></section>

<section class="section section--paper"><div class="wrap">
  {eyebrow("02", "Lo que nos mueve")}
  <h2 class="h-lg rv">De punta<br>a punta.</h2>
  {pillars([
      ("ruler", "Precisión", "Medición propia."),
      ("factory", "Producción", "Planta PVC y aluminio."),
      ("shield", "Materiales", "Perfiles y herrajes de primera."),
      ("tools", "Posventa", "Plazos claros."),
  ])}
</div></section>

<section class="section section--paper" id="proceso"><div class="wrap">
  {eyebrow("03", "Cómo trabajamos")}
  <h2 class="h-lg rv">Cuatro pasos.<br>Cero sorpresas.</h2>
  <div class="tl">{tl}</div>
</div></section>


{cta("Visitá la fábrica.", "Muestras de perfiles, vidrios y herrajes.")}
"""
    write("empresa.html", head("Empresa · Fábrica de aberturas en La Plata | Aluva",
                               "Conocé Aluva: fábrica de aberturas de PVC y aluminio, vidriería y vidrio templado en La Plata. Nuestro proceso y servicio para profesionales.")
          + header("empresa") + body + footer())


# ---------------------------------------------------------------------------
# CONTACTO
# ---------------------------------------------------------------------------
def page_contacto():
    prods = [("pvc", "PVC"), ("alu", "Aluminio"), ("dvh", "DVH / Vidrios"), ("mam", "Mamparas"), ("tem", "Templados"), ("otr", "Otro")]
    picks = "".join(f'<input type="checkbox" id="p-{k}" name="producto" value="{v}"><label for="p-{k}">{v}</label>' for k, v in prods)
    body = f"""
<section class="phero blueprint"><div class="wrap">
  <div class="phero__crumbs"><a href="index.html">Inicio</a><span>/</span><span>Contacto</span></div>
  {eyebrow("01", "Presupuesto sin cargo")}
  <div class="phero__row">
    <h1 class="h-giant"><span>Hablemos</span></h1>
    <p class="lead">Respondemos por WhatsApp.</p>
  </div>
</div>
<div class="wrap contact" style="margin-top:48px">
  <form class="form rv" id="form-presupuesto">
    <div class="two">
      <div class="field"><label for="f-nombre">Nombre</label><input id="f-nombre" name="nombre" required autocomplete="name" maxlength="80" placeholder="Tu nombre"></div>
      <div class="field"><label for="f-zona">Zona / localidad</label><input id="f-zona" name="zona" maxlength="80" placeholder="La Plata, City Bell, Gonnet…"></div>
    </div>
    <div class="field"><label>¿Qué necesitás?</label><div class="pick">{picks}</div></div>
    <div class="field"><label for="f-tipo">Tipo de obra</label>
      <select id="f-tipo" name="tipo"><option value="">Elegí una opción</option><option>Casa nueva</option><option>Reemplazo de aberturas</option><option>Local comercial</option><option>Edificio / desarrollo</option><option>Otro</option></select>
    </div>
    <div class="field"><label for="f-msg">Contanos tu proyecto</label><textarea id="f-msg" name="mensaje" maxlength="1000" placeholder="Cantidad de aberturas, medidas aproximadas, color de perfil…"></textarea></div>
    <div class="hp" aria-hidden="true"><label for="f-web">No completar</label><input id="f-web" name="web" tabindex="-1" autocomplete="off"></div>
    <p class="form-aviso" role="status" hidden></p>
    <button class="btn btn--lime" type="submit" style="justify-self:start">{WA} Enviar por WhatsApp <span class="arr">→</span></button>
    <p class="small" style="margin:0">Se abre WhatsApp con tu consulta.</p>
  </form>
  <div class="cards">
    <a class="ccard rv" href="#" data-wa>{WA}<div><small>WhatsApp</small><b>{CONTACTO['tel_visible']}</b></div></a>
    <a class="ccard rv rv-d1" href="tel:{CONTACTO['tel_link']}">{I_PHONE}<div><small>Teléfono</small><b>{CONTACTO['tel_visible']}</b></div></a>
    <a class="ccard rv rv-d2" href="mailto:{CONTACTO['email']}">{I_MAIL}<div><small>Email</small><b>{CONTACTO['email']}</b></div></a>
    <div class="ccard rv rv-d3">{I_PIN}<div><small>Fábrica</small><b>{CONTACTO['direccion']}</b></div></div>
    <div class="ccard rv rv-d3">{I_CLOCK}<div><small>Horario</small><b>{CONTACTO['horario']}</b></div></div>
  </div>
</div></section>

<section class="section--tight"><div class="wrap">
  <div class="map rv"><iframe title="Mapa de La Plata" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=La+Plata,+Buenos+Aires&output=embed"></iframe></div>
</div></section>
"""
    write("contacto.html", head("Contacto · Pedí tu presupuesto | Aluva La Plata",
                                "Pedí presupuesto de aberturas de PVC, aluminio, DVH, mamparas y vidrio templado en La Plata. Respondemos por WhatsApp.")
          + header("contacto") + body + footer())


# ---------------------------------------------------------------------------
# STAFF (acceso interno, todavía deshabilitado)
# ---------------------------------------------------------------------------
def page_staff():
    body = """
<section class="phero staff"><div class="wrap">
  <div class="staff__card rv">
    <img src="brand/marca-negro-tagline.svg" alt="Aluva" width="200" height="50">
    <h1>Acceso staff</h1>
    <p>Próximamente. Volvé al sitio mientras tanto.</p>
    <form class="staff__form" onsubmit="event.preventDefault()">
      <input placeholder="Usuario" autocomplete="username" disabled>
      <input type="password" placeholder="Contraseña" autocomplete="current-password" disabled>
      <button class="btn btn--dark" type="submit" disabled>Ingresar <span class="arr">→</span></button>
    </form>
    <a class="link-arrow" href="index.html">← Volver al sitio</a>
  </div>
</div></section>
"""
    html = head("Acceso staff | Aluva", "Acceso interno del equipo de Aluva.").replace(
        '<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"')
    write("staff.html", html + header("staff") + body + footer())


if __name__ == "__main__":
    print("Generando sitio Aluva…")
    page_index()
    page_productos()
    for i, p in enumerate(PRODUCTS):
        product_page(p, i)
    page_empresa()
    page_contacto()
    page_staff()
    print("Listo.")
