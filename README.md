# Yiyi Essence · Tienda online

Tienda de belleza y cosmética hecha con **HTML, CSS y JavaScript puro** (sin servidor ni base de datos). El cliente arma su bolsa y **el pedido se cierra siempre por WhatsApp**. No hay pagos con tarjeta ni pasarelas de pago.

> ⚠️ **Antes de publicar:** los productos, marcas y precios de `js/products.js` son **ejemplos**. Los textos legales (`pages/`) son una **base informativa** y deben ser revisados por un profesional legal.

---

## 1. Ejecutar en local (Visual Studio Code)

**Opción A (la más fácil):** instala la extensión **Live Server**, abre la carpeta del proyecto, clic derecho en `index.html` → *Open with Live Server*.

**Opción B (terminal):**

```bash
python -m http.server 8000     # luego abre http://localhost:8000
# o, con Node:  npx serve .
```

> Abrir `index.html` con doble clic también funciona para ver la tienda, pero se recomienda un servidor local.

---

## 2. Estructura

```
index.html · productos.html · producto.html · nosotros.html · contacto.html · 404.html
pages/   faq · envios · pagos · cambios · privacidad · terminos · cookies · informacion-legal
css/     style.css (base, mobile-first) · responsive.css (tablet y escritorio)
js/
  config.js      ← DATOS DE LA TIENDA (WhatsApp, correo, envíos, pagos, legal, colores)
  products.js    ← PRODUCTOS y CATEGORÍAS
  utils.js · whatsapp.js · cart.js · components.js · catalog.js · cookies.js · main.js
assets/  fonts · images · logo
tools/generate-sitemap.js   (opcional)
robots.txt · sitemap.xml · .nojekyll
```

---

## 3. Cambiar el número de WhatsApp

Abre `js/config.js` y edita **solo esta línea** (código de país + número, solo dígitos; Perú = `51`):

```js
whatsappNumber: "51987654321",
```

Mientras esté vacío, la tienda funciona en **modo demostración**: todo se ve y funciona, pero no abre WhatsApp y muestra un aviso.

## 4. Cambiar correo, horario, redes y datos legales

Todo en `js/config.js`:

| Sección | Qué contiene |
|---|---|
| `contact` | WhatsApp, correo (también para derechos ARCO), horario, dirección |
| `social` | Instagram, Facebook, TikTok. **Solo se muestran las que tengan URL real** |
| `legal` | Razón social, RUC, domicilio, plazo de conservación de datos, Libro de Reclamaciones |
| `payments` | Pon `enabled: true` **solo** en los métodos que realmente uses (Yape, Plin, transferencia, contra entrega) |
| `shipping` | Tiempos, envío gratis desde X, zonas y costos |
| `returns` | Plazo para reportar incidencias (`reportWindowDays`) |
| `theme` | Colores de marca |

Lo que dejes vacío aparece como **"[por definir]"** en las páginas: la tienda no inventa datos.

## 5. Modificar productos, precios y stock

En `js/products.js`, cada producto es un bloque:

```js
{
  id: "labial-mate-malva",         // único, sin espacios ni tildes
  name: "Labial Mate Malva",
  brand: "Velvet Muse",
  category: "maquillaje",          // id de una categoría
  price: 26.9,                     // precio actual (S/)
  oldPrice: 32.9,                  // opcional: si es mayor que price → descuento y aparece en Ofertas
  stock: 12,                       // 0 = Agotado
  featured: true,                  // aparece en Destacados
  added: "2026-08-20",             // para ordenar por Novedades
  size: "3.5 g",
  description: "Descripción breve, sin promesas médicas.",
  image: "assets/images/products/labial-mate-malva.svg"
}
```

- **Cambiar un precio:** edita `price` (y `oldPrice` si hay oferta).
- **Quitar una oferta:** borra `oldPrice`.
- **Agregar una categoría:** añade una línea en `YIYI_CATEGORIES` (`id`, `name`, `icon`, `blurb`).
- **Imágenes:** guarda tu foto (JPG/WebP, idealmente cuadrada, ≤ 150 KB) en `assets/images/products/` y pon su ruta en `image`.

No hace falta recompilar nada: guarda y recarga.

## 6. Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `yiyi-essence`) y sube todos los archivos:
   ```bash
   git init && git add . && git commit -m "Tienda Yiyi Essence"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/yiyi-essence.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`** → Save.
3. Tu tienda quedará en `https://TU-USUARIO.github.io/yiyi-essence/`.
4. **Completa la URL para SEO:** en `js/config.js` pon `siteUrl: "https://TU-USUARIO.github.io/yiyi-essence"` y ejecuta (requiere Node.js):
   ```bash
   node tools/generate-sitemap.js https://TU-USUARIO.github.io/yiyi-essence
   ```
   Esto actualiza `sitemap.xml` y `robots.txt` con la URL real e incluye todos tus productos. Vuelve a ejecutarlo cuando cambies el catálogo.

Todas las rutas son relativas, así que funciona igual en un dominio propio, en la raíz o en una subcarpeta.

---

## 7. Qué hace la tienda

- Catálogo con búsqueda real (ignora tildes y mayúsculas), filtros por categoría, marca, precio y disponibilidad, y orden por precio, novedades, destacados o descuento.
- Bolsa de compra: agregar, quitar, cambiar cantidades, vaciar, subtotal y total. Se conserva en el navegador.
- Formulario de pedido con datos mínimos (nombre, teléfono, distrito, referencia, comentarios) y aviso de uso de datos. **No se guarda nada**: todo va en el mensaje de WhatsApp.
- Cookies: solo se usa almacenamiento necesario (bolsa y preferencias). Panel pequeño y discreto con Aceptar / Rechazar / Configurar. **No hay analítica ni publicidad.**
- SEO: title, description, H1/H2/H3, Open Graph, favicon, datos estructurados (Store, WebSite, Product, FAQPage), sitemap y robots.
- Accesible: enlace para saltar al contenido, foco visible, etiquetas, navegación por teclado y diálogos con foco controlado.

## 8. Si algún día agregas analítica o publicidad

1. En `js/config.js` cambia `cookies.analyticsEnabled` / `advertisingEnabled` a `true`.
2. Carga el script **solo si hay consentimiento**, dentro de `onConsentChange` en `js/cookies.js`.
3. Actualiza `pages/cookies.html` y `pages/privacidad.html` con las herramientas reales.

## 9. Pendientes antes de operar comercialmente

- [ ] Reemplazar productos y fotos de ejemplo por los reales.
- [ ] Configurar WhatsApp, correo, horario y datos del titular (`js/config.js`).
- [ ] Activar solo los métodos de pago reales.
- [ ] Definir zonas, costos y tiempos de envío.
- [ ] Definir el plazo para reportar incidencias y el plazo de conservación de datos.
- [ ] Revisar con un abogado: privacidad (Ley N.º 29733 y Reglamento), términos, cambios y devoluciones, y obligaciones como inscripción de bancos de datos y Libro de Reclamaciones.
- [ ] Publicar la URL real y regenerar `sitemap.xml`.

## Seguridad

- No se piden ni almacenan tarjetas, CVV, contraseñas ni datos bancarios.
- No hay claves privadas ni tokens en el código. El número de WhatsApp es un dato público.
- Las fuentes están alojadas en `assets/fonts` (sin servicios externos de terceros).
