"""
Configuração da conexão com o banco de dados via SQLAlchemy.

Hoje usamos SQLite (bom para desenvolvimento, zero configuração).
Para migrar para PostgreSQL ou MySQL no futuro, basta trocar a
variável DATABASE_URL no .env — nenhum código aqui precisa mudar.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# connect_args só é necessário para SQLite (não existe em Postgres/MySQL).
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency do FastAPI: abre uma sessão por requisição e sempre fecha ao final."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
