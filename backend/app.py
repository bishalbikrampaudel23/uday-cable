import os
import secrets
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from models import Contact, Feature, User, db


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = os.getenv("DATABASE_PATH", str(BASE_DIR / "xnext.db"))

app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI=f"sqlite:///{DATABASE_PATH}",
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SECRET_KEY=os.getenv("SECRET_KEY", "development-only-change-me"),
    MAX_CONTENT_LENGTH=16 * 1024,
)

db.init_app(app)


def get_json_body():
    if request.is_json:
        payload = request.get_json(silent=True)
        return payload if isinstance(payload, dict) else {}
    return request.form.to_dict(flat=True)


def get_csrf_token():
    token = session.get("csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["csrf_token"] = token
    return token


def require_csrf():
    token = request.headers.get("X-CSRF-Token")
    expected = session.get("csrf_token")
    if not expected or not token or not secrets.compare_digest(expected, token):
        return jsonify({"error": "Invalid or missing CSRF token."}), 400
    return None


def validate_email(email):
    return bool(email and "@" in email and "." in email.rsplit("@", 1)[-1])


def serialize_feature(feature):
    return {
        "id": feature.id,
        "title": feature.title,
        "description": feature.description,
    }


@app.get("/csrf-token")
def csrf_token():
    return jsonify({"csrf_token": get_csrf_token()})


@app.post("/signup")
def signup():
    csrf_error = require_csrf()
    if csrf_error:
        return csrf_error

    payload = get_json_body()
    username = str(payload.get("username", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))

    if len(username) < 3 or len(username) > 80:
        return jsonify({"error": "Username must be between 3 and 80 characters."}), 400
    if not validate_email(email) or len(email) > 120:
        return jsonify({"error": "Enter a valid email address."}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"error": "Username or email already exists."}), 409

    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to create the account."}), 500

    session.pop("user_id", None)
    session["user_id"] = user.id
    return jsonify(
        {
            "message": "Account created successfully.",
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }
    ), 201


@app.post("/login")
def login():
    csrf_error = require_csrf()
    if csrf_error:
        return csrf_error

    payload = get_json_body()
    identifier = str(payload.get("identifier", "")).strip().lower()
    password = str(payload.get("password", ""))

    if not identifier or not password:
        return jsonify({"error": "Username/email and password are required."}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username/email or password."}), 401

    session.pop("user_id", None)
    session["user_id"] = user.id
    return jsonify(
        {
            "message": "Login successful.",
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }
    )


@app.post("/contact")
def contact():
    csrf_error = require_csrf()
    if csrf_error:
        return csrf_error

    payload = get_json_body()
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    message = str(payload.get("message", "")).strip()

    if len(name) < 2 or len(name) > 100:
        return jsonify({"error": "Enter a valid name."}), 400
    if not validate_email(email) or len(email) > 120:
        return jsonify({"error": "Enter a valid email address."}), 400
    if len(message) < 10 or len(message) > 5000:
        return jsonify({"error": "Message must be between 10 and 5,000 characters."}), 400

    contact_record = Contact(name=name, email=email, message=message)
    db.session.add(contact_record)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to save the contact message."}), 500

    return jsonify({"message": "Contact message submitted successfully."}), 201


@app.get("/features")
def features():
    records = Feature.query.order_by(Feature.id).all()
    return jsonify({"features": [serialize_feature(record) for record in records]})


@app.get("/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()})


@app.errorhandler(413)
def request_too_large(_):
    return jsonify({"error": "Request is too large."}), 413


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=os.getenv("FLASK_DEBUG", "0") == "1")
