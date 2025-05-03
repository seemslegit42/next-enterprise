import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "../../lib/auth"
import { Flex, Grid, Text, Icon } from "@/once-ui/components"
import {
  StatCard,
  ActivityCard,
  ChartCard,
  QuickAction,
  DashboardHeader,
  CustomizableDashboard
} from "@/components/dashboard"
import prisma from "../../lib/prisma"
import { PageTransition, StaggerContainer, FadeIn, SlideUp } from "@/components/animations"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  // Fetch task statistics
  const taskStats = await getTaskStats(session.user.id)

  // Fetch logs statistics
  const logStats = await getLogStats()

  // Fetch recent activities (tasks)
  const recentTasks = await getRecentTasks(session.user.id)

  // Fetch recent logs
  const recentLogs = await getRecentLogs()

  // Create initial widgets for the customizable dashboard
  const initialWidgets = [
    // First row - Task statistics
    {
      id: "stats-total",
      type: "stats",
      title: "Total Tasks",
      size: "small",
      position: { x: 0, y: 0, w: 1, h: 1 },
      data: {
        icon: "check-circle",
        value: taskStats.total,
        description: "All assigned tasks",
      },
    },
    {
      id: "stats-pending",
      type: "stats",
      title: "Pending",
      size: "small",
      position: { x: 1, y: 0, w: 1, h: 1 },
      data: {
        icon: "clock",
        value: taskStats.pending,
        description: "Tasks awaiting action",
        iconColor: "warning",
        iconBgColor: "warning-alpha-weak",
      },
    },
    {
      id: "stats-completed",
      type: "stats",
      title: "Completed",
      size: "small",
      position: { x: 2, y: 0, w: 1, h: 1 },
      data: {
        icon: "check",
        value: taskStats.completed,
        description: "Successfully completed tasks",
        iconColor: "success",
        iconBgColor: "success-alpha-weak",
      },
    },
    {
      id: "stats-failed",
      type: "stats",
      title: "Failed",
      size: "small",
      position: { x: 3, y: 0, w: 1, h: 1 },
      data: {
        icon: "x",
        value: taskStats.failed,
        description: "Tasks that encountered errors",
        iconColor: "error",
        iconBgColor: "error-alpha-weak",
      },
    },

    // Second row - Log statistics
    {
      id: "stats-total-logs",
      type: "stats",
      title: "Total Logs",
      size: "small",
      position: { x: 0, y: 1, w: 1, h: 1 },
      data: {
        icon: "file-text",
        value: logStats.total,
        description: "All system logs",
        iconColor: "accent",
        iconBgColor: "accent-alpha-weak",
      },
    },
    {
      id: "stats-info-logs",
      type: "stats",
      title: "Info Logs",
      size: "small",
      position: { x: 1, y: 1, w: 1, h: 1 },
      data: {
        icon: "info",
        value: logStats.info,
        description: "Informational logs",
        iconColor: "brand",
        iconBgColor: "brand-alpha-weak",
      },
    },
    {
      id: "stats-warn-logs",
      type: "stats",
      title: "Warning Logs",
      size: "small",
      position: { x: 2, y: 1, w: 1, h: 1 },
      data: {
        icon: "alert-triangle",
        value: logStats.warn,
        description: "Warning logs",
        iconColor: "warning",
        iconBgColor: "warning-alpha-weak",
      },
    },
    {
      id: "stats-error-logs",
      type: "stats",
      title: "Error Logs",
      size: "small",
      position: { x: 3, y: 1, w: 1, h: 1 },
      data: {
        icon: "alert-circle",
        value: logStats.error,
        description: "Error logs",
        iconColor: "error",
        iconBgColor: "error-alpha-weak",
      },
    },

    // Third row - Activities and charts
    {
      id: "activity-recent-tasks",
      type: "activity",
      title: "Recent Tasks",
      size: "medium",
      position: { x: 0, y: 2, w: 2, h: 2 },
      data: {
        activities: recentTasks,
        viewAllHref: "/dashboard/tasks",
      },
    },
    {
      id: "activity-recent-logs",
      type: "activity",
      title: "Recent Logs",
      size: "medium",
      position: { x: 2, y: 2, w: 2, h: 2 },
      data: {
        activities: recentLogs,
        viewAllHref: "/logs",
      },
    },

    // Fourth row - Charts
    {
      id: "chart-task-status",
      type: "chart",
      title: "Task Status Distribution",
      size: "medium",
      position: { x: 0, y: 4, w: 2, h: 2 },
      data: {
        subtitle: "Overview of your task statuses",
        statusDistribution: taskStats.statusDistribution,
      },
    },
    {
      id: "chart-log-levels",
      type: "chart",
      title: "Log Level Distribution",
      size: "medium",
      position: { x: 2, y: 4, w: 2, h: 2 },
      data: {
        subtitle: "Distribution of logs by level",
        statusDistribution: logStats.levelDistribution,
      },
    },
  ]

  return (
    <PageTransition>
      <Flex direction="column" gap="8">
        {/* Header */}
        <FadeIn>
          <DashboardHeader
            title="Dashboard"
            description={`Welcome, ${session.user?.name || session.user?.email}!`}
            icon="home"
          />
        </FadeIn>

        {/* Customizable Dashboard */}
        <SlideUp delay={0.1}>
          <CustomizableDashboard
            userId={session.user.id}
            initialWidgets={initialWidgets}
          />
        </SlideUp>

        {/* Quick Actions */}
        <section>
          <FadeIn delay={0.2}>
            <Text as="h2" size="xl" weight="semibold" marginBottom="4">Quick Actions</Text>
          </FadeIn>
          <StaggerContainer>
            <Grid columns={[1, 2, 3]} gap="6">
              <QuickAction
                title="Tasks"
                description="Manage your tasks"
                icon="check-circle"
                href="/dashboard/tasks"
              />
              <QuickAction
                title="Data Tables"
                description="View and manage data"
                icon="table"
                iconColor="brand"
                iconBgColor="brand-alpha-weak"
                href="/dashboard/data-tables"
              />
              <QuickAction
                title="Analytics"
                description="View system metrics"
                icon="bar-chart"
                iconColor="success"
                iconBgColor="success-alpha-weak"
                href="/dashboard/analytics"
              />
              <QuickAction
                title="System Logs"
                description="View system activity"
                icon="file-text"
                iconColor="accent"
                iconBgColor="accent-alpha-weak"
                href="/logs"
              />
              <QuickAction
                title="Your Profile"
                description="View and edit your profile"
                icon="user"
                iconColor="neutral"
                iconBgColor="neutral-alpha-weak"
                href="/dashboard/profile"
              />
              <QuickAction
                title="Settings"
                description="Configure your dashboard"
                icon="settings"
                iconColor="warning"
                iconBgColor="warning-alpha-weak"
                href="/dashboard/settings"
              />
            </Grid>
          </StaggerContainer>
        </section>
      </Flex>
    </PageTransition>
  )
}

