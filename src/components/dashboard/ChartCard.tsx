"use client"

import { ReactNode } from "react"
import { Flex, Text } from "@/once-ui/components"
import { motion } from "framer-motion"
import { ScaleIn } from "@/components/animations"

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
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
        <Flex direction="column" marginBottom="4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Text as="h3" size="lg" weight="semibold">
              {title}
            </Text>
          </motion.div>
          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Text size="sm" color="foreground-subtle">
                {subtitle}
              </Text>
            </motion.div>
          )}
        </Flex>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          style={{ flex: 1, overflow: "hidden" }}
        >
          {children}
        </motion.div>
      </Flex>
    </ScaleIn>
  )
}
