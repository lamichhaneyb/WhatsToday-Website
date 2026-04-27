from datetime import date, timedelta

from flask import Blueprint, render_template, request

from app.src.dates import display_date, random_day_display, today_display
from app.src.rss import local_news
from app.src.wikimedia import birthday_articles, event_articles, featured_sections, holiday_articles, nearby_articles

main_bp = Blueprint("main", __name__)

PAGE_SIZE = 8


@main_bp.app_context_processor
def inject_auth_user():
    from flask import session
    from app.models import User
    user = User.query.get(session["user_id"]) if session.get("user_id") else None
    return {"current_user": user}


@main_bp.get("/")
def home():
    today = today_display()
    articles = event_articles(today["month"], today["day"], limit=50)
    return render_template("pages/home.html.j2", page="home", today=today, articles=articles[:PAGE_SIZE], total=len(articles), page_size=PAGE_SIZE)


@main_bp.get("/random-day")
def random_day():
    random_date = random_day_display()
    today = today_display()
    articles = event_articles(random_date["month"], random_date["day"], limit=50)
    return render_template("pages/random_day.html.j2", page="random", today=today, random_date=random_date, articles=articles[:PAGE_SIZE], total=len(articles), page_size=PAGE_SIZE)


@main_bp.get("/birthdays")
def birthdays():
    today = today_display()
    articles = birthday_articles(today["month"], today["day"], limit=50)
    return render_template("pages/birthdays.html.j2", page="birthdays", today=today, articles=articles[:PAGE_SIZE], total=len(articles), page_size=PAGE_SIZE)


@main_bp.get("/holidays")
def holidays():
    today = today_display()
    articles = holiday_articles(today["month"], today["day"], limit=50)
    return render_template("pages/holidays.html.j2", page="holidays", today=today, articles=articles[:PAGE_SIZE], total=len(articles), page_size=PAGE_SIZE)


@main_bp.get("/news-today")
def news_today():
    today = today_display()
    sections = featured_sections(today["year"], today["month"], today["day"])
    return render_template("pages/news_today.html.j2", page="news", today=today, sections=sections, page_size=5)


@main_bp.get("/local")
def local():
    today = today_display()
    rss_articles = local_news(limit=15)
    wiki_articles = nearby_articles(41.1537, -81.3579, limit=10)
    return render_template("pages/local.html.j2", page="local", today=today, rss_articles=rss_articles, wiki_articles=wiki_articles)


@main_bp.get("/event-map")
def event_map():
    return render_template("pages/event_map.html.j2", page="map", today=today_display())


@main_bp.get("/timeline")
def timeline():
    return render_template("pages/timeline.html.j2", page="timeline", today=today_display())
