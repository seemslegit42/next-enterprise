"use client"

import { useState, useEffect, useRef } from "react"
import { Flex, Text, Icon, IconButton } from "@/once-ui/components"
import { useRealTimeNotifications } from "@/lib/services/websocketService"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationCenterProps {
  userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
  } = useRealTimeNotifications(userId)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "yesterday"
    return `${diffDays}d ago`
  }

  return (
    <Flex position="relative" ref={notificationRef}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Flex
          as="button"
          position="relative"
          alignItems="center"
          justifyContent="center"
          width="10"
          height="10"
          borderRadius="full"
          background="surface-strong"
          hover={{ background: "neutral-alpha-weak" }}
          transition="colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              repeat: unreadCount > 0 ? Infinity : 0,
              repeatDelay: 5
            }}
          >
            <Icon name="bell" size="5" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <Flex
                  width="5"
                  height="5"
                  borderRadius="full"
                  background="error"
                  color="on-error"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Flex>
              </motion.div>
            )}
          </AnimatePresence>
        </Flex>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            style={{
              position: "absolute",
              top: "3rem",
              right: 0,
              width: "20rem",
              maxHeight: "24rem",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            <Flex
              direction="column"
              background="surface"
              borderRadius="lg"
              border
              shadow="lg"
              height="full"
            >
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Flex
                  padding="4"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom
                >
                  <Text weight="semibold">Notifications</Text>
                  {notifications.length > 0 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Flex
                        as="button"
                        padding="1"
                        paddingX="2"
                        borderRadius="md"
                        background="surface-strong"
                        hover={{ background: "neutral-alpha-weak" }}
                        transition="colors"
                        onClick={markAllAsRead}
                      >
                        <Text size="xs">Mark all as read</Text>
                      </Flex>
                    </motion.div>
                  )}
                </Flex>
              </motion.div>

              <Flex direction="column" overflow="auto" maxHeight="80">
                <AnimatePresence mode="wait">
                  {notifications.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flex
                        padding="6"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        gap="2"
                      >
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          <Icon name="bell-off" size="6" color="foreground-subtle" />
                        </motion.div>
                        <Text color="foreground-subtle">No notifications</Text>
                      </Flex>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{
                            delay: index * 0.05,
                            type: "spring",
                            damping: 25,
                            stiffness: 500
                          }}
                          layout
                        >
                          <Flex
                            padding="4"
                            direction="column"
                            gap="1"
                            borderBottom
                            background={notification.read ? "surface" : "brand-alpha-weak"}
                            hover={{ background: "neutral-alpha-weak" }}
                            transition="colors"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Flex justifyContent="space-between" alignItems="center">
                              <Text weight="semibold">{notification.title}</Text>
                              <Flex gap="2" alignItems="center">
                                <Text size="xs" color="foreground-subtle">
                                  {formatTime(notification.timestamp)}
                                </Text>
                                <motion.div
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <IconButton
                                    icon="x"
                                    size="xs"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      clearNotification(notification.id)
                                    }}
                                  />
                                </motion.div>
                              </Flex>
                            </Flex>
                            <Text size="sm">{notification.message}</Text>
                          </Flex>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  )
}
