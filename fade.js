/* =========================================================
   FADE AL SCROLLEAR · BIOFERIA 2027
   Cada sección aparece con un fundido suave (sube un poco y se aclara) cuando entra en pantalla.
   Si algo falla, o con "Reducir movimiento", todo se ve normal. Capa final: borrar este archivo, fade.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const root = document.documentElement;
  if (!("IntersectionObserver" in window) || root.classList.contains("menos-movimiento")) return;
  const hero = document.querySelector(".hero");
  const all = [...document.querySelectorAll("main > section, .site-footer")].filter((s) => s !== hero && !s.classList.contains("hero") && !s.hasAttribute("data-nofade"));
  if (!all.length) return;
  const inView = (el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight * 0.9; };
  const io = new IntersectionObserver((en) => {
    en.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target; io.unobserve(el);
      el.classList.add("fd-in");
      const done = () => { el.classList.remove("fd", "fd-in"); el.removeEventListener("transitionend", done); };
      el.addEventListener("transitionend", done);
      setTimeout(done, 1400);                                    // por si no llega el evento: queda como cualquier sección
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });
  all.forEach((s) => { if (inView(s)) return; s.classList.add("fd"); io.observe(s); });
  root.classList.add("fade-on");
})();
