# Publicar el sitio en el hosting de aluva.com.ar

El sitio público de aluva.com.ar se sirve desde `public_html` del hosting (Apache).
El acceso y la app están en **app.aluva.com.ar**, en otra carpeta del servidor, con su
propia API: nada de `public_html` les afecta y no hay que tocarlos.

## 1. Generar el paquete

```powershell
npm run hosting
```

Deja `aluva-hosting.zip` en la raíz del proyecto (unos 25 MB) con el sitio exportado
como HTML estático más el `.htaccess` de `hosting/`. Para mirarlo antes de subir:

```powershell
npm run hosting:ver
```

y abrir http://localhost:8123 (imita las reglas del `.htaccess`).

## 2. Ordenar `public_html` (una sola vez, la primera publicación)

En el administrador de archivos, activar **mostrar archivos ocultos** (para ver `.htaccess`).

**Eliminar** (restos vacíos, de 0 bytes, de un intento de intrusión):

- `as.php`
- `l.php`
- `imagen`

**Mover a una carpeta nueva `_viejo`** (copia de seguridad; el `.htaccess` nuevo impide que se sirva):

- `index.php` — la landing anterior
- `.htaccess` — las reglas anteriores (si está)
- `index.html.old`
- `CSS`, `g`, `imágenes`, `js`, `Tarjeta web`, `paquetes` — el sitio de 2024
- `foto`, `fba25870`, `Aviso legal`, `privacidad`, `subpágina` — el sitio de 2025

Al final `public_html` queda solo con `_viejo/` (y `cgi-bin` si existiera).
Pasadas unas semanas sin problemas, `_viejo/` se puede borrar.

## 3. Subir

1. Cargar `aluva-hosting.zip` a `public_html`.
2. Extraerlo ahí mismo (los archivos quedan en la raíz: `index.html`, `.htaccess`, `_next/`, `photos/`…).
3. Borrar el `.zip` del servidor.

## 4. Después de subir

- En Cloudflare: **Caching → Purge everything** (el dominio pasa por Cloudflare y
  guarda la landing vieja en caché).
- Probar: https://aluva.com.ar/ , /pvc , /productos , /contacto , /pvc.html (debe
  redirigir a /pvc), /login (debe ir a app.aluva.com.ar) y https://app.aluva.com.ar/ .
- Si después de purgar sigue viéndose la landing vieja, el dominio no está apuntando a
  este hosting (Cloudflare lo manda a otro origen): revisar el registro DNS de
  `aluva.com.ar` en Cloudflare.

## Actualizaciones siguientes

Repetir `npm run hosting`, subir el zip y extraerlo encima (pisa `index.html`, las
páginas y `_next/`). Los archivos de `_next/static/` llevan hash, así que los de
versiones anteriores que queden no molestan; cada tanto se puede borrar `_next/` antes
de extraer. Purgar la caché de Cloudflare después de cada subida.
