# Aluva · sitio web

Next.js (App Router) + TypeScript. Publicado en https://aluva.vercel.app

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # compila y verifica tipos
```

## Dónde está cada cosa

- `src/content/site.ts` — datos del negocio (contacto, WhatsApp), líneas, productos, proceso y terminaciones. La mayoría de los textos se editan acá.
- `src/app/` — una carpeta por página: inicio, `productos`, `[linea]` (PVC, Aluminio, Vidriería, Templados), `empresa`, `contacto`, `staff`.
- `src/components/` — header, pie, bloques comunes y componentes interactivos (tipologías, configurador DVH, formulario…).
- `src/styles/` — estilos del sitio.
- `public/` — fotos, logos y tipografías.

Las direcciones viejas con `.html` (y `/blindex`) redirigen solas a las nuevas (`next.config.ts`).

Para publicar: subir a `main`; Vercel compila y publica solo.
