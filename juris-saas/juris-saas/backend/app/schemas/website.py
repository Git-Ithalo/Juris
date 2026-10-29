from pydantic import BaseModel


class WebsiteUpdate(BaseModel):
    template: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    font: str | None = None
    button_style: str | None = None
    slogan: str | None = None
    hero_title: str | None = None
    hero_subtitle: str | None = None
    about_text: str | None = None
    differentials: str | None = None
    business_hours: str | None = None
    whatsapp_message: str | None = None
    show_hero: bool | None = None
    show_about: bool | None = None
    show_practice_areas: bool | None = None
    show_team: bool | None = None
    show_differentials: bool | None = None
    show_testimonials: bool | None = None
    show_contact: bool | None = None
    seo_title: str | None = None
    seo_description: str | None = None


class WebsiteResponse(BaseModel):
    id: int
    slug: str
    template: str
    published: bool
    primary_color: str
    secondary_color: str
    font: str
    button_style: str
    slogan: str | None
    hero_title: str | None
    hero_subtitle: str | None
    about_text: str | None
    differentials: str | None
    business_hours: str | None
    whatsapp_message: str
    show_hero: bool
    show_about: bool
    show_practice_areas: bool
    show_team: bool
    show_differentials: bool
    show_testimonials: bool
    show_contact: bool
    seo_title: str | None
    seo_description: str | None

    class Config:
        from_attributes = True


class PublicWebsiteResponse(BaseModel):
    """Dados públicos combinados: site + empresa + advogados + áreas + redes sociais."""

    website: WebsiteResponse
    company: dict
    lawyers: list[dict]
    practice_areas: list[dict]
    social_links: list[dict]
