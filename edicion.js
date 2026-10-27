/* =========================================================
   EDICIÓN · BIOFERIA 2027
   Pantalla debajo de la portada: foto del festival con degradé, edición, fechas, lugar, "2027" gigante y los dos botones.
   Capa final: para quitarla, borrar este archivo, edicion.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const hero = document.getElementById("festival") || document.querySelector(".hero");
  const C = window.BIOFERIA || null;
  if (!hero) return;
  const acc = (C && C.acciones) || {};
  const exp = acc.expositor || { label: "Quiero ser expositor", href: "https://www.bioferia.info/sumate" };
  const ent = acc.entradas || { label: "Entradas", estado: "Próximamente" };
  const s = document.createElement("section");
  s.className = "edic"; s.id = "edicion"; s.setAttribute("aria-label", "Edición 8, 9, 10 y 11 de abril de 2027");
  s.innerHTML = `
    <div class="edic__foto" aria-hidden="true"></div>
    <p class="edic__ano" aria-hidden="true"><span>20</span><span>27</span></p>
    <div class="wrap edic__in">
      <p class="edic__pill">Edición N° 8</p>
      <h2 class="edic__fecha">9, 10 y 11 de abril</h2>
      <p class="edic__lugar">Hipódromo de Palermo, Buenos Aires</p>
      <div class="edic__acts">
        ${ent.href ? `<a class="edic__btn edic__btn--blanco" href="${ent.href}" target="_blank" rel="noopener">${ent.label}</a>`
          : `<button type="button" class="edic__btn edic__btn--blanco" aria-disabled="true" disabled>${ent.label} · ${ent.estado || "Próximamente"}</button>`}
        <a class="edic__btn edic__btn--rosa" href="${exp.href}" target="_blank" rel="noopener">${exp.label}</a>
      </div>
    </div>`;
  hero.after(s);
})();
