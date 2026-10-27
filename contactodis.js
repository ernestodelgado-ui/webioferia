/* =========================================================
   CONTACTO · como el póster: "¿Te sumás?", perfiles en píldoras y "El cambio empieza con vos" a la izquierda; el formulario en una tarjeta blanca sobre la forma rosa.
   Todo entra con fade al scrollear. El formulario es el mismo de siempre (mismos campos y envío).
   Capa final: para quitarla, borrar este archivo, contactodis.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.querySelector('[data-render="contacto"]');
  const intro = sec && sec.querySelector(".contacto__intro");
  const form = sec && sec.querySelector("#contact-form");
  if (!intro || !form) return;
  sec.classList.add("ct");
  const perfiles = [...form.querySelectorAll("#f-perfil option")].map((o) => o.textContent.trim()).filter((t) => t && !/^Eleg/i.test(t));
  const lead = intro.querySelector(".lead");
  intro.innerHTML = `
    <h2 class="ct__t" id="contacto-title">¿Te sumás?</h2>
    <p class="ct__lead">¿Sponsor, expositor o prensa?<br>Contanos qué te trae por acá.</p>
    <ul class="ct__chips" role="list">${perfiles.map((p) => `<li>${p}</li>`).join("")}</ul>
    <p class="ct__big" aria-hidden="true"><span>El cambio</span><span>empieza con vos</span></p>`;
  intro.classList.remove("reveal"); form.classList.remove("reveal");
  const grid = sec.querySelector(".contacto__grid");
  const shape = document.createElement("img");
  shape.className = "ct__forma"; shape.src = "assets/graficas/forma-rosa.png"; shape.alt = ""; shape.setAttribute("aria-hidden", "true"); shape.draggable = false;
  grid.prepend(shape);
  intro.querySelectorAll(".ct__chips li").forEach((l, i) => l.style.setProperty("--d", 500 + i * 90 + "ms"));
  const calm = document.documentElement.classList.contains("menos-movimiento");
  if (calm || !("IntersectionObserver" in window)) sec.classList.add("ct-in");
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { sec.classList.add("ct-in"); io.disconnect(); } }, { threshold: 0.25 }).observe(grid);
})();
