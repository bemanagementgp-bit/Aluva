# Aluva · sitio web

Next.js (App Router) + TypeScript. Publicado en https://aluva.vercel.app

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # compila y verifica tipos
```

## Dónde está cada cosa

- `src/content/site.ts` — datos del negocio (contacto, WhatsApp), líneas, productos, proceso y terminaciones. La mayoría de los textos se editan acá.
- `src/app/` — una carpeta por página: inicio, `productos`, `[linea]` (PVC, Aluminio, Vidrios, Revestimientos), `empresa`, `contacto`, `staff`.
- `src/components/` — header, pie, bloques comunes y componentes interactivos (tipologías, configurador DVH, formulario…).
- `src/styles/` — estilos del sitio.
- `public/` — fotos, logos y tipografías.

Las direcciones viejas con `.html` (y `/templados`, `/blindex`) redirigen solas a las nuevas (`next.config.ts`).

Para publicar en Vercel (aluva.vercel.app): subir a `main`; Vercel compila y publica solo.

Para publicar en el hosting de **aluva.com.ar** (Apache, `public_html`): `npm run hosting` genera
`aluva-hosting.zip` listo para subir. Pasos y qué borrar/mover en el servidor: `hosting/COMO-SUBIR.md`.
`npm run hosting:ver` sirve esa exportación en http://localhost:8123 para mirarla antes.
