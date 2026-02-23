from typing import List, Optional
from app.github_client import GitHubClient
from app.models import WorkflowRun, WorkflowSummary
from app.config import get_repos_list
import logging

logger = logging.getLogger(__name__)


class WorkflowService:
    def __init__(self):
        self.github_client = GitHubClient()

    async def get_all_workflows(self) -> List[WorkflowSummary]:
        """Fetch and process workflows for all configured repos"""
        repos = get_repos_list()
        print(f"[DEBUG] Configured repos: {repos}")
        all_summaries = []

        for repo in repos:
            try:
                print(f"[DEBUG] Fetching runs for repo: {repo}")
                runs = await self.github_client.fetch_repo_runs(repo)
                print(f"[DEBUG] Got {len(runs)} runs for {repo}")
                summaries = self._process_runs_to_summary(runs, repo)
                print(f"[DEBUG] Generated {len(summaries)} summaries for {repo}")
                all_summaries.extend(summaries)
            except Exception as e:
                print(f"[DEBUG] ERROR processing repo {repo}: {e}")
                logger.error(f"Failed to process repo {repo}: {e}")
                continue

        print(f"[DEBUG] Returning {len(all_summaries)} total summaries")
        return all_summaries

    def _process_runs_to_summary(
        self, runs: List[WorkflowRun], repo_name: str
    ) -> List[WorkflowSummary]:
        """
        Convert list of workflow runs into latest-per-workflow summaries.

        Logic:
        1. Group runs by workflow path (unique identifier)
        2. For each workflow, get the most recent run
        3. Map status/conclusion to simplified status
        4. Convert to WorkflowSummary
        """
        # TODO: Implement this
        # Hint: Use a dict to group by workflow path
        # {
        #   ".github/workflows/ci.yml": [run1, run2, run3],
        #   ".github/workflows/deploy.yml": [run4, run5]
        # }
        # Then for each group, take the first run (most recent)
        workflow_map = {}
        for run in runs:
            if run.path not in workflow_map:
                workflow_map[run.path] = []
            workflow_map[run.path].append(run)

        summaries = []
        for workflow_path, runs in workflow_map.items():
            latest_run = runs[0]  # runs are returned in descending order by created_at
            status = self._map_status(latest_run.status, latest_run.conclusion)
            summary = WorkflowSummary(
                workflow_name=latest_run.name,
                workflow_path=workflow_path,
                repo_name=repo_name,
                status=status,
                last_run_id=latest_run.id,
                last_run_url=latest_run.html_url,
                last_run_time=latest_run.created_at,
                triggered_by=latest_run.triggering_actor.login,
            )
            summaries.append(summary)

        return summaries

    def _map_status(self, status: str, conclusion: Optional[str]) -> str:
        """Map GitHub status/conclusion to simplified status"""
        if status == "in_progress" or status == "queued" or status == "pending":
            return "in_progress"
        if conclusion == "success":
            return "success"
        if conclusion == "failure":
            return "failure"
        if conclusion == "cancelled":
            return "cancelled"
        return "failure"  # default for unknown states
