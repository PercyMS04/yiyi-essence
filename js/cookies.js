/* ==========================================================================
   YIYI ESSENCE · COOKIES Y ALMACENAMIENTO
   --------------------------------------------------------------------------
   Principio: discreto y honesto.
   · Necesarias (siempre activas, sin pedir permiso): carrito y la propia
     preferencia de cookies. Se guardan en el almacenamiento local del navegador.
   · Análisis y publicidad: HOY LA TIENDA NO LAS USA. Mientras en config.js
     cookies.analyticsEnabled / advertisingEnabled sean false, NO se muestra
     ningún aviso; solo existe el enlace "Preferencias de cookies" en el footer.
   · Si algún día activas analítica o publicidad (true en config.js), aparecerá
     una tarjeta pequeña, no bloqueante, con: Aceptar · Rechazar · Configurar.
     Tus scripts de terceros deben cargarse SOLO dentro de loadOptionalScripts().
   ========================================================================== */
(function () {
  "use strict";
  var Y = window.YIYI;
  var U = Y.U, CFG = window.YIYI_CONFIG;
  var KEY = "yiyi.consent.v1";

  function optionalCategories() {
    var c = CFG.cookies || {};
    return { analytics: !!c.analyticsEnabled, advertising: !!c.advertisingEnabled };
  }
  function hasOptional() { var o = optionalCategories(); return o.analytics || o.advertising; }

  function getConsent() {
    var v = U.storage.get(KEY, null);
    return v && typeof v === "object" ? v : null;
  }

  function setConsent(analytics, advertising) {
    var c = { necessary: true, analytics: !!analytics, advertising: !!advertising, ts: Date.now() };
    U.storage.set(KEY, c);
    onConsentChange(c);
    return c;
  }

  /* ---------------------------------------------------------------------
     PUNTO DE ENGANCHE: aquí (y solo aquí) se cargan herramientas opcionales.
     Ejemplo para Google Analytics (cuando realmente lo uses):
       if (consent.analytics) {
         var s = document.createElement("script");
         s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
         document.head.appendChild(s);
       }
     --------------------------------------------------------------------- */
  function onConsentChange(consent) {
    if (!consent) return;
    // if (consent.analytics) { ... }
    // if (consent.advertising) { ... }
    document.dispatchEvent(new CustomEvent("consent:change", { detail: consent }));
  }

  /* ------------------------------------------------------ Tarjeta discreta */
  var card, prefs;

  function closeCard() { if (card) { card.classList.remove("is-in"); setTimeout(function () { card && card.remove(); card = null; }, 250); } }

  function showCard() {
    if (card || !hasOptional()) return;
    card = document.createElement("div");
    card.className = "cookiecard";
    card.setAttribute("role", "region");
    card.setAttribute("aria-label", "Preferencias de cookies");
    card.innerHTML =
      '<p><strong>Cookies</strong> · Usamos las necesarias para que la tienda funcione. Las de ' +
      (optionalCategories().analytics ? "análisis" : "") + (optionalCategories().analytics && optionalCategories().advertising ? " y " : "") +
      (optionalCategories().advertising ? "publicidad" : "") +
      ' solo con tu permiso. <a href="' + U.url("pages/cookies.html") + '">Más información</a></p>' +
      '<div class="cookiecard__btns">' +
        '<button type="button" class="btn btn--primary btn--sm" data-cookie-accept>Aceptar</button>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-cookie-reject>Rechazar</button>' +
        '<button type="button" class="linkbtn" data-open-cookies>Configurar</button>' +
      "</div>";
    document.body.appendChild(card);
    requestAnimationFrame(function () { card.classList.add("is-in"); });
  }

  /* -------------------------------------------------- Panel de preferencias */
  function buildPrefs() {
    var o = optionalCategories(), cur = getConsent() || {};
    function row(id, title, desc, checked, locked, unavailable) {
      return (
        '<div class="prefrow"><div><h3>' + title + "</h3><p>" + desc + "</p></div>" +
        '<label class="switch"><input type="checkbox" id="pref-' + id + '"' + (checked ? " checked" : "") + (locked || unavailable ? " disabled" : "") +
        ' aria-label="' + title + '"><span class="switch__ui"></span></label></div>'
      );
    }
    if (prefs) prefs.remove();
    prefs = document.createElement("div");
    prefs.className = "modal modal--sm";
    prefs.id = "cookie-prefs";
    prefs.setAttribute("role", "dialog");
    prefs.setAttribute("aria-modal", "true");
    prefs.setAttribute("aria-labelledby", "prefs-title");
    prefs.hidden = true;
    prefs.innerHTML =
      '<div class="modal__panel"><div class="sheet__head"><h2 id="prefs-title">Preferencias de cookies</h2>' +
      '<button type="button" class="iconbtn" aria-label="Cerrar" data-close-layer>' + Y.UI.icon("close", 22) + "</button></div>" +
      '<div class="modal__body modal__body--single">' +
        '<p class="fineprint">Tú decides qué categorías opcionales permites. Puedes cambiarlo cuando quieras.</p>' +
        row("necessary", "Necesarias", "Hacen posible que la bolsa de compra y la navegación funcionen. Siempre activas; no requieren consentimiento.", true, true, false) +
        row("analytics", "Análisis", o.analytics ? "Estadísticas agregadas sobre cómo se usa el sitio para mejorarlo." : "La tienda no utiliza cookies de análisis actualmente.", !!cur.analytics, false, !o.analytics) +
        row("advertising", "Publicidad", o.advertising ? "Medición y personalización de publicidad." : "La tienda no utiliza cookies de publicidad actualmente.", !!cur.advertising, false, !o.advertising) +
        '<div class="prefbtns">' +
          '<button type="button" class="btn btn--primary" data-pref-save>Guardar preferencias</button>' +
          '<button type="button" class="btn btn--ghost" data-pref-reject>Solo necesarias</button>' +
        "</div>" +
        '<p class="fineprint"><a href="' + U.url("pages/cookies.html") + '">Leer la política de cookies</a></p>' +
      "</div></div>";
    document.body.appendChild(prefs);
    return prefs;
  }

  function openPrefs() {
    closeCard();
    Y.UI.openLayer(buildPrefs());
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-open-cookies]")) { e.preventDefault(); openPrefs(); return; }
    if (t.closest("[data-cookie-accept]")) { var o = optionalCategories(); setConsent(o.analytics, o.advertising); closeCard(); Y.UI.toast("Preferencias guardadas."); return; }
    if (t.closest("[data-cookie-reject]")) { setConsent(false, false); closeCard(); Y.UI.toast("Solo se usarán cookies necesarias."); return; }
    if (t.closest("[data-pref-save]")) {
      var a = prefs.querySelector("#pref-analytics"), d = prefs.querySelector("#pref-advertising");
      setConsent(a && a.checked, d && d.checked);
      Y.UI.closeAll(); Y.UI.toast("Preferencias guardadas.");
      return;
    }
    if (t.closest("[data-pref-reject]")) { setConsent(false, false); Y.UI.closeAll(); Y.UI.toast("Solo se usarán cookies necesarias."); }
  });

  function init() {
    var c = getConsent();
    if (c) onConsentChange(c);
    else if (hasOptional()) setTimeout(showCard, 1200); // aparece sin interrumpir
  }

  Y.Cookies = { init: init, get: getConsent, openPreferences: openPrefs };
})();
