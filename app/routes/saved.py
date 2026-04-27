from flask import Blueprint, flash, jsonify, redirect, render_template, request, session, url_for

from app.extensions import db
from app.models import SavedArticle
from app.src.dates import today_display

saved_bp = Blueprint("saved", __name__, url_prefix="/saved")


def require_login():
    return session.get("user_id")


def wants_json():
    return request.headers.get("X-Requested-With") == "fetch" or "application/json" in request.headers.get("Accept", "")


@saved_bp.get("")
def saved_articles():
    user_id = require_login()
    if not user_id:
        flash("Log in to view saved articles.")
        return redirect(url_for("auth.login_form"))
    articles = SavedArticle.query.filter_by(user_id=user_id).order_by(SavedArticle.saved_at.desc()).all()
    return render_template("pages/saved.html.j2", page="saved", today=today_display(), articles=articles)


@saved_bp.post("/add")
def add_saved_article():
    user_id = require_login()
    if not user_id:
        if wants_json():
            return jsonify({"ok": False, "login_required": True}), 401
        flash("Log in to save articles.")
        return redirect(request.referrer or url_for("auth.login_form"))

    url = request.form.get("url") or "#"
    existing = SavedArticle.query.filter_by(user_id=user_id, url=url).first()
    created = False
    if not existing:
        db.session.add(SavedArticle(
            user_id=user_id,
            title=request.form.get("title") or "Untitled",
            description=request.form.get("description") or "",
            url=url,
            image_url=request.form.get("image_url") or None,
            source=request.form.get("source") or "Wikipedia",
            article_type=request.form.get("article_type") or "article",
        ))
        db.session.commit()
        created = True

    if wants_json():
        return jsonify({"ok": True, "created": created})
    flash("Article saved." if created else "Article is already saved.")
    return redirect(request.referrer or url_for("saved.saved_articles"))


@saved_bp.post("/<int:article_id>/delete")
def delete_saved_article(article_id):
    user_id = require_login()
    if not user_id:
        if wants_json():
            return jsonify({"ok": False, "login_required": True}), 401
        return redirect(url_for("auth.login_form"))

    article = SavedArticle.query.filter_by(id=article_id, user_id=user_id).first_or_404()
    db.session.delete(article)
    db.session.commit()

    if wants_json():
        return jsonify({"ok": True, "deleted": True})
    return redirect(url_for("saved.saved_articles"))
