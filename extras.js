/*
  EXTRAS · BIOFERIA 2027
  Galería con filtros y visor, cinta de fotos, barra de progreso,
  puntos de navegación por sección, parallax suave y botón de volver arriba.
  Se carga después de main.js y lee window.BIOFERIA.galeria (content.js).
*/
(function () {
  "use strict";

  const C = window.BIOFERIA;
  const G = C && C.galeria;
  const reduceMotion = document.documentElement.classList.contains("menos-movimiento");
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Color por significado (catalizador del mapa): stands/gastronomía = rojo, predio abierto = celeste, escenarios = rosa.
  const catColor = { stands: "rojo", gastro: "rojo", predio: "turquesa" };
  const secColor = { festival: "rosa", areas: "rojo", espacios: "turquesa", galeria: "rojo", videos: "rosa", experiencias: "rosa", impacto: "amarillo", region: "azul", contacto: "turquesa", app: "turquesa" };

  /* ---------- cinta de verbos (lenguaje gráfico de la marca) después del hero ---------- */

  const heroSec = document.getElementById("festival");
  if (heroSec) {
    const verbs = [
      ["hacer", "Hacer", "rojo"], ["conectar", "Conectar", "turquesa"], ["transformar", "Transformar", "azul"],
      ["cuidar", "Cuidar", "amarillo"], ["celebrar", "Celebrar", "rosa"],
    ];
    const one = verbs.map(([f, n, c]) => `<li class="ticker__item bg-${c}"><img src="assets/graficas/palabras/${f}.png" alt="${n}" height="34" draggable="false"></li><li class="ticker__sep" aria-hidden="true"><img src="${esc(C.graficas.organismo)}" alt="" draggable="false"></li>`).join("");
    const t = document.createElement("section");
    t.className = "ticker";
    t.setAttribute("aria-label", "Hacer, conectar, transformar, cuidar, celebrar");
    t.innerHTML = `<ul class="ticker__row" role="list">${one}${one}${one}</ul>`;
    heroSec.after(t);
  }

  /* ---------- campaña: afiches en abanico (identidad gráfica) ---------- */

  const introSec = document.querySelector(".intro");
  if (introSec) {
    const posters = [
      { src: "assets/afiches/post-tu-basura.jpg", alt: "Post «Tu basura termina acá»", verbo: "Hacer", elem: "Fuego", color: "rojo" },
      { src: "assets/afiches/afiche-aire.jpg", alt: "Afiche Bioferia 2027, serie Aire", verbo: "Conectar", elem: "Aire", color: "turquesa" },
      { src: "assets/afiches/afiche-agua.jpg", alt: "Afiche Bioferia 2027, serie Agua", verbo: "Transformar", elem: "Agua", color: "azul" },
      { src: "assets/afiches/afiche-tierra.jpg", alt: "Afiche Bioferia 2027, serie Tierra", verbo: "Cuidar", elem: "Tierra", color: "amarillo" },
      { src: "assets/afiches/afiche-celebrar-2.jpg", alt: "Afiche Bioferia 2027, serie Celebrar", verbo: "Celebrar", elem: "Corazón", color: "rosa" },
    ];
    const s = document.createElement("section");
    s.className = "campana";
    s.id = "identidad";
    s.setAttribute("aria-labelledby", "campana-title");
    s.innerHTML = `
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">La campaña</p>
          <h2 class="h2" id="campana-title">Un festival que se mira como se siente.</h2>
          <p class="sec-head__text">Cada elemento tiene su color, su criatura y su afiche. Pasá el mouse o deslizá para recorrerlos.</p>
        </header>
        <ul class="fan reveal" role="list">
          ${posters.map((p, i) => `
            <li class="fan__item" style="--i: ${i}; --c: var(--${p.color})">
              <figure>
                <img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" draggable="false">
                <figcaption class="bg-${p.color}"><strong>${esc(p.verbo)}</strong><span>${esc(p.elem)}</span></figcaption>
              </figure>
            </li>`).join("")}
        </ul>
      </div>`;
    introSec.after(s);
  }

  /* ---------- contador regresivo en el hero ---------- */

  const START = new Date("2027-04-09T11:00:00-03:00").getTime();
  const END = new Date("2027-04-11T18:00:00-03:00").getTime();
  const heroFacts = document.querySelector(".hero__facts");
  if (heroFacts) {
    const box = document.createElement("div");
    box.className = "count";
    box.setAttribute("role", "timer");
    box.innerHTML = `
      <p class="count__lead">Faltan</p>
      <ul class="count__grid" role="list">
        ${["Días", "Horas", "Min", "Seg"].map((u) => `<li class="count__cell"><span class="count__n" data-u="${u}">00</span><span class="count__u">${u}</span></li>`).join("")}
      </ul>
      <p class="count__msg" hidden></p>`;
    heroFacts.after(box);
    const nums = box.querySelectorAll(".count__n");
    const grid = box.querySelector(".count__grid"), lead = box.querySelector(".count__lead"), msg = box.querySelector(".count__msg");
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const now = Date.now(), left = START - now;
      if (left <= 0) {
        grid.hidden = lead.hidden = true; msg.hidden = false;
        msg.textContent = now <= END ? "¡Bioferia está pasando ahora!" : "Gracias por vivir Bioferia 2027.";
        return;
      }
      const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60, s = Math.floor(left / 1e3) % 60;
      [d, h, m, s].forEach((v, i) => { const t = i === 0 ? String(v) : pad(v); if (nums[i].textContent !== t) nums[i].textContent = t; });
      box.setAttribute("aria-label", `Faltan ${d} días y ${h} horas para Bioferia`);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- agenda por día ---------- */

  const AG = C && C.agenda;
  const agSec = document.querySelector('[data-render="agenda"]');
  if (AG && agSec) {
    const toMin = (h) => { const [a, b] = h.split(":"); return +a * 60 + +b; };
    // Hora de Buenos Aires (GMT-3), sin depender de la zona del visitante.
    const ba = new Date(Date.now() - 3 * 36e5);
    const today = ba.toISOString().slice(0, 10), nowMin = ba.getUTCHours() * 60 + ba.getUTCMinutes();
    let first = Math.max(0, AG.dias.findIndex((d) => d.fecha === today));
    agSec.innerHTML = `
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">${esc(AG.etiqueta)}</p>
          <h2 class="h2" id="agenda-title">${esc(AG.titulo)}</h2>
          <p class="sec-head__text">${esc(AG.texto)}</p>
        </header>
        <div class="ag reveal">
          <div class="ag__tabs" role="tablist" aria-label="Días del festival">
            ${AG.dias.map((d, i) => `
              <button type="button" role="tab" class="ag__tab" id="ag-t-${i}" aria-controls="ag-p" aria-selected="${i === first}" style="--c: var(--${d.color})">
                <span class="ag__num">${esc(d.dia)}</span>
                <span class="ag__mes">Abril</span>
                <span class="ag__verbo">${esc(d.corto || d.palabra.trim())}</span>
              </button>`).join("")}
          </div>
          <div class="ag__panel" id="ag-p" role="tabpanel" tabindex="0"></div>
        </div>
        <p class="ag__nota">${esc(AG.nota)}</p>
      </div>`;
    const panel = agSec.querySelector("#ag-p"), tabs = [...agSec.querySelectorAll(".ag__tab")];
    const paint = (i) => {
      const d = AG.dias[i], live = d.fecha === today;
      const idxNow = live ? d.items.reduce((acc, it, k) => (toMin(it.h) <= nowMin ? k : acc), -1) : -1;
      panel.setAttribute("aria-labelledby", "ag-t-" + i);
      panel.style.setProperty("--c", `var(--${d.color})`);
      panel.dataset.day = d.color;
      panel.innerHTML = `
        <h3 class="ag__title"><span class="ag__big">${esc(d.dia)}</span><span><em>${esc(d.palabra)}</em>${esc(d.resto)}<small> · Abril</small></span></h3>
        <ol class="ag__list" role="list">
          ${d.items.map((it, k) => `
            <li class="ag__item${it.destacado ? " is-key" : ""}${k === idxNow ? " is-now" : ""}">
              <time class="ag__hora" datetime="${esc(it.h)}">${esc(it.h.replace(":00", ""))}<i>hs</i></time>
              <div class="ag__body"><strong>${esc(it.t)}</strong><span>${esc(it.d)}</span></div>
              ${k === idxNow ? '<span class="ag__ahora">Ahora</span>' : ""}
            </li>`).join("")}
        </ol>`;
    };
    const select = (i) => { tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; }); paint(i); };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length; select(n); tabs[n].focus();
      });
    });
    select(first);
    const note = document.querySelector(".exp__note");
    if (note) note.innerHTML = 'Mirá la <a href="#agenda">agenda día por día</a>.';
  }

  /* ---------- catalizadores: reemplaza la franja de colores por paneles que se abren ---------- */

  const oldFranja = document.querySelector(".franja");
  const K = C && C.franja, KT = C && C.catalizadores;
  if (oldFranja && K && K[0].sentido) {
    const cat = document.createElement("div");
    cat.className = "cats5";
    cat.innerHTML = `
      <img class="cats5__org" src="${esc(C.graficas.organismo)}" alt="" aria-hidden="true">
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">${esc(KT.etiqueta)}</p>
          <h2 class="h2" id="cats5-title">${esc(KT.titulo)}</h2>
          <p class="sec-head__text">${esc(KT.texto)}</p>
        </header>
        <ul class="cats5__list reveal" role="list">
          ${K.map((k, i) => `
            <li class="cat5 bg-${esc(k.color)}" data-open="${i === 0}" style="--cc: var(--${esc(k.color)}); --img: url('${esc(k.img)}')">
              <span class="cat5__photo" aria-hidden="true"></span><span class="cat5__tint" aria-hidden="true"></span><span class="cat5__shapes" aria-hidden="true"></span>
              <button type="button" class="cat5__btn" aria-expanded="${i === 0}" aria-controls="cat5-p-${i}" id="cat5-b-${i}">
                <span class="cat5__verbo">${esc(k.verbo)}</span>
                <span class="cat5__elem">${esc(k.elemento)}</span>
              </button>
              <div class="cat5__panel" id="cat5-p-${i}" role="region" aria-labelledby="cat5-b-${i}">
                <p class="cat5__sentido">${esc(k.sentido)}</p>
                <p class="cat5__donde"><span>Lo vivís en</span><strong>${esc(k.donde)}</strong></p>
                <p class="cat5__det">${esc(k.detalle)}</p>
                <button type="button" class="cat5__map" data-map>Ver en el mapa →</button>
              </div>
            </li>`).join("")}
        </ul>
      </div>`;
    oldFranja.replaceWith(cat);
    const items = [...cat.querySelectorAll(".cat5")];
    const setOpen = (it) => items.forEach((o) => {
      const on = o === it;
      o.dataset.open = String(on);
      o.querySelector(".cat5__btn").setAttribute("aria-expanded", String(on));
    });
    items.forEach((it) => {
      it.querySelector(".cat5__btn").addEventListener("click", () => setOpen(it));
      it.addEventListener("mouseenter", () => { if (matchMedia("(hover: hover) and (min-width: 860px)").matches) setOpen(it); });
    });
    cat.querySelectorAll("[data-map]").forEach((b) => b.addEventListener("click", () => {
      const m = document.querySelector("[data-open-map]"); if (m) m.click();
    }));
  }

  /* ---------- galería ---------- */

  const sec = document.querySelector('[data-render="galeria"]');
  if (G && sec) {
    sec.innerHTML = `
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">${esc(G.etiqueta)}</p>
          <h2 class="h2" id="galeria-title">${esc(G.titulo)}</h2>
          <p class="sec-head__text">${esc(G.texto)}</p>
        </header>
        <div class="gal__bar reveal">
          <div class="gal__tabs" role="tablist" aria-label="Categorías de fotos">
            ${G.cats.map((c, i) => `
              <button type="button" role="tab" class="gal__tab${catColor[c.id] ? " bg-" + catColor[c.id] : ""}" data-cat="${esc(c.id)}" aria-selected="${i === 0}">${esc(c.label)}</button>`).join("")}
          </div>
          <div class="gal__arrows">
            <button type="button" class="gal__arrow" data-dir="-1" aria-label="Fotos anteriores">←</button>
            <button type="button" class="gal__arrow" data-dir="1" aria-label="Fotos siguientes">→</button>
          </div>
        </div>
      </div>
      <div class="gal__track" tabindex="0" aria-label="Galería de fotos, desplazable"></div>
      <div class="wrap"><p class="gal__nota">${esc(G.nota)}</p></div>`;

    const track = sec.querySelector(".gal__track");
    let list = G.items;

    const paint = () => {
      track.innerHTML = list.map((it, i) => `
        <figure class="gal__card" style="--c: var(--${catColor[it.cat] || "rosa"})">
          <button type="button" class="gal__btn" data-i="${i}" aria-label="Ver foto grande: ${esc(it.cap)}">
            <img src="${esc(it.src)}" alt="${esc(it.alt)}" loading="lazy" draggable="false">
            <figcaption><span>${esc(it.cap)}</span></figcaption>
          </button>
        </figure>`).join("");
      track.scrollTo({ left: 0 });
      updateArrows();
    };

    const arrows = sec.querySelectorAll(".gal__arrow");
    function updateArrows() {
      const max = track.scrollWidth - track.clientWidth - 4;
      arrows[0].disabled = track.scrollLeft <= 4;
      arrows[1].disabled = track.scrollLeft >= max;
    }
    track.addEventListener("scroll", () => requestAnimationFrame(updateArrows), { passive: true });
    arrows.forEach((a) => a.addEventListener("click", () => {
      track.scrollBy({ left: +a.dataset.dir * track.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
    }));

    sec.querySelectorAll(".gal__tab").forEach((t) => t.addEventListener("click", () => {
      sec.querySelectorAll(".gal__tab").forEach((x) => x.setAttribute("aria-selected", String(x === t)));
      list = t.dataset.cat === "todo" ? G.items : G.items.filter((i) => i.cat === t.dataset.cat);
      paint();
    }));

    // Arrastrar con el mouse para recorrer; si hubo arrastre no se abre el visor.
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; track.classList.add("is-drag"); }
      track.scrollLeft = sl - dx;
    });
    window.addEventListener("pointerup", () => { down = false; track.classList.remove("is-drag"); });
    track.addEventListener("click", (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; return; }
      const b = e.target.closest(".gal__btn");
      if (b) open(+b.dataset.i);
    }, true);

    /* visor */
    const dlg = document.createElement("dialog");
    dlg.className = "lightbox gal__lb";
    dlg.setAttribute("aria-labelledby", "gal-lb-title");
    dlg.innerHTML = `
      <div class="lightbox__bar">
        <h2 class="lightbox__title" id="gal-lb-title"></h2>
        <button type="button" class="map-dialog__close" data-x>Cerrar<span aria-hidden="true"> ×</span></button>
      </div>
      <figure class="lightbox__fig"><img class="lightbox__img" alt=""><figcaption class="lightbox__cap"></figcaption></figure>
      <div class="lightbox__nav">
        <button type="button" class="lightbox__arrow" data-d="-1"><span aria-hidden="true">←</span> Anterior</button>
        <span class="lightbox__count" aria-live="polite"></span>
        <button type="button" class="lightbox__arrow" data-d="1">Siguiente <span aria-hidden="true">→</span></button>
      </div>`;
    document.body.append(dlg);
    let cur = 0;
    const show = (i) => {
      cur = (i + list.length) % list.length;
      const it = list[cur];
      dlg.querySelector(".lightbox__title").textContent = it.cap;
      const im = dlg.querySelector(".lightbox__img"); im.src = it.src; im.alt = it.alt;
      dlg.querySelector(".lightbox__cap").textContent = G.nota;
      dlg.querySelector(".lightbox__count").textContent = `${cur + 1} de ${list.length}`;
      dlg.style.setProperty("--c", `var(--${catColor[it.cat] || "rosa"})`);
    };
    function open(i) { show(i); dlg.showModal(); }
    dlg.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => show(cur + +b.dataset.d)));
    dlg.querySelector("[data-x]").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
    let tx = 0;
    dlg.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    });

    paint();
  }

  /* ---------- videos: reproducción a pedido, uno solo a la vez ---------- */

  const V = C && C.videos;
  const vsec = document.querySelector('[data-render="videos"]');
  if (V && vsec) {
    vsec.innerHTML = `
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">${esc(V.etiqueta)}</p>
          <h2 class="h2" id="videos-title">${esc(V.titulo)}</h2>
          <p class="sec-head__text">${esc(V.texto)}</p>
        </header>
        <div class="vid__grid">
          ${V.items.map((v) => `
            <figure class="vid reveal" style="--c: var(--${v.color})">
              <div class="vid__frame">
                <video class="vid__el" preload="metadata" playsinline ${v.poster ? `poster="${esc(v.poster)}"` : ""}>
                  <source src="${esc(v.src)}#t=0.1" type="video/mp4">
                </video>
                <button type="button" class="vid__play" aria-label="Reproducir: ${esc(v.titulo)}"><span aria-hidden="true"></span></button>
              </div>
              <figcaption><strong>${esc(v.titulo)}</strong><span>${esc(v.detalle)}</span></figcaption>
            </figure>`).join("")}
        </div>
      </div>`;
    const vids = [...vsec.querySelectorAll(".vid")];
    vids.forEach((fig) => {
      const el = fig.querySelector("video"), btn = fig.querySelector(".vid__play");
      btn.addEventListener("click", () => {
        vids.forEach((o) => { const x = o.querySelector("video"); if (x !== el) x.pause(); });
        el.controls = true; el.muted = false;
        el.play().catch(() => {});
      });
      el.addEventListener("play", () => fig.classList.add("is-playing"));
      el.addEventListener("ended", () => { fig.classList.remove("is-playing"); el.controls = false; });
    });
    // El video del hero se pausa mientras se mira otro con sonido.
    vsec.addEventListener("play", (e) => { const h = document.querySelector(".hero__video"); if (h && e.target !== h) h.pause(); }, true);
  }

  /* ---------- apps: QR, botón y prueba en un celular ---------- */

  const A = C && C.apps;
  const asec = document.querySelector('[data-render="apps"]');
  if (A && asec) {
    asec.innerHTML = `
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">${esc(A.etiqueta)}</p>
          <h2 class="h2" id="apps-title">${esc(A.titulo)}</h2>
          <p class="sec-head__text">${esc(A.texto)}</p>
        </header>
        <div class="apps__grid">
          ${A.items.map((a) => `
            <article class="app reveal" style="--c: var(--${a.color})">
              <div class="app__tag bg-${a.color}">${esc(a.etiqueta)}</div>
              <div class="app__body">
                <div class="app__info">
                  <h3 class="app__title">${esc(a.titulo)}</h3>
                  <p>${esc(a.descripcion)}</p>
                  <ul class="app__list" role="list">${a.puntos.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
                  <div class="app__actions">
                    <a class="btn btn--dark" href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.boton)}</a>
                    <button type="button" class="btn btn--outline" data-try="${esc(a.id)}">Probarla acá</button>
                  </div>
                </div>
                <div class="app__stage">
                  <button type="button" class="phone-mock" data-try="${esc(a.id)}" aria-label="Probar ${esc(a.titulo)} en un celular">
                    <span class="phone-mock__screen"><img src="${esc(a.shot)}" alt="Pantalla de ${esc(a.titulo)}" width="430" height="928" loading="lazy" draggable="false"></span>
                    <span class="phone-mock__hint">Tocá para probar</span>
                  </button>
                  <figure class="app__qr">
                    <img src="${esc(a.qr)}" alt="Código QR para abrir ${esc(a.titulo)}" width="220" height="220" loading="lazy">
                    <figcaption>Escaneá con la cámara</figcaption>
                  </figure>
                </div>
              </div>
            </article>`).join("")}
        </div>
      </div>`;

    const phone = document.createElement("dialog");
    phone.className = "phone-dlg";
    phone.setAttribute("aria-labelledby", "phone-title");
    phone.innerHTML = `
      <div class="phone">
        <div class="phone__bar"><h2 id="phone-title"></h2><button type="button" class="map-dialog__close" data-x>Cerrar<span aria-hidden="true"> ×</span></button></div>
        <div class="phone__screen"><iframe title="" loading="lazy" allow="geolocation; clipboard-write"></iframe></div>
        <a class="phone__open" target="_blank" rel="noopener">Abrir en pantalla completa</a>
      </div>`;
    document.body.append(phone);
    const frame = phone.querySelector("iframe");
    asec.querySelectorAll("[data-try]").forEach((b) => b.addEventListener("click", () => {
      const a = A.items.find((x) => x.id === b.dataset.try);
      phone.querySelector("#phone-title").textContent = a.titulo;
      frame.title = a.titulo; frame.src = a.url;
      phone.querySelector(".phone__open").href = a.url;
      phone.style.setProperty("--c", `var(--${a.color})`);
      phone.showModal();
    }));
    const closePhone = () => { phone.close(); frame.src = "about:blank"; };
    phone.querySelector("[data-x]").addEventListener("click", closePhone);
    phone.addEventListener("click", (e) => { if (e.target === phone) closePhone(); });
    phone.addEventListener("cancel", () => { frame.src = "about:blank"; });
  }

  /* ---------- cinta de fotos que corre sola (antes de contacto) ---------- */

  const contacto = document.getElementById("contacto");
  if (G && contacto) {
    const pics = G.items.filter((_, i) => i % 2 === 0).slice(0, 10);
    const row = pics.map((p) => `<li><img src="${esc(p.src)}" alt="" loading="lazy" draggable="false"></li>`).join("");
    const band = document.createElement("section");
    band.className = "cinta";
    band.setAttribute("aria-label", "Fotos de Bioferia");
    band.innerHTML = `
      <p class="cinta__txt reveal">Que no te lo cuenten. <strong>Vení a vivirlo.</strong></p>
      <div class="cinta__view" aria-hidden="true"><ul class="cinta__row">${row}${row}</ul></div>`;
    contacto.before(band);
    band.querySelector(".cinta__row").style.setProperty("--n", pics.length);
  }

  /* ---------- contacto: perfiles como chips que completan el formulario ---------- */

  const sel = document.getElementById("f-perfil");
  const lead = document.querySelector(".contacto__intro .lead");
  if (sel && lead && C.contacto.perfiles) {
    const chips = document.createElement("div");
    chips.className = "perfiles";
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "Elegí tu perfil");
    chips.innerHTML = C.contacto.perfiles.map((p) => `<button type="button" class="perfil" aria-pressed="false">${esc(p)}</button>`).join("");
    lead.after(chips);
    const sync = () => chips.querySelectorAll(".perfil").forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === sel.value)));
    chips.addEventListener("click", (e) => {
      const b = e.target.closest(".perfil"); if (!b) return;
      sel.value = b.textContent; sel.dispatchEvent(new Event("change", { bubbles: true }));
      document.getElementById("f-nombre").focus({ preventScroll: true });
    });
    sel.addEventListener("change", sync);
  }

  /* ---------- contacto: frase tipográfica y fondo con movimiento ---------- */

  const cgrid = document.querySelector(".contacto__grid");
  const cintro = document.querySelector(".contacto__intro");
  if (cgrid && cintro) {
    const blobs = document.createElement("div");
    blobs.className = "blobs"; blobs.setAttribute("aria-hidden", "true");
    blobs.innerHTML = "<i></i><i></i><i></i><i></i>";
    cgrid.prepend(blobs);
    const frase = document.createElement("p");
    frase.className = "frase";
    frase.innerHTML = 'El cambio<br>empieza <span class="frase__vos">con vos.</span>';
    cintro.append(frase);
  }

  /* ---------- barra de progreso ---------- */

  const bar = document.querySelector(".progress i");
  /* ---------- volver arriba ---------- */
  const top = document.createElement("button");
  top.type = "button"; top.className = "totop"; top.setAttribute("aria-label", "Volver arriba");
  top.innerHTML = "<span aria-hidden=\"true\">↑</span>";
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  document.body.append(top);

  /* ---------- puntos de navegación por sección (escritorio) ---------- */

  const dots = document.createElement("nav");
  dots.className = "dots"; dots.setAttribute("aria-label", "Ir a una sección");
  const targets = [...document.querySelectorAll("main > section[id]")];
  dots.innerHTML = `<ul>${targets.map((s) => {
    const lbl = (C.nav.find((n) => n.href === "#" + s.id) || {}).label || s.id.charAt(0).toUpperCase() + s.id.slice(1);
    return `<li><a href="#${s.id}" data-id="${s.id}" style="--c: var(--${secColor[s.id] || "rosa"})"><span>${esc(lbl)}</span></a></li>`;
  }).join("")}</ul>`;
  document.body.append(dots);
  const dotLinks = [...dots.querySelectorAll("a")];
  const dspy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      dotLinks.forEach((a) => a.classList.toggle("is-on", a.dataset.id === en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  targets.forEach((s) => dspy.observe(s));

  /* ---------- scroll: progreso, volver arriba y parallax ---------- */

  const heroContent = document.querySelector(".hero__content");
  const heroVideo = document.querySelector(".hero__video");
  const orgs = document.querySelectorAll(".espacios__org");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    top.classList.toggle("is-on", y > innerHeight * 0.8);
    if (reduceMotion) return;
    if (y < innerHeight * 1.2) {
      if (heroContent) heroContent.style.transform = `translateY(${y * 0.12}px)`;
      if (heroVideo) heroVideo.style.transform = `scale(${1 + y * 0.00008}) translateY(${y * 0.06}px)`;
    }
    orgs.forEach((o, i) => {
      const r = o.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) o.style.translate = `0 ${(r.top - innerHeight / 2) * (i ? -0.08 : 0.08)}px`;
    });
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
})();
