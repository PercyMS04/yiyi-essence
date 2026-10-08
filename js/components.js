/* ==========================================================================
   YIYI ESSENCE · COMPONENTES DE INTERFAZ
   --------------------------------------------------------------------------
   Header, menú móvil, buscador, bolsa (carrito), formulario de pedido,
   footer, botón de WhatsApp, avisos (toasts) y tarjeta de producto.
   Se inyectan desde aquí para que header y footer se editen en UN solo lugar.
   ========================================================================== */
(function () {
  "use strict";
  var Y = window.YIYI;
  var U = Y.U, CFG = window.YIYI_CONFIG, Cart = Y.Cart, WA = Y.WhatsApp;
  var esc = U.esc;

  /* ------------------------------------------------------------------ Iconos */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevL: '<path d="m15 5-7 7 7 7"/>',
    chevR: '<path d="m9 5 7 7-7 7"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M8 5l11 7-11 7V5Z"/>',
    whatsapp: '<path d="M4 20l1.4-4.2A8 8 0 1 1 8.4 18.8L4 20Z"/><path d="M9.2 8.6c-.2.9.4 2.3 1.6 3.5 1.2 1.2 2.6 1.8 3.5 1.6.5-.1.9-.5 1-.9l-1.5-1-.8.6c-.7-.3-1.4-.9-1.7-1.7l.6-.8-1-1.5c-.4.1-.8.4-.9.9Z"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/>',
    sparkle: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 10h8M8 13h5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    cookie: '<path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-5-5Z"/><circle cx="9" cy="11" r=".8"/><circle cx="13" cy="15" r=".8"/><circle cx="15" cy="11" r=".6"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    lips: '<path d="M3 12c3-4 6-4 9-2 3-2 6-2 9 2-3 5-6 6-9 6s-6-1-9-6Z"/><path d="M3 12h18"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 9-5 15-13 15"/><path d="M5 19c3-5 6-8 11-10"/>',
    petal: '<path d="M12 3c4 3 6 6 6 9a6 6 0 0 1-12 0c0-3 2-6 6-9Z"/><path d="M12 21V12"/>',
    wave: '<path d="M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0"/>',
    flask: '<path d="M10 3h4M11 3v6l-5.5 9a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L13 9V3"/><path d="M8 15h8"/>',
    brush: '<path d="M18 3c1 4-1 7-5 10"/><path d="M9 13c-3 0-5 2-5 5 0 1.5-1 2-1 2 4 1 9 0 9-4 0-1.5-1-3-3-3Z"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M3 6h18v3H3zM12 6c-2-4-6-3-5 0M12 6c2-4 6-3 5 0"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r=".6"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z"/>',
    tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.4 2.4 2 4 5 4.2"/>',
  };

  function icon(name, size) {
    size = size || 20;
    return (
      '<svg class="icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONS[name] || "") + "</svg>"
    );
  }

  /* --------------------------------------------------------- Capas (overlay) */
  var overlay, openLayers = [], lastFocus = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.hidden = true;
    overlay.addEventListener("click", closeAll);
    document.body.appendChild(overlay);
    return overlay;
  }

  function focusables(el) {
    return Array.prototype.slice.call(
      el.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')
    ).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
  }

  function openLayer(el, focusSel) {
    if (!el) return;
    ensureOverlay();
    if (!openLayers.length) lastFocus = document.activeElement;
    // Solo una capa a la vez
    openLayers.slice().forEach(function (other) { if (other !== el) closeLayer(other, true); });
    // Los modales ocupan toda la pantalla: un clic fuera del panel los cierra
    if (el.classList.contains("modal") && !el._outsideBound) {
      el._outsideBound = true;
      el.addEventListener("mousedown", function (e) { if (e.target === el) closeAll(); });
    }
    el.hidden = false;
    overlay.hidden = false;
    document.documentElement.classList.add("no-scroll");
    // forzar reflow para animar
    void el.offsetWidth;
    el.classList.add("is-open");
    overlay.classList.add("is-open");
    if (openLayers.indexOf(el) === -1) openLayers.push(el);
    var target = (focusSel && el.querySelector(focusSel)) || focusables(el)[0] || el;
    setTimeout(function () { try { target.focus({ preventScroll: true }); } catch (e) {} }, 30);
  }

  function closeLayer(el, keepOverlay) {
    if (!el || openLayers.indexOf(el) === -1) return;
    el.classList.remove("is-open");
    openLayers = openLayers.filter(function (x) { return x !== el; });
    setTimeout(function () { if (!el.classList.contains("is-open")) el.hidden = true; }, 260);
    if (!openLayers.length && !keepOverlay) {
      overlay.classList.remove("is-open");
      setTimeout(function () { if (!openLayers.length) overlay.hidden = true; }, 260);
      document.documentElement.classList.remove("no-scroll");
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    }
  }

  function closeAll() {
    openLayers.slice().forEach(function (el) { closeLayer(el); });
  }

  document.addEventListener("keydown", function (e) {
    var top = openLayers[openLayers.length - 1];
    if (e.key === "Escape" && top) { e.preventDefault(); closeLayer(top); return; }
    if (e.key === "Tab" && top) {
      var f = focusables(top);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ----------------------------------------------------------------- Toasts */
  var toastBox;
  function toast(message, opts) {
    opts = opts || {};
    if (!toastBox) {
      toastBox = document.createElement("div");
      toastBox.className = "toasts";
      toastBox.setAttribute("role", "status");
      toastBox.setAttribute("aria-live", "polite");
      document.body.appendChild(toastBox);
    }
    var t = document.createElement("div");
    t.className = "toast" + (opts.type ? " toast--" + opts.type : "");
    t.innerHTML = '<span class="toast__icon">' + icon(opts.type === "warn" ? "info" : "check", 18) + "</span><span>" + esc(message) + "</span>";
    toastBox.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("is-in"); });
    setTimeout(function () {
      t.classList.remove("is-in");
      setTimeout(function () { t.remove(); }, 300);
    }, opts.duration || 3200);
  }

  /* ----------------------------------------------------------------- Helpers */
  function stockInfo(p) {
    if (p.stock <= 0) return { cls: "out", text: "Agotado" };
    if (p.stock <= 5) return { cls: "low", text: "Últimas " + p.stock + " unidades" };
    return { cls: "ok", text: "Disponible" };
  }

  function isNew(p) {
    if (!p.added) return false;
    var days = (Date.now() - new Date(p.added + "T00:00:00").getTime()) / 86400000;
    return days >= 0 && days <= 45;
  }

  function imgSrc(p) { return U.url(p.image); }
  function productUrl(p) { return U.url("producto.html?id=" + encodeURIComponent(p.id)); }
  function catUrl(id) { return U.url("productos.html?cat=" + encodeURIComponent(id)); }

  /* ------------------------------------------------------ Tarjeta de producto */
  function productCard(p) {
    var pct = U.discountPct(p), st = stockInfo(p), out = p.stock <= 0;
    var waHref = WA.isConfigured() ? WA.productLink(p) : U.url("contacto.html");
    var badges = "";
    if (pct) badges += '<span class="badge badge--sale">-' + pct + "%</span>";
    if (isNew(p)) badges += '<span class="badge badge--new">Nuevo</span>';
    if (out) badges += '<span class="badge badge--out">Agotado</span>';
    return (
      '<article class="card' + (out ? " is-out" : "") + '" data-id="' + esc(p.id) + '">' +
        '<a class="card__media" href="' + productUrl(p) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(imgSrc(p)) + '" alt="" width="480" height="480" loading="lazy" decoding="async">' +
          (badges ? '<span class="badges">' + badges + "</span>" : "") +
        "</a>" +
        '<div class="card__body">' +
          '<p class="card__meta"><span class="card__brand">' + esc(p.brand) + '</span><span class="card__cat">' + esc(U.categoryName(p.category)) + "</span></p>" +
          '<h3 class="card__title"><a href="' + productUrl(p) + '">' + esc(p.name) + "</a></h3>" +
          '<p class="card__desc">' + esc(p.description) + "</p>" +
          '<p class="card__price"><strong>' + U.money(p.price) + "</strong>" +
            (pct ? ' <s class="old">' + U.money(p.oldPrice) + '</s><span class="sr-only"> Precio anterior</span>' : "") + "</p>" +
          '<p class="stock stock--' + st.cls + '"><span class="dot" aria-hidden="true"></span>' + st.text + "</p>" +
          '<div class="card__actions">' +
            '<button type="button" class="btn btn--primary btn--sm" data-add="' + esc(p.id) + '"' + (out ? " disabled" : "") + ">" +
              '<span class="btn__label">' + (out ? "No disponible" : "Agregar a la bolsa") + "</span></button>" +
            '<a class="btn btn--ghost btn--icon" href="' + esc(waHref) + '" target="_blank" rel="noopener" data-wa-product="' + esc(p.id) + '" ' +
              'aria-label="Consultar por WhatsApp: ' + esc(p.name) + '" title="Consultar por WhatsApp">' + icon("whatsapp", 20) + "</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* ------------------------------------------------------------------ Header */
  function waButtonHtml(cls, label) {
    return '<a class="' + cls + '" href="' + esc(WA.generalLink() || U.url("contacto.html")) + '" target="_blank" rel="noopener" data-wa-general>' +
      icon("whatsapp", 20) + (label ? '<span class="wa-label">' + label + "</span>" : "") + "</a>";
  }

  function navLinks(current) {
    var items = [
      { id: "home", label: "Inicio", href: U.url("index.html") },
      { id: "products", label: "Productos", href: U.url("productos.html") },
      { id: "cats", label: "Categorías", menu: true },
      { id: "offers", label: "Ofertas", href: catUrl("ofertas") },
      { id: "about", label: "Nosotros", href: U.url("nosotros.html") },
      { id: "contact", label: "Contacto", href: U.url("contacto.html") },
    ];
    return items.map(function (it) {
      var active = it.id === current ? ' aria-current="page"' : "";
      if (it.menu) {
        return '<li class="nav__item has-menu"><button type="button" class="nav__link" aria-expanded="false" aria-controls="mega" data-mega-toggle>' +
          it.label + icon("chevron", 16) + "</button></li>";
      }
      return '<li class="nav__item"><a class="nav__link"' + active + ' href="' + it.href + '">' + it.label + "</a></li>";
    }).join("");
  }

  function categoryLinks(cls) {
    return (window.YIYI_CATEGORIES || []).map(function (c) {
      return '<a class="' + cls + '" href="' + catUrl(c.id) + '">' + icon(c.icon || "sparkle", 22) +
        '<span><strong>' + esc(c.name) + "</strong><small>" + esc(c.blurb || "") + "</small></span></a>";
    }).join("");
  }

  function buildHeader() {
    var page = document.body.getAttribute("data-page") || "";
    var wrap = document.getElementById("site-header");
    if (!wrap) return;
    var freeFrom = Number(CFG.shipping && CFG.shipping.freeShippingFrom);
    var topMsg = freeFrom > 0
      ? "<strong>Envío gratis desde " + esc(U.money(freeFrom).replace(/\.00$/, "")) + "</strong> · Confirma tu pedido por WhatsApp"
      : "Elige tus productos y confirma tu pedido por WhatsApp";
    wrap.innerHTML =
      '<a class="skip" href="#main">Saltar al contenido</a>' +
      '<div class="topbar" data-topbar role="region" aria-label="Avisos de la tienda"><div class="topbar__track"><p class="topbar__item is-active">' + icon("whatsapp", 15) + " " + topMsg + "</p></div></div>" +
      '<header class="header" id="header"><div class="header__inner container">' +
        '<button type="button" class="iconbtn header__menu" aria-label="Abrir menú" aria-controls="mobile-menu" data-open-menu>' + icon("menu", 24) + "</button>" +
        '<a class="logo" href="' + U.url("index.html") + '" aria-label="' + esc(CFG.store.name) + ' · Inicio">' +
          '<img src="' + U.url("assets/logo/logo.svg") + '" alt="' + esc(CFG.store.name) + '" width="190" height="50"></a>' +
        '<nav class="nav" aria-label="Principal"><ul class="nav__list">' + navLinks(page) + "</ul></nav>" +
        '<div class="header__actions">' +
          '<button type="button" class="iconbtn" aria-label="Buscar productos" data-open-search>' + icon("search", 22) + "</button>" +
          waButtonHtml("btn btn--wa btn--sm header__wa", "WhatsApp") +
          '<button type="button" class="iconbtn cartbtn" aria-label="Abrir bolsa de compra" data-open-cart>' + icon("bag", 24) +
            '<span class="cartbtn__count" data-cart-count hidden>0</span></button>' +
        "</div>" +
      "</div>" +
      '<div class="mega" id="mega" hidden><div class="container mega__grid">' + categoryLinks("mega__link") + "</div></div>" +
      "</header>" +
      /* Menú móvil */
      '<aside class="sheet sheet--left" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú" hidden>' +
        '<div class="sheet__head"><img src="' + U.url("assets/logo/logo.svg") + '" alt="' + esc(CFG.store.name) + '" width="150" height="40">' +
        '<button type="button" class="iconbtn" aria-label="Cerrar menú" data-close-layer>' + icon("close", 22) + "</button></div>" +
        '<nav class="sheet__body" aria-label="Menú móvil">' +
          '<a class="mnav__link" href="' + U.url("index.html") + '">Inicio</a>' +
          '<a class="mnav__link" href="' + U.url("productos.html") + '">Productos</a>' +
          '<p class="mnav__title">Categorías</p>' + categoryLinks("mnav__cat") +
          '<a class="mnav__link" href="' + catUrl("ofertas") + '">Ofertas</a>' +
          '<a class="mnav__link" href="' + U.url("nosotros.html") + '">Nosotros</a>' +
          '<a class="mnav__link" href="' + U.url("contacto.html") + '">Contacto</a>' +
          waButtonHtml("btn btn--wa btn--block", "Escríbenos por WhatsApp") +
        "</nav></aside>" +
      /* Buscador */
      '<div class="searchpanel" id="search-panel" role="dialog" aria-modal="true" aria-label="Buscar productos" hidden>' +
        '<div class="container searchpanel__inner">' +
          '<form class="searchform" role="search" action="' + U.url("productos.html") + '" method="get">' +
            icon("search", 22) +
            '<input type="search" name="q" id="search-input" placeholder="Busca labiales, sérums, perfumes…" autocomplete="off" aria-label="Buscar productos">' +
            '<button type="button" class="iconbtn" aria-label="Cerrar buscador" data-close-layer>' + icon("close", 22) + "</button>" +
          "</form>" +
          '<div class="searchresults" id="search-results" aria-live="polite"></div>' +
        "</div></div>";
  }

  /* ------------------------------------------------------------------ Footer */
  function socialLinks() {
    var out = "", s = CFG.social || {};
    [["instagram", "Instagram"], ["facebook", "Facebook"], ["tiktok", "TikTok"]].forEach(function (n) {
      if (s[n[0]]) out += '<a class="social" href="' + esc(s[n[0]]) + '" target="_blank" rel="noopener noreferrer" aria-label="' + n[1] + '">' + icon(n[0], 20) + "</a>";
    });
    return out;
  }

  function buildFooter() {
    var wrap = document.getElementById("site-footer");
    if (!wrap) return;
    var L = function (p) { return U.url("pages/" + p); };
    var email = CFG.contact.email;
    var social = socialLinks();
    wrap.innerHTML =
      '<footer class="footer"><div class="container">' +
        '<div class="footer__grid">' +
          '<div class="footer__brand">' +
            '<img src="' + U.url("assets/logo/logo-light.svg") + '" alt="' + esc(CFG.store.name) + '" width="190" height="50" loading="lazy">' +
            "<p>" + esc(CFG.store.tagline) + "</p>" +
            (social ? '<div class="socials">' + social + "</div>" : "") +
          "</div>" +
          '<nav class="footer__col" aria-label="Comprar"><h2>Comprar</h2><ul>' +
            '<li><a href="' + U.url("productos.html") + '">Todos los productos</a></li>' +
            '<li><a href="' + U.url("productos.html") + '#categorias">Categorías</a></li>' +
            '<li><a href="' + catUrl("ofertas") + '">Ofertas</a></li></ul></nav>' +
          '<nav class="footer__col" aria-label="Ayuda"><h2>Ayuda</h2><ul>' +
            '<li><a href="' + L("faq.html") + '">Preguntas frecuentes</a></li>' +
            '<li><a href="' + L("envios.html") + '">Envíos</a></li>' +
            '<li><a href="' + L("cambios.html") + '">Cambios y devoluciones</a></li>' +
            '<li><a href="' + L("pagos.html") + '">Métodos de pago</a></li></ul></nav>' +
          '<nav class="footer__col" aria-label="Legal"><h2>Legal</h2><ul>' +
            '<li><a href="' + L("privacidad.html") + '">Política de privacidad</a></li>' +
            '<li><a href="' + L("terminos.html") + '">Términos y condiciones</a></li>' +
            '<li><a href="' + L("cookies.html") + '">Cookies</a></li>' +
            '<li><a href="' + L("informacion-legal.html") + '">Información legal</a></li></ul></nav>' +
          '<div class="footer__col"><h2>Contacto</h2><ul>' +
            '<li><a href="' + esc(WA.generalLink() || U.url("contacto.html")) + '" target="_blank" rel="noopener" data-wa-general>WhatsApp</a></li>' +
            (email ? '<li><a href="mailto:' + esc(email) + '">' + esc(email) + "</a></li>" : '<li><a href="' + U.url("contacto.html") + '">Formulario de contacto</a></li>') +
            '<li><a href="' + U.url("contacto.html") + '">Horario y datos de contacto</a></li></ul></div>' +
        "</div>" +
        '<div class="footer__bottom">' +
          "<p>© " + new Date().getFullYear() + " " + esc(CFG.store.name) + ". Todos los derechos reservados.</p>" +
          '<p class="footer__small">Los pedidos se coordinan por WhatsApp. En este sitio no se ingresan datos de tarjetas.</p>' +
          '<p class="footer__links">' +
            '<button type="button" class="linkbtn" data-open-cookies>Preferencias de cookies</button>' +
            (CFG.legal.claimsBookUrl ? ' · <a href="' + esc(CFG.legal.claimsBookUrl) + '" target="_blank" rel="noopener">Libro de Reclamaciones</a>' : "") +
            ' · <a href="' + L("informacion-legal.html") + '#ia">Uso de IA</a>' +
          "</p>" +
        "</div>" +
      "</div></footer>" +
      '<a class="wafloat" href="' + esc(WA.generalLink() || U.url("contacto.html")) + '" target="_blank" rel="noopener" data-wa-general aria-label="Escribir por WhatsApp">' +
        icon("whatsapp", 26) + '<span class="wafloat__text">Escríbenos</span></a>';
  }

  /* ------------------------------------------------------------- Bolsa (cart) */
  var drawer, drawerBody, drawerFoot;

  function buildDrawer() {
    drawer = document.createElement("aside");
    drawer.className = "sheet sheet--right drawer";
    drawer.id = "cart-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-labelledby", "cart-title");
    drawer.hidden = true;
    drawer.innerHTML =
      '<div class="sheet__head"><h2 id="cart-title">Tu bolsa <span class="muted" data-cart-title-count></span></h2>' +
      '<button type="button" class="iconbtn" aria-label="Cerrar bolsa" data-close-layer>' + icon("close", 22) + "</button></div>" +
      '<div class="sheet__body drawer__body" data-cart-body></div>' +
      '<div class="sheet__foot drawer__foot" data-cart-foot></div>';
    document.body.appendChild(drawer);
    drawerBody = drawer.querySelector("[data-cart-body]");
    drawerFoot = drawer.querySelector("[data-cart-foot]");
  }

  function priceHtml(p) {
    var pct = U.discountPct(p);
    return "<strong>" + U.money(p.price) + "</strong>" + (pct ? ' <s class="old">' + U.money(p.oldPrice) + "</s>" : "");
  }

  function renderCart() {
    var lines = Cart.lines(), count = Cart.count();
    // contador del header
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = count > 99 ? "99+" : count;
      el.hidden = count === 0;
    });
    var tc = drawer.querySelector("[data-cart-title-count]");
    if (tc) tc.textContent = count ? "(" + count + ")" : "";

    if (!lines.length) {
      drawerBody.innerHTML =
        '<div class="empty"><div class="empty__icon">' + icon("bag", 40) + "</div><h3>Tu bolsa está vacía</h3>" +
        "<p>Agrega tus productos favoritos y revisa tu pedido antes de enviarlo por WhatsApp.</p>" +
        '<a class="btn btn--primary" href="' + U.url("productos.html") + '">Ver productos</a></div>';
      drawerFoot.innerHTML = "";
      return;
    }

    drawerBody.innerHTML = '<ul class="cartlist">' + lines.map(function (l) {
      var p = l.product, atMax = l.qty >= l.max;
      return (
        '<li class="cartline" data-id="' + esc(p.id) + '">' +
          '<a class="cartline__img" href="' + productUrl(p) + '"><img src="' + esc(imgSrc(p)) + '" alt="" width="80" height="80" loading="lazy"></a>' +
          '<div class="cartline__info">' +
            '<p class="cartline__brand">' + esc(p.brand) + "</p>" +
            '<a class="cartline__name" href="' + productUrl(p) + '">' + esc(p.name) + "</a>" +
            '<p class="cartline__price">' + priceHtml(p) + "</p>" +
            '<div class="qty" role="group" aria-label="Cantidad de ' + esc(p.name) + '">' +
              '<button type="button" data-qty="-1" aria-label="Disminuir cantidad">' + icon("minus", 16) + "</button>" +
              '<span class="qty__n" aria-live="polite">' + l.qty + "</span>" +
              '<button type="button" data-qty="1" aria-label="Aumentar cantidad"' + (atMax ? " disabled" : "") + ">" + icon("plus", 16) + "</button>" +
            "</div>" +
            (atMax ? '<p class="cartline__hint">Máximo disponible por pedido</p>' : "") +
          "</div>" +
          '<div class="cartline__side"><strong>' + U.money(l.total) + "</strong>" +
            '<button type="button" class="iconbtn iconbtn--sm" data-remove aria-label="Eliminar ' + esc(p.name) + '">' + icon("trash", 18) + "</button></div>" +
        "</li>"
      );
    }).join("") + "</ul>";

    var ship = Cart.shipping(), from = CFG.shipping.freeShippingFrom, sav = Cart.savings();
    var progress = "";
    if (from) {
      var pct = Math.min(100, Math.round((Cart.subtotal() / from) * 100));
      progress =
        '<div class="freeship"><p>' + (ship.free ? "¡Tienes envío gratis!" : "Te faltan <strong>" + U.money(ship.missing) + "</strong> para envío gratis") +
        '</p><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div>';
    }
    drawerFoot.innerHTML =
      progress +
      '<dl class="summary">' +
        "<div><dt>Subtotal</dt><dd>" + U.money(Cart.subtotal()) + "</dd></div>" +
        (sav ? '<div class="summary__save"><dt>Ahorro incluido</dt><dd>' + U.money(sav) + "</dd></div>" : "") +
        "<div><dt>Envío</dt><dd>" + ship.label + "</dd></div>" +
        '<div class="summary__total"><dt>Total</dt><dd>' + U.money(Cart.total()) + "</dd></div>" +
      "</dl>" +
      '<p class="fineprint">' + icon("shield", 15) + " Tu pedido se confirma por WhatsApp. No pedimos datos de tarjeta en este sitio.</p>" +
      '<button type="button" class="btn btn--wa btn--block" data-checkout>' + icon("whatsapp", 20) + " Realizar pedido por WhatsApp</button>" +
      '<div class="drawer__row"><a class="linkbtn" href="' + U.url("productos.html") + '">Seguir comprando</a>' +
      '<button type="button" class="linkbtn linkbtn--muted" data-clear-cart>Vaciar bolsa</button></div>';
  }

  /* ----------------------------------------------------- Pedido por WhatsApp */
  var modal;

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "checkout-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "co-title");
    modal.hidden = true;
    document.body.appendChild(modal);
  }

  function privacyUrl() { return U.url("pages/privacidad.html"); }

  function summaryHtml() {
    var ship = Cart.shipping();
    return (
      '<section class="co__summary" aria-label="Resumen del pedido"><h3>Tu pedido</h3><ul class="co__list">' +
      Cart.lines().map(function (l) {
        return '<li><span>' + esc(l.product.name) + ' <em>x ' + l.qty + "</em></span><strong>" + U.money(l.total) + "</strong></li>";
      }).join("") +
      '</ul><dl class="summary"><div><dt>Subtotal</dt><dd>' + U.money(Cart.subtotal()) + "</dd></div>" +
      "<div><dt>Envío</dt><dd>" + ship.label + "</dd></div>" +
      '<div class="summary__total"><dt>Total</dt><dd>' + U.money(Cart.total()) + "</dd></div></dl>" +
      '<p class="fineprint">El costo de envío, la disponibilidad y el método de pago se confirman contigo por WhatsApp.</p></section>'
    );
  }

  function field(id, label, opts) {
    opts = opts || {};
    return (
      '<div class="field"><label for="co-' + id + '">' + label + (opts.required ? ' <span aria-hidden="true">*</span>' : ' <span class="opt">(opcional)</span>') + "</label>" +
      (opts.textarea
        ? '<textarea id="co-' + id + '" name="' + id + '" rows="3" maxlength="400"' + (opts.ph ? ' placeholder="' + opts.ph + '"' : "") + "></textarea>"
        : '<input id="co-' + id + '" name="' + id + '" type="' + (opts.type || "text") + '"' + (opts.auto ? ' autocomplete="' + opts.auto + '"' : "") +
          (opts.inputmode ? ' inputmode="' + opts.inputmode + '"' : "") + (opts.ph ? ' placeholder="' + opts.ph + '"' : "") +
          (opts.required ? ' required aria-required="true"' : "") + (opts.max ? ' maxlength="' + opts.max + '"' : "") + ">") +
      '<p class="field__error" id="co-' + id + '-err" role="alert"></p></div>'
    );
  }

  function openCheckout() {
    if (!Cart.count()) { toast("Tu bolsa está vacía.", { type: "warn" }); return; }
    modal.innerHTML =
      '<div class="modal__panel">' +
        '<div class="sheet__head"><h2 id="co-title">Finalizar pedido</h2>' +
        '<button type="button" class="iconbtn" aria-label="Cerrar" data-close-layer>' + icon("close", 22) + "</button></div>" +
        '<div class="modal__body" data-co-body>' +
          summaryHtml() +
          '<form class="co__form" id="checkout-form" novalidate>' +
            "<h3>Tus datos para coordinar</h3>" +
            '<p class="fineprint">Solo pedimos lo necesario para confirmar tu compra y organizar la entrega.</p>' +
            field("name", "Nombre y apellido", { required: true, auto: "name", max: 80 }) +
            field("phone", "Teléfono / WhatsApp", { required: true, type: "tel", auto: "tel", inputmode: "tel", ph: "Ej. 987 654 321", max: 20 }) +
            field("district", "Distrito o zona de entrega", { required: true, auto: "address-level2", max: 80 }) +
            (CFG.order.askDeliveryReference ? field("reference", "Referencia de entrega", { max: 200, ph: "Ej. cerca al parque, edificio, piso…" }) : "") +
            field("notes", "Comentarios adicionales", { textarea: true, ph: "Tonos, preferencias u otras indicaciones" }) +
            '<div class="privacy"><p><strong>¿Para qué usamos tus datos?</strong> Solo para gestionar este pedido: confirmar disponibilidad, coordinar el pago y la entrega. ' +
            "No se guardan en este sitio: se incluyen en el mensaje que tú envías por WhatsApp. " +
            '<a href="' + privacyUrl() + '" target="_blank" rel="noopener">Política de privacidad</a>.</p></div>' +
            '<label class="check"><input type="checkbox" id="co-consent" name="consent"><span>He leído la <a href="' + privacyUrl() + '" target="_blank" rel="noopener">Política de Privacidad</a> y autorizo el uso de mis datos para gestionar este pedido. <span aria-hidden="true">*</span></span></label>' +
            '<p class="field__error" id="co-consent-err" role="alert"></p>' +
            '<button type="submit" class="btn btn--wa btn--block btn--lg">' + icon("whatsapp", 22) + " Realizar pedido por WhatsApp</button>" +
            '<p class="fineprint center">Se abrirá WhatsApp con tu pedido ya escrito. Tú decides si lo envías. Sin pagos con tarjeta en este sitio.</p>' +
          "</form>" +
        "</div>" +
      "</div>";
    openLayer(modal, "#co-name");
    modal.querySelector("#checkout-form").addEventListener("submit", submitCheckout);
  }

  function submitCheckout(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var data = {};
    ["name", "phone", "district", "reference", "notes"].forEach(function (k) {
      var el = form.elements[k];
      data[k] = el ? el.value : "";
    });
    var v = WA.validate(data);
    var consent = form.elements.consent.checked;

    ["name", "phone", "district", "reference", "notes"].forEach(function (k) {
      var err = form.querySelector("#co-" + k + "-err");
      var el = form.elements[k];
      if (!err || !el) return;
      err.textContent = v.errors[k] || "";
      el.setAttribute("aria-invalid", v.errors[k] ? "true" : "false");
      if (v.errors[k]) el.setAttribute("aria-describedby", "co-" + k + "-err"); else el.removeAttribute("aria-describedby");
    });
    var cErr = form.querySelector("#co-consent-err");
    cErr.textContent = consent ? "" : "Para continuar, acepta el uso de tus datos para gestionar el pedido.";

    if (!v.ok || !consent) {
      var firstBad = form.querySelector('[aria-invalid="true"]') || (!consent && form.elements.consent);
      if (firstBad) firstBad.focus();
      return;
    }

    var lines = Cart.lines();
    var url = WA.orderLink(lines, v.clean);
    var body = modal.querySelector("[data-co-body]");

    if (!url) {
      // MODO DEMOSTRACIÓN: aún no hay número configurado
      body.innerHTML =
        '<div class="done"><div class="done__icon done__icon--warn">' + icon("info", 34) + "</div>" +
        "<h3>Modo demostración</h3>" +
        "<p>Aún no se configuró el número de WhatsApp de la tienda, por eso no se abre WhatsApp. Así se vería el mensaje del pedido:</p>" +
        '<pre class="msgpreview">' + esc(WA.orderMessage(lines, v.clean)) + "</pre>" +
        '<p class="fineprint">Para activarlo, escribe tu número en <code>js/config.js</code> → <code>contact.whatsappNumber</code> (con código de país, ej. 51987654321).</p>' +
        '<button type="button" class="btn btn--ghost" data-close-layer>Cerrar</button></div>';
      return;
    }

    WA.open(url);
    body.innerHTML =
      '<div class="done"><div class="done__icon">' + icon("check", 34) + "</div>" +
      "<h3>¡Casi listo! Revisa WhatsApp</h3>" +
      "<p>Abrimos WhatsApp con tu pedido ya escrito. <strong>Presiona “Enviar” en WhatsApp</strong> para que " + esc(CFG.store.name) +
      " lo reciba y confirme disponibilidad, pago y entrega.</p>" +
      '<a class="btn btn--wa btn--block" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon("whatsapp", 20) + " Abrir WhatsApp de nuevo</a>" +
      '<button type="button" class="btn btn--ghost btn--block" data-finish-order>Ya envié mi pedido · Vaciar bolsa</button>' +
      '<button type="button" class="linkbtn" data-close-layer>Volver a la tienda (conservar bolsa)</button></div>';
  }

  /* ------------------------------------------------------------ Buscador */
  function renderSearchResults(q) {
    var box = document.getElementById("search-results");
    if (!box) return;
    q = (q || "").trim();
    if (q.length < 2) {
      box.innerHTML = '<p class="muted">Escribe al menos 2 letras. Busca por nombre, marca o categoría.</p>' +
        '<div class="chips">' + (window.YIYI_CATEGORIES || []).slice(0, 6).map(function (c) {
          return '<a class="chip" href="' + catUrl(c.id) + '">' + esc(c.name) + "</a>";
        }).join("") + "</div>";
      return;
    }
    var res = Y.Catalog ? Y.Catalog.search(q) : [];
    if (!res.length) {
      box.innerHTML = '<p>No encontramos resultados para “<strong>' + esc(q) + '</strong>”. Prueba con otra palabra o <a href="' + U.url("productos.html") + '">mira todo el catálogo</a>.</p>';
      return;
    }
    box.innerHTML = '<ul class="sr-list">' + res.slice(0, 6).map(function (p) {
      return '<li><a href="' + productUrl(p) + '"><img src="' + esc(imgSrc(p)) + '" alt="" width="56" height="56" loading="lazy">' +
        '<span><strong>' + esc(p.name) + "</strong><small>" + esc(p.brand) + " · " + esc(U.categoryName(p.category)) + "</small></span>" +
        "<em>" + U.money(p.price) + "</em></a></li>";
    }).join("") + "</ul>" +
    '<a class="btn btn--ghost btn--sm" href="' + U.url("productos.html?q=" + encodeURIComponent(q)) + '">Ver los ' + res.length + " resultado" + (res.length === 1 ? "" : "s") + "</a>";
  }

  /* ------------------------------------------------- Datos configurables (DOM) */
  function applyConfigToDom(root) {
    root = root || document;
    // Muestra el valor de config; si está vacío usa data-fallback marcado como "pendiente"
    root.querySelectorAll("[data-cfg]").forEach(function (el) {
      var val = U.getPath(CFG, el.getAttribute("data-cfg"));
      var link = el.getAttribute("data-link");
      if (val === null || val === undefined || val === "" || val === false) {
        el.textContent = el.getAttribute("data-fallback") || "[por definir]";
        el.classList.add("pending");
        return;
      }
      if (link === "mailto") { el.innerHTML = '<a href="mailto:' + esc(val) + '">' + esc(val) + "</a>"; }
      else if (link === "tel") { el.innerHTML = '<a href="https://wa.me/' + esc(String(val).replace(/\D/g, "")) + '" target="_blank" rel="noopener">+' + esc(String(val).replace(/\D/g, "")) + "</a>"; }
      else if (link === "url") { el.innerHTML = '<a href="' + esc(val) + '" target="_blank" rel="noopener">' + esc(val) + "</a>"; }
      else el.textContent = val;
      el.classList.remove("pending");
    });
    // Oculta bloques si el dato no existe
    root.querySelectorAll("[data-show-if]").forEach(function (el) {
      var v = U.getPath(CFG, el.getAttribute("data-show-if"));
      el.hidden = !v;
    });
    root.querySelectorAll("[data-hide-if]").forEach(function (el) {
      var v = U.getPath(CFG, el.getAttribute("data-hide-if"));
      el.hidden = !!v;
    });
    // Enlaces de WhatsApp
    root.querySelectorAll("[data-wa-general]").forEach(function (a) {
      var href = WA.generalLink();
      if (href) { a.setAttribute("href", href); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    });
    // Medios de pago activos
    root.querySelectorAll("[data-payments]").forEach(function (el) {
      var on = (CFG.payments || []).filter(function (p) { return p.enabled; });
      el.innerHTML = on.length
        ? '<ul class="paylist">' + on.map(function (p) {
            return "<li><strong>" + esc(p.label) + "</strong>" + (p.note ? "<span>" + esc(p.note) + "</span>" : "") + "</li>";
          }).join("") + "</ul>"
        : '<p class="notice notice--soft">Los métodos de pago disponibles se confirman por WhatsApp al coordinar tu pedido. <span class="pending">[La tienda aún no ha definido sus métodos de pago en js/config.js]</span></p>';
    });
    // Zonas de envío
    root.querySelectorAll("[data-zones]").forEach(function (el) {
      var z = (CFG.shipping && CFG.shipping.zones) || [];
      el.innerHTML = z.length
        ? '<div class="tablewrap"><table class="table"><thead><tr><th>Zona</th><th>Costo de envío</th></tr></thead><tbody>' +
          z.map(function (r) {
            return "<tr><td>" + esc(r.name) + "</td><td>" + (r.cost == null ? "Se confirma por WhatsApp" : U.money(r.cost)) + "</td></tr>";
          }).join("") + "</tbody></table></div>"
        : '<p class="notice notice--soft">Las zonas de cobertura y los costos de envío se confirman por WhatsApp según tu distrito. <span class="pending">[Pendiente de definir en js/config.js → shipping.zones]</span></p>';
    });
  }

  /* ------------------------------------------------------- Menú "Categorías" */
  function wireMega() {
    var btn = document.querySelector("[data-mega-toggle]");
    var mega = document.getElementById("mega");
    if (!btn || !mega) return;
    function setOpen(open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      mega.hidden = !open;
      mega.classList.toggle("is-open", open);
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(btn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", function (e) {
      if (!mega.hidden && !mega.contains(e.target) && e.target !== btn) setOpen(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ------------------------------------------------------- Eventos globales */
  function wireEvents() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      var el;

      if ((el = t.closest("[data-add]"))) {
        var res = Cart.add(el.getAttribute("data-add"), parseInt(el.getAttribute("data-qty-value"), 10) || 1);
        if (!res.ok) { toast(res.reason === "soldout" ? "Este producto está agotado." : "No se pudo agregar el producto.", { type: "warn" }); return; }
        var p = U.findProduct(el.getAttribute("data-add"));
        toast(res.capped ? "Cantidad máxima alcanzada para " + p.name + "." : "Agregado a tu bolsa: " + p.name, { type: res.capped ? "warn" : "" });
        var cb = document.querySelector(".cartbtn");
        if (cb) { cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump"); }
        var label = el.querySelector(".btn__label");
        if (label && el.closest(".card")) {
          var old = label.textContent;
          el.classList.add("is-added");
          label.textContent = "Agregado ✓";
          setTimeout(function () { el.classList.remove("is-added"); label.textContent = old; }, 1400);
        }
        return;
      }
      if (t.closest("[data-open-cart]")) { renderCart(); openLayer(drawer); return; }
      if (t.closest("[data-open-menu]")) { openLayer(document.getElementById("mobile-menu")); return; }
      if (t.closest("[data-open-search]")) {
        openLayer(document.getElementById("search-panel"), "#search-input");
        renderSearchResults("");
        return;
      }
      if (t.closest("[data-close-layer]")) { closeAll(); return; }
      if (t.closest("[data-checkout]")) { openCheckout(); return; }
      if (t.closest("[data-clear-cart]")) {
        if (window.confirm("¿Vaciar toda tu bolsa?")) Cart.clear();
        return;
      }
      if (t.closest("[data-finish-order]")) { Cart.clear(); closeAll(); toast("Bolsa vaciada. ¡Gracias por tu pedido!"); return; }

      if ((el = t.closest(".cartline"))) {
        var id = el.getAttribute("data-id");
        var q = t.closest("[data-qty]");
        if (q) {
          var line = Cart.lines().filter(function (l) { return l.product.id === id; })[0];
          if (line) Cart.setQty(id, line.qty + parseInt(q.getAttribute("data-qty"), 10));
          return;
        }
        if (t.closest("[data-remove]")) { Cart.remove(id); return; }
      }

      /* Consultas por WhatsApp sin número configurado → aviso claro */
      if ((el = t.closest("[data-wa-product], [data-wa-general]")) && !WA.isConfigured()) {
        e.preventDefault();
        toast("Modo demostración: configura el número de WhatsApp en js/config.js.", { type: "warn", duration: 4500 });
        return;
      }
    });

    document.addEventListener("input", function (e) {
      if (e.target && e.target.id === "search-input") renderSearchResults(e.target.value);
    });

    document.addEventListener("cart:change", renderCart);

    // Sombra del header al hacer scroll
    var header = document.getElementById("header");
    function onScroll() { if (header) header.classList.toggle("is-stuck", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------ Init */
  function init() {
    buildHeader();
    buildFooter();
    buildDrawer();
    buildModal();
    renderCart();
    wireMega();
    wireEvents();
    applyConfigToDom(document);
  }

  Y.UI = {
    icon: icon, toast: toast, productCard: productCard, openLayer: openLayer, closeLayer: closeLayer,
    closeAll: closeAll, applyConfigToDom: applyConfigToDom, isNew: isNew, stockInfo: stockInfo,
    productUrl: productUrl, catUrl: catUrl, imgSrc: imgSrc, init: init,
  };
})();