document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("loginRequiredModal");

  const showToast = (message, type = "info") => {
    const old = document.querySelector(".saveToast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.className = `saveToast saveToast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2200);
  };

  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modalOpen");
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modalOpen");
  };

  document.addEventListener("click", (event) => {
    const bookmark = event.target.closest(".bookmarkButton");
    if (!bookmark) return;

    event.preventDefault();
    event.stopPropagation();

    if (bookmark.classList.contains("loginRequiredSave")) {
      openModal();
      return;
    }

    const form = bookmark.closest(".saveForm");
    if (form) form.requestSubmit();
  }, true);

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest(".saveForm");
    if (!form) return;

    event.preventDefault();
    event.stopPropagation();

    const saveButton = form.querySelector(".bookmarkButton");
    const removeButton = form.querySelector(".removeBookmarkButton");
    const button = saveButton || removeButton;

    if (button?.disabled) return;
    if (button) button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "fetch",
          "Accept": "application/json"
        }
      });

      if (response.status === 401) {
        openModal();
        return;
      }

      let data = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok || !data?.ok) {
        showToast(data?.message || "Could not update saved articles", "error");
        return;
      }

      if (removeButton) {
        const card = form.closest(".articleCard");
        if (card) {
          card.classList.add("is-removing");
          window.setTimeout(() => {
            card.remove();
            const grid = document.getElementById("contentGrid");
            if (grid && !grid.querySelector(".articleCard")) {
              grid.innerHTML = '<p class="emptyState">No saved articles yet. Use the bookmark button on any article to build your list.</p>';
            }
          }, 160);
        }
        showToast("Removed from saved", "success");
        return;
      }

      if (saveButton) {
        saveButton.classList.add("is-saved");
        saveButton.setAttribute("aria-label", "Article saved");
        saveButton.setAttribute("title", "Article saved");
        showToast(data.created ? "Article saved" : "Already saved", "success");
      }
    } catch (error) {
      showToast("Could not update saved articles", "error");
    } finally {
      if (button) button.disabled = false;
    }
  }, true);

  modal?.querySelector(".modalClose")?.addEventListener("click", closeModal);
  modal?.querySelector(".modalSecondary")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) closeModal();
  });
});
