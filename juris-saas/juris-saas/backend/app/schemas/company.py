from pydantic import BaseModel, EmailStr


class CompanyUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    logo: str | None = None


class CompanyResponse(BaseModel):
    id: int
    name: str
    description: str | None
    phone: str | None
    whatsapp: str | None
    email: str | None
    address: str | None
    logo: str | None

    class Config:
        from_attributes = True
