/* =========================================================
   MAPA · versión oscura (sin el papel blanco) y puntos numerados de las categorías sobre el mapa.
   Cada punto lleva los números de las categorías que se viven ahí; al pasar el mouse por una fila de la lista se resaltan sus puntos.
   Capa final: para quitarla, borrar este archivo, mapa.css, assets/mapa/mapa-hipodromo-oscuro.webp y sus líneas en index.html.
   ========================================================= */
(function () {
  const C = window.BIOFERIA, cats = C && C.areas && C.areas.categorias;
  const btn = document.querySelector(".areas__mapbtn");
  if (!cats || !btn) return;
  const root = document.documentElement;
  const CLARO = C.areas.mapa.src, OSCURO = CLARO;                         // el mapa es el mismo en claro y oscuro

  /* ---------- versión oscura / clara ---------- */
  const apply = () => { return;
    const dark = root.dataset.tema === "oscuro";
    document.querySelectorAll(".areas__img, .map-dialog__img").forEach((im) => {
      const want = dark ? OSCURO : CLARO;
      if (!im.getAttribute("src").endsWith(want)) { im.removeAttribute("srcset"); im.setAttribute("src", want); }
    });
  };
  apply(); new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ["data-tema"] });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-open-map]")) setTimeout(apply, 0); }, true);

  /* ---------- puntos sobre el mapa (posiciones en el mapa de 1920 × 1080) ---------- */
  const SPOTS = {
    "stands": [[1457, 520], [1160, 585]],
    "descanso": [[1030, 245], [1420, 680]],
    "espacio instagram": [[1790, 515]],
    "ingreso": [[1700, 868]],
    "jardinería": [[1655, 440]],
    "informes": [[1565, 790]],
    "escenario y charlas": [[820, 395], [800, 190]],
  };
  const groups = {};
  cats.forEach((c, i) => { const k = c.lugar.toLowerCase(); (groups[k] = groups[k] || { color: c.color, n: [] }).n.push(i + 1); });
  const W = 1920, H = 1080;
  Object.keys(groups).forEach((k) => (SPOTS[k] || []).forEach(([x, y], j) => {
    const g = groups[k], p = document.createElement("span");
    p.className = "mpin mpin--" + g.color; p.dataset.n = g.n.join(",");
    p.style.cssText = `left:${(x / W * 100).toFixed(2)}%;top:${(y / H * 100).toFixed(2)}%;--i:${j}`;
    p.innerHTML = `<b>${g.n.join(" · ")}</b>`;
    p.title = k.charAt(0).toUpperCase() + k.slice(1) + " — " + g.n.map((n) => cats[n - 1].n).join(", ");
    btn.appendChild(p);
  }));
  const pins = [...btn.querySelectorAll(".mpin")];
  pins.forEach((p, i) => p.style.setProperty("--d", 300 + i * 110 + "ms"));

  // entran en pop cuando el mapa llega a la pantalla
  const calm = root.classList.contains("menos-movimiento");
  if (calm || !("IntersectionObserver" in window)) btn.classList.add("mp-in");
  else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { btn.classList.add("mp-in"); io.disconnect(); } }, { threshold: 0.3 }).observe(btn);

  // lista ⇄ mapa
  const mark = (n, on) => pins.forEach((p) => p.classList.toggle("is-hi", on && p.dataset.n.split(",").includes(String(n))));
  document.querySelectorAll(".cats__item").forEach((li, i) => {
    li.addEventListener("mouseenter", () => mark(i + 1, true)); li.addEventListener("mouseleave", () => mark(i + 1, false));
  });
  const rows = [...document.querySelectorAll(".cats__item")];
  pins.forEach((p) => {
    const ns = p.dataset.n.split(",").map(Number);
    p.addEventListener("mouseenter", () => ns.forEach((n) => rows[n - 1] && rows[n - 1].classList.add("is-hi")));
    p.addEventListener("mouseleave", () => ns.forEach((n) => rows[n - 1] && rows[n - 1].classList.remove("is-hi")));
  });
})();
// números de la lista con dos cifras, como en el diseño: 01, 02…
document.querySelectorAll(".cats__n").forEach((n, i) => { n.textContent = String(i + 1).padStart(2, "0"); });
