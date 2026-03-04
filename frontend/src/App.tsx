import { useWorkflowData } from './hooks/useWorkflowData';

function App() {
  const { workflows, loading, error, lastUpdated } = useWorkflowData();

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GitHub Actions Dashboard</h1>
      <p className="text-gray-600 mb-4">
        Showing {workflows.length} workflows
        {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
      </p>

      <div className="space-y-2">
        {workflows.slice(0, 5).map((wf) => (
          <div key={wf.last_run_id} className="p-4 border rounded">
            <div className="font-medium">{wf.workflow_name}</div>
            <div className="text-sm text-gray-600">
              {wf.repo_name} • {wf.branch} • {wf.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
