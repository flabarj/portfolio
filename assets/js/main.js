(() => {
  const cards = window.PORTFOLIO_CARDS;
  let i = 0;

  const fImg = document.getElementById("frontMedia");
  const fTitle = document.getElementById("frontTitle");
  const fTag = document.getElementById("frontTag");

  const bImg = document.getElementById("backMedia");
  const bTitle = document.getElementById("backTitle");
  const bTag = document.getElementById("backTag");

  const badge = document.getElementById("badge");

  const mTitle = document.getElementById("mTitle");
  const mText = document.getElementById("mText");
  const mDemo = document.getElementById("mDemo");

  const render = () => {
    const c = cards[i];
    const n = cards[(i + 1) % cards.length];

    fImg.src = c.image;
    fTitle.textContent = c.title;
    fTag.textContent = c.tag;

    bImg.src = n.image;
    bTitle.textContent = n.title;
    bTag.textContent = n.tag;
  };

  const next = () => {
    i = (i + 1) % cards.length;
    render();
  };

  let startX = null;

  fImg.addEventListener("pointerdown", e => startX = e.clientX);
  fImg.addEventListener("pointerup", e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 80) next();
    startX = null;
  });

  document.getElementById("btnProject").onclick = () => {
    const c = cards[i];
    mTitle.textContent = c.title;
    mText.textContent = c.tag;
    mDemo.href = c.demo;
    document.getElementById("modalProject").classList.add("open");
  };

  document.getElementById("btnSuper").onclick = () =>
    document.getElementById("modalContact").classList.add("open");

  document.getElementById("btnProfile").onclick = () =>
    document.getElementById("modalProfile").classList.add("open");

  document.querySelectorAll("[data-close]").forEach(el =>
    el.onclick = () =>
      el.closest(".modal").classList.remove("open")
  );

  render();
})();
