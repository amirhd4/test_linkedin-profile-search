from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from pymongo import AsyncMongoClient

from elasticsearch import AsyncElasticsearch

from app.core.db import get_mongo_db, get_es
from app.models.profile import SearchResponse, Profile, FacetsResponse
from app.services.search_service import search_profiles, get_facets
from app.services.indexer import seed_data

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("/search", response_model=SearchResponse)
async def search(
    q: Optional[str] = Query(None, description="Search query string"),
    job_title: Optional[List[str]] = Query(None, description="Filter by job titles"),
    skill: Optional[List[str]] = Query(None, description="Filter by skills"),
    industry: Optional[List[str]] = Query(None, description="Filter by industries"),
    location: Optional[List[str]] = Query(None, description="Filter by locations"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    es_client: AsyncElasticsearch = Depends(get_es)
):
    return await search_profiles(
        es_client=es_client,
        q=q,
        job_titles=job_title,
        skills=skill,
        industries=industry,
        locations=location,
        page=page,
        size=size
    )

@router.get("/facets", response_model=FacetsResponse)
async def facets(es_client: AsyncElasticsearch = Depends(get_es)):
    return await get_facets(es_client)

@router.get("/{profile_id}", response_model=Profile)
async def get_profile_by_id(
    profile_id: str,
    mongo_db: AsyncMongoClient = Depends(get_mongo_db)
):
    doc = await mongo_db["profiles"].find_one({"_id": profile_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Profile not found")
    return doc

@router.post("/seed", status_code=200)
async def trigger_seed(
    mongo_db: AsyncMongoClient = Depends(get_mongo_db),
    es_client: AsyncElasticsearch = Depends(get_es)
):
    count = await seed_data(mongo_db, es_client)
    return {"message": f"Successfully seeded {count} profiles into MongoDB & Elasticsearch"}
