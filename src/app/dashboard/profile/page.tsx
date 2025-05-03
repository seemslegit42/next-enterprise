import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { Flex, Grid, Text, Icon } from "@/once-ui/components"

export const metadata: Metadata = {
  title: "Your Profile | Dashboard",
  description: "View and manage your profile",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard/profile")
  }

  return (
    <Flex direction="column" gap="6">
      <Flex direction="column" gap="2">
        <Text as="h1" size="3xl" weight="bold">Your Profile</Text>
        <Text color="foreground-subtle">
          View and manage your account information
        </Text>
      </Flex>

      <Grid columns={[1, null, 2]} gap="6">
        {/* Profile Information */}
        <Flex
          direction="column"
          padding="6"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
        >
          <Flex gap="4" marginBottom="6">
            <Flex
              width="12"
              height="12"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              background="neutral-alpha-weak"
              color="neutral"
            >
              <Icon name="user" size="6" />
            </Flex>
            <Flex direction="column">
              <Text as="h2" size="lg" weight="semibold">Account Information</Text>
              <Text color="foreground-subtle">Your personal details</Text>
            </Flex>
          </Flex>

          <Flex direction="column" gap="4">
            <Flex direction="column" gap="1">
              <Text size="sm" color="foreground-subtle">Name</Text>
              <Text weight="medium">{session.user?.name || "Not provided"}</Text>
            </Flex>
            <Flex direction="column" gap="1">
              <Text size="sm" color="foreground-subtle">Email</Text>
              <Text weight="medium">{session.user?.email}</Text>
            </Flex>
            <Flex direction="column" gap="1">
              <Text size="sm" color="foreground-subtle">User ID</Text>
              <Text weight="medium">{session.user?.id}</Text>
            </Flex>
          </Flex>
        </Flex>

        {/* Account Security */}
        <Flex
          direction="column"
          padding="6"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
        >
          <Flex gap="4" marginBottom="6">
            <Flex
              width="12"
              height="12"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              background="brand-alpha-weak"
              color="brand"
            >
              <Icon name="shield" size="6" />
            </Flex>
            <Flex direction="column">
              <Text as="h2" size="lg" weight="semibold">Account Security</Text>
              <Text color="foreground-subtle">Manage your security settings</Text>
            </Flex>
          </Flex>

          <Flex direction="column" gap="4">
            <Flex
              as="button"
              alignItems="center"
              justifyContent="center"
              padding="2"
              borderRadius="md"
              background="brand"
              color="on-brand"
              hover={{ background: "brand-strong" }}
              transition="colors"
            >
              Change Password
            </Flex>
            <Flex
              as="button"
              alignItems="center"
              justifyContent="center"
              padding="2"
              borderRadius="md"
              background="surface-strong"
              border
              color="foreground"
              hover={{ background: "neutral-alpha-weak" }}
              transition="colors"
            >
              Manage Account Settings
            </Flex>
          </Flex>
        </Flex>
      </Grid>
    </Flex>
  )
}
