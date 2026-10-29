from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.social_link import SocialLink
from app.authentication.dependencies import get_current_user
from app.schemas.social_link import SocialLinkCreate, SocialLinkResponse
from app.services.company_service import get_company_of_user

router = APIRouter(prefix="/social-links", tags=["social-links"])


@router.get("", response_model=list[SocialLinkResponse])
def list_links(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    return db.query(SocialLink).filter(SocialLink.company_id == company.id).all()


@router.post("", response_model=SocialLinkResponse, status_code=201)
def create_link(
    data: SocialLinkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    company = get_company_of_user(db, current_user)
    link = SocialLink(company_id=company.id, **data.model_dump())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.delete("/{link_id}", status_code=204)
def delete_link(link_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    link = db.get(SocialLink, link_id)
    if link is None or link.company_id != company.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link não encontrado")
    db.delete(link)
    db.commit()
