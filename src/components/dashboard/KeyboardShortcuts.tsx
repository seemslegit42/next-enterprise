"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Flex, Text, Icon } from "@/once-ui/components"

// Define keyboard shortcuts
const SHORTCUTS = [
  { key: "g d", description: "Go to Dashboard", action: () => "/dashboard" },
  { key: "g t", description: "Go to Tasks", action: () => "/dashboard/tasks" },
  { key: "g a", description: "Go to Analytics", action: () => "/dashboard/analytics" },
  { key: "g l", description: "Go to Logs", action: () => "/dashboard/logs" },
  { key: "g w", description: "Go to Workflow Logs", action: () => "/dashboard/workflow-logs" },
  { key: "g p", description: "Go to Profile", action: () => "/dashboard/profile" },
  { key: "g s", description: "Go to Settings", action: () => "/dashboard/settings" },
  { key: "?", description: "Show Keyboard Shortcuts", action: () => null },
  { key: "n", description: "Create New Task", action: () => "/dashboard/tasks/new" },
  { key: "/", description: "Focus Search", action: () => null },
]

export function KeyboardShortcuts() {
  const router = useRouter()
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [keys, setKeys] = useState<string[]>([])
  const [keyTimeout, setKeyTimeout] = useState<NodeJS.Timeout | null>(null)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if in input, textarea, or contentEditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }

      // Toggle shortcuts dialog with '?'
      if (e.key === "?") {
        setShowShortcuts((prev) => !prev)
        return
      }

      // Focus search with '/'
      if (e.key === "/" && !showShortcuts) {
        e.preventDefault()
        const searchInput = document.getElementById("global-search")
        if (searchInput) {
          searchInput.focus()
        }
        return
      }

      // Handle navigation shortcuts
      setKeys((prev) => [...prev, e.key.toLowerCase()])

      // Reset keys after a delay
      if (keyTimeout) {
        clearTimeout(keyTimeout)
      }

      const timeout = setTimeout(() => {
        setKeys([])
      }, 1000)

      setKeyTimeout(timeout)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (keyTimeout) {
        clearTimeout(keyTimeout)
      }
    }
  }, [showShortcuts, keyTimeout])

  // Check for matching shortcuts
  useEffect(() => {
    if (keys.length === 0) return

    const keyString = keys.join(" ")

    for (const shortcut of SHORTCUTS) {
      if (keyString.endsWith(shortcut.key)) {
        const destination = shortcut.action()
        if (destination) {
          router.push(destination)
        }
        setKeys([])
        break
      }
    }
  }, [keys, router])

  if (!showShortcuts) return null

  return (
    <Flex
      position="fixed"
      inset="0"
      background="neutral-alpha-strong"
      alignItems="center"
      justifyContent="center"
      zIndex="100"
      onClick={() => setShowShortcuts(false)}
    >
      <Flex
        direction="column"
        width="96"
        maxWidth="90vw"
        maxHeight="90vh"
        background="surface"
        borderRadius="lg"
        border
        shadow="xl"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Flex
          padding="4"
          justifyContent="space-between"
          alignItems="center"
          borderBottom
        >
          <Flex gap="2" alignItems="center">
            <Icon name="keyboard" size="5" />
            <Text as="h2" size="lg" weight="semibold">
              Keyboard Shortcuts
            </Text>
          </Flex>
          <Flex
            as="button"
            padding="2"
            borderRadius="full"
            hover={{ background: "neutral-alpha-weak" }}
            transition="colors"
            onClick={() => setShowShortcuts(false)}
          >
            <Icon name="x" size="5" />
          </Flex>
        </Flex>

        <Flex direction="column" padding="4" gap="4" overflow="auto">
          {SHORTCUTS.map((shortcut) => (
            <Flex
              key={shortcut.key}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>{shortcut.description}</Text>
              <Flex gap="2">
                {shortcut.key.split(" ").map((k, i) => (
                  <Flex
                    key={i}
                    padding="1"
                    paddingX="2"
                    borderRadius="md"
                    background="surface-strong"
                    border
                  >
                    <Text size="sm" weight="medium">
                      {k}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
