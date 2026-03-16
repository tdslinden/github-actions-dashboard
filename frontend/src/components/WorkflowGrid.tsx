import type { WorkflowSummary } from '@/types/workflow';
import { WorkflowCard } from '@/components/WorkflowCard';

interface WorkflowGridProps {
  workflows: WorkflowSummary[];
}

export function WorkflowGrid({ workflows }: WorkflowGridProps) {
  if (workflows.length === 0) {
    return <div className="flex items-center justify-center min-h-[400px] text-white text-xl">No workflows found.</div>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8">
      {workflows.map((workflow) => (
        <WorkflowCard key={`${workflow.last_run_id}`} workflow={workflow} />
      ))}
    </div>
  );
}
