from typing import Literal
from fastapi import APIRouter, HTTPException, Query
from ..services import catalog
router = APIRouter(tags=['Catalog'])

@router.get('/puppies')
def list_puppies(status: Literal['available','adopted'] | None = None, origin: Literal['local','imported'] | None = None, breed: str | None = Query(None,max_length=100)):
    return catalog.puppies(status, origin, breed)

@router.get('/puppies/{slug}')
def get_puppy(slug: str):
    result = catalog.puppy(slug)
    if result is None: raise HTTPException(404, 'Puppy not found')
    return result

@router.get('/families')
def list_families(): return catalog.load('families')
