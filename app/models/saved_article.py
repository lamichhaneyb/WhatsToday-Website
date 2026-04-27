from datetime import datetime, timezone

from app.extensions import db


class SavedArticle(db.Model):
    __tablename__ = "saved_articles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    url = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text)
    source = db.Column(db.String(120), default="Wikipedia")
    article_type = db.Column(db.String(80), default="article")
    saved_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = db.relationship("User", backref="saved_articles")
