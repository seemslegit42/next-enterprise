"use client"

import { useState, useEffect } from "react"
import { Flex, Text, Icon, Grid } from "@/once-ui/components"
import { IconName } from "@/once-ui/icons"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"

export interface Column<T = any> {
  key: string
  header: string
  width?: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  pagination?: {
    pageSize: number
    currentPage: number
    totalItems: number
    onPageChange: (page: number) => void
  }
  sorting?: {
    sortKey: string | null
    sortDirection: "asc" | "desc"
    onSort: (key: string, direction: "asc" | "desc") => void
  }
  actions?: {
    icon: IconName
    label: string
    onClick: (row: T) => void
    color?: string
  }[]
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  pagination,
  sorting,
  actions,
}: DataTableProps<T>) {
  const [currentData, setCurrentData] = useState<T[]>([])

  useEffect(() => {
    setCurrentData(data)
  }, [data])

  const handleSort = (key: string) => {
    if (!sorting) return

    const newDirection =
      sorting.sortKey === key && sorting.sortDirection === "asc" ? "desc" : "asc"
    sorting.onSort(key, newDirection)
  }

  const renderPagination = () => {
    if (!pagination) return null

    const { pageSize, currentPage, totalItems, onPageChange } = pagination
    const totalPages = Math.ceil(totalItems / pageSize)
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
      <Flex justifyContent="space-between" alignItems="center" marginTop="4">
        <Text size="sm" color="foreground-subtle">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </Text>
        <Flex gap="2">
          <Flex
            as="button"
            padding="2"
            borderRadius="md"
            background={currentPage === 1 ? "neutral-alpha-weak" : "surface-strong"}
            color={currentPage === 1 ? "foreground-subtle" : "foreground"}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            alignItems="center"
            justifyContent="center"
            width="8"
            height="8"
          >
            <Icon name="chevronLeft" size="4" />
          </Flex>
          {pages.map((page) => (
            <Flex
              key={page}
              as="button"
              padding="2"
              borderRadius="md"
              background={currentPage === page ? "brand" : "surface-strong"}
              color={currentPage === page ? "on-brand" : "foreground"}
              onClick={() => onPageChange(page)}
              alignItems="center"
              justifyContent="center"
              width="8"
              height="8"
            >
              <Text size="sm">{page}</Text>
            </Flex>
          ))}
          <Flex
            as="button"
            padding="2"
            borderRadius="md"
            background={currentPage === totalPages ? "neutral-alpha-weak" : "surface-strong"}
            color={currentPage === totalPages ? "foreground-subtle" : "foreground"}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            alignItems="center"
            justifyContent="center"
            width="8"
            height="8"
          >
            <Icon name="chevronRight" size="4" />
          </Flex>
        </Flex>
      </Flex>
    )
  }

  return (
    <FadeIn>
      <Flex direction="column" width="full">
        {/* Table Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Grid
            columns={actions ? `repeat(${columns.length + 1}, auto)` : `repeat(${columns.length}, auto)`}
            padding="4"
            background="surface-strong"
            borderRadius="lg"
            borderBottomRadius={data.length > 0 ? "none" : "lg"}
            border
            borderBottom={data.length > 0 ? "none" : undefined}
          >
            {columns.map((column, index) => (
              <motion.div
                key={column.key}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.2 }}
              >
                <Flex
                  alignItems="center"
                  gap="1"
                  style={{ width: column.width }}
                  cursor={column.sortable && sorting ? "pointer" : "default"}
                  onClick={() => column.sortable && sorting && handleSort(column.key)}
                >
                  <Text weight="semibold" size="sm">
                    {column.header}
                  </Text>
                  {column.sortable && sorting && sorting.sortKey === column.key && (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: sorting.sortDirection === "asc" ? 0 : 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon
                        name="chevronUp"
                        size="4"
                        color="brand"
                      />
                    </motion.div>
                  )}
                </Flex>
              </motion.div>
            ))}
            {actions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * columns.length, duration: 0.2 }}
              >
                <Flex justifyContent="flex-end">
                  <Text weight="semibold" size="sm">
                    Actions
                  </Text>
                </Flex>
              </motion.div>
            )}
          </Grid>
        </motion.div>

      {/* Table Body */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Flex
              padding="6"
              justifyContent="center"
              alignItems="center"
              borderRadius="lg"
              borderTopRadius="none"
              border
              borderTop="none"
              background="surface"
            >
              <Flex alignItems="center" gap="2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Icon name="refresh" size="5" />
                </motion.div>
                <Text>Loading data...</Text>
              </Flex>
            </Flex>
          </motion.div>
        ) : currentData.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Flex
              padding="6"
              justifyContent="center"
              alignItems="center"
              borderRadius="lg"
              borderTopRadius="none"
              border
              borderTop="none"
              background="surface"
            >
              <Text color="foreground-subtle">{emptyMessage}</Text>
            </Flex>
          </motion.div>
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Flex direction="column" borderRadius="lg" borderTopRadius="none" border borderTop="none" background="surface">
              <StaggerContainer>
                {currentData.map((row, rowIndex) => (
                  <StaggerItem key={rowIndex}>
                    <Grid
                      columns={actions ? `repeat(${columns.length + 1}, auto)` : `repeat(${columns.length}, auto)`}
                      padding="4"
                      borderBottom={rowIndex < currentData.length - 1 ? true : undefined}
                      background={rowIndex % 2 === 0 ? "surface" : "surface-strong"}
                    >
                      {columns.map((column) => (
                        <Flex key={column.key} style={{ width: column.width }}>
                          {column.render ? (
                            column.render(row[column.key], row)
                          ) : (
                            <Text size="sm">{row[column.key]?.toString() || "-"}</Text>
                          )}
                        </Flex>
                      ))}
                      {actions && (
                        <Flex justifyContent="flex-end" gap="2">
                          {actions.map((action, actionIndex) => (
                            <motion.div
                              key={actionIndex}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Flex
                                as="button"
                                padding="2"
                                borderRadius="md"
                                background={`${action.color || "brand"}-alpha-weak`}
                                color={action.color || "brand"}
                                hover={{ background: `${action.color || "brand"}-alpha-medium` }}
                                transition="colors"
                                onClick={() => action.onClick(row)}
                                alignItems="center"
                                justifyContent="center"
                                width="8"
                                height="8"
                                title={action.label}
                              >
                                <Icon name={action.icon} size="4" />
                              </Flex>
                            </motion.div>
                          ))}
                        </Flex>
                      )}
                    </Grid>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {renderPagination()}
        </motion.div>
      )}
    </Flex>
    </FadeIn>
  )
}
