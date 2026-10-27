/* =========================================================
   APRETAME · BIOFERIA 2027
   Cuando la persona termina de llenar el formulario de contacto aparece un botón de vidrio rosado. Si lo aprieta, la página empieza a fallar
   (glitch: la imagen se parte, se desfasa en colores, tiembla) y se apaga como una tele antigua: queda una línea, un punto y negro.
   Entonces aparece "Todas nuestras acciones tienen consecuencia." Con "Activá el cambio" la pantalla se vuelve a encender y todo sigue normal.
   Capa final: para quitarla, borrar este archivo, notocar.css y sus dos líneas en index.html.
   ========================================================= */
(function () {
  const root = document.documentElement;
  const isCalm = () => root.classList.contains("menos-movimiento");
  const form = document.getElementById("contact-form");
  if (!form) return;

  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "nt-btn"; btn.hidden = true;
  btn.innerHTML = '<span class="nt-btn__t">Apretame</span>';
  document.body.appendChild(btn);
  const label = btn.querySelector(".nt-btn__t");

  const ov = document.createElement("div");
  ov.className = "nt-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Todas nuestras acciones tienen consecuencia");
  ov.hidden = true;
  ov.innerHTML = `<span class="nt-tv nt-tv--t"></span><span class="nt-tv nt-tv--b"></span><span class="nt-line"></span><span class="nt-dot"></span>
    <div class="nt-scan" aria-hidden="true"></div>
    <div class="nt-msg"><p class="nt-msg__t">Todas nuestras acciones tienen <em>consecuencia.</em></p>
    <button type="button" class="nt-msg__b">Activá el cambio</button></div>`;
  document.body.appendChild(ov);
  const msg = ov.querySelector(".nt-msg"), go = ov.querySelector(".nt-msg__b");

  let phase = "off", timers = [], done = false, thanksT = 0;
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  try { done = sessionStorage.getItem("bf-cambio") === "1"; } catch (e) { /* sin almacenamiento */ }

  /* ---------- aparece cuando el formulario está completo ---------- */
  const fields = [...form.querySelectorAll("input[required], select[required], textarea[required]")];
  const complete = () => fields.length && fields.every((f) => f.value.trim() && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value.trim())));
  function update() {
    const show = phase === "off" && !done && complete() && !document.querySelector("dialog.welcome[open]") && !root.classList.contains("inm");
    btn.hidden = false;
    btn.classList.toggle("is-on", show); btn.setAttribute("aria-hidden", show ? "false" : "true"); btn.tabIndex = show ? 0 : -1;
  }
  form.addEventListener("input", update); form.addEventListener("change", update);
  update();

  /* ---------- la falla y el apagado ---------- */
  function enter() {
    if (phase !== "off") return;
    phase = "in"; btn.classList.remove("is-on"); btn.disabled = true;
    document.body.style.overflow = "hidden"; msg.classList.remove("is-on");
    ov.hidden = false; ov.className = "nt-ov";
    if (isCalm()) { ov.classList.add("is-black", "is-fast"); later(150, showMsg); return; }
    root.classList.add("nt-glitch");                                   // 1) empieza a fallar
    ov.classList.add("is-scan");
    later(1300, () => root.classList.add("nt-glitch2"));               //    cada vez peor
    later(2500, () => { root.classList.remove("nt-glitch", "nt-glitch2"); root.classList.add("nt-off"); ov.classList.add("is-off"); });   // 2) se apaga como una tele
    later(3500, () => { ov.classList.add("is-black"); });              // 3) queda el punto y negro total
    later(4000, showMsg);                                              // 4) aparece el mensaje
  }
  function showMsg() { if (phase !== "in") return; msg.classList.add("is-on"); go.focus({ preventScroll: true }); }

  function activate() {
    if (phase !== "in") return;
    phase = "out"; msg.classList.remove("is-on");
    document.dispatchEvent(new CustomEvent("cambio-activado"));        // las semillas lo celebran
    if (isCalm()) { later(50, finish); return; }
    ov.classList.add("is-on-again");                                   // la tele se vuelve a encender
    later(900, () => { root.classList.remove("nt-off"); root.classList.add("nt-glitch2"); });
    later(1500, () => root.classList.remove("nt-glitch2"));
    later(1800, finish);
  }
  function finish() {
    timers.forEach(clearTimeout); timers = [];
    root.classList.remove("nt-glitch", "nt-glitch2", "nt-off");
    ov.hidden = true; ov.className = "nt-ov"; document.body.style.overflow = "";
    btn.disabled = false; phase = "off"; done = true;
    try { sessionStorage.setItem("bf-cambio", "1"); } catch (e) { /* sin almacenamiento */ }
    // un cartelito de vidrio lo celebra unos segundos
    label.textContent = "Activaste el cambio, ¡bien ahí!"; btn.classList.add("is-thanks", "is-on");
    clearTimeout(thanksT); thanksT = setTimeout(() => { btn.classList.remove("is-on"); }, 5500);
  }
  btn.addEventListener("click", () => { if (!btn.classList.contains("is-thanks")) enter(); });
  go.addEventListener("click", activate);
  window.addEventListener("keydown", (e) => { if (phase === "in" && e.key === "Tab") { e.preventDefault(); go.focus(); } });
})();
