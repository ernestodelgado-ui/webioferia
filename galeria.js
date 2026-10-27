/* =========================================================
   GALERÍA · fila de fotos que pasa lentamente, en bucle
   Título centrado, categorías en píldoras de color y las fotos en una fila que avanza sola. Se frena al pasar el mouse o tocar;
   se puede arrastrar o deslizar, y al tocar cualquier foto se abre el visor (el de siempre). Las categorías siguen filtrando.
   Capa final: para quitarla, borrar este archivo, galeria.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.querySelector('[data-render="galeria"]');
  const track = sec && sec.querySelector(".gal__track");
  if (!sec || !track) return;
  const root = document.documentElement, calm = () => root.classList.contains("menos-movimiento");
  sec.classList.add("ga");

  // título: "Mirá cómo se vive Bioferia" (la última palabra en rosa, sin punto)
  const h2 = sec.querySelector(".sec-head .h2");
  if (h2) h2.innerHTML = 'Mirá cómo se vive <b class="ga__em">Bioferia</b>';

  /* ---------- fila en bucle: copias antes y después, así nunca se acaba ---------- */
  let W0 = 0, building = false;
  function build() {
    if (building) return; building = true;
    track.querySelectorAll("[data-clon]").forEach((c) => c.remove());
    const orig = [...track.querySelectorAll(".gal__card")];
    if (orig.length < 2) { building = false; return; }
    const mk = (n) => { const c = n.cloneNode(true); c.setAttribute("data-clon", ""); c.setAttribute("aria-hidden", "true"); c.querySelectorAll("button").forEach((b) => { b.tabIndex = -1; }); return c; };
    const before = orig.map(mk), after = orig.map(mk);
    track.prepend(...before); track.append(...after);
    requestAnimationFrame(() => {
      const a = orig[0], z = orig[orig.length - 1], gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      W0 = z.offsetLeft + z.offsetWidth - a.offsetLeft + gap;          // ancho de una vuelta completa
      track.scrollLeft = W0; building = false;
    });
  }
  build();
  new MutationObserver(() => { if (!building) build(); }).observe(track, { childList: true });
  new ResizeObserver(() => { if (!building) build(); }).observe(track);

  /* ---------- avance lento ---------- */
  const SPEED = 38;                                                       // píxeles por segundo
  let paused = false, visible = false, last = 0, touchT = 0, acc = 0;
  track.addEventListener("mouseenter", () => { paused = true; }); track.addEventListener("mouseleave", () => { paused = false; });
  track.addEventListener("focusin", () => { paused = true; }); track.addEventListener("focusout", () => { paused = false; });
  track.addEventListener("touchstart", () => { touchT = performance.now(); paused = true; }, { passive: true });
  track.addEventListener("touchend", () => { setTimeout(() => { if (performance.now() - touchT >= 1800) paused = false; }, 1900); }, { passive: true });
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(sec);
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (W0 && !building) {
      if (visible && !paused && !calm() && !document.querySelector("dialog[open]") && !track.classList.contains("is-drag")) {
        acc += SPEED * dt; const px = Math.floor(acc); if (px) { track.scrollLeft += px; acc -= px; }
      }
      if (track.scrollLeft >= W0 * 2) track.scrollLeft -= W0; else if (track.scrollLeft < 1) track.scrollLeft += W0;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame((t) => { last = t; frame(t); });

  // entrada con fade al llegar con el scroll
  if (calm() || !("IntersectionObserver" in window)) sec.classList.add("ga-in");
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { sec.classList.add("ga-in"); io.disconnect(); } }, { threshold: 0.2 }).observe(sec);
})();
