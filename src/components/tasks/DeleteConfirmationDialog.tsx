'use client'

import { useState } from 'react'
import { Dialog, Flex, Text, Button } from '@/once-ui/components'
import { motion } from 'framer-motion'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  itemName: string
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <Flex gap="8">
          <Button variant="tertiary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Flex>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Flex direction="column" gap="16" padding="8">
          <Text>
            Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
          </Text>
        </Flex>
      </motion.div>
    </Dialog>
  )
}
