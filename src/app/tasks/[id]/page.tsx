'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Flex, Heading, Text, Button, Icon, Card, Badge } from '@/once-ui/components'
import { TaskModal, DeleteConfirmationDialog } from '@/components/tasks'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/interfaces/Task'
import { motion } from 'framer-motion'

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { fetchTaskById, updateTask, deleteTask } = useTasks()

  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Check if user is authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/signin?callbackUrl=/tasks')
  }

  // Fetch task data
  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true)
      try {
        const taskData = await fetchTaskById(params.id)
        setTask(taskData)
      } catch (error) {
        console.error('Error fetching task:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTask()
  }, [fetchTaskById, params.id])

  // Handle updating a task
  const handleUpdateTask = async (taskData: any) => {
    if (task) {
      const updatedTask = await updateTask(task.id, taskData)
      if (updatedTask) {
        setTask(updatedTask)
      }
    }
  }

  // Handle deleting a task
  const handleDeleteTask = async () => {
    if (task) {
      const success = await deleteTask(task.id)
      if (success) {
        router.push('/tasks')
      }
    }
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

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <Flex center padding="64">
        <Text>Loading task details...</Text>
      </Flex>
    )
  }

  if (!task) {
    return (
      <Flex direction="column" gap="16" center padding="64">
        <Text size="lg" weight="medium">Task not found</Text>
        <Button
          variant="primary"
          onClick={() => router.push('/tasks')}
          leftIcon={<Icon name="arrow-left" />}
        >
          Back to Tasks
        </Button>
      </Flex>
    )
  }

  return (
    <Flex direction="column" gap="24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Flex direction="column" gap="4">
            <Flex gap="8" alignItems="center">
              <Button
                variant="tertiary"
                size="s"
                onClick={() => router.push('/tasks')}
                leftIcon={<Icon name="arrow-left" />}
              >
                Back
              </Button>
              <Heading variant="heading-strong-xl">{task.title}</Heading>
            </Flex>
            <Badge
              variant={getStatusColor(task.status)}
              size="m"
            >
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
          </Flex>
          <Flex gap="8">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Icon name="edit" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsDeleteDialogOpen(true)}
              leftIcon={<Icon name="trash" />}
            >
              Delete
            </Button>
          </Flex>
        </Flex>
      </motion.div>

      {/* Task Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card padding="24">
          <Flex direction="column" gap="16">
            <Flex direction="column" gap="4">
              <Text size="sm" weight="medium" color="foreground-subtle">Description</Text>
              <Text>{task.description}</Text>
            </Flex>

            <Flex direction="column" gap="16">
              <Text size="sm" weight="medium" color="foreground-subtle">Details</Text>
              <Flex gap="32">
                <Flex direction="column" gap="4">
                  <Text size="sm" weight="medium" color="foreground-subtle">Created</Text>
                  <Text>{formatDate(task.createdAt)}</Text>
                </Flex>
                <Flex direction="column" gap="4">
                  <Text size="sm" weight="medium" color="foreground-subtle">Last Updated</Text>
                  <Text>{formatDate(task.updatedAt)}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </motion.div>

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTask}
        task={task}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        itemName={task.title}
      />
    </Flex>
  )
}
