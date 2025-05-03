"use client"

import { useState, useRef } from "react"
import { Flex, Grid, Text, Heading, Button, Card } from "@/once-ui/components"
import { motion, useMotionValue, useTransform } from "framer-motion"

// Import all our animation components and hooks
import { 
  // Performance provider
  PerformanceProvider,
  usePerformance,
  
  // Preset animations
  PresetAnimation,
  
  // SVG animations
  PathAnimation,
  DrawSVG,
  MorphSVG,
  AnimatedIcon,
  
  // Animation hooks
  useAnimationControls,
  useSequenceAnimation,
  useScrollAnimation,
  useParallax,
  useDragAnimation,
  useSwipeAnimation,
  useTiltAnimation,
  useCountAnimation,
  useDataSeriesAnimation,
  useProgressAnimation,
  
  // Optimized animations
  OptimizedAnimation,
  OptimizedList
} from "@/components/animations/allAnimations"

// SVG paths for demo
const svgPaths = {
  circle: "M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0",
  square: "M10,10 L90,10 L90,90 L10,90 Z",
  triangle: "M50,10 L90,90 L10,90 Z",
  star: "M50,10 L61,35 L90,40 L70,60 L75,90 L50,75 L25,90 L30,60 L10,40 L39,35 Z"
}

// Sample data for charts
const sampleData = [
  { id: 1, value: 10, label: "Jan" },
  { id: 2, value: 25, label: "Feb" },
  { id: 3, value: 15, label: "Mar" },
  { id: 4, value: 30, label: "Apr" },
  { id: 5, value: 20, label: "May" },
  { id: 6, value: 35, label: "Jun" }
]

