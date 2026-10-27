/* =========================================================
   VUELVE EL FESTIVAL · BIOFERIA 2027
   Pantalla debajo de la edición: los cinco verbos, la foto en una card con la forma rosa dibujándose alrededor, y el texto.
   Todo aparece animado al scrollear (verbos, forma, card, título palabra por palabra, párrafo y cierre).
   Capa final: para quitarla, borrar este archivo, festival.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const prev = document.getElementById("edicion") || document.querySelector(".hero");
  if (!prev) return;
  const VERBOS = [["Celebrar", "rosa"], ["Hacer", "rojo"], ["Cuidar", "amarillo"], ["Transformar", "azul"], ["Conectar", "turquesa"]];
  const words = (t, cls) => t.split(" ").map((w) => `<span class="fv__w${cls ? " " + cls : ""}"><i>${w}</i></span>`).join(" ");
  const s = document.createElement("section");
  s.className = "fv"; s.id = "vuelve"; s.setAttribute("data-nofade", ""); s.setAttribute("aria-labelledby", "fv-titulo");
  s.innerHTML = `
    <div class="fv__banda" role="group" aria-label="Celebrar, hacer, cuidar, transformar, conectar"><div class="fv__pista">${[0, 1, 2, 3].map((k) => `<ul class="fv__verbos" role="list"${k ? " aria-hidden=\"true\"" : ""}>${VERBOS.map(([v, c]) => `<li class="fv__verbo fv__verbo--${c}">${v}</li>`).join("")}</ul>`).join("")}</div></div>
    <div class="fv__cuerpo">
      <div class="fv__izq">
        <img class="fv__forma" src="assets/graficas/forma-rosa.png" alt="" aria-hidden="true" draggable="false">
        <figure class="fv__card"><img src="assets/fotos/baile.jpg" alt="Público bailando en Bioferia, en el Hipódromo de Palermo" loading="lazy" draggable="false"></figure>
      </div>
      <div class="fv__der">
        <h2 class="fv__titulo" id="fv-titulo">${words("Vuelve el festival de sustentabilidad más grande")} ${words("de Latinoamérica.", "fv__w--rosa")}</h2>
        <p class="fv__txt">Música en vivo, feria de emprendedores, charlas y experiencias, gastronomía consciente, empresas de triple impacto, ONGs y referentes, todos reunidos en un mismo lugar para celebrar el cambio y vivir nuevas formas de cuidar el planeta y las personas.</p>
        <p class="fv__cierre"><span>Que no te lo cuenten.</span><span class="fv__cierre--rosa">Vení a vivirlo.</span></p>
      </div>
    </div>`;
  prev.after(s);

  // palabras del título: cada una con su retraso
  s.querySelectorAll(".fv__w").forEach((w, i) => w.style.setProperty("--d", 260 + i * 70 + "ms"));
  const card = s.querySelector(".fv__card"), forma = s.querySelector(".fv__forma");
  const root = document.documentElement;
  if (!("IntersectionObserver" in window) || root.classList.contains("menos-movimiento")) { s.classList.add("is-in", "is-static"); return; }
  new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { s.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.22 }).observe(s);

  // la card y la forma se mueven un poco distinto al scrollear (profundidad suave)
  let tick = false;
  function par() {
    tick = false; const r = s.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;                 // -1..1 alrededor del centro de la pantalla
    card.style.setProperty("--py", (p * -34).toFixed(1) + "px");
    forma.style.setProperty("--py", (p * 22).toFixed(1) + "px");
  }
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(par); } }, { passive: true });
  par();
})();
