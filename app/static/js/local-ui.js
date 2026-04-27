document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sectionTitle").forEach(title => {
    title.addEventListener("click", () => {
      const content = title.nextElementSibling;
      if (!content) return;
      content.style.display = content.style.display === "none" ? "flex" : "none";
    });
  });
});
