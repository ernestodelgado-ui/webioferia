/* =========================================================
   LA CAMPAÑA · carrusel 3D de afiches
   Reemplaza el abanico: los afiches giran en perspectiva, el del medio queda de frente y los demás se inclinan hacia los costados.
   Avanza solo; se puede arrastrar, tocar un afiche, o usar las flechas del teclado.
   Capa final: para quitarla, borrar este archivo, campana.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.getElementById("identidad");
  if (!sec) return;
  const POSTERS = [
    ["assets/afiches/post-tu-basura.jpg", "Post «Tu basura termina acá»"],
    ["assets/afiches/afiche-tierra.jpg", "Afiche Bioferia 2027, serie Tierra"],
    ["assets/afiches/afiche-aire.jpg", "Afiche Bioferia 2027, serie Aire"],
    ["assets/afiches/afiche-agua.jpg", "Afiche Bioferia 2027, serie Agua"],
    ["assets/afiches/afiche-celebrar-1.jpg", "Afiche Bioferia 2027, serie Celebrar"],
    ["assets/afiches/afiche-celebrar-2.jpg", "Afiche Bioferia 2027, serie Celebrar"],
    ["assets/afiches/post-algo-crece.jpg", "Post «Cuando nos encontramos, algo crece»"],
  ];
  const N = POSTERS.length;
  const w = (t) => t.split(" ").map((x) => `<span class="cm__w"><i>${x}</i></span>`).join(" ");
  sec.classList.add("cm");
  sec.innerHTML = `
    <div class="cm__wrap">
      <h2 class="cm__titulo" id="campana-title"><span>${w("Un festival que se mira")}</span><span>${w("como se")} <b class="cm__w"><i>siente</i></b></span></h2>
      <div class="cm__stage" tabindex="0" role="group" aria-roledescription="carrusel" aria-label="Afiches de la campaña. Usá las flechas del teclado para recorrerlos.">
        <ul class="cm__lista" role="list">
          ${POSTERS.map((p, i) => `<li class="cm__card" data-i="${i}"><img src="${p[0]}" alt="${p[1]}" draggable="false" loading="lazy"></li>`).join("")}
        </ul>
      </div>
      <p class="cm__txt">Cada elemento tiene su color, su criatura y su afiche. Pasá el mouse o deslizá para recorrerlos.</p>
    </div>`;

  // la tipografía entra con fade, palabra por palabra
  sec.querySelectorAll(".cm__w").forEach((e, i) => e.style.setProperty("--d", 120 + i * 90 + "ms"));
  if (!("IntersectionObserver" in window) || document.documentElement.classList.contains("menos-movimiento")) { sec.classList.add("is-in", "is-static"); window.__cmCalm = true; }
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { sec.classList.add("is-in"); entering = true; io.disconnect(); } }, { threshold: 0.25 }).observe(sec);

  const stage = sec.querySelector(".cm__stage"), cards = [...sec.querySelectorAll(".cm__card")];
  const root = document.documentElement, calm = () => root.classList.contains("menos-movimiento");
  let enter = window.__cmCalm ? 1 : 0, entering = false, W = 0, cw = 240, pos = 0, target = 0, dragging = false, hover = false, visible = true, last = 0, idle = 0;
  const mod = (a, n) => ((a % n) + n) % n;

  function size() {
    W = stage.clientWidth; cw = W < 700 ? W * 0.5 : Math.min(300, Math.max(170, W * 0.21));
    stage.style.setProperty("--cw", cw.toFixed(1) + "px");
  }
  size(); new ResizeObserver(size).observe(stage);

  function layout() {
    cards.forEach((c, i) => {
      let p = mod(i - pos + N / 2, N) - N / 2;                                   // distancia (con signo) al centro, dando la vuelta
      const a = Math.abs(p), k = Math.max(-2.4, Math.min(2.4, p));
      const x = k * cw * (W < 700 ? 0.86 : 1.1) * enter, z = -a * 90, ry = k * 24, sc = Math.max(0.55, 1 - a * 0.11) * (0.72 + 0.28 * enter);
      const op = a < 2.2 ? 1 : Math.max(0, 1 - (a - 2.2) * 2.5);
      c.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      c.style.setProperty("--sx", (k * 14).toFixed(1) + "px"); c.style.setProperty("--br", (1 - Math.min(a, 2.4) * 0.17).toFixed(3));
      c.style.opacity = op.toFixed(3); c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.pointerEvents = op < 0.2 ? "none" : "";
      c.classList.toggle("is-centro", a < 0.5);
    });
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (visible) {
      if (!dragging && !hover && !calm()) { idle += dt; if (idle > 3.2) { target = Math.round(target) + 1; idle = 0; } }   // avanza solo, de a un afiche
      if (entering && enter < 1) enter = Math.min(1, enter + dt / 1.6);
      pos += (target - pos) * Math.min(1, dt * 4.2);
      layout();
    }
    requestAnimationFrame(frame);
  }
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(sec);
  layout(); requestAnimationFrame((t) => { last = t; frame(t); });

  const go = (d) => { target = Math.round(target) + d; idle = 0; };
  stage.addEventListener("mouseenter", () => { hover = true; });
  stage.addEventListener("mouseleave", () => { hover = false; idle = 0; });
  stage.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { go(1); e.preventDefault(); } else if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); } });

  // arrastrar (mouse o dedo) y tocar un afiche para traerlo al centro
  let sx = 0, st = 0, moved = false;
  stage.addEventListener("pointerdown", (e) => { dragging = true; moved = false; sx = e.clientX; st = target; idle = 0; });
  addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true; target = st - dx / (cw * 0.9); });
  addEventListener("pointerup", () => { if (!dragging) return; dragging = false; target = Math.round(target); idle = 0; });
  stage.addEventListener("click", (e) => {
    if (moved) { e.preventDefault(); return; }
    const c = e.target.closest(".cm__card"); if (!c) return;
    const p = mod(Number(c.dataset.i) - pos + N / 2, N) - N / 2; if (Math.abs(p) > 0.5) go(Math.round(p));
  });
  stage.addEventListener("wheel", (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) { go(e.deltaX > 0 ? 1 : -1); e.preventDefault(); } }, { passive: false });
})();
