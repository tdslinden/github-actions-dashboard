import type { WorkflowStatus, WorkflowSummary } from '@/types/workflow';
import { Button } from './ui/button';
import { getStatusConfig } from '@/config/statusStyles';

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
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        All: {workflows.length}
      </Button>
      
      {statuses.map((status) => {
        const count = counts[status];
        if (count === 0) return null;

        const config = getStatusConfig(status);
        const Icon = config.icon;

        return (
          <Button
            variant={activeFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(status)}
            className={`${config.textColor} ${config.bgColor} ${config.borderColor}`}
          >
            <Icon className={config.iconColor} />
            {status}: {count}
          </Button>
        );
      })}
    </div>
  );
}
