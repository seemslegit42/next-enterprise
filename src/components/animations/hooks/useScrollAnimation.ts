"use client"

import { useRef, useState, useEffect } from "react"
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { usePerformance, debounceScrollAnimation } from "../performance"

interface ScrollAnimationOptions {
  threshold?: [number, number]
  axis?: "y" | "x"
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
  inputRange?: number[]
  outputRange?: any[]
  debounce?: number
}

export function useScrollAnimation<T = number>(options: ScrollAnimationOptions = {}): {
  ref: React.RefObject<HTMLElement>
  value: MotionValue<T>
  scrollYProgress: MotionValue<number>
  isInView: boolean
} {
  const {
    threshold = [0, 1],
    axis = "y",
    springConfig = { stiffness: 300, damping: 30, mass: 1 },
    inputRange = [0, 1],
    outputRange = [0, 1],
    debounce = 0
  } = options
  
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  const [isInView, setIsInView] = useState(false)
  
  // Get scroll progress
  const { scrollYProgress, scrollXProgress } = useScroll({
    target: ref,
    offset: ["start " + threshold[0], "end " + threshold[1]]
  })
  
  // Choose axis
  const scrollProgress = axis === "y" ? scrollYProgress : scrollXProgress
  
  // Apply spring physics for smoother animation
  const smoothProgress = useSpring(
    scrollProgress,
    {
      stiffness: springConfig.stiffness || 300,
      damping: springConfig.damping || 30,
      mass: springConfig.mass || 1,
      restDelta: 0.001
    }
  )
  
  // Transform scroll progress to desired output range
  const value = useTransform(
    smoothProgress,
    inputRange,
    outputRange
  ) as MotionValue<T>
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    // Return static values if animations are disabled
    return {
      ref,
      value: {
        get: () => outputRange[0],
        set: () => {},
        onChange: () => () => {},
        destroy: () => {}
      } as unknown as MotionValue<T>,
      scrollYProgress,
      isInView
    }
  }
  
  // Check if element is in view
  useEffect(() => {
    if (!ref.current || debounce <= 0) return
    
    const element = ref.current
    const observer = new IntersectionObserver(
      debounceScrollAnimation(([entry]) => {
        setIsInView(entry.isIntersecting)
      }, debounce),
      { threshold: 0.1 }
    )
    
    observer.observe(element)
    
    return () => {
      observer.unobserve(element)
    }
  }, [debounce])
  
  return {
    ref,
    value,
    scrollYProgress,
    isInView
  }
}

// Helper hook for parallax effects
export function useParallax(options: {
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  threshold?: [number, number]
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}) {
  const {
    speed = 0.5,
    direction = "up",
    threshold = [0, 1],
    springConfig = { stiffness: 100, damping: 30, mass: 1 }
  } = options
  
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  
  // Skip parallax based on performance settings
  if (!settings.enableParallax || prefersReducedMotion) {
    return {
      ref: useRef<HTMLElement>(null),
      style: {}
    }
  }
  
  const isHorizontal = direction === "left" || direction === "right"
  const directionMultiplier = direction === "down" || direction === "right" ? 1 : -1
  const outputRange = [0, 100 * speed * directionMultiplier]
  
  const { ref, value } = useScrollAnimation({
    threshold,
    axis: isHorizontal ? "x" : "y",
    springConfig,
    outputRange
  })
  
  return {
    ref,
    style: isHorizontal ? { x: value } : { y: value }
  }
}
