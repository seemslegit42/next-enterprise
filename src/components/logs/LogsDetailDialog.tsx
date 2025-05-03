'use client'

import { useState, useEffect } from 'react'
import { Dialog, Flex, Text, Badge, Button, Icon } from '@/once-ui/components'
import { ProcessLog } from '@/interfaces/ProcessLog'
import { motion } from 'framer-motion'

interface LogsDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  logId: string | null
  onFetchLog: (id: string) => Promise<ProcessLog | null>
}

export function LogsDetailDialog({ 
  isOpen, 
  onClose, 
  logId, 
  onFetchLog 
}: LogsDetailDialogProps) {
  const [log, setLog] = useState<ProcessLog | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch log details when dialog opens
  useEffect(() => {
    if (isOpen && logId) {
      setIsLoading(true)
      setError(null)
      
      onFetchLog(logId)
        .then((data) => {
          setLog(data)
        })
        .catch((err) => {
          setError('Failed to fetch log details')
          console.error(err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setLog(null)
    }
  }, [isOpen, logId, onFetchLog])

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

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  // Format metadata for display
  const formatMetadata = (metadata: Record<string, any>) => {
    try {
      return JSON.stringify(metadata, null, 2)
    } catch (err) {
      return JSON.stringify(metadata)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Log Details"
      description="View detailed information about this log entry"
      footer={
        <Flex justifyContent="flex-end">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </Flex>
      }
    >
      {isLoading ? (
        <Flex center padding="32">
          <Text>Loading log details...</Text>
        </Flex>
      ) : error ? (
        <Flex center padding="32" direction="column" gap="4">
          <Icon name="alert-triangle" size="32" color="error" />
          <Text color="error">{error}</Text>
        </Flex>
      ) : log ? (
        <Flex direction="column" gap="16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Flex direction="column" gap="2">
              <Text size="sm" weight="medium" color="foreground-subtle">
                Timestamp
              </Text>
              <Text>{formatDate(log.timestamp)}</Text>
            </Flex>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Flex direction="column" gap="2">
              <Text size="sm" weight="medium" color="foreground-subtle">
                Process Name
              </Text>
              <Text>{log.processName}</Text>
            </Flex>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Flex direction="column" gap="2">
              <Text size="sm" weight="medium" color="foreground-subtle">
                Level
              </Text>
              <Badge variant={getLevelColor(log.level)} size="s">
                {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
              </Badge>
            </Flex>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Flex direction="column" gap="2">
              <Text size="sm" weight="medium" color="foreground-subtle">
                Message
              </Text>
              <Text>{log.message}</Text>
            </Flex>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Flex direction="column" gap="2">
              <Text size="sm" weight="medium" color="foreground-subtle">
                Metadata
              </Text>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
                {formatMetadata(log.metadata)}
              </pre>
            </Flex>
          </motion.div>
        </Flex>
      ) : null}
    </Dialog>
  )
}
