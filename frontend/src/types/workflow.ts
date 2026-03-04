export type WorkflowStatus =
  | 'succeeded'
  | 'failed'
  | 'running'
  | 'queued'
  | 'cancelled'
  | 'skipped'
  | 'waiting';

export interface WorkflowSummary {
  workflow_name: string;
  workflow_path: string;
  repo_name: string;
  branch: string;
  status: WorkflowStatus;
  last_run_id: number;
  last_run_url: string;
  last_run_time: string;
  triggered_by: string;
  run_number: number;
  run_attempt: number;
}
