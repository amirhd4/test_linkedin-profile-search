import csv
import json
import ast
import logging
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

def safe_parse_json_or_ast(val: Any) -> Any:
    if not val or val == "[]" or val == "None" or val == "{}":
        return []
    if isinstance(val, (list, dict)):
        return val
    val_str = str(val).strip()
    try:
        return json.loads(val_str)
    except Exception:
        try:
            return ast.literal_eval(val_str)
        except Exception:
            return [x.strip() for x in val_str.split(",") if x.strip()]

def parse_csv_dataset(filepath: str) -> List[Dict[str, Any]]:
    profiles = []
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for idx, row in enumerate(reader):
            row = {k: v for k, v in row.items() if k is not None}

            doc_id = row.get("linkedin_id")

            if isinstance(doc_id, list):
                doc_id = str(idx + 1)
            else:
                doc_id = str(doc_id).strip() if doc_id else str(idx + 1)
            
            raw_skills = safe_parse_json_or_ast(row.get("skills"))
            skills = [str(s).strip() for s in raw_skills if s] if isinstance(raw_skills, list) else []
            
            raw_emails = safe_parse_json_or_ast(row.get("emails"))
            emails = []
            if isinstance(raw_emails, list):
                emails = [str(e).strip() for e in raw_emails if e]
            elif isinstance(raw_emails, str) and raw_emails:
                emails = [raw_emails.strip()]
            
            raw_exp = safe_parse_json_or_ast(row.get("experience"))
            experiences = []
            if isinstance(raw_exp, list):
                for item in raw_exp:
                    if isinstance(item, dict):
                        company_info = item.get("company", {}) or {}
                        title_info = item.get("title", {}) or {}
                        experiences.append({
                            "company_name": company_info.get("name") if isinstance(company_info, dict) else str(company_info),
                            "title": title_info.get("name") if isinstance(title_info, dict) else str(title_info),
                            "start_date": item.get("start_date"),
                            "end_date": item.get("end_date"),
                            "summary": item.get("summary")
                        })
            
            raw_edu = safe_parse_json_or_ast(row.get("education"))
            educations = []
            if isinstance(raw_edu, list):
                for item in raw_edu:
                    if isinstance(item, dict):
                        school_info = item.get("school", {}) or {}
                        educations.append({
                            "school_name": school_info.get("name") if isinstance(school_info, dict) else str(school_info),
                            "degrees": item.get("degrees") or [],
                            "majors": item.get("majors") or [],
                            "start_date": item.get("start_date"),
                            "end_date": item.get("end_date")
                        })

            raw_id = row.get("linkedin_id")

            if not isinstance(raw_id, str) or not raw_id.strip():
                logger.warning("Skipping row %s: invalid linkedin_id=%r", idx, raw_id)
                continue

            doc_id = raw_id.strip()

            # linkedin_id باید یک ID کوتاه باشد، نه skills/location/...
            if len(doc_id.encode("utf-8")) > 100 or doc_id.startswith("["):
                logger.warning(
                    "Skipping malformed row %s: linkedin_id=%r full_name=%r",
                    idx,
                    doc_id,
                    row.get("full_name"),
                )
                continue

            profile = {
                "_id": doc_id,
                "full_name": row.get("full_name") or "Unknown",
                "first_name": row.get("first_name"),
                "last_name": row.get("last_name"),
                "gender": row.get("gender"),
                "linkedin_url": row.get("linkedin_url"),
                "industry": row.get("industry") or row.get("job_company_industry"),
                "job_title": row.get("job_title"),
                "job_company_name": row.get("job_company_name"),
                "job_company_industry": row.get("job_company_industry"),
                "location_name": row.get("location_name") or row.get("job_company_location_name"),
                "location_country": row.get("location_country") or row.get("job_company_location_country"),
                "summary": row.get("summary") or row.get("job_summary"),
                "skills": skills,
                "emails": emails,
                "experiences": experiences,
                "educations": educations,
                "raw_data": row
            }
            profiles.append(profile)
    
    return profiles

ES_INDEX_MAPPING = {
    "settings": {
        "index.max_ngram_diff": 8,
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "analyzer": {
                "ngram_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "ngram_filter"]
                }
            },
            "filter": {
                "ngram_filter": {
                    "type": "ngram",
                    "min_gram": 2,
                    "max_gram": 10
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "id": {"type": "keyword"},
            "full_name": {
                "type": "text",
                "fields": {
                    "ngram": {"type": "text", "analyzer": "ngram_analyzer"},
                    "keyword": {"type": "keyword"}
                }
            },
            "job_title": {
                "type": "text",
                "fields": {
                    "keyword": {"type": "keyword"}
                }
            },
            "job_company_name": {
                "type": "text",
                "fields": {
                    "keyword": {"type": "keyword"}
                }
            },
            "industry": {
                "type": "text",
                "fields": {
                    "keyword": {"type": "keyword"}
                }
            },
            "location_name": {
                "type": "text",
                "fields": {
                    "keyword": {"type": "keyword"}
                }
            },
            "skills": {
                "type": "text",
                "fields": {
                    "keyword": {"type": "keyword"}
                }
            },
            "summary": {"type": "text"},
            "experiences": {
                "type": "nested",
                "properties": {
                    "company_name": {"type": "text"},
                    "title": {"type": "text"},
                    "summary": {"type": "text"}
                }
            }
        }
    }
}

async def seed_data(mongo_db, es_client, dataset_path: str = None):
    path = dataset_path or settings.DATASET_PATH
    profiles = parse_csv_dataset(path)
    logger.info(f"Parsed {len(profiles)} profiles from {path}")
    
    collection = mongo_db["profiles"]
    await collection.delete_many({})

    if profiles:
        unique_profiles = {}
        for profile in profiles:
            unique_profiles[profile["_id"]] = profile

        profiles = list(unique_profiles.values())
        await collection.insert_many(profiles)
    logger.info("MongoDB seeded successfully.")
    
    index_name = settings.ELASTICSEARCH_INDEX
    if await es_client.indices.exists(index=index_name):
        await es_client.indices.delete(index=index_name)
    
    await es_client.indices.create(index=index_name, body=ES_INDEX_MAPPING)

    bulk_body = []

    for p in profiles:
        es_id = p["_id"]

        if not isinstance(es_id, str) or len(es_id.encode("utf-8")) > 512:
            logger.error(
                "BAD ES _id: type=%s value=%r full_name=%r",
                type(es_id),
                es_id,
                p.get("full_name"),
            )
            raise ValueError(f"Invalid Elasticsearch _id: {es_id!r}")

        doc = {
            "id": es_id,
            "full_name": p["full_name"],
            "job_title": p["job_title"],
            "job_company_name": p["job_company_name"],
            "industry": p["industry"],
            "location_name": p["location_name"],
            "skills": p["skills"],
            "summary": p["summary"],
            "experiences": p["experiences"]
        }

        bulk_body.append({
            "index": {
                "_index": index_name,
                "_id": es_id
            }
        })
        bulk_body.append(doc)

    if bulk_body:
        await es_client.bulk(operations=bulk_body, refresh=True)
    logger.info("Elasticsearch seeded successfully.")
    return len(profiles)