// Helper function to get task statistics
async function getTaskStats(userId: string) {
  const total = await prisma.task.count({
    where: { assignedTo: userId },
  })

  const pending = await prisma.task.count({
    where: { assignedTo: userId, status: "pending" },
  })

  const running = await prisma.task.count({
    where: { assignedTo: userId, status: "running" },
  })

  const completed = await prisma.task.count({
    where: { assignedTo: userId, status: "completed" },
  })

  const failed = await prisma.task.count({
    where: { assignedTo: userId, status: "failed" },
  })

  return {
    total,
    pending,
    running,
    completed,
    failed,
    statusDistribution: {
      pending,
      running,
      completed,
      failed,
    },
  }
}

// Helper function to get recent tasks
async function getRecentTasks(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { assignedTo: userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description.length > 60
      ? `${task.description.substring(0, 60)}...`
      : task.description,
    timestamp: task.updatedAt,
    icon: getTaskStatusIcon(task.status),
    iconColor: getTaskStatusColor(task.status),
  }))
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

// Helper function to get task status icon
function getTaskStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return "clock"
    case "running":
      return "refresh"
    case "completed":
      return "check"
    case "failed":
      return "x"
    default:
      return "circle"
  }
}

// Helper function to get task status color
function getTaskStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "warning"
    case "running":
      return "brand"
    case "completed":
      return "success"
    case "failed":
      return "error"
    default:
      return "neutral"
  }
}

// Helper function to get log statistics
async function getLogStats() {
  const total = await prisma.processLog.count()

  const info = await prisma.processLog.count({
    where: { level: "info" },
  })

  const warn = await prisma.processLog.count({
    where: { level: "warn" },
  })

  const error = await prisma.processLog.count({
    where: { level: "error" },
  })

  return {
    total,
    info,
    warn,
    error,
    levelDistribution: {
      info,
      warn,
      error,
    },
  }
}

// Helper function to get recent logs
async function getRecentLogs() {
  const logs = await prisma.processLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 5,
  })

  return logs.map(log => ({
    id: log.id,
    title: `${log.processName}: ${log.level.toUpperCase()}`,
    description: log.message.length > 60
      ? `${log.message.substring(0, 60)}...`
      : log.message,
    timestamp: log.timestamp,
    icon: getLogLevelIcon(log.level),
    iconColor: getLogLevelColor(log.level),
  }))
}

// Helper function to get log level icon
function getLogLevelIcon(level: string) {
  switch (level) {
    case "info":
      return "info"
    case "warn":
      return "alert-triangle"
    case "error":
      return "alert-circle"
    default:
      return "circle"
  }
}

// Helper function to get log level color
function getLogLevelColor(level: string) {
  switch (level) {
    case "info":
      return "brand"
    case "warn":
      return "warning"
    case "error":
      return "error"
    default:
      return "neutral"
  }
}
