document.addEventListener("DOMContentLoaded", async () => {
    const today = getToday();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.shortDate;
    });

    // fetch birthdays
    const data = await getBirthdays(today.month, today.day);

    if (data && data.births) {
        renderBirthdayCards(data.births);
    }
});

function renderBirthdayCards(births) {
    const grid = document.getElementById("contentGrid");
    grid.innerHTML = "";

    births.slice(0, 10).forEach(person => {
        const rawTitle = person.pages?.[0]?.title || "Unknown";

        const card = document.createElement("div");
        card.className = "articleCard";

        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.open(
                `https://en.wikipedia.org/wiki/${rawTitle}`,
                "_blank"
            );
        });

        const body = document.createElement("div");
        body.className = "articleBody";

        const title = document.createElement("h2");
        title.className = "articleTitle";
        title.textContent = rawTitle.replace(/_/g, " ");

        const desc = document.createElement("p");
        desc.className = "articleDesc";
        desc.textContent = `Born: ${person.year}`;

        body.appendChild(title);
        body.appendChild(desc);

        card.appendChild(body);

        if (person.pages?.[0]?.thumbnail?.source) {
            const imageWrapper = document.createElement("div");
            imageWrapper.className = "articleImage";

            const img = document.createElement("img");
            img.src = person.pages[0].thumbnail.source;
            img.alt = rawTitle;

            imageWrapper.appendChild(img);
            card.appendChild(imageWrapper);
        }

        grid.appendChild(card);
    });
}