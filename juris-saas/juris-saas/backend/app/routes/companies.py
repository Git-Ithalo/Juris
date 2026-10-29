from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.authentication.dependencies import get_current_user
from app.schemas.company import CompanyUpdate, CompanyResponse
from app.services.company_service import get_company_of_user

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/me", response_model=CompanyResponse)
def get_my_company(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_company_of_user(db, current_user)


@router.put("/me", response_model=CompanyResponse)
def update_my_company(
    data: CompanyUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    company = get_company_of_user(db, current_user)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company
