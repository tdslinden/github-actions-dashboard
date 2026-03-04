import { useState, useEffect } from 'react';
import type { WorkflowSummary } from '../types/workflow';
import { fetchWorkflows } from '../api/workflows';

const CACHE_KEY = 'workflow_cache';
const POLL_INTERVAL = 30000;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  workflows: WorkflowSummary[];
  timestamp: number;
}

export function useWorkflowData() {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadFromCache = (): WorkflowSummary[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { workflows, timestamp }: CacheData = JSON.parse(cached);

        const age = Date.now() - timestamp;
        if (age < CACHE_TTL) {
          return workflows;
        }
      }
    } catch (err) {
      console.error('[Cache] Failed to retrieve cached workflow data', err);
    }
    return null;
  };

  const saveToCache = (data: WorkflowSummary[]) => {
    if (!data || data.length === 0) return;

    const cacheData: CacheData = {
      workflows: data,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        console.warn('[Cache]Storage full, unable to cache workflow data');
      }
      console.error('[Cache] Failed to save workflow data to cache', err);
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchWorkflows();
      setWorkflows(data);
      setLastUpdated(new Date());
      setError(null);
      saveToCache(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = loadFromCache();
    if (cached) {
      setWorkflows(cached);
      setLoading(false);
    }

    fetchData();

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchData();
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { workflows, loading, error, lastUpdated };
}
