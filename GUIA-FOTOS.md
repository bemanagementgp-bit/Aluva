# Guía de fotos — Aluva

Las cuatro fotos actuales (`casa1.png` … `casa4.png`) son la **misma casa de montaña
norteamericana** y la carpintería que se ve es **de madera**. Aluva vende PVC y aluminio:
la foto contradice el producto. Además esa casa se repite unas veinte veces entre hero,
productos y trabajos. Es el punto más débil del sitio.

---

## Qué descartar siempre

- **Carpintería de madera.** Es el error de las fotos actuales.
- **Casas de montaña, cabañas, madera vista, nieve, bosque de coníferas.** Nada de eso
  existe en La Plata, CABA o Zona Sur, y el cliente lo nota.
- **Renders 3D.** Se distinguen enseguida y restan credibilidad más de lo que suman.
- **Interiores de revista sin abertura clara.** Si la ventana no es la protagonista, no sirve.
- **Marcas de agua**, aunque sea la versión de preview.

## Qué buscar

| Necesidad | Cuántas | Qué tiene que mostrarse |
|---|---|---|
| Hero | 4 | Fachada completa, horizontal, con la abertura legible. Espacio "tranquilo" abajo a la izquierda para el titular. |
| PVC | 3 | Perfil blanco o símil madera, hoja corrediza o practicable, DVH con el canto del doble vidrio visible. |
| Aluminio | 3 | Perfil fino oscuro o anodizado, paños grandes, cerramiento de galería. |
| Vidriería | 3 | Mampara de baño, baranda de vidrio, DVH en detalle. |
| Revestimientos | 3 | Encuentro de marco y muro, premarco, mosquitero, cortina de enrollar. |
| Trabajos | 4 | Obra terminada, mezcla de plano general y detalle. |

**Formato:** horizontal (3:2 o 16:9), mínimo **1600 px** de ancho, JPG optimizado. En el
sitio se recortan a `object-fit: cover`, así que lo importante tiene que estar cerca del
centro. Todas llevan un epígrafe sobre degradado en el borde inferior: dejá esa franja
sin detalle importante.

## Dónde buscarlas (uso comercial gratuito)

| Sitio | Licencia | Nota |
|---|---|---|
| [Unsplash](https://unsplash.com) | Unsplash License — uso comercial, sin atribución | El de mejor calidad para arquitectura |
| [Pexels](https://pexels.com) | Pexels License — uso comercial, sin atribución | Buen fondo de interiores |
| [Pixabay](https://pixabay.com) | Content License — uso comercial, sin atribución | Más irregular, revisar caso por caso |

Verificá la licencia en la página de cada foto antes de bajarla: los tres sitios permiten
uso comercial, pero mezclan resultados patrocinados de bancos pagos (iStock, Shutterstock)
que **no** están cubiertos.

### Búsquedas concretas (en inglés, que es donde está el material)

Fachadas y aberturas:
- `modern brick house facade windows`
- `aluminium window facade contemporary house`
- `black frame windows modern house exterior`
- `sliding glass door patio modern`

Detalle de producto:
- `upvc window frame detail`
- `double glazing window detail`
- `window handle hardware detail`
- `aluminium window profile close up`

Vidriería:
- `glass shower enclosure bathroom`
- `glass balustrade railing`

Obra y taller (buenas para dar credibilidad de fabricación):
- `window installation construction`
- `pvc window factory workshop`

En español rinde poco, pero probá `ventana PVC`, `ventanal aluminio`, `mampara vidrio`.

## Cómo reemplazarlas

1. Dejá los archivos en `public/photos/` con nombres descriptivos
   (`pvc-corrediza-01.jpg`, `aluminio-galeria-02.jpg`, …), no `casa1.png`.
2. Abrí **`src/content/catalogo.js`** — es el único archivo a tocar. Ahí están las tres
   listas: `HERO`, `TRABAJOS` y `PRODUCTOS`. Cambiá `src` y `caption`.
3. Los epígrafes son texto visible: que digan qué producto es, no una descripción vaga.

El sitio ya les aplica un tratamiento uniforme (`.photo-tone`: leve desaturación y algo
más de contraste) justamente para que fotos de distintas fuentes convivan sin saltos de
color. No hace falta que las edites vos.

## Lo que de verdad conviene

Fotos propias de obras terminadas, aunque estén sacadas con el celular, **le ganan a
cualquier stock**: el cliente reconoce las casas del barrio y ve que el trabajo existe.
El stock es un puente hasta tener las propias, no el destino. Si podés, sacá tres o
cuatro por obra: plano general de la fachada, la abertura completa, y un detalle del
herraje o del encuentro con el muro.
