/* =========================================================
   EL PREDIO · carrusel de vidrio
   Los cinco espacios en tarjetas de vidrio sobre fondo negro, en perspectiva (la del medio de frente), con una barra de control abajo:
   anterior · pausa · siguiente, el espacio actual con su barra de avance y el contador.
   Al tocar la tarjeta del medio (o el botón de ampliar) se abre una pestaña de vidrio con la imagen grande.
   Capa final: para quitarla, borrar este archivo, recorrido.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.querySelector('[data-render="espacios"]');
  const E = window.BIOFERIA && window.BIOFERIA.espacios;
  if (!sec || !E) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const items = E.items, N = items.length, M = N * 2, DUR = 4.8;          // M tarjetas: cada espacio dos veces, así se ven varias más atrás
  const pad = (n) => String(n + 1).padStart(2, "0");
  const ico = {
    prev: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M19 5v14L9 12zM8 5v14H6V5z" fill="currentColor"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 5v14l10-7zM16 5v14h2V5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  sec.classList.add("es");
  sec.innerHTML = `
    <div class="es__glow" aria-hidden="true">${items.map((s, i) => `<span style="background-image:url('${esc(s.src)}')"${i ? "" : ' class="is-on"'}></span>`).join("")}</div>
    <div class="es__wrap">
      <header class="es__head">
        <h2 class="es__titulo" id="espacios-title"><span class="es__l"><i>Así se activa</i></span><span class="es__l"><i>el <b>recorrido.</b></i></span></h2>
      </header>
      <div class="es__stage" tabindex="0" role="group" aria-roledescription="carrusel" aria-label="Espacios del predio. Usá las flechas del teclado para recorrerlos.">
        <ul class="es__lista" role="list">
          ${Array.from({ length: M }, (_, i) => items[i % N]).map((s, i) => `
            <li class="es__card" data-i="${i}"${i >= N ? ' aria-hidden="true"' : ""} style="--c: var(--${esc(s.color)})">
              <div class="es__img"><img src="${esc(s.src)}" alt="${esc(s.alt)}" draggable="false" loading="lazy"></div>
              <div class="es__cap"><strong>${pad(i % N)} ${esc(s.nombre)}</strong><span>${esc(s.descripcion)}</span></div>
            </li>`).join("")}
        </ul>
      </div>
      <p class="es__sub">${esc(E.texto)}</p>
      <div class="es__bar" role="group" aria-label="Control del carrusel">
        <div class="es__btns">
          <button type="button" class="es__b" data-act="prev" aria-label="Espacio anterior">${ico.prev}</button>
          <button type="button" class="es__b es__b--play" data-act="play" aria-label="Pausar el recorrido automático" aria-pressed="false">${ico.pause}</button>
          <button type="button" class="es__b" data-act="next" aria-label="Espacio siguiente">${ico.next}</button>
        </div>
        <button type="button" class="es__now" data-act="open" aria-label="Ver la imagen grande del espacio actual">
          <span class="es__thumb"><img alt="" src="${esc(items[0].src)}"></span>
          <span class="es__now-t"><strong>${esc(items[0].nombre)}</strong><span>${esc(items[0].descripcion)}</span></span>
          <span class="es__prog" aria-hidden="true"><i></i></span>
        </button>
        <div class="es__right">
          <span class="es__count" aria-live="polite"><b>${pad(0)}</b> / ${pad(N - 1)}</span>
          <button type="button" class="es__b" data-act="open" aria-label="Ampliar imagen">${ico.zoom}</button>
        </div>
      </div>
      <p class="es__nota">${esc(E.nota)}</p>
    </div>
    <div class="es__modal" hidden>
      <div class="es__panel" role="dialog" aria-modal="true" aria-labelledby="es-m-t">
        <button type="button" class="es__x" data-act="close" aria-label="Cerrar">×</button>
        <div class="es__mimg"><img alt="" src=""></div>
        <div class="es__mcap"><h3 id="es-m-t"></h3><p></p></div>
        <div class="es__mnav"><button type="button" class="es__b" data-act="mprev" aria-label="Anterior">${ico.prev}</button><span class="es__count"></span><button type="button" class="es__b" data-act="mnext" aria-label="Siguiente">${ico.next}</button></div>
      </div>
    </div>`;

  const $ = (q) => sec.querySelector(q) || document.querySelector(q), $$ = (q) => [...sec.querySelectorAll(q)];
  document.body.appendChild(sec.querySelector(".es__modal"));                 // la pestaña va fuera de la sección para quedar por encima del menú
  const stage = $(".es__stage"), cards = $$(".es__card"), glows = $$(".es__glow span");
  const nowImg = $(".es__thumb img"), nowT = $(".es__now-t"), count = $(".es__bar .es__count b"), prog = $(".es__prog i"), playBtn = $(".es__b--play");
  const root = document.documentElement, calm = () => root.classList.contains("menos-movimiento");
  let enter = calm() ? 1 : 0, entering = false, W = 0, cw = 260, pos = 0, target = 0, dragging = false, hover = false, visible = false, playing = !calm(), last = 0, idle = 0, cur = 0, modalOpen = false;
  const mod = (a, n) => ((a % n) + n) % n;

  function size() { W = stage.clientWidth; cw = W < 700 ? W * 0.74 : Math.min(400, W * 0.34); stage.style.setProperty("--cw", cw.toFixed(1) + "px"); }
  size(); new ResizeObserver(size).observe(stage);

  function layout() {
    cards.forEach((c, i) => {
      const p = mod(i - pos + M / 2, M) - M / 2, a = Math.abs(p), k = Math.max(-3.4, Math.min(3.4, p));
      // las tarjetas se montan unas sobre otras: la del medio tapa a las vecinas
      const off = (a <= 1 ? a * 0.76 : 0.76 + (a - 1) * 0.36) * Math.sign(k) * cw * (W < 700 ? 0.62 : 1) * enter;
      const z = -a * 170, ry = k * 7, sc = Math.max(0.5, 1 - a * 0.13) * (0.7 + 0.3 * enter);
      c.style.transform = `translate3d(calc(-50% + ${off.toFixed(1)}px), -50%, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      const op = (a < 3.1 ? 1 : Math.max(0, 1 - (a - 3.1) * 3)) * enter;
      c.style.opacity = op.toFixed(3); c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.setProperty("--br", (1 - Math.min(a, 3.2) * 0.17).toFixed(3));
      c.style.pointerEvents = op < 0.2 ? "none" : "";
      c.classList.toggle("is-centro", a < 0.5);
    });
    const now = mod(Math.round(pos), M) % N;
    if (now !== cur) setCur(now);
  }
  function setCur(i) {
    cur = i; const s = items[i];
    glows.forEach((g, k) => g.classList.toggle("is-on", k === i));
    nowImg.src = s.src; nowT.innerHTML = `<strong>${esc(s.nombre)}</strong><span>${esc(s.descripcion)}</span>`; count.textContent = pad(i);
    idle = 0;
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (visible && !modalOpen) {
      if (playing && !dragging && !hover) { idle += dt; if (idle >= DUR) { target = Math.round(target) + 1; idle = 0; } }
      if (entering && enter < 1) enter = Math.min(1, enter + dt / 1.5);           // al llegar, las tarjetas se abren en abanico desde el centro
      pos += (target - pos) * Math.min(1, dt * 4.4);
      layout(); prog.style.transform = `scaleX(${playing ? Math.min(1, idle / DUR).toFixed(3) : 0})`;
    }
    requestAnimationFrame(frame);
  }
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(sec);
  layout(); requestAnimationFrame((t) => { last = t; frame(t); });

  const go = (d) => { target = Math.round(target) + d; idle = 0; };
  const setPlay = (on) => {
    playing = on; playBtn.innerHTML = on ? ico.pause : ico.play; playBtn.setAttribute("aria-pressed", String(!on));
    playBtn.setAttribute("aria-label", on ? "Pausar el recorrido automático" : "Reanudar el recorrido automático");
  };
  setPlay(playing);

  /* ---------- pestaña de vidrio con la imagen grande ---------- */
  const modal = $(".es__modal"), mImg = $(".es__mimg img"), mT = $(".es__mcap h3"), mP = $(".es__mcap p"), mCount = $(".es__mnav .es__count");
  let opener = null;
  function fill(i) { const s = items[i]; mImg.src = s.src; mImg.alt = s.alt; mT.textContent = s.nombre; mP.textContent = s.descripcion; mCount.textContent = pad(i) + " / " + pad(N - 1); modal.dataset.i = i; modal.style.setProperty("--c", `var(--${s.color})`); }
  function open(i) {
    opener = document.activeElement; fill(i); modal.hidden = false; modalOpen = true;
    requestAnimationFrame(() => modal.classList.add("is-open")); root.classList.add("es-lock");
    $(".es__x").focus();
  }
  function close() {
    modal.classList.remove("is-open"); modalOpen = false; root.classList.remove("es-lock");
    setTimeout(() => { modal.hidden = true; }, calm() ? 0 : 350);
    const i = Number(modal.dataset.i); target = Math.round(target) + (mod(i - cur + N / 2, N) - N / 2); idle = 0;
    if (opener && opener.focus) opener.focus();
  }
  const mstep = (d) => fill(mod(Number(modal.dataset.i) + d, N));

  const onClick = (e) => {
    const b = e.target.closest("[data-act]");
    if (b) {
      const a = b.dataset.act;
      if (a === "prev") go(-1); else if (a === "next") go(1); else if (a === "play") setPlay(!playing);
      else if (a === "open") open(cur); else if (a === "close") close(); else if (a === "mprev") mstep(-1); else if (a === "mnext") mstep(1);
      return;
    }
    if (e.target === modal) { close(); return; }
    if (moved) { moved = false; return; }
    const c = e.target.closest(".es__card"); if (!c) return;
    const p = mod(Number(c.dataset.i) - pos + M / 2, M) - M / 2;
    if (Math.abs(p) < 0.5) open(Number(c.dataset.i) % N); else go(Math.round(p));
  };
  sec.addEventListener("click", onClick); modal.addEventListener("click", onClick);
  addEventListener("keydown", (e) => {
    if (modalOpen) { if (e.key === "Escape") close(); else if (e.key === "ArrowRight") mstep(1); else if (e.key === "ArrowLeft") mstep(-1); else if (e.key === "Tab") { const f = [...modal.querySelectorAll("button")]; const first = f[0], lastb = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { lastb.focus(); e.preventDefault(); } else if (!e.shiftKey && document.activeElement === lastb) { first.focus(); e.preventDefault(); } } return; }
    if (document.activeElement === stage) { if (e.key === "ArrowRight") { go(1); e.preventDefault(); } else if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); } else if (e.key === "Enter" || e.key === " ") { open(cur); e.preventDefault(); } }
  });

  /* ---------- arrastrar y pausa con el mouse ---------- */
  stage.addEventListener("mouseenter", () => { hover = true; }); stage.addEventListener("mouseleave", () => { hover = false; idle = 0; });
  let sx = 0, st = 0, moved = false;
  stage.addEventListener("pointerdown", (e) => { dragging = true; moved = false; sx = e.clientX; st = target; idle = 0; });
  addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true; target = st - dx / (cw * 0.9); });
  addEventListener("pointerup", () => { if (!dragging) return; dragging = false; target = Math.round(target); idle = 0; setTimeout(() => { moved = false; }, 0); });
  stage.addEventListener("wheel", (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) { go(e.deltaX > 0 ? 1 : -1); e.preventDefault(); } }, { passive: false });

  // entrada con fade al llegar con el scroll
  if (calm() || !("IntersectionObserver" in window)) { sec.classList.add("es-in"); enter = 1; }
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { sec.classList.add("es-in"); entering = true; io.disconnect(); } }, { threshold: 0.2 }).observe(sec);
})();
