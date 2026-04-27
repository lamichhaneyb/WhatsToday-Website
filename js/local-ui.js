// run after page loads
document.addEventListener("DOMContentLoaded", () => {

  console.log("local ui running");

  // toggle sections
  document.querySelectorAll(".sectionTitle").forEach(title => {
    title.addEventListener("click", () => {
      const content = title.nextElementSibling;

      if (!content) return;

      if (content.style.display === "none") {
        content.style.display = "flex";
      } else {
        content.style.display = "none";
      }
    });
  });


  // handle clicks
  document.addEventListener("click", (e) => {

    // get clicked card
    const card = e.target.closest(".scrollCard, .gridCard, .alertItem");

    if (!card) return;

    const type = card.dataset.type;
    const value = card.dataset.value;

    // open link if exists
    if (card.dataset.url) {
      window.open(card.dataset.url, "_blank");
      return;
    }

    // click animation
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "scale(1)";
    }, 150);


    // explore search
    if (type === "explore") {
      window.open(`https://www.google.com/search?q=${value}+near+me`, "_blank");
      return;
    }

    // fallback actions
    if (type === "trending") {
      alert("showing trending: " + value);
    }

    else if (type === "live") {
      alert("opening live: " + value);
    }

    else if (type === "alert") {
      alert("alert details: " + value);
    }

    else if (type === "recommended") {
      alert("recommended: " + value);
    }

  });

});