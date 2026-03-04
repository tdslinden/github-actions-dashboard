import type { WorkflowSummary } from '../types/workflow';

const API_BASE_URL = 'http://localhost:8000';

export async function fetchWorkflows(): Promise<WorkflowSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflows`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    console.error('[API] Failed to fetch workflows', err);
    throw err;
  }
}
