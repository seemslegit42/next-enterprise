"use client"

import { useState } from "react"
import { Flex, Grid, Text, Heading, Button, Card } from "@/once-ui/components"
import {
  FadeIn,
  SlideUp,
  SlideInRight,
  SlideInLeft,
  ScaleIn,
  FlipIn,
  BounceIn,
  StaggerContainer,
  StaggerItem,
  HoverScale,
  HoverElevate,
  AnimatedModal,
  AnimatedDrawer,
  ScrollFadeIn,
  ScrollSlideUp,
  AnimatedCounter,
  Parallax
} from "@/components/animations"
import { AnimatedButton, AnimatedCard, AnimatedDialog } from "@/components/animations/components"

export default function AnimationDemoPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPosition, setDrawerPosition] = useState<"left" | "right" | "top" | "bottom">("right")

  return (
    <Flex direction="column" gap="8">
      <FadeIn>
        <Heading as="h1" size="3xl" weight="bold">Animation Demo</Heading>
        <Text color="foreground-subtle">This page demonstrates all the animation capabilities.</Text>
        <Flex marginTop="4">
          <Button as="a" href="/animation-demo/advanced" variant="primary">
            View Advanced Animations
          </Button>
        </Flex>
      </FadeIn>

      <Grid columns={[1, null, 2]} gap="6">
        <SlideUp delay={0.1}>
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Basic Animations</Heading>
            <Flex direction="column" gap="4">
              <FadeIn delay={0.2}>
                <Text>FadeIn Animation</Text>
              </FadeIn>
              <SlideUp delay={0.3}>
                <Text>SlideUp Animation</Text>
              </SlideUp>
              <SlideInRight delay={0.4}>
                <Text>SlideInRight Animation</Text>
              </SlideInRight>
              <SlideInLeft delay={0.5}>
                <Text>SlideInLeft Animation</Text>
              </SlideInLeft>
              <ScaleIn delay={0.6}>
                <Text>ScaleIn Animation</Text>
              </ScaleIn>
              <FlipIn delay={0.7}>
                <Text>FlipIn Animation</Text>
              </FlipIn>
              <BounceIn delay={0.8}>
                <Text>BounceIn Animation</Text>
              </BounceIn>
            </Flex>
          </Card>
        </SlideUp>

        <SlideUp delay={0.2}>
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Staggered Animations</Heading>
            <StaggerContainer>
              {Array.from({ length: 5 }).map((_, i) => (
                <StaggerItem key={i}>
                  <Card padding="4" marginBottom="2">
                    <Text>Staggered Item {i + 1}</Text>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Card>
        </SlideUp>

        <SlideUp delay={0.3}>
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Hover Animations</Heading>
            <Flex direction="column" gap="4">
              <HoverScale>
                <Card padding="4">
                  <Text>Hover Scale Effect</Text>
                </Card>
              </HoverScale>
              <HoverElevate>
                <Card padding="4">
                  <Text>Hover Elevate Effect</Text>
                </Card>
              </HoverElevate>
            </Flex>
          </Card>
        </SlideUp>

        <SlideUp delay={0.4}>
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Modal & Drawer</Heading>
            <Flex direction="column" gap="4">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              <Flex direction="column" gap="2">
                <Text weight="medium">Drawer Position:</Text>
                <Flex gap="2" wrap="wrap">
                  {(["left", "right", "top", "bottom"] as const).map((position) => (
                    <Button
                      key={position}
                      variant={drawerPosition === position ? "primary" : "secondary"}
                      onClick={() => setDrawerPosition(position)}
                    >
                      {position}
                    </Button>
                  ))}
                </Flex>
                <Button onClick={() => setDrawerOpen(true)} marginTop="2">Open Drawer</Button>
              </Flex>
            </Flex>
          </Card>
        </SlideUp>

        <SlideUp delay={0.5}>
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Scroll Animations</Heading>
            <Flex direction="column" gap="8">
              <ScrollFadeIn>
                <Card padding="4">
                  <Text>Scroll Fade In</Text>
                </Card>
              </ScrollFadeIn>
              <ScrollSlideUp>
                <Card padding="4">
                  <Text>Scroll Slide Up</Text>
                </Card>
              </ScrollSlideUp>
            </Flex>
          </Card>
        </SlideUp>

        <SlideUp delay={0.6}>
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Animated Components</Heading>
            <Flex direction="column" gap="4">
              <AnimatedButton>Animated Button</AnimatedButton>
              <AnimatedCard padding="4">
                <Text>Animated Card</Text>
              </AnimatedCard>
            </Flex>
          </Card>
        </SlideUp>

        <SlideUp delay={0.7}>
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Utility Animations</Heading>
            <Flex direction="column" gap="4">
              <Card padding="4">
                <Text>Counter Animation: </Text>
                <AnimatedCounter
                  from={0}
                  to={1000}
                  duration={2}
                  formatter={(value) => `$${Math.round(value).toLocaleString()}`}
                />
              </Card>
              <Card padding="4" height="200px" overflow="hidden">
                <Parallax speed={0.5} direction="up">
                  <Text>Parallax Effect (Scroll the page)</Text>
                </Parallax>
              </Card>
            </Flex>
          </Card>
        </SlideUp>
      </Grid>

      {/* Modal */}
      <AnimatedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
      >
        <Flex direction="column" padding="6">
          <Heading as="h3" size="xl" marginBottom="4">Animated Modal</Heading>
          <Text marginBottom="4">This is an animated modal with smooth transitions.</Text>
          <Button onClick={() => setModalOpen(false)}>Close Modal</Button>
        </Flex>
      </AnimatedModal>

      {/* Dialog */}
      <AnimatedDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Animated Dialog"
        description="This is an animated dialog with smooth transitions."
        footer={
          <Button onClick={() => setDialogOpen(false)}>Close Dialog</Button>
        }
      >
        <Text>This dialog uses Framer Motion for smooth animations.</Text>
      </AnimatedDialog>

      {/* Drawer */}
      <AnimatedDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position={drawerPosition}
        className="bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <Flex direction="column" gap="4">
          <Heading as="h3" size="xl">Animated Drawer</Heading>
          <Text>This drawer slides in from the {drawerPosition}.</Text>
          <Button onClick={() => setDrawerOpen(false)}>Close Drawer</Button>
        </Flex>
      </AnimatedDrawer>
    </Flex>
  )
}
