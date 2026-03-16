import { useWorkflowData } from '@/hooks/useWorkflowData';
import { WorkflowGrid } from '@/components/WorkflowGrid';
import { SummaryBar } from '@/components/SummaryBar';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import type { WorkflowStatus } from './types/workflow';
import { useState } from 'react';

function App() {
  const { workflows, loading, error, lastUpdated } = useWorkflowData();
  const [activeFilter, setActiveFilter] = useState<'all' | WorkflowStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading)
    return (
      <div className="p-8">
        <h1 className="text-2xl text-white font-bold mb-4">GitHub Actions Dashboard</h1>
        <div className="flex items-center gap-6 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2 text-white">GitHub Actions Dashboard</h1>
      <p className="text-gray-600 mb-4">
        Showing {workflows.length} workflows
        {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
      </p>
      <div className="mb-4">
        <SummaryBar
          workflows={workflows}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      <div className="mb-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div>
        <WorkflowGrid workflows={workflows} />
      </div>
    </div>
  );
}

export default App;
