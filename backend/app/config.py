from pydantic_settings import BaseSettings
import os

# Configuration CORS selon l'environnement
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

if ENVIRONMENT == "production":
    ALLOWED_ORIGINS = [
        "https://urbanscore.vercel.app"
    ]
else:
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000"
    ]


class Settings(BaseSettings):
    """Configuration de l'application"""
    
    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017"
    database_name: str = "urban_score"
    
    # Application
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
