document.addEventListener("DOMContentLoaded", () => {
  const filterInput = document.getElementById("keywordFilter");
  if (filterInput) {
    filterInput.addEventListener("input", () => {
      const term = filterInput.value.toLowerCase();
      document.querySelectorAll("#contentGrid .articleCard").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? "" : "none";
      });
    });
  }

  document.querySelectorAll(".loadMore").forEach(button => {
    button.addEventListener("click", async () => {
      const container = document.querySelector(button.dataset.container || "#contentGrid");
      const offset = Number(button.dataset.offset || 0);
      const limit = Number(button.dataset.limit || 8);
      const separator = button.dataset.url.includes("?") ? "&" : "?";
      const response = await fetch(`${button.dataset.url}${separator}offset=${offset}&limit=${limit}`);
      const data = await response.json();
      container.insertAdjacentHTML("beforeend", data.html);
      button.dataset.offset = offset + limit;
      if (!data.has_more) button.remove();
    });
  });
});
