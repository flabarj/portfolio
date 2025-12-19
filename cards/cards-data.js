(() => {
  const cards = (window.PORTFOLIO_CARDS || []).slice();
  const bars = document.getElementById("bars");

  const front = document.getElementById("cardFront");
  const back = document.getElementById("cardBack");

  const frontMedia = document.getElementById("frontMedia");
  const frontTitle = document.getElementById("frontTitle");
  const frontTag = document.getElementById("frontTag");

  const backMedia = document.getElementById("backMedia");
  const backTitle = document.getElementById("backTitle");
  const backTag = document.getElementById("backTag");

  const badge = document.getElementById("badge");

  const btnProject = document.getElementById("btnProject");
  const btnSuper = document.getElementById("btnSuper");

  const modalProject = document.getElementById("modalProject");
  const mTitle = document.getElementById("mTitle");
  const mSub = document.getElementById("mSub");
  const mText = document.getElementById("mText");
  const mDemo = document.getElementById("mDemo");

  const modalContact = document.getElementById("modalContact");

  if (!cards.length) return;

  let i = 0;
  let drag = null;
  let animating = false;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const showBadge = (txt) => {
    badge.textContent = txt;
    badge.classList.add("is-show");
  };

  const hideBadge = () => {
    badge.classList.remove("is-show");
  };

  const setBarUI = () => {
    bars.innerHTML = "";
    for (let k = 0; k < cards.length; k++) {
      const b = document.createElement("button");
      b.className = "bar" + (k === i ? " is-active" : "");
      b.type = "button";
      b.setAttribute("aria-label", `Projeto ${k + 1}`);
      b.addEventListener("click", () => jumpTo(k));
      bars.appendChild(b);
    }
  };

  const renderCard = (idx, which) => {
    const c = cards[idx];
    const m = which === "front" ? frontMedia : backMedia;
    const t = which === "front" ? frontTitle : backTitle;
    const g = which === "front" ? frontTag : backTag;
    m.src = c.image || "";
    m.alt = c.title || "Projeto";
    t.textContent = c.title || "";
    g.textContent = c.tag || "";
  };

  const nextIndex = (idx) => (idx + 1) % cards.length;

  const sync = () => {
    renderCard(i, "front");
    renderCard(nextIndex(i), "back");
    hideBadge();
    setBarUI();
    resetTransforms(true);
  };

  const resetTransforms = (hard) => {
    if (hard) {
      front.style.transition = "";
      back.style.transition = "";
    }
    front.style.transform = "translate3d(0,0,0) rotate(0deg)";
    back.style.transform = "translate3d(0,10px,0) scale(.97)";
    back.style.opacity = ".92";
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
    mText.textContent = c.description || "Aqui vai entrar a demo/resultado do projeto.";
    mDemo.href = c.demoUrl || "#";
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
    if (e.key === "ArrowRight") swipe(1);
    if (e.key === "ArrowLeft") swipe(-1);
  });

  const jumpTo = (k) => {
    if (animating || k === i) return;
    animating = true;
    front.style.transition = "opacity .14s ease, transform .14s ease";
    front.style.opacity = "0";
    front.style.transform = "translate3d(0,8px,0) scale(.995)";
    setTimeout(() => {
      i = k;
      sync();
      front.style.transition = "opacity .16s ease";
      front.style.opacity = "1";
      setTimeout(() => {
        front.style.transition = "";
        animating = false;
      }, 170);
    }, 140);
  };

  const swipe = (dir) => {
    if (animating) return;
    animating = true;

    const off = dir * 520;
    front.style.transition = "transform .22s ease, opacity .22s ease";
    back.style.transition = "transform .22s ease, opacity .22s ease";

    front.style.opacity = "0";
    front.style.transform = `translate3d(${off}px, -8px, 0) rotate(${dir * 10}deg)`;

    back.style.opacity = "1";
    back.style.transform = "translate3d(0,0,0) scale(1)";

    setTimeout(() => {
      i = dir > 0 ? nextIndex(i) : (i - 1 + cards.length) % cards.length;
      sync();
      front.style.opacity = "1";
      front.style.transition = "";
      back.style.transition = "";
      animating = false;
    }, 230);
  };

  const onDown = (x, y) => {
    if (animating) return;
    drag = { x0: x, y0: y, dx: 0, dy: 0 };
  };

  const onMove = (x, y) => {
    if (!drag || animating) return;
    drag.dx = x - drag.x0;
    drag.dy = y - drag.y0;

    const r = clamp(drag.dx / 30, -10, 10);
    front.style.transform = `translate3d(${drag.dx}px, ${drag.dy * 0.10}px, 0) rotate(${r}deg)`;

    const p = clamp(Math.abs(drag.dx) / 220, 0, 1);
    const s = 0.97 + (0.03 * p);
    const ty = 10 - (10 * p);
    back.style.transform = `translate3d(0,${ty}px,0) scale(${s})`;
    back.style.opacity = String(0.92 + (0.08 * p));

    if (drag.dx > 36) showBadge("PRÓXIMO");
    else if (drag.dx < -36) showBadge("PRÓXIMO");
    else hideBadge();
  };

  const onUp = () => {
    if (!drag || animating) return;

    const dx = drag.dx;
    drag = null;

    if (Math.abs(dx) > 110) {
      swipe(dx > 0 ? 1 : -1);
      hideBadge();
      return;
    }

    front.style.transition = "transform .18s ease";
    back.style.transition = "transform .18s ease, opacity .18s ease";
    resetTransforms(false);
    setTimeout(() => {
      front.style.transition = "";
      back.style.transition = "";
      hideBadge();
    }, 180);
  };

  front.addEventListener("pointerdown", (e) => {
    front.setPointerCapture(e.pointerId);
    onDown(e.clientX, e.clientY);
  });
  front.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY));
  front.addEventListener("pointerup", onUp);
  front.addEventListener("pointercancel", onUp);

  btnProject.addEventListener("click", openProject);
  btnSuper.addEventListener("click", () => openModal(modalContact));
  front.addEventListener("dblclick", openProject);

  sync();
})();
