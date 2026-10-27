/* =========================================================
   SEMILLAS · HERO · BIOFERIA 2027
   Las semillas son los "seres" de la app Catálisis: un cuerpo 3D (miles de puntos con luz) que se transforma
   con los elementos. En la portada flotan entre las criaturas: se agarran y se llevan hasta ellas, o se
   juntan las criaturas entre sí. Cada semilla come 3 elementos, dice qué ser es y llega otra.
   "Entrar al espacio" lleva la escena a pantalla completa: la semilla te sigue y come lo que rozás.
   Necesita espacio.js (cámara y criaturas) y ser3d.js (el dibujo del ser, extraído de la app).
   ========================================================= */
(function () {
  document.addEventListener("espacio-listo", init, { once: true });

  const root = document.documentElement;
  const isCalm = () => root.classList.contains("menos-movimiento");
  const COL = { fuego: "#FF0000", aire: "#79F2F4", agua: "#4F8FEF", tierra: "#EFD74F", corazon: "#FF00B2" };
  const NOM = { fuego: "Fuego", aire: "Aire", agua: "Agua", tierra: "Tierra", corazon: "Corazón" };
  const NOMBRES = {
    "aire+fuego": "Chispa", "agua+fuego": "Vapor", "fuego+tierra": "Brasa", "corazon+fuego": "Pasión",
    "agua+aire": "Brisa", "aire+tierra": "Polen", "aire+corazon": "Vuelo",
    "agua+tierra": "Raíz", "agua+corazon": "Marea", "corazon+tierra": "Semilla",
  };
  const MAS = { fuego: "Llama", aire: "Corriente", agua: "Ola", tierra: "Bosque", corazon: "Latido" };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const fine = window.matchMedia("(pointer: fine)").matches;

  function init() {
    const api = window.EspacioAPI, Ser = window.Ser3D, THREE = api.THREE, media = api.media, hero = api.hero;
    if (!Ser) return;
    const inm = () => root.classList.contains("inm");

    const cv = document.createElement("canvas");
    cv.className = "semillas"; cv.setAttribute("aria-hidden", "true");
    media.appendChild(cv);
    const ctx = cv.getContext("2d");
    const tags = document.createElement("div");
    tags.className = "univ__tags"; tags.setAttribute("aria-hidden", "true");
    media.appendChild(tags);

    // cartel de ayuda y controles del espacio, dentro de la escena
    const ui = document.createElement("div");
    ui.className = "inm__ui";
    ui.innerHTML = `<p class="juego__hint">${fine ? "Tu semilla es la que dice «Vos»: llevala a las formas y a otras semillas" : "Tocá tu semilla (Vos) para que busque formas y otras semillas"}</p>
      <button type="button" class="inm__salir">Salir del espacio</button>
      <p class="inm__quien" aria-live="polite"></p>
      <p class="inm__txt">${fine ? "Mové el mouse: tu semilla te sigue. Comé criaturas, semillas y visitantes." : "Deslizá el dedo: tu semilla te sigue. Comé criaturas, semillas y visitantes."}</p>`;
    media.appendChild(ui);

    let W = 0, H = 0, DPR = 1, unit = 1, drag = null, dragForm = null, hoverForm = null, last = performance.now(), frameN = 0;
    const pointer = { x: -999, y: -999 };
    const v = new THREE.Vector3(), dirV = new THREE.Vector3();
    Ser.B3.mini = true;                                   // cuerpo liviano (como el mapa de la app): ~900 puntos por semilla

    const seeds = [];
    function makeSeed(i, n) {
      return { x: 0, y: 0, vx: 0, vy: 0, hx: 0, hy: 0, ph: rnd(0, 6.28), held: false, seek: null, born: 0, pop: 0, k: 0, heat: 0, count: 0, leaving: false, mine: i === 0,
        T: { ...Ser.BASE }, mix: {}, taken: {}, els: new Set(), seedNum: Math.floor(rnd(1, 1e6)),
        M: Ser.b3mul(Ser.b3Rx(0.25 + i * 0.2), Ser.b3Ry(i * 1.3)), off: document.createElement("canvas"), idx: i, n };
    }
    function resize() {
      W = api.W || media.clientWidth; H = api.H || media.clientHeight; DPR = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      unit = Math.max(0.6, Math.min(1.1, W / 1300));
      const lo = inm() ? 0.12 : 0.5, span = inm() ? 0.76 : 0.4;                // en la portada las semillas viven a la derecha, lejos del título
      seeds.forEach((s, i) => { s.hx = W * (lo + span * ((i + 0.5) / seeds.length)); s.hy = H * (0.58 + 0.14 * Math.sin(i * 1.7)); if (!s.placed) { s.x = s.hx; s.y = s.hy; s.placed = true; } });
    }
    const SZ = () => 200 * unit * (inm() ? 1.25 : 1);       // lado del lienzo de cada ser
    const R = () => SZ() * 0.13 * 1.55 * 1.05;               // radio del cuerpo en pantalla
    const N = api.small ? 3 : 4;
    for (let i = 0; i < N; i++) seeds.push(makeSeed(i, N));
    new ResizeObserver(() => { resize(); }).observe(media); resize();

    /* ---------- criaturas del espacio: dónde están en pantalla ---------- */
    function screenOf(m) {
      v.copy(m.position).project(api.camera);
      const dz = m.userData.dz || 800, size = m.scale.x;
      const rpx = (size * 0.5) * (H / 2) / (dz * Math.tan((api.camera.fov * Math.PI) / 360)) * 0.5;
      return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, r: rpx, ok: v.z < 1 };
    }
    function nearest(s) {
      let best = null, bd = 1e9;
      for (const m of api.planes) {
        const u = m.userData; if (u.hidden || !m.visible || (u.vis || 0) < 0.4) continue;
        const p = screenOf(m); if (!p.ok) continue;
        const d = Math.hypot(p.x - s.x, p.y - s.y);
        if (d < bd) { bd = d; best = m; }
      }
      return best;
    }

    /* ---------- cartelitos con el nombre de lo que nace ---------- */
    function tag(x, y, text, big, color) {
      const t = document.createElement("div");
      t.className = "univ__tag" + (big ? " is-big" : "");
      t.style.left = Math.max(80, Math.min(W - 80, x)) + "px"; t.style.top = Math.max(60, y) + "px";
      t.style.setProperty("--a", color); t.style.setProperty("--b", color);
      t.textContent = text; tags.appendChild(t);
      setTimeout(() => t.remove(), big ? 7200 : 5200);
    }

    /* ---------- absorber: la criatura viaja hasta la semilla y le da un elemento ---------- */
    const flights = [];
    function absorb(s, m) {
      const u = m.userData, p = screenOf(m), el = api.el[u.k];
      u.hidden = true; u.leader = null; m.visible = false;
      setTimeout(() => api.respawn(m), 2500);
      flights.push({ s, el, idx: api.elIdx[u.k], canvas: api.textures[u.k].image, x0: p.x, y0: p.y, sz0: Math.max(60, p.r * 2.4), t: 0 });
    }
    function gain(s, elId, only) {
      const concept = Ser.CONCEPTS.find((c) => c.id === elId); if (!concept) return null;
      const used = (s.taken[elId] = s.taken[elId] || []);
      let pool = concept.elements.map((_, i) => i).filter((i) => !used.includes(i));
      if (!pool.length) { used.length = 0; pool = concept.elements.map((_, i) => i); }
      const idx = only !== undefined ? only : pool[Math.floor(Math.random() * pool.length)], el = concept.elements[idx];
      used.push(idx);
      for (const k in el.delta) s.T[k] = k === "wobble" ? Math.min(0.7, (s.T[k] || 0) + el.delta[k]) : Math.min((s.T[k] || 0) + el.delta[k], el.delta[k] * 2);
      s.mix[elId] = (s.mix[elId] || 0) + 1; s.els.add(elId); s.pop = 1; s.count++;
      return el;
    }
    function arrive(f) {
      const s = f.s; if (s.leaving) return;
      const el = gain(s, f.el, f.idx); if (!el) return;
      if (s.mine) { if (s.count % 3 === 0) serTag(s, COL[f.el]); else tag(s.x, s.y - SZ() * 0.36, el.label, false, COL[f.el]); }   // la tuya sigue: no se va
      else if (s.count >= 3) finish(s, COL[f.el]); else tag(s.x, s.y - SZ() * 0.36, el.label, false, COL[f.el]);
    }
    function serTag(s, color) {
      const names = [...s.els].map((e) => NOM[e]);
      tag(s.x, s.y - SZ() * 0.4, (names.length === 1 ? "Tu ser de " + names[0] : "Tu ser de " + names.join(", ").replace(/, ([^,]*)$/, " y $1")), true, color);
    }
    // tu semilla se come a otra semilla (o a un visitante): se queda con sus elementos
    function eatSeed(me, o) {
      o.leaving = true; o.leaveAt = 0; o.seek = null; if (drag && drag.s === o) { drag = null; root.classList.remove("univ-drag"); }
      const ids = o.els.size ? [...o.els].slice(0, 2) : [Object.keys(COL)[(Math.random() * 5) | 0]];
      ids.forEach((id) => gain(me, id));
      tag(me.x, me.y - SZ() * 0.42, "¡Te comiste una semilla! +" + ids.length, true, COL[ids[0]]);
    }
    // la semilla comió 3 elementos: dice qué ser es y se despide; llega otra
    function finish(s, color) {
      const names = [...s.els].map((e) => NOM[e]);
      const quien = names.length === 1 ? "Ser de " + names[0] : "Ser de " + names.join(", ").replace(/, ([^,]*)$/, " y $1");
      tag(s.x, s.y - SZ() * 0.4, quien, true, color);
      s.leaving = true; s.leaveAt = performance.now() + 2600; s.seek = null;
      if (drag && drag.s === s) { s.held = false; drag = null; root.classList.remove("univ-drag"); }
    }

    /* ---------- puntero: se agarran las semillas y las formas desde el fondo de la portada ---------- */
    const skip = "a, button, input, select, textarea, label, summary, [role=tab], [role=button]";
    const local = (e) => { const r = media.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }; };
    const canPlay = (e) => !e.target.closest(skip) && !document.querySelector("dialog.welcome[open]") && !root.classList.contains("nt-on");
    function seedAt(x, y) { for (let i = seeds.length - 1; i >= 0; i--) { const s = seeds[i]; if (s.leaving || s.born < 0.4) continue; if (Math.hypot(x - s.x, y - s.y) < R() * 1.25) return s; } return null; }
    function formAt(x, y) {
      let best = null, bd = 1e9;
      for (const m of api.planes) {
        const u = m.userData; if (u.hidden || !m.visible || (u.vis || 0) < 0.4 || (u.dz || 0) < 220) continue;
        const p = screenOf(m); if (!p.ok) continue;
        if (Math.hypot(p.x - x, p.y - y) < Math.max(34, p.r * 0.85) && u.dz < bd) { bd = u.dz; best = m; }
      }
      return best;
    }
    function worldAt(x, y, z) {                              // el punto del espacio, a la profundidad de la forma, bajo el puntero
      dirV.set((x / W) * 2 - 1, -(y / H) * 2 + 1, 0.5).unproject(api.camera).sub(api.camera.position).normalize();
      const t = (z - api.camera.position.z) / dirV.z;
      return { x: api.camera.position.x + dirV.x * t, y: api.camera.position.y + dirV.y * t };
    }
    function bond(a, b) {                                    // a se une a b: quedan tocándose y viajan juntas
      const ua = a.userData, ub = b.userData, lead = ub.leader || b;
      ua.leader = lead; ua.ox = (ua.bx - lead.userData.bx) * 0.5; ua.oy = (ua.by - lead.userData.by) * 0.5; ua.oz = (a.position.z - lead.position.z) * 0.3;
      const ea = api.el[ua.k], eb = api.el[lead.userData.k];
      const p = screenOf(lead);
      tag(p.x, p.y - 40, ea === eb ? MAS[ea] : (NOMBRES[[ea, eb].sort().join("+")] || "Figura nueva"), false, COL[ea]);
    }
    window.addEventListener("pointermove", (e) => {
      const p = local(e);
      pointer.x = p.x; pointer.y = p.y;
      if (inm()) { e.preventDefault(); return; }
      if (drag) { drag.s.x = p.x - drag.dx; drag.s.y = p.y - drag.dy; drag.s.vx = drag.s.vy = 0; e.preventDefault(); return; }
      if (dragForm) { const u = dragForm.m.userData, w = worldAt(p.x - dragForm.dx, p.y - dragForm.dy, dragForm.m.position.z); u.bx = w.x; u.by = w.y; e.preventDefault(); return; }
      if (e.pointerType === "mouse") {
        const ok = p.inside && canPlay(e), sd = ok ? seedAt(p.x, p.y) : null, fm = ok && !sd ? formAt(p.x, p.y) : null;
        hoverForm = fm; root.classList.toggle("univ-grab", !!(sd || fm));
      }
    }, { passive: false });
    window.addEventListener("pointerdown", (e) => {
      if (inm()) return;
      const p = local(e); if (!p.inside || !canPlay(e) || !hero.contains(e.target)) return;
      const sd = seedAt(p.x, p.y);
      if (sd) {
        if (e.pointerType === "mouse") { drag = { s: sd, dx: p.x - sd.x, dy: p.y - sd.y }; sd.held = true; seeds.splice(seeds.indexOf(sd), 1); seeds.push(sd); root.classList.add("univ-drag"); e.preventDefault(); }
        else { const n = nearest(sd); if (n) sd.seek = n; }
        return;
      }
      const fm = formAt(p.x, p.y); if (!fm) return;
      if (e.pointerType === "mouse") {
        fm.userData.leader = null;
        const q = screenOf(fm);
        dragForm = { m: fm, dx: p.x - q.x, dy: p.y - q.y }; fm.userData.held = true; root.classList.add("univ-drag"); e.preventDefault();
      } else {                                              // celular: la semilla más cercana va a buscar esa forma
        let best = null, bd = 1e9; const q = screenOf(fm);
        for (const s of seeds) { if (s.leaving) continue; const d = Math.hypot(s.x - q.x, s.y - q.y); if (d < bd) { bd = d; best = s; } }
        if (best) best.seek = fm;
      }
    }, { passive: false });
    const up = () => {
      if (drag) { drag.s.held = false; drag.s.hx = drag.s.x; drag.s.hy = drag.s.y; drag = null; root.classList.remove("univ-drag"); }
      if (dragForm) {
        const m = dragForm.m, u = m.userData; u.held = false; dragForm = null; root.classList.remove("univ-drag");
        const p = screenOf(m);                              // si la soltaron sobre otra forma, se unen
        for (const o of api.planes) {
          if (o === m || o.userData.hidden || !o.visible || (o.userData.vis || 0) < 0.4 || o.userData.leader === m) continue;
          const q = screenOf(o);
          if (q.ok && Math.hypot(q.x - p.x, q.y - p.y) < (p.r + q.r) * 0.75 && Math.abs((o.userData.dz || 0) - (u.dz || 0)) < 700) { bond(m, o); break; }
        }
      }
    };
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);

    /* ---------- dibujo: el ser de la app, en 3D ---------- */
    function drawSeed(s, t, dt) {
      const S = SZ(), px = Math.round(S * DPR);
      if (s.off.width !== px) { s.off.width = px; s.off.height = px; s.dirty = true; }
      s.M = Ser.b3mul(Ser.b3Ry((isCalm() ? 0 : 0.35) * dt), s.M);     // el cuerpo gira solo, como en la app
      if (++s.k % 120 === 0) s.M = Ser.b3Ortho(s.M);
      if (s.dirty || (frameN + s.idx) % 2 === 0) {                     // se redibuja cada dos cuadros para cuidar el celular
        const c = s.off.getContext("2d");
        c.setTransform(DPR, 0, 0, DPR, 0, 0); c.clearRect(0, 0, S, S);
        Ser.B3.M = s.M; Ser.FX.squash = 0; Ser.FX.bubble = 0; Ser.FX.dentM = 0;
        try { Ser.draw(c, S, s.T, t, s.mix, s.seedNum, null); } catch (e) { /* un cuadro fallido no rompe el resto */ }
        s.dirty = false;
      }
      const k = (1 + s.pop * 0.09) * (0.6 + 0.4 * Math.min(1, s.born)) * (1 + Math.min(0.3, s.count * 0.03));
      ctx.save(); ctx.globalAlpha = Math.min(0.95, Math.min(1, s.born) * (inm() ? 0.95 : 0.62) * (1 + 0.8 * s.heat));
      ctx.drawImage(s.off, s.x - (S * k) / 2, s.y - (S * k) / 2, S * k, S * k);
      ctx.restore();
      if (s.mine && s.born > 0.5) {                                      // etiqueta de tu semilla
        const y = s.y + R() * (1 + Math.min(0.3, s.count * 0.03)) + 20, w = 44;
        ctx.save(); ctx.globalAlpha = 0.9; ctx.font = "800 12px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
        ctx.fillStyle = "rgba(14,13,18,.62)"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(s.x - w / 2, y - 12, w, 20, 10) : ctx.rect(s.x - w / 2, y - 12, w, 20); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; ctx.fillText("Vos", s.x, y + 2); ctx.restore();
      }
    }

    const CF = { fuego: "#FA3710", aire: "#01DAC7", agua: "#005BFC", tierra: "#FED108", corazon: "#FF0099" };
    /* ---------- otros visitantes en el espacio (simulados): entran, persiguen criaturas, las comen y se van ---------- */
    const NAMES = ["Lu", "Mati", "Cami", "Santi", "Vale", "Fran", "Juli", "Nico", "Sofi", "Tomi"];
    const PALO = ["#FA3710", "#01DAC7", "#4F8FEF", "#FED108", "#FF00B2"];
    const quienEl = ui.querySelector(".inm__quien");
    let others = [], nextJoin = 0;
    function updateQuien() { const n = others.filter((o) => !o.leaving).length; quienEl.textContent = n ? (n === 1 ? "Hay 1 persona más en el espacio" : "Hay " + n + " personas más en el espacio") : ""; }
    function spawnOther(now) {
      const used = others.map((o) => o.name), free = NAMES.filter((n) => !used.includes(n)); if (!free.length) return;
      const side = Math.random() < 0.5, o = { name: free[(Math.random() * free.length) | 0], col: PALO[(Math.random() * 5) | 0], x: side ? -40 : W + 40, y: rnd(H * 0.2, H * 0.8), vx: 0, vy: 0, ph: rnd(0, 6.28), born: 0, target: null, count: 0, pop: 0, life: rnd(16, 30), leaving: false, wait: rnd(0.5, 2) };
      others.push(o); tag(Math.min(W - 90, Math.max(90, o.x)), o.y - 40, o.name + " entró al espacio", false, o.col); updateQuien();
    }
    function stepOthers(dt, now, t) {
      if (!inm()) return;
      if (now > nextJoin && others.filter((o) => !o.leaving).length < (api.small ? 2 : 4)) { spawnOther(now); nextJoin = now + rnd(5000, 9000); }
      for (const o of others) {
        o.born = o.leaving ? Math.max(0, o.born - dt * 0.8) : Math.min(1, o.born + dt * 0.8); o.pop = Math.max(0, o.pop - dt * 1.5);
        if (!o.leaving && (o.life -= dt) <= 0) { o.leaving = true; tag(Math.min(W - 90, Math.max(90, o.x)), o.y - 40, o.name + " se fue", false, o.col); updateQuien(); }
        if (!o.target || o.target.userData.hidden || !o.target.visible || (o.target.userData.vis || 0) < 0.3) {
          o.target = null; o.wait -= dt;
          if (o.wait <= 0 && !o.leaving) { const c = api.planes.filter((m) => !m.userData.hidden && m.visible && (m.userData.vis || 0) > 0.6 && (m.userData.dz || 0) > 350); if (c.length) { o.target = c[(Math.random() * c.length) | 0]; o.wait = rnd(0.5, 2); } }
        }
        let tx = o.x + Math.cos(t * 0.6 + o.ph) * 40, ty = o.y + Math.sin(t * 0.5 + o.ph) * 30;
        if (o.leaving) { tx = o.x < W / 2 ? -120 : W + 120; ty = o.y; }
        else if (o.target) { const p = screenOf(o.target); if (isFinite(p.x) && isFinite(p.y)) { tx = p.x; ty = p.y; } if (p.ok && Math.hypot(p.x - o.x, p.y - o.y) < 46 + p.r * 0.45) eatOther(o, o.target); }
        o.vx += (tx - o.x) * 0.0026; o.vy += (ty - o.y) * 0.0026; o.vx *= 0.92; o.vy *= 0.92; o.x += o.vx; o.y += o.vy;
      }
      const me = seeds.find((q) => q.mine);
      if (me && !me.leaving) for (const o of others) {
        if (o.leaving) continue;
        if (Math.hypot(o.x - me.x, o.y - me.y) < R() * 1.1 + 18) {         // tu semilla se come a un visitante
          o.leaving = true; o.life = 0; const id = Object.keys(COL)[(Math.random() * 5) | 0]; gain(me, id);
          tag(me.x, me.y - SZ() * 0.42, o.name + " fue absorbido +1", true, o.col); updateQuien();
        }
      }
      others = others.filter((o) => !(o.leaving && o.born <= 0));
      if (quienEl && frameN % 30 === 0) updateQuien();
    }
    function eatOther(o, m) {
      const u = m.userData, el = api.el[u.k], concept = Ser.CONCEPTS.find((q) => q.id === el);
      u.hidden = true; u.leader = null; m.visible = false; setTimeout(() => api.respawn(m), 2500);
      o.target = null; o.count++; o.pop = 1;
      tag(o.x, o.y - 46, o.name + ": " + (concept ? concept.elements[api.elIdx[u.k]].label : "¡listo!"), false, o.col);
    }
    function drawOthers(t) {
      for (const o of others) {
        if (!isFinite(o.x) || !isFinite(o.y)) { o.x = W / 2; o.y = H / 2; o.vx = o.vy = 0; continue; }       // si algo falla, vuelve al centro
        const r = (20 + Math.min(o.count, 4) * 2.5) * unit * (1 + o.pop * 0.18), a = o.born * 0.92;
        ctx.save(); ctx.globalAlpha = a;
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(o.x, o.y, r * 0.3, o.x, o.y, r * 3.2); g.addColorStop(0, o.col + "66"); g.addColorStop(1, o.col + "00");
        ctx.fillStyle = g; ctx.fillRect(o.x - r * 3.2, o.y - r * 3.2, r * 6.4, r * 6.4);
        ctx.globalCompositeOperation = "source-over";
        const b = ctx.createRadialGradient(o.x - r * 0.35, o.y - r * 0.4, r * 0.1, o.x, o.y, r);       // un cuerpito con luz, como las semillas
        b.addColorStop(0, "#FFFFFF"); b.addColorStop(0.35, o.col); b.addColorStop(1, "#0E0D12");
        ctx.fillStyle = b; ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, 6.2832); ctx.fill();
        for (let i = 0; i < Math.min(o.count, 4); i++) { const an = t * (1 + i * 0.3) + i * 1.6 + o.ph; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(o.x + Math.cos(an) * r * 1.6, o.y + Math.sin(an) * r * 0.7, 2.6, 0, 6.2832); ctx.fill(); }
        ctx.font = "700 12px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
        const w = ctx.measureText(o.name).width + 16, ty = o.y + r + 16;
        ctx.fillStyle = "rgba(14,13,18,.62)"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(o.x - w / 2, ty - 12, w, 20, 10) : ctx.rect(o.x - w / 2, ty - 12, w, 20); ctx.fill();
        ctx.fillStyle = "#F1EDE6"; ctx.fillText(o.name, o.x, ty + 2);
        ctx.restore();
      }
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; frameN++;
      const t = now / 1000, calm = isCalm();
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
      if (!api.fast) { requestAnimationFrame(frame); return; }                       // el juego solo corre dentro de "Entrar al espacio"
      // las formas unidas viajan juntas; la que se tiene en la mano o bajo el mouse se aclara
      for (const m of api.planes) {
        const u = m.userData;
        if (u.leader) { const L = u.leader.userData; if (u.hidden || L.hidden) u.leader = null; else { u.bx = L.bx + u.ox; u.by = L.by + u.oy; m.position.z += (u.leader.position.z + u.oz - m.position.z) * 0.1; } }
        const want = u.held ? 1.9 : (hoverForm === m ? 1.45 : (u.leader || api.planes.some((q) => q.userData.leader === m) ? 1.25 : 1));
        u.boost = (u.boost || 1) + (want - (u.boost || 1)) * 0.12;
      }
      ctx.save();                                                        // nube de color entre formas unidas
      for (const m of api.planes) {
        const u = m.userData; if (!u.leader || u.hidden || !m.visible) continue;
        const a = screenOf(m), b = screenOf(u.leader), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, rr = Math.max(60, (a.r + b.r) * 1.1);
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, rr);
        g.addColorStop(0, CF[api.el[u.k]] + "55"); g.addColorStop(0.6, CF[api.el[u.leader.userData.k]] + "22"); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(mx - rr, my - rr, rr * 2, rr * 2);
      }
      ctx.restore();

      for (const s of seeds) {
        if (inm() && s.idx !== 0) continue;
        s.heat += (((s.held || s.seek || inm()) ? 1 : 0) - s.heat) * 0.12;
        if (s.leaving) {
          if (performance.now() > s.leaveAt) s.born = Math.max(0, s.born - dt * 0.7);
          if (s.born <= 0) { const keep = { hx: s.hx, hy: s.hy }; Object.assign(s, makeSeed(s.idx, s.n), { hx: keep.hx, hy: keep.hy, x: keep.hx, y: keep.hy + 40, placed: true }); }
        } else { s.born = Math.min(1, s.born + dt * 0.5); }
        s.pop = Math.max(0, s.pop - dt * 1.2);
        if (inm() && !s.leaving) {                                       // en el espacio: la semilla sigue al puntero, con calma
          s.vx += (pointer.x - s.x) * 0.0042; s.vy += (pointer.y - s.y) * 0.0042; s.vx *= 0.9; s.vy *= 0.9; s.x += s.vx; s.y += s.vy;
        } else if (!s.held) {
          if (s.seek && !s.seek.userData.hidden && s.seek.visible) { const p = screenOf(s.seek); s.vx += (p.x - s.x) * 0.0016; s.vy += (p.y - s.y) * 0.0016; }
          else { s.seek = null; if (!calm) { s.vx += (s.hx + Math.sin(t * 0.5 + s.ph) * 46 - s.x) * 0.0012; s.vy += (s.hy + Math.cos(t * 0.42 + s.ph) * 36 - s.y) * 0.0012; } }
          s.vx *= 0.94; s.vy *= 0.94; s.x += s.vx; s.y += s.vy;
        }
        if (s.mine && (s.held || inm()) && !s.leaving) {                 // ¿toca otra semilla? te la comés
          for (const o of seeds) { if (o === s || o.mine || o.leaving || o.born < 0.6) continue; if (Math.hypot(o.x - s.x, o.y - s.y) < R() * 1.15) { eatSeed(s, o); break; } }
        }
        if ((s.held || s.seek || inm()) && !s.leaving) {                 // ¿toca alguna criatura? solo si la llevan, la mandaron o está en el espacio
          for (const m of api.planes) {
            const u = m.userData; if (u.hidden || !m.visible || (u.vis || 0) < 0.35 || (u.dz || 0) < 280) continue;
            const p = screenOf(m);
            if (p.ok && Math.hypot(p.x - s.x, p.y - s.y) < R() + p.r * 0.7) { absorb(s, m); s.seek = null; break; }
          }
        }
      }
      if (dragForm) {                                                    // la forma que llevan en la mano también la absorbe una semilla
        const m = dragForm.m, p = screenOf(m);
        for (const sd of seeds) if (!sd.leaving && Math.hypot(p.x - sd.x, p.y - sd.y) < R() + p.r * 0.5) { m.userData.held = false; absorb(sd, m); dragForm = null; root.classList.remove("univ-drag"); break; }
      }
      for (let i = flights.length - 1; i >= 0; i--) {                    // la criatura viaja hasta la semilla
        const f = flights[i]; f.t += dt / 0.9; const e = f.t * f.t * (3 - 2 * f.t);
        const x = f.x0 + (f.s.x - f.x0) * e, y = f.y0 + (f.s.y - f.y0) * e, sz = f.sz0 + (R() * 1.4 - f.sz0) * e;
        ctx.save(); ctx.globalAlpha = 0.85 * (1 - e * 0.6); ctx.drawImage(f.canvas, x - sz / 2, y - sz / 2, sz, sz); ctx.restore();
        if (f.t >= 1) { arrive(f); flights.splice(i, 1); }
      }
      for (const s of seeds) { if (inm() && s.idx !== 0) continue; drawSeed(s, t, dt); }
      stepOthers(dt, now, t); drawOthers(t);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* ---------- "Entrar al espacio": la escena pasa a pantalla completa ---------- */
    const actions = hero.querySelector(".hero__actions");
    const entrar = document.createElement("button");
    entrar.type = "button"; entrar.className = "btn btn--outline hero__entrar"; entrar.textContent = "Entrar al espacio";
    if (actions) actions.appendChild(entrar);
    const home = media.parentNode;
    const refit = () => { api.refresh(); resize(); };
    function enter() {
      if (inm()) return;
      document.body.appendChild(media);                                  // la escena sale de la portada y cubre toda la pantalla
      root.classList.add("inm"); document.body.style.overflow = "hidden"; api.fast = true;
      pointer.x = innerWidth / 2; pointer.y = innerHeight * 0.62;
      const sd = seeds[0]; if (sd) { sd.x = pointer.x; sd.y = pointer.y; sd.vx = sd.vy = 0; if (sd.leaving) { sd.leaving = false; sd.born = 1; } }
      requestAnimationFrame(refit); setTimeout(refit, 150);
      others = []; nextJoin = performance.now() + 2500; updateQuien();
      ui.querySelector(".inm__salir").focus({ preventScroll: true });
    }
    function exit() {
      if (!inm()) return;
      root.classList.remove("inm"); document.body.style.overflow = ""; api.fast = false;
      home.insertBefore(media, home.firstChild); others = []; updateQuien();
      requestAnimationFrame(refit); setTimeout(refit, 150);
      entrar.focus({ preventScroll: true });
    }
    entrar.addEventListener("click", enter);
    ui.querySelector(".inm__salir").addEventListener("click", exit);
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") exit(); });
    window.__sem = () => ({ otros: others.map((o) => ({ n: o.name, c: o.count, x: Math.round(o.x), y: Math.round(o.y) })), dragging: !!dragForm, seeds: seeds.map((s) => ({ mine: s.mine, x: s.x, y: s.y, n: s.count, els: [...s.els], leaving: s.leaving })), planes: api.planes.filter((m) => !m.userData.hidden && m.visible && (m.userData.vis || 0) > 0.4).map((m) => { const p = screenOf(m); return { x: p.x, y: p.y, r: p.r, dz: m.userData.dz, b: !!m.userData.leader }; }), W, H });
  }
})();
