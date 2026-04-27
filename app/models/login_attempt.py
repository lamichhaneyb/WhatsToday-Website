from datetime import datetime, timezone

from app.extensions import db


class LoginAttempt(db.Model):
    __tablename__ = "login_attempts"

    id = db.Column(db.Integer, primary_key=True)
    identifier = db.Column(db.String(255), nullable=False)
    success = db.Column(db.Boolean, nullable=False, default=False)
    reason = db.Column(db.String(80))
    ip = db.Column(db.String(80))
    user_agent = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
