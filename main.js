/*
  COMPOSICIÓN E INTERACCIONES · BIOFERIA 2027
  Lee window.BIOFERIA (content.js) y arma cada sección marcada con data-render.
*/
(function () {
  "use strict";

  const C = window.BIOFERIA;
  // "Reducir movimiento" lo elige la persona con el botón del pie; no se toma del sistema.
  const reduceMotion = { get matches() { return document.documentElement.classList.contains("menos-movimiento"); } };

  /* ---------- utilidades ---------- */

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Imagen o placeholder con el nombre del archivo que falta.
  function img(o, cls = "", extra = "") {
    if (!o || !o.src) {
      const archivo = (o && o.archivo) || "archivo pendiente";
      return `<div class="ph ${cls}" role="img" aria-label="${esc((o && o.alt) || "Imagen pendiente")}">
        <span class="ph__tag">Falta recurso</span><code>${esc(archivo)}</code></div>`;
    }
    const size = o.ancho ? ` width="${o.ancho}" height="${o.alto}"` : "";
    return `<img class="${cls}" src="${esc(o.src)}" alt="${esc(o.alt)}"${size} ${extra}>`;
  }

  const logo = (cls = "") => `<img class="logo ${cls}" src="${esc(C.logo.src)}" alt="${esc(C.logo.alt)}" width="155" height="28">`;

  const extLink = (href) => /^https?:/.test(href) ? ` target="_blank" rel="noopener"` : "";

  function ticketBtn(cls = "") {
    const t = C.acciones.entradas;
    if (t.href) return `<a class="btn btn--ticket ${cls}" href="${esc(t.href)}"${extLink(t.href)}>${esc(t.label)}</a>`;
    return `<button type="button" class="btn btn--ticket is-soon ${cls}" aria-disabled="true" data-soon>
      ${esc(t.label)} <span class="btn__soon">· ${esc(t.estado)}</span></button>`;
  }

  const exhibitorBtn = (cls = "") => {
    const e = C.acciones.expositor;
    return `<a class="btn btn--stand ${cls}" href="${esc(e.href)}"${extLink(e.href)}>${esc(e.label)}</a>`;
  };

  const eyebrow = (txt) => `<p class="eyebrow">${esc(txt)}</p>`;

  /* ---------- secciones ---------- */

  const R = {};

  R.header = () => `
    <div class="wrap header__bar">
      <a class="header__logo" href="#festival" aria-label="Bioferia, ir al inicio">${logo()}</a>
      <nav class="header__nav" aria-label="Principal">
        <ul>${C.nav.map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join("")}</ul>
      </nav>
      <button class="header__burger" type="button" aria-expanded="false" aria-controls="mobile-menu">
        <span class="sr-only">Abrir menú</span><span class="burger" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" hidden>
      <nav aria-label="Principal, móvil">
        <ul>${C.nav.map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join("")}</ul>
      </nav>
      <div class="mobile-menu__actions">${ticketBtn()}${exhibitorBtn()}</div>
    </div>`;

  // "El cambio / se ACTIVA": la palabra final es el lettering de la identidad (imagen ya coloreada).
  function lettering(l, cls = "") {
    if (!l) return "";
    return `<span class="sr-only">${esc(l.palabra)}</span><span class="lettering ${cls}" aria-hidden="true">` +
      `<img src="${esc(l.src)}" alt="" width="${l.ancho}" height="${l.alto}"></span>`;
  }

  const heroTitle = (h) => `
      <h1 class="hero__title" id="hero-title">
        <span class="hero__line">${esc(h.titulo[0])}</span>
        <span class="hero__line hero__line--mix"><span class="hero__se">${esc(h.titulo[1])}</span> ${lettering(h.lettering)}</span>
      </h1>`;

  R.hero = () => {
    const h = C.hero, m = C.meta;
    if (h.video) {
      const [de, a] = h.video.fundido || ["azul", "rosa"];
      document.querySelector('[data-render="hero"]').classList.add("hero--video");
      return `
    <div class="hero__media" aria-hidden="true">
      <video class="hero__video" muted loop playsinline preload="metadata" poster="${esc(window.matchMedia("(max-width: 767px)").matches && h.video.posterMobile ? h.video.posterMobile : h.video.poster)}">
        ${h.video.srcMobile ? `<source src="${esc(h.video.srcMobile)}" media="(max-width: 767px)" type="video/mp4">` : ""}
        <source src="${esc(h.video.src)}" type="video/mp4">
      </video>
      <div class="hero__fade" style="--de: var(--${de}); --a: var(--${a})"></div>
    </div>
    <div class="wrap hero__content">
      ${heroTitle(h)}
      <dl class="hero__facts">
        <div><dt class="sr-only">Edición</dt><dd class="hero__ed">${esc(m.edicion)}</dd></div>
        <div><dt class="sr-only">Fechas</dt><dd class="hero__date">${esc(m.fechas)}</dd></div>
        <div><dt class="sr-only">Lugar</dt><dd class="hero__place"><span class="pin" aria-hidden="true"></span>${esc(m.lugar)}, ${esc(m.ciudad)}</dd></div>
      </dl>
      <div class="hero__actions">${ticketBtn()}${exhibitorBtn()}</div>
    </div>
    <button type="button" class="hero__toggle" aria-pressed="false">
      <span class="hero__toggle-icon" aria-hidden="true"></span><span class="hero__toggle-label">Pausar video</span>
    </button>`;
    }
    return `
    <div class="wrap hero__grid">
      <div class="hero__text">
        ${heroTitle(h)}
        <dl class="hero__facts">
          <div><dt class="sr-only">Edición</dt><dd class="hero__ed">${esc(m.edicion)}</dd></div>
          <div><dt class="sr-only">Fechas</dt><dd class="hero__date">${esc(m.fechas)}</dd></div>
          <div><dt class="sr-only">Lugar</dt><dd class="hero__place">${esc(m.lugar)}, ${esc(m.ciudad)}</dd></div>
        </dl>
      </div>
      <figure class="hero__poster">
        <span class="shape shape--disc" aria-hidden="true"></span>
        ${img(h.afiche, "hero__img", 'fetchpriority="high"')}
      </figure>
      <div class="hero__actions">${ticketBtn()}${exhibitorBtn()}</div>
    </div>`;
  };

  R.presentacion = () => {
    const p = C.presentacion;
    return `
    <div class="wrap intro__grid">
      <figure class="intro__photo reveal">${img(p.foto, "cover")}</figure>
      <div class="intro__text reveal">
        <h2 class="h2" id="intro-title">${esc(p.titulo)}</h2>
        <p class="lead">${esc(p.texto)}</p>
        <p class="intro__remate">${esc(p.remate)}</p>
      </div>
    </div>
    <div class="franja" aria-label="Hacer, conectar, transformar, cuidar, celebrar">
      <img class="franja__organismo" src="${esc(C.graficas.organismo)}" alt="" aria-hidden="true" width="672" height="733">
      <ul class="franja__list" role="list">
        ${C.franja.map((f) => `
          <li class="franja__item bg-${f.color}">
            <span class="franja__verbo">${esc(f.verbo)}</span>
            <span class="franja__elem">${esc(f.elemento)}</span>
          </li>`).join("")}
      </ul>
    </div>`;
  };

  R.areas = () => {
    const a = C.areas;
    const palette = ["rojo"]; // las categorías son expositores: Fuego, como los stands
    return `
    <div class="wrap">
      <header class="sec-head reveal">
        ${eyebrow(a.etiqueta)}
        <h2 class="h2" id="areas-title">${esc(a.titulo)}</h2>
        <p class="sec-head__text">${esc(a.texto)}</p>
      </header>
      <div class="areas__grid">
        <div class="areas__map reveal">
          <button type="button" class="areas__mapbtn" data-open-map aria-label="Ampliar mapa del evento">
            ${img(a.mapa, "areas__img", 'loading="lazy"')}
          </button>
          <div class="areas__mapfoot">
            <button type="button" class="btn btn--dark btn--sm" data-open-map>Ampliar mapa</button>
            <div class="areas__refs">
              <h3 class="mini">Referencias del mapa</h3>
              <ul class="legend" role="list">${a.referencias.map((r) => `<li class="legend__item" style="--c: var(--${esc(r.color)})"><span class="legend__dot" aria-hidden="true"></span>${esc(r.t)}</li>`).join("")}</ul>
            </div>
          </div>
        </div>
        <div class="areas__cats reveal">
          <h3 class="mini">${a.categorias.length} categorías · el color marca dónde se vive</h3>
          <ol class="cats" id="cats-list" role="list" data-collapsed="true">
            ${a.categorias.map((c, i) => `
              <li class="cats__item"><span class="cats__n bg-${esc(c.color)}" aria-hidden="true">${i + 1}</span><span class="cats__name">${esc(c.n)}</span><span class="cats__lugar" style="--c: var(--${esc(c.color)})">${esc(c.lugar)}</span></li>`).join("")}
          </ol>
          <button type="button" class="cats__more" aria-expanded="false" aria-controls="cats-list" data-more="${a.categorias.length - 5}">
            Ver ${a.categorias.length - 5} áreas más
          </button>
        </div>
      </div>
    </div>`;
  };

  R.espacios = () => {
    const e = C.espacios;
    return `
    <div class="espacios__tex" aria-hidden="true">
      <img src="${esc(C.graficas.organismo)}" alt="" class="espacios__org espacios__org--a">
      <img src="${esc(C.graficas.organismo)}" alt="" class="espacios__org espacios__org--b">
    </div>
    <div class="wrap">
      <header class="sec-head reveal">
        ${eyebrow(e.etiqueta)}
        <h2 class="h2" id="espacios-title">${esc(e.titulo)}</h2>
        <p class="sec-head__text">${esc(e.texto)}</p>
      </header>
      <ul class="spaces" role="list">
        ${e.items.map((s, i) => `
          <li class="space space--${i + 1} reveal" style="--c: var(--${s.color})">
            <button type="button" class="space__btn" data-lightbox="${i}" aria-label="Ampliar imagen: ${esc(s.nombre)}">
              ${img(s, "cover", 'loading="lazy"')}
            </button>
            <div class="space__cap bg-${s.color}">
              <span class="space__n" aria-hidden="true">0${i + 1}</span>
              <h3 class="space__name">${esc(s.nombre)}</h3>
              <p class="space__desc">${esc(s.descripcion)}</p>
            </div>
          </li>`).join("")}
      </ul>
      <p class="espacios__nota">${esc(e.nota)}</p>
    </div>`;
  };

  R.experiencias = () => {
    const e = C.experiencias;
    return `
    <div class="wrap">
      <header class="exp__head reveal">
        <div>
          ${eyebrow(e.etiqueta)}
          <h2 class="h2" id="exp-title">${esc(e.titulo)}</h2>
        </div>
        <p class="exp__cifras">${e.cifras.map((c) => `<span>${esc(c)}</span>`).join("")}</p>
      </header>
      <div class="exp__grid">
        <div class="mosaic reveal">
          ${e.mosaico.map((f, i) => `<figure class="mosaic__item mosaic__item--${i + 1}">${img(f, "cover", 'loading="lazy"')}</figure>`).join("")}
        </div>
        <div class="exp__list reveal">
          <div class="acc">
            ${e.escenarios.map((s, i) => `
              <div class="acc__item" style="--c: var(--${s.color})">
                <h3 class="acc__h">
                  <button type="button" class="acc__btn" aria-expanded="${i === 1}" aria-controls="acc-p-${i}" id="acc-b-${i}">
                    <span class="acc__dot" aria-hidden="true"></span>
                    <span class="acc__name">${esc(s.nombre)}</span>
                    <span class="acc__icon" aria-hidden="true"></span>
                  </button>
                </h3>
                <div class="acc__panel" id="acc-p-${i}" role="region" aria-labelledby="acc-b-${i}" ${i === 1 ? "" : "hidden"}>
                  <p>${s.descripcion ? esc(s.descripcion) : '<span class="tbc">A confirmar</span>'}</p>
                </div>
              </div>`).join("")}
          </div>
          <p class="exp__note">${esc(e.notaProgramacion)}</p>
        </div>
      </div>
    </div>`;
  };

  R.gastronomia = () => {
    const g = C.gastronomia;
    return `
    <div class="gastro__grid">
      <div class="gastro__text reveal">
        ${eyebrow(g.etiqueta)}
        <h2 class="h2" id="gastro-title">${esc(g.titulo)}</h2>
        <p class="lead">${esc(g.texto)}</p>
        <ul class="tags" role="list">${g.perfiles.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <p class="gastro__remate">${esc(g.remate)}</p>
      </div>
      <figure class="gastro__photo">${img(g.foto, "cover", 'loading="lazy"')}</figure>
    </div>`;
  };

  R.impacto = () => {
    const im = C.impacto;
    return `
    <div class="wrap">
      <header class="sec-head reveal">
        ${eyebrow(im.etiqueta)}
        <h2 class="h2" id="impacto-title">${esc(im.titulo)}</h2>
      </header>
      <ul class="stats" role="list">
        ${im.cifras.map((s) => `
          <li class="stat reveal" style="--c: var(--${s.color})">
            <p class="stat__num"><span class="sr-only">${esc(s.valor)} ${esc(s.unidad)}</span><span aria-hidden="true"><span class="stat__val" data-count="${esc(s.valor)}">${esc(s.valor)}</span>${s.unidad ? `<span class="stat__unit">${esc(s.unidad)}</span>` : ""}</span></p>
            <p class="stat__txt">${esc(s.texto)}</p>
            <p class="stat__note">${esc(s.nota)}</p>
          </li>`).join("")}
      </ul>
    </div>
    <div class="commit">
      <div class="wrap commit__grid">
        <h3 class="commit__title reveal">${esc(im.compromisosTitulo)}</h3>
        <ol class="commit__list" role="list">
          ${im.compromisos.map((c, i) => `<li class="reveal"><span class="commit__n" aria-hidden="true">0${i + 1}</span>${esc(c)}</li>`).join("")}
        </ol>
      </div>
    </div>`;
  };

  R.region = () => {
    const r = C.region, o = r.organizacion;
    const logos = (arr) => arr.map((l) => `<li class="logos__item">${img(l, "", 'loading="lazy"')}</li>`).join("");
    return `
    <div class="wrap">
      <header class="sec-head reveal">
        ${eyebrow(r.etiqueta)}
        <h2 class="h2" id="region-title">${esc(r.titulo)}</h2>
      </header>
      <div class="region__grid">
        <div class="region__sedes reveal">
          <h3 class="mini">Sedes</h3>
          <ul class="sedes" role="list">
            ${r.sedes.map((s) => `
              <li class="sedes__item${s.actual ? " is-current" : ""}">
                <span class="sedes__pin" aria-hidden="true"></span>
                <span class="sedes__city">${esc(s.ciudad)}</span>
                <span class="sedes__country">${esc(s.pais)}${s.actual ? " · Edición 2027" : ""}</span>
              </li>`).join("")}
          </ul>
          <a class="link-arrow" href="${esc(r.sedesHref)}"${extLink(r.sedesHref)}>Bioferia por el mundo</a>
        </div>
        <div class="region__org reveal">
          <h3 class="mini">Detrás del festival</h3>
          <p class="region__orgtxt">${esc(o.texto)}</p>
          <div class="logos">
            <h4 class="logos__label">Organizan</h4>
            <ul class="logos__list" role="list">${logos(o.organizan)}</ul>
          </div>
          <div class="logos">
            <h4 class="logos__label">Anfitrión</h4>
            <ul class="logos__list" role="list">${logos(o.anfitrion)}</ul>
          </div>
        </div>
      </div>
    </div>`;
  };

  R.contacto = () => {
    const k = C.contacto;
    return `
    <div class="wrap contacto__grid">
      <div class="contacto__intro reveal">
        <h2 class="contacto__title" id="contacto-title">${esc(k.titulo)}</h2>
        <p class="lead">${esc(k.texto)}</p>
        ${img(k.grafica, "contacto__grafica", 'loading="lazy"')}
      </div>
      <form class="form reveal" id="contact-form" novalidate>
        <div class="form__row">
          <div class="field">
            <label for="f-nombre">Nombre</label>
            <input id="f-nombre" name="nombre" type="text" autocomplete="name" required>
          </div>
          <div class="field">
            <label for="f-correo">Correo</label>
            <input id="f-correo" name="correo" type="email" autocomplete="email" required>
          </div>
        </div>
        <div class="field">
          <label for="f-perfil">Perfil</label>
          <select id="f-perfil" name="perfil" required>
            <option value="">Elegí una opción</option>
            ${k.perfiles.map((p) => `<option>${esc(p)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="f-mensaje">Mensaje</label>
          <textarea id="f-mensaje" name="mensaje" rows="5" required></textarea>
        </div>
        ${k.endpoint ? "" : `<p class="form__demo" id="form-demo">${esc(k.avisoDemo)}</p>`}
        <button class="btn btn--dark btn--block" type="submit"${k.endpoint ? "" : ' aria-describedby="form-demo"'}>Enviar</button>
        <div class="form__status" role="status" aria-live="polite"></div>
      </form>
    </div>`;
  };

  R.footer = () => {
    const m = C.meta;
    return `
    <div class="wrap footer__closing">
      <p class="footer__big">${esc(C.hero.titulo[0])}<br>${esc(C.hero.titulo[1])} ${lettering(C.hero.lettering, "lettering--footer")}</p>
      <div class="footer__closing-cta">${ticketBtn()}${exhibitorBtn("btn--light")}</div>
    </div>
    <div class="wrap footer__grid">
      <div class="footer__brand">
        ${logo("logo--light")}
        <p>${esc(m.fechas)}<br>${esc(m.lugar)}, ${esc(m.ciudad)}</p>
      </div>
      <nav class="footer__col" aria-label="Secciones">
        <h2 class="footer__h">Secciones</h2>
        <ul role="list">${C.nav.map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join("")}</ul>
      </nav>
      <div class="footer__col">
        <h2 class="footer__h">Sedes</h2>
        <ul role="list">${C.region.sedes.map((s) => `<li>${esc(s.ciudad)}</li>`).join("")}</ul>
      </div>
      <div class="footer__col">
        <h2 class="footer__h">Contacto</h2>
        <ul role="list">
          <li>Prensa: <a href="mailto:${esc(m.correo)}">${esc(m.correo)}</a></li>
          <li><a href="${esc(C.acciones.expositor.href)}"${extLink(C.acciones.expositor.href)}>${esc(C.acciones.expositor.label)}</a></li>
        </ul>
        <h2 class="footer__h footer__h--gap">Redes</h2>
        <ul class="footer__social" role="list">
          ${C.redes.map((r) => `<li><a href="${esc(r.href)}"${extLink(r.href)}>${esc(r.red)}</a></li>`).join("")}
        </ul>
      </div>
    </div>
    <div class="wrap footer__legal"><p>© 2027 Bioferia · Producido por GrupoBio</p></div>`;
  };

  /* ---------- render ---------- */

  document.querySelectorAll("[data-render]").forEach((el) => {
    const fn = R[el.dataset.render];
    if (fn) el.innerHTML = fn();
  });

  /* ---------- header: menú móvil y estado al scrollear ---------- */

  const header = document.querySelector(".site-header");
  const burger = header.querySelector(".header__burger");
  const menu = header.querySelector("#mobile-menu");

  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.querySelector(".sr-only").textContent = open ? "Cerrar menú" : "Abrir menú";
    menu.hidden = !open;
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); }
  });
  window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Sección activa en la navegación.
  const navLinks = [...document.querySelectorAll(".header__nav a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => {
        if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  C.nav.forEach((n) => { const s = document.querySelector(n.href); if (s) spy.observe(s); });

  /* ---------- video de apertura ---------- */

  const video = document.querySelector(".hero__video");
  if (video) {
    const toggle = document.querySelector(".hero__toggle");
    const label = toggle.querySelector(".hero__toggle-label");
    const setPaused = (paused) => {
      toggle.setAttribute("aria-pressed", String(paused));
      label.textContent = paused ? "Reproducir video" : "Pausar video";
    };
    const play = () => video.play().then(() => setPaused(false)).catch(() => setPaused(true));
    // Con movimiento reducido el video no arranca solo: queda la imagen fija.
    if (reduceMotion.matches) setPaused(true); else play();
    toggle.addEventListener("click", () => {
      if (video.paused) play(); else { video.pause(); setPaused(true); }
    });
    // No gastar batería ni datos cuando la apertura no está en pantalla.
    new IntersectionObserver(([en]) => {
      if (toggle.getAttribute("aria-pressed") === "true") return;
      if (en.isIntersecting) video.play().catch(() => {}); else video.pause();
    }).observe(video);
  }

  /* ---------- entradas: aviso de "próximamente" ---------- */

  document.querySelectorAll("[data-soon]").forEach((b) => {
    b.addEventListener("click", () => {
      b.classList.remove("is-nudged"); void b.offsetWidth; b.classList.add("is-nudged");
      announce("Las entradas todavía no están a la venta. Próximamente.");
    });
  });

  const live = document.createElement("div");
  live.className = "sr-only"; live.setAttribute("aria-live", "polite");
  document.body.append(live);
  function announce(msg) { live.textContent = ""; setTimeout(() => (live.textContent = msg), 30); }

  /* ---------- áreas: ver más (móvil) ---------- */

  const more = document.querySelector(".cats__more");
  if (more) {
    const list = document.getElementById("cats-list");
    more.addEventListener("click", () => {
      const open = more.getAttribute("aria-expanded") !== "true";
      more.setAttribute("aria-expanded", String(open));
      list.dataset.collapsed = String(!open);
      more.textContent = open ? "Ver menos" : `Ver ${more.dataset.more} áreas más`;
    });
  }

  /* ---------- mapa ampliado ---------- */

  const dialog = document.getElementById("map-dialog");
  dialog.innerHTML = `
    <div class="map-dialog__bar">
      <h2 id="map-dialog-title" class="map-dialog__title">Mapa de Bioferia · ${esc(C.meta.lugar)}</h2>
      <button type="button" class="map-dialog__close" data-close-map>Cerrar<span aria-hidden="true"> ×</span></button>
    </div>
    <p class="map-dialog__hint">Deslizá para recorrer todo el mapa.</p>
    <div class="map-dialog__scroll" tabindex="0" aria-label="Mapa ampliado, desplazable">${img(C.areas.mapa, "map-dialog__img")}</div>`;

  document.querySelectorAll("[data-open-map]").forEach((b) => b.addEventListener("click", () => dialog.showModal()));
  dialog.querySelector("[data-close-map]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  /* ---------- visor de espacios ---------- */

  const lb = document.getElementById("lightbox");
  const spaces = C.espacios ? C.espacios.items : [];
  if (lb && spaces.length) {
    lb.innerHTML = `
      <div class="lightbox__bar">
        <h2 class="lightbox__title" id="lightbox-title"></h2>
        <button type="button" class="map-dialog__close" data-lb-close>Cerrar<span aria-hidden="true"> ×</span></button>
      </div>
      <figure class="lightbox__fig"><img class="lightbox__img" alt=""><figcaption class="lightbox__cap"></figcaption></figure>
      <div class="lightbox__nav">
        <button type="button" class="lightbox__arrow" data-lb="-1"><span aria-hidden="true">←</span> Anterior</button>
        <span class="lightbox__count" aria-live="polite"></span>
        <button type="button" class="lightbox__arrow" data-lb="1">Siguiente <span aria-hidden="true">→</span></button>
      </div>`;
    let cur = 0;
    const show = (i) => {
      cur = (i + spaces.length) % spaces.length;
      const s = spaces[cur];
      lb.querySelector(".lightbox__title").textContent = s.nombre;
      const im = lb.querySelector(".lightbox__img"); im.src = s.src; im.alt = s.alt;
      lb.querySelector(".lightbox__cap").textContent = `${s.descripcion} ${C.espacios.nota}`;
      lb.querySelector(".lightbox__count").textContent = `${cur + 1} de ${spaces.length}`;
      lb.style.setProperty("--c", `var(--${s.color})`);
    };
    document.querySelectorAll("[data-lightbox]").forEach((b) =>
      b.addEventListener("click", () => { show(+b.dataset.lightbox); lb.showModal(); }));
    lb.querySelectorAll("[data-lb]").forEach((b) => b.addEventListener("click", () => show(cur + +b.dataset.lb)));
    lb.querySelector("[data-lb-close]").addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
  }

  /* ---------- acordeón de escenarios ---------- */

  document.querySelectorAll(".acc__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      document.getElementById(btn.getAttribute("aria-controls")).hidden = !open;
    });
  });

  /* ---------- formulario ---------- */

  const form = document.getElementById("contact-form");
  const status = form.querySelector(".form__status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form__status";
    const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    if (invalid.length) {
      invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));
      invalid[0].focus();
      status.classList.add("is-error");
      status.textContent = "Revisá los campos marcados: todos son obligatorios y el correo debe ser válido.";
      return;
    }
    if (!C.contacto.endpoint) {
      // Modo demostración: no se envía nada ni se muestra una confirmación falsa.
      const d = Object.fromEntries(new FormData(form));
      const body = `Nombre: ${d.nombre}\nCorreo: ${d.correo}\nPerfil: ${d.perfil}\n\n${d.mensaje}`;
      const mailto = `mailto:${C.meta.correo}?subject=${encodeURIComponent("Contacto web · " + d.perfil)}&body=${encodeURIComponent(body)}`;
      status.classList.add("is-demo");
      status.innerHTML = `Tu mensaje <strong>no se envió</strong>: este formulario es una demostración. Podés escribirnos directamente a <a href="${esc(mailto)}">${esc(C.meta.correo)}</a>.`;
      return;
    }
    // Con servicio conectado: completar el envío real (fetch a C.contacto.endpoint).
  });

  /* ---------- aparición suave al entrar en pantalla ---------- */

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  // Las cifras cuentan hacia arriba una sola vez al entrar en pantalla.
  const counters = document.querySelectorAll(".stat__val[data-count]");
  if (counters.length && !reduceMotion.matches && "IntersectionObserver" in window) {
    const fmt = new Intl.NumberFormat("es-AR");
    const run = (el) => {
      const raw = el.dataset.count;
      const prefix = raw.startsWith("+") ? "+" : "";
      const target = parseInt(raw.replace(/\D/g, ""), 10);
      const t0 = performance.now(), dur = 1100;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = p < 1 ? prefix + fmt.format(Math.round(target * eased)) : raw;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  // El organismo entra a la franja una sola vez; al tocar cada color, el color cambia (mix-blend).
  const franja = document.querySelector(".franja");
  if (franja && !reduceMotion.matches && "IntersectionObserver" in window) {
    const fo = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { franja.classList.add("is-in"); fo.disconnect(); }
    }, { threshold: 0.4 });
    fo.observe(franja);
  } else if (franja) {
    franja.classList.add("is-in");
  }
})();
