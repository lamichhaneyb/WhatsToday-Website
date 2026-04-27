document.addEventListener("DOMContentLoaded", async () => {
    const today = getToday();

    const month = today.month;
    const day = today.day;
    const year = new Date().getFullYear();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.longDate;
    });

    const data = await getFeaturedContent(year, month, day);

    if (!data) {
        console.error("No featured data returned");
        return;
    }

    renderNewsSections(data);
});

function renderNewsSections(data) {
    // clear all sections first
    document.getElementById("featuredContainer").innerHTML = "";
    document.getElementById("todayArticlesContainer").innerHTML = "";
    document.getElementById("mostViewedContainer").innerHTML = "";

    // Featured Article
    if (data.tfa) {
        addCard(
            "featuredContainer",
            (data.tfa.title || "").replace(/_/g, " "),
            data.tfa.extract,
            data.tfa.content_urls?.desktop?.page,
            data.tfa.thumbnail?.source
        );
    }

    // Today's News Stories
    if (data.news) {
        data.news.slice(0, 5).forEach(n => {
            const title =
                (n.links?.[0]?.title || "News")
                    .replace(/_/g, " ");

            const text = n.story || "";

            addCard(
                "todayArticlesContainer",
                title,
                text,
                n.links?.[0]?.content_urls?.desktop?.page
            );
        });
    }

    // Most Read Yesterday
    if (data.mostread?.articles) {
        data.mostread.articles.slice(0, 5).forEach(a => {
            addCard(
                "mostViewedContainer",
                (a.title || "").replace(/_/g, " "),
                a.extract,
                a.content_urls?.desktop?.page,
                a.thumbnail?.source
            );
        });
    }
}

function addCard(containerId, title, text, url, image) {
    if (!title || !text) return;

    const container = document.getElementById(containerId);

    const card = document.createElement("div");
    card.className = "articleCard";
    card.style.cursor = "pointer";

    if (url) {
        card.addEventListener("click", () => {
            window.open(url, "_blank");
        });
    }

    const body = document.createElement("div");
    body.className = "articleBody";

    const h2 = document.createElement("h2");
    h2.className = "articleTitle";
    h2.textContent = title;

    const p = document.createElement("p");
    p.className = "articleDesc";

    // strip HTML tags safely
    const temp = document.createElement("div");
    temp.innerHTML = text;
    p.textContent = temp.textContent || temp.innerText || "";

    body.appendChild(h2);
    body.appendChild(p);
    card.appendChild(body);

    if (image) {
        const imgWrap = document.createElement("div");
        imgWrap.className = "articleImage";

        const img = document.createElement("img");
        img.src = image;
        img.alt = title;

        imgWrap.appendChild(img);
        card.appendChild(imgWrap);
    }

    container.appendChild(card);
}