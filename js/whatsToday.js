const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let allEvents = [];
let filteredEvents = [];

document.addEventListener("DOMContentLoaded", async () => {
    const today = getToday();

    // Display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.longDate;
    });

    // Fetch events
    const data = await getEvents(today.month, today.day);

    if (data && data.events) {
        allEvents = data.events;
        filteredEvents = allEvents;
        renderCurrentPage();
    }

    // Setup filter
    const filterInput = document.getElementById("keywordFilter");

    if (filterInput) {
        filterInput.addEventListener("input", () => {
            filterCards(filterInput.value);
        });
    }

    // Pagination buttons
    const nextBtn = document.getElementById("nextPage");
    const prevBtn = document.getElementById("prevPage");

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentPage * ITEMS_PER_PAGE < allEvents.length) {
                currentPage++;
                renderCurrentPage();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderCurrentPage();
            }
        });
    }
});

function renderCurrentPage() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const pageEvents = filteredEvents.slice(start, end);

    renderEventCards(pageEvents);
}

function renderEventCards(events) {
    const grid = document.getElementById("contentGrid");
    grid.innerHTML = "";

    events.forEach((event, index) => {
        const rawTitle =
            event.pages?.[0]?.title || "Wikipedia_Event";

        const card = document.createElement("div");
        card.className = "articleCard";
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.open(
                `https://en.wikipedia.org/wiki/${rawTitle}`,
                "_blank"
            );
        });

        // Body
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

        let imageWrapper = null;

        if (event.pages?.[0]?.thumbnail?.source) {
            imageWrapper = document.createElement("div");
            imageWrapper.className = "articleImage";

            const img = document.createElement("img");
            img.src = event.pages[0].thumbnail.source;
            img.alt = rawTitle;

            imageWrapper.appendChild(img);
        }

        // Alternate image side
        if (imageWrapper && index % 2 === 1) {
            card.appendChild(imageWrapper);
            card.appendChild(body);
        } else {
            card.appendChild(body);
            if (imageWrapper) {
                card.appendChild(imageWrapper);
            }
        }

        grid.appendChild(card);
    });
}

function filterCards(searchTerm) {
    const term = searchTerm.toLowerCase();

    filteredEvents = allEvents.filter(event => {
        const title =
            event.pages?.[0]?.title
                ?.replace(/_/g, " ")
                .toLowerCase() || "";

        const desc =
            `${event.year}: ${event.text}`.toLowerCase();

        return (
            title.includes(term) ||
            desc.includes(term)
        );
    });

    currentPage = 1;
    renderCurrentPage();
}