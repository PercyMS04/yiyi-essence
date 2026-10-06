/* ==========================================================================
   YIYI ESSENCE · UTILIDADES
   Funciones pequeñas compartidas por el resto de scripts.
   ========================================================================== */
(function () {
  "use strict";
  var CFG = window.YIYI_CONFIG;

  /* Prefijo de ruta: "" en la raíz y "../" dentro de /pages (se define en <html data-base>) */
  var base = document.documentElement.getAttribute("data-base") || "";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function money(n) {
    return CFG.store.currency + " " + Number(n || 0).toFixed(2);
  }

  /* Minúsculas y sin tildes: "Máscara" → "mascara" (búsqueda tolerante) */
  function norm(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim();
  }

  /* localStorage con protección (modo privado, bloqueo de cookies, etc.) */
  var storage = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: function (key) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {}
    },
  };

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function discountPct(p) {
    if (p && p.oldPrice && p.oldPrice > p.price) {
      return Math.round((1 - p.price / p.oldPrice) * 100);
    }
    return 0;
  }

  function getPath(obj, path) {
    return String(path).split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }

  function findProduct(id) {
    var list = window.YIYI_PRODUCTS || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function categoryName(id) {
    var list = window.YIYI_CATEGORIES || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i].name;
    return id;
  }

  function isOffer(p) { return discountPct(p) > 0; }

  window.YIYI = window.YIYI || {};
  window.YIYI.U = {
    base: base,
    url: function (path) { return base + path; },
    esc: esc,
    money: money,
    norm: norm,
    storage: storage,
    debounce: debounce,
    discountPct: discountPct,
    getPath: getPath,
    findProduct: findProduct,
    categoryName: categoryName,
    isOffer: isOffer,
  };
})();
