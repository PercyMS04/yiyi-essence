/* ==========================================================================
   YIYI ESSENCE · CATÁLOGO, BÚSQUEDA Y FILTROS
   --------------------------------------------------------------------------
   · API de datos (search / filter / sort) reutilizada por el buscador del header.
   · Controladores de las páginas: inicio, listado de productos y detalle.
   ========================================================================== */
(function () {
  "use strict";
  var Y = window.YIYI;
  var U = Y.U, CFG = window.YIYI_CONFIG, esc = U.esc;
  var ALL = window.YIYI_PRODUCTS || [];
  var CATS = window.YIYI_CATEGORIES || [];
  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /* ================================================================ DATOS */
  var haystackCache = {};
  function haystack(p) {
    if (!haystackCache[p.id]) {
      haystackCache[p.id] = U.norm([p.name, p.brand, U.categoryName(p.category), p.subcategory, p.description, p.size].join(" "));
    }
    return haystackCache[p.id];
  }

  /* Todas las palabras deben aparecer (sin importar tildes ni mayúsculas) */
  function matches(p, q) {
    var tokens = U.norm(q).split(/\s+/).filter(Boolean);
    if (!tokens.length) return true;
    var h = haystack(p);
    return tokens.every(function (t) { return h.indexOf(t) !== -1; });
  }

  function relevance(p, q) {
    var tokens = U.norm(q).split(/\s+/).filter(Boolean), s = 0;
    var name = U.norm(p.name), brand = U.norm(p.brand);
    tokens.forEach(function (t) {
      if (name.indexOf(t) === 0) s += 5;
      else if (name.indexOf(t) !== -1) s += 3;
      if (brand.indexOf(t) !== -1) s += 2;
      if (p.featured) s += 0.5;
    });
    return s;
  }

  function search(q) {
    return ALL.filter(function (p) { return matches(p, q); })
      .sort(function (a, b) { return relevance(b, q) - relevance(a, q); });
  }

  function brands() {
    var set = {};
    ALL.forEach(function (p) { set[p.brand] = true; });
    return Object.keys(set).sort(function (a, b) { return a.localeCompare(b, "es"); });
  }

  function byCategory(p, cat) {
    if (!cat) return true;
    if (cat === "ofertas") return U.isOffer(p);
    return p.category === cat;
  }

  function filter(s, skip) {
    skip = skip || {};
    return ALL.filter(function (p) {
      if (s.q && !matches(p, s.q)) return false;
      if (!skip.cat && s.cat && !byCategory(p, s.cat)) return false;
      if (!skip.brand && s.brands.length && s.brands.indexOf(p.brand) === -1) return false;
      if (s.min != null && p.price < s.min) return false;
      if (s.max != null && p.price > s.max) return false;
      if (s.available && p.stock <= 0) return false;
      return true;
    });
  }

  function dateVal(p) { return p.added ? new Date(p.added).getTime() : 0; }

  var SORTS = {
    relevancia: function (a, b, q) { return relevance(b, q) - relevance(a, q); },
    destacados: function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || dateVal(b) - dateVal(a); },
    novedades: function (a, b) { return dateVal(b) - dateVal(a); },
    "precio-asc": function (a, b) { return a.price - b.price; },
    "precio-desc": function (a, b) { return b.price - a.price; },
    descuento: function (a, b) { return U.discountPct(b) - U.discountPct(a); },
    nombre: function (a, b) { return a.name.localeCompare(b.name, "es"); },
  };

  function sortList(list, mode, q) {
    var fn = SORTS[mode] || SORTS.destacados;
    return list.slice().sort(function (a, b) {
      // Los agotados siempre al final (salvo orden por nombre)
      if (mode !== "nombre" && (a.stock <= 0) !== (b.stock <= 0)) return a.stock <= 0 ? 1 : -1;
      return fn(a, b, q);
    });
  }

  Y.Catalog = { search: search, filter: filter, sort: sortList, brands: brands, matches: matches };

  /* ============================================================ INICIO */
  function renderGrid(el, list) {
    if (!el) return;
    el.innerHTML = list.map(Y.UI.productCard).join("");
  }

  function initHome() {
    // Categorías
    var catBox = $("[data-home-cats]");
    if (catBox) {
      catBox.innerHTML = CATS.map(function (c) {
        var media = c.image
          ? '<span class="catcard__img"><img src="' + esc(U.url(c.image)) + '" alt="" width="400" height="400" loading="lazy" decoding="async"></span>'
          : '<span class="catcard__img catcard__img--icon"><span class="catcard__icon">' + Y.UI.icon(c.icon || "sparkle", 38) + "</span></span>";
        return '<a class="catcard catcard--img" href="' + Y.UI.catUrl(c.id) + '">' + media +
          '<span class="catcard__body"><strong>' + esc(c.name) + "</strong><small>" + esc(c.blurb || "") + "</small></span></a>";
      }).join("");
    }
    var inStock = ALL.filter(function (p) { return p.stock > 0; });
    var featured = sortList(inStock.filter(function (p) { return p.featured; }), "destacados").slice(0, 8);
    if (featured.length < 4) featured = sortList(inStock, "novedades").slice(0, 8);
    renderGrid($("[data-home-featured]"), featured);
    renderGrid($("[data-home-offers]"), sortList(inStock.filter(U.isOffer), "descuento").slice(0, 4));
    renderGrid($("[data-home-new]"), sortList(inStock, "novedades").slice(0, 4));

    var offersSec = $("[data-section-offers]");
    if (offersSec && !inStock.some(U.isOffer)) offersSec.hidden = true;

    var brandBox = $("[data-home-brands]");
    if (brandBox) {
      brandBox.innerHTML = brands().map(function (b) {
        return '<a class="brandchip" href="' + U.url("productos.html?brand=" + encodeURIComponent(b)) + '">' + esc(b) + "</a>";
      }).join("");
    }
  }

  /* ============================================================ LISTADO */
  function initProducts() {
    var grid = $("[data-grid]"), count = $("[data-count]"), chips = $("[data-chips]");
    var filtersBox = $("#filters"), moreBtn = $("[data-more]"), empty = $("[data-empty]");
    var titleEl = $("[data-title]"), introEl = $("[data-intro]");
    var PAGE = 12, shown = PAGE;
    var prices = ALL.map(function (p) { return p.price; });
    var PMIN = Math.floor(Math.min.apply(null, prices)), PMAX = Math.ceil(Math.max.apply(null, prices));

    /* --- estado desde la URL --- */
    var params = new URLSearchParams(window.location.search);
    var state = {
      q: (params.get("q") || "").trim(),
      cat: params.get("cat") || "",
      brands: (params.get("brand") || "").split(",").filter(Boolean),
      min: params.get("min") !== null && params.get("min") !== "" ? parseFloat(params.get("min")) : null,
      max: params.get("max") !== null && params.get("max") !== "" ? parseFloat(params.get("max")) : null,
      available: params.get("stock") === "1",
      sort: params.get("sort") || (params.get("q") ? "relevancia" : "destacados"),
    };
    if (isNaN(state.min)) state.min = null;
    if (isNaN(state.max)) state.max = null;
    if (!SORTS[state.sort]) state.sort = "destacados";
    if (state.cat && !CATS.some(function (c) { return c.id === state.cat; })) state.cat = "";

    function syncUrl() {
      var p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.cat) p.set("cat", state.cat);
      if (state.brands.length) p.set("brand", state.brands.join(","));
      if (state.min != null) p.set("min", state.min);
      if (state.max != null) p.set("max", state.max);
      if (state.available) p.set("stock", "1");
      var defSort = state.q ? "relevancia" : "destacados";
      if (state.sort !== defSort) p.set("sort", state.sort);
      var qs = p.toString();
      try { history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "")); } catch (e) {}
    }

    /* --- filtros (sidebar) --- */
    function renderFilters() {
      var forCats = filter(state, { cat: true });
      var forBrands = filter(state, { brand: true });
      var catHtml =
        '<label class="opt"><input type="radio" name="cat" value=""' + (!state.cat ? " checked" : "") + '><span>Todas</span><em>' + forCats.length + "</em></label>" +
        CATS.map(function (c) {
          var n = forCats.filter(function (p) { return byCategory(p, c.id); }).length;
          return '<label class="opt' + (n === 0 ? " is-zero" : "") + '"><input type="radio" name="cat" value="' + esc(c.id) + '"' + (state.cat === c.id ? " checked" : "") + "><span>" + esc(c.name) + "</span><em>" + n + "</em></label>";
        }).join("");
      var brandHtml = brands().map(function (b) {
        var n = forBrands.filter(function (p) { return p.brand === b; }).length;
        return '<label class="opt' + (n === 0 ? " is-zero" : "") + '"><input type="checkbox" name="brand" value="' + esc(b) + '"' + (state.brands.indexOf(b) !== -1 ? " checked" : "") + "><span>" + esc(b) + "</span><em>" + n + "</em></label>";
      }).join("");

      filtersBox.innerHTML =
        '<div class="filters__head"><h2>Filtros</h2><button type="button" class="iconbtn filters__close" aria-label="Cerrar filtros" data-close-layer>' + Y.UI.icon("close", 22) + "</button></div>" +
        '<div class="filters__body">' +
          '<fieldset class="fgroup" id="categorias"><legend>Categoría</legend>' + catHtml + "</fieldset>" +
          '<fieldset class="fgroup"><legend>Marca</legend>' + brandHtml + "</fieldset>" +
          '<fieldset class="fgroup"><legend>Precio (' + esc(CFG.store.currency) + ')</legend><div class="pricefields">' +
            '<label><span class="sr-only">Precio mínimo</span><input type="number" inputmode="decimal" min="0" step="1" name="min" placeholder="' + PMIN + '" value="' + (state.min != null ? state.min : "") + '"></label>' +
            "<span>–</span>" +
            '<label><span class="sr-only">Precio máximo</span><input type="number" inputmode="decimal" min="0" step="1" name="max" placeholder="' + PMAX + '" value="' + (state.max != null ? state.max : "") + '"></label>' +
          "</div></fieldset>" +
          '<fieldset class="fgroup"><legend>Disponibilidad</legend><label class="opt"><input type="checkbox" name="available"' + (state.available ? " checked" : "") + "><span>Solo disponibles</span></label></fieldset>" +
        "</div>" +
        '<div class="filters__foot"><button type="button" class="btn btn--ghost btn--sm" data-clear-filters>Limpiar filtros</button>' +
        '<button type="button" class="btn btn--primary btn--sm filters__apply" data-close-layer>Ver resultados</button></div>';
    }

    /* --- chips activos --- */
    function renderChips() {
      var out = [];
      if (state.q) out.push(["q", "Búsqueda: " + state.q]);
      if (state.cat) out.push(["cat", U.categoryName(state.cat)]);
      state.brands.forEach(function (b) { out.push(["brand:" + b, b]); });
      if (state.min != null) out.push(["min", "Desde " + U.money(state.min)]);
      if (state.max != null) out.push(["max", "Hasta " + U.money(state.max)]);
      if (state.available) out.push(["available", "Solo disponibles"]);
      chips.innerHTML = out.map(function (c) {
        return '<button type="button" class="chip chip--x" data-chip="' + esc(c[0]) + '">' + esc(c[1]) + " " + Y.UI.icon("close", 14) + '<span class="sr-only"> Quitar filtro</span></button>';
      }).join("") + (out.length ? '<button type="button" class="linkbtn" data-clear-filters>Limpiar todo</button>' : "");
    }

    /* --- render principal --- */
    function render(resetPage) {
      if (resetPage) shown = PAGE;
      var list = sortList(filter(state), state.sort, state.q);
      var cat = CATS.filter(function (c) { return c.id === state.cat; })[0];
      var title = state.q ? 'Resultados para “' + state.q + '”' : cat ? cat.name : "Todos los productos";
      titleEl.textContent = title;
      introEl.textContent = state.q ? "Encuentra tu producto y agrégalo a la bolsa." : cat ? (cat.blurb || "") : "Explora el catálogo y arma tu pedido. Lo confirmamos por WhatsApp.";
      document.title = title + " · " + CFG.store.name;
      count.textContent = list.length + (list.length === 1 ? " producto" : " productos");
      grid.innerHTML = list.slice(0, shown).map(Y.UI.productCard).join("");
      empty.hidden = list.length > 0;
      grid.hidden = list.length === 0;
      moreBtn.hidden = list.length <= shown;
      if (!moreBtn.hidden) moreBtn.textContent = "Mostrar más (" + (list.length - shown) + " restantes)";
      var sel = $("[data-sort]"); if (sel) sel.value = state.sort;
      var si = $("[data-search-input]"); if (si && document.activeElement !== si) si.value = state.q;
      var bar = $("[data-apply-count]"); if (bar) bar.textContent = list.length;
      renderChips();
      syncUrl();
    }

    function update(resetPage) { renderFilters(); render(resetPage !== false); }

    /* --- eventos --- */
    var onPrice = U.debounce(function () {
      var mn = parseFloat($('input[name="min"]', filtersBox).value), mx = parseFloat($('input[name="max"]', filtersBox).value);
      state.min = isNaN(mn) ? null : mn;
      state.max = isNaN(mx) ? null : mx;
      var activeName = document.activeElement && document.activeElement.name;
      render(true);
      renderFilters();
      if (activeName) { var again = $('input[name="' + activeName + '"]', filtersBox); if (again) { again.focus(); var l = again.value.length; try { again.setSelectionRange(l, l); } catch (e) {} } }
    }, 350);

    filtersBox.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "cat") state.cat = t.value;
      else if (t.name === "brand") {
        state.brands = Array.prototype.slice.call(filtersBox.querySelectorAll('input[name="brand"]:checked')).map(function (i) { return i.value; });
      } else if (t.name === "available") state.available = t.checked;
      else return;
      update(true);
    });
    filtersBox.addEventListener("input", function (e) { if (e.target.name === "min" || e.target.name === "max") onPrice(); });

    document.addEventListener("click", function (e) {
      var t = e.target, el;
      if (t.closest("[data-clear-filters]")) {
        state.q = ""; state.cat = ""; state.brands = []; state.min = null; state.max = null; state.available = false;
        state.sort = "destacados"; update(true); return;
      }
      if ((el = t.closest("[data-chip]"))) {
        var k = el.getAttribute("data-chip");
        if (k === "q") state.q = ""; else if (k === "cat") state.cat = ""; else if (k === "min") state.min = null;
        else if (k === "max") state.max = null; else if (k === "available") state.available = false;
        else if (k.indexOf("brand:") === 0) state.brands = state.brands.filter(function (b) { return b !== k.slice(6); });
        update(true); return;
      }
      if (t.closest("[data-more]")) { shown += PAGE; render(false); return; }
      if (t.closest("[data-open-filters]")) { Y.UI.openLayer(filtersBox); return; }
    });

    var sortSel = $("[data-sort]");
    if (sortSel) {
      // "relevancia" solo aparece cuando hay búsqueda
      sortSel.addEventListener("change", function () { state.sort = sortSel.value; render(true); });
    }
    var sInput = $("[data-search-input]");
    if (sInput) {
      sInput.value = state.q;
      sInput.addEventListener("input", U.debounce(function () {
        var had = !!state.q;
        state.q = sInput.value.trim();
        if (state.q && !had) state.sort = "relevancia";
        if (!state.q && state.sort === "relevancia") state.sort = "destacados";
        update(true);
      }, 220));
      $("[data-search-form]").addEventListener("submit", function (e) { e.preventDefault(); sInput.blur(); });
    }

    update(true);
  }

  /* ============================================================ DETALLE */
  function setMeta(sel, attr, value) {
    var el = document.querySelector(sel);
    if (el) el.setAttribute(attr, value);
  }

  function initProduct() {
    var root = $("[data-product]");
    var id = new URLSearchParams(window.location.search).get("id");
    var p = U.findProduct(id);
    if (!p) {
      root.innerHTML = '<div class="empty"><h1>No encontramos este producto</h1><p>Puede que ya no esté disponible o que el enlace sea incorrecto.</p>' +
        '<a class="btn btn--primary" href="' + U.url("productos.html") + '">Ver todos los productos</a></div>';
      document.title = "Producto no encontrado · " + CFG.store.name;
      return;
    }
    var pct = U.discountPct(p), st = Y.UI.stockInfo(p), out = p.stock <= 0;
    var maxQty = Math.max(1, Math.min(Y.Cart.max, p.stock));
    var catName = U.categoryName(p.category);
    var waHref = Y.WhatsApp.isConfigured() ? Y.WhatsApp.productLink(p) : U.url("contacto.html");

    document.title = p.name + " · " + p.brand + " · " + CFG.store.name;
    setMeta('meta[name="description"]', "content", p.name + " de " + p.brand + ". " + p.description + " Pídelo por WhatsApp en " + CFG.store.name + ".");
    setMeta('meta[property="og:title"]', "content", p.name + " · " + CFG.store.name);
    setMeta('meta[property="og:description"]', "content", p.description);

    $("[data-breadcrumb]").innerHTML =
      '<a href="' + U.url("index.html") + '">Inicio</a><span aria-hidden="true">/</span>' +
      '<a href="' + U.url("productos.html") + '">Productos</a><span aria-hidden="true">/</span>' +
      '<a href="' + Y.UI.catUrl(p.category) + '">' + esc(catName) + '</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(p.name) + "</span>";

    root.innerHTML =
      '<div class="pdp__media' + (Y.UI.isPhoto(p) ? " pdp__media--photo" : "") + '"><img src="' + esc(Y.UI.imgSrc(p)) + '" alt="' + esc(p.name + " – " + p.brand) + '" width="720" height="720" fetchpriority="high">' +
        '<span class="badges">' + (pct ? '<span class="badge badge--sale">-' + pct + "%</span>" : "") + (Y.UI.isNew(p) ? '<span class="badge badge--new">Nuevo</span>' : "") + "</span></div>" +
      '<div class="pdp__info">' +
        '<p class="pdp__brand"><a href="' + U.url("productos.html?brand=" + encodeURIComponent(p.brand)) + '">' + esc(p.brand) + "</a> · " +
          '<a href="' + Y.UI.catUrl(p.category) + '">' + esc(catName) + "</a>" + (p.subcategory ? " · " + esc(p.subcategory) : "") + "</p>" +
        "<h1>" + esc(p.name) + "</h1>" +
        '<p class="pdp__price"><strong>' + U.money(p.price) + "</strong>" + (pct ? ' <s class="old">' + U.money(p.oldPrice) + '</s> <span class="badge badge--sale">Ahorras ' + U.money(p.oldPrice - p.price) + "</span>" : "") + "</p>" +
        '<p class="stock stock--' + st.cls + '"><span class="dot" aria-hidden="true"></span>' + st.text + "</p>" +
        '<p class="pdp__desc">' + esc(p.description) + "</p>" +
        '<dl class="pdp__specs">' +
          (p.size ? "<div><dt>Contenido</dt><dd>" + esc(p.size) + "</dd></div>" : "") +
          "<div><dt>Marca</dt><dd>" + esc(p.brand) + "</dd></div>" +
          "<div><dt>Categoría</dt><dd>" + esc(catName) + "</dd></div></dl>" +
        '<div class="pdp__buy">' +
          '<div class="qty qty--lg" role="group" aria-label="Cantidad">' +
            '<button type="button" data-pdp-qty="-1" aria-label="Disminuir cantidad"' + (out ? " disabled" : "") + ">" + Y.UI.icon("minus", 18) + "</button>" +
            '<span class="qty__n" data-pdp-n aria-live="polite">1</span>' +
            '<button type="button" data-pdp-qty="1" aria-label="Aumentar cantidad"' + (out ? " disabled" : "") + ">" + Y.UI.icon("plus", 18) + "</button></div>" +
          '<button type="button" class="btn btn--primary btn--lg" data-add="' + esc(p.id) + '" data-qty-value="1" data-pdp-add' + (out ? " disabled" : "") + '><span class="btn__label">' + (out ? "Agotado" : "Agregar a la bolsa") + "</span></button>" +
        "</div>" +
        '<a class="btn btn--wa btn--block" href="' + esc(waHref) + '" target="_blank" rel="noopener" data-wa-product="' + esc(p.id) + '">' + Y.UI.icon("whatsapp", 20) + " Consultar disponibilidad por WhatsApp</a>" +
        '<ul class="pdp__trust">' +
          "<li>" + Y.UI.icon("chat", 18) + " Confirmamos disponibilidad, pago y entrega por WhatsApp</li>" +
          "<li>" + Y.UI.icon("shield", 18) + " Sin pagos con tarjeta en este sitio</li>" +
          '<li>' + Y.UI.icon("truck", 18) + ' <a href="' + U.url("pages/envios.html") + '">Información de envíos</a> · <a href="' + U.url("pages/cambios.html") + '">Cambios y devoluciones</a></li></ul>' +
      "</div>";

    var qty = 1, n = $("[data-pdp-n]"), add = $("[data-pdp-add]");
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pdp-qty]");
      if (!b) return;
      qty = Math.max(1, Math.min(maxQty, qty + parseInt(b.getAttribute("data-pdp-qty"), 10)));
      n.textContent = qty;
      add.setAttribute("data-qty-value", qty);
    });

    // Productos relacionados
    var rel = sortList(ALL.filter(function (x) { return x.id !== p.id && x.category === p.category; }), "destacados");
    if (rel.length < 4) rel = rel.concat(sortList(ALL.filter(function (x) { return x.id !== p.id && x.category !== p.category && x.featured; }), "destacados"));
    renderGrid($("[data-related]"), rel.slice(0, 4));

    // Datos estructurados (schema.org/Product)
    var origin = (CFG.store.siteUrl || "").replace(/\/$/, "");
    var abs = function (path) { return origin ? origin + "/" + path.replace(/^\//, "") : new URL(U.url(path), window.location.href).href; };
    var ld = {
      "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
      image: [abs(p.image)], brand: { "@type": "Brand", name: p.brand }, category: catName,
      offers: { "@type": "Offer", priceCurrency: "PEN", price: p.price.toFixed(2),
        availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        url: window.location.href.split("#")[0] },
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  Y.Pages = { home: initHome, products: initProducts, product: initProduct };
})();
