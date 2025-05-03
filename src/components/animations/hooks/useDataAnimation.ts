"use client"

import { useState, useEffect, useRef } from "react"
import { useSpring, useTransform, MotionValue, useMotionValue } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { usePerformance } from "../performance"

// Hook for animating number changes
export function useCountAnimation(value: number, options: {
  duration?: number
  delay?: number
  formatter?: (value: number) => string
  easing?: (t: number) => number
} = {}) {
  const {
    duration = 1,
    delay = 0,
    formatter = (val) => Math.round(val).toString(),
    easing = (t) => t
  } = options
  
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)
  
  useEffect(() => {
    // Skip animations based on performance settings
    if (!settings.enableAnimations || prefersReducedMotion) {
      setDisplayValue(value)
      return
    }
    
    let startTime: number
    let animationFrame: number
    
    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / (duration * 1000 * settings.transitionDuration), 1)
      const easedProgress = easing(progress)
      
      const currentValue = previousValue.current + (value - previousValue.current) * easedProgress
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue)
      } else {
        previousValue.current = value
      }
    }
    
    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(updateValue)
    }, delay * 1000)
    
    return () => {
      clearTimeout(timeoutId)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [value, duration, delay, settings.enableAnimations, settings.transitionDuration, prefersReducedMotion, easing])
  
  return {
    value: displayValue,
    formattedValue: formatter(displayValue)
  }
}

// Hook for animating data series (charts, graphs)
export function useDataSeriesAnimation<T>(
  data: T[],
  options: {
    duration?: number
    delay?: number
    staggerDelay?: number
    easing?: (t: number) => number
    valueKey?: keyof T
    maxItems?: number
  } = {}
) {
  const {
    duration = 1,
    delay = 0,
    staggerDelay = 0.05,
    easing = (t) => t,
    valueKey,
    maxItems
  } = options
  
  const prefersReducedMotion = useReducedMotion()
  const { settings, performance } = usePerformance()
  const [animatedData, setAnimatedData] = useState<T[]>([])
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Skip animations based on performance settings
    if (!settings.enableAnimations || prefersReducedMotion) {
      setAnimatedData(data)
      setProgress(1)
      return
    }
    
    // Limit number of animated items based on performance
    const limitedData = maxItems && performance !== 'high'
      ? data.slice(0, maxItems)
      : data
    
    let startTime: number
    let animationFrame: number
    
    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const baseProgress = Math.min(elapsed / (duration * 1000 * settings.transitionDuration), 1)
      const easedProgress = easing(baseProgress)
      
      setProgress(easedProgress)
      
      if (valueKey) {
        // Animate specific value in each data item
        setAnimatedData(limitedData.map((item, index) => {
          const itemDelay = index * staggerDelay * settings.staggerDelay
          const itemProgress = Math.max(0, Math.min(1, (easedProgress - itemDelay) * (1 + limitedData.length * staggerDelay) / (1 - itemDelay)))
          
          if (itemProgress <= 0) return item
          
          const originalValue = Number(item[valueKey])
          const animatedValue = originalValue * itemProgress
          
          return {
            ...item,
            [valueKey]: animatedValue
          }
        }))
      } else {
        // Just reveal items progressively
        const visibleCount = Math.ceil(limitedData.length * easedProgress)
        setAnimatedData(limitedData.slice(0, visibleCount))
      }
      
      if (baseProgress < 1) {
        animationFrame = requestAnimationFrame(updateValue)
      } else {
        setAnimatedData(limitedData)
      }
    }
    
    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(updateValue)
    }, delay * 1000)
    
    return () => {
      clearTimeout(timeoutId)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [data, duration, delay, staggerDelay, settings.enableAnimations, settings.transitionDuration, settings.staggerDelay, prefersReducedMotion, easing, valueKey, maxItems, performance])
  
  return {
    animatedData,
    progress,
    isComplete: progress >= 1
  }
}

// Hook for progress bar animation
export function useProgressAnimation(value: number, options: {
  duration?: number
  delay?: number
  min?: number
  max?: number
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
} = {}) {
  const {
    duration = 1,
    delay = 0,
    min = 0,
    max = 100,
    springConfig = { stiffness: 300, damping: 30, mass: 1 }
  } = options
  
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  
  // Normalize value to 0-1 range
  const normalizedValue = (Math.max(min, Math.min(max, value)) - min) / (max - min)
  
  // Create motion value
  const progress = useMotionValue(0)
  
  // Apply spring physics for smoother animation
  const smoothProgress = useSpring(
    progress,
    {
      stiffness: springConfig.stiffness || 300,
      damping: springConfig.damping || 30,
      mass: springConfig.mass || 1,
      restDelta: 0.001
    }
  )
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    progress.set(normalizedValue)
    return {
      progress: smoothProgress,
      style: { width: `${normalizedValue * 100}%` }
    }
  }
  
  // Update progress when value changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      progress.set(normalizedValue)
    }, delay * 1000)
    
    return () => clearTimeout(timeoutId)
  }, [normalizedValue, delay, progress])
  
  // Transform to percentage for styling
  const widthPercentage = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  
  return {
    progress: smoothProgress,
    style: { width: widthPercentage }
  }
}
