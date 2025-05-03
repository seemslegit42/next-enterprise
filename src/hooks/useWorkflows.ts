"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/once-ui/components";
import { WorkflowDefinition, CreateWorkflowDto, UpdateWorkflowDto } from "@/interfaces/workflow.interface";

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all workflows
  const fetchWorkflows = useCallback(async (filters?: { name?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.name) {
        params.append('name', filters.name);
      }

      const queryString = params.toString();
      const url = `/api/workflows${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch workflows');
      }

      setWorkflows(result.data);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch workflows',
        variant: 'error',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new workflow
  const createWorkflow = useCallback(async (workflowData: CreateWorkflowDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create workflow');
      }

      // Update the local state with the new workflow
      setWorkflows(prev => [result.data, ...prev]);

      toast({
        title: 'Success',
        description: 'Workflow created successfully',
        variant: 'success',
      });

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create workflow',
        variant: 'error',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update an existing workflow
  const updateWorkflow = useCallback(async (id: string, workflowData: UpdateWorkflowDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update workflow');
      }

      // Update the local state with the updated workflow
      setWorkflows(prev => prev.map(workflow =>
        workflow.id === id ? result.data : workflow
      ));

      toast({
        title: 'Success',
        description: 'Workflow updated successfully',
        variant: 'success',
      });

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update workflow',
        variant: 'error',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Delete a workflow
  const deleteWorkflow = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete workflow');
      }

      // Remove the deleted workflow from the local state
      setWorkflows(prev => prev.filter(workflow => workflow.id !== id));

      toast({
        title: 'Success',
        description: 'Workflow deleted successfully',
        variant: 'success',
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete workflow',
        variant: 'error',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch a single workflow by ID
  const fetchWorkflowById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workflows/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch workflow');
      }

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch workflow',
        variant: 'error',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Execute a workflow
  const executeWorkflow = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workflows/execute/${id}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to execute workflow');
      }

      toast({
        title: 'Success',
        description: 'Workflow execution initiated',
        variant: 'success',
      });

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to execute workflow',
        variant: 'error',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Get execution status
  const getExecutionStatus = useCallback(async (executionId: string) => {
    try {
      const response = await fetch(`/api/workflows/execute/${executionId}`, {
        method: 'GET',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to get execution status');
      }

      return result.data;
    } catch (err) {
      console.error('Error getting execution status:', err);
      return null;
    }
  }, []);

  // Cancel execution
  const cancelExecution = useCallback(async (executionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workflows/execute/${executionId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel execution');
      }

      toast({
        title: 'Success',
        description: result.message || 'Execution canceled',
        variant: 'success',
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to cancel execution',
        variant: 'error',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    workflows,
    isLoading,
    error,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    fetchWorkflowById,
    executeWorkflow,
    getExecutionStatus,
    cancelExecution,
  };
}
