/* =========================================================
   COSMOS · BIOFERIA 2027
   El fondo del espacio: estrellas que vienen hacia vos mientras la cámara avanza, una nebulosa con los
   colores de la marca y un planeta lejano. En la portada es sutil; al "Entrar al espacio" se ve completo.
   Necesita espacio.js. Capa final: para quitarla, borrar este archivo y su <script> en index.html.
   ========================================================= */
(function () {
  document.addEventListener("espacio-listo", init, { once: true });
  const root = document.documentElement;
  const isCalm = () => root.classList.contains("menos-movimiento");
  const PAL = ["#FA3710", "#01DAC7", "#005BFC", "#FED108", "#FF0099"];
  const rnd = (a, b) => a + Math.random() * (b - a);

  function init() {
    const api = window.EspacioAPI, media = api.media;
    const cv = document.createElement("canvas");
    cv.className = "cosmos"; cv.setAttribute("aria-hidden", "true");
    media.insertBefore(cv, media.firstChild);
    const ctx = cv.getContext("2d");

    // nebulosa: se pinta una vez en baja resolución y se mueve despacio
    const neb = document.createElement("canvas"); neb.width = neb.height = 384;
    const nx = neb.getContext("2d");
    [[0.25, 0.3, 0.42, "#005BFC", 0.55], [0.72, 0.62, 0.46, "#FF0099", 0.4], [0.55, 0.2, 0.3, "#01DAC7", 0.3], [0.2, 0.78, 0.34, "#FED108", 0.18], [0.85, 0.2, 0.26, "#FA3710", 0.22]].forEach(([x, y, r, c, a]) => {
      const g = nx.createRadialGradient(x * 384, y * 384, 0, x * 384, y * 384, r * 384);
      g.addColorStop(0, c + Math.round(a * 255).toString(16).padStart(2, "0")); g.addColorStop(1, c + "00");
      nx.fillStyle = g; nx.fillRect(0, 0, 384, 384);
    });

    const stars = Array.from({ length: api.small ? 140 : 260 }, () => ({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(0.05, 1), c: Math.random() < 0.18 ? PAL[(Math.random() * 5) | 0] : "#FFFFFF", tw: rnd(0, 6.28) }));
    let W = 0, H = 0, DPR = 1, last = performance.now(), mx = 0, my = 0;
    function resize() { W = api.W || media.clientWidth; H = api.H || media.clientHeight; DPR = Math.min(1.5, devicePixelRatio || 1); cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); }
    new ResizeObserver(resize).observe(media); resize();
    window.addEventListener("pointermove", (e) => { const r = media.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = ((e.clientY - r.top) / r.height) * 2 - 1; }, { passive: true });

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const inm = root.classList.contains("inm"), calm = isCalm();
      if (!inm) { requestAnimationFrame(frame); return; }
      const t = now / 1000, k = inm ? 1 : 0.55;                           // en la portada es más sutil
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
      // nebulosa
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.55 * k;
      const S = Math.max(W, H) * 1.5;
      ctx.translate(W / 2 - mx * 18, H / 2 - my * 12); ctx.rotate(calm ? 0 : t * 0.012);
      ctx.drawImage(neb, -S / 2, -S / 2, S, S);
      ctx.rotate(calm ? 0 : -t * 0.03); ctx.globalAlpha = 0.3 * k; ctx.drawImage(neb, -S / 2.4, -S / 2.4, S / 1.2, S / 1.2);
      ctx.restore();
      // planeta lejano con anillo
      if (inm) {
        const px = W * 0.84 - mx * 26, py = H * 0.24 - my * 16, pr = Math.min(W, H) * 0.075;
        ctx.save(); ctx.translate(px, py);
        const g = ctx.createRadialGradient(-pr * 0.35, -pr * 0.4, pr * 0.1, 0, 0, pr);
        g.addColorStop(0, "#FFE9A8"); g.addColorStop(0.55, "#E8A33A"); g.addColorStop(1, "#7A3A12");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, pr, 0, 6.2832); ctx.fill();
        ctx.rotate(-0.35); ctx.strokeStyle = "rgba(254,209,8,.7)"; ctx.lineWidth = Math.max(2, pr * 0.09);
        ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.75, pr * 0.42, 0, 0.2, Math.PI - 0.2); ctx.stroke();       // la parte de atrás del anillo queda tapada por el planeta
        ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.75, pr * 0.42, 0, Math.PI + 0.2, 6.2832 - 0.2); ctx.stroke();
        ctx.restore();
      }
      // estrellas
      const speed = calm ? 0 : (api.fast ? 0.2 : 0.035);
      const cx = W / 2 - mx * 30, cy = H / 2 - my * 20, sc = Math.max(W, H) * 0.5;
      for (const s of stars) {
        const z0 = s.z; s.z -= speed * dt; if (s.z < 0.04) { s.z = 1; s.x = rnd(-1, 1); s.y = rnd(-1, 1); }
        const x1 = cx + (s.x / s.z) * sc * 0.18, y1 = cy + (s.y / s.z) * sc * 0.18;
        if (x1 < -20 || x1 > W + 20 || y1 < -20 || y1 > H + 20) { s.z = 1; s.x = rnd(-1, 1); s.y = rnd(-1, 1); continue; }
        const a = (0.25 + (1 - s.z) * 0.75) * k * (0.75 + 0.25 * Math.sin(t * 2 + s.tw));
        ctx.strokeStyle = s.c; ctx.fillStyle = s.c; ctx.globalAlpha = Math.min(1, a);
        const sz = 0.4 + (1 - s.z) * 1.9;
        if (api.fast && speed > 0.1) {                                  // al volar rápido, las estrellas se estiran
          const x0 = cx + (s.x / z0) * sc * 0.18 * 0.985, y0 = cy + (s.y / z0) * sc * 0.18 * 0.985;
          ctx.lineWidth = sz; ctx.beginPath(); ctx.moveTo(x0 + (x1 - x0) * -1.5, y0 + (y1 - y0) * -1.5); ctx.lineTo(x1, y1); ctx.stroke();
        } else { ctx.beginPath(); ctx.arc(x1, y1, sz, 0, 6.2832); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
