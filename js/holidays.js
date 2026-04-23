document.addEventListener("DOMContentLoaded", async () => {
    const today = getToday();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.shortDate;
    });

    // fetch holidays
    const data = await getHolidays(today.month, today.day);

    if (data && data.holidays) {
        renderHolidayCards(data.holidays);
    }
});

function renderHolidayCards(holidays) {
    const grid = document.getElementById("contentGrid");
    grid.innerHTML = "";

    holidays.slice(0, 8).forEach(holiday => {
        const rawTitle =
            holiday.pages?.[0]?.title ||
            holiday.text.split(":")[1]?.trim() ||
            "Holiday";

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
        desc.textContent = holiday.text;

        body.appendChild(title);
        body.appendChild(desc);

        card.appendChild(body);

        if (holiday.pages?.[0]?.thumbnail?.source) {
            const imageWrapper = document.createElement("div");
            imageWrapper.className = "articleImage";

            const img = document.createElement("img");
            img.src = holiday.pages[0].thumbnail.source;
            img.alt = rawTitle;

            imageWrapper.appendChild(img);
            card.appendChild(imageWrapper);
        }

        grid.appendChild(card);
    });
}