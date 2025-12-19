(() => {
  const cards = (window.PORTFOLIO_CARDS || []).slice();
  const elCard = document.getElementById("card");
  const elMedia = document.getElementById("cardMedia");
  const elTitle = document.getElementById("cardTitle");
  const elTag = document.getElementById("cardTag");
  const elBadge = document.getElementById("badge");
  const elScope = document.getElementById("bioScope");
  const elDelivery = document.getElementById("bioDelivery");
  const elStack = document.getElementById("bioStack");
  const elDots = document.getElementById("dots");
  const elCounter = document.getElementById("counter");
  const btnProject = document.getElementById("btnProject");
  const btnSuper = document.getElementById("btnSuper");

  const modal = document.getElementById("modal");
  const mTitle = document.getElementById("mTitle");
  const mSub = document.getElementById("mSub");
  const mPills = document.getElementById("mPills");
  const mText = document.getElementById("mText");
  const mDemo = document.getElementById("mDemo");
  const mRepo = document.getElementById("mRepo");

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

  const render = () => {
    if (!cards.length) return;
    const c = cards[i];
    elMedia.src = c.image || "";
    elMedia.alt = c.title || "Projeto";
    elTitle.textContent = c.title || "";
    elTag.textContent = c.tag || "";
    elScope.textContent = c.scope || "";
    elDelivery.textContent = c.delivery || "";
    elStack.textContent = c.stack || "";
    hideBadge();
    setDots();
  };

  const showBadge = (txt) => {
    elBadge.textContent = txt;
    elBadge.classList.add("is-show");
  };

  const hideBadge = () => {
    elBadge.classList.remove("is-show");
  };

  const resetCardTransform = () => {
    elCard.style.transition = "transform .18s ease";
    elCard.style.transform = `translate3d(0,0,0) rotate(0deg)`;
    setTimeout(() => (elCard.style.transition = ""), 180);
  };

  const goNext = () => {
    i = (i + 1) % cards.length;
    render();
  };

  const fling = (dir) => {
    const off = dir * 980;
    elCard.style.transition = "transform .22s ease";
    elCard.style.transform = `translate3d(${off}px, -10px, 0) rotate(${dir * 12}deg)`;
    setTimeout(() => {
      elCard.style.transition = "";
      elCard.style.transform = `translate3d(0,0,0) rotate(0deg)`;
      goNext();
    }, 220);
  };

  const openModal = () => {
    const c = cards[i];
    mTitle.textContent = c.title || "";
    mSub.textContent = c.tag || "";
    mPills.innerHTML = "";
    const pills = [];
    if (c.scope) pills.push(["Escopo", c.scope]);
    if (c.delivery) pills.push(["Entrega", c.delivery]);
    if (c.stack) pills.push(["Stack", c.stack]);
    pills.slice(0, 3).forEach(([k, v]) => {
      const p = document.createElement("div");
      p.className = "pill";
      p.textContent = `${k}: ${v}`;
      mPills.appendChild(p);
    });
    mText.textContent = "A experiência completa deste projeto vai ficar aqui: demo, resultado e links. (Por enquanto, estamos montando a interface.)";
    mDemo.href = c.demoUrl || "#";
    mRepo.href = c.repoUrl || "#";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-close") === "1") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") {
      showBadge("SUPER LIKE");
      setTimeout(() => fling(1), 90);
    }
    if (e.key === "ArrowLeft") {
      showBadge("PRÓXIMO");
      setTimeout(() => fling(-1), 90);
    }
  });

  const onDown = (x, y) => {
    drag = { x0: x, y0: y, t0: Date.now(), dx: 0, dy: 0 };
  };

  const onMove = (x, y) => {
    if (!drag) return;
    drag.dx = x - drag.x0;
    drag.dy = y - drag.y0;
    const r = clamp(drag.dx / 28, -14, 14);
    elCard.style.transform = `translate3d(${drag.dx}px, ${drag.dy * 0.15}px, 0) rotate(${r}deg)`;
    if (drag.dx > 40) showBadge("SUPER LIKE");
    else if (drag.dx < -40) showBadge("PRÓXIMO");
    else hideBadge();
  };

  const onUp = () => {
    if (!drag) return;
    const dx = drag.dx;
    drag = null;
    if (Math.abs(dx) > 120) {
      fling(dx > 0 ? 1 : -1);
    } else {
      resetCardTransform();
      hideBadge();
    }
  };

  elCard.addEventListener("pointerdown", (e) => {
    elCard.setPointerCapture(e.pointerId);
    onDown(e.clientX, e.clientY);
  });
  elCard.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY));
  elCard.addEventListener("pointerup", onUp);
  elCard.addEventListener("pointercancel", onUp);

  btnSuper.addEventListener("click", () => {
    showBadge("SUPER LIKE");
    setTimeout(() => fling(1), 90);
  });

  btnProject.addEventListener("click", () => openModal());

  render();
})();
