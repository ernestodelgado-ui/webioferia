/* =========================================================
   ÁREAS · la lista de categorías de la derecha aparece con fade, fila por fila, al llegar con el scroll.
   Capa final: para quitarla, borrar este archivo, areasfade.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const box = document.querySelector(".areas__cats");
  if (!box) return;
  const rows = [...box.querySelectorAll(".cats__item")];
  rows.forEach((r, i) => r.style.setProperty("--d", 320 + i * 95 + "ms"));
  const calm = document.documentElement.classList.contains("menos-movimiento");
  if (calm || !("IntersectionObserver" in window)) { box.classList.add("af-in", "af-static"); return; }
  box.classList.add("af");
  new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { box.classList.add("af-in"); io.disconnect(); } }, { threshold: 0.25 }).observe(box);
})();
