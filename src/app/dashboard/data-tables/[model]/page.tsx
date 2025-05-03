import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { Flex, Text, Icon } from "@/once-ui/components"
import { DashboardHeader, DataTable } from "@/components/dashboard"
import prisma from "../../../../lib/prisma"
import { DataTableClient } from "./client"

export const metadata: Metadata = {
  title: "Data Table | Dashboard",
  description: "View and manage data",
}

export default async function DataTablePage({
  params,
}: {
  params: { model: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard/data-tables")
  }

  // Get model configuration
  const modelConfig = getModelConfig(params.model)

  if (!modelConfig) {
    redirect("/dashboard/data-tables")
  }

  // Fetch data based on model
  const data = await fetchModelData(params.model, session.user.id)

  return (
    <Flex direction="column" gap="6">
      <DashboardHeader
        title={modelConfig.title}
        description={modelConfig.description}
        icon={modelConfig.icon}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Data Tables", href: "/dashboard/data-tables" },
          { label: modelConfig.title },
        ]}
        actions={
          <Flex
            as="a"
            href={`/dashboard/data-tables/${params.model}/new`}
            padding="2"
            paddingX="4"
            borderRadius="md"
            background="brand"
            color="on-brand"
            hover={{ background: "brand-strong" }}
            transition="colors"
            alignItems="center"
            gap="2"
          >
            <Icon name="plus" size="4" />
            <Text>Add New</Text>
          </Flex>
        }
      />

      {/* Client-side filter bar will be added here */}
      <div id="filter-bar-container" />
      <DataTableClient modelId={params.model} />

      {/* Data Table */}
      <DataTable
        columns={modelConfig.columns}
        data={data}
        actions={[
          {
            icon: "eye",
            label: "View",
            onClick: (row) => {},
            color: "brand",
          },
          {
            icon: "edit",
            label: "Edit",
            onClick: (row) => {},
            color: "warning",
          },
          {
            icon: "trash",
            label: "Delete",
            onClick: (row) => {},
            color: "error",
          },
        ]}
      />
    </Flex>
  )
}

// Helper function to get model configuration
function getModelConfig(modelId: string) {
  const configs = {
    tasks: {
      title: "Tasks",
      description: "Manage your tasks and assignments",
      icon: "check-circle" as const,
      columns: [
        { key: "id", header: "ID", width: "80px" },
        { key: "title", header: "Title", width: "250px" },
        { key: "description", header: "Description", width: "auto" },
        {
          key: "status",
          header: "Status",
          width: "120px",
          render: (value: string) => (
            <Flex
              padding="1"
              paddingX="2"
              borderRadius="full"
              background={getStatusColor(value)}
              justifyContent="center"
              width="fit"
            >
              <Text size="xs" color="white" textTransform="capitalize">
                {value}
              </Text>
            </Flex>
          ),
        },
        {
          key: "createdAt",
          header: "Created",
          width: "150px",
          render: (value: Date) => (
            <Text size="sm">{new Date(value).toLocaleDateString()}</Text>
          ),
        },
      ],
    },
    logs: {
      title: "Process Logs",
      description: "View system process logs",
      icon: "file-text" as const,
      columns: [
        { key: "id", header: "ID", width: "80px" },
        { key: "processName", header: "Process", width: "200px" },
        { key: "message", header: "Message", width: "auto" },
        {
          key: "level",
          header: "Level",
          width: "100px",
          render: (value: string) => (
            <Flex
              padding="1"
              paddingX="2"
              borderRadius="full"
              background={getLevelColor(value)}
              justifyContent="center"
              width="fit"
            >
              <Text size="xs" color="white" textTransform="capitalize">
                {value}
              </Text>
            </Flex>
          ),
        },
        {
          key: "timestamp",
          header: "Timestamp",
          width: "150px",
          render: (value: Date) => (
            <Text size="sm">{new Date(value).toLocaleString()}</Text>
          ),
        },
      ],
    },
    users: {
      title: "Users",
      description: "Manage user accounts",
      icon: "user" as const,
      columns: [
        { key: "id", header: "ID", width: "80px" },
        { key: "name", header: "Name", width: "200px" },
        { key: "email", header: "Email", width: "auto" },
        {
          key: "createdAt",
          header: "Created",
          width: "150px",
          render: (value: Date) => (
            <Text size="sm">{new Date(value).toLocaleDateString()}</Text>
          ),
        },
      ],
    },
  }

  return configs[modelId as keyof typeof configs]
}

// Helper function to fetch model data
async function fetchModelData(modelId: string, userId: string) {
  switch (modelId) {
    case "tasks":
      return await prisma.task.findMany({
        where: { assignedTo: userId },
        orderBy: { updatedAt: "desc" },
      })
    case "logs":
      return await prisma.processLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 50,
      })
    case "users":
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })
    default:
      return []
  }
}

// Helper function to get status color
function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "var(--warning-background-strong)"
    case "running":
      return "var(--brand-background-strong)"
    case "completed":
      return "var(--success-background-strong)"
    case "failed":
      return "var(--error-background-strong)"
    default:
      return "var(--neutral-background-strong)"
  }
}

// Helper function to get log level color
function getLevelColor(level: string): string {
  switch (level) {
    case "info":
      return "var(--brand-background-strong)"
    case "warn":
      return "var(--warning-background-strong)"
    case "error":
      return "var(--error-background-strong)"
    default:
      return "var(--neutral-background-strong)"
  }
}
