"""
Configurações centrais da aplicação.

Todas as variáveis sensíveis (chaves secretas, credenciais de banco, etc.)
devem vir do arquivo .env e NUNCA devem ser escritas diretamente no código.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"

    # Banco de dados
    database_url: str = "sqlite:///./database/app.db"

    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # CORS
    cors_origins: str = "http://localhost:5173"

    # Usado para montar URLs de sites publicados (ex: preparação p/ subdomínios)
    platform_base_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


# Instância única, importada pelo resto da aplicação
settings = Settings()
