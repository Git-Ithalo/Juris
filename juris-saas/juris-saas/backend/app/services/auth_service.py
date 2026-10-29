from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.company import Company
from app.models.website import Website
from app.authentication.hashing import hash_password, verify_password
from app.authentication.jwt import create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.slug import generate_unique_slug


def register_user(db: Session, data: RegisterRequest) -> str:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Este e-mail já está cadastrado")

    user = User(name=data.name, email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    db.flush()  # garante user.id antes de criar os registros dependentes

    company = Company(user_id=user.id, name=data.company_name)
    db.add(company)
    db.flush()

    website = Website(
        company_id=company.id,
        slug=generate_unique_slug(db, data.company_name),
        hero_title="Advocacia estratégica para proteger seus direitos.",
        slogan="Excelência jurídica ao seu lado.",
    )
    db.add(website)

    db.commit()
    db.refresh(user)

    return create_access_token(subject=str(user.id))


def authenticate_user(db: Session, data: LoginRequest) -> str:
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha inválidos"
    )

    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise invalid_credentials

    return create_access_token(subject=str(user.id))
