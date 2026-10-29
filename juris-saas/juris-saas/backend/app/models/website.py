from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Website(Base):
    __tablename__ = "websites"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), unique=True, nullable=False)

    # Identificação / publicação
    # slug é usado hoje em /site/{slug}; no futuro pode virar subdomínio
    # (slug.plataforma.com) sem mudar o modelo de dados.
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    template: Mapped[str] = mapped_column(String(50), default="advocacia-classico")
    published: Mapped[bool] = mapped_column(Boolean, default=False)

    # Aparência
    primary_color: Mapped[str] = mapped_column(String(7), default="#0B3D2E")
    secondary_color: Mapped[str] = mapped_column(String(7), default="#C9A24B")
    font: Mapped[str] = mapped_column(String(50), default="Inter")
    button_style: Mapped[str] = mapped_column(String(20), default="solid")  # solid | outline | rounded

    # Conteúdo editável
    slogan: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hero_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hero_subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    about_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    differentials: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string: lista de diferenciais
    business_hours: Mapped[str | None] = mapped_column(String(255), nullable=True)
    whatsapp_message: Mapped[str] = mapped_column(String(255), default="Olá! Gostaria de mais informações.")

    # Seções ativas/inativas
    show_hero: Mapped[bool] = mapped_column(Boolean, default=True)
    show_about: Mapped[bool] = mapped_column(Boolean, default=True)
    show_practice_areas: Mapped[bool] = mapped_column(Boolean, default=True)
    show_team: Mapped[bool] = mapped_column(Boolean, default=True)
    show_differentials: Mapped[bool] = mapped_column(Boolean, default=True)
    show_testimonials: Mapped[bool] = mapped_column(Boolean, default=False)
    show_contact: Mapped[bool] = mapped_column(Boolean, default=True)

    # SEO
    seo_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    company: Mapped["Company"] = relationship(back_populates="website")
