/*
  LENGUAJE GRÁFICO · BIOFERIA 2027
  Capa aparte, se carga al final. Para quitarla: sacar lenguaje.css y lenguaje.js del index.
  - bordes de papel rasgado en los bloques de color
  - última palabra de cada título en cursiva de color (como en los afiches de agenda)
  - criaturas de la marca sueltas como stickers en las cabeceras de sección
*/
(function () {
  "use strict";

  const C = window.BIOFERIA;
  const reduce = document.documentElement.classList.contains("menos-movimiento");

  /* ---------- azar repetible: la página se ve igual en cada visita ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- papel rasgado: recorte irregular arriba y/o abajo ---------- */
  function torn(el, { top = true, bottom = true, amp = 9, seed = 1 } = {}) {
    if (!el) return;
    const r = rng(seed), step = 2.2, pts = [];
    const topPts = [], botPts = [];
    for (let x = 0; x <= 100.001; x += step) {
      const k = (r() + r() + r()) / 3; // más natural que un azar plano
      topPts.push(`${x.toFixed(1)}% ${top ? (k * amp).toFixed(1) : 0}px`);
      const j = (r() + r() + r()) / 3;
      botPts.push(`${x.toFixed(1)}% calc(100% - ${bottom ? (j * amp).toFixed(1) : 0}px)`);
    }
    pts.push(...topPts, ...botPts.reverse());
    el.style.clipPath = `polygon(${pts.join(",")})`;
    el.classList.add("is-torn");
  }

  const q = (s) => document.querySelector(s);
  torn(q(".gastro"), { amp: 12, seed: 11 });
  torn(q(".commit"), { amp: 12, seed: 23 });
  torn(q(".videos"), { amp: 10, seed: 37 });
  torn(q(".contacto__grid"), { amp: 14, seed: 41 });
  torn(q(".site-footer"), { top: true, bottom: false, amp: 14, seed: 53 });
  torn(q(".hero"), { top: false, bottom: true, amp: 12, seed: 67 });

  /* ---------- títulos: última palabra en cursiva de color ---------- */
  document.querySelectorAll(".h2").forEach((h) => {
    if (h.dataset.em || h.querySelector("em")) return;
    const txt = h.textContent.trim();
    const m = txt.match(/^(.*\s)([^\s]+?)([.?!¿]*)$/);
    if (!m) return;
    h.dataset.em = "1";
    h.innerHTML = "";
    h.append(document.createTextNode(m[1]));
    const em = document.createElement("em");
    em.className = "em";
    em.textContent = m[2];
    h.append(em, document.createTextNode(m[3]));
  });

  /* ---------- texturas de fondo: las criaturas de la marca, grandes y en opacidad ---------- */
  // Cada sección toma una. Los archivos están en assets/graficas/ y la posición/opacidad en lenguaje.css (.tex--*).
  const textures = [
    [".areas", "flores"], [".galeria", "nautilo"], [".agenda", "ramas"], [".apps", "libelula"],
    [".campana", "caracol"], [".impacto", "grunge"], [".exp", "collage"],
  ];
  textures.forEach(([sel, kind]) => {
    const sec = q(sel);
    if (!sec) return;
    const d = document.createElement("div");
    d.className = "tex tex--" + kind;
    d.setAttribute("aria-hidden", "true");
    sec.prepend(d);
  });
})();

/* ---------- pie: marca BIO FERIA en collage ---------- */
(function () {
  const f = document.querySelector(".site-footer");
  if (!f) return;
  const m = document.createElement("img");
  m.className = "footer__mark"; m.src = "assets/graficas/bioferia-collage.webp"; m.alt = ""; m.setAttribute("aria-hidden", "true"); m.loading = "lazy"; m.draggable = false;
  f.append(m);
})();
