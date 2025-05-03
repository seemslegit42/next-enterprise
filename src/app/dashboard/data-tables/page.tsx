import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { Flex, Grid, Text, Icon } from "@/once-ui/components"
import { DashboardHeader } from "@/components/dashboard"
import prisma from "../../../lib/prisma"

export const metadata: Metadata = {
  title: "Data Tables | Dashboard",
  description: "View and manage data tables",
}

export default async function DataTablesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard/data-tables")
  }

  // Get available models (in a real app, this would come from your schema)
  const models = [
    {
      id: "tasks",
      name: "Tasks",
      description: "Manage your tasks and assignments",
      icon: "check-circle",
      color: "brand",
    },
    {
      id: "logs",
      name: "Process Logs",
      description: "View system process logs",
      icon: "file-text",
      color: "accent",
    },
    {
      id: "users",
      name: "Users",
      description: "Manage user accounts",
      icon: "user",
      color: "neutral",
    },
  ]

  return (
    <Flex direction="column" gap="6">
      <DashboardHeader
        title="Data Tables"
        description="View and manage your data"
        icon="table"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Data Tables" },
        ]}
      />

      <Grid columns={[1, 2, 3]} gap="6">
        {models.map((model) => (
          <Flex
            key={model.id}
            as="a"
            href={`/dashboard/data-tables/${model.id}`}
            direction="column"
            padding="6"
            background="surface"
            borderRadius="lg"
            border
            shadow="sm"
            hover={{
              transform: "translateY(-2px)",
              shadow: "md",
            }}
            transition="all"
          >
            <Flex gap="4" marginBottom="4">
              <Flex
                width="12"
                height="12"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                background={`${model.color}-alpha-weak`}
                color={model.color}
              >
                <Icon name={model.icon} size="6" />
              </Flex>
              <Flex direction="column">
                <Text as="h3" size="lg" weight="semibold">
                  {model.name}
                </Text>
                <Text color="foreground-subtle">{model.description}</Text>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  )
}
