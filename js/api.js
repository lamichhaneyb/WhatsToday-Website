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

// Country coordinates for event map
const countryCoordinates = {
    USA: { lat: 38.9072, lon: -77.0369 },
    France: { lat: 48.8566, lon: 2.3522 },
    Japan: { lat: 35.6762, lon: 139.6503 },
    Brazil: { lat: -15.7939, lon: -47.8828 },
    UK: { lat: 51.5074, lon: -0.1278 },
    Germany: { lat: 52.5200, lon: 13.4050 },
    India: { lat: 28.6139, lon: 77.2090 },
    Canada: { lat: 45.4215, lon: -75.6972 }
};

function getCountryCoordinates(countryName) {
    return countryCoordinates[countryName] || null;
}