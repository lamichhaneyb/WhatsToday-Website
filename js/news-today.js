document.addEventListener("DOMContentLoaded", async () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // display date
    document.querySelectorAll(".date-display").forEach(el => {
        el.textContent = today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    });

    const data = await getFeaturedContent(year, month, day);

    if (!data) {
        console.error("No featured data returned");
        return;
    }

    renderFeatured(data);
});

function renderFeatured(data) {
    const grid = document.getElementById("contentGrid");
    grid.innerHTML = "";

    // helper to avoid bad entries
    function addCard(title, text, url, image) {
        if (!title || !text) return;

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

        // CLEAN HTML STRIPPING
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

            imgWrap.appendChild(img);
            card.appendChild(imgWrap);
        }

        grid.appendChild(card);
    }

    // Featured Article
    if (data.tfa) {
        addCard(
            (data.tfa.title || "").replace(/_/g, " "),
            data.tfa.extract,
            data.tfa.content_urls?.desktop?.page,
            data.tfa.thumbnail?.source
        );
    }

    // Stories From the News
    if (data.news) {
        data.news.slice(0, 5).forEach(n => {
            const title = (n.links?.[0]?.title || "News").replace(/_/g, " ");
            const text = n.story || "";

            addCard(
                title,
                text,
                n.links?.[0]?.content_urls?.desktop?.page
            );
        });
    }

    // Most Read Articles Yesterday
    if (data.mostread?.articles) {
        data.mostread.articles.slice(0, 5).forEach(a => {
            addCard(
                (a.title || "").replace(/_/g, " "),
                a.extract,
                a.content_urls?.desktop?.page,
                a.thumbnail?.source
            );
        });
    }
}
