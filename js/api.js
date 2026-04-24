// base api url
const BASE_URL = "https://api.wikimedia.org/feed/v1/wikipedia/en";

// Generic fetch helper
async function fetchWikiFeed(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Wikimedia API error:", error);
        return null;
    }
}

// Get events for any date
async function getEvents(month, day) {
    return await fetchWikiFeed(
        `/onthisday/events/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`
    );
}

// Get birthdays for any date (but only using todays date?)
async function getBirthdays(month, day) {
    return await fetchWikiFeed(
        `/onthisday/births/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`
    );
}

// Get Holidays
async function getHolidays(month, day) {
    return await fetchWikiFeed(
        `/onthisday/holidays/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`
    );
}

// Get featured content for News Today
async function getFeaturedContent(year, month, day) {
    return await fetchWikiFeed(
        `/featured/${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`
    );
}

// GeoSearch articles nearby (local)
async function getNearbyArticles(lat, lon, radius = 10000) {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=${radius}&gslimit=10&format=json`;

    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("GeoSearch error:", error);
        return null;
    }
}