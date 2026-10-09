from app import app, db
from models import Feature


FEATURES = [
    {
        "title": "Ultra Fast",
        "description": "Experience blazing speeds for streaming, gaming, and work.",
    },
    {
        "title": "Secure",
        "description": "Smart connectivity with advanced encryption and safety.",
    },
    {
        "title": "Global Access",
        "description": "Stay connected anywhere, anytime with seamless coverage.",
    },
]


def seed_features():
    with app.app_context():
        for feature_data in FEATURES:
            if not Feature.query.filter_by(title=feature_data["title"]).first():
                db.session.add(Feature(**feature_data))
        db.session.commit()
        print(f"Seeded {len(FEATURES)} features.")


if __name__ == "__main__":
    seed_features()
