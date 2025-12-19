(() => {
  const $ = (q) => document.querySelector(q);

  const btnMenu = $("#btnMenu");
  const nav = $("#nav");

  const modalContact = $("#modalContact");
  const btnProblem = $("#btnProblem");
  const btnContact2 = $("#btnContact2");

  const modalProject = $("#modalProject");
  const mTitle = $("#mTitle");
  const mSub = $("#mSub");
  const mText = $("#mText");
  const mDemo = $("#mDemo");

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const openModal = (m) => {
    if (!m) return;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
  };

  const closeModal = (m) => {
    if (!m) return;
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
  };

  // MENU MOBILE
  const toggleMenu = () => {
    const open = nav.classList.toggle("is-open");
    btnMenu.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (btnMenu && nav) {
    btnMenu.addEventListener("click", toggleMenu);
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      nav.classList.remove("is-open");
      btnMenu.setAttribute("aria-expanded", "false");
    });
  }

  // CONTATO
  if (btnProblem) btnProblem.addEventListener("click", () => openModal(modalContact));
  if (btnContact2) btnContact2.addEventListener("click", () => openModal(modalContact));

  // ABRIR MODAL PROJETO (cards + bloco da esquerda)
  const projects = window.PORTFOLIO_PROJECTS || {};

  const openProject = (key) => {
    const p = projects[key];
    if (!p) return;
    if (mTitle) mTitle.textContent = p.title || "";
    if (mSub) mSub.textContent = p.sub || "";
    if (mText) mText.textContent = p.description || "";
    if (mDemo) mDemo.href = p.demoUrl || "#";
    openModal(modalProject);
  };

  document.addEventListener("click", (e) => {
    const closeKey = e.target?.getAttribute?.("data-close");
    if (closeKey === "c") closeModal(modalContact);
    if (closeKey === "p") closeModal(modalProject);

    const openKey = e.target?.closest?.("[data-open]")?.getAttribute?.("data-open");
    if (openKey) openProject(openKey);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(modalContact);
      closeModal(modalProject);
      nav?.classList?.remove("is-open");
      btnMenu?.setAttribute?.("aria-expanded", "false");
    }
  });
})();
