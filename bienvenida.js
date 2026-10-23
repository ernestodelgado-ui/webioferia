/*
  BIENVENIDA · BIOFERIA 2027
  Mini video de apertura hecho solo con los elementos de la marca: cinco escenas (una por verbo)
  donde las criaturas crecen, vuelan y giran, y una tarjeta final "Activemos el cambio".
  - Se muestra una vez por visita (sessionStorage). Para verlo de nuevo: ?bienvenida en la dirección
    o "Ver la bienvenida" en el pie. ?bienvenida=anim fuerza la animación aunque el sistema pida menos movimiento.
  - Con "reducir movimiento" salta directo a la tarjeta final.
  - Se cierra con Saltar / Cerrar, Esc o los botones de la tarjeta.
  Tiempos: cada escena dura SCENE segundos (ver --scene en bienvenida.css, mismo valor).
*/
(function () {
  "use strict";

  const forceAnim = /[?&]bienvenida=anim/.test(location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !forceAnim;
  const START = new Date("2027-04-09T11:00:00-03:00").getTime();
  const G = "assets/graficas/";
  const T = "assets/texturas/";
  const SCENE = 1.25;                      // segundos por escena
  const FINAL_AT = 0.2 + 5 * SCENE;        // cuando se abre la tarjeta final

  // Cada escena: verbo, elemento, color y las piezas de la marca que se mueven en ella.
  const steps = [
    { verbo: "Hacer", color: "rojo", palabra: G + "palabras/fuego.png", wipe: "l",
      layers: [[T + "patron-organico.jpg", "l-tex l-tex--ink"], [G + "criatura-flores.webp", "l-flor l-flor--a"], [G + "criatura-flores.webp", "l-flor l-flor--b"], [G + "organismo-rosa.png", "l-spin l-spin--a"]] },
    { verbo: "Conectar", color: "turquesa", palabra: G + "palabras/aire.png", wipe: "r",
      layers: [[G + "libelula-trama.png", "l-tex l-tex--drift"], [G + "criatura-libelula-simetrica.png", "l-fly l-fly--a"], [G + "criatura-libelula-simetrica.png", "l-fly l-fly--b"], [G + "criatura-libelula-simetrica.png", "l-fly l-fly--c"]] },
    { verbo: "Transformar", color: "azul", palabra: G + "palabras/agua.png", wipe: "l",
      layers: [[T + "patron-organico.jpg", "l-tex l-tex--screen"], [G + "criatura-nautilo.webp", "l-nau l-nau--a"], [G + "criatura-nautilo.webp", "l-nau l-nau--b"]] },
    { verbo: "Cuidar", color: "amarillo", palabra: G + "palabras/tierra.png", wipe: "r",
      layers: [[T + "troncos.jpg", "l-tex l-tex--ink"], [G + "criatura-ramas.webp", "l-grow l-grow--a"], [G + "criatura-ramas.webp", "l-grow l-grow--b"]] },
    { verbo: "Celebrar", color: "rosa", palabra: G + "palabras/corazon.png", wipe: "l",
      layers: [[G + "bioferia-grunge.png", "l-grunge"], [G + "bioferia-collage.webp", "l-pop"], [G + "organismo-rosa.png", "l-spin l-spin--b"], [G + "activa-blanco-rosa.png", "l-activa"]] },
  ];

  function seen() { try { return sessionStorage.getItem("bf-bienvenida") === "1"; } catch (e) { return false; } }
  function mark() { try { sessionStorage.setItem("bf-bienvenida", "1"); } catch (e) { /* sin almacenamiento: se muestra cada vez */ } }

  const forced = /[?&]bienvenida\b/.test(location.search);
  const dlg = document.createElement("dialog");
  dlg.className = "welcome" + (forceAnim ? " force-anim" : "");
  dlg.setAttribute("aria-labelledby", "w-title");

  const days = Math.max(0, Math.ceil((START - Date.now()) / 864e5));
  const countTxt = days > 0 ? `Faltan <strong>${days} días</strong>` : "Ya llegó";

  dlg.innerHTML = `
    <div class="welcome__stage">
      <div class="welcome__floods" aria-hidden="true">
        ${steps.map((s, i) => `
          <div class="flood bg-${s.color} wipe-${s.wipe}" style="--i:${i}; --len:${s.verbo.length}">
            <div class="flood__world">
              <div class="flood__marquee"><span>${(s.verbo + " ").repeat(8)}</span></div>
              ${s.layers.map(([src, cls]) => `<img class="layer ${cls}" src="${src}" alt="" draggable="false">`).join("")}
            </div>
            <div class="flood__txt">
              <img class="flood__elem" src="${s.palabra}" alt="" draggable="false">
              <span class="flood__verbo">${[...s.verbo].map((c, k) => `<i style="--l:${k}">${c}</i>`).join("")}</span>
            </div>
          </div>`).join("")}
        <ol class="welcome__steps">${steps.map((s, i) => `<li class="bg-${s.color}" style="--i:${i}"></li>`).join("")}</ol>
      </div>
      <div class="welcome__final">
        <img class="wf__tex wf__tex--a" src="${G}bioferia-collage.webp" alt="" aria-hidden="true" draggable="false">
        <img class="wf__tex wf__tex--b" src="${G}criatura-flores.webp" alt="" aria-hidden="true" draggable="false">
        <img class="wf__tex wf__tex--c" src="${G}criatura-libelula-simetrica.png" alt="" aria-hidden="true" draggable="false">
        <img class="wf__tex wf__tex--d" src="${G}criatura-ramas.webp" alt="" aria-hidden="true" draggable="false">
        <div class="wf__card">
          <p class="wf__chip" style="--k:0">Bienvenida · 8.ª edición</p>
          <h2 class="wf__title" id="w-title">
            <span class="wf__w" style="--k:1">Activemos</span>
            <span class="wf__w" style="--k:2">el</span>
            <span class="wf__w wf__w--em" style="--k:3">cambio<i>.</i></span>
          </h2>
          <p class="wf__text" style="--k:4">Tres días para hacer, conectar, transformar, cuidar y celebrar. <strong>El cambio empieza con vos.</strong></p>
          <ul class="wf__dots" aria-hidden="true" style="--k:5">${steps.map((s) => `<li class="bg-${s.color}"></li>`).join("")}</ul>
          <p class="wf__meta" style="--k:6"><span>9, 10 y 11 de abril de 2027</span><span>Hipódromo de Palermo</span><span>${countTxt}</span></p>
          <div class="wf__actions" style="--k:7">
            <button type="button" class="btn btn--go" data-go="top">¡Entrar a Bioferia!</button>
            <button type="button" class="btn btn--soft" data-go="agenda">Ver la agenda</button>
          </div>
        </div>
      </div>
      <button type="button" class="welcome__close" data-close>Saltar <span aria-hidden="true">›</span></button>
    </div>`;
  dlg.style.setProperty("--scene", SCENE + "s");
  dlg.style.setProperty("--final-at", FINAL_AT + "s");
  document.body.append(dlg);

  const close = dlg.querySelector("[data-close]");
  let timer = 0;

  function finish() {
    dlg.classList.add("is-final");
    close.innerHTML = 'Cerrar <span aria-hidden="true">×</span>';
  }

  function open() {
    mark();
    document.documentElement.classList.add("welcome-open");
    dlg.showModal();
    if (reduce) { dlg.classList.add("is-skip"); finish(); return; }
    // fuerza el reinicio de las animaciones
    dlg.classList.remove("is-playing", "is-final", "is-skip");
    void dlg.offsetWidth;
    dlg.classList.add("is-playing");
    timer = window.setTimeout(finish, (FINAL_AT + 0.9) * 1000);
  }

  function skip() {
    window.clearTimeout(timer);
    if (!dlg.classList.contains("is-final")) { dlg.classList.add("is-skip"); finish(); }
    else shut();
  }

  function shut(target) {
    window.clearTimeout(timer);
    dlg.classList.add("is-leaving");
    const done = () => {
      dlg.close();
      dlg.classList.remove("is-leaving", "is-playing", "is-final", "is-skip");
      document.documentElement.classList.remove("welcome-open");
      if (target === "agenda") { const a = document.getElementById("agenda"); if (a) a.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
      else window.scrollTo({ top: 0, behavior: "auto" });
      close.innerHTML = 'Saltar <span aria-hidden="true">›</span>';
    };
    if (reduce) done(); else window.setTimeout(done, 380);
  }

  close.addEventListener("click", skip);
  dlg.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => shut(b.dataset.go)));
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); skip(); });

  // acceso para volver a verla
  const legal = document.querySelector(".footer__legal");
  if (legal) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "welcome__again"; b.textContent = "Ver la bienvenida";
    b.addEventListener("click", open);
    legal.append(b);
  }

  // precarga de las imágenes de la secuencia para que no entren tarde
  const pre = [...new Set(steps.flatMap((s) => s.layers.map((l) => l[0]).concat([s.palabra])).concat([G + "criatura-flores.webp", G + "criatura-ramas.webp"]))];
  Promise.all(pre.map((src) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = res; i.src = src; })))
    .then(() => {
      if (!forced && (seen() || location.hash)) return;
      window.setTimeout(open, 350);
    });
})();
