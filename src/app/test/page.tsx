"use client"

import { Flex, Grid, Text, Icon, Background } from "@/once-ui/components"

export default function TestPage() {
  return (
    <Flex direction="column" gap="6" padding="6">
      <Background
        position="absolute"
        mask={{
          cursor: false,
          x: 100,
          y: 0,
          radius: 100,
        }}
        gradient={{
          display: true,
          opacity: 90,
          x: 100,
          y: 60,
          width: 70,
          height: 50,
          tilt: -40,
          colorStart: "accent-background-strong",
          colorEnd: "page-background",
        }}
        dots={{
          display: true,
          opacity: 20,
          size: "2",
          color: "brand-on-background-weak",
        }}
      />
      <Text as="h1" size="3xl" weight="bold">Once UI Test Page</Text>
      <Text color="foreground-subtle">This page tests the Once UI components.</Text>
      
      <Grid columns={[1, 2, 3]} gap="6">
        <Flex
          direction="column"
          padding="6"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
        >
          <Flex gap="4" marginBottom="4">
            <Flex
              width="12"
              height="12"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              background="brand-alpha-weak"
              color="brand"
            >
              <Icon name="check-circle" size="6" />
            </Flex>
            <Flex direction="column">
              <Text as="h2" size="lg" weight="semibold">Card Title</Text>
              <Text color="foreground-subtle">Card description</Text>
            </Flex>
          </Flex>
          <Text>This is a test card using Once UI components.</Text>
        </Flex>
        
        <Flex
          direction="column"
          padding="6"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
        >
          <Flex gap="4" marginBottom="4">
            <Flex
              width="12"
              height="12"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              background="accent-alpha-weak"
              color="accent"
            >
              <Icon name="file-text" size="6" />
            </Flex>
            <Flex direction="column">
              <Text as="h2" size="lg" weight="semibold">Another Card</Text>
              <Text color="foreground-subtle">Another description</Text>
            </Flex>
          </Flex>
          <Text>This is another test card using Once UI components.</Text>
        </Flex>
        
        <Flex
          direction="column"
          padding="6"
          background="surface"
          borderRadius="lg"
          border
          shadow="sm"
        >
          <Flex gap="4" marginBottom="4">
            <Flex
              width="12"
              height="12"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              background="neutral-alpha-weak"
              color="foreground"
            >
              <Icon name="settings" size="6" />
            </Flex>
            <Flex direction="column">
              <Text as="h2" size="lg" weight="semibold">Third Card</Text>
              <Text color="foreground-subtle">Third description</Text>
            </Flex>
          </Flex>
          <Text>This is a third test card using Once UI components.</Text>
        </Flex>
      </Grid>
    </Flex>
  )
}
