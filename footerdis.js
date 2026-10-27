/* =========================================================
   PIE · como el póster: "ACTIVEMOS EL CAMBIO" a la izquierda con fecha y lugar, logo arriba a la derecha y tres columnas de links abajo.
   Se conservan "Ver la bienvenida" y "Reducir movimiento" y las redes. Capa final: para quitarla, borrar este archivo, footerdis.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const f = document.querySelector(".site-footer");
  const C = window.BIOFERIA;
  if (!f || !C) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const legal = f.querySelector(".footer__legal");
  const redes = [...f.querySelectorAll(".footer__social a")].map((a) => ({ t: a.textContent.trim(), h: a.getAttribute("href") }));
  const m = C.meta, ex = C.acciones && C.acciones.expositor;
  const sedes = (C.region && C.region.sedes) || [];
  const ext = (h) => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : "");
  const col = (t, items) => `<div class="fo__col"><h2>${esc(t)}</h2><ul role="list">${items.join("")}</ul></div>`;
  const a = (t, h) => `<li><a href="${esc(h)}"${ext(h)}>${esc(t)}</a></li>`;
  f.classList.add("fo");
  f.innerHTML = `
    <div class="fo__wrap">
      <p class="fo__logo" aria-label="Bioferia"><b>BIO</b>FERIA</p>
      <div class="fo__main">
        <div class="fo__izq">
          <p class="fo__big"><span>ACTIVEMOS</span><b>EL CAMBIO</b></p>
          <p class="fo__fecha">${esc(m.fechas)}<br>${esc(m.lugar)}, ${esc(m.ciudad)}</p>
        </div>
        <nav class="fo__cols" aria-label="Pie de página">
          ${col("Descubrinos", [a("Áreas", "#areas"), a("Galería", "#galeria"), a("Agenda", "#agenda"), a("Impacto", "#impacto"), a("Apps", "#app")])}
          ${col("Bioferia por el mundo", sedes.map((s) => `<li>${esc(s.ciudad)}</li>`))}
          ${col("Hablemos", [ex ? a(ex.label, ex.href) : "", a("Contacto", "#contacto"), a("Prensa", "mailto:" + m.correo)])}
        </nav>
      </div>
      <div class="fo__pie"><span class="fo__legal-slot"></span>${redes.length ? `<ul class="fo__redes" role="list">${redes.map((r) => `<li><a href="${esc(r.h)}" target="_blank" rel="noopener">${esc(r.t)}</a></li>`).join("")}</ul>` : ""}</div>
    </div>`;
  if (legal) f.querySelector(".fo__legal-slot").replaceWith(legal);
  // fade al llegar
  f.querySelectorAll(".fo__big span, .fo__big b, .fo__fecha, .fo__logo, .fo__col").forEach((e, i) => e.style.setProperty("--d", i * 110 + "ms"));
  const calm = document.documentElement.classList.contains("menos-movimiento");
  if (calm || !("IntersectionObserver" in window)) f.classList.add("fo-in");
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { f.classList.add("fo-in"); io.disconnect(); } }, { threshold: 0.2 }).observe(f);
})();

/* "ACTIVEMOS" y "EL CAMBIO" terminan en el mismo borde: se ajusta el tamaño de la primera línea al ancho de la segunda */
(function () {
  const big = document.querySelector(".fo__big");
  if (!big) return;
  const a = big.querySelector("span"), b = big.querySelector("b");
  a.style.display = "block"; a.style.width = "max-content"; b.style.display = "block"; b.style.width = "max-content";
  function fit() {
    a.style.fontSize = "";
    for (let k = 0; k < 4; k++) {
      const base = parseFloat(getComputedStyle(a).fontSize), wa = a.getBoundingClientRect().width, wb = b.getBoundingClientRect().width;
      if (!wa || !wb || Math.abs(wa - wb) < 1) return;
      a.style.fontSize = (base * wb / wa).toFixed(2) + "px";
    }
  }
  fit(); new ResizeObserver(fit).observe(big.parentElement);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
