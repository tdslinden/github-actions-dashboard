import httpx
from typing import List
from app.models import WorkflowRun
from app.config import settings


class GitHubClient:
    def __init__(self):
        self.token = settings.github_token
        self.org = settings.github_org
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.token}",
            "X-GitHub-Api-Version": "2022-11-28",
        }

def _transform_run_data(run_data: dict) -> dict:
    """Transform GitHub API run data to match WorkflowRun model."""
    return {
        "id": run_data["id"],
        "name": run_data["name"],
        "event": run_data["event"],
        "created_at": run_data["created_at"],
        "run_started_at": run_data.get("run_started_at"),
        "branch": run_data["head_branch"],
        "commit_sha": run_data["head_sha"],
        "display_title": run_data["display_title"],
        "status": run_data["status"],
        "html_url": run_data["html_url"],
        "conclusion": run_data.get("conclusion"),
        "run_number": run_data["run_number"],
        "run_attempt": run_data["run_attempt"],
        "triggering_actor": {
            "username": run_data["triggering_actor"]["login"],
            "avatar_url": run_data["triggering_actor"]["avatar_url"],
        },
        "workflow_path": run_data["path"],
    }

    async def fetch_repo_runs(
        self, repo_name: str, per_page: int = 50
    ) -> List[WorkflowRun]:
        """
        Fetch latest workflow runs for a repository.

        Returns empty list if repo not found or on error.
        Logs errors but doesn't raise (fail gracefully).
        """

        url = f"{self.base_url}/repos/{self.org}/{repo_name}/actions/runs"
        params = {"per_page": per_page}

        status_code = None
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=self.headers, params=params)
                status_code = response.status_code
                match status_code:
                    case 200:
                        data = response.json()
                        workflow_runs_data = data.get("workflow_runs", [])
                        return [
                                WorkflowRun(**self._transform_run_data(run_data))
                                for run_data in workflow_runs_data
                            ]
                    case 403:
                        print(f"Auth error for {repo_name}")
                        return []
                    case 404:
                        print(f"Repo not found: {repo_name}")
                        return []
                    case 429:
                        print(f"Rate limit exceeded for {repo_name}")
                        return []
                    case _:
                        print(f"Unexpected status code {status_code} for {repo_name}")
                        return []
            except httpx.HTTPError as e:
                print(f"HTTP Exception for {e.request.url} when accessing {repo_name}: {e}")
                return []

    async def check_rate_limit(self) -> Optional[dict]:
        """Check current rate limit status"""
        url = f"{self.base_url}/rate_limit"
        status_code = None
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=self.headers)
                status_code = response.status_code
                match status_code:
                    case 200 | 304:
                        data = response.json()
                        resources_data = data.get("resources", {})
                        if "core" in resources_data:
                            core_data = resources_data.get("core", {})
                            remaining = core_data.get("remaining")
                            reset = core_data.get("reset")
                            return {"remaining": remaining, "reset": reset}
                        else:
                            print(f"Core rate limit data not found in response: {data}")
                            return None
                    case 404:
                        print(f"Rate limit endpoint not found for {url}")
                        return None
                    case _:
                        print(f"Unexpected status code {status_code} for {url}")
                        return None
            except httpx.HTTPError as e:
                print(f"HTTP Exception for {e.request.url}: {e}")
                return None
