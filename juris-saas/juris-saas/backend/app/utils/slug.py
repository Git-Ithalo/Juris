import re
import unicodedata

from sqlalchemy.orm import Session

from app.models.website import Website


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "escritorio"


def generate_unique_slug(db: Session, base_text: str) -> str:
    """Garante que o slug não colida com um site já existente (ex: cliente1, cliente1-2)."""
    base = slugify(base_text)
    slug = base
    counter = 2
    while db.query(Website).filter(Website.slug == slug).first() is not None:
        slug = f"{base}-{counter}"
        counter += 1
    return slug
