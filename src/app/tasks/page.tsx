'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Flex, Heading, Text, Button, Icon } from '@/once-ui/components'
import { TaskTable, TaskModal, DeleteConfirmationDialog } from '@/components/tasks'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/interfaces/Task'
import { motion } from 'framer-motion'

export default function TasksPage() {
  const { data: session, status } = useSession()
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Check if user is authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/signin?callbackUrl=/tasks')
  }

  // Handle opening the create task modal
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  // Handle opening the edit task modal
  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (task: Task) => {
    setSelectedTask(task)
    setIsDeleteDialogOpen(true)
  }

  // Handle creating a new task
  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData)
  }

  // Handle updating a task
  const handleUpdateTask = async (taskData: any) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, taskData)
    }
  }

  // Handle deleting a task
  const handleDeleteTask = async () => {
    if (selectedTask) {
      await deleteTask(selectedTask.id)
    }
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
            <Heading variant="heading-strong-xl">Tasks</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Manage and track your tasks
            </Text>
          </Flex>
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            leftIcon={<Icon name="plus" />}
          >
            Create Task
          </Button>
        </Flex>
      </motion.div>

      {/* Task Table */}
      <TaskTable
        tasks={tasks}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        isLoading={isLoading}
      />

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        mode="create"
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTask}
        task={selectedTask}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        itemName={selectedTask?.title || 'this task'}
      />
    </Flex>
  )
}
