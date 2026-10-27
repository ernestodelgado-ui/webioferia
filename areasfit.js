/* =========================================================
   ÁREAS · "Descubrí las 11 áreas temáticas" llega hasta donde termina la línea más larga del texto.
   Capa final: para quitarla, borrar este archivo y su línea en index.html.
   ========================================================= */
(function () {
  const sec = document.getElementById("areas");
  const h = sec && sec.querySelector(".sec-head .h2");
  const p = sec && sec.querySelector(".sec-head .sec-head__text");
  if (!h || !p) return;
  const em = h.querySelector(".em");
  h.innerHTML = `<span class="af__t">Descubrí las 11 áreas <b class="af__em">${em ? em.textContent : "temáticas"}</b></span>`;
  const t = h.querySelector(".af__t");
  function fit() {
    if (innerWidth < 760) { h.style.fontSize = ""; return; }
    h.style.fontSize = "100px";
    const pr = p.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(p);
    const ink = Math.max(...[...rg.getClientRects()].map((r) => r.right)) - pr.left;          // hasta donde llega la línea más larga del texto
    const wt = t.getBoundingClientRect().width, wp = ink;
    if (!wt || !wp) return;
    h.style.fontSize = (100 * wp / wt).toFixed(2) + "px";
  }
  fit(); new ResizeObserver(fit).observe(sec);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
