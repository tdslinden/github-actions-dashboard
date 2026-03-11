import type { WorkflowStatus, WorkflowSummary } from '@/types/workflow';
import { Button } from './button';

interface SummaryBarProps {
  workflows: WorkflowSummary[];
  activeFilter: WorkflowStatus | 'all';
  onFilterChange: (status: WorkflowStatus | 'all') => void;
}

const statuses: WorkflowStatus[] = [
  'succeeded',
  'failed',
  'running',
  'waiting',
  'queued',
  'skipped',
  'cancelled',
];

export function SummaryBar({ workflows, activeFilter, onFilterChange }: SummaryBarProps) {
  const counts = workflows.reduce(
    (acc, workflow) => {
      acc[workflow.status] = (acc[workflow.status] || 0) + 1;
      return acc;
    },
    {} as Record<WorkflowStatus, number>
  );

  console.log(counts);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      Summary:
      <Button variant="outline" size="sm">
        All: {workflows.length}
      </Button>
      {statuses.map((status) => {
        const count = counts[status] || 0;
        if (count == 0) return null;

        return (
          <Button variant="outline" size="sm">
            {status}: {count}
          </Button>
        );
      })}
    </div>
  );
}
