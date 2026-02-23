from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional
from pydantic.networks import HttpUrl


class TriggeringActor(BaseModel):
    login: str
    avatar_url: HttpUrl


class WorkflowRun(BaseModel):
    """Model matching GitHub API response"""

    id: int
    name: str
    path: str
    created_at: datetime
    run_number: int
    html_url: HttpUrl
    run_started_at: Optional[datetime]
    triggering_actor: TriggeringActor
    head_branch: str
    head_sha: str
    display_title: str
    status: str
    conclusion: Optional[str]
    run_attempt: int
    event: str


class WorkflowSummary(BaseModel):
    """Simplified model for frontend"""

    workflow_name: str
    workflow_path: str
    repo_name: str
    status: Literal["success", "failure", "in_progress", "cancelled"]
    last_run_id: int
    last_run_url: HttpUrl
    last_run_time: datetime
    triggered_by: str
