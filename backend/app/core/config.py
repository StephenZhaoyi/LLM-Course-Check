import os


class Settings:
    PROJECT_NAME: str = "LLM-Assisted Application Evaluation"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")


settings = Settings()
