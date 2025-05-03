"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Flex, Text, Icon } from "@/once-ui/components"
import { motion, AnimatePresence } from "framer-motion"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "task" | "log" | "user" | "page"
  url: string
  icon: string
}

export function GlobalSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            router.push(results[selectedIndex].url)
            setIsOpen(false)
          }
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, results, selectedIndex, router])

  // Search function
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    setLoading(true)

    // Simulate API call with mock data
    const timer = setTimeout(() => {
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "page-1",
          title: "Dashboard",
          description: "Main dashboard page",
          type: "page",
          url: "/dashboard",
          icon: "home",
        },
        {
          id: "page-2",
          title: "Tasks",
          description: "Manage your tasks",
          type: "page",
          url: "/dashboard/tasks",
          icon: "check-circle",
        },
        {
          id: "page-3",
          title: "Analytics",
          description: "View system analytics",
          type: "page",
          url: "/dashboard/analytics",
          icon: "bar-chart",
        },
        {
          id: "task-1",
          title: "Update user documentation",
          description: "Task: Update the user documentation with new features",
          type: "task",
          url: "/dashboard/tasks/1",
          icon: "file-text",
        },
        {
          id: "task-2",
          title: "Fix login issues",
          description: "Task: Investigate and fix login issues on mobile",
          type: "task",
          url: "/dashboard/tasks/2",
          icon: "alert-triangle",
        },
        {
          id: "log-1",
          title: "System Error",
          description: "Log: Authentication service failed",
          type: "log",
          url: "/dashboard/logs?id=1",
          icon: "alert-circle",
        },
      ]

      // Filter results based on query
      const filteredResults = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      )

      setResults(filteredResults)
      setLoading(false)
      setSelectedIndex(0)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <Flex position="relative" ref={searchRef}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Flex
          as="button"
          alignItems="center"
          gap="2"
          padding="2"
          paddingX="3"
          borderRadius="full"
          background="surface-strong"
          hover={{ background: "neutral-alpha-weak" }}
          transition="colors"
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => {
              inputRef.current?.focus()
            }, 100)
          }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="search" size="4" />
          </motion.div>
          <Text size="sm" color="foreground-subtle" className="hidden sm:block">
            Search...
          </Text>
          <Flex
            padding="1"
            paddingX="2"
            borderRadius="md"
            background="neutral-alpha-weak"
            className="hidden sm:flex"
          >
            <Text size="xs" color="foreground-subtle">
              /
            </Text>
          </Flex>
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
              left: 0,
              right: 0,
              zIndex: 50,
            }}
          >
            <Flex
              width={["full", "96"]}
              direction="column"
              background="surface"
              borderRadius="lg"
              border
              shadow="lg"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Flex padding="3" borderBottom>
                  <Flex
                    as="input"
                    id="global-search"
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    width="full"
                    background="transparent"
                    border="none"
                    outline="none"
                    autoComplete="off"
                  />
                </Flex>
              </motion.div>

              <Flex direction="column" maxHeight="80" overflow="auto">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flex
                        padding="4"
                        justifyContent="center"
                        alignItems="center"
                        gap="2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Icon name="refresh" size="4" />
                        </motion.div>
                        <Text>Searching...</Text>
                      </Flex>
                    </motion.div>
                  ) : results.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flex
                        padding="4"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        gap="2"
                      >
                        {query ? (
                          <>
                            <motion.div
                              initial={{ scale: 0.5 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1, type: "spring" }}
                            >
                              <Icon name="search-x" size="5" color="foreground-subtle" />
                            </motion.div>
                            <Text color="foreground-subtle">No results found</Text>
                          </>
                        ) : (
                          <>
                            <motion.div
                              initial={{ scale: 0.5 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1, type: "spring" }}
                            >
                              <Icon name="search" size="5" color="foreground-subtle" />
                            </motion.div>
                            <Text color="foreground-subtle">
                              Type to search for pages, tasks, and more
                            </Text>
                          </>
                        )}
                      </Flex>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            backgroundColor: selectedIndex === index
                              ? "var(--brand-background-alpha-weak)"
                              : "var(--surface-background)"
                          }}
                          transition={{
                            delay: index * 0.05,
                            type: "spring",
                            damping: 25,
                            stiffness: 500
                          }}
                          whileHover={{
                            backgroundColor: selectedIndex === index
                              ? "var(--brand-background-alpha-weak)"
                              : "var(--neutral-background-alpha-weak)"
                          }}
                        >
                          <Flex
                            padding="3"
                            gap="3"
                            alignItems="center"
                            cursor="pointer"
                            onClick={() => {
                              router.push(result.url)
                              setIsOpen(false)
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Flex
                                width="8"
                                height="8"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                background={
                                  result.type === "task"
                                    ? "brand-alpha-weak"
                                    : result.type === "log"
                                    ? "error-alpha-weak"
                                    : "neutral-alpha-weak"
                                }
                                color={
                                  result.type === "task"
                                    ? "brand"
                                    : result.type === "log"
                                    ? "error"
                                    : "neutral"
                                }
                              >
                                <Icon name={result.icon} size="4" />
                              </Flex>
                            </motion.div>
                            <Flex direction="column" flex="1">
                              <Text weight="medium">{result.title}</Text>
                              <Text size="xs" color="foreground-subtle">
                                {result.description}
                              </Text>
                            </Flex>
                          </Flex>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Flex>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Flex
                  padding="3"
                  borderTop
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Flex gap="2">
                    <Flex
                      padding="1"
                      paddingX="2"
                      borderRadius="md"
                      background="neutral-alpha-weak"
                    >
                      <Text size="xs" color="foreground-subtle">
                        ↑
                      </Text>
                    </Flex>
                    <Flex
                      padding="1"
                      paddingX="2"
                      borderRadius="md"
                      background="neutral-alpha-weak"
                    >
                      <Text size="xs" color="foreground-subtle">
                        ↓
                      </Text>
                    </Flex>
                    <Text size="xs" color="foreground-subtle">
                      to navigate
                    </Text>
                  </Flex>
                  <Flex gap="2">
                    <Flex
                      padding="1"
                      paddingX="2"
                      borderRadius="md"
                      background="neutral-alpha-weak"
                    >
                      <Text size="xs" color="foreground-subtle">
                        Enter
                      </Text>
                    </Flex>
                    <Text size="xs" color="foreground-subtle">
                      to select
                    </Text>
                  </Flex>
                  <Flex gap="2">
                    <Flex
                      padding="1"
                      paddingX="2"
                      borderRadius="md"
                      background="neutral-alpha-weak"
                    >
                      <Text size="xs" color="foreground-subtle">
                        Esc
                      </Text>
                    </Flex>
                    <Text size="xs" color="foreground-subtle">
                      to close
                    </Text>
                  </Flex>
                </Flex>
              </motion.div>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  )
}
