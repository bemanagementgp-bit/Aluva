# Aluva · sitio web

Next.js (App Router) + TypeScript. Se publica en https://aluva.com.ar (hosting compartido, Apache + PHP).

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # compila el sitio estático en out/ y verifica tipos
NEXT_PUBLIC_META_PIXEL_ID=<id> npm run build   # con Pixel de Meta
```

## Dónde está cada cosa

- `src/content/site.ts` — datos del negocio (contacto, WhatsApp), líneas, productos, proceso y terminaciones. La mayoría de los textos se editan acá.
- `src/app/` — una carpeta por página: inicio, `productos`, `[linea]` (PVC, Aluminio, Vidriería, Templados), `empresa`, `contacto`, `staff`.
- `src/components/` — header, pie, bloques comunes y componentes interactivos (tipologías, configurador DVH, formulario…).
- `src/styles/` — estilos del sitio.
- `public/` — fotos, logos y tipografías.

Las direcciones viejas con `.html` (y `/blindex`) redirigen solas a las nuevas (`public/.htaccess`).

## Medición y CRM

- `src/lib/tracking.ts` + `src/components/MetaPixel.tsx` — Pixel de Meta y origen del anuncio (utm_*, fbclid).
- `src/lib/telefono.ts` — normaliza teléfonos argentinos.
- `public/lead.php` — recibe el formulario: Kommo + API de Conversiones de Meta + respaldo. Configuración en `aluva-config.php` fuera de `public_html` (modelo: `public/lead-config.example.php`).
- `scripts/kommo-setup.mjs` — arma embudo, campos y motivos de descarte en Kommo.
- Pasos pendientes: `docs/09-pendientes.md`.

Para publicar: `npm run build` y subir el contenido de `out/` a `public_html`.
