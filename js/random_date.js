document.addEventListener("DOMContentLoaded", async () => {
    const random = getRandomDate();
    const today = getToday();

    // Display random date
    document.querySelectorAll(".random-date-display").forEach(el => {
        el.textContent = random.shortDate;
    });

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.longDate;
    });

    // Get events from API
    const eventData = await getEvents(random.month, random.day);

    // Render event cards if data exists
    if (eventData && eventData.events) {
        renderEventCards(eventData.events);
    }
});

function renderEventCards(events) {
    const grid = document.getElementById("contentGrid");
    grid.innerHTML = "";

    events.slice(0, 8).forEach(event => {
        const rawTitle =
            event.pages?.[0]?.title || "Wikipedia_Event";

        // Create clickable card
        const card = document.createElement("div");
        card.className = "articleCard";
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.open(
                `https://en.wikipedia.org/wiki/${rawTitle}`,
                "_blank"
            );
        });

        // Article body
        const body = document.createElement("div");
        body.className = "articleBody";

        const title = document.createElement("h2");
        title.className = "articleTitle";
        title.textContent = rawTitle.replace(/_/g, " ");

        const desc = document.createElement("p");
        desc.className = "articleDesc";
        desc.textContent = `${event.year}: ${event.text}`;

        body.appendChild(title);
        body.appendChild(desc);

        card.appendChild(body);

        // Add image only if available
        if (event.pages?.[0]?.thumbnail?.source) {
            const imageWrapper = document.createElement("div");
            imageWrapper.className = "articleImage";

            const img = document.createElement("img");
            img.src = event.pages[0].thumbnail.source;
            img.alt = rawTitle;

            imageWrapper.appendChild(img);
            card.appendChild(imageWrapper);
        }

        grid.appendChild(card);
    });
}