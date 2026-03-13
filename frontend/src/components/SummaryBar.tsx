import type { WorkflowStatus, WorkflowSummary } from '@/types/workflow';
import { Button } from './ui/button';
import { getStatusConfig } from '@/config/statusStyles';
import { Circle } from 'lucide-react';

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
        className="flex flex-col items-center justify-center min-w-[110px] min-h-[80px] px-7 py-4 bg-gray-100 border border-gray-400 text-gray-800"
      >
        <div className="flex flex-col items-center justify-center h-full w-full">
          <Circle className="text-gray-500 mb-1" />
          <span className="text-sm font-semibold leading-tight capitalize text-center">
            All
          </span>
          <span className="text-[13px] text-muted-foreground mt-1 font-medium tracking-wide text-center">
            {workflows.length}
          </span>
        </div>
      </Button>

      {statuses.map((status) => {
        const count = counts[status] ?? 0;
        // Always render the button for alignment, but visually dim if count is 0
        const config = getStatusConfig(status);
        const Icon = config.icon;
        return (
          <Button
            variant={activeFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(status)}
            className={`${config.textColor} ${config.bgColor} ${config.borderColor} flex flex-col items-center justify-center min-w-[110px] min-h-[80px] px-7 py-4 ${count === 0 ? 'opacity-50 pointer-events-none' : ''}`}
            key={status}
          >
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Icon className={config.iconColor + ' mb-1'} />
              <span className="text-sm font-semibold leading-tight capitalize text-center">
                {status}
              </span>
              <span className="text-[13px] text-muted-foreground mt-1 font-medium tracking-wide text-center">
                {count}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
