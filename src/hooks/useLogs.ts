'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProcessLog, ProcessLogFilters } from '@/interfaces/ProcessLog'
import { useToast } from '@/once-ui/components'

export function useLogs() {
  const [logs, setLogs] = useState<ProcessLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  // Fetch logs with optional filters
  const fetchLogs = useCallback(async (filters?: ProcessLogFilters) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (filters?.processName) {
        params.append('processName', filters.processName)
      }
      if (filters?.level) {
        params.append('level', filters.level)
      }
      if (filters?.startDate) {
        params.append('startDate', filters.startDate.toISOString())
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate.toISOString())
      }

      const queryString = params.toString()
      const url = `/api/logs${queryString ? `?${queryString}` : ''}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch logs')
      }
      
      setLogs(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch logs',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Fetch a single log by ID
  const fetchLogById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/logs/${id}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch log')
      }
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch log',
        variant: 'error',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a log
  const deleteLog = async (id: string) => {
    try {
      const response = await fetch(`/api/logs/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete log')
      }
      
      // Update local state
      setLogs(logs.filter(log => log.id !== id))
      
      toast({
        title: 'Success',
        description: 'Log deleted successfully',
        variant: 'success',
      })
      
      return true
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete log',
        variant: 'error',
      })
      return false
    }
  }

  // Load logs on component mount
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return {
    logs,
    isLoading,
    error,
    fetchLogs,
    fetchLogById,
    deleteLog,
  }
}
