// run when page loads
document.addEventListener("DOMContentLoaded", () => {

    // rss source
    const rssUrl = "https://news.google.com/rss/search?q=kent+ohio";
  
    // convert rss to json
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  
    // get data
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
  
        if (!data.items) return;
  
        const articles = data.items;
  
        // fill sections
        renderSection("trendingSection", articles.slice(0, 5));
        renderSection("liveSection", articles.slice(2, 7), true);
        renderAlerts("alertsSection", articles.slice(0, 3));
        renderSection("recommendedSection", articles.slice(5, 10));
  
      })
      .catch(err => {
        console.log("RSS failed", err);
      });
  
  
    // add cards to section
    function renderSection(id, items, isLive = false) {
      const container = document.getElementById(id);
      if (!container) return;
  
      container.innerHTML = "";
  
      items.forEach(item => {
        container.appendChild(createCard(item, isLive));
      });
    }
  
  
    // add alerts
    function renderAlerts(id, items) {
      const container = document.getElementById(id);
      if (!container) return;
  
      container.innerHTML = "";
  
      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "alertItem";
        div.innerText = item.title;
        div.dataset.url = item.link;
        container.appendChild(div);
      });
    }
  
  
    // get image
    function extractImage(item) {
  
      if (item.enclosure && item.enclosure.link) {
        return item.enclosure.link;
      }
  
      if (item.thumbnail && item.thumbnail.startsWith("http")) {
        return item.thumbnail;
      }
  
      if (item.description) {
        const match = item.description.match(/<img[^>]+src="([^">]+)"/);
        if (match && match[1]) {
          return match[1];
        }
      }
  
      // fallback
      return "https://picsum.photos/300/200?random=" + Math.floor(Math.random() * 1000);
    }
  
  
    // create card
    function createCard(item, isLive = false) {
  
      const div = document.createElement("div");
      div.className = "scrollCard";
  
      const image = extractImage(item);
  
      if (isLive) {
        div.innerHTML = `
          <div class="videoWrapper">
            <img src="${image}" onerror="this.src='https://picsum.photos/300/200?random=${Math.floor(Math.random()*1000)}'" />
            <span class="liveBadge">LIVE</span>
          </div>
          <div class="cardContent">
            <p class="cardTitle">${item.title}</p>
          </div>
        `;
      } else {
        div.innerHTML = `
          <img class="cardImage" src="${image}" onerror="this.src='https://picsum.photos/300/200?random=${Math.floor(Math.random()*1000)}'" />
          <div class="cardContent">
            <p class="cardTitle">${item.title}</p>
          </div>
        `;
      }
  
      // store link
      div.dataset.url = item.link;
  
      return div;
    }
  
  });