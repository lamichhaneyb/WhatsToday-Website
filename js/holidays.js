document.addEventListener("DOMContentLoaded", async () => {
    const today = getToday();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.longDate;
    });

    // fetch holidays
    const data = await getHolidays(today.month, today.day);

    if (data && data.holidays) {
        renderHolidayCards(data.holidays);
    }
});

function renderHolidayCards(holidays) {
    const container = document.getElementById("holidayContent");
    container.innerHTML = '<div class="centerLine"></div>';

    holidays.slice(0, 8).forEach((holiday, index) => {
        const rawTitle =
            holiday.pages?.[0]?.title ||
            holiday.text.split(":")[1]?.trim() ||
            "Holiday";

        const sideClass = index % 2 === 0
            ? "cardLeft"
            : "cardRight";

        const wrapper = document.createElement("div");
        wrapper.className = `${sideClass} onLine`;

        wrapper.style.cursor = "pointer";

        wrapper.addEventListener("click", () => {
            window.open(
                `https://en.wikipedia.org/wiki/${rawTitle}`,
                "_blank"
            );
        });

        const card = document.createElement("div");
        card.className = "holidayCard";

        const textContent = document.createElement("div");
        textContent.className = "textContent";

        const header = document.createElement("div");
        header.className = "cardHeader";

        const title = document.createElement("span");
        title.className = "holidayName";
        title.textContent = rawTitle.replace(/_/g, " ");

        const desc = document.createElement("p");
        desc.className = "holidayDesc";
        desc.textContent = holiday.text;

        header.appendChild(title);
        textContent.appendChild(header);
        textContent.appendChild(desc);

        card.appendChild(textContent);

        // optional image
        if (holiday.pages?.[0]?.thumbnail?.source) {
            const imageWrapper = document.createElement("div");
            imageWrapper.className = "holidayImage";

            const img = document.createElement("img");
            img.src = holiday.pages[0].thumbnail.source;
            img.alt = rawTitle;

            imageWrapper.appendChild(img);
            card.appendChild(imageWrapper);
        }

        const dot = document.createElement("div");
        dot.className = "holidayDot";

        if (sideClass === "cardLeft") {
            wrapper.appendChild(card);
            wrapper.appendChild(dot);
        } else {
            wrapper.appendChild(dot);
            wrapper.appendChild(card);
        }

        container.appendChild(wrapper);
    });
}