"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as Form from "@radix-ui/react-form"
import { Button } from "components/Button/Button"
import { signIn } from "next-auth/react"

export function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Here you would typically register the user in your database
      // This is a placeholder - replace with actual API call
      
      // After registration, sign in the user
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Failed to sign in after registration")
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
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create an account</h2>
      </div>

      <Form.Root className="space-y-6" onSubmit={handleSubmit}>
        <Form.Field name="name">
          <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Full name
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="John Doe"
            />
          </Form.Control>
          <Form.Message match="valueMissing" className="mt-1 text-sm text-red-600">
            Please enter your name
          </Form.Message>
        </Form.Field>

        <Form.Field name="email">
          <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email address
          </Form.Label>
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
          <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Password
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </Form.Control>
          <Form.Message match="valueMissing" className="mt-1 text-sm text-red-600">
            Please enter a password
          </Form.Message>
          <Form.Message match="tooShort" className="mt-1 text-sm text-red-600">
            Password must be at least 6 characters
          </Form.Message>
        </Form.Field>

        <Form.Field name="confirmPassword">
          <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Confirm password
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </Form.Control>
          <Form.Message match="valueMissing" className="mt-1 text-sm text-red-600">
            Please confirm your password
          </Form.Message>
        </Form.Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
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
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2