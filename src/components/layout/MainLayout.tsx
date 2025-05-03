"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { motion, AnimatePresence } from "framer-motion"

// Import Once UI components
import { Flex, Grid, Text, Icon, IconButton, Background } from "@/once-ui/components"
import { GlobalSearch, NotificationCenter, KeyboardShortcuts } from "@/components/dashboard"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on initial load
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  return (
    <Flex fillHeight>
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <motion.button
          className="fixed left-4 top-4 z-50 flex items-center justify-center w-10 h-10 rounded-md bg-primary-600 text-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sidebarOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Icon name={sidebarOpen ? "x" : "menu"} size="5" />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      )}

      {/* Sidebar */}
      <motion.aside
        className={`flex flex-col w-64 ${isMobile ? 'fixed' : 'relative'} inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800`}
        initial={false}
        animate={{
          x: isMobile && !sidebarOpen ? '-100%' : 0,
          boxShadow: isMobile && sidebarOpen ? '0 0 0 100vw rgba(0,0,0,0.3)' : '0 0 0 0 rgba(0,0,0,0)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* App Logo/Name */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center text-white">
              <span className="text-lg font-bold">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Grimoire
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ScrollArea.Root className="flex-1 w-full">
          <ScrollArea.Viewport className="w-full h-full">
            <Flex
              as="nav"
              direction="column"
              padding="4"
              gap="2"
              flex="1"
            >
              <Text size="sm" weight="semibold" color="foreground-subtle" paddingX="2" paddingY="1">
                MAIN
              </Text>

              <NavItem
                href="/dashboard"
                icon="home"
                label="Dashboard"
                isActive={pathname === "/dashboard"}
              />
              <NavItem
                href="/dashboard/tasks"
                icon="check-circle"
                label="Tasks"
                isActive={pathname === "/dashboard/tasks" || pathname.startsWith("/dashboard/tasks/")}
              />
              <NavItem
                href="/dashboard/logs"
                icon="file-text"
                label="Logs"
                isActive={pathname === "/dashboard/logs" || pathname.startsWith("/dashboard/logs/")}
              />

              <NavItem
                href="/dashboard/workflow-logs"
                icon="activity"
                label="Workflow Logs"
                isActive={pathname === "/dashboard/workflow-logs" || pathname.startsWith("/dashboard/workflow-logs/")}
              />

              <Flex height="1" background="neutral-alpha-weak" marginY="2" />

              <Text size="sm" weight="semibold" color="foreground-subtle" paddingX="2" paddingY="1">
                SETTINGS
              </Text>

              <NavItem
                href="/dashboard/profile"
                icon="user"
                label="Profile"
                isActive={pathname === "/dashboard/profile"}
              />
              <NavItem
                href="/dashboard/settings"
                icon="settings"
                label="Settings"
                isActive={pathname === "/dashboard/settings"}
              />
            </Flex>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-800 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-neutral-300 dark:bg-neutral-700 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className="bg-neutral-300 dark:bg-neutral-700" />
        </ScrollArea.Root>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-900/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-25 pointer-events-none" />

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
          {/* Left side - Page title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {pathname === "/dashboard" && "Dashboard"}
              {pathname === "/dashboard/tasks" && "Tasks"}
              {pathname === "/dashboard/logs" && "Logs"}
              {pathname === "/dashboard/workflow-logs" && "Workflow Logs"}
              {pathname === "/dashboard/profile" && "Profile"}
              {pathname === "/dashboard/settings" && "Settings"}
            </h1>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  <span className="text-sm font-medium">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                  </span>
                </div>
                <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
                  {session?.user?.name || session?.user?.email || "User"}
                </span>
                <Icon name="chevronDown" size="4" className="hidden sm:block text-gray-500" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute top-12 right-0 w-48 flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {session?.user?.name || "User"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {session?.user?.email || ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <UserMenuItem
                        href="/dashboard/profile"
                        icon="user"
                        label="Your Profile"
                      />
                      <UserMenuItem
                        href="/dashboard/settings"
                        icon="settings"
                        label="Settings"
                      />
                      <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />
                      <UserMenuItem
                        href="/auth/signin"
                        icon="log-out"
                        label="Sign Out"
                        onClick={(e) => {
                          e.preventDefault()
                          signOut({ callbackUrl: "/auth/signin" })
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </Flex>
  )
}

interface NavItemProps {
  href: string
  icon: string
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="block">
      <motion.div
        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
          isActive
            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
        }`}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-md ${
            isActive
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          <Icon name={icon} size="5" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </motion.div>
    </Link>
  )
}

interface UserMenuItemProps {
  href: string
  icon: string
  label: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

function UserMenuItem({ href, icon, label, onClick }: UserMenuItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block"
    >
      <div className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
        <Icon name={icon} size="4" />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  )
}
