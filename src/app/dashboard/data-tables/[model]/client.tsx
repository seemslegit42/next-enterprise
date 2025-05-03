"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FilterClient } from "./filter-client"

interface DataTableClientProps {
  modelId: string
}

export function DataTableClient({ modelId }: DataTableClientProps) {
  const searchParams = useSearchParams()
  
  // Mount the filter bar
  useEffect(() => {
    const filterContainer = document.getElementById("filter-bar-container")
    if (filterContainer) {
      // Clear any existing content
      filterContainer.innerHTML = ""
      
      // Create a div to render our filter component
      const filterDiv = document.createElement("div")
      filterContainer.appendChild(filterDiv)
      
      // Render the filter component
      const root = document.createElement("div")
      filterDiv.appendChild(root)
      
      // We're using this approach instead of directly rendering the component
      // to avoid hydration issues with server components
      import("react-dom/client").then(({ createRoot }) => {
        const reactRoot = createRoot(root)
        reactRoot.render(<FilterClient modelId={modelId} />)
      })
    }
  }, [modelId])
  
  return null
}