export default function AdvancedAnimationDemo() {
  // Animation controls demo
  const { start, stop, isAnimating, scope } = useAnimationControls()
  
  // Sequence animation demo
  const { scope: sequenceScope, sequence, isAnimating: isSequencing } = useSequenceAnimation()
  
  // Drag animation demo
  const { ref: dragRef, dragProps } = useDragAnimation({
    axis: "both",
    bounds: { top: -50, left: -50, right: 50, bottom: 50 },
    elastic: 0.5
  })
  
  // Swipe animation demo
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const { ref: swipeRef, swipeProps } = useSwipeAnimation({
    threshold: 50,
    velocity: 0.5,
    direction: "both",
    onSwipe: (direction) => setSwipeDirection(direction)
  })
  
  // Tilt animation demo
  const { ref: tiltRef, style: tiltStyle, handlers: tiltHandlers } = useTiltAnimation({
    max: 15,
    perspective: 1000,
    scale: 1.05
  })
  
  // Count animation demo
  const { value: countValue, formattedValue } = useCountAnimation(1234, {
    duration: 2,
    formatter: (val) => `$${Math.round(val).toLocaleString()}`
  })
  
  // Data series animation demo
  const { animatedData, progress } = useDataSeriesAnimation(sampleData, {
    duration: 1,
    staggerDelay: 0.1,
    valueKey: "value"
  })
  
  // Progress animation demo
  const { style: progressStyle } = useProgressAnimation(75, {
    duration: 1.5,
    min: 0,
    max: 100
  })
  
  // SVG animation state
  const [currentPath, setCurrentPath] = useState<keyof typeof svgPaths>("circle")
  
  // Run animation sequence
  const runSequence = () => {
    sequence([
      [".seq-item-1", { opacity: 1, y: 0 }, { duration: 0.3 }],
      [".seq-item-2", { opacity: 1, y: 0 }, { duration: 0.3 }],
      [".seq-item-3", { opacity: 1, y: 0 }, { duration: 0.3 }],
      [".seq-item-all", { scale: 1.1 }, { duration: 0.2 }],
      [".seq-item-all", { scale: 1 }, { duration: 0.2 }]
    ])
  }
  
  return (
    <PerformanceProvider>
      <Flex direction="column" gap="8">
        <Heading as="h1" size="3xl" weight="bold">Advanced Animation Demo</Heading>
        <Text color="foreground-subtle">This page demonstrates advanced animation capabilities.</Text>
        
        <Grid columns={[1, null, 2]} gap="6">
          {/* Preset Animations */}
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Preset Animations</Heading>
            <Flex direction="column" gap="4">
              <PresetAnimation preset="fadeIn" delay={0.1}>
                <Text>Fade In Preset</Text>
              </PresetAnimation>
              
              <PresetAnimation preset="slideUp" delay={0.2}>
                <Text>Slide Up Preset</Text>
              </PresetAnimation>
              
              <PresetAnimation preset="bounceIn" delay={0.3}>
                <Text>Bounce In Preset</Text>
              </PresetAnimation>
              
              <PresetAnimation preset="flipX" delay={0.4}>
                <Text>Flip X Preset</Text>
              </PresetAnimation>
              
              <PresetAnimation preset="notification" delay={0.5}>
                <Card padding="4" background="brand-alpha-weak">
                  <Text>Notification Preset</Text>
                </Card>
              </PresetAnimation>
            </Flex>
          </Card>
          
          {/* SVG Animations */}
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">SVG Animations</Heading>
            <Flex direction="column" gap="6">
              <Flex direction="column" gap="2">
                <Text weight="medium">Path Animation:</Text>
                <DrawSVG 
                  svgPath={svgPaths.star} 
                  height={100} 
                  pathProps={{
                    stroke: "currentColor",
                    strokeWidth: 2,
                    duration: 2,
                    repeat: true
                  }}
                />
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Morph Animation:</Text>
                <Flex gap="2" marginBottom="2">
                  {(Object.keys(svgPaths) as Array<keyof typeof svgPaths>).map((path) => (
                    <Button 
                      key={path} 
                      variant={currentPath === path ? "primary" : "secondary"}
                      onClick={() => setCurrentPath(path)}
                    >
                      {path}
                    </Button>
                  ))}
                </Flex>
                <MorphSVG
                  paths={Object.values(svgPaths)}
                  pathIndex={Object.keys(svgPaths).indexOf(currentPath)}
                  height={100}
                  stroke="currentColor"
                  strokeWidth={2}
                  autoPlay={false}
                />
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Animated Icons:</Text>
                <Flex gap="6">
                  <AnimatedIcon animate="pulse" size={40} color="brand">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </AnimatedIcon>
                  
                  <AnimatedIcon animate="spin" size={40} color="accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                  </AnimatedIcon>
                  
                  <AnimatedIcon animate="bounce" size={40} color="success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </AnimatedIcon>
                  
                  <AnimatedIcon animate="shake" size={40} color="danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </AnimatedIcon>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          
          {/* Animation Controls */}
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Animation Controls</Heading>
            <Flex direction="column" gap="6">
              <Flex direction="column" gap="2">
                <Text weight="medium">Manual Animation Control:</Text>
                <motion.div
                  ref={scope}
                  initial={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-brand-alpha-weak rounded-lg"
                >
                  <Text>Controlled Animation Element</Text>
                </motion.div>
                <Flex gap="2" marginTop="2">
                  <Button 
                    onClick={() => start({ 
                      animate: { scale: [1, 1.2, 0.8, 1.1, 1], rotate: [0, 10, -10, 5, 0] },
                      transition: { duration: 1 }
                    })}
                    disabled={isAnimating}
                  >
                    Animate
                  </Button>
                  <Button 
                    onClick={stop}
                    variant="secondary"
                    disabled={!isAnimating}
                  >
                    Stop
                  </Button>
                </Flex>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Sequence Animation:</Text>
                <Flex 
                  ref={sequenceScope}
                  direction="column" 
                  gap="2"
                >
                  <motion.div className="seq-item-1 seq-item-all p-4 bg-brand-alpha-weak rounded-lg" initial={{ opacity: 0, y: 20 }}>
                    <Text>Sequence Item 1</Text>
                  </motion.div>
                  <motion.div className="seq-item-2 seq-item-all p-4 bg-accent-alpha-weak rounded-lg" initial={{ opacity: 0, y: 20 }}>
                    <Text>Sequence Item 2</Text>
                  </motion.div>
                  <motion.div className="seq-item-3 seq-item-all p-4 bg-success-alpha-weak rounded-lg" initial={{ opacity: 0, y: 20 }}>
                    <Text>Sequence Item 3</Text>
                  </motion.div>
                </Flex>
                <Button 
                  onClick={runSequence}
                  marginTop="2"
                  disabled={isSequencing}
                >
                  Run Sequence
                </Button>
              </Flex>
            </Flex>
          </Card>
          
          {/* Gesture Animations */}
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Gesture Animations</Heading>
            <Flex direction="column" gap="6">
              <Flex direction="column" gap="2">
                <Text weight="medium">Drag Animation:</Text>
                <Flex justifyContent="center" padding="8">
                  <motion.div
                    ref={dragRef}
                    {...dragProps}
                    className="p-4 bg-brand-alpha-weak rounded-lg cursor-grab active:cursor-grabbing"
                    style={{ width: 150 }}
                  >
                    <Text textAlign="center">Drag Me</Text>
                  </motion.div>
                </Flex>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Swipe Animation:</Text>
                <Flex justifyContent="center" padding="4">
                  <motion.div
                    ref={swipeRef}
                    {...swipeProps}
                    className="p-4 bg-accent-alpha-weak rounded-lg cursor-grab active:cursor-grabbing"
                    style={{ width: 200 }}
                  >
                    <Text textAlign="center">Swipe Me in Any Direction</Text>
                    {swipeDirection && (
                      <Text textAlign="center" size="sm" marginTop="2">
                        Last swipe: <strong>{swipeDirection}</strong>
                      </Text>
                    )}
                  </motion.div>
                </Flex>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Tilt Animation:</Text>
                <Flex justifyContent="center" padding="4">
                  <motion.div
                    ref={tiltRef}
                    style={tiltStyle}
                    {...tiltHandlers}
                    className="p-6 bg-success-alpha-weak rounded-lg"
                  >
                    <Text textAlign="center">Hover Over Me</Text>
                  </motion.div>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          
          {/* Data Animations */}
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Data Animations</Heading>
            <Flex direction="column" gap="6">
              <Flex direction="column" gap="2">
                <Text weight="medium">Counter Animation:</Text>
                <Card padding="6" background="brand-alpha-weak">
                  <Heading size="3xl" textAlign="center">{formattedValue}</Heading>
                </Card>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Chart Animation:</Text>
                <Flex height="150px" alignItems="flex-end" gap="2">
                  {animatedData.map((item) => (
                    <Flex 
                      key={item.id}
                      direction="column"
                      alignItems="center"
                      flex="1"
                    >
                      <Flex 
                        background="accent"
                        width="full"
                        style={{ height: `${(item.value / 35) * 100}%` }}
                        borderRadius="md"
                      />
                      <Text size="xs" marginTop="1">{item.label}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Progress Animation:</Text>
                <Flex 
                  width="full" 
                  height="8" 
                  background="neutral-weak" 
                  borderRadius="full"
                  overflow="hidden"
                >
                  <motion.div
                    style={progressStyle}
                    className="bg-success h-full"
                  />
                </Flex>
                <Text size="sm" textAlign="center">75%</Text>
              </Flex>
            </Flex>
          </Card>
          
          {/* Optimized Animations */}
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Optimized Animations</Heading>
            <Flex direction="column" gap="6">
              <Flex direction="column" gap="2">
                <Text weight="medium">Optimized Animation:</Text>
                <OptimizedAnimation
                  type="slide"
                  className="p-4 bg-brand-alpha-weak rounded-lg"
                >
                  <Text>Performance-optimized animation</Text>
                </OptimizedAnimation>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Optimized List:</Text>
                <OptimizedList
                  items={Array.from({ length: 5 }).map((_, i) => ({ id: i, text: `Item ${i + 1}` }))}
                  renderItem={(item) => (
                    <Text>{item.text}</Text>
                  )}
                  keyExtractor={(item) => item.id}
                  className="flex flex-col gap-2"
                  itemClassName="p-3 bg-accent-alpha-weak rounded-lg"
                />
              </Flex>
              
              <Flex direction="column" gap="2">
                <Text weight="medium">Current Performance Level:</Text>
                <PerformanceDisplay />
              </Flex>
            </Flex>
          </Card>
          
          {/* Scroll Animations */}
          <Card padding="6">
            <Heading as="h2" size="xl" marginBottom="4">Scroll Animations</Heading>
            <Flex direction="column" gap="6">
              <Flex direction="column" gap="2">
                <Text weight="medium">Parallax Effect:</Text>
                <ParallaxDemo />
              </Flex>
            </Flex>
          </Card>
        </Grid>
      </Flex>
    </PerformanceProvider>
  )
}

// Performance display component
function PerformanceDisplay() {
  const { performance, settings } = usePerformance()
  
  return (
    <Card padding="4">
      <Flex direction="column" gap="2">
        <Text>Performance Level: <strong>{performance}</strong></Text>
        <Flex direction="column" gap="1">
          <Text size="sm">Animations Enabled: {settings.enableAnimations ? "Yes" : "No"}</Text>
          <Text size="sm">Parallax Enabled: {settings.enableParallax ? "Yes" : "No"}</Text>
          <Text size="sm">Hover Effects: {settings.enableHoverEffects ? "Yes" : "No"}</Text>
          <Text size="sm">Transition Duration: {settings.transitionDuration}s</Text>
        </Flex>
      </Flex>
    </Card>
  )
}

// Parallax demo component
function ParallaxDemo() {
  const { ref, style } = useParallax({
    speed: 0.5,
    direction: "up"
  })
  
  return (
    <Card height="200px" overflow="hidden" position="relative">
      <motion.div
        ref={ref}
        style={style}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Heading size="2xl">Parallax Effect</Heading>
      </motion.div>
    </Card>
  )
}
