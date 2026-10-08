/* ==========================================================================
   YIYI ESSENCE · CONFIGURACIÓN CENTRAL
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para cambiar los datos de la
   tienda: nombre, WhatsApp, correo, redes, envíos, pagos e información legal.
   Los productos están en js/products.js.

   Todo lo que dejes vacío ("" o null) se mostrará como "por definir" o se
   ocultará. Así no se publica información inventada.
   ========================================================================== */

window.YIYI_CONFIG = {
  /* ---------- Identidad ---------- */
  store: {
    name: "Yiyi Essence",
    tagline: "Belleza, cuidado y esencia en un solo lugar.",
    description:
      "Tienda online de maquillaje, skincare, cuidado corporal, cabello y fragancias. Haz tu pedido y confírmalo por WhatsApp.",
    // Cuando publiques en GitHub Pages, escribe aquí la URL final SIN barra al final.
    // Ejemplo: "https://tuusuario.github.io/yiyi-essence". Se usa para SEO / Open Graph.
    siteUrl: "",
    currency: "S/",
    country: "Perú",
  },


  /* ---------- Contacto ---------- */
  contact: {
    // Número con código de país, solo dígitos. Perú = 51. Ejemplo: "51987654321".
    // Mientras esté vacío, la tienda funciona en MODO DEMOSTRACIÓN y no abre WhatsApp.
    whatsappNumber: "51910440735",
    // Mensaje por defecto al consultar sin carrito (botón flotante, contacto).
    whatsappGreeting: "Hola, Yiyi Essence. Quisiera más información sobre sus productos.",
    // Correo oficial (también se usa para derechos ARCO). Déjalo vacío si aún no existe.
    email: "",
    // Horario de atención. Ejemplo: "Lunes a sábado, 9:00 a 19:00". Vacío = "por definir".
    schedule: "",
    // Dirección o punto de atención (opcional). Vacío = no se muestra.
    address: "",
  },

  /* ---------- Redes sociales ----------
     Solo se muestran las que tengan URL real. Ejemplo:
     instagram: "https://www.instagram.com/tu_cuenta"                           */
  social: {
    instagram: "https://www.instagram.com/yad_tf_",
    facebook: "https://web.facebook.com/",
    tiktok: "https://www.tiktok.com",
  },

  /* ---------- Datos legales del negocio ----------
     Completa con los datos reales. Se insertan automáticamente en los textos
     legales (privacidad, términos, información legal).                        */
  legal: {
    businessName: "", // Razón social o nombre del titular. Ej.: "Yiyi Essence E.I.R.L."
    ruc: "", // RUC (si corresponde)
    fiscalAddress: "", // Domicilio / dirección de contacto
    lastUpdated: "05 de octubre de 2026", // Fecha de última actualización de los textos legales
    dataRetention: "", // Ej.: "24 meses". Vacío = "por definir"
    claimsBookUrl: "", // Enlace al Libro de Reclamaciones virtual, si lo tienes
  },

  /* ---------- Pagos (se coordinan por WhatsApp) ----------
     Activa SOLO los métodos que realmente uses. enabled:false = no se muestra. */
  payments: [
    { id: "yape", label: "Yape", enabled: true, note: "Se te enviará el número al confirmar tu pedido." },
    { id: "plin", label: "Plin", enabled: true, note: "Se te enviará el número al confirmar tu pedido." },
    { id: "transferencia", label: "Transferencia bancaria", enabled: true, note: "Los datos de la cuenta se envían por WhatsApp." },
    { id: "contraentrega", label: "Pago contra entrega", enabled: true, note: "Disponible solo en zonas indicadas por la tienda." },
  ],

  /* ---------- Entregas ----------
     Todo configurable. null / "" = "por definir" (nunca se inventa).          */
  shipping: {
    prepTime: "12 a 24 horas hábiles", // Ej.: "24 a 48 horas hábiles"
    deliveryTime: "1 a 3 días hábiles según el distrito", // Ej.: "1 a 3 días hábiles según el distrito"
    freeShippingFrom: 199, // Ej.: 199 → envío gratis desde S/ 199. null = no hay.
    pickup: true, // true si ofreces recojo en punto de entrega
    // Zonas de cobertura. cost: número (S/) o null = "se confirma por WhatsApp".
    zones: [
      // { name: "Lima Metropolitana", cost: 10 },
      // { name: "Provincias (agencia)", cost: null },
    ],
    notAvailableNote:
      "Si no te encuentras en el lugar de entrega, el repartidor intentará comunicarse contigo por WhatsApp o teléfono para coordinar una nueva entrega.",
  },

  /* ---------- Cambios y devoluciones ----------
     reportWindowDays: días (calendario) que tiene el cliente para reportar un
     producto defectuoso, incorrecto, dañado o faltante desde que lo recibe.
     null = "por definir" (no se inventa un plazo). Revísalo con tu asesor legal. */
  returns: {
    reportWindowDays: null,
  },

  /* ---------- Promociones y banners ----------
     autoplayMs: cada cuántos milisegundos cambian los banners y la franja
     superior (4000 = 4 segundos).
     topbarMessages: frases de la franja superior. Si lo dejas vacío [], se
     generan solas con los datos de arriba (envío gratis, recojo, pagos).
     Cada frase: { text: "...", href: "enlace opcional" }.
     No escribas descuentos ni plazos que no sean reales.                      */
  promo: {
    autoplayMs: 4000,
    topbarMessages: [],
  },

  /* ---------- Carrito / pedidos ---------- */
  order: {
    maxQtyPerProduct: 10,
    // Muestra el aviso de privacidad en el formulario de pedido.
    askDeliveryReference: true,
  },

  /* ---------- Cookies ----------
     La tienda NO usa analítica ni publicidad. Mientras estén en false, el panel
     de cookies solo informa de forma discreta. Si algún día agregas Google
     Analytics, Meta Pixel, etc., cambia a true y engancha el script en
     js/cookies.js (función onConsentChange).                                  */
  cookies: {
    analyticsEnabled: false,
    advertisingEnabled: false,
  },

  /* ---------- Colores de marca (se aplican como variables CSS) ----------- */
  theme: {
    "--rose": "#c9808f",
    "--rose-deep": "#a85f70",
    "--blush": "#f7e6e8",
    "--cream": "#fbf6f1",
    "--lavender": "#e8e0f0",
    "--champagne": "#e9d8bd",
    "--ink": "#3a2e33",
  },
};
