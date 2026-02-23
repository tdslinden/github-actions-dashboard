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
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
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

        # TODO: Implement this
        # 1. Use httpx.AsyncClient() to make GET request
        # 2. Check response status:
        #    - 200: Parse workflow_runs from response
        #    - 404: Log "repo not found", return []
        #    - 403: Log "auth error", return []
        #    - 429: Log rate limit info, return []
        # 3. Parse response JSON and convert to List[WorkflowRun]
        # 4. Handle httpx.HTTPError (network issues)
        async with httpx.AsyncClient() as client:
            try:
                print(f"[DEBUG] Calling GitHub API: {url}")
                r = await client.get(url, headers=self.headers, params=params)
                print(f"[DEBUG] Response status: {r.status_code}")
                if r.status_code == 200:
                    data = r.json()
                    workflow_runs = data.get("workflow_runs", [])
                    print(
                        f"[DEBUG] Parsed {len(workflow_runs)} workflow runs from response"
                    )
                    return [WorkflowRun(**run) for run in workflow_runs]
                if r.status_code == 404:
                    print(f"Repo {repo_name} not found.")
                    return []
                elif r.status_code == 403:
                    print(
                        f"Authentication error when accessing {repo_name}. Check token permissions."
                    )
                    return []
                elif r.status_code == 429:
                    print(f"Rate limit exceeded when accessing {repo_name}.")
                    return []
                else:
                    print(
                        f"Error fetching runs for {repo_name}: {r.status_code} - {r.text}"
                    )
                    return []
            except httpx.HTTPError as e:
                print(f"Network error when accessing {repo_name}: {e}")
                return []

    async def check_rate_limit(self) -> dict:
        """Check current rate limit status"""

        url = f"{self.base_url}/rate_limit"
        remaining = 0
        reset = 0

        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(url, headers=self.headers)
                status_code = r.status_code

                if status_code == 200:
                    data = r.json()
                    core = data.get("core", {})
                    remaining = core.get("remaining", 0)
                    reset = core.get("reset", 0)
                    return {"remaining": remaining, "reset": reset}

                else:
                    print(f"Error checking rate limit: {status_code} - {r.text}")
                    return {"remaining": remaining, "reset": reset}

            except httpx.HTTPError as e:
                print(f"Network error when checking rate limit: {e}")
                return {"remaining": 0, "reset": 0}
