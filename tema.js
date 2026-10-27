/* =========================================================
   TEMA CLARO / OSCURO · BIOFERIA 2027
   Botón en el menú. Por defecto la página es clara; la elección se recuerda.
   ========================================================= */
(function () {
  const root = document.documentElement;
  const KEY = "bf-tema";
  const meta = document.querySelector('meta[name="theme-color"]');
  const isDark = () => root.dataset.tema === "oscuro";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tema-btn";
  btn.innerHTML = `
    <svg class="i-sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7"/></svg>
    <svg class="i-luna" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a.7.7 0 0 0-.9-.9A9.6 9.6 0 1 0 21.4 15.5a.7.7 0 0 0-.9-.9z"/></svg>`;

  function paint() {
    const d = isDark();
    btn.setAttribute("aria-pressed", String(d));
    btn.setAttribute("aria-label", d ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
    btn.title = d ? "Tema claro" : "Tema oscuro";
    if (meta) meta.setAttribute("content", d ? "#0E0D12" : "#FAF8F3");
  }
  function set(d, animate) {
    if (animate) { root.classList.add("tema-cambia"); setTimeout(() => root.classList.remove("tema-cambia"), 800); }
    if (d) root.dataset.tema = "oscuro"; else delete root.dataset.tema;
    try { localStorage.setItem(KEY, d ? "oscuro" : "claro"); } catch (e) { /* sin almacenamiento */ }
    paint();
  }
  btn.addEventListener("click", () => set(!isDark(), true));

  const bar = document.querySelector(".header__bar");
  if (bar) { const burger = bar.querySelector(".header__burger"); burger ? bar.insertBefore(btn, burger) : bar.appendChild(btn); }
  paint();
})();
