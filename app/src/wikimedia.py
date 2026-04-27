from __future__ import annotations

from dataclasses import dataclass
from html import unescape
from re import sub
from typing import Any
from urllib.parse import quote

import requests

WIKI_FEED_BASE = "https://api.wikimedia.org/feed/v1/wikipedia/en"
WIKI_API_BASE = "https://en.wikipedia.org/w/api.php"
TIMEOUT = 8

@dataclass
class Article:
    title: str
    description: str = ""
    url: str = "#"
    image_url: str | None = None
    source: str = "Wikipedia"
    article_type: str = "article"


def strip_html(value: str | None) -> str:
    if not value:
        return ""
    return unescape(sub(r"<[^>]+>", "", value)).strip()


def title_to_url(title: str) -> str:
    return f"https://en.wikipedia.org/wiki/{quote(title.replace(' ', '_'))}"


def fetch_json(url: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    try:
        r = requests.get(url, params=params, timeout=TIMEOUT, headers={"User-Agent": "WhatsToday-Flask/1.0"})
        r.raise_for_status()
        return r.json()
    except requests.RequestException:
        return {}


def feed(endpoint: str) -> dict[str, Any]:
    return fetch_json(f"{WIKI_FEED_BASE}{endpoint}")


def on_this_day(kind: str, month: int, day: int) -> dict[str, Any]:
    return feed(f"/onthisday/{kind}/{month:02d}/{day:02d}")


def event_articles(month: int, day: int, limit: int = 50) -> list[Article]:
    data = on_this_day("events", month, day)
    out = []
    for item in data.get("events", [])[:limit]:
        page = (item.get("pages") or [{}])[0]
        raw_title = page.get("title") or "Wikipedia Event"
        out.append(Article(raw_title.replace("_", " "), f"{item.get('year', '')}: {item.get('text', '')}".strip(), page.get("content_urls", {}).get("desktop", {}).get("page") or title_to_url(raw_title), (page.get("thumbnail") or {}).get("source"), article_type="event"))
    return out


def birthday_articles(month: int, day: int, limit: int = 50) -> list[Article]:
    data = on_this_day("births", month, day)
    out = []
    for item in data.get("births", [])[:limit]:
        page = (item.get("pages") or [{}])[0]
        raw_title = page.get("title") or "Wikipedia Person"
        out.append(Article(raw_title.replace("_", " "), page.get("description") or f"{item.get('year', '')} birth", page.get("content_urls", {}).get("desktop", {}).get("page") or title_to_url(raw_title), (page.get("thumbnail") or {}).get("source"), article_type="birthday"))
    return out


def holiday_articles(month: int, day: int, limit: int = 50) -> list[Article]:
    data = on_this_day("holidays", month, day)
    out = []
    for item in data.get("holidays", [])[:limit]:
        page = (item.get("pages") or [{}])[0]
        raw_title = page.get("title") or (item.get("text", "Holiday").split(":")[-1].strip() or "Holiday")
        out.append(Article(raw_title.replace("_", " "), item.get("text", ""), page.get("content_urls", {}).get("desktop", {}).get("page") or title_to_url(raw_title), (page.get("thumbnail") or {}).get("source"), article_type="holiday"))
    return out


def featured_sections(year: int, month: int, day: int) -> dict[str, list[Article]]:
    data = feed(f"/featured/{year}/{month:02d}/{day:02d}")
    sections = {"featured": [], "today": [], "most_viewed": []}
    tfa = data.get("tfa")
    if tfa:
        title = (tfa.get("title") or "Featured Article").replace("_", " ")
        sections["featured"].append(Article(title, strip_html(tfa.get("extract")), tfa.get("content_urls", {}).get("desktop", {}).get("page") or title_to_url(title), (tfa.get("thumbnail") or {}).get("source"), article_type="featured"))
    for item in data.get("news", [])[:20]:
        link = (item.get("links") or [{}])[0]
        title = (link.get("title") or "News").replace("_", " ")
        sections["today"].append(Article(title, strip_html(item.get("story")), link.get("content_urls", {}).get("desktop", {}).get("page") or title_to_url(title), article_type="news"))
    for item in (data.get("mostread") or {}).get("articles", [])[:20]:
        title = (item.get("title") or "Article").replace("_", " ")
        sections["most_viewed"].append(Article(title, strip_html(item.get("extract")), item.get("content_urls", {}).get("desktop", {}).get("page") or title_to_url(title), (item.get("thumbnail") or {}).get("source"), article_type="most-viewed"))
    return sections

def nearby_articles(lat: float, lon: float, radius: int = 10000, limit: int = 20) -> list[Article]:
    data = fetch_json(WIKI_API_BASE, {
        "action": "query", "list": "geosearch", "gscoord": f"{lat}|{lon}",
        "gsradius": radius, "gslimit": limit, "format": "json"
    })
    out = []
    for place in data.get("query", {}).get("geosearch", []):
        title = place.get("title", "Wikipedia Article")
        dist = place.get("dist")
        desc = f"Distance: {dist / 1000:.1f} km" if isinstance(dist, (int, float)) else "Nearby article"
        out.append(Article(title, desc, title_to_url(title), article_type="local"))
    return out


def country_articles(country_name: str, month: int, day: int, limit: int = 12) -> list[Article]:
    data = on_this_day("all", month, day)
    out = []
    for group in ("events", "births", "deaths", "holidays"):
        for item in data.get(group, []):
            text = item.get("text", "")
            if country_name.lower() not in text.lower():
                continue
            for page in item.get("pages", []):
                title = page.get("title", "Article")
                out.append(Article(title.replace("_", " "), text, page.get("content_urls", {}).get("desktop", {}).get("page") or title_to_url(title), (page.get("thumbnail") or {}).get("source"), article_type="map"))
    if len(out) >= 4:
        return out[:limit]
    return general_country_articles(country_name, limit)


def general_country_articles(country_name: str, limit: int = 12) -> list[Article]:
    data = fetch_json(WIKI_API_BASE, {
        "action": "query", "generator": "search", "gsrsearch": f"{country_name} history culture events",
        "gsrlimit": limit, "prop": "pageimages|extracts", "exintro": 1, "explaintext": 1,
        "exsentences": 2, "piprop": "thumbnail", "pithumbsize": 400, "format": "json"
    })
    out = []
    for page in (data.get("query", {}).get("pages", {}) or {}).values():
        title = page.get("title", "Article")
        out.append(Article(title.replace("_", " "), page.get("extract") or "No description available.", f"https://en.wikipedia.org/?curid={page.get('pageid')}", (page.get("thumbnail") or {}).get("source"), article_type="map"))
    return out
