/* =========================================================
   VUELVE EL FESTIVAL · el texto queda en caja
   - "Latinoamérica." se agranda hasta terminar a la altura de "sustentabilidad".
   - "Vení a vivirlo." se agranda hasta ocupar todo el ancho de "Que no te lo cuenten."
   Capa final: para quitarla, borrar este archivo y su línea en index.html.
   ========================================================= */
(function () {
  const sec = document.getElementById("vuelve");
  if (!sec) return;
  const h = sec.querySelector(".fv__titulo");
  const words = h ? [...h.querySelectorAll(".fv__w")] : [];
  const sust = words.find((w) => /sustentabilidad/i.test(w.textContent));
  const lat = words.find((w) => /latinoam/i.test(w.textContent));
  const lines = [...sec.querySelectorAll(".fv__cierre > span")];
  if (lat) { lat.style.whiteSpace = "nowrap"; if (!lat.previousElementSibling || lat.previousElementSibling.tagName !== "BR") lat.insertAdjacentHTML("beforebegin", "<br>"); }   // siempre en su propia línea, debajo de "más grande de"
  lines.forEach((l) => { l.style.justifySelf = "start"; l.style.width = "max-content"; l.style.whiteSpace = "nowrap"; });

  function fitLat() {
    if (!h || !sust || !lat) return;
    for (let k = 0; k < 4; k++) {                                         // se repite: al cambiar el tamaño el título se reacomoda
      lat.style.fontSize = k ? lat.style.fontSize : "";
      const base = parseFloat(getComputedStyle(lat).fontSize), hr = h.getBoundingClientRect(), lr = lat.getBoundingClientRect(), sr = sust.getBoundingClientRect();
      if (!lr.width || !sr.width) return;
      const target = Math.min(sr.right - lr.left, hr.width);
      if (Math.abs(target - lr.width) < 1) return;
      lat.style.fontSize = (base * target / lr.width).toFixed(2) + "px";
    }
  }
  function fitCierre() {
    if (lines.length < 2) return;
    const a = lines[0], b = lines[1];
    b.style.fontSize = "";
    for (let k = 0; k < 4; k++) {
      const base = parseFloat(getComputedStyle(b).fontSize), wa = a.getBoundingClientRect().width, wb = b.getBoundingClientRect().width;
      if (!wa || !wb || Math.abs(wa - wb) < 1) return;
      b.style.fontSize = (base * wa / wb).toFixed(2) + "px";
    }
  }
  const fit = () => { fitLat(); fitCierre(); };
  fit(); new ResizeObserver(fit).observe(sec);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
