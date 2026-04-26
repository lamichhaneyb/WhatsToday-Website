document.addEventListener("DOMContentLoaded", () => {
    // TEMP test load
    loadCountryArticles("USA");
    const today = getToday();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.longDate;
    });
});

async function loadCountryArticles(countryName) {
    const coords = getCountryCoordinates(countryName);

    if (!coords) {
        console.error("Country not found:", countryName);
        return;
    }

    const data = await getNearbyArticles(
        coords.lat,
        coords.lon,
        10000
    );

    console.log("Geo API response:", data);

    if (!data?.query?.geosearch) {
        console.error("No articles returned");
        return;
    }

    renderMapArticles(countryName, data.query.geosearch);
}

function renderMapArticles(countryName, articles) {
    const grid = document.getElementById("contentGrid");

    if (!grid) {
        console.error("contentGrid missing");
        return;
    }

    grid.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = `Articles near ${countryName}`;
    grid.appendChild(heading);

    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "articleCard";
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.open(
                `https://en.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, "_"))}`,
                "_blank"
            );
        });

        const body = document.createElement("div");
        body.className = "articleBody";

        const title = document.createElement("h2");
        title.className = "articleTitle";
        title.textContent = article.title;

        const desc = document.createElement("p");
        desc.className = "articleDesc";
        desc.textContent =
            `Distance: ${(article.dist / 1000).toFixed(1)} km`;

        body.appendChild(title);
        body.appendChild(desc);

        card.appendChild(body);
        grid.appendChild(card);
    });
}