from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import CORS_ORIGINS
from .core.database import Base, engine
from .api import catalog, enquiries

@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(engine)
    yield

app = FastAPI(title='TeddyPups API', version='1.0.0', lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=['GET', 'POST', 'OPTIONS'],
    allow_headers=['*'],
)
app.include_router(catalog.router,prefix='/api/v1')
app.include_router(enquiries.router,prefix='/api/v1')
@app.get('/api/v1/health')
def health(): return {'status':'ok'}
