"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { FilterBar, FilterOption } from "@/components/dashboard"

interface FilterClientProps {
  modelId: string
}

export function FilterClient({ modelId }: FilterClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get filter configuration based on model
  const filterConfig = getFilterConfig(modelId)
  
  // Initialize filters with values from URL
  const [filters, setFilters] = useState<FilterOption[]>(() => {
    return filterConfig.map(filter => ({
      ...filter,
      value: searchParams.get(filter.id) || undefined
    }))
  })

  // Update URL when filters change
  const updateFilters = (filterId: string, value: string) => {
    const updatedFilters = filters.map(filter => 
      filter.id === filterId ? { ...filter, value } : filter
    )
    setFilters(updatedFilters)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(filterId, value)
    } else {
      params.delete(filterId)
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = filters.map(filter => ({ ...filter, value: undefined }))
    setFilters(clearedFilters)
    router.push(pathname)
  }

  return (
    <FilterBar
      filters={filters}
      onFilterChange={updateFilters}
      onClearFilters={clearFilters}
    />
  )
}

// Helper function to get filter configuration based on model
function getFilterConfig(modelId: string): FilterOption[] {
  switch (modelId) {
    case "tasks":
      return [
        {
          id: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "pending", label: "Pending" },
            { value: "running", label: "Running" },
            { value: "completed", label: "Completed" },
            { value: "failed", label: "Failed" },
          ],
        },
        {
          id: "search",
          label: "Search",
          type: "search",
        },
        {
          id: "date",
          label: "Created After",
          type: "date",
        },
      ]
    case "logs":
      return [
        {
          id: "level",
          label: "Level",
          type: "select",
          options: [
            { value: "info", label: "Info" },
            { value: "warn", label: "Warning" },
            { value: "error", label: "Error" },
          ],
        },
        {
          id: "processName",
          label: "Process",
          type: "search",
        },
        {
          id: "date",
          label: "Date",
          type: "date",
        },
      ]
    case "users":
      return [
        {
          id: "search",
          label: "Search",
          type: "search",
        },
        {
          id: "date",
          label: "Joined After",
          type: "date",
        },
      ]
    default:
      return []
  }
}
