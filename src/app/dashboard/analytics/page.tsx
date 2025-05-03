import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { Flex, Grid, Text } from "@/once-ui/components"
import { DashboardHeader, AnalyticsCard, ChartCard } from "@/components/dashboard"
import prisma from "../../../lib/prisma"

export const metadata: Metadata = {
  title: "Analytics | Dashboard",
  description: "View system analytics and metrics",
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard/analytics")
  }

  // Fetch analytics data
  const analytics = await getAnalyticsData(session.user.id)

  return (
    <Flex direction="column" gap="6">
      <DashboardHeader
        title="Analytics"
        description="View system metrics and performance"
        icon="bar-chart"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics" },
        ]}
      />

      {/* Key Metrics */}
      <section>
        <Text as="h2" size="xl" weight="semibold" marginBottom="4">
          Key Metrics
        </Text>
        <Grid columns={[1, 2, 4]} gap="6">
          <AnalyticsCard
            title="Task Completion Rate"
            value={`${analytics.taskCompletionRate}%`}
            previousValue={`${analytics.previousTaskCompletionRate}%`}
            percentageChange={analytics.taskCompletionRateChange}
            icon="check-circle"
            timeframe="weekly"
          />
          <AnalyticsCard
            title="Average Completion Time"
            value={`${analytics.avgCompletionTime} days`}
            previousValue={`${analytics.previousAvgCompletionTime} days`}
            percentageChange={analytics.avgCompletionTimeChange}
            icon="clock"
            iconColor="warning"
            iconBgColor="warning-alpha-weak"
            timeframe="weekly"
          />
          <AnalyticsCard
            title="Active Tasks"
            value={analytics.activeTasks}
            previousValue={analytics.previousActiveTasks}
            percentageChange={analytics.activeTasksChange}
            icon="activity"
            iconColor="brand"
            iconBgColor="brand-alpha-weak"
            timeframe="weekly"
          />
          <AnalyticsCard
            title="System Errors"
            value={analytics.errorCount}
            previousValue={analytics.previousErrorCount}
            percentageChange={analytics.errorCountChange}
            icon="alert-triangle"
            iconColor="error"
            iconBgColor="error-alpha-weak"
            timeframe="weekly"
          />
        </Grid>
      </section>

      {/* Charts */}
      <Grid columns={[1, null, 2]} gap="6">
        <ChartCard
          title="Task Status Distribution"
          subtitle="Current distribution of tasks by status"
        >
          <Flex
            direction="column"
            gap="4"
            justifyContent="center"
            alignItems="center"
            height="full"
            padding="4"
          >
            <Flex justifyContent="space-around" width="full">
              {Object.entries(analytics.taskStatusDistribution).map(([status, count]) => (
                <Flex key={status} direction="column" alignItems="center" gap="2">
                  <Flex
                    width="16"
                    height="16"
                    borderRadius="full"
                    background={getStatusColor(status)}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text color="white" weight="bold">{count}</Text>
                  </Flex>
                  <Text size="sm" weight="medium" textTransform="capitalize">{status}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </ChartCard>

        <ChartCard
          title="System Logs by Level"
          subtitle="Distribution of system logs by severity level"
        >
          <Flex
            direction="column"
            gap="4"
            justifyContent="center"
            alignItems="center"
            height="full"
            padding="4"
          >
            <Flex justifyContent="space-around" width="full">
              {Object.entries(analytics.logLevelDistribution).map(([level, count]) => (
                <Flex key={level} direction="column" alignItems="center" gap="2">
                  <Flex
                    width="16"
                    height="16"
                    borderRadius="full"
                    background={getLevelColor(level)}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text color="white" weight="bold">{count}</Text>
                  </Flex>
                  <Text size="sm" weight="medium" textTransform="capitalize">{level}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </ChartCard>
      </Grid>

      {/* Weekly Task Trend */}
      <ChartCard
        title="Weekly Task Activity"
        subtitle="Tasks created and completed over the past week"
      >
        <Flex
          direction="column"
          gap="4"
          justifyContent="center"
          alignItems="center"
          height="full"
          padding="4"
        >
          <Flex justifyContent="space-between" width="full" height="200px" alignItems="flex-end">
            {analytics.weeklyTaskTrend.map((day, index) => (
              <Flex key={index} direction="column" alignItems="center" gap="2" height="full" justifyContent="flex-end">
                <Flex direction="column" gap="1" width="full" alignItems="center">
                  <Flex
                    height={`${(day.completed / analytics.weeklyTaskTrendMax) * 100}%`}
                    width="16"
                    background="success-background-strong"
                    borderTopRadius="md"
                    minHeight="4"
                  />
                  <Flex
                    height={`${(day.created / analytics.weeklyTaskTrendMax) * 100}%`}
                    width="16"
                    background="brand-background-strong"
                    borderTopRadius="md"
                    minHeight="4"
                    marginTop="1"
                  />
                </Flex>
                <Text size="xs">{day.day}</Text>
              </Flex>
            ))}
          </Flex>
          <Flex gap="4" marginTop="2">
            <Flex gap="2" alignItems="center">
              <Flex width="3" height="3" borderRadius="full" background="success-background-strong" />
              <Text size="sm">Completed</Text>
            </Flex>
            <Flex gap="2" alignItems="center">
              <Flex width="3" height="3" borderRadius="full" background="brand-background-strong" />
              <Text size="sm">Created</Text>
            </Flex>
          </Flex>
        </Flex>
      </ChartCard>
    </Flex>
  )
}

// Helper function to get analytics data
async function getAnalyticsData(userId: string) {
  // Task completion rate
  const completedTasks = await prisma.task.count({
    where: {
      assignedTo: userId,
      status: "completed",
    },
  })

  const totalTasks = await prisma.task.count({
    where: {
      assignedTo: userId,
    },
  })

  const taskCompletionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0

  // Previous week data (simulated)
  const previousTaskCompletionRate = taskCompletionRate - 5 + Math.floor(Math.random() * 10)
  const taskCompletionRateChange = taskCompletionRate - previousTaskCompletionRate

  // Active tasks
  const activeTasks = await prisma.task.count({
    where: {
      assignedTo: userId,
      status: {
        in: ["pending", "running"],
      },
    },
  })

  // Previous active tasks (simulated)
  const previousActiveTasks = activeTasks - 2 + Math.floor(Math.random() * 5)
  const activeTasksChange = ((activeTasks - previousActiveTasks) / previousActiveTasks) * 100

  // Error count
  const errorCount = await prisma.processLog.count({
    where: {
      level: "error",
    },
  })

  // Previous error count (simulated)
  const previousErrorCount = errorCount - 1 + Math.floor(Math.random() * 3)
  const errorCountChange = previousErrorCount > 0 
    ? ((errorCount - previousErrorCount) / previousErrorCount) * 100
    : 0

  // Task status distribution
  const pendingCount = await prisma.task.count({
    where: {
      assignedTo: userId,
      status: "pending",
    },
  })

  const runningCount = await prisma.task.count({
    where: {
      assignedTo: userId,
      status: "running",
    },
  })

  const failedCount = await prisma.task.count({
    where: {
      assignedTo: userId,
      status: "failed",
    },
  })

  // Log level distribution
  const infoCount = await prisma.processLog.count({
    where: {
      level: "info",
    },
  })

  const warnCount = await prisma.processLog.count({
    where: {
      level: "warn",
    },
  })

  // Average completion time (simulated)
  const avgCompletionTime = 2.5
  const previousAvgCompletionTime = 3.2
  const avgCompletionTimeChange = ((previousAvgCompletionTime - avgCompletionTime) / previousAvgCompletionTime) * 100

  // Weekly task trend (simulated)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeklyTaskTrend = days.map(day => ({
    day,
    created: Math.floor(Math.random() * 10) + 1,
    completed: Math.floor(Math.random() * 8) + 1,
  }))

  const weeklyTaskTrendMax = Math.max(
    ...weeklyTaskTrend.map(day => Math.max(day.created, day.completed))
  )

  return {
    taskCompletionRate,
    previousTaskCompletionRate,
    taskCompletionRateChange,
    activeTasks,
    previousActiveTasks,
    activeTasksChange,
    errorCount,
    previousErrorCount,
    errorCountChange,
    avgCompletionTime,
    previousAvgCompletionTime,
    avgCompletionTimeChange,
    taskStatusDistribution: {
      pending: pendingCount,
      running: runningCount,
      completed: completedTasks,
      failed: failedCount,
    },
    logLevelDistribution: {
      info: infoCount,
      warn: warnCount,
      error: errorCount,
    },
    weeklyTaskTrend,
    weeklyTaskTrendMax,
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
