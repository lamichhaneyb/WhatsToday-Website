// wait for page to load
document.addEventListener("DOMContentLoaded", () => {

    console.log("local ui running");
  
    // toggle sections open and close
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
  
  
    // handle clicks on cards
    document.addEventListener("click", (e) => {
  
      const card = e.target.closest(".scrollCard, .gridCard, .alertItem");
  
      if (!card) return;
  
      const type = card.dataset.type;
      const value = card.dataset.value;
  
      // click animation
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.style.transform = "scale(1)";
      }, 150);
  
  
      // real behavior (simple for now)
      if (type === "trending") {
        alert("showing trending: " + value);
      }
  
      else if (type === "live") {
        alert("opening live: " + value);
      }
  
      else if (type === "alert") {
        alert("alert details: " + value);
      }
  
      else if (type === "explore") {
        alert("exploring: " + value);
      }
  
      else if (type === "recommended") {
        alert("recommended: " + value);
      }
  
    });
  
  });