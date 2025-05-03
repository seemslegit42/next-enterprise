'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/interfaces/Task'
import { useToast } from '@/once-ui/components'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tasks')
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tasks')
      }
      
      setTasks(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch tasks',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Create a new task
  const createTask = async (taskData: CreateTaskInput) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create task')
      }
      
      // Refresh the task list
      await fetchTasks()
      
      toast({
        title: 'Success',
        description: 'Task created successfully',
        variant: 'success',
      })
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create task',
        variant: 'error',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Update an existing task
  const updateTask = async (id: string, taskData: UpdateTaskInput) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update task')
      }
      
      // Refresh the task list
      await fetchTasks()
      
      toast({
        title: 'Success',
        description: 'Task updated successfully',
        variant: 'success',
      })
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update task',
        variant: 'error',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a task
  const deleteTask = async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete task')
      }
      
      // Refresh the task list
      await fetchTasks()
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        variant: 'success',
      })
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete task',
        variant: 'error',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch a single task by ID
  const fetchTaskById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/tasks/${id}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch task')
      }
      
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch task',
        variant: 'error',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTaskById,
  }
}
