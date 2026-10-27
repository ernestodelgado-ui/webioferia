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
  // La bienvenida SIEMPRE se muestra con movimiento (es el momento de apertura y tiene botón para saltarla).
  // Quien prefiere menos movimiento lo elige con el botón "Reducir movimiento"; la elección se recuerda.
  const root = document.documentElement;
  function saveCalm(v) { try { localStorage.setItem("bf-calma", v ? "1" : "0"); } catch (e) { /* sin almacenamiento */ } root.classList.toggle("menos-movimiento", v); }
  let calm = root.classList.contains("menos-movimiento") && !forceAnim;
  const START = new Date("2027-04-09T11:00:00-03:00").getTime();
  const G = "assets/graficas/";
  const T = "assets/texturas/";
  const SCENE = 1.5;                      // segundos por escena
  const FINAL_AT = 0.1 + 5 * SCENE;        // cuando se abre la tarjeta final

  // Cada escena: un verbo, su elemento, su color y su criatura (que se mezcla sobre el color).
  const steps = [
    { verbo: "Hacer", elem: "Fuego", color: "rojo", art: "assets/collage/fuego.jpg", palabra: "assets/collage/fuego.jpg", layers: [["assets/collage/fuego.jpg"]] },
    { verbo: "Conectar", elem: "Aire", color: "turquesa", art: "assets/collage/aire.jpg", palabra: "assets/collage/aire.jpg", layers: [["assets/collage/aire.jpg"]] },
    { verbo: "Transformar", elem: "Agua", color: "azul", art: "assets/collage/agua.jpg", palabra: "assets/collage/agua.jpg", layers: [["assets/collage/agua.jpg"]] },
    { verbo: "Cuidar", elem: "Tierra", color: "amarillo", art: "assets/collage/tierra.jpg", palabra: "assets/collage/tierra.jpg", layers: [["assets/collage/tierra.jpg"]] },
    { verbo: "Celebrar", elem: "Corazón", color: "rosa", art: "assets/collage/corazon.jpg", palabra: "assets/collage/corazon.jpg", layers: [["assets/collage/corazon.jpg"]] },
  ];

  function seen() { try { return sessionStorage.getItem("bf-bienvenida") === "1"; } catch (e) { return false; } }
  function mark() { try { sessionStorage.setItem("bf-bienvenida", "1"); } catch (e) { /* sin almacenamiento: se muestra cada vez */ } }

  const forced = /[?&]bienvenida\b/.test(location.search);
  const dlg = document.createElement("dialog");
  dlg.className = "welcome force-anim" + (calm ? " calm" : "");
  dlg.setAttribute("aria-labelledby", "w-title");

  const days = Math.max(0, Math.ceil((START - Date.now()) / 864e5));
  const countTxt = days > 0 ? `Faltan <strong>${days} días</strong>` : "Ya llegó";

  dlg.innerHTML = `
    <div class="welcome__stage">
      <p class="wl__logo" aria-hidden="true"><b>BIO</b>FERIA</p>
      <p class="wl__count" aria-hidden="true"><span>2027</span></p>
      <video class="wl__vid" src="assets/video/bienvenida.mp4" poster="assets/video/bienvenida-poster.jpg" muted playsinline loop preload="auto" aria-hidden="true" tabindex="-1"></video>
      <svg class="wl__svg" width="0" height="0" aria-hidden="true" focusable="false"><filter id="wl-rgb" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feOffset in="r" dx="4" dy="0" result="ro"><animate attributeName="dx" values="3;9;2;-4;6;3" dur="1.6s" repeatCount="indefinite"/></feOffset>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/><feOffset in="b" dx="-4" dy="0" result="bo"><animate attributeName="dx" values="-3;-9;-2;4;-6;-3" dur="1.6s" repeatCount="indefinite"/></feOffset>
        <feBlend in="ro" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="bo" mode="screen"/></filter></svg>
      <div class="wl__scenes" aria-hidden="true">
        ${steps.map((s, i) => `
          <div class="wl__s wl__s--${s.color}" style="--i:${i}">
                        <span class="wl__v">${[...s.verbo].map((ch, k) => `<i style="--l:${k}">${ch}</i>`).join("")}</span>
          </div>`).join("")}
        <ol class="wl__bar">${steps.map((s, i) => `<li class="bg-${s.color}" style="--i:${i}"></li>`).join("")}</ol>
      </div>
      <div class="welcome__final">
        <div class="wl__fin">
          <p class="wl__chip" style="--k:0">Bienvenida · 8.ª edición</p>
          <h2 class="wl__t" id="w-title"><span style="--k:1">ACTIVEMOS</span><b style="--k:2">EL CAMBIO</b></h2>
          <p class="wl__txt" style="--k:3">Tres días para hacer, conectar, transformar, cuidar y celebrar. <strong>El cambio empieza con vos.</strong></p>
          <ul class="wl__dots" aria-hidden="true" style="--k:4">${steps.map((s) => `<li class="bg-${s.color}"></li>`).join("")}</ul>
          <p class="wl__meta" style="--k:5"><span>9, 10 y 11 de abril de 2027</span><span>Hipódromo de Palermo</span><span>${countTxt}</span></p>
          <div class="wl__act" style="--k:6">
            <button type="button" class="wl__go" data-go="top">¡Entrar a Bioferia!</button>
            <button type="button" class="wl__ag" data-go="agenda">Ver la agenda</button>
          </div>
        </div>
      </div>
      <button type="button" class="welcome__calm" data-calm aria-pressed="${calm}">${calm ? "Activar movimiento" : "Reducir movimiento"}</button>
      <button type="button" class="welcome__close" data-close>Saltar <span aria-hidden="true">›</span></button>
    </div>`;
  dlg.style.setProperty("--scene", SCENE + "s");
  dlg.style.setProperty("--final-at", FINAL_AT + "s");
  document.body.append(dlg);

  const close = dlg.querySelector("[data-close]");
  const vid = dlg.querySelector(".wl__vid");
  let timer = 0;

  function finish() {
    dlg.classList.add("is-final");
    close.innerHTML = 'Cerrar <span aria-hidden="true">×</span>';
  }

  // 1) abrir de inmediato (pantalla de color, nada de la página detrás) y 2) arrancar la secuencia cuando las piezas estén cargadas.
  let ready = false;
  function play() {
    if (ready) return;
    ready = true;
    if (vid) { try { vid.currentTime = 0; } catch (e) { /* aún sin cargar */ } if (calm) vid.pause(); else vid.play().catch(() => {}); }
    dlg.classList.remove("is-playing", "is-final", "is-skip");
    void dlg.offsetWidth;
    dlg.classList.add("is-playing");
    timer = window.setTimeout(finish, (FINAL_AT + 0.9) * 1000);
  }
  function open() {
    mark();
    ready = false;
    document.documentElement.classList.add("welcome-open");
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.remove("welcome-pending");
    // arranca cuando están las imágenes, o a más tardar al 1,1 s aunque la conexión sea lenta (mientras tanto se ve la marca)
    const wait = new Promise((res) => window.setTimeout(res, 1100));
    Promise.race([preloaded, wait]).then(play);
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
      dlg.close(); if (vid) vid.pause();
      dlg.classList.remove("is-leaving", "is-playing", "is-final", "is-skip");
      document.documentElement.classList.remove("welcome-open");
      if (target === "agenda") { const a = document.getElementById("agenda"); if (a) a.scrollIntoView({ behavior: root.classList.contains("menos-movimiento") ? "auto" : "smooth" }); }
      else window.scrollTo({ top: 0, behavior: "auto" });
      close.innerHTML = 'Saltar <span aria-hidden="true">›</span>';
    };
    if (root.classList.contains("menos-movimiento")) done(); else window.setTimeout(done, 380);
  }

  const calmBtn = dlg.querySelector("[data-calm]");
  calmBtn.addEventListener("click", () => {
    calm = !calm;
    saveCalm(calm);
    dlg.classList.toggle("calm", calm);
    calmBtn.setAttribute("aria-pressed", String(calm));
    calmBtn.textContent = calm ? "Activar movimiento" : "Reducir movimiento";
    // reinicia la secuencia en el modo elegido
    window.clearTimeout(timer);
    ready = false;
    play();
  });
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
    // Preferencia de movimiento de toda la página (por defecto, con movimiento). Se recuerda y recarga para aplicarse.
    const m = document.createElement("button");
    m.type = "button"; m.className = "welcome__again";
    const label = () => { m.textContent = root.classList.contains("menos-movimiento") ? "Activar movimiento" : "Reducir movimiento"; m.setAttribute("aria-pressed", String(root.classList.contains("menos-movimiento"))); };
    label();
    m.addEventListener("click", () => { saveCalm(!root.classList.contains("menos-movimiento")); label(); location.reload(); });
    legal.append(m);
  }

  // precarga de las imágenes de la secuencia para que no entren tarde
  const pre = [...new Set(steps.flatMap((s) => s.layers.map((l) => l[0]).concat([s.palabra])).concat(["assets/collage/fuego.jpg", G + "criatura-ramas.webp"]))];
  const preloaded = Promise.all(pre.map((src) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = res; i.src = src; })));
  // se abre ya mismo, sin esperar la carga: lo primero que se ve es la bienvenida
  if (!forced && (seen() || location.hash)) document.documentElement.classList.remove("welcome-pending");
  else open();
})();
