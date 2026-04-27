from flask import Blueprint, jsonify, render_template, request

from app.src.dates import random_day_display, today_display
from app.src.wikimedia import birthday_articles, country_articles, event_articles, holiday_articles

partials_bp = Blueprint("partials", __name__, url_prefix="/partials")
PAGE_SIZE = 8


def slice_items(items):
    offset = max(int(request.args.get("offset", 0)), 0)
    limit = max(min(int(request.args.get("limit", PAGE_SIZE)), 20), 1)
    return items[offset:offset + limit], offset + limit < len(items)


@partials_bp.get("/events")
def more_events():
    month = int(request.args.get("month", today_display()["month"]))
    day = int(request.args.get("day", today_display()["day"]))
    items, has_more = slice_items(event_articles(month, day, limit=50))
    html = render_template("components/article_list.html.j2", articles=items)
    return jsonify({"html": html, "has_more": has_more})


@partials_bp.get("/birthdays")
def more_birthdays():
    today = today_display()
    items, has_more = slice_items(birthday_articles(today["month"], today["day"], limit=50))
    html = render_template("components/birthday_list.html.j2", articles=items)
    return jsonify({"html": html, "has_more": has_more})


@partials_bp.get("/holidays")
def more_holidays():
    today = today_display()
    items, has_more = slice_items(holiday_articles(today["month"], today["day"], limit=50))
    html = render_template("components/holiday_list.html.j2", articles=items, offset=int(request.args.get("offset", 0)))
    return jsonify({"html": html, "has_more": has_more})


@partials_bp.get("/country")
def country():
    today = today_display()
    country_name = request.args.get("country", "")
    articles = country_articles(country_name, today["month"], today["day"], limit=12) if country_name else []
    return render_template("components/map_article_list.html.j2", articles=articles, country_name=country_name)
