"use client"

import { useState, useEffect } from "react"
import { Flex, Text, Icon, Grid } from "@/once-ui/components"
import { StatCard, ActivityCard, ChartCard } from "@/components/dashboard"

// Widget types
export type WidgetType =
  | "stats"
  | "activity"
  | "chart"
  | "tasks"
  | "logs"
  | "custom"

// Widget size
export type WidgetSize = "small" | "medium" | "large" | "full"

// Widget position
export interface WidgetPosition {
  x: number
  y: number
  w: number
  h: number
}

// Widget configuration
export interface WidgetConfig {
  id: string
  type: WidgetType
  title: string
  size: WidgetSize
  position: WidgetPosition
  data?: any
  settings?: any
}

interface CustomizableDashboardProps {
  userId: string
  initialWidgets?: WidgetConfig[]
}

export function CustomizableDashboard({
  userId,
  initialWidgets = [],
}: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [availableWidgets, setAvailableWidgets] = useState<
    Omit<WidgetConfig, "position">[]
  >([])

  // Load widgets from localStorage or use initialWidgets
  useEffect(() => {
    const savedWidgets = localStorage.getItem(`dashboard-widgets-${userId}`)
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets))
      } catch (error) {
        console.error("Error loading widgets:", error)
        setWidgets(initialWidgets)
      }
    } else {
      setWidgets(initialWidgets)
    }

    // Set available widgets
    setAvailableWidgets([
      {
        id: "stats-tasks",
        type: "stats",
        title: "Task Statistics",
        size: "small",
        data: {
          icon: "check-circle",
          value: "0",
          description: "Total tasks",
        },
      },
      {
        id: "stats-completed",
        type: "stats",
        title: "Completed Tasks",
        size: "small",
        data: {
          icon: "check",
          value: "0",
          description: "Completed tasks",
          iconColor: "success",
          iconBgColor: "success-alpha-weak",
        },
      },
      {
        id: "activity-recent",
        type: "activity",
        title: "Recent Activity",
        size: "medium",
        data: {
          activities: [],
        },
      },
      {
        id: "chart-status",
        type: "chart",
        title: "Task Status",
        size: "medium",
        data: {
          subtitle: "Distribution of tasks by status",
        },
      },
      {
        id: "tasks-pending",
        type: "tasks",
        title: "Pending Tasks",
        size: "large",
        data: {
          status: "pending",
          limit: 5,
        },
      },
      {
        id: "logs-recent",
        type: "logs",
        title: "Recent Logs",
        size: "large",
        data: {
          limit: 5,
        },
      },
    ])
  }, [userId, initialWidgets])

  // Save widgets to localStorage when they change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem(
        `dashboard-widgets-${userId}`,
        JSON.stringify(widgets)
      )
    }
  }, [widgets, userId])

  // Add a widget
  const addWidget = (widget: Omit<WidgetConfig, "position">) => {
    // Find the next available position
    const newPosition = findNextPosition(widget.size)
    
    setWidgets((prev) => [
      ...prev,
      {
        ...widget,
        id: `${widget.id}-${Date.now()}`,
        position: newPosition,
      },
    ])
  }

  // Remove a widget
  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id))
  }

  // Find the next available position for a new widget
  const findNextPosition = (size: WidgetSize): WidgetPosition => {
    // Default sizes
    const sizeMap: Record<WidgetSize, { w: number; h: number }> = {
      small: { w: 1, h: 1 },
      medium: { w: 2, h: 1 },
      large: { w: 2, h: 2 },
      full: { w: 4, h: 2 },
    }

    // Grid is 4 columns wide
    const gridWidth = 4
    
    // Start at the top
    let y = 0
    
    // Find the first available position
    while (true) {
      for (let x = 0; x <= gridWidth - sizeMap[size].w; x++) {
        const position = { x, y, ...sizeMap[size] }
        if (isPositionAvailable(position)) {
          return position
        }
      }
      // Move to the next row
      y++
    }
  }

  // Check if a position is available
  const isPositionAvailable = (position: WidgetPosition): boolean => {
    // Check if any existing widget overlaps with this position
    return !widgets.some((widget) => {
      const { x, y, w, h } = widget.position
      return (
        position.x < x + w &&
        position.x + position.w > x &&
        position.y < y + h &&
        position.y + position.h > y
      )
    })
  }

  // Render a widget based on its type
  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case "stats":
        return (
          <StatCard
            title={widget.title}
            value={widget.data?.value || "0"}
            icon={widget.data?.icon || "circle"}
            iconColor={widget.data?.iconColor}
            iconBgColor={widget.data?.iconBgColor}
            description={widget.data?.description}
          />
        )
      case "activity":
        return (
          <ActivityCard
            title={widget.title}
            activities={widget.data?.activities || []}
            viewAllHref={widget.data?.viewAllHref}
          />
        )
      case "chart":
        return (
          <ChartCard title={widget.title} subtitle={widget.data?.subtitle}>
            <Flex
              justifyContent="center"
              alignItems="center"
              height="full"
              color="foreground-subtle"
            >
              Chart data will be displayed here
            </Flex>
          </ChartCard>
        )
      case "tasks":
        return (
          <Flex
            direction="column"
            padding="6"
            background="surface"
            borderRadius="lg"
            border
            shadow="sm"
            height="full"
          >
            <Text as="h3" size="lg" weight="semibold" marginBottom="4">
              {widget.title}
            </Text>
            <Flex
              justifyContent="center"
              alignItems="center"
              height="full"
              color="foreground-subtle"
            >
              Task list will be displayed here
            </Flex>
          </Flex>
        )
      case "logs":
        return (
          <Flex
            direction="column"
            padding="6"
            background="surface"
            borderRadius="lg"
            border
            shadow="sm"
            height="full"
          >
            <Text as="h3" size="lg" weight="semibold" marginBottom="4">
              {widget.title}
            </Text>
            <Flex
              justifyContent="center"
              alignItems="center"
              height="full"
              color="foreground-subtle"
            >
              Log entries will be displayed here
            </Flex>
          </Flex>
        )
      default:
        return (
          <Flex
            direction="column"
            padding="6"
            background="surface"
            borderRadius="lg"
            border
            shadow="sm"
            height="full"
          >
            <Text as="h3" size="lg" weight="semibold" marginBottom="4">
              {widget.title}
            </Text>
            <Flex
              justifyContent="center"
              alignItems="center"
              height="full"
              color="foreground-subtle"
            >
              Custom widget
            </Flex>
          </Flex>
        )
    }
  }

  return (
    <Flex direction="column" gap="6">
      {/* Dashboard Controls */}
      <Flex justifyContent="space-between" alignItems="center">
        <Text as="h2" size="xl" weight="semibold">
          Your Dashboard
        </Text>
        <Flex gap="2">
          <Flex
            as="button"
            padding="2"
            paddingX="3"
            borderRadius="md"
            background={isEditing ? "brand" : "surface-strong"}
            color={isEditing ? "on-brand" : "foreground"}
            border
            hover={{
              background: isEditing ? "brand-strong" : "neutral-alpha-weak",
            }}
            transition="colors"
            alignItems="center"
            gap="2"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Icon name={isEditing ? "check" : "edit"} size="4" />
            <Text size="sm">{isEditing ? "Done" : "Customize"}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Widget Selection (when editing) */}
      {isEditing && (
        <Flex
          direction="column"
          padding="4"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
          gap="4"
        >
          <Text weight="semibold">Add Widgets</Text>
          <Flex gap="4" flexWrap="wrap">
            {availableWidgets.map((widget) => (
              <Flex
                key={widget.id}
                as="button"
                padding="3"
                borderRadius="md"
                background="surface-strong"
                border
                hover={{ background: "neutral-alpha-weak" }}
                transition="colors"
                alignItems="center"
                gap="2"
                onClick={() => addWidget(widget)}
              >
                <Icon
                  name={
                    widget.type === "stats"
                      ? "bar-chart-2"
                      : widget.type === "activity"
                      ? "activity"
                      : widget.type === "chart"
                      ? "pie-chart"
                      : widget.type === "tasks"
                      ? "check-circle"
                      : widget.type === "logs"
                      ? "file-text"
                      : "layout"
                  }
                  size="4"
                />
                <Text size="sm">{widget.title}</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={`
              ${widget.position.w === 1 ? "col-span-1" : ""}
              ${widget.position.w === 2 ? "col-span-1 md:col-span-2" : ""}
              ${widget.position.w === 3 ? "col-span-1 md:col-span-3" : ""}
              ${widget.position.w === 4 ? "col-span-1 md:col-span-4" : ""}
              ${widget.position.h === 1 ? "row-span-1" : ""}
              ${widget.position.h === 2 ? "row-span-2" : ""}
              relative
            `}
            style={{
              gridColumnStart: isEditing ? undefined : widget.position.x + 1,
              gridRowStart: isEditing ? undefined : widget.position.y + 1,
            }}
          >
            {isEditing && (
              <Flex
                position="absolute"
                top="2"
                right="2"
                zIndex="10"
                gap="1"
              >
                <Flex
                  as="button"
                  width="8"
                  height="8"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  background="error"
                  color="on-error"
                  hover={{ background: "error-strong" }}
                  transition="colors"
                  onClick={() => removeWidget(widget.id)}
                >
                  <Icon name="trash" size="4" />
                </Flex>
              </Flex>
            )}
            {renderWidget(widget)}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <Flex
          direction="column"
          padding="8"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
          alignItems="center"
          justifyContent="center"
          gap="4"
        >
          <Icon name="layout" size="8" color="foreground-subtle" />
          <Text color="foreground-subtle" textAlign="center">
            Your dashboard is empty. Click the Customize button to add widgets.
          </Text>
          {!isEditing && (
            <Flex
              as="button"
              padding="2"
              paddingX="4"
              borderRadius="md"
              background="brand"
              color="on-brand"
              hover={{ background: "brand-strong" }}
              transition="colors"
              onClick={() => setIsEditing(true)}
            >
              <Text>Customize Dashboard</Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  )
}
