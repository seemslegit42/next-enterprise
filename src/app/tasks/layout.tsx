import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tasks | Grimoire',
  description: 'Manage your tasks and assignments',
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
