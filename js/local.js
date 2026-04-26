document.addEventListener("DOMContentLoaded", async () => {
    // Kent, Ohio coordinates
    const lat = 41.1537;
    const lon = -81.3579;

    const today = getToday();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.longDate;
    });


    const data = await getNearbyArticles(lat, lon);

    if (!data || !data.query || !data.query.geosearch) {
        console.error("No local articles found");
        return;
    }

    renderLocalCards(data.query.geosearch);
});

function renderLocalCards(places) {
    const grid = document.getElementById("contentGrid");

    if (!grid) {
        console.error("contentGrid not found");
        return;
    }

    grid.innerHTML = "";

    places.forEach(place => {
        const rawTitle = place.title || "Wikipedia Article";

        const card = document.createElement("div");
        card.className = "articleCard";
        card.style.cursor = "pointer";

        // clickable card
        card.addEventListener("click", () => {
            window.open(
                `https://en.wikipedia.org/wiki/${encodeURIComponent(rawTitle.replace(/ /g, "_"))}`,
                "_blank"
            );
        });

        const body = document.createElement("div");
        body.className = "articleBody";

        const title = document.createElement("h2");
        title.className = "articleTitle";
        title.textContent = rawTitle;

        const desc = document.createElement("p");
        desc.className = "articleDesc";
        desc.textContent =
            `Distance: ${(place.dist / 1000).toFixed(1)} km`;

        body.appendChild(title);
        body.appendChild(desc);

        card.appendChild(body);

        grid.appendChild(card);
    });
}