from pydantic import BaseModel


class LawyerCreate(BaseModel):
    name: str
    oab: str | None = None
    specialization: str | None = None
    photo: str | None = None
    bio: str | None = None


class LawyerUpdate(BaseModel):
    name: str | None = None
    oab: str | None = None
    specialization: str | None = None
    photo: str | None = None
    bio: str | None = None


class LawyerResponse(BaseModel):
    id: int
    name: str
    oab: str | None
    specialization: str | None
    photo: str | None
    bio: str | None

    class Config:
        from_attributes = True
