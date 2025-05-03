"use client"

import { useState, ReactNode } from "react"
import { Flex, Text, Icon } from "@/once-ui/components"

export interface FilterOption {
  id: string
  label: string
  options?: { value: string; label: string }[]
  type: "select" | "date" | "search" | "custom"
  value?: string
  component?: ReactNode
}

interface FilterBarProps {
  filters: FilterOption[]
  onFilterChange: (filterId: string, value: string) => void
  onClearFilters: () => void
}

export function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false)

  const handleFilterChange = (filterId: string, value: string) => {
    onFilterChange(filterId, value)
  }

  const activeFilterCount = filters.filter((f) => f.value && f.value !== "").length

  return (
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
          name={expanded ? "chevronUp" : "chevronDown"}
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
            {filters.map((filter) => (
              <Flex
                key={filter.id}
                direction="column"
                gap="1"
                flex="1"
                minWidth="200px"
              >
                <Text size="sm" weight="medium">
                  {filter.label}
                </Text>
                {filter.type === "select" && filter.options && (
                  <select
                    value={filter.value || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.id, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === "date" && (
                  <input
                    type="date"
                    value={filter.value || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.id, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                  />
                )}
                {filter.type === "search" && (
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
                      value={filter.value || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.id, e.target.value)
                      }
                      placeholder={`Search ${filter.label.toLowerCase()}...`}
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                    />
                  </Flex>
                )}
                {filter.type === "custom" && filter.component}
              </Flex>
            ))}
          </Flex>

          <Flex justifyContent="flex-end" gap="2">
            <Flex
              as="button"
              padding="2"
              paddingX="4"
              borderRadius="md"
              background="surface-strong"
              border
              color="foreground"
              hover={{ background: "neutral-alpha-weak" }}
              transition="colors"
              onClick={onClearFilters}
            >
              <Text size="sm">Clear Filters</Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
