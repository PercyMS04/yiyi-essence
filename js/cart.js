/* ==========================================================================
   YIYI ESSENCE · CARRITO
   --------------------------------------------------------------------------
   Guarda solo { id, qty } en el almacenamiento local del navegador (es una
   función técnica necesaria para que el carrito no se pierda al navegar).
   No se guardan datos personales ni de pago.
   Cada cambio emite el evento "cart:change" en document.
   ========================================================================== */
(function () {
  "use strict";
  var U = window.YIYI.U;
  var CFG = window.YIYI_CONFIG;
  var KEY = "yiyi.cart.v1";
  var MAX = (CFG.order && CFG.order.maxQtyPerProduct) || 10;

  var items = load();

  function load() {
    var saved = U.storage.get(KEY, []);
    if (!Array.isArray(saved)) return [];
    var clean = [];
    saved.forEach(function (row) {
      var p = row && U.findProduct(row.id);
      if (!p || p.stock <= 0) return; // producto retirado o agotado
      var qty = Math.max(1, Math.min(parseInt(row.qty, 10) || 1, limitFor(p)));
      clean.push({ id: p.id, qty: qty });
    });
    return clean;
  }

  function limitFor(p) {
    return Math.max(0, Math.min(MAX, p.stock));
  }

  function save() {
    U.storage.set(KEY, items);
    document.dispatchEvent(new CustomEvent("cart:change", { detail: { count: count() } }));
  }

  function find(id) {
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
    return null;
  }

  /* Devuelve { ok, reason, qty } para que la interfaz informe al usuario */
  function add(id, qty) {
    var p = U.findProduct(id);
    if (!p) return { ok: false, reason: "notfound" };
    if (p.stock <= 0) return { ok: false, reason: "soldout" };
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var row = find(id);
    var max = limitFor(p);
    var wanted = (row ? row.qty : 0) + qty;
    var final = Math.min(wanted, max);
    if (row) row.qty = final; else items.push({ id: id, qty: final });
    save();
    return { ok: true, qty: final, capped: wanted > max, max: max };
  }

  function setQty(id, qty) {
    var p = U.findProduct(id);
    var row = find(id);
    if (!p || !row) return;
    qty = parseInt(qty, 10) || 1;
    if (qty <= 0) return remove(id);
    row.qty = Math.min(qty, limitFor(p));
    save();
  }

  function remove(id) {
    items = items.filter(function (r) { return r.id !== id; });
    save();
  }

  function clear() {
    items = [];
    save();
  }

  function count() {
    return items.reduce(function (n, r) { return n + r.qty; }, 0);
  }

  /* Líneas con datos del producto y total por línea */
  function lines() {
    return items
      .map(function (r) {
        var p = U.findProduct(r.id);
        return p ? { product: p, qty: r.qty, total: round2(p.price * r.qty), max: limitFor(p) } : null;
      })
      .filter(Boolean);
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  function subtotal() {
    return round2(lines().reduce(function (s, l) { return s + l.total; }, 0));
  }

  /* Ahorro frente al precio anterior (solo informativo) */
  function savings() {
    return round2(
      lines().reduce(function (s, l) {
        var old = l.product.oldPrice;
        return s + (old && old > l.product.price ? (old - l.product.price) * l.qty : 0);
      }, 0)
    );
  }

  /* El envío NO se inventa: es gratis solo si hay umbral configurado, si no se coordina */
  function shipping() {
    var from = CFG.shipping && CFG.shipping.freeShippingFrom;
    var sub = subtotal();
    if (from && sub >= from) return { label: "Gratis", free: true, missing: 0 };
    return { label: "A coordinar por WhatsApp", free: false, missing: from ? round2(from - sub) : null };
  }

  /* Total de productos. El envío se confirma por WhatsApp (salvo envío gratis) */
  function total() { return subtotal(); }

  window.YIYI.Cart = {
    add: add, setQty: setQty, remove: remove, clear: clear, count: count,
    lines: lines, subtotal: subtotal, total: total, savings: savings, shipping: shipping,
    max: MAX,
  };

  /* Sincroniza entre pestañas abiertas */
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) {
      items = load();
      document.dispatchEvent(new CustomEvent("cart:change", { detail: { count: count() } }));
    }
  });
})();
