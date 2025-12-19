(() => {
  const cards = (window.PORTFOLIO_CARDS || []).slice();
  const elCard = document.getElementById("card");
  const elMedia = document.getElementById("cardMedia");
  const elTitle = document.getElementById("cardTitle");
  const elTag = document.getElementById("cardTag");
  const elBadge = document.getElementById("badge");
  const elDots = document.getElementById("dots");
  const elCounter = document.getElementById("counter");

  const btnNext = document.getElementById("btnNext");
  const btnProject = document.getElementById("btnProject");
  const btnSuper = document.getElementById("btnSuper");

  const modalProject = document.getElementById("modalProject");
  const mTitle = document.getElementById("mTitle");
  const mSub = document.getElementById("mSub");
  const mText = document.getElementById("mText");
  const mDemo = document.getElementById("mDemo");
  const mRepo = document.getElementById("mRepo");

  const modalContact = document.getElementById("modalContact");

  let i = 0;
  let drag = null;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const setDots = () => {
    elDots.innerHTML = "";
    for (let k = 0; k < cards.length; k++) {
      const d = document.createElement("div");
      d.className = "dot" + (k === i ? " is-active" : "");
      elDots.appendChild(d);
    }
    elCounter.textContent = `${i + 1}/${cards.length || 1}`;
  };

  const hideBadge = () => elBadge.classList.remove("is-show");
  const showBadge = (txt) => { elBadge.textContent = txt; elBadge.classList.add("is-show"); };

  const render = () => {
    if (!cards.length) return;
    const c = cards[i];
    elMedia.src = c.image || "";
    elMedia.alt = c.title || "Projeto";
    elTitle.textContent = c.title || "";
    elTag.textContent = c.tag || "";
    hideBadge();
    setDots();
  };

  const goNext = () => {
    i = (i + 1) % cards.length;
    render();
  };

  const fling = (dir) => {
    const off = dir * 520;
    elCard.style.transition = "transform .22s ease";
    elCard.style.transform = `translate3d(${off}px, -8px, 0) rotate(${dir * 10}deg)`;
    setTimeout(() => {
      elCard.style.transition = "";
      elCard.style.transform = `translate3d(0,0,0) rotate(0deg)`;
      goNext();
    }, 220);
  };

  const resetCard = () => {
    elCard.style.transition = "transform .18s ease";
    elCard.style.transform = "translate3d(0,0,0) rotate(0deg)";
    setTimeout(() => (elCard.style.transition = ""), 180);
  };

  const openModal = (m) => {
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
  };

  const closeModal = (m) => {
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
  };

  const openProject = () => {
    const c = cards[i];
    mTitle.textContent = c.title || "";
    mSub.textContent = c.tag || "";
    mText.textContent = "Aqui vai entrar a demo/resultado do projeto. Por enquanto estamos fechando a interface.";
    mDemo.href = c.demoUrl || "#";
    mRepo.href = c.repoUrl || "#";
    openModal(modalProject);
  };

  document.addEventListener("click", (e) => {
    const t = e.target;
    const k = t && t.getAttribute ? t.getAttribute("data-close") : null;
    if (k === "p") closeModal(modalProject);
    if (k === "c") closeModal(modalContact);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(modalProject); closeModal(modalContact); }
  });

  const onDown = (x, y) => {
    drag = { x0: x, y0: y, dx: 0, dy: 0 };
  };

  const onMove = (x, y) => {
    if (!drag) return;
    drag.dx = x - drag.x0;
    drag.dy = y - drag.y0;
    const r = clamp(drag.dx / 30, -10, 10);
    elCard.style.transform = `translate3d(${drag.dx}px, ${drag.dy * 0.10}px, 0) rotate(${r}deg)`;
    if (drag.dx > 36) showBadge("SUPER LIKE");
    else if (drag.dx < -36) showBadge("PRÓXIMO");
    else hideBadge();
  };

  const onUp = () => {
    if (!drag) return;
    const dx = drag.dx;
    drag = null;
    if (Math.abs(dx) > 110) fling(dx > 0 ? 1 : -1);
    else { resetCard(); hideBadge(); }
  };

  elCard.addEventListener("pointerdown", (e) => {
    elCard.setPointerCapture(e.pointerId);
    onDown(e.clientX, e.clientY);
  });
  elCard.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY));
  elCard.addEventListener("pointerup", onUp);
  elCard.addEventListener("pointercancel", onUp);

  btnNext.addEventListener("click", () => {
    showBadge("PRÓXIMO");
    setTimeout(() => fling(-1), 90);
  });

  btnProject.addEventListener("click", openProject);

  btnSuper.addEventListener("click", () => openModal(modalContact));

  render();
})();
