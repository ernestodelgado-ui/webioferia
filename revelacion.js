/* =========================================================
   REVELACIÓN · PORTADA · BIOFERIA 2027
   "EL CAMBIO SE" y, en grande, ACTIVA en blanco (Inter Black) sobre negro. Un círculo (el mouse) pasa por encima de las letras: dentro de cada uno se ve la misma palabra rellena con nuestras gráficas. Uno sigue al mouse. Debajo, el contador.
   Capa final: para quitarla, borrar este archivo, revelacion.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const hero = document.querySelector(".hero--video");
  const content = hero && hero.querySelector(".hero__content");
  const h1 = content && content.querySelector(".hero__title");
  if (!content || !h1) return;

  const root = document.documentElement;
  const isCalm = () => root.classList.contains("menos-movimiento");
  const G = "assets/graficas/";
  // cada círculo revela la tipografía en una de las combinaciones de color de la campaña, y lleva uno de los cinco verbos
  const FONDOS = [["Hacer", "bioferia-collage.webp", "#FA3710"], ["Conectar", "criatura-nautilo.webp", "#01DAC7"], ["Transformar", "criatura-flores.webp", "#005BFC"], ["Cuidar", "patron-amarillo.webp", "#FED108"], ["Celebrar", "organismo-rosa.png", "#FF0099"]];
  const LENTES = [{ label: "Hacer", follow: true, rx: 0.15, ry: 0.4, rot: 0.2 }];          // un solo círculo: es el mouse

  /* ---------- estructura ---------- */
  hero.classList.add("hero--rev");
  h1.classList.add("sr-only");                                              // el título sigue para lectores de pantalla y buscadores
  const rev = document.createElement("div");
  rev.className = "rev"; rev.setAttribute("aria-hidden", "true");
  rev.innerHTML = `<p class="rev__pre">EL CAMBIO SE</p>
    <div class="rev__stage">
      <div class="rev__base">ACTIVA</div>
      <div class="rev__lay" data-i="0">${FONDOS.map((f, k) => `<div class="rev__txt${k ? "" : " is-on"}" style="background-image:url(${G}${f[1]}), linear-gradient(120deg, ${f[2]}, #FFD84A)">ACTIVA</div>`).join("")}</div>
      ${LENTES.map((l, i) => `<div class="rev__ring${l.follow ? " is-follow" : ""}" data-i="${i}"><span class="rev__lbl">${l.label}</span></div>`).join("")}
    </div>`;
  content.insertBefore(rev, h1);
  const count = hero.querySelector(".count"), facts = hero.querySelector(".hero__facts");
  if (count && facts) content.insertBefore(count, facts);
  if (facts) facts.hidden = true;                                           // solo EL CAMBIO SE, ACTIVA y el contador                    // el contador va justo debajo de ACTIVA

  /* ---------- entrada: las letras aparecen una a una ---------- */
  if (!isCalm()) {
    hero.classList.add("rev-anim");
    const pre = rev.querySelector(".rev__pre"), base = rev.querySelector(".rev__base");
    const start = () => {
      if (hero.classList.contains("rev-go")) return;
      pre.innerHTML = [...pre.textContent].map((c, i) => `<span class="rev__ch" style="--i:${i}">${c === " " ? "&nbsp;" : c}</span>`).join("");
      // ACTIVA: cada letra queda exactamente donde la deja la palabra entera (con su kerning), medida con un Range
      const node = base.firstChild, word = node.textContent, br = base.getBoundingClientRect(), rg = document.createRange();
      const letters = [...word].map((c, i) => {
        rg.setStart(node, i); rg.setEnd(node, i + 1);
        const r = rg.getBoundingClientRect();
        return `<span class="rev__ch rev__ch--a" style="--i:${i};left:${((r.left - br.left) / br.width * 100).toFixed(3)}%">${c}</span>`;
      }).join("");
      base.classList.add("is-split"); base.insertAdjacentHTML("beforeend", letters);
      hero.classList.add("rev-go");
      setTimeout(() => hero.classList.add("rev-listo"), 2300);                // recién entonces se activa la revelación con el mouse
    };
    const ready = (document.fonts && document.fonts.load) ? Promise.race([document.fonts.load('900 100px "Inter"'), new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
    // si la bienvenida está abierta, la animación espera a que se cierre: así se ve recién cuando la persona llega a la portada
    const waitWelcome = () => new Promise((res) => {
      const d = document.querySelector("dialog.welcome");
      if (d && d.open) d.addEventListener("close", () => setTimeout(res, 250), { once: true });
      else if (root.classList.contains("welcome-pending")) setTimeout(() => waitWelcome().then(res), 200);
      else res();
    });
    Promise.all([ready, waitWelcome()]).then(() => requestAnimationFrame(start));
  } else hero.classList.add("rev-listo");

  const stage = rev.querySelector(".rev__stage");
  const txts = [...rev.querySelectorAll(".rev__txt")], lbl = rev.querySelector(".rev__lbl");
  let cur = 0;
  setInterval(() => { if (isCalm()) return; txts[cur].classList.remove("is-on"); cur = (cur + 1) % txts.length; txts[cur].classList.add("is-on"); lbl.textContent = FONDOS[cur][0]; }, 2800);   // el círculo va mostrando una gráfica distinta
  const lays = [...rev.querySelectorAll(".rev__lay")], rings = [...rev.querySelectorAll(".rev__ring")];

  /* ---------- animación de los círculos ---------- */
  let W = 0, H = 0, running = false, last = 0, t = 0, visible = true;
  const ptr = { x: 0.5, y: 0.5, set: false };
  const N = 44;
  function size() { const r = stage.getBoundingClientRect(); W = r.width; H = r.height; }
  size(); new ResizeObserver(size).observe(stage);
  hero.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect(); if (!r.width) return;
    ptr.x = (e.clientX - r.left) / r.width; ptr.y = (e.clientY - r.top) / r.height; ptr.set = true;
  }, { passive: true });
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; go(); }).observe(hero);
  document.addEventListener("visibilitychange", go);
  function go() { const want = visible && !document.hidden; if (want && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); } else if (!want) running = false; }

  const S = LENTES.map((l, i) => ({ x: 0.5, y: 0.5, vx: 0, vy: 0 }));
  function place(l, i, calm) {
    let cx, cy;
    if (l.follow) {                                                          // el círculo "Celebrar" persigue al mouse con elasticidad
      const tx = ptr.set ? ptr.x : 0.5 + 0.3 * Math.sin(t * 0.5), ty = ptr.set ? ptr.y : 0.5 + 0.2 * Math.cos(t * 0.42);
      S[i].vx += (tx - S[i].x) * 0.06; S[i].vy += (ty - S[i].y) * 0.06; S[i].vx *= 0.82; S[i].vy *= 0.82; S[i].x += S[i].vx; S[i].y += S[i].vy;
      cx = S[i].x * W; cy = S[i].y * H;
    } else {
      const k = calm ? 0 : t;
      cx = W * (0.5 + l.ax * Math.sin(l.wx * k + l.px) + 0.04 * Math.sin(l.wy * k * 2.3));
      cy = H * (0.5 + l.ay * Math.sin(l.wy * k + l.py));
    }
    const breathe = calm ? 1 : 1 + 0.09 * Math.sin(t * 1.7 + i * 1.3);                      // el círculo respira
    const rx = l.rx * W * breathe * 1.1, ry = l.ry * H * (2 - breathe) * 1.1;
    const ang = l.rot * (calm ? 1 : Math.sin(t * 0.55 + i) * 0.9 + 0.4);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    // sin borde: una máscara con bordes suaves deja ver la tipografía de abajo donde pasa el mouse
    const m = "radial-gradient(ellipse " + rx.toFixed(0) + "px " + ry.toFixed(0) + "px at " + cx.toFixed(0) + "px " + cy.toFixed(0) + "px, #000 52%, rgba(0,0,0,.6) 76%, transparent 100%)";
    lays[i].style.webkitMaskImage = m; lays[i].style.maskImage = m;
  }
  function frame(now) {
    if (!running) return;
    t += Math.min(0.05, (now - last) / 1000); last = now;
    const calm = isCalm();
    LENTES.forEach((l, i) => place(l, i, calm));
    requestAnimationFrame(frame);
  }
  LENTES.forEach((l, i) => place(l, i, true));
  go();
})();
