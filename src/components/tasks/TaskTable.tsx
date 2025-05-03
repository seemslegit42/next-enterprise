'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, Flex, Text, IconButton, Badge } from '@/once-ui/components'
import { Task } from '@/interfaces/Task'
import { motion } from 'framer-motion'

interface TaskTableProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => Promise<void>
  isLoading: boolean
}

export function TaskTable({ tasks, onEdit, onDelete, isLoading }: TaskTableProps) {
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task
    direction: 'ascending' | 'descending'
  } | null>(null)

  // Handle sorting
  const handleSort = (key: keyof Task) => {
    let direction: 'ascending' | 'descending' = 'ascending'

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }

    setSortConfig({ key, direction })
  }

  // Get sorted tasks
  const getSortedTasks = () => {
    if (!sortConfig) return tasks

    return [...tasks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'running':
        return 'info'
      case 'failed':
        return 'error'
      default:
        return 'warning'
    }
  }

  // View task details
  const handleViewTask = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }

  // Prepare table data
  const tableData = {
    headers: [
      { content: 'Title', key: 'title', sortable: true },
      { content: 'Status', key: 'status', sortable: true },
      { content: 'Created', key: 'createdAt', sortable: true },
      { content: 'Updated', key: 'updatedAt', sortable: true },
      { content: 'Actions', key: 'actions' },
    ],
    rows: getSortedTasks().map((task) => [
      <Text key={`title-${task.id}`} weight="medium">{task.title}</Text>,
      <Badge 
        key={`status-${task.id}`} 
        variant={getStatusColor(task.status)}
        size="s"
      >
        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
      </Badge>,
      <Text key={`created-${task.id}`} size="sm">{formatDate(task.createdAt)}</Text>,
      <Text key={`updated-${task.id}`} size="sm">{formatDate(task.updatedAt)}</Text>,
      <Flex key={`actions-${task.id}`} gap="2">
        <IconButton
          icon="eye"
          variant="tertiary"
          size="s"
          tooltip="View"
          onClick={() => handleViewTask(task.id)}
        />
        <IconButton
          icon="edit"
          variant="tertiary"
          size="s"
          tooltip="Edit"
          onClick={() => onEdit(task)}
        />
        <IconButton
          icon="trash"
          variant="tertiary"
          size="s"
          tooltip="Delete"
          onClick={() => onDelete(task.id)}
        />
      </Flex>,
    ]),
  }

  if (isLoading) {
    return (
      <Flex center padding="32">
        <Text>Loading tasks...</Text>
      </Flex>
    )
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Flex
          direction="column"
          center
          padding="32"
          gap="16"
          border="neutral-alpha-medium"
          borderRadius="lg"
          background="surface-weak"
        >
          <Text size="lg" weight="medium" color="foreground-subtle">
            No tasks found
          </Text>
          <Text size="sm" color="foreground-subtle">
            Create a new task to get started
          </Text>
        </Flex>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table data={tableData} />
    </motion.div>
  )
}
