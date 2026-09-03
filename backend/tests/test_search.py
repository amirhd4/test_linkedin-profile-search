import pytest
from unittest.mock import AsyncMock
from app.models.profile import SearchResponse
from app.services.search_service import search_profiles

@pytest.mark.asyncio
async def test_search_profiles_structure():
    mock_es = AsyncMock()
    mock_es.search.return_value = {
        "hits": {
            "total": {"value": 1},
            "hits": [
                {
                    "_id": "1",
                    "_score": 1.5,
                    "_source": {
                        "id": "1",
                        "full_name": "John Doe",
                        "job_title": "Software Engineer",
                        "job_company_name": "Tech Corp",
                        "industry": "Software",
                        "location_name": "San Francisco",
                        "skills": ["Python", "FastAPI"],
                        "summary": "Senior developer"
                    },
                    "highlight": {
                        "full_name": ["<mark>John</mark> Doe"]
                    }
                }
            ]
        },
        "aggregations": {
            "job_titles": {"buckets": [{"key": "Software Engineer", "doc_count": 1}]},
            "skills": {"buckets": [{"key": "Python", "doc_count": 1}]},
            "industries": {"buckets": [{"key": "Software", "doc_count": 1}]},
            "locations": {"buckets": [{"key": "San Francisco", "doc_count": 1}]}
        }
    }

    res = await search_profiles(mock_es, q="John", page=1, size=10)
    assert isinstance(res, SearchResponse)
    assert res.total == 1
    assert len(res.results) == 1
    assert res.results[0].full_name == "John Doe"
    assert res.facets.job_titles[0].key == "Software Engineer"
