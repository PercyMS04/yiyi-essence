/* ==========================================================================
   YIYI ESSENCE · ARRANQUE
   Aplica la configuración, construye los componentes comunes y activa el
   comportamiento de cada página según <body data-page="...">.
   ========================================================================== */
(function () {
  "use strict";
  var Y = window.YIYI, CFG = window.YIYI_CONFIG;

  function applyTheme() {
    var root = document.documentElement;
    Object.keys(CFG.theme || {}).forEach(function (k) { root.style.setProperty(k, CFG.theme[k]); });
  }

  /* Canonical / og:url / og:image con "__SITE_URL__": se completan con config.store.siteUrl
     (o se quitan si aún no hay dominio, para no publicar enlaces inválidos). */
  function fixSiteUrlTags() {
    var site = (CFG.store.siteUrl || "").replace(/\/$/, "");
    document.querySelectorAll('link[rel="canonical"],meta[property="og:url"],meta[property="og:image"],meta[name="twitter:image"]').forEach(function (el) {
      var attr = el.tagName === "LINK" ? "href" : "content";
      var v = el.getAttribute(attr) || "";
      if (v.indexOf("__SITE_URL__") === -1) return;
      if (site) el.setAttribute(attr, v.replace("__SITE_URL__", site));
      else el.remove();
    });
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) {
      if (s.textContent.indexOf("__SITE_URL__") === -1) return;
      if (site) s.textContent = s.textContent.split("__SITE_URL__").join(site); else s.remove();
    });
  }

  /* FAQPage (schema.org) generado a partir de las preguntas visibles de la página */
  function faqSchema() {
    var items = document.querySelectorAll("[data-faq] details");
    if (!items.length) return;
    var ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] };
    items.forEach(function (d) {
      var q = d.querySelector("summary"), a = d.querySelector(".faq__a");
      if (q && a) ld.mainEntity.push({ "@type": "Question", name: q.textContent.trim(), acceptedAnswer: { "@type": "Answer", text: a.textContent.replace(/\s+/g, " ").trim() } });
    });
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  /* Iconos declarativos: <span data-icon="truck" data-size="22"></span> */
  function inlineIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      var size = parseInt(el.getAttribute("data-size"), 10) || 20;
      el.insertAdjacentHTML("afterend", Y.UI.icon(el.getAttribute("data-icon"), size));
      el.remove();
    });
  }

  /* Enlaces al Libro de Reclamaciones (solo si hay URL en config) */
  function claimsLinks() {
    var url = (CFG.legal && CFG.legal.claimsBookUrl) || "";
    document.querySelectorAll("[data-claims-link]").forEach(function (a) {
      if (url) a.setAttribute("href", url); else a.removeAttribute("href");
    });
  }

  /* Formulario de contacto: arma el mensaje y abre WhatsApp. No guarda nada. */
  function contactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    function setError(name, msg) {
      var el = form.querySelector('[data-error-for="' + name + '"]');
      var input = form.elements[name];
      if (el) el.textContent = msg || "";
      if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var msg = form.elements.message.value.trim();
      setError("name", name ? "" : "Escribe tu nombre.");
      setError("message", msg ? "" : "Escribe tu mensaje.");
      if (!name || !msg) return;
      if (!Y.WhatsApp.isConfigured()) {
        Y.UI.toast("Modo demostración: configura el número de WhatsApp en js/config.js.", { type: "warn", duration: 4500 });
        return;
      }
      var text = "Hola, " + CFG.store.name + ". Soy " + name + ".\n\n" + msg;
      window.open(Y.WhatsApp.link(text), "_blank", "noopener");
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn();
  }

  ready(function () {
    applyTheme();
    fixSiteUrlTags();
    Y.UI.init();
    Y.Cookies.init();

    var page = document.body.getAttribute("data-page");
    if (page === "home") Y.Pages.home();
    if (page === "products") Y.Pages.products();
    if (page === "product") Y.Pages.product();
    if (page === "faq") faqSchema();

    // Iconos declarativos en el HTML estático
    inlineIcons(document);

    // Franja superior rotativa, barra fija móvil, franja de servicios y efectos
    if (Y.Promo) Y.Promo.init();
    // Carruseles (banners y tarjetas) solo si la página los tiene
    if (Y.Carousel) Y.Carousel.init();
    claimsLinks();
    contactForm();

    // Los textos de config dentro de contenido generado (tarjetas, etc.)
    Y.UI.applyConfigToDom(document);

    // Año automático
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // Enlace directo a una sección (#ia, #categorias): re-posiciona tras renderizar
    if (window.location.hash) {
      var t = document.getElementById(window.location.hash.slice(1));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 60);
    }
  });
})();