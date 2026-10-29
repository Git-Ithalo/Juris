from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.practice_area import PracticeArea
from app.authentication.dependencies import get_current_user
from app.schemas.practice_area import PracticeAreaCreate, PracticeAreaUpdate, PracticeAreaResponse
from app.services.company_service import get_company_of_user

router = APIRouter(prefix="/practice-areas", tags=["practice-areas"])


def _get_owned_area(db: Session, area_id: int, company_id: int) -> PracticeArea:
    area = db.get(PracticeArea, area_id)
    if area is None or area.company_id != company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Área de atuação não encontrada")
    return area


@router.get("", response_model=list[PracticeAreaResponse])
def list_areas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    return db.query(PracticeArea).filter(PracticeArea.company_id == company.id).all()


@router.post("", response_model=PracticeAreaResponse, status_code=201)
def create_area(
    data: PracticeAreaCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    company = get_company_of_user(db, current_user)
    area = PracticeArea(company_id=company.id, **data.model_dump())
    db.add(area)
    db.commit()
    db.refresh(area)
    return area


@router.put("/{area_id}", response_model=PracticeAreaResponse)
def update_area(
    area_id: int,
    data: PracticeAreaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company = get_company_of_user(db, current_user)
    area = _get_owned_area(db, area_id, company.id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(area, field, value)
    db.commit()
    db.refresh(area)
    return area


@router.delete("/{area_id}", status_code=204)
def delete_area(area_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    area = _get_owned_area(db, area_id, company.id)
    db.delete(area)
    db.commit()
