document.addEventListener("DOMContentLoaded", async () => {
  const today = getToday();

  document.querySelectorAll(".date-display").forEach(el => {
    el.textContent = today.longDate;
  });

  await loadSvgMap();
});

async function loadSvgMap() {
  const wrap = document.getElementById("svgMapWrap");
  const res = await fetch("assets/world.svg");
  const svgText = await res.text();

  wrap.innerHTML = svgText;

  const svg = wrap.querySelector("svg");

  if (svg) {
    const box = svg.getBBox();
    svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
    svg.removeAttribute("width");
    svg.removeAttribute("height");
  }

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  const countries = [...wrap.querySelectorAll("svg g[id]")].filter(country => {
    const code = country.id.toUpperCase();
    return code.length === 2;
  });

  countries.forEach(country => {
    country.classList.add("country");

    country.addEventListener("click", () => {
      countries.forEach(c => c.classList.remove("selected-country"));
      country.classList.add("selected-country");

      const code = country.id.toUpperCase();
      const countryName = regionNames.of(code);

      loadCountryArticles(countryName);
    });
  });
}

async function loadCountryArticles(countryName) {
  const selectedCountry = document.getElementById("selectedCountry");
  const grid = document.getElementById("contentGrid");

  selectedCountry.textContent = countryName;
  grid.innerHTML = "<p>Loading articles...</p>";

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  let articles = await getTodayArticlesForCountry(countryName, month, day);

  if (articles.length < 4) {
    articles = await getGeneralCountryArticles(countryName);
  }

  renderArticles(countryName, articles);
}

async function getTodayArticlesForCountry(countryName, month, day) {
  try {
    const url =
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

    const res = await fetch(url);
    const data = await res.json();

    const allItems = [
      ...(data.events || []),
      ...(data.births || []),
      ...(data.deaths || []),
      ...(data.holidays || [])
    ];

    const matchingPages = [];

    allItems.forEach(item => {
      const text = `${item.text || ""}`.toLowerCase();

      if (!text.includes(countryName.toLowerCase())) return;

      if (item.pages) {
        item.pages.forEach(page => {
          matchingPages.push({
            pageid: page.pageid,
            title: page.title,
            extract: item.text,
            thumbnail: page.thumbnail
          });
        });
      }
    });

    return matchingPages.slice(0, 12);
  } catch (error) {
    console.error("Could not load today articles:", error);
    return [];
  }
}

async function getGeneralCountryArticles(countryName) {
  try {
    const query = `${countryName} history culture events`;

    const url =
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=12&prop=pageimages|extracts&exintro=1&explaintext=1&exsentences=2&piprop=thumbnail&pithumbsize=400&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    return Object.values(data.query?.pages || []);
  } catch (error) {
    console.error("Could not load country articles:", error);
    return [];
  }
}

function renderArticles(countryName, articles) {
  const grid = document.getElementById("contentGrid");
  grid.innerHTML = "";

  if (!articles.length) {
    grid.innerHTML = `<p>No articles found for ${countryName}.</p>`;
    return;
  }

  articles.forEach(article => {
    const hasImage = article.thumbnail?.source;

    const card = document.createElement("div");
    card.className = "mapArticleCard" + (hasImage ? "" : " no-image");

    const image = hasImage
        ? `<img class="mapArticleImage" src="${article.thumbnail.source}" alt="${article.title}">`
        : "";

    card.innerHTML = `
        ${image}
        <div class="mapArticleBody">
        <h2 class="mapArticleTitle">${article.title.replace(/_/g, " ")}</h2>
        <p class="mapArticleDesc">${article.extract || "No description available."}</p>
        </div>
    `;

    card.addEventListener("click", () => {
        window.open(`https://en.wikipedia.org/?curid=${article.pageid}`, "_blank");
    });

    grid.appendChild(card);
    });
}