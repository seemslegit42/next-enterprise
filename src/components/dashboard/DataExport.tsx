"use client"

import { useState, useRef } from "react"
import { Flex, Text, Icon } from "@/once-ui/components"

interface DataExportProps {
  data: any[]
  filename?: string
  formats?: ("csv" | "json" | "excel")[]
}

export function DataExport({
  data,
  filename = "export",
  formats = ["csv", "json"],
}: DataExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  // Convert data to CSV
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ""

    // Get headers
    const headers = Object.keys(data[0])
    
    // Create CSV rows
    const csvRows = [
      // Headers row
      headers.join(","),
      // Data rows
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Handle strings with commas by wrapping in quotes
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          })
          .join(",")
      ),
    ]

    return csvRows.join("\n")
  }

  // Convert data to JSON
  const convertToJSON = (data: any[]) => {
    return JSON.stringify(data, null, 2)
  }

  // Export data
  const exportData = (format: "csv" | "json" | "excel") => {
    let content = ""
    let mimeType = ""
    let extension = ""

    switch (format) {
      case "csv":
        content = convertToCSV(data)
        mimeType = "text/csv"
        extension = "csv"
        break
      case "json":
        content = convertToJSON(data)
        mimeType = "application/json"
        extension = "json"
        break
      case "excel":
        // For Excel, we'll use CSV format but with .xlsx extension
        // In a real app, you'd use a library like xlsx to create actual Excel files
        content = convertToCSV(data)
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        extension = "xlsx"
        break
    }

    // Create a blob and download link
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Close the dropdown
    setIsOpen(false)
  }

  return (
    <Flex position="relative" ref={exportRef}>
      <Flex
        as="button"
        alignItems="center"
        gap="2"
        padding="2"
        paddingX="3"
        borderRadius="md"
        background="surface-strong"
        border
        hover={{ background: "neutral-alpha-weak" }}
        transition="colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon name="download" size="4" />
        <Text size="sm">Export</Text>
        <Icon name="chevronDown" size="4" />
      </Flex>

      {isOpen && (
        <Flex
          position="absolute"
          top="10"
          right="0"
          width="48"
          direction="column"
          background="surface"
          borderRadius="lg"
          border
          shadow="lg"
          zIndex="50"
        >
          {formats.includes("csv") && (
            <ExportOption
              format="CSV"
              icon="file-text"
              onClick={() => exportData("csv")}
            />
          )}
          {formats.includes("json") && (
            <ExportOption
              format="JSON"
              icon="code"
              onClick={() => exportData("json")}
            />
          )}
          {formats.includes("excel") && (
            <ExportOption
              format="Excel"
              icon="file-spreadsheet"
              onClick={() => exportData("excel")}
            />
          )}
        </Flex>
      )}
    </Flex>
  )
}

// Export option component
function ExportOption({
  format,
  icon,
  onClick,
}: {
  format: string
  icon: string
  onClick: () => void
}) {
  return (
    <Flex
      as="button"
      padding="3"
      gap="3"
      alignItems="center"
      hover={{ background: "neutral-alpha-weak" }}
      transition="colors"
      onClick={onClick}
    >
      <Icon name={icon} size="4" />
      <Text>Export as {format}</Text>
    </Flex>
  )
}
