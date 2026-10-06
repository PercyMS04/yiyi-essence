/* ==========================================================================
   YIYI ESSENCE · PEDIDOS POR WHATSAPP
   --------------------------------------------------------------------------
   Genera el mensaje del pedido y el enlace https://wa.me/<número>?text=...
   (funciona en celulares y computadoras). El número se configura SOLO en
   js/config.js → contact.whatsappNumber.
   No se envía nada a ningún servidor: el cliente envía el mensaje desde su
   propia aplicación de WhatsApp.
   ========================================================================== */
(function () {
  "use strict";
  var U = window.YIYI.U;
  var CFG = window.YIYI_CONFIG;

  function number() {
    return String((CFG.contact && CFG.contact.whatsappNumber) || "").replace(/\D/g, "");
  }

  function isConfigured() {
    return number().length >= 8;
  }

  function link(text) {
    var n = number();
    if (!n) return null;
    return "https://wa.me/" + n + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* Enlace simple (botón flotante, contacto, footer) */
  function generalLink(text) {
    return link(text || CFG.contact.whatsappGreeting);
  }

  /* Consulta por un producto concreto */
  function productLink(p) {
    var msg =
      "Hola, " + CFG.store.name + ". Quisiera consultar por este producto:\n\n" +
      "- " + p.name + " (" + p.brand + ")" + (p.size ? " · " + p.size : "") + "\n" +
      "Precio: " + U.money(p.price) + "\n\n" +
      "¿Me confirman disponibilidad, por favor?";
    return link(msg);
  }

  /* Mensaje estructurado del pedido */
  function orderMessage(lines, customer) {
    var Cart = window.YIYI.Cart;
    var sub = Cart.subtotal();
    var ship = Cart.shipping();
    var out = [];
    out.push("Hola, " + CFG.store.name + ". Quiero realizar el siguiente pedido:");
    out.push("");
    out.push("Productos:");
    lines.forEach(function (l) {
      out.push("- " + l.product.name + " (" + l.product.brand + ") x " + l.qty + " = " + U.money(l.total));
    });
    out.push("");
    out.push("Subtotal: " + U.money(sub));
    out.push("Envío: " + (ship.free ? "Gratis" : "por confirmar"));
    out.push("Total: " + U.money(Cart.total()) + (ship.free ? "" : " (+ envío por confirmar)"));
    out.push("");
    out.push("Datos para coordinar:");
    out.push("Nombre: " + customer.name);
    out.push("Teléfono/WhatsApp: " + customer.phone);
    out.push("Distrito o zona de entrega: " + customer.district);
    if (customer.reference) out.push("Referencia de entrega: " + customer.reference);
    if (customer.notes) out.push("Comentarios: " + customer.notes);
    out.push("");
    out.push("Quisiera información sobre disponibilidad, método de pago y entrega.");
    return out.join("\n");
  }

  function orderLink(lines, customer) {
    return link(orderMessage(lines, customer));
  }

  /* Valida los datos mínimos del cliente. Devuelve { ok, errors, clean } */
  function validate(raw) {
    var errors = {};
    var clean = {
      name: (raw.name || "").trim().replace(/\s+/g, " "),
      phone: (raw.phone || "").trim(),
      district: (raw.district || "").trim(),
      reference: (raw.reference || "").trim(),
      notes: (raw.notes || "").trim(),
    };
    if (clean.name.length < 2) errors.name = "Escribe tu nombre.";
    var digits = clean.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15 || !/^[+\d\s()\-]+$/.test(clean.phone)) {
      errors.phone = "Escribe un número válido (solo dígitos, entre 7 y 15).";
    }
    if (clean.district.length < 2) errors.district = "Indica tu distrito o zona de entrega.";
    if (clean.notes.length > 400) errors.notes = "Máximo 400 caracteres.";
    if (clean.reference.length > 200) errors.reference = "Máximo 200 caracteres.";
    return { ok: Object.keys(errors).length === 0, errors: errors, clean: clean };
  }

  /* Abre WhatsApp. Se llama desde un clic del usuario para evitar bloqueos de ventanas. */
  function open(url) {
    var w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url; // bloqueador de ventanas: abre en la misma pestaña
  }

  window.YIYI.WhatsApp = {
    number: number, isConfigured: isConfigured, link: link, generalLink: generalLink,
    productLink: productLink, orderMessage: orderMessage, orderLink: orderLink,
    validate: validate, open: open,
  };
})();
