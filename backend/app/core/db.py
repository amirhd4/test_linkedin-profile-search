import logging
import asyncio

from pymongo import AsyncMongoClient
from elasticsearch import AsyncElasticsearch

from app.core.config import settings

logger = logging.getLogger(__name__)


class Database:
    mongo_client: AsyncMongoClient | None = None
    es_client: AsyncElasticsearch | None = None


db = Database()


async def get_mongo_db():
    if db.mongo_client is None:
        raise RuntimeError("Database connection is not initialized.")
    return db.mongo_client[settings.MONGODB_DB_NAME]


async def get_es():
    return db.es_client


async def connect_db(max_retries: int = 10, retry_delay: float = 3.0):
    logger.info("Connecting to MongoDB and Elasticsearch...")

    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Connecting to MongoDB (Attempt {attempt}/{max_retries})...")

            db.mongo_client = AsyncMongoClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                directConnection=True
            )

            await db.mongo_client.admin.command("ping")
            logger.info("MongoDB connected successfully.")
            break

        except Exception as e:
            if attempt == max_retries:
                logger.error("Failed to connect to MongoDB after maximum attempts.")
                raise RuntimeError("MongoDB connection failed") from e

            logger.warning(f"MongoDB not ready yet ({e}). Retrying in {retry_delay}s...")
            await asyncio.sleep(retry_delay)

    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Connecting to Elasticsearch (Attempt {attempt}/{max_retries})...")

            db.es_client = AsyncElasticsearch(
                settings.ELASTICSEARCH_URL,
                request_timeout=10
            )

            if await db.es_client.ping():
                logger.info("Elasticsearch connected successfully.")
                break
            else:
                raise ConnectionError("Elasticsearch ping returned False.")

        except Exception as e:
            if attempt == max_retries:
                logger.error("Failed to connect to Elasticsearch after maximum attempts.")
                raise RuntimeError("Elasticsearch connection failed") from e

            logger.warning(f"Elasticsearch not ready yet ({e}). Retrying in {retry_delay}s...")
            await asyncio.sleep(retry_delay)


async def close_db():
    logger.info("Closing database connections...")

    if db.mongo_client:
        await db.mongo_client.close()

    if db.es_client:
        await db.es_client.close()