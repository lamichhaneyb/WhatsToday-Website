document.addEventListener("DOMContentLoaded", async () => {
    const today = getToday();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.longDate;
    });

    // fetch birthdays
    const data = await getBirthdays(today.month, today.day);

    if (data && data.births) {
        renderBirthdayCards(data.births);
    }
});

function renderBirthdayCards(birthdays) {
    const grid = document.getElementById("birthdayGrid");
    grid.innerHTML = "";

    birthdays.slice(0, 8).forEach(person => {
        const rawTitle =
            person.pages?.[0]?.title || "Wikipedia Person";

        const card = document.createElement("div");
        card.className = "birthdayCard";
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.open(
                `https://en.wikipedia.org/wiki/${rawTitle}`,
                "_blank"
            );
        });

        // image
        const imageWrapper = document.createElement("div");
        imageWrapper.className = "birthdayImage";

        if (person.pages?.[0]?.thumbnail?.source) {
            const img = document.createElement("img");
            img.src = person.pages[0].thumbnail.source;
            img.alt = rawTitle.replace(/_/g, " ");
            imageWrapper.appendChild(img);
        }

        // info row
        const info = document.createElement("div");
        info.className = "birthdayInfo";

        const name = document.createElement("span");
        name.className = "birthdayName";
        name.textContent = rawTitle.replace(/_/g, " ");

        const year = document.createElement("span");
        year.className = "birthdayYear";
        year.textContent = person.year;

        info.appendChild(name);
        info.appendChild(year);

        // description
        const desc = document.createElement("p");
        desc.className = "birthdayDesc";
        desc.textContent =
            person.pages?.[0]?.description ||
            `${person.year} birth`;

        // build card
        card.appendChild(imageWrapper);
        card.appendChild(info);
        card.appendChild(desc);

        grid.appendChild(card);
    });
}