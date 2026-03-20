import { useWorkflowData } from '@/hooks/useWorkflowData';
import { WorkflowGrid } from '@/components/WorkflowGrid';
import { SummaryBar } from '@/components/SummaryBar';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import type { WorkflowStatus } from './types/workflow';
import { useMemo, useState } from 'react';
import { Header } from './components/Header';

function App() {
  const { workflows, loading, error, lastUpdated } = useWorkflowData();
  const [activeFilter, setActiveFilter] = useState<'all' | WorkflowStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const matchesStatus = activeFilter === 'all' || wf.status === activeFilter;
      const matchesSearch =
        searchQuery === '' || wf.workflow_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [workflows, activeFilter, searchQuery]);

  if (loading)
    return (
      <div className="p-8">
        <Header lastUpdated={lastUpdated} />
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
      <Header lastUpdated={lastUpdated} />
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
        <WorkflowGrid workflows={filteredWorkflows} />
      </div>
    </div>
  );
}

export default App;
