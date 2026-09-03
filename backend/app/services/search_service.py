import logging
from typing import List, Optional
from elasticsearch import AsyncElasticsearch
from app.core.config import settings
from app.models.profile import SearchResponse, ProfileSearchResult, FacetsResponse, FacetCount

logger = logging.getLogger(__name__)

async def search_profiles(
    es_client: AsyncElasticsearch,
    q: Optional[str] = None,
    job_titles: Optional[List[str]] = None,
    skills: Optional[List[str]] = None,
    industries: Optional[List[str]] = None,
    locations: Optional[List[str]] = None,
    page: int = 1,
    size: int = 10
) -> SearchResponse:
    must_clauses = []
    filter_clauses = []

    if q and q.strip():
        query_str = q.strip()
        must_clauses.append({
            "multi_match": {
                "query": query_str,
                "fields": [
                    "full_name^4",
                    "full_name.ngram^2",
                    "job_title^3",
                    "skills^3",
                    "job_company_name^2",
                    "industry^2",
                    "summary",
                    "experiences.title^2",
                    "experiences.company_name"
                ],
                "fuzziness": "AUTO",
                "prefix_length": 2
            }
        })
    else:
        must_clauses.append({"match_all": {}})

    if job_titles:
        filter_clauses.append({"terms": {"job_title.keyword": job_titles}})
    if skills:
        filter_clauses.append({"terms": {"skills.keyword": skills}})
    if industries:
        filter_clauses.append({"terms": {"industry.keyword": industries}})
    if locations:
        filter_clauses.append({"terms": {"location_name.keyword": locations}})

    bool_query = {
        "must": must_clauses,
        "filter": filter_clauses
    }

    aggs = {
        "job_titles": {"terms": {"field": "job_title.keyword", "size": 20}},
        "skills": {"terms": {"field": "skills.keyword", "size": 30}},
        "industries": {"terms": {"field": "industry.keyword", "size": 20}},
        "locations": {"terms": {"field": "location_name.keyword", "size": 20}}
    }

    highlight = {
        "pre_tags": ["<mark>"],
        "post_tags": ["</mark>"],
        "fields": {
            "full_name": {},
            "job_title": {},
            "skills": {},
            "job_company_name": {},
            "summary": {"fragment_size": 150, "number_of_fragments": 1}
        }
    }

    from_val = (page - 1) * size

    body = {
        "query": {"bool": bool_query},
        "aggs": aggs,
        "highlight": highlight,
        "from": from_val,
        "size": size
    }

    resp = await es_client.search(index=settings.ELASTICSEARCH_INDEX, body=body)

    total_hits = resp["hits"]["total"]["value"] if isinstance(resp["hits"]["total"], dict) else resp["hits"]["total"]
    results = []

    for hit in resp["hits"]["hits"]:
        source = hit["_source"]
        highlights = hit.get("highlight", {})
        
        results.append(ProfileSearchResult(
            id=source.get("id"),
            full_name=source.get("full_name"),
            job_title=source.get("job_title"),
            job_company_name=source.get("job_company_name"),
            industry=source.get("industry"),
            location_name=source.get("location_name"),
            skills=source.get("skills", []),
            summary=source.get("summary"),
            score=hit.get("_score"),
            highlights=highlights
        ))

    aggs_resp = resp.get("aggregations", {})
    facets = FacetsResponse(
        job_titles=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("job_titles", {}).get("buckets", []) if b["key"]],
        skills=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("skills", {}).get("buckets", []) if b["key"]],
        industries=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("industries", {}).get("buckets", []) if b["key"]],
        locations=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("locations", {}).get("buckets", []) if b["key"]]
    )

    pages = (total_hits + size - 1) // size if total_hits > 0 else 1

    return SearchResponse(
        total=total_hits,
        page=page,
        size=size,
        pages=pages,
        results=results,
        facets=facets
    )

async def get_facets(es_client: AsyncElasticsearch) -> FacetsResponse:
    aggs = {
        "job_titles": {"terms": {"field": "job_title.keyword", "size": 30}},
        "skills": {"terms": {"field": "skills.keyword", "size": 50}},
        "industries": {"terms": {"field": "industry.keyword", "size": 30}},
        "locations": {"terms": {"field": "location_name.keyword", "size": 30}}
    }
    body = {"query": {"match_all": {}}, "aggs": aggs, "size": 0}
    resp = await es_client.search(index=settings.ELASTICSEARCH_INDEX, body=body)
    aggs_resp = resp.get("aggregations", {})
    return FacetsResponse(
        job_titles=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("job_titles", {}).get("buckets", []) if b["key"]],
        skills=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("skills", {}).get("buckets", []) if b["key"]],
        industries=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("industries", {}).get("buckets", []) if b["key"]],
        locations=[FacetCount(key=b["key"], count=b["doc_count"]) for b in aggs_resp.get("locations", {}).get("buckets", []) if b["key"]]
    )
