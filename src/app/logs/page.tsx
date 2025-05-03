'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Flex, Heading, Text } from '@/once-ui/components'
import { LogsTable, LogsFilterBar, LogsDetailDialog, DeleteConfirmationDialog } from '@/components/logs'
import { useLogs } from '@/hooks/useLogs'
import { ProcessLogFilters } from '@/interfaces/ProcessLog'
import { motion } from 'framer-motion'

export default function LogsPage() {
  const { data: session, status } = useSession()
  const { logs, isLoading, fetchLogs, fetchLogById, deleteLog } = useLogs()

  // State for filters
  const [filters, setFilters] = useState<ProcessLogFilters>({})
  
  // State for detail dialog
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [logToDelete, setLogToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if user is authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/signin?callbackUrl=/logs')
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: ProcessLogFilters) => {
    setFilters(newFilters)
    fetchLogs(newFilters)
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchLogs(filters)
  }

  // Handle opening the detail dialog
  const handleOpenDetailDialog = (logId: string) => {
    setSelectedLogId(logId)
    setIsDetailDialogOpen(true)
  }

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (logId: string) => {
    setLogToDelete(logId)
    setIsDeleteDialogOpen(true)
  }

  // Handle deleting a log
  const handleDeleteLog = async () => {
    if (!logToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteLog(logToDelete)
    } finally {
      setIsDeleting(false)
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
        <Flex direction="column" gap="4">
          <Heading variant="heading-strong-xl">System Logs</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            View and monitor system activity logs
          </Text>
        </Flex>
      </motion.div>

      {/* Filter Bar */}
      <LogsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Logs Table */}
      <LogsTable
        logs={logs}
        isLoading={isLoading}
        onViewDetails={handleOpenDetailDialog}
        onDelete={handleOpenDeleteDialog}
      />

      {/* Log Detail Dialog */}
      <LogsDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        logId={selectedLogId}
        onFetchLog={fetchLogById}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteLog}
        isDeleting={isDeleting}
        itemName="log entry"
      />
    </Flex>
  )
}
