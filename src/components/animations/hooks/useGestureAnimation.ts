"use client"

import { useRef } from "react"
import { useDragControls, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { usePerformance } from "../performance"

interface DragOptions {
  axis?: "x" | "y" | "both"
  bounds?: { top?: number; right?: number; bottom?: number; left?: number } | "parent" | false
  elastic?: number | boolean
  momentum?: boolean
  momentumOptions?: {
    power?: number
    timeConstant?: number
    restDelta?: number
    restSpeed?: number
  }
  dragTransition?: {
    power?: number
    timeConstant?: number
    modifyTarget?: (target: number) => number
  }
}

export function useDragAnimation(options: DragOptions = {}) {
  const {
    axis = "both",
    bounds = false,
    elastic = 0.5,
    momentum = true,
    momentumOptions = {
      power: 0.8,
      timeConstant: 700,
      restDelta: 0.01,
      restSpeed: 0.01
    },
    dragTransition
  } = options
  
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  const controls = useDragControls()
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    return {
      ref: useRef<HTMLElement>(null),
      dragProps: {},
      controls
    }
  }
  
  // Configure drag constraints
  const dragProps = {
    drag: axis === "both" ? true : axis,
    dragControls: controls,
    dragConstraints: bounds,
    dragElastic: elastic,
    dragTransition: momentum ? {
      power: momentumOptions.power || 0.8,
      timeConstant: momentumOptions.timeConstant || 700,
      restDelta: momentumOptions.restDelta || 0.01,
      restSpeed: momentumOptions.restSpeed || 0.01,
      ...dragTransition
    } : dragTransition
  }
  
  const ref = useRef<HTMLElement>(null)
  
  return {
    ref,
    dragProps,
    controls
  }
}

interface SwipeOptions {
  threshold?: number
  velocity?: number
  direction?: "horizontal" | "vertical" | "both"
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void
}

export function useSwipeAnimation(options: SwipeOptions = {}) {
  const {
    threshold = 50,
    velocity = 0.5,
    direction = "horizontal",
    onSwipe
  } = options
  
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  const ref = useRef<HTMLElement>(null)
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    return {
      ref,
      swipeProps: {}
    }
  }
  
  // Configure swipe handlers
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    if (direction === "horizontal" || direction === "both") {
      if (Math.abs(info.offset.x) > threshold && Math.abs(info.velocity.x) > velocity) {
        const swipeDirection = info.offset.x > 0 ? "right" : "left"
        onSwipe?.(swipeDirection)
      }
    }
    
    if (direction === "vertical" || direction === "both") {
      if (Math.abs(info.offset.y) > threshold && Math.abs(info.velocity.y) > velocity) {
        const swipeDirection = info.offset.y > 0 ? "down" : "up"
        onSwipe?.(swipeDirection)
      }
    }
  }
  
  const swipeProps = {
    drag: direction === "horizontal" ? "x" : direction === "vertical" ? "y" : true,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.1,
    onDragEnd: handleDragEnd
  }
  
  return {
    ref,
    swipeProps
  }
}

// Hook for tilt effect
export function useTiltAnimation(options: {
  max?: number
  perspective?: number
  scale?: number
  speed?: number
  axis?: "both" | "x" | "y"
  reset?: boolean
} = {}) {
  const {
    max = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 500,
    axis = "both",
    reset = true
  } = options
  
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  const ref = useRef<HTMLElement>(null)
  
  // Motion values
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scaleValue = useMotionValue(1)
  
  // Spring values for smoother animation
  const springRotateX = useSpring(rotateX, { stiffness: speed, damping: 50 })
  const springRotateY = useSpring(rotateY, { stiffness: speed, damping: 50 })
  const springScale = useSpring(scaleValue, { stiffness: speed, damping: 50 })
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || !settings.enableHoverEffects || prefersReducedMotion) {
    return {
      ref,
      style: {}
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const percentX = mouseX / (rect.width / 2)
    const percentY = mouseY / (rect.height / 2)
    
    const tiltX = axis === "both" || axis === "y" ? percentY * max : 0
    const tiltY = axis === "both" || axis === "x" ? percentX * max * -1 : 0
    
    rotateX.set(tiltX)
    rotateY.set(tiltY)
    scaleValue.set(scale)
  }
  
  const handleMouseLeave = () => {
    if (reset) {
      rotateX.set(0)
      rotateY.set(0)
      scaleValue.set(1)
    }
  }
  
  return {
    ref,
    style: {
      perspective,
      rotateX: springRotateX,
      rotateY: springRotateY,
      scale: springScale,
      transformStyle: "preserve-3d"
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave
    }
  }
}
