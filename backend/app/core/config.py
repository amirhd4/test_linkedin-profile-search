from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Linkdin Profile Search Engine"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB Config
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "lp_db"
    
    # Elasticsearch Config
    ELASTICSEARCH_URL: str = "http://localhost:9200"
    ELASTICSEARCH_INDEX: str = "linkedin_profiles"
    
    # Dataset Config
    DATASET_PATH: str = "data/linkedin_300_profiles.csv"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
