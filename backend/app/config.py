from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    github_token: str
    github_org: str
    repos: str  # Comma-separated

    class Config:
        env_file = ".env"


settings = Settings()


def get_repos_list() -> list[str]:
    """Parse REPOS env var into list"""
    return [r.strip() for r in settings.repos.split(",")]
