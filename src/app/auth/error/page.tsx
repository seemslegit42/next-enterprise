import { Metadata } from "next"
import Link from "next/link"
import { Button } from "components/Button/Button"

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "An error occurred during authentication",
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Authentication Error
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          An error occurred during the authentication process.
        </p>
      </div>
      <div className="mt-8 flex justify-center">
        <Button href="/auth/signin">
          Return to Sign In
        </Button>
      </div>
    </div>
  )
}
