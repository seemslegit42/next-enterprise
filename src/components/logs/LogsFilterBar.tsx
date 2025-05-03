'use client'

import { useState } from 'react'
import { Flex, Text, Button, Icon, Select } from '@/once-ui/components'
import { ProcessLogFilters } from '@/interfaces/ProcessLog'
import { motion } from 'framer-motion'

interface LogsFilterBarProps {
  filters: ProcessLogFilters
  onFilterChange: (filters: ProcessLogFilters) => void
  onRefresh: () => void
  isLoading: boolean
}

export function LogsFilterBar({ 
  filters, 
  onFilterChange, 
  onRefresh,
  isLoading 
}: LogsFilterBarProps) {
  const [expanded, setExpanded] = useState(true)

  // Handle level filter change
  const handleLevelChange = (level: string | null) => {
    onFilterChange({
      ...filters,
      level: level as 'info' | 'warn' | 'error' | undefined
    })
  }

  // Handle process name filter change
  const handleProcessNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      processName: event.target.value || undefined
    })
  }

  // Handle date filter change
  const handleDateChange = (type: 'start' | 'end', event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : undefined
    
    if (type === 'start') {
      onFilterChange({
        ...filters,
        startDate: date
      })
    } else {
      onFilterChange({
        ...filters,
        endDate: date
      })
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({})
  }

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex
        direction="column"
        padding="4"
        background="surface"
        borderRadius="lg"
        border
        shadow="sm"
        marginBottom="6"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          cursor="pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <Flex gap="2" alignItems="center">
            <Icon name="filter" size="5" color="brand" />
            <Text weight="semibold">
              Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
            </Text>
          </Flex>
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size="5"
            color="foreground-subtle"
          />
        </Flex>

        {expanded && (
          <Flex
            direction="column"
            gap="4"
            marginTop="4"
            paddingTop="4"
            borderTop
          >
            <Flex gap="4" flexWrap="wrap">
              {/* Level Filter */}
              <Flex
                direction="column"
                gap="1"
                flex="1"
                minWidth="200px"
              >
                <Text size="sm" weight="medium">
                  Log Level
                </Text>
                <Select
                  value={filters.level || ''}
                  onChange={(value) => handleLevelChange(value || null)}
                  options={[
                    { value: '', label: 'All Levels' },
                    { value: 'info', label: 'Info' },
                    { value: 'warn', label: 'Warning' },
                    { value: 'error', label: 'Error' },
                  ]}
                  placeholder="Select level"
                />
              </Flex>

              {/* Process Name Filter */}
              <Flex
                direction="column"
                gap="1"
                flex="1"
                minWidth="200px"
              >
                <Text size="sm" weight="medium">
                  Process Name
                </Text>
                <Flex
                  as="div"
                  position="relative"
                  alignItems="center"
                  width="full"
                >
                  <Icon
                    name="search"
                    size="4"
                    color="foreground-subtle"
                    style={{
                      position: "absolute",
                      left: "8px",
                    }}
                  />
                  <input
                    type="text"
                    value={filters.processName || ''}
                    onChange={handleProcessNameChange}
                    placeholder="Search process name..."
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                  />
                </Flex>
              </Flex>

              {/* Date Range Filters */}
              <Flex
                direction="column"
                gap="1"
                flex="1"
                minWidth="200px"
              >
                <Text size="sm" weight="medium">
                  Start Date
                </Text>
                <input
                  type="date"
                  value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('start', e)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                />
              </Flex>

              <Flex
                direction="column"
                gap="1"
                flex="1"
                minWidth="200px"
              >
                <Text size="sm" weight="medium">
                  End Date
                </Text>
                <input
                  type="date"
                  value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('end', e)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                />
              </Flex>
            </Flex>

            <Flex justifyContent="flex-end" gap="2">
              <Button
                variant="tertiary"
                onClick={handleClearFilters}
                disabled={activeFilterCount === 0}
              >
                Clear Filters
              </Button>
              <Button
                variant="primary"
                onClick={onRefresh}
                leftIcon={<Icon name="refresh-cw" />}
                isLoading={isLoading}
              >
                Refresh
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </motion.div>
  )
}
