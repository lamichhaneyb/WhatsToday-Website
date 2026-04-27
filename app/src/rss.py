from __future__ import annotations

import hashlib
import re
import xml.etree.ElementTree as ET

import requests

from .wikimedia import Article, strip_html


def fallback_image(title: str) -> str:
    seed = int(hashlib.md5(title.encode("utf-8")).hexdigest()[:8], 16) % 1000
    return f"https://picsum.photos/seed/whatstoday-{seed}/360/220"


def item_image(item: ET.Element, title: str, raw_desc: str) -> str:
    for child in item.iter():
        tag = child.tag.lower()
        if tag.endswith("thumbnail") or tag.endswith("content"):
            url = child.attrib.get("url") or child.attrib.get("href")
            if url and url.startswith("http"):
                return url
        if tag.endswith("enclosure"):
            url = child.attrib.get("url")
            if url and url.startswith("http"):
                return url

    image_match = re.search(r"<img[^>]+src=['\"]([^'\"]+)", raw_desc)
    if image_match and image_match.group(1).startswith("http"):
        return image_match.group(1)

    return fallback_image(title)


def local_news(query: str = "kent ohio", limit: int = 15) -> list[Article]:
    url = "https://news.google.com/rss/search"
    try:
        r = requests.get(
            url,
            params={"q": query},
            timeout=8,
            headers={"User-Agent": "WhatsToday-Flask/1.0"},
        )
        r.raise_for_status()
        root = ET.fromstring(r.text)
    except Exception:
        return []

    articles = []
    for item in root.findall(".//item")[:limit]:
        title = item.findtext("title") or "Local News"
        link = item.findtext("link") or "#"
        raw_desc = item.findtext("description") or ""
        desc = strip_html(raw_desc)
        articles.append(
            Article(
                title=title,
                description=desc,
                url=link,
                image_url=item_image(item, title, raw_desc),
                source="Google News",
                article_type="local-news",
            )
        )
    return articles
