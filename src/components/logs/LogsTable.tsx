'use client'

import { useState } from 'react'
import { Table, Flex, Text, IconButton, Badge } from '@/once-ui/components'
import { ProcessLog } from '@/interfaces/ProcessLog'
import { motion } from 'framer-motion'

interface LogsTableProps {
  logs: ProcessLog[]
  isLoading: boolean
  onViewDetails?: (logId: string) => void
  onDelete?: (logId: string) => void
}

export function LogsTable({ logs, isLoading, onViewDetails, onDelete }: LogsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProcessLog
    direction: 'ascending' | 'descending'
  } | null>({
    key: 'timestamp',
    direction: 'descending'
  })

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  // Get level badge color
  const getLevelColor = (level: ProcessLog['level']) => {
    switch (level) {
      case 'info':
        return 'brand'
      case 'warn':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'neutral'
    }
  }

  // Handle sorting
  const handleSort = (key: keyof ProcessLog) => {
    let direction: 'ascending' | 'descending' = 'ascending'

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }

    setSortConfig({ key, direction })
  }

  // Get sorted logs
  const getSortedLogs = () => {
    if (!sortConfig) return logs

    return [...logs].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }

  // Handle viewing log details
  const handleViewDetails = (logId: string) => {
    if (onViewDetails) {
      onViewDetails(logId)
    }
  }

  // Table data configuration
  const tableData = {
    columns: [
      {
        header: 'Timestamp',
        key: 'timestamp',
        sortable: true,
        width: '180px',
      },
      {
        header: 'Process',
        key: 'processName',
        sortable: true,
        width: '150px',
      },
      {
        header: 'Level',
        key: 'level',
        sortable: true,
        width: '100px',
      },
      {
        header: 'Message',
        key: 'message',
        sortable: false,
        width: 'auto',
      },
      {
        header: 'Actions',
        key: 'actions',
        sortable: false,
        width: '100px',
      },
    ],
    rows: getSortedLogs().map((log) => [
      <Text key={`timestamp-${log.id}`} size="sm">{formatDate(log.timestamp)}</Text>,
      <Text key={`process-${log.id}`} weight="medium">{log.processName}</Text>,
      <Badge 
        key={`level-${log.id}`} 
        variant={getLevelColor(log.level)}
        size="s"
      >
        {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
      </Badge>,
      <Text key={`message-${log.id}`} size="sm">{log.message}</Text>,
      <Flex key={`actions-${log.id}`} gap="2">
        {onViewDetails && (
          <IconButton
            icon="eye"
            variant="tertiary"
            size="s"
            tooltip="View Details"
            onClick={() => handleViewDetails(log.id)}
          />
        )}
        {onDelete && (
          <IconButton
            icon="trash"
            variant="tertiary"
            size="s"
            tooltip="Delete"
            onClick={() => onDelete(log.id)}
          />
        )}
      </Flex>,
    ]),
  }

  if (isLoading) {
    return (
      <Flex center padding="32">
        <Text>Loading logs...</Text>
      </Flex>
    )
  }

  if (logs.length === 0) {
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
            No logs found
          </Text>
          <Text size="sm" color="foreground-subtle">
            Try adjusting your filters or check back later
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
