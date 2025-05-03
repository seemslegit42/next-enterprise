"use client"

import { Flex, Text, Icon } from "@/once-ui/components"
import { IconName } from "@/once-ui/icons"
import { motion } from "framer-motion"
import { ScaleIn } from "@/components/animations"

interface StatCardProps {
  title: string
  value: string | number
  icon: IconName
  iconColor?: string
  iconBgColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export function StatCard({
  title,
  value,
  icon,
  iconColor = "brand",
  iconBgColor = "brand-alpha-weak",
  trend,
  description,
}: StatCardProps) {
  return (
    <ScaleIn>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: 0.1
                }}
              >
                <Text as="p" size="2xl" weight="bold">
                  {value}
                </Text>
              </motion.div>
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Flex
                    alignItems="center"
                    gap="1"
                    color={trend.isPositive ? "success" : "error"}
                  >
                    <Icon
                      name={trend.isPositive ? "arrow-up" : "arrow-down"}
                      size="4"
                    />
                    <Text size="sm" weight="medium">
                      {trend.value}%
                    </Text>
                  </Flex>
                </motion.div>
              )}
            </Flex>
          </Flex>
          <motion.div
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              delay: 0.2
            }}
          >
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
          </motion.div>
        </Flex>
        {description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Text size="sm" color="foreground-subtle">
              {description}
            </Text>
          </motion.div>
        )}
      </Flex>
    </ScaleIn>
  )
}
