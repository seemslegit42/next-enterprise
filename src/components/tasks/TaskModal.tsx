'use client'

import { useState, useEffect } from 'react'
import { Dialog, Flex, Text, Button, Input, Textarea, Select } from '@/once-ui/components'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/interfaces/Task'
import { motion } from 'framer-motion'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>
  task?: Task | null
  mode: 'create' | 'edit'
}

export function TaskModal({ isOpen, onClose, onSubmit, task, mode }: TaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskInput | UpdateTaskInput>({
    title: '',
    description: '',
    status: 'pending',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen && task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
      })
    } else if (isOpen && mode === 'create') {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
      })
    }
    
    // Reset errors when modal opens/closes
    setErrors({})
  }, [isOpen, task, mode])

  const handleChange = (field: keyof CreateTaskInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Task' : 'Edit Task'}
      description={
        mode === 'create'
          ? 'Add a new task to your list'
          : 'Update the details of this task'
      }
      footer={
        <Flex gap="8">
          <Button variant="tertiary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Update Task'}
          </Button>
        </Flex>
      }
    >
      <Flex direction="column" gap="16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            id="task-title"
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={!!errors.title}
            errorMessage={errors.title}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Textarea
            id="task-description"
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            errorMessage={errors.description}
            lines={5}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Select
            id="task-status"
            label="Status"
            value={formData.status}
            onChange={(value) => handleChange('status', value as string)}
          >
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </Select>
        </motion.div>
      </Flex>
    </Dialog>
  )
}
