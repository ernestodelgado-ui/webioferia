/* MODO 3D · botón "Pasar a 3D": abre el universo de la web (universo3d.html) en pantalla completa, en la sección que se estaba mirando. */
(function () {
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "m3d-btn"; btn.setAttribute("aria-label", "Pasar toda la web a 3D");
  btn.innerHTML = "<b>3D</b> Pasar a 3D";
  const wrap = document.createElement("div");
  wrap.className = "m3d"; wrap.setAttribute("aria-hidden", "true");
  const fr = document.createElement("iframe");
  fr.title = "Bioferia en 3D"; fr.setAttribute("allow", "fullscreen; autoplay");
  wrap.appendChild(fr);
  document.body.append(btn, wrap);

  // estación del universo que corresponde a la sección visible (1 = portada)
  const MAPA = { festival: 1, edicion: 2, vuelve: 3, catalizadores: 4, identidad: 5, areas: 6, espacios: 7, galeria: 8, videos: 9, agenda: 10, impacto: 11, app: 12, contacto: 13 };
  function estacion() {
    let mejor = 1, dist = 1e9; const mid = innerHeight * 0.4;
    Object.keys(MAPA).forEach((id) => { const el = document.getElementById(id); if (!el) return; const r = el.getBoundingClientRect(); const d = r.top <= mid && r.bottom > mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid)); if (d < dist) { dist = d; mejor = MAPA[id]; } });
    return mejor;
  }
  const VOLVER = [null, "festival", "edicion", "vuelve", "catalizadores", "identidad", "areas", "espacios", "galeria", "videos", "agenda", "impacto", "app", "contacto", "contacto"];
  let yAntes = 0;
  function abrir() {
    yAntes = scrollY;
    const noche = document.documentElement.dataset.tema === "oscuro";
    fr.src = "universo3d.html?" + (noche ? "negro" : "blanco") + "#g" + estacion();
    wrap.classList.add("on"); wrap.setAttribute("aria-hidden", "false"); document.documentElement.classList.add("m3d-lock");
  }
  function cerrar(est) {
    wrap.classList.remove("on"); wrap.setAttribute("aria-hidden", "true"); document.documentElement.classList.remove("m3d-lock");
    // vuelve a la sección del 3D en la que estaba la persona; si estaba en el universo, al mismo lugar de antes
    const el = est && document.getElementById(VOLVER[est]);
    if (el) { const h = document.querySelector("header"); const off = h ? h.getBoundingClientRect().height : 0; scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + scrollY - off), behavior: "instant" }); } else scrollTo({ top: yAntes, behavior: "instant" });
    setTimeout(() => { if (!wrap.classList.contains("on")) fr.src = "about:blank"; }, 600);
    btn.focus({ preventScroll: true });
  }
  btn.addEventListener("click", abrir);
  addEventListener("message", (e) => { const d = e.data; if (d === "cerrar3d") cerrar(); else if (d && d.t === "cerrar3d") cerrar(d.e); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && wrap.classList.contains("on")) cerrar(); });
})();
