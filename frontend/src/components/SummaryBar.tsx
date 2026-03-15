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
  'cancelled',
  'running',
  'waiting',
  'queued',
  'skipped',
];

export function SummaryBar({ workflows, activeFilter, onFilterChange }: SummaryBarProps) {
  const counts = workflows.reduce(
    (acc, workflow) => {
      acc[workflow.status] = (acc[workflow.status] || 0) + 1;
      return acc;
    },
    {} as Record<WorkflowStatus, number>
  );

  return (
    <div className="flex items-center gap-4 flex-wrap justify-start w-full py-2">
      {/* Config for "all" button */}
      {(() => {
        const allConfig = {
          label: 'All',
          icon: Circle,
          bgActive: 'bg-teal-600',
          bgInactive: 'bg-teal-500/30',
          textInactive: 'text-teal-100',
        };
        const isActive = activeFilter === 'all';
        return (
          <Button
            variant={isActive ? 'default' : 'outline'}
            size="lg"
            onClick={() => onFilterChange('all')}
            className={`flex flex-col items-start justify-center w-[170px] h-[90px] px-6 py-4 border-none shadow-none transition-all duration-200 rounded-xl ${isActive ? `${allConfig.bgActive} text-white scale-105 z-10` : `${allConfig.bgInactive} ${allConfig.textInactive}`}`}
          >
            <div className="flex flex-row items-center gap-3 h-full w-full">
              <Circle className={isActive ? 'text-white' : 'text-teal-200'} size={40} />
              <div className="flex flex-col items-start justify-center">
                <span className="text-lg font-bold capitalize">{allConfig.label}</span>
                <span className="text-base font-semibold tracking-wide">{workflows.length}</span>
              </div>
            </div>
          </Button>
        );
      })()}

      {/* Config for individual status buttons */}
      {statuses.map((status) => {
        const count = counts[status] ?? 0;
        const config = getStatusConfig(status);
        const Icon = config.icon;
        const isActive = activeFilter === status;
        return (
          <Button
            variant={isActive ? 'default' : 'outline'}
            size="lg"
            onClick={() => onFilterChange(status)}
            className={`flex flex-col items-start justify-center w-[170px] h-[90px] px-6 py-4 border-none shadow-none transition-all duration-200 rounded-xl ${isActive ? `${config.bgActive} text-white scale-105 z-10` : `${config.bgInactive} ${config.textInactive}`} ${count === 0 ? 'opacity-50 pointer-events-none' : ''}`}
            key={status}
          >
            <div className="flex flex-row items-center gap-3 h-full w-full">
              <Icon className={isActive ? 'text-white' : config.iconColor} size={40} />
              <div className="flex flex-col items-start justify-center">
                <span className="text-lg font-bold capitalize">{config.label}</span>
                <span className="text-base font-semibold tracking-wide">{count}</span>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
