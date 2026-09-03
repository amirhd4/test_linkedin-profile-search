from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.db import connect_db, close_db, get_mongo_db, get_es
from app.api.endpoints import router as profiles_router
from app.services.indexer import seed_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    try:
        mongo_db = await get_mongo_db()
        es_client = await get_es()
        count = await mongo_db["profiles"].count_documents({})
        if count == 0:
            await seed_data(mongo_db, es_client)
    except Exception:
        import logging
        logging.exception("Startup check/seed failed")
        raise
    yield
    await close_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profiles_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health():
    return {"status": "ok"}
