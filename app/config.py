from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    SECRET_KEY = "dev"
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{BASE_DIR / 'whatstoday.db'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
