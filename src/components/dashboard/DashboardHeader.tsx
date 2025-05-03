"use client"

import { ReactNode } from "react"
import { Flex, Text, Icon } from "@/once-ui/components"
import { IconName } from "@/once-ui/icons"
import { motion, useReducedMotion } from "framer-motion"
import { FadeIn } from "@/components/animations"

export interface Breadcrumb {
  label: string
  href?: string
}

interface DashboardHeaderProps {
  title: string
  description?: string
  icon?: IconName
  breadcrumbs?: Breadcrumb[]
  actions?: ReactNode
}

export function DashboardHeader({
  title,
  description,
  icon,
  breadcrumbs,
  actions,
}: DashboardHeaderProps) {
  const prefersReducedMotion = useReducedMotion()

  // Animation variants
  const breadcrumbVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.3,
      },
    }),
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        delay: breadcrumbs ? 0.2 : 0
      }
    }
  }

  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: breadcrumbs ? 0.3 : 0.1
      }
    }
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: 0.1
      }
    }
  }

  const actionsVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        delay: 0.3
      }
    }
  }

  return (
    <FadeIn>
      <Flex direction="column" gap="4" marginBottom="8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Flex gap="2" alignItems="center">
            {breadcrumbs.map((crumb, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate="visible"
                custom={index}
                variants={breadcrumbVariants}
              >
                <Flex gap="2" alignItems="center">
                  {index > 0 && (
                    <Icon name="chevronRight" size="4" color="foreground-subtle" />
                  )}
                  {crumb.href ? (
                    <Text
                      as="a"
                      href={crumb.href}
                      size="sm"
                      color={
                        index === breadcrumbs.length - 1
                          ? "foreground"
                          : "foreground-subtle"
                      }
                      weight={index === breadcrumbs.length - 1 ? "medium" : "normal"}
                    >
                      {crumb.label}
                    </Text>
                  ) : (
                    <Text
                      size="sm"
                      color={
                        index === breadcrumbs.length - 1
                          ? "foreground"
                          : "foreground-subtle"
                      }
                      weight={index === breadcrumbs.length - 1 ? "medium" : "normal"}
                    >
                      {crumb.label}
                    </Text>
                  )}
                </Flex>
              </motion.div>
            ))}
          </Flex>
        )}

        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap="3" alignItems="center">
            {icon && (
              <motion.div
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate="visible"
                variants={iconVariants}
              >
                <Flex
                  width="10"
                  height="10"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="lg"
                  background="brand-alpha-weak"
                  color="brand"
                >
                  <Icon name={icon} size="5" />
                </Flex>
              </motion.div>
            )}
            <Flex direction="column" gap="1">
              <motion.div
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate="visible"
                variants={titleVariants}
              >
                <Text as="h1" size="3xl" weight="bold">
                  {title}
                </Text>
              </motion.div>
              {description && (
                <motion.div
                  initial={prefersReducedMotion ? "visible" : "hidden"}
                  animate="visible"
                  variants={descriptionVariants}
                >
                  <Text color="foreground-subtle">{description}</Text>
                </motion.div>
              )}
            </Flex>
          </Flex>
          {actions && (
            <motion.div
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate="visible"
              variants={actionsVariants}
            >
              <Flex>{actions}</Flex>
            </motion.div>
          )}
        </Flex>
      </Flex>
    </FadeIn>
  )
}
