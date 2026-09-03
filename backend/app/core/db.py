import logging

from pymongo import AsyncMongoClient
from elasticsearch import AsyncElasticsearch

from app.core.config import settings

logger = logging.getLogger(__name__)


class Database:
    mongo_client: AsyncMongoClient | None = None
    es_client: AsyncElasticsearch | None = None


db = Database()


async def get_mongo_db():
    return db.mongo_client[settings.MONGODB_DB_NAME]


async def get_es():
    return db.es_client


async def connect_db():
    logger.info("Connecting to MongoDB and Elasticsearch...")

    db.mongo_client = AsyncMongoClient(
        settings.MONGODB_URL,
        serverSelectionTimeoutMS=30000,
    )

    await db.mongo_client.admin.command("ping")
    logger.info("MongoDB connected.")

    db.es_client = AsyncElasticsearch(settings.ELASTICSEARCH_URL)

    if not await db.es_client.ping():
        raise RuntimeError("Elasticsearch connection failed")

    logger.info("Elasticsearch connected.")


async def close_db():
    logger.info("Closing database connections...")

    if db.mongo_client:
        await db.mongo_client.close()

    if db.es_client:
        await db.es_client.close()