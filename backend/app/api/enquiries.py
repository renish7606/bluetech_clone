from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from sqlalchemy.orm import Session
from ..core.database import Enquiry, get_db
from ..services.catalog import puppy
router = APIRouter(tags=['Enquiries'])

class EnquiryIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra='forbid')
    name: str = Field(min_length=2,max_length=120)
    phone: str = Field(min_length=7,max_length=40,pattern=r'^\+?[0-9 ()-]+$')
    email: EmailStr | None = None
    area: str = Field(default='',max_length=160)
    puppy_slug: str | None = Field(default=None,max_length=150)
    message: str = Field(default='',max_length=3000)
    website: str = Field(default='',max_length=200)

@router.post('/enquiries',status_code=201)
def create_enquiry(payload: EnquiryIn, db: Session = Depends(get_db)):
    if payload.website: raise HTTPException(400,'Invalid submission')
    if payload.puppy_slug and not puppy(payload.puppy_slug): raise HTTPException(422,'Unknown puppy')
    row = Enquiry(**payload.model_dump(exclude={'website'}))
    db.add(row); db.commit(); db.refresh(row)
    return {'id':row.id,'status':'received'}
