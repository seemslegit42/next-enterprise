import { useState, useEffect, useCallback } from 'react';
import { AgentDefinition } from '@/interfaces';

/**
 * Hook for fetching and managing agent definitions
 */
export function useAgents() {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all agents from the API
   */
  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/agents');
      const result = await response.json();
      
      if (result.success) {
        setAgents(result.data);
      } else {
        setError(result.error || 'Failed to fetch agents');
      }
    } catch (err) {
      setError('An error occurred while fetching agents');
      console.error('Error fetching agents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch a single agent by ID
   */
  const fetchAgentById = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/agents/${id}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch agent');
        return null;
      }
    } catch (err) {
      setError('An error occurred while fetching the agent');
      console.error('Error fetching agent:', err);
      return null;
    }
  }, []);

  // Fetch agents on initial load
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    isLoading,
    error,
    fetchAgents,
    fetchAgentById
  };
}

export default useAgents;
