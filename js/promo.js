/* ==========================================================================
   YIYI ESSENCE · PROMOCIONES, BARRA FIJA MÓVIL Y EFECTOS
   --------------------------------------------------------------------------
   1) Franja superior que rota frases comerciales cada 4 s (config.promo).
   2) Franja de servicios del inicio (recojo y formas de pago, desde config).
   3) Barra de acción fija en el celular: WhatsApp / Bolsa, y en la página de
      producto "Agregar a la bolsa" + WhatsApp, siempre al alcance del pulgar.
   4) Aparición suave de las secciones al hacer scroll.
   Todo se alimenta de js/config.js: no hay datos escritos "a mano" aquí.
   ========================================================================== */
(function () {
  "use strict";
  var Y = window.YIYI, U = Y.U, CFG = window.YIYI_CONFIG, WA = Y.WhatsApp, Cart = Y.Cart;
  var esc = U.esc;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DELAY = Math.max(2500, Number(CFG.promo && CFG.promo.autoplayMs) || 4000);

  function icon(name, size) { return Y.UI.icon(name, size || 16); }
  function moneyShort(n) { return U.money(n).replace(/\.00$/, ""); }

  /* ------------------------------------------------ 1) Franja superior */
  function topbarMessages() {
    var custom = (CFG.promo && CFG.promo.topbarMessages) || [];
    if (custom.length) {
      return custom.map(function (m) {
        var inner = esc(m.text);
        return { icon: m.icon || "sparkle", html: m.href ? '<a href="' + esc(m.href) + '">' + inner + "</a>" : inner };
      });
    }
    var list = [], sh = CFG.shipping || {};
    var from = Number(sh.freeShippingFrom);
    if (from > 0) {
      list.push({ icon: "truck", html: "<strong>Envío gratis</strong> por compras desde " + esc(moneyShort(from)) + '. <a href="' + U.url("pages/envios.html") + '">Aplican T&amp;C</a>' });
    }
    if (sh.pickup) {
      list.push({ icon: "gift", html: "<strong>¡Recojo en punto de entrega disponible!</strong> Coordínalo por WhatsApp" });
    }
    var pays = (CFG.payments || []).filter(function (p) { return p.enabled; }).slice(0, 3).map(function (p) { return p.label; });
    if (pays.length) list.push({ icon: "shield", html: "<strong>Paga fácil:</strong> " + esc(pays.join(", ")) + " y más" });
    var hasOffers = (window.YIYI_PRODUCTS || []).some(function (p) { return p.stock > 0 && U.isOffer && U.isOffer(p); });
    if (hasOffers) list.push({ icon: "tag", html: '<strong>Ofertas</strong> en productos seleccionados · <a href="' + Y.UI.catUrl("ofertas") + '">Ver ofertas</a>' });
    list.push({ icon: "whatsapp", html: "<strong>Pide por WhatsApp</strong> con atención directa y personalizada" });
    return list;
  }

  function initTopbar() {
    var bar = document.querySelector("[data-topbar]");
    if (!bar) return;
    var track = bar.querySelector(".topbar__track");
    var msgs = topbarMessages();
    if (!msgs.length) return;
    track.innerHTML = msgs.map(function (m, i) {
      return '<p class="topbar__item' + (i === 0 ? " is-active" : "") + '"' + (i ? ' aria-hidden="true"' : "") + ">" + icon(m.icon, 16) + "<span>" + m.html + "</span></p>";
    }).join("");
    var items = track.querySelectorAll(".topbar__item");
    if (items.length < 2 || reduceMotion) return;

    var cur = 0, timer = null, paused = false;
    function show(n) {
      var prev = items[cur];
      cur = (n + items.length) % items.length;
      prev.classList.remove("is-active");
      prev.classList.add("is-leaving");
      prev.setAttribute("aria-hidden", "true");
      setTimeout(function () { prev.classList.remove("is-leaving"); }, 600);
      items[cur].classList.add("is-active");
      items[cur].removeAttribute("aria-hidden");
    }
    function start() { stop(); timer = setInterval(function () { if (!paused && !document.hidden) show(cur + 1); }, DELAY); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    bar.addEventListener("mouseenter", function () { paused = true; });
    bar.addEventListener("mouseleave", function () { paused = false; });
    bar.addEventListener("focusin", function () { paused = true; });
    bar.addEventListener("focusout", function () { paused = false; });
    start();
  }

  /* ------------------------------------------ 2) Franja de servicios (inicio) */
  function initPromoStrip() {
    var box = document.querySelector("[data-promo-strip]");
    if (!box) return;
    var parts = [];
    if (CFG.shipping && CFG.shipping.pickup) {
      parts.push('<div class="promostrip__item">' + icon("gift", 26) + '<p><strong>¡Recojo en punto de entrega!</strong><span>Ya disponible · coordínalo por WhatsApp</span></p></div>');
    }
    var pays = (CFG.payments || []).filter(function (p) { return p.enabled; }).map(function (p) { return p.label; });
    if (pays.length) {
      parts.push('<div class="promostrip__item">' + icon("shield", 26) + "<p><strong>Paga como prefieras</strong><span>" + esc(pays.join(" · ")) + "</span></p></div>");
    }
    if (!parts.length) { box.hidden = true; return; }
    box.innerHTML = parts.join("");
  }

  /* ------------------------------------------- 3) Barra fija en el celular */
  function initStickyBar() {
    if (document.querySelector(".stickybar")) return;
    var waGeneral = WA.generalLink() || U.url("contacto.html");
    var bar = document.createElement("div");
    bar.className = "stickybar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Acciones rápidas de compra");

    var pdpAdd = document.querySelector("[data-pdp-add]");
    var pdpWa = document.querySelector(".pdp__info [data-wa-product]");
    var pdpPrice = document.querySelector(".pdp__price strong");

    if (pdpAdd) {
      /* Página de producto: precio · Agregar a la bolsa · WhatsApp */
      var out = pdpAdd.disabled;
      bar.classList.add("stickybar--pdp");
      bar.innerHTML =
        (pdpPrice ? '<p class="stickybar__price"><small>Precio</small><strong>' + esc(pdpPrice.textContent) + "</strong></p>" : "") +
        '<button type="button" class="btn btn--primary stickybar__main" data-sticky-add' + (out ? " disabled" : "") + ">" +
          icon("bag", 20) + "<span>" + (out ? "Agotado" : "Agregar a la bolsa") + "</span></button>" +
        '<a class="btn btn--wa stickybar__wa" href="' + esc(pdpWa ? pdpWa.getAttribute("href") : waGeneral) + '" target="_blank" rel="noopener" ' +
          (pdpWa ? 'data-wa-product="' + esc(pdpWa.getAttribute("data-wa-product")) + '"' : "data-wa-general") +
          ' aria-label="Consultar por WhatsApp">' + icon("whatsapp", 22) + "<span>WhatsApp</span></a>";
      bar.querySelector("[data-sticky-add]").addEventListener("click", function () { pdpAdd.click(); });
    } else {
      /* Resto del sitio: Comprar por WhatsApp · Bolsa */
      bar.innerHTML =
        '<a class="btn btn--wa stickybar__main" data-sticky-wa href="' + esc(waGeneral) + '" target="_blank" rel="noopener" data-wa-general>' +
          icon("whatsapp", 22) + "<span>Comprar por WhatsApp</span></a>" +
        '<button type="button" class="btn btn--wa stickybar__main" data-sticky-checkout data-checkout hidden>' +
          icon("whatsapp", 22) + '<span>Pedir por WhatsApp · <b data-sticky-total></b></span></button>' +
        '<button type="button" class="btn btn--ghost stickybar__bag" data-open-cart aria-label="Abrir mi bolsa">' +
          icon("bag", 22) + '<span>Bolsa</span><i class="stickybar__count" data-sticky-count hidden>0</i></button>';
    }
    document.body.appendChild(bar);
    document.body.classList.add("has-stickybar");

    var wa = bar.querySelector("[data-sticky-wa]"), co = bar.querySelector("[data-sticky-checkout]");
    var cnt = bar.querySelector("[data-sticky-count]"), tot = bar.querySelector("[data-sticky-total]");
    var bag = bar.querySelector(".stickybar__bag");
    var lastCount = Cart.count();
    function sync() {
      var n = Cart.count();
      if (wa && co) { wa.hidden = n > 0; co.hidden = n === 0; }
      if (tot) tot.textContent = U.money(Cart.total());
      if (cnt) { cnt.textContent = n > 99 ? "99+" : n; cnt.hidden = n === 0; }
      if (bag && n > lastCount) { bag.classList.remove("bump"); void bag.offsetWidth; bag.classList.add("bump"); }
      lastCount = n;
    }
    sync();
    document.addEventListener("cart:change", sync);

    /* Se esconde mientras el teclado está abierto (no tapa los campos) */
    document.addEventListener("focusin", function (e) {
      if (e.target.matches && e.target.matches("input:not([type=checkbox]):not([type=radio]), textarea, select")) bar.classList.add("is-hidden");
    });
    document.addEventListener("focusout", function () { bar.classList.remove("is-hidden"); });
  }

  /* ------------------------------------------ 4) Aparición al hacer scroll */
  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var sel = ".section__head, .catgrid, .grid, .steps, .ctaband, .brandchips, .promostrip, .carousel--cards, .values, .aboutgrid";
    var els = Array.prototype.slice.call(document.querySelectorAll(sel));
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) return; // ya visible: no se anima
      el.classList.add("reveal");
      io.observe(el);
    });
    /* Red de seguridad: si algo no se mostró, se muestra todo */
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 2500);
  }

  function init() {
    initTopbar();
    initPromoStrip();
    initStickyBar();
    initReveal();
  }

  Y.Promo = { init: init, delay: DELAY };
})();
