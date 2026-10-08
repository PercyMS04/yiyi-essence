/* ==========================================================================
   YIYI ESSENCE · CARRUSEL
   --------------------------------------------------------------------------
   Carrusel reutilizable para banners (fundido) y tarjetas (deslizante).
     <div class="carousel" data-carousel="fade|slide" data-per-view="1,2,3">
       <div class="carousel__viewport"><ul class="carousel__track">
         <li class="carousel__slide">…</li>
       </ul></div>
     </div>
   · Cambia solo cada config.promo.autoplayMs (4 s por defecto)
   · Flechas laterales, puntos indicadores y botón de pausa (accesibilidad)
   · Desliza con el dedo; flechas ← → del teclado
   · Se detiene al pasar el mouse, al enfocar, con la pestaña oculta o fuera
     de pantalla, y no se mueve solo si el usuario pidió "reducir movimiento"
   ========================================================================== */
(function () {
  "use strict";
  var Y = window.YIYI, CFG = window.YIYI_CONFIG;
  var DELAY = Math.max(2500, Number(CFG.promo && CFG.promo.autoplayMs) || 4000);
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function Carousel(root) {
    var self = this;
    this.root = root;
    this.mode = root.getAttribute("data-carousel") === "slide" ? "slide" : "fade";
    this.viewport = root.querySelector(".carousel__viewport");
    this.track = root.querySelector(".carousel__track");
    this.slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    this.index = 0;
    this.timer = null;
    this.hover = false;
    this.focus = false;
    this.offscreen = false;
    this.userPaused = reduceMotion; // con "reducir movimiento" no avanza solo
    this.perViewList = (root.getAttribute("data-per-view") || "1").split(",").map(function (n) { return Math.max(1, parseInt(n, 10) || 1); });
    this.perView = 1;
    if (this.slides.length < 1) return;

    root.classList.add("carousel--" + this.mode, "is-ready");
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carrusel");
    this.slides.forEach(function (s, i) {
      s.setAttribute("role", "group");
      s.setAttribute("aria-roledescription", "diapositiva");
      s.setAttribute("aria-label", (i + 1) + " de " + self.slides.length);
    });

    this.buildControls();
    this.measure();
    this.go(0, true);
    this.bind();
    this.updatePlayState();
    this.schedule();
  }

  Carousel.prototype.maxIndex = function () {
    return this.mode === "fade" ? this.slides.length - 1 : Math.max(0, this.slides.length - this.perView);
  };

  Carousel.prototype.measure = function () {
    var w = window.innerWidth, list = this.perViewList;
    var pv = w >= 960 ? list[2] || list[list.length - 1] : w >= 640 ? list[1] || list[0] : list[0];
    this.perView = this.mode === "fade" ? 1 : pv;
    this.root.style.setProperty("--carousel-delay", DELAY + "ms");
    this.root.style.setProperty("--per-view", this.perView);
    if (this.index > this.maxIndex()) this.index = this.maxIndex();
    this.buildDots();
  };

  Carousel.prototype.buildControls = function () {
    var self = this, I = Y.UI.icon;
    function btn(cls, label, ic) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = cls;
      b.setAttribute("aria-label", label);
      b.innerHTML = I(ic, 22);
      return b;
    }
    this.prevBtn = btn("carousel__arrow carousel__arrow--prev", "Anterior", "chevL");
    this.nextBtn = btn("carousel__arrow carousel__arrow--next", "Siguiente", "chevR");
    this.prevBtn.addEventListener("click", function () { self.prev(true); });
    this.nextBtn.addEventListener("click", function () { self.next(true); });
    this.root.appendChild(this.prevBtn);
    this.root.appendChild(this.nextBtn);

    this.bar = document.createElement("div");
    this.bar.className = "carousel__bar";
    this.dotsEl = document.createElement("div");
    this.dotsEl.className = "carousel__dots";
    this.pauseBtn = btn("carousel__pause", "Pausar", "pause");
    this.pauseBtn.addEventListener("click", function () {
      self.userPaused = !self.userPaused;
      self.updatePlayState();
      self.schedule();
    });
    this.bar.appendChild(this.dotsEl);
    this.bar.appendChild(this.pauseBtn);
    this.root.appendChild(this.bar);
  };

  Carousel.prototype.buildDots = function () {
    var self = this, n = this.maxIndex() + 1;
    this.dotsEl.innerHTML = "";
    this.dots = [];
    this.bar.hidden = this.slides.length <= this.perView;
    this.prevBtn.hidden = this.nextBtn.hidden = this.slides.length <= this.perView;
    for (var i = 0; i < n; i++) {
      (function (i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "carousel__dot";
        d.setAttribute("aria-label", "Ir a la diapositiva " + (i + 1));
        d.addEventListener("click", function () { self.go(i, false, true); });
        self.dotsEl.appendChild(d);
        self.dots.push(d);
      })(i);
    }
  };

  Carousel.prototype.go = function (i, instant, byUser) {
    var max = this.maxIndex();
    this.index = i > max ? 0 : i < 0 ? max : i;
    var self = this, pv = this.perView;
    if (this.mode === "slide") {
      if (instant) this.track.style.transition = "none";
      this.track.style.transform = "translateX(" + (-this.index * (100 / pv)) + "%)";
      if (instant) { void this.track.offsetWidth; this.track.style.transition = ""; }
    }
    this.slides.forEach(function (s, k) {
      var on = self.mode === "fade" ? k === self.index : k >= self.index && k < self.index + pv;
      s.classList.toggle("is-active", k === self.index || (self.mode === "slide" && on));
      s.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) s.removeAttribute("inert"); else s.setAttribute("inert", "");
    });
    (this.dots || []).forEach(function (d, k) {
      if (k === self.index) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    if (byUser) this.schedule();
  };
  Carousel.prototype.next = function (byUser) { this.go(this.index + 1, false, byUser); };
  Carousel.prototype.prev = function (byUser) { this.go(this.index - 1, false, byUser); };

  Carousel.prototype.canRun = function () {
    return !this.userPaused && !this.hover && !this.focus && !this.offscreen && !document.hidden && this.slides.length > this.perView;
  };

  Carousel.prototype.schedule = function () {
    var self = this;
    clearTimeout(this.timer);
    this.root.classList.toggle("is-playing", this.canRun());
    if (!this.canRun()) return;
    this.timer = setTimeout(function () { self.next(false); self.schedule(); }, DELAY);
  };

  Carousel.prototype.updatePlayState = function () {
    var paused = this.userPaused;
    this.pauseBtn.setAttribute("aria-label", paused ? "Reanudar movimiento automático" : "Pausar movimiento automático");
    this.pauseBtn.innerHTML = Y.UI.icon(paused ? "play" : "pause", 18);
    this.track.setAttribute("aria-live", paused ? "polite" : "off");
  };

  Carousel.prototype.bind = function () {
    var self = this, root = this.root;

    root.addEventListener("mouseenter", function () { self.hover = true; self.schedule(); });
    root.addEventListener("mouseleave", function () { self.hover = false; self.schedule(); });
    root.addEventListener("focusin", function () { self.focus = true; self.schedule(); });
    root.addEventListener("focusout", function () { self.focus = false; self.schedule(); });
    document.addEventListener("visibilitychange", function () { self.schedule(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        self.offscreen = !en[0].isIntersecting;
        self.schedule();
      }, { threshold: 0.2 }).observe(root);
    }

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (e.target !== root) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); self.prev(true); }
      if (e.key === "ArrowRight") { e.preventDefault(); self.next(true); }
    });

    /* Deslizar con el dedo / mouse */
    var startX = 0, startY = 0, dragging = false, moved = false;
    this.viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      startX = e.clientX; startY = e.clientY; dragging = true; moved = false;
    });
    this.viewport.addEventListener("pointermove", function (e) {
      if (dragging && Math.abs(e.clientX - startX) > 8) moved = true;
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) { if (dx < 0) self.next(true); else self.prev(true); }
    }
    this.viewport.addEventListener("pointerup", end);
    this.viewport.addEventListener("pointercancel", function () { dragging = false; });
    /* Si arrastró, no abrir el enlace por accidente */
    this.viewport.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    this.viewport.addEventListener("dragstart", function (e) { e.preventDefault(); });

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { self.measure(); self.go(self.index, true); }, 120);
    });
  };

  function initAll() {
    var list = [];
    document.querySelectorAll("[data-carousel]").forEach(function (el) { list.push(new Carousel(el)); });
    return list;
  }

  Y.Carousel = { init: initAll, delay: DELAY };
})();
