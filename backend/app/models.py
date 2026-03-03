from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Literal, Optional


class TriggeringActor(BaseModel):
    username: str
    avatar_url: HttpUrl


class WorkflowRun(BaseModel):
    """Model matching GitHub API response"""

    id: int
    name: str
    event: str
    created_at: datetime
    run_started_at: Optional[datetime]
    branch: str
    commit_sha: str
    display_title: str
    status: str
    html_url: HttpUrl
    conclusion: Optional[str]
    run_number: int
    run_attempt: int
    triggering_actor: TriggeringActor
    workflow_path: str


class WorkflowSummary(BaseModel):
    """Simplified model for frontend consumption"""

    workflow_name: str
    workflow_path: str
    repo_name: str
    status: Literal[
        "running", "waiting", "queued", "succeeded", "failed", "cancelled", "skipped"
    ]
    last_run_id: int
    last_run_url: str
    last_run_time: datetime
    triggered_by: str
    run_number: int
    run_attempt: int
    branch: str
