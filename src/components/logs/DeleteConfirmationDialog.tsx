'use client'

import { Dialog, Flex, Text, Button, Icon } from '@/once-ui/components'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isDeleting: boolean
  itemName?: string
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemName = 'log entry',
}: DeleteConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      description={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
      footer={
        <Flex gap="8">
          <Button variant="tertiary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="error"
            onClick={handleConfirm}
            isLoading={isDeleting}
            leftIcon={<Icon name="trash" />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Flex>
      }
    >
      <Flex center padding="16" direction="column" gap="4">
        <Icon name="alert-triangle" size="32" color="error" />
        <Text align="center">
          This will permanently delete the {itemName} from the system.
        </Text>
      </Flex>
    </Dialog>
  )
}
