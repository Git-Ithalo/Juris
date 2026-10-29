"""
Ponto de entrada da API.

Nesta Etapa 1, apenas montamos a estrutura: app FastAPI, CORS e um
endpoint de health-check para confirmarmos que tudo está rodando.
As rotas de negócio (auth, empresas, advogados, etc.) serão adicionadas
nas próximas etapas, cada uma em seu próprio arquivo dentro de app/routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app import models  # noqa: F401 - garante que os models sejam registrados

# Cria as tabelas que ainda não existem. Em produção, o ideal é usar
# migrations (Alembic) em vez de create_all, mas para o MVP isso é suficiente.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Juris SaaS API",
    description="API do construtor de sites para escritórios de advocacia",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.routes import (
    auth as auth_routes,
    companies as companies_routes,
    lawyers as lawyers_routes,
    practice_areas as practice_areas_routes,
    social_links as social_links_routes,
    website as website_routes,
)

app.include_router(auth_routes.router)
app.include_router(companies_routes.router)
app.include_router(lawyers_routes.router)
app.include_router(practice_areas_routes.router)
app.include_router(social_links_routes.router)
app.include_router(website_routes.router)


@app.get("/health", tags=["health"])
def health_check():
    """Usado para confirmar que a API está de pé (útil em deploy/monitoramento)."""
    return {"status": "ok", "environment": settings.environment}
