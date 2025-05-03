import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { Flex, Grid, Text, Icon } from "@/once-ui/components"
import { DashboardHeader } from "@/components/dashboard"
import { SettingsClient } from "./client"

export const metadata: Metadata = {
  title: "Settings | Dashboard",
  description: "Configure your dashboard settings",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard/settings")
  }

  return (
    <Flex direction="column" gap="6">
      <DashboardHeader
        title="Settings"
        description="Configure your dashboard preferences"
        icon="settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings" },
        ]}
      />

      <Grid columns={[1, null, 3]} gap="6">
        {/* Settings Navigation */}
        <Flex
          direction="column"
          padding="6"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
          gap="2"
        >
          <Text as="h3" size="lg" weight="semibold" marginBottom="4">
            Settings
          </Text>
          <SettingsNavItem id="appearance" label="Appearance" icon="palette" isActive />
          <SettingsNavItem id="notifications" label="Notifications" icon="bell" />
          <SettingsNavItem id="security" label="Security" icon="shield" />
          <SettingsNavItem id="integrations" label="Integrations" icon="link" />
          <SettingsNavItem id="advanced" label="Advanced" icon="sliders" />
        </Flex>

        {/* Settings Content */}
        <Flex
          direction="column"
          padding="6"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
          gridColumn={["1", null, "2 / span 2"]}
        >
          <Text as="h3" size="lg" weight="semibold" marginBottom="4">
            Appearance
          </Text>

          <Flex direction="column" gap="6">
            {/* Theme Settings */}
            <Flex direction="column" gap="2">
              <Text weight="medium">Theme</Text>
              <Text size="sm" color="foreground-subtle" marginBottom="2">
                Choose your preferred theme mode
              </Text>

              <div id="theme-settings"></div>
            </Flex>

            {/* Color Settings */}
            <Flex direction="column" gap="2">
              <Text weight="medium">Accent Color</Text>
              <Text size="sm" color="foreground-subtle" marginBottom="2">
                Choose your preferred accent color
              </Text>

              <div id="color-settings"></div>
            </Flex>

            {/* Layout Settings */}
            <Flex direction="column" gap="2">
              <Text weight="medium">Layout Density</Text>
              <Text size="sm" color="foreground-subtle" marginBottom="2">
                Adjust the spacing between elements
              </Text>

              <div id="layout-settings"></div>
            </Flex>

            <SettingsClient />
          </Flex>
        </Flex>
      </Grid>
    </Flex>
  )
}

// Settings Navigation Item Component
function SettingsNavItem({
  id,
  label,
  icon,
  isActive = false
}: {
  id: string
  label: string
  icon: string
  isActive?: boolean
}) {
  return (
    <Flex
      as="a"
      href={`#${id}`}
      alignItems="center"
      gap="3"
      padding="2"
      borderRadius="lg"
      background={isActive ? "brand-alpha-weak" : "transparent"}
      color={isActive ? "brand" : "foreground"}
      hover={{
        background: isActive ? "brand-alpha-weak" : "neutral-alpha-weak",
      }}
      transition="colors"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        width="8"
        height="8"
        borderRadius="md"
        background={isActive ? "brand-alpha-weak" : "neutral-alpha-weak"}
      >
        <Icon name={icon} size="5" />
      </Flex>
      <Text>{label}</Text>
    </Flex>
  )
}
