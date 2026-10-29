from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.website import Website
from app.models.lawyer import Lawyer
from app.models.practice_area import PracticeArea
from app.models.social_link import SocialLink
from app.authentication.dependencies import get_current_user
from app.schemas.website import WebsiteUpdate, WebsiteResponse, PublicWebsiteResponse
from app.schemas.company import CompanyResponse
from app.schemas.lawyer import LawyerResponse
from app.schemas.practice_area import PracticeAreaResponse
from app.schemas.social_link import SocialLinkResponse
from app.services.company_service import get_company_of_user

router = APIRouter(tags=["website"])


@router.get("/website", response_model=WebsiteResponse)
def get_my_website(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    return company.website


@router.put("/website", response_model=WebsiteResponse)
def update_my_website(
    data: WebsiteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    company = get_company_of_user(db, current_user)
    website = company.website
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(website, field, value)
    db.commit()
    db.refresh(website)
    return website


@router.post("/website/publish", response_model=WebsiteResponse)
def publish_website(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    website = company.website
    website.published = True
    db.commit()
    db.refresh(website)
    return website


@router.post("/website/unpublish", response_model=WebsiteResponse)
def unpublish_website(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    website = company.website
    website.published = False
    db.commit()
    db.refresh(website)
    return website


@router.get("/public/website/{slug}", response_model=PublicWebsiteResponse)
def get_public_website(slug: str, db: Session = Depends(get_db)):
    """
    Endpoint sem autenticação: é o que o site público do escritório
    (frontend, rota /site/{slug}) consulta para renderizar a página.
    Só retorna sites publicados — um site em rascunho não fica visível
    publicamente antes do cliente clicar em "Publicar".
    """
    website = db.query(Website).filter(Website.slug == slug).first()
    if website is None or not website.published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site não encontrado")

    company = website.company
    lawyers = db.query(Lawyer).filter(Lawyer.company_id == company.id).all()
    areas = db.query(PracticeArea).filter(PracticeArea.company_id == company.id).all()
    links = db.query(SocialLink).filter(SocialLink.company_id == company.id).all()

    return PublicWebsiteResponse(
        website=WebsiteResponse.model_validate(website),
        company=CompanyResponse.model_validate(company).model_dump(),
        lawyers=[LawyerResponse.model_validate(l).model_dump() for l in lawyers],
        practice_areas=[PracticeAreaResponse.model_validate(a).model_dump() for a in areas],
        social_links=[SocialLinkResponse.model_validate(s).model_dump() for s in links],
    )
