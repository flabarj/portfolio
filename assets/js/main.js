(function () {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");

  function openModal(title) {
    modal.classList.add("is-open");
    modalTitle.textContent = title;
  }

  function closeModal() {
    modal.classList.remove("is-open");
  }

  const services = document.querySelectorAll(".service");
  services.forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.getAttribute("data-title") || "Projeto";
      openModal(title);
    });
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "1") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
