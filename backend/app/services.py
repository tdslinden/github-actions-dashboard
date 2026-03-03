from typing import List
from app.github_client import GitHubClient
from app.models import WorkflowRun, WorkflowSummary
from app.config import get_repos_list, settings
from datetime import datetime, timezone, timedelta
import logging

logger = logging.getLogger(__name__)


class WorkflowService:
    def __init__(self):
        self.github_client = GitHubClient()

    async def get_all_workflows(self) -> List[WorkflowSummary]:
        """Fetch and process workflows for all configured repos"""
        repos_list = get_repos_list()
        all_summaries: List[WorkflowSummary] = []

        for repo in repos_list:
            logger.info(f"Fetching workflows for repo: {repo}")
            try:
                runs = await self.github_client.fetch_repo_runs(repo)
                summaries = self._process_runs_to_summary(runs, repo)
                all_summaries.extend(summaries)
            except Exception as e:
                logger.error(f"Error processing repo {repo}: {e}")
                continue  # skip to next repo on error

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

        workflow_summaries: List[WorkflowSummary] = []
        workflow_groups = {}

        for run in runs:
            # Create composite key: "path::branch"
            key = f"{run.workflow_path}::{run.branch}"
            workflow_groups.setdefault(key, []).append(run)

        if not workflow_groups:
            logger.warning(f"No workflow runs found for repo {repo_name}")
            return []

        now = datetime.now(timezone.utc)
        retention_cutoff = now - timedelta(hours=settings.retention_days * 24)

        for group_key, runs in workflow_groups.items():
            sorted_runs = sorted(runs, key=lambda r: r.created_at, reverse=True)
            most_recent_run = sorted_runs[0]

            is_recent = most_recent_run.created_at >= retention_cutoff

            if is_recent:
                summary = self._create_summary(most_recent_run, repo_name)
                workflow_summaries.append(summary)

        return workflow_summaries

    def _create_summary(self, run: WorkflowRun, repo_name: str) -> WorkflowSummary:
        """Helper to create WorkflowSummary from WorkflowRun"""
        return WorkflowSummary(
            workflow_name=run.name,
            workflow_path=run.workflow_path,
            repo_name=repo_name,
            branch=run.branch,
            status=self._map_status(run.status, run.conclusion),
            last_run_id=run.id,
            last_run_url=str(run.html_url),
            last_run_time=run.created_at,
            triggered_by=run.triggering_actor.username,
            run_number=run.run_number,
            run_attempt=run.run_attempt,
        )

    def _map_status(self, status: str, conclusion: str) -> str:
        """Map GitHub status/conclusion to simplified status"""
        if status == "completed":
            match conclusion:
                case "success" | "neutral":
                    return "succeeded"
                case "failure" | "timed_out" | "action_required":
                    return "failed"
                case "cancelled" | "stale":
                    return "cancelled"
                case "skipped":
                    return "skipped"
                case _:
                    return "unknown"  # default to unknown for unknown conclusions
        else:
            match status:
                case "queued" | "waiting":
                    return status
                case "in_progress":
                    return "running"
                case _:
                    return "unknown"  # default to unknown for unknown conclusions
