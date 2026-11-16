# Aluva · Pendientes de configuración (web, medición y CRM)

Actualizado: 16/11/2026 · rama `medicion-crm`

## A · Código (agencia) — ✅ listo
- Pixel de Meta en toda la web (PageView también al navegar sin recargar; Contact en cada botón de WhatsApp).
- Captura de origen del anuncio (utm_* y fbclid, último clic, 90 días) + cookie `_fbc`.
- Formulario: teléfono obligatorio, normalizado a formato argentino (549 + área + número); abre WhatsApp en el mismo clic.
- `public/lead.php`: crea la consulta en Kommo (contacto, campos, etiquetas, nota), manda Lead a Meta por API de Conversiones con el mismo event_id del pixel, respaldo por mail y CSV si Kommo falla. Límite de envíos por IP y control de origen.
- `scripts/kommo-setup.mjs`: crea embudo "Consultas web", campos y motivos de descarte.
- Build estático (`out/`) + `.htaccess` (redirecciones viejas, https, sin .html, caché, bloqueo de config).
- Prueba punta a punta hecha con Kommo y Meta simulados (16/11): todo OK, incluido el caso Kommo caído.

## B · Accesos y compras (agencia / cliente)
- [ ] Meta: crear pixel/dataset "Aluva Web" en el Business de Aluva → pasar el ID.
- [ ] Meta: generar token de API de Conversiones del dataset.
- [ ] Kommo: pagar plan Avanzado (USD 30/mes, 1 usuario, a nombre de Aluva) y reconectar WhatsApp.
- [ ] Kommo: crear integración privada → token de larga duración.
- [ ] Hosting: confirmar Zeta Hosting o DonWeb; acceso a cPanel/FTP. Verificar PHP ≥ 7.4 con curl y mbstring.
- [ ] Cloudflare: acceso a la cuenta (hoy da error 1033: el túnel apunta a algo que ya no existe).

## C · Semana del 23/11 — puesta en marcha
1. Correos `ventas@aluva.com.ar` y `tandil@aluva.com.ar` en el hosting (+ `web@` como remitente del respaldo).
2. Cloudflare: borrar el túnel/registro roto, apuntar `aluva.com.ar` y `www` al hosting, SSL "Full".
3. `KOMMO_SUBDOMINIO=… KOMMO_TOKEN=… node scripts/kommo-setup.mjs` → copiar los ids que imprime.
4. Subir `aluva-config.php` (modelo: `public/lead-config.example.php`) UNA carpeta arriba de `public_html`.
5. `NEXT_PUBLIC_META_PIXEL_ID=<id> npm run build` → subir el contenido de `out/` a `public_html`.
6. Prueba real: con `META_TEST_CODE` cargado, entrar con `?utm_source=meta&utm_campaign=prueba`, enviar el formulario y verificar: WhatsApp abre, lead en Kommo con campos, evento en "Probar eventos" de Meta (1 solo Lead, deduplicado). Después vaciar `META_TEST_CODE`.
7. Kommo: activar control de duplicados por teléfono (la misma persona entra por el formulario y por el chat de WhatsApp).

## D · Semana del 7/12 — campaña
- Editar la campaña de WhatsApp directo: conectar el dataset y empezar a acumular eventos.
- Agregar UTMs a los anuncios: `utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`.
- Mínimo $300.000 en diciembre; escalar en enero según el plan trimestral.
