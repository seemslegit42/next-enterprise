"use client"

import Link from "next/link"
import { AuthStatus } from "components/Auth/AuthStatus"

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Next Enterprise
          </Link>
          <div className="ml-10 hidden space-x-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/tasks"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Tasks
            </Link>
            <Link
              href="/dashboard/logs"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Logs
            </Link>
          </div>
        </div>
        <div>
          <AuthStatus />
        </div>
      </div>
    </nav>
  )
}
