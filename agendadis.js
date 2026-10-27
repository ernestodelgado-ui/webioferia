/* =========================================================
   AGENDA · como el póster: fondo negro, título liviano con "cambio" en rosa y negrita, días a la izquierda y tarjeta del día a la derecha.
   Capa final: para quitarla, borrar este archivo, agendadis.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.querySelector('[data-render="agenda"]');
  const h2 = sec && sec.querySelector(".sec-head .h2");
  if (!sec || !h2) return;
  sec.classList.add("agd");
  const w = (t) => t.split(" ").map((x) => `<span class="agd__w"><i>${x}</i></span>`).join(" ");
  h2.innerHTML = `<span class="agd__l">${w("Tres días, tres formas")}</span><span class="agd__l">${w("de activar el")} <span class="agd__w agd__w--p"><i>cambio</i></span></span>`;
  sec.querySelectorAll(".agd__w").forEach((e, i) => e.style.setProperty("--d", 100 + i * 80 + "ms"));
  const calm = document.documentElement.classList.contains("menos-movimiento");
  if (calm || !("IntersectionObserver" in window)) sec.classList.add("agd-in");
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { sec.classList.add("agd-in"); io.disconnect(); } }, { threshold: 0.15 }).observe(sec);
})();
