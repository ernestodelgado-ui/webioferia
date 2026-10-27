/* =========================================================
   APPS · dos celulares con las apps funcionando adentro (iframes en vivo)
   Al llegar con el scroll, detrás de cada celular se abre un marco de vidrio hacia el costado y ahí aparece el texto.
   Capa final: para quitarla, borrar este archivo, appsdis.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const sec = document.querySelector('[data-render="apps"]');
  const A = window.BIOFERIA && window.BIOFERIA.apps;
  if (!sec || !A) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const URLS = { festival: "https://bioapp-lilac.vercel.app/", juego: "https://catalisis-one.vercel.app/" };
  const TXT = {
    festival: { tag: "App del festival", titulo: ["Bioferia en", "tu bolsillo"], boton: "Abrí la app", c: "#01DAC7" },
    juego: { tag: "App del juego", titulo: ["Catálisis en", "un juego"], boton: "Jugar ahora", c: "#FF00B2" },
  };
  const items = A.items.map((a) => ({ ...a, ...TXT[a.id], url: URLS[a.id] || a.url, poster: a.id === "juego" ? "assets/apps/juego-semilla.jpg" : "" }));
  sec.classList.add("ap");

  const panel = (a, side) => `
    <div class="ap__panel ap__panel--${side}" style="--c:${a.c}">
      <div class="ap__txt">
        <span class="ap__tag">${esc(a.tag)}</span>
        <h3 class="ap__t">${a.titulo.map((l) => `<span>${esc(l)}</span>`).join("")}</h3>
        <p class="ap__d">${esc(a.descripcion)}</p>
        <ul class="ap__l" role="list">${a.puntos.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <div class="ap__b">
          <a class="ap__btn ap__btn--w" href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.boton)}</a>
          <button type="button" class="ap__btn ap__btn--c" data-qr="${esc(a.id)}" aria-expanded="false">Código QR</button>
        </div>
        <figure class="ap__qr" hidden><img src="${esc(a.qr)}" alt="Código QR para abrir ${esc(a.titulo.join(" "))}" width="180" height="180" loading="lazy"><figcaption>Escaneá con la cámara</figcaption></figure>
      </div>
    </div>`;
  const phone = (a) => `
    <div class="ap__phone" data-app="${esc(a.id)}">
      <div class="ap__bezel"><span class="ap__notch" aria-hidden="true"></span>
        <div class="ap__screen">${a.poster ? `<button type="button" class="ap__poster" aria-label="Tocar para jugar"><img src="${esc(a.poster)}" alt="Pantalla de la semilla de Catálisis" draggable="false"><span>Tocá para jugar</span></button>` : ""}<iframe title="${esc(a.titulo.join(" "))} (demo en vivo)" data-src="${esc(a.url)}" allow="geolocation; clipboard-write" referrerpolicy="no-referrer"></iframe></div>
      </div>
    </div>`;

  sec.innerHTML = `
    <div class="ap__wrap">
      <header class="ap__head">
        <h2 class="ap__h" id="apps-title"><span class="ap__w"><i>Dos apps para vivir el</i></span> <span class="ap__w ap__w--p"><i>cambio</i></span></h2>
        <p class="ap__sub">${esc(A.texto)}</p>
      </header>
      <div class="ap__stage">
        ${panel(items[0], "l")}${panel(items[1], "r")}
        <div class="ap__phones">${items.map(phone).join("")}</div>
      </div>
    </div>`;

  /* ---------- el celular es de 390 × 844: se escala para entrar en el marco ---------- */
  const screens = [...sec.querySelectorAll(".ap__screen")], frames = [...sec.querySelectorAll("iframe")];
  const fit = () => screens.forEach((s) => { const k = s.clientWidth / 390; s.style.setProperty("--k", k.toFixed(4)); });
  fit(); new ResizeObserver(fit).observe(sec);

  /* ---------- las apps cargan recién cuando la sección está cerca ---------- */
  const load = () => frames.forEach((f) => { if (!f.src && f.dataset.src) f.src = f.dataset.src; });
  const calm = document.documentElement.classList.contains("menos-movimiento");
  if (!("IntersectionObserver" in window)) { load(); sec.classList.add("ap-in"); }
  else {
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { load(); io.disconnect(); } }, { rootMargin: "600px 0px" }).observe(sec);
    if (calm) sec.classList.add("ap-in");
    else new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { sec.classList.add("ap-in"); io.disconnect(); } }, { threshold: 0.3 }).observe(sec.querySelector(".ap__stage"));
  }
  sec.querySelectorAll(".ap__w").forEach((w, i) => w.style.setProperty("--d", 100 + i * 150 + "ms"));

  /* ---------- el juego arranca mostrando la semilla; al tocar, se juega en vivo ---------- */
  sec.querySelectorAll(".ap__poster").forEach((p) => p.addEventListener("click", () => p.classList.add("is-off")));

  /* ---------- QR a pedido ---------- */
  sec.addEventListener("click", (e) => {
    const b = e.target.closest("[data-qr]"); if (!b) return;
    const q = b.closest(".ap__txt").querySelector(".ap__qr"), on = q.hidden;
    q.hidden = !on; b.setAttribute("aria-expanded", String(on));
  });
})();
