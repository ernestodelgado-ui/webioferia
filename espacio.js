/* =========================================================
   ESPACIO 3D · HERO · BIOFERIA 2027
   En la portada, en lugar del video, las criaturas flotan en un espacio con profundidad real:
   la cámara avanza sola entre ellas y el mouse mueve la mirada. Con semillas.js se pueden agarrar y juntar.
   Usa three.js local (assets/vendor/three.min.js). Si el navegador no puede dibujar WebGL, queda el video.
   Capa final: para quitarla, borrar este archivo, semillas.js, juego.css y sus líneas en index.html.
   ========================================================= */
(function () {
  const hero = document.querySelector(".hero--video");
  const media = hero && hero.querySelector(".hero__media");
  if (!media) return;

  const root = document.documentElement;
  const isCalm = () => root.classList.contains("menos-movimiento");
  const COL = { fuego: "#FA3710", aire: "#01DAC7", agua: "#005BFC", tierra: "#FED108", corazon: "#FF0099" };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function start() {
    const s = document.createElement("script");
    s.src = "assets/vendor/three.min.js";
    s.onload = init;
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") setTimeout(start, 400); else window.addEventListener("load", () => setTimeout(start, 400));

  // ---- elementos sueltos ----
  const rr = (seed) => { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const LIGHT = "#F2F2EE";
  // los que en la app viven sobre el cuerpo (patrones, forma de estrella, onda, latido, chispa): piezas propias con el mismo lenguaje
  const SURFACE = {
    lattice(c, S, col, R) { c.strokeStyle = col; c.lineWidth = S * 0.007; const h = S * 0.075; for (let row = -6; row <= 6; row++) for (let cl = -6; cl <= 6; cl++) { const x = S / 2 + cl * h * 1.5 + (row % 2 ? h * 0.75 : 0), y = S / 2 + row * h * 0.87; if (Math.hypot(x - S / 2, y - S / 2) > S * 0.4) continue; c.beginPath(); for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.2832; k ? c.lineTo(x + Math.cos(a) * h * 0.5, y + Math.sin(a) * h * 0.5) : c.moveTo(x + Math.cos(a) * h * 0.5, y + Math.sin(a) * h * 0.5); } c.closePath(); c.stroke(); } },
    grain(c, S, col, R, rnd) { c.fillStyle = LIGHT; for (let i = 0; i < 220; i++) { const a = rnd() * 6.2832, d = Math.sqrt(rnd()) * S * 0.38; c.fillRect(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, S * 0.006 + rnd() * S * 0.014, S * 0.005 + rnd() * S * 0.006); } },
    spiral(c, S, col) { c.strokeStyle = LIGHT; c.lineWidth = S * 0.016; c.lineCap = "round"; c.beginPath(); for (let i = 0; i < 260; i++) { const a = i * 0.09, d = S * 0.4 * (i / 260); i ? c.lineTo(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d) : c.moveTo(S / 2, S / 2); } c.stroke(); c.lineWidth = S * 0.008; for (let i = 0; i < 70; i++) { const a = i * 0.33, d = S * 0.4 * (i / 70); c.beginPath(); c.moveTo(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d); c.lineTo(S / 2 + Math.cos(a) * (d + S * 0.03), S / 2 + Math.sin(a) * (d + S * 0.03)); c.stroke(); } },
    arms(c, S, col) { const g = c.createRadialGradient(S * 0.44, S * 0.42, S * 0.03, S / 2, S / 2, S * 0.42); g.addColorStop(0, "#9CC0FF"); g.addColorStop(0.5, col); g.addColorStop(1, "#1F3F96"); c.fillStyle = g; c.beginPath(); for (let i = 0; i <= 200; i++) { const a = (i / 200) * 6.2832, r = S * (0.12 + 0.3 * Math.pow(Math.max(0, Math.cos(2.5 * (a - 0.3))), 3)); i ? c.lineTo(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r) : c.moveTo(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r); } c.closePath(); c.fill(); },
    ripples(c, S, col) { c.lineWidth = S * 0.014; for (let i = 0; i < 4; i++) { c.strokeStyle = col; c.globalAlpha = 1 - i * 0.2; c.beginPath(); c.arc(S / 2, S / 2, S * (0.08 + i * 0.1), 0, 6.2832); c.stroke(); } c.globalAlpha = 1; },
    glitch(c, S, col, R, rnd) { for (let i = 0; i < 7; i++) { const x = S * (0.18 + rnd() * 0.64), w = S * (0.03 + rnd() * 0.06), y = S * (0.15 + rnd() * 0.2), h = S * (0.25 + rnd() * 0.4); c.fillStyle = i % 2 ? "#FF0000" : LIGHT; c.fillRect(x, y + (rnd() - 0.5) * S * 0.1, w, h); } },
    sparks(c, S, col, R, rnd) { c.lineCap = "round"; for (let i = 0; i < 16; i++) { const a = (i / 16) * 6.2832 + rnd() * 0.2, r0 = S * 0.08, r1 = S * (0.2 + rnd() * 0.22); c.strokeStyle = i % 3 ? "#FF2A00" : "#FFB000"; c.lineWidth = S * (0.008 + rnd() * 0.01); c.beginPath(); c.moveTo(S / 2 + Math.cos(a) * r0, S / 2 + Math.sin(a) * r0); c.lineTo(S / 2 + Math.cos(a) * r1, S / 2 + Math.sin(a) * r1); c.stroke(); } },
    marble(c, S, col) { c.save(); c.beginPath(); c.arc(S / 2, S / 2, S * 0.4, 0, 6.2832); c.clip(); c.lineWidth = S * 0.045; for (let i = 0; i < 7; i++) { c.strokeStyle = i % 2 ? "#FF00B2" : "#FF2A3A"; c.globalAlpha = 0.85; c.beginPath(); for (let k = 0; k <= 30; k++) { const f = k / 30, x = S * 0.1 + f * S * 0.8, y = S * 0.2 + i * S * 0.095 + Math.sin(f * 7 + i) * S * 0.04; k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } c.restore(); },
    glow(c, S, col) { const g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.42); g.addColorStop(0, "#FFFFFFCC"); g.addColorStop(0.25, "#FF00B2DD"); g.addColorStop(0.7, "#FF4F7A44"); g.addColorStop(1, "#FF00B200"); c.fillStyle = g; c.fillRect(0, 0, S, S); c.strokeStyle = "#FF00B2"; c.lineWidth = S * 0.01; c.beginPath(); c.arc(S / 2, S / 2, S * 0.3, 0, 6.2832); c.stroke(); },
  };
  // tamaño de cada elemento suelto en su lienzo y grosor de sus líneas (los finos se engrosan para verse en el espacio)
  const ATT = { filaments: [0.16, 3], dragonfly: [0.17, 2.5], facets: [0.24, 2], wings: [0.15, 2], branches: [0.17, 3], wheels: [0.22, 2.4], fibers: [0.2, 3], lobes: [0.24, 2], squares: [0.17, 2.6], drops: [0.24, 2], diamonds: [0.2, 3.2], dots: [0.2, 2], brush: [0.22, 2], spikes: [0.2, 2], confetti: [0.26, 2], shine: [0.28, 2] };
  // dibuja un elemento de la app SUELTO, sin el cuerpo de la semilla
  function bakeElement(Ser, canvas, concept, element, seed) {
    const S = canvas.width, c = canvas.getContext("2d"), key = Object.keys(element.delta)[0], rnd = rr(seed);
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, S, S);
    c.save(); c.shadowColor = concept.color; c.shadowBlur = S * 0.07; c.lineJoin = "round";
    try {
      if (SURFACE[key]) SURFACE[key](c, S, concept.color, S * 0.14, rnd);
      else {
        const prevM = Ser.B3.M; Ser.B3.M = Ser.b3mul(Ser.b3Rx(0.28), Ser.b3Ry(-0.5));
        const T = Object.assign({}, Ser.BASE, element.delta), k = ATT[key] || [0.2, 1.8], R = S * k[0], sz = S * k[1];   // k = [escala, grosor de las líneas]
        Ser.att3D(c, S / 2, S / 2, R, T, 0.4, seed, 0, sz); Ser.att3D(c, S / 2, S / 2, R, T, 0.4, seed, 1, sz);
        Ser.B3.M = prevM;
      }
    } catch (err) { /* si un elemento falla, queda vacío */ }
    c.restore();
  }

  function init() {
    Promise.resolve().then(() => {
      const Ser = window.Ser3D;
      if (!Ser || !window.THREE) return;
      window.__serDark = true;                                           // la portada siempre es de noche
      const THREE = window.THREE;
      const small = Math.min(window.innerWidth, 900) < 700;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !small, powerPreference: "low-power" }); } catch (e) { return; }   // sin WebGL: queda el video
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      const cv = renderer.domElement;
      cv.className = "espacio3d"; cv.setAttribute("aria-hidden", "true");
      media.appendChild(cv);
      hero.classList.add("hero--juego"); media.classList.add("media--juego");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 10, 6000);
      // los 25 elementos de la app: cada uno es un ser con ese elemento. Se dibujan de a uno para no trabar la página
      const ITEMS = []; Ser.CONCEPTS.forEach((cn) => cn.elements.forEach((el, i) => ITEMS.push({ cn, el, i })));
      const ready = ITEMS.map(() => false);
      const SIDE = small ? 220 : 280;
      const textures = ITEMS.map(() => { const cvx = document.createElement("canvas"); cvx.width = cvx.height = SIDE; const tex = new THREE.CanvasTexture(cvx); tex.anisotropy = 4; return tex; });
      (function bakeNext(i) { if (i >= ITEMS.length) return; bakeElement(Ser, textures[i].image, ITEMS[i].cn, ITEMS[i].el, 1000 + i * 77); textures[i].needsUpdate = true; ready[i] = true; setTimeout(() => bakeNext(i + 1), 40); })(0);
      const pick = () => { const ok = ready.map((r, i) => (r ? i : -1)).filter((i) => i >= 0); return ok.length ? ok[(Math.random() * ok.length) | 0] : -1; };

      const N = small ? 9 : 14, DEPTH = 3200, planes = [];
      const perm = ITEMS.map((_, i) => i).sort(() => Math.random() - 0.5);            // al empezar, un surtido de los cinco catalizadores
      let camZ = 700;
      for (let i = 0; i < N; i++) {
        const k = perm[i % ITEMS.length];
        const mat = new THREE.MeshBasicMaterial({ map: textures[k], transparent: true, depthWrite: false, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
        const size = 340 * rnd(0.8, 1.4) * (small ? 0.75 : 1);
        mesh.scale.set(size, size, 1);
        mesh.position.set(rnd(-900, 900) * (small ? 0.6 : 1), rnd(-430, 430), camZ - 350 - (i / N) * DEPTH);
        mesh.userData = { k, ph: rnd(0, 6.28), sp: rnd(0.15, 0.4), rz: rnd(-0.5, 0.5), bx: mesh.position.x, by: mesh.position.y };
        scene.add(mesh); planes.push(mesh);
      }

      const api = window.EspacioAPI = { THREE, camera, planes, textures, el: ITEMS.map((x) => x.cn.id), elIdx: ITEMS.map((x) => x.i), ITEMS, camZ, W: 0, H: 0, small, hero, media, fast: false,
        respawn(m) { const u = m.userData; const nk = pick(); if (nk >= 0) { u.k = nk; m.material.map = textures[nk]; m.material.needsUpdate = true; } u.hidden = false; u.leader = null; u.held = false; u.bx = rnd(-850, 850) * (small ? 0.6 : 1); u.by = rnd(-420, 420); m.position.set(u.bx, u.by, camZ - rnd(1500, 2800)); } };

      let mx = 0, my = 0, cx = 0, cy = 0, t0 = performance.now(), lastNow = t0, running = false, visible = true;
      function resize() {
        const r = media.getBoundingClientRect(); api.W = Math.max(1, Math.round(r.width)); api.H = Math.max(1, Math.round(r.height));
        renderer.setSize(api.W, api.H, false); camera.aspect = api.W / api.H; camera.updateProjectionMatrix();
      }
      resize(); new ResizeObserver(resize).observe(media);
      window.addEventListener("pointermove", (e) => { const r = media.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = ((e.clientY - r.top) / r.height) * 2 - 1; }, { passive: true });
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; go(); }).observe(hero);
      api.refresh = () => { resize(); go(); };
      document.addEventListener("visibilitychange", go);
      function go() { const want = api.fast && !document.hidden; if (want && !running) { running = true; lastNow = performance.now(); requestAnimationFrame(frame); } else if (!want) running = false; }

      function frame(now) {
        if (!running) return;
        const dtf = Math.min(0.05, (now - lastNow) / 1000); lastNow = now;
        const t = (now - t0) / 1000, calm = isCalm();
        camZ -= (calm ? 40 : (api.fast ? 230 : 120)) * dtf; api.camZ = camZ;                    // la cámara avanza sola entre las criaturas
        const tx = calm ? 0 : mx * 120, ty = calm ? 0 : my * -80;
        cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
        camera.position.set(cx, cy, camZ);
        camera.rotation.set(-cy * 0.0007, -cx * 0.0007, 0);
        for (const m of planes) {
          const u = m.userData, dz = camZ - m.position.z;
          if (!ready[u.k]) { m.visible = false; continue; }                 // todavía se está dibujando
          if (u.hidden) { m.visible = false; continue; }
          if (dz < -250 && !u.held) { api.respawn(m); continue; }              // lo que pasó queda atrás y vuelve a aparecer adelante
          m.visible = true; u.dz = dz;
          const vis = smooth(140, 520, dz) * (1 - smooth(1500, 2600, dz)); u.vis = vis;
          m.material.opacity = Math.min(1, vis * (api.fast ? 0.95 : 0.75) * (u.boost || 1));
          if (!calm) {
            m.position.x = u.bx + Math.sin(t * u.sp + u.ph) * 40; m.position.y = u.by + Math.cos(t * u.sp * 0.8 + u.ph) * 30;
            m.rotation.y = Math.sin(t * 0.25 + u.ph) * 0.55 + cx * 0.0016;
            m.rotation.x = Math.cos(t * 0.2 + u.ph) * 0.18 - cy * 0.0012;
          }
          m.rotation.z = u.rz + (calm ? 0 : Math.sin(t * 0.12 + u.ph) * 0.12);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
      }
      go();
      document.dispatchEvent(new CustomEvent("espacio-listo"));
    });
  }
})();
