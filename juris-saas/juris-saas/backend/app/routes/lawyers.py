from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.lawyer import Lawyer
from app.authentication.dependencies import get_current_user
from app.schemas.lawyer import LawyerCreate, LawyerUpdate, LawyerResponse
from app.services.company_service import get_company_of_user

router = APIRouter(prefix="/lawyers", tags=["lawyers"])


def _get_owned_lawyer(db: Session, lawyer_id: int, company_id: int) -> Lawyer:
    """Busca o advogado garantindo que pertence à empresa do usuário logado."""
    lawyer = db.get(Lawyer, lawyer_id)
    if lawyer is None or lawyer.company_id != company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Advogado não encontrado")
    return lawyer


@router.get("", response_model=list[LawyerResponse])
def list_lawyers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company_of_user(db, current_user)
    return db.query(Lawyer).filter(Lawyer.company_id == company.id).all()


@router.post("", response_model=LawyerResponse, status_code=201)
def create_lawyer(
    data: LawyerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    company = get_company_of_user(db, current_user)
    lawyer = Lawyer(company_id=company.id, **data.model_dump())
    db.add(lawyer)
    db.commit()
    db.refresh(lawyer)
    return lawyer


@router.put("/{lawyer_id}", response_model=LawyerResponse)
def update_lawyer(
    lawyer_id: int,
    data: LawyerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company = get_company_of_user(db, current_user)
    lawyer = _get_owned_lawyer(db, lawyer_id, company.id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(lawyer, field, value)
    db.commit()
    db.refresh(lawyer)
    return lawyer


@router.delete("/{lawyer_id}", status_code=204)
def delete_lawyer(
    lawyer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    company = get_company_of_user(db, current_user)
    lawyer = _get_owned_lawyer(db, lawyer_id, company.id)
    db.delete(lawyer)
    db.commit()
