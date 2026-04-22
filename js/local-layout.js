// create cards with type info
function createCard(label, type) {
    const div = document.createElement("div");
    div.className = "scrollCard";
    div.innerText = label;
  
    div.dataset.type = type;
    div.dataset.value = label;
  
    return div;
  }
  
  
  // wait for page to load
  document.addEventListener("DOMContentLoaded", () => {
  
    // trending
    const trending = document.getElementById("trendingSection");
    ["Hot Topic", "Viral Spot", "Campus Buzz"].forEach(text => {
      trending.appendChild(createCard(text, "trending"));
    });
  
    // live
    const live = document.getElementById("liveSection");
    ["Live Now", "Event Stream", "Nearby Video"].forEach(text => {
      live.appendChild(createCard(text, "live"));
    });
  
    // alerts
    const alerts = document.getElementById("alertsSection");
    ["Quick Update", "Traffic Info", "Weather Alert"].forEach(text => {
      const div = document.createElement("div");
      div.className = "alertItem";
      div.innerText = text;
  
      div.dataset.type = "alert";
      div.dataset.value = text;
  
      alerts.appendChild(div);
    });
  
    // explore
    const explore = document.getElementById("exploreSection");
    ["Food", "Cafes", "Events", "Places"].forEach(text => {
      const div = document.createElement("div");
      div.className = "gridCard";
      div.innerText = text;
  
      div.dataset.type = "explore";
      div.dataset.value = text;
  
      explore.appendChild(div);
    });
  
    // recommended
    const recommended = document.getElementById("recommendedSection");
    ["For You", "Popular", "Nearby Picks"].forEach(text => {
      recommended.appendChild(createCard(text, "recommended"));
    });
  
  });