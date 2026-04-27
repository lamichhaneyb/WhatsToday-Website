from flask import Flask

from .config import Config
from .extensions import db

from .models import User, LoginAttempt, SavedArticle  # noqa: F401

from .routes.main import main_bp
from .routes.auth import auth_bp
from .routes.saved import saved_bp
from .routes.partials import partials_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(saved_bp)
    app.register_blueprint(partials_bp)

    with app.app_context():
        db.create_all()

    return app
