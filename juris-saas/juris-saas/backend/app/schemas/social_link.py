from pydantic import BaseModel


class SocialLinkCreate(BaseModel):
    platform: str
    url: str


class SocialLinkResponse(BaseModel):
    id: int
    platform: str
    url: str

    class Config:
        from_attributes = True
