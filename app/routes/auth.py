from flask import Blueprint, flash, redirect, render_template, request, session, url_for

from app.extensions import db
from app.models import LoginAttempt, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.get("/signup")
def signup_form():
    return render_template("auth/signup.html.j2", page="signup")


@auth_bp.post("/signup")
def signup():
    username = (request.form.get("username") or "").strip()
    email = (request.form.get("email") or "").strip().lower()
    password = request.form.get("password") or ""
    repassword = request.form.get("repassword") or ""

    if not username or not email or not password or not repassword:
        flash("Missing required fields.")
        return redirect(url_for("auth.signup_form"))

    if password != repassword:
        flash("Passwords do not match.")
        return redirect(url_for("auth.signup_form"))

    if User.query.filter((User.email == email) | (User.username == username)).first():
        flash("An account with that username or email already exists.")
        return redirect(url_for("auth.signup_form"))

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    session["user_id"] = user.id
    return redirect(url_for("main.home"))


@auth_bp.get("/login")
def login_form():
    return render_template("auth/login.html.j2", page="login")


@auth_bp.post("/login")
def login():
    identifier = (request.form.get("login") or "").strip()
    password = request.form.get("password") or ""
    user = User.query.filter_by(email=identifier.lower()).first() if "@" in identifier else User.query.filter_by(username=identifier).first()

    success = bool(user and user.check_password(password))
    reason = None if success else ("user_not_found" if not user else "invalid_password")
    db.session.add(LoginAttempt(identifier=identifier, success=success, reason=reason, ip=request.remote_addr, user_agent=request.headers.get("User-Agent")))
    db.session.commit()

    if not success:
        flash("Invalid username/email or password.")
        return redirect(url_for("auth.login_form"))

    session["user_id"] = user.id
    return redirect(url_for("main.home"))


@auth_bp.post("/logout")
def logout():
    session.clear()
    return redirect(url_for("main.home"))
