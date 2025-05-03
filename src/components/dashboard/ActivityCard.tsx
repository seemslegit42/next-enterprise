"use client"

import { Flex, Text, Icon } from "@/once-ui/components"
import { IconName } from "@/once-ui/icons"
import { motion } from "framer-motion"
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/animations"

export interface ActivityItem {
  id: string
  title: string
  timestamp: Date | string
  icon?: IconName
  iconColor?: string
  description?: string
}

interface ActivityCardProps {
  title: string
  activities: ActivityItem[]
  viewAllHref?: string
  maxItems?: number
}

export function ActivityCard({
  title,
  activities,
  viewAllHref,
  maxItems = 5,
}: ActivityCardProps) {
  const displayedActivities = activities.slice(0, maxItems)

  return (
    <SlideUp>
      <Flex
        direction="column"
        padding="6"
        background="surface"
        borderRadius="lg"
        border
        shadow="sm"
        height="full"
      >
        <Flex justifyContent="space-between" alignItems="center" marginBottom="4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Text as="h3" size="lg" weight="semibold">
              {title}
            </Text>
          </motion.div>
          {viewAllHref && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ x: 3 }}
            >
              <Flex
                as="a"
                href={viewAllHref}
                alignItems="center"
                gap="1"
                color="brand"
                hover={{ color: "brand-strong" }}
                transition="colors"
              >
                <Text size="sm">View all</Text>
                <Icon name="chevronRight" size="4" />
              </Flex>
            </motion.div>
          )}
        </Flex>

        <Flex direction="column" gap="4">
          {displayedActivities.length > 0 ? (
            <StaggerContainer>
              {displayedActivities.map((activity) => (
                <StaggerItem key={activity.id}>
                  <Flex gap="3" alignItems="flex-start">
                    {activity.icon && (
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Flex
                          width="8"
                          height="8"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="full"
                          background={`${activity.iconColor || "neutral"}-alpha-weak`}
                          color={activity.iconColor || "neutral"}
                          marginTop="1"
                        >
                          <Icon name={activity.icon} size="4" />
                        </Flex>
                      </motion.div>
                    )}
                    <Flex direction="column" gap="1" flex="1">
                      <Text weight="medium">{activity.title}</Text>
                      {activity.description && (
                        <Text size="sm" color="foreground-subtle">
                          {activity.description}
                        </Text>
                      )}
                      <Text size="xs" color="foreground-subtle">
                        {typeof activity.timestamp === "string"
                          ? activity.timestamp
                          : new Date(activity.timestamp).toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Flex
                padding="4"
                borderRadius="md"
                background="neutral-alpha-weak"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="foreground-subtle">No recent activities</Text>
              </Flex>
            </motion.div>
          )}
        </Flex>
      </Flex>
    </SlideUp>
  )
}
