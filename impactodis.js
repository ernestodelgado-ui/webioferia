/* =========================================================
   IMPACTO · como el póster: una sola pantalla negra con "Bioferia en números" y "Porque nuestro compromiso es real".
   Títulos con fade palabra por palabra; cada bloque (cifras, compromiso) aparece con fade al llegar con el scroll. Los números siguen contando.
   Capa final: para quitarla, borrar este archivo, impactodis.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.querySelector('[data-render="impacto"]');
  const h2 = sec && sec.querySelector(".sec-head .h2");
  const h3 = sec && sec.querySelector(".commit__title");
  if (!h2 || !h3) return;
  sec.classList.add("imp");
  const w = (t, c) => t.split(" ").map((x) => `<span class="imp__w${c ? " " + c : ""}"><i>${x}</i></span>`).join(" ");
  h2.innerHTML = `${w("Bioferia en")} ${w("números", "imp__w--p")}`;
  h3.classList.remove("reveal");
  h3.innerHTML = `<span class="imp__l">${w("Porque nuestro")}</span> <span class="imp__l">${w("compromiso es real,")}</span> <span class="imp__l">${w("así hacemos")} ${w("Bioferia.", "imp__w--p")}</span>`;
  sec.querySelectorAll(".stat").forEach((s, i) => { s.classList.remove("reveal"); s.style.setProperty("--d", i * 140 + "ms"); });
  sec.querySelectorAll(".commit__list li").forEach((s, i) => { s.classList.remove("reveal"); s.style.setProperty("--d", 300 + i * 150 + "ms"); });
  const calm = document.documentElement.classList.contains("menos-movimiento");
  const group = (el) => {
    el.querySelectorAll(".imp__w").forEach((e, i) => e.style.setProperty("--d", 80 + i * 70 + "ms"));
    if (calm || !("IntersectionObserver" in window)) { el.classList.add("imp-in"); return; }
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { el.classList.add("imp-in"); io.disconnect(); } }, { threshold: 0.25 }).observe(el);
  };
  group(sec.querySelector(".sec-head"));
  group(sec.querySelector(".stats"));
  group(sec.querySelector(".commit__grid"));
})();
