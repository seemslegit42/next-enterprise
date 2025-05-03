'use client'

import { useState, useEffect, useCallback } from 'react'
import { WorkflowExecutionLog } from '@/interfaces/execution.interface'
import { useToast } from '@/once-ui/components'

interface WorkflowLogFilters {
  workflowId?: string;
  status?: 'Running' | 'Completed' | 'Failed';
  startDate?: string;
  endDate?: string;
}

export function useWorkflowLogs() {
  const [logs, setLogs] = useState<WorkflowExecutionLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch logs with optional filters
  const fetchLogs = useCallback(async (filters: WorkflowLogFilters = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query string
      const queryParams = new URLSearchParams()
      if (filters.workflowId) queryParams.append('workflowId', filters.workflowId)
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)

      const response = await fetch(`/api/workflows/logs?${queryParams.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch workflow logs')
      }

      const data = await response.json()
      setLogs(data.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Fetch a single log by ID
  const fetchLogById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/workflows/logs/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch workflow log')
      }

      const data = await response.json()
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Fetch logs on component mount
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return {
    logs,
    isLoading,
    error,
    fetchLogs,
    fetchLogById,
  }
}

export default useWorkflowLogs
