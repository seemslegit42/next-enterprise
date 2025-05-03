"use client"

import { ReactNode } from "react"
import { Flex, Text, Icon } from "@/once-ui/components"
import { IconName } from "@/once-ui/icons"

export type AnalyticsTimeframe = "daily" | "weekly" | "monthly" | "yearly"

export interface AnalyticsCardProps {
  title: string
  value: string | number
  previousValue?: string | number
  percentageChange?: number
  icon: IconName
  iconColor?: string
  iconBgColor?: string
  timeframe?: AnalyticsTimeframe
  children?: ReactNode
}

export function AnalyticsCard({
  title,
  value,
  previousValue,
  percentageChange,
  icon,
  iconColor = "brand",
  iconBgColor = "brand-alpha-weak",
  timeframe = "daily",
  children,
}: AnalyticsCardProps) {
  const isPositive = percentageChange !== undefined && percentageChange >= 0
  const timeframeText = {
    daily: "since yesterday",
    weekly: "since last week",
    monthly: "since last month",
    yearly: "since last year",
  }

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
      <Flex gap="4" marginBottom="4" justifyContent="space-between">
        <Flex direction="column">
          <Text as="h3" size="md" weight="medium" color="foreground-subtle">
            {title}
          </Text>
          <Flex alignItems="baseline" gap="2">
            <Text as="p" size="2xl" weight="bold">
              {value}
            </Text>
            {percentageChange !== undefined && (
              <Flex
                alignItems="center"
                gap="1"
                color={isPositive ? "success" : "error"}
              >
                <Icon
                  name={isPositive ? "arrow-up" : "arrow-down"}
                  size="4"
                />
                <Text size="sm" weight="medium">
                  {Math.abs(percentageChange)}%
                </Text>
              </Flex>
            )}
          </Flex>
          {previousValue !== undefined && (
            <Text size="xs" color="foreground-subtle">
              Previous: {previousValue} ({timeframeText[timeframe]})
            </Text>
          )}
        </Flex>
        <Flex
          width="12"
          height="12"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
          background={iconBgColor}
          color={iconColor}
        >
          <Icon name={icon} size="6" />
        </Flex>
      </Flex>
      
      {children && (
        <Flex flex="1" marginTop="4">
          {children}
        </Flex>
      )}
    </Flex>
  )
}
