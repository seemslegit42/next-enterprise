"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function AuthStatus() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Sign up
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {session?.user?.name || session?.user?.email}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-md bg-white p-1 shadow-lg dark:bg-gray-800"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item className="flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm text-gray-700 outline-none focus:bg-gray-100 dark:text-gray-200 dark:focus:bg-gray-700">
            <Link href="/dashboard" className="flex w-full items-center">
              Dashboard
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm text-gray-700 outline-none focus:bg-gray-100 dark:text-gray-200 dark:focus:bg-gray-700">
            <Link href="/profile" className="flex w-full items-center">
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-600" />
          <DropdownMenu.Item
            className="flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm text-red-500 outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
            onSelect={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
