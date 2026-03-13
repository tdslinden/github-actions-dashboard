import { useWorkflowData } from './hooks/useWorkflowData';
import { WorkflowCard } from '@/components/WorkflowCard';

function App() {
  const { workflows, loading, error, lastUpdated } = useWorkflowData();

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GitHub Actions Dashboard</h1>
      <div className="flex items-center gap-6 mb-4">
        {workflows.slice(0, 5).map((wf) => (
          <WorkflowCard key={wf.last_run_id} {...wf} />
        ))}
      </div>
    </div>
  );
}

export default App;
