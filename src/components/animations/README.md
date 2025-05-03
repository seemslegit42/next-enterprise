# Framer Motion Animation System

This directory contains a comprehensive animation system built with Framer Motion for the Grimoire application. The system provides a set of reusable animation components and utilities to create consistent and engaging user experiences.

## Animation Components

### Basic Animations

- `FadeIn`: Fades in an element
- `SlideUp`: Slides an element up while fading in
- `SlideInRight`: Slides an element in from the right
- `SlideInLeft`: Slides an element in from the left
- `ScaleIn`: Scales an element in
- `FlipIn`: Flips an element in with a 3D effect
- `BounceIn`: Bounces an element in

### Container Animations

- `StaggerContainer`: Container for staggered animations
- `FastStaggerContainer`: Container for faster staggered animations
- `StaggerItem`: Item to be used within stagger containers

### Hover Animations

- `HoverScale`: Scales an element on hover
- `HoverElevate`: Elevates an element on hover with a shadow effect

### Modal and Drawer Animations

- `AnimatedModal`: A modal with entrance and exit animations
- `AnimatedDrawer`: A drawer that slides in from any direction
- `AnimatedDialog`: An enhanced dialog component with animations

### Page Transitions

- `PageTransition`: Animates page transitions
- `PageTransitionWrapper`: Wrapper for App Router page transitions

### Scroll-Triggered Animations

- `ScrollFadeIn`: Fades in an element when it enters the viewport
- `ScrollSlideUp`: Slides up an element when it enters the viewport

### Utility Animations

- `AnimatedCounter`: Animates counting from one number to another
- `Parallax`: Creates a parallax scrolling effect

### SVG Animations

- `PathAnimation`: Animates SVG path drawing
- `DrawSVG`: Helper component for drawing SVG paths
- `MorphSVG`: Morphs between different SVG paths
- `AnimatedIcon`: Animates SVG icons with various effects

### Preset Animations

- `PresetAnimation`: Component that uses predefined animation presets
- Various presets for common UI patterns (notifications, cards, buttons, etc.)

### Performance-Optimized Animations

- `OptimizedAnimation`: Performance-aware animation component
- `OptimizedList`: Efficiently animates lists with throttling for low-end devices
- `PerformanceProvider`: Context provider for device performance detection

## Enhanced UI Components

- `AnimatedButton`: Button with hover and tap animations
- `AnimatedCard`: Card with entrance and hover animations

## Animation Hooks

### Scroll Animation Hooks

- `useScrollAnimation`: Creates scroll-based animations with spring physics
- `useParallax`: Creates parallax effects based on scroll position

### Gesture Animation Hooks

- `useDragAnimation`: Adds drag functionality with physics
- `useSwipeAnimation`: Detects swipe gestures in different directions
- `useTiltAnimation`: Creates a 3D tilt effect on hover

### Control Animation Hooks

- `useAnimationControls`: Provides manual control over animations
- `useSequenceAnimation`: Runs a sequence of animations in order

### Data Animation Hooks

- `useCountAnimation`: Animates counting from one number to another
- `useDataSeriesAnimation`: Animates data series for charts and graphs
- `useProgressAnimation`: Animates progress bars and loaders

## Usage Examples

### Basic Animation

```tsx
import { FadeIn } from "@/components/animations";

function MyComponent() {
  return (
    <FadeIn delay={0.2}>
      <h1>This will fade in</h1>
    </FadeIn>
  );
}
```

### Preset Animation

```tsx
import { PresetAnimation } from "@/components/animations/allAnimations";

function MyComponent() {
  return (
    <PresetAnimation preset="notification">
      <div>This will animate using the notification preset</div>
    </PresetAnimation>
  );
}
```

### SVG Animation

```tsx
import { DrawSVG } from "@/components/animations/svg";

function MyComponent() {
  return (
    <DrawSVG
      svgPath="M10,10 L90,10 L90,90 L10,90 Z"
      height={100}
      pathProps={{
        stroke: "currentColor",
        strokeWidth: 2,
        duration: 2
      }}
    />
  );
}
```

### Using Animation Hooks

```tsx
import { useTiltAnimation } from "@/components/animations/hooks";

function MyComponent() {
  const { ref, style, handlers } = useTiltAnimation({
    max: 15,
    perspective: 1000
  });

  return (
    <motion.div
      ref={ref}
      style={style}
      {...handlers}
    >
      This element will tilt on hover
    </motion.div>
  );
}
```

### Performance-Optimized Animation

```tsx
import { OptimizedList, PerformanceProvider } from "@/components/animations/allAnimations";

function MyComponent() {
  return (
    <PerformanceProvider>
      <OptimizedList
        items={items}
        renderItem={(item) => <div>{item.name}</div>}
        keyExtractor={(item) => item.id}
      />
    </PerformanceProvider>
  );
}
```

## Accessibility

All animations respect the user's motion preferences through the `prefers-reduced-motion` media query. When a user has requested reduced motion, animations will be minimal or disabled entirely.

## Performance Considerations

The animation system includes built-in performance optimizations:

- Automatic detection of device capabilities
- Throttling of animations on low-end devices
- Strategic use of the `will-change` property
- Reduced animation complexity based on device performance
- Respecting user preferences for reduced motion

## Demo

Visit the `/animation-demo` route to see basic animations in action.
Visit the `/animation-demo/advanced` route to see advanced animations and hooks.
