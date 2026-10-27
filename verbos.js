/* =========================================================
   5 CATALIZADORES · 5 VERBOS · BIOFERIA 2027
   Reemplaza los paneles horizontales: título a la izquierda y, a la derecha, cinco tarjetas apiladas con su gráfica.
   Al pasar el mouse (o tocar) cada tarjeta se despliega y aparece la foto con el color y las formas, como en los paneles anteriores.
   Capa final: para quitarla, borrar este archivo, verbos.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const prev = document.getElementById("vuelve") || document.getElementById("edicion") || document.querySelector(".hero");
  const C = window.BIOFERIA, K = C && C.franja;
  if (!prev || !K || !K[0].sentido) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // gráfica de cada tarjeta cerrada (se mezcla en multiplicar sobre el color)
  const ART = { rojo: "criatura-flores.webp", turquesa: "criatura-libelula.png", azul: "criatura-nautilo.webp", amarillo: "patron-amarillo.webp", rosa: "organismo-rosa.png" };

  const s = document.createElement("section");
  s.className = "cv"; s.id = "catalizadores"; s.setAttribute("aria-labelledby", "cv-titulo");
  s.innerHTML = `
    <div class="cv__izq">
      <h2 class="cv__titulo" id="cv-titulo"><span class="cv__l1">5 CATALIZADORES</span><span class="cv__l2">5 VERBOS</span><span class="cv__l3">para activar el cambio</span></h2>
      <p class="cv__txt">Cada verbo es un elemento, un color y un lugar del predio. Tocá uno y descubrí dónde vivirlo.</p>
      <button type="button" class="cv__mapa" data-cv-mapa>Ver en el mapa</button>
    </div>
    <ul class="cv__lista" role="list">
      ${K.map((k, i) => `
        <li class="cv__c bg-${esc(k.color)}" data-open="false" style="--cc: var(--${esc(k.color)}); --img: url('${esc(k.img)}')">
          <span class="cv__art" aria-hidden="true" style="background-image:url(assets/graficas/${ART[k.color] || ART.rosa})"></span>
          <span class="cv__photo" aria-hidden="true"></span><span class="cv__tint" aria-hidden="true"></span><span class="cv__shapes" aria-hidden="true"></span>
          <button type="button" class="cv__btn" aria-expanded="false" aria-controls="cv-p-${i}" id="cv-b-${i}">
            <span class="cv__verbo">${esc(k.verbo)}</span>
            <span class="cv__elem">${esc(k.elemento)}</span>
          </button>
          <div class="cv__panel" id="cv-p-${i}" role="region" aria-labelledby="cv-b-${i}">
            <p class="cv__sentido">${esc(k.sentido)}</p>
            <p class="cv__donde"><span>Lo vivís en</span><strong>${esc(k.donde)}</strong></p>
            <p class="cv__det">${esc(k.detalle)}</p>
          </div>
        </li>`).join("")}
    </ul>`;
  prev.after(s);

  const items = [...s.querySelectorAll(".cv__c")];
  const setOpen = (it) => items.forEach((o) => {
    const on = o === it;
    o.dataset.open = String(on);
    o.querySelector(".cv__btn").setAttribute("aria-expanded", String(on));
  });
  const hover = () => matchMedia("(hover: hover) and (min-width: 860px)").matches;
  items.forEach((it) => {
    const b = it.querySelector(".cv__btn");
    b.addEventListener("click", () => setOpen(it.dataset.open === "true" && !hover() ? null : it));
    b.addEventListener("focus", () => setOpen(it));
    it.addEventListener("mouseenter", () => { if (hover()) setOpen(it); });
  });
  s.querySelector(".cv__lista").addEventListener("mouseleave", () => { if (hover()) setOpen(null); });
  // las tres líneas del título ocupan exactamente el mismo ancho: queda un bloque
  const izq = s.querySelector(".cv__izq"), lines = [...s.querySelectorAll(".cv__titulo span")];
  function fit() {
    const W = izq.clientWidth; if (!W) return;
    const p = s.querySelector(".cv__txt");
    p.style.whiteSpace = "nowrap"; p.style.width = "max-content"; p.style.fontSize = "20px";
    const pw = p.getBoundingClientRect().width; p.style.whiteSpace = ""; p.style.width = ""; p.style.fontSize = Math.min(30, 20 * W * 1.9 / pw).toFixed(2) + "px";
    lines.forEach((l) => { l.style.fontSize = "100px"; l.style.fontSize = (100 * W / l.getBoundingClientRect().width).toFixed(2) + "px"; });
  }
  fit(); new ResizeObserver(fit).observe(izq);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  s.querySelector("[data-cv-mapa]").addEventListener("click", () => { const m = document.querySelector("[data-open-map]"); if (m) m.click(); });
  // entrada al llegar: el título aparece por líneas y las tarjetas entran una tras otra desde la derecha
  const calm = document.documentElement.classList.contains("menos-movimiento");
  s.querySelectorAll(".cv__titulo > span").forEach((l, i) => l.style.setProperty("--d", i * 160 + "ms"));
  items.forEach((it, i) => it.style.setProperty("--d", 300 + i * 120 + "ms"));
  if (calm || !("IntersectionObserver" in window)) s.classList.add("cv-in");
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { s.classList.add("cv-in"); io.disconnect(); } }, { threshold: 0.2 }).observe(s);
})();
