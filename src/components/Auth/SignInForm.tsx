"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import * as Form from "@radix-ui/react-form"
import { Button } from "components/Button/Button"

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      router.push("/")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
      </div>

      <Form.Root className="space-y-6" onSubmit={handleSubmit}>
        <Form.Field name="email">
          <div className="flex items-center justify-between">
            <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email address
            </Form.Label>
          </div>
          <Form.Control asChild>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </Form.Control>
          <Form.Message match="valueMissing" className="mt-1 text-sm text-red-600">
            Please enter your email
          </Form.Message>
          <Form.Message match="typeMismatch" className="mt-1 text-sm text-red-600">
            Please enter a valid email
          </Form.Message>
        </Form.Field>

        <Form.Field name="password">
          <div className="flex items-center justify-between">
            <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </Form.Label>
          </div>
          <Form.Control asChild>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </Form.Control>
          <Form.Message match="valueMissing" className="mt-1 text-sm text-red-600">
            Please enter your password
          </Form.Message>
        </Form.Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </Form.Root>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <span className="ml-2">Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}