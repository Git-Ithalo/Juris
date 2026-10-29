"""
Importar todos os models aqui garante que o SQLAlchemy os registre
antes de Base.metadata.create_all() ser chamado em main.py.
"""

from app.models.user import User
from app.models.company import Company
from app.models.lawyer import Lawyer
from app.models.practice_area import PracticeArea
from app.models.social_link import SocialLink
from app.models.website import Website

__all__ = ["User", "Company", "Lawyer", "PracticeArea", "SocialLink", "Website"]
