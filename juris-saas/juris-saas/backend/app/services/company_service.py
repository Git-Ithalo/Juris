from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.user import User


def get_company_of_user(db: Session, user: User) -> Company:
    """
    Todo endpoint autenticado usa isso para achar a empresa do usuário logado.
    Isso garante, por construção, que um usuário nunca acesse dados de outra
    empresa: nunca recebemos company_id vindo do cliente, sempre derivamos
    do token JWT.
    """
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if company is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empresa não encontrada")
    return company
