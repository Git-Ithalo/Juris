from pydantic import BaseModel


class PracticeAreaCreate(BaseModel):
    name: str
    description: str | None = None


class PracticeAreaUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class PracticeAreaResponse(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True
