import json
from functools import lru_cache
from ..core.config import DATA_DIR

@lru_cache(maxsize=2)
def load(name: str):
    return json.loads((DATA_DIR / f'{name}.json').read_text(encoding='utf-8'))

def puppies(status=None, origin=None, breed=None):
    return [p for p in load('puppies') if (not status or p['status'] == status) and (not origin or p['origin'] == origin) and (not breed or breed.casefold() in p['breed'].casefold())]

def puppy(slug):
    return next((p for p in load('puppies') if p['slug'] == slug), None)
