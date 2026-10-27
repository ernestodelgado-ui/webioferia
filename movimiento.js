/* =========================================================
   BIOFERIA EN MOVIMIENTO · los videos en tarjetas de vidrio lila sobre fondo negro
   Título "Bioferia en movimiento" (Bioferia en rosa y negrita), cada video en una tarjeta con su título y descripción centrados,
   y botón de play translúcido. La reproducción es la de siempre (uno solo a la vez, con sonido).
   Capa final: para quitarla, borrar este archivo, movimiento.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.querySelector('[data-render="videos"]');
  const h2 = sec && sec.querySelector(".sec-head .h2");
  if (!sec || !h2) return;
  sec.classList.add("mv");
  h2.innerHTML = '<span class="mv__w"><i><b>Bioferia</b></i></span> <span class="mv__w"><i>en movimiento</i></span>';
  h2.querySelectorAll(".mv__w").forEach((w, i) => w.style.setProperty("--d", 120 + i * 140 + "ms"));
  sec.querySelectorAll(".vid").forEach((v, i) => v.style.setProperty("--d", 350 + i * 200 + "ms"));

  const calm = document.documentElement.classList.contains("menos-movimiento");
  if (calm || !("IntersectionObserver" in window)) sec.classList.add("mv-in");
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { sec.classList.add("mv-in"); io.disconnect(); } }, { threshold: 0.2 }).observe(sec);
})();
