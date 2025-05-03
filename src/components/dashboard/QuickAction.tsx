"use client"

import Link from "next/link"
import { Flex, Text, Icon } from "@/once-ui/components"
import { IconName } from "@/once-ui/icons"
import { motion } from "framer-motion"
import { HoverScale, StaggerItem } from "@/components/animations"

interface QuickActionProps {
  title: string
  description: string
  icon: IconName
  href: string
  iconColor?: string
  iconBgColor?: string
}

export function QuickAction({
  title,
  description,
  icon,
  href,
  iconColor = "brand",
  iconBgColor = "brand-alpha-weak",
}: QuickActionProps) {
  return (
    <StaggerItem>
      <Link href={href} style={{ width: "100%", height: "100%" }}>
        <HoverScale>
          <Flex
            direction="column"
            padding="6"
            background="surface"
            borderRadius="lg"
            border
            shadow="sm"
            height="full"
            transition="all"
          >
            <Flex gap="4" marginBottom="4">
              <motion.div
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: 0.1
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
              <Flex direction="column">
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Text as="h3" size="lg" weight="semibold">
                    {title}
                  </Text>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Text color="foreground-subtle">{description}</Text>
                </motion.div>
              </Flex>
            </Flex>
          </Flex>
        </HoverScale>
      </Link>
    </StaggerItem>
  )
}
