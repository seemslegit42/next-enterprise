"use client"

import { useState, useCallback } from "react"
import { useAnimate, AnimationControls, AnimationOptions } from "framer-motion"
import { usePerformance } from "../performance"

interface AnimationControl {
  start: (options?: AnimationOptions) => Promise<void>
  stop: () => void
  isAnimating: boolean
  scope: React.RefObject<HTMLElement>
  controls: AnimationControls
}

export function useAnimationControls(): AnimationControl {
  const [scope, animate] = useAnimate()
  const [isAnimating, setIsAnimating] = useState(false)
  const { settings } = usePerformance()
  
  const start = useCallback(async (options?: AnimationOptions) => {
    if (!settings.enableAnimations) return
    
    setIsAnimating(true)
    await animate(
      scope.current,
      options?.animate || {},
      options?.transition || {}
    )
    setIsAnimating(false)
  }, [animate, scope, settings.enableAnimations])
  
  const stop = useCallback(() => {
    if (scope.current) {
      scope.current.style.animation = 'none'
      setIsAnimating(false)
    }
  }, [scope])
  
  return {
    start,
    stop,
    isAnimating,
    scope,
    controls: { start, stop }
  }
}

// Helper hook for sequence animations
export function useSequenceAnimation() {
  const [scope, animate] = useAnimate()
  const [isAnimating, setIsAnimating] = useState(false)
  const { settings } = usePerformance()
  
  const sequence = useCallback(async (animations: [string, any, any][]) => {
    if (!settings.enableAnimations) return
    
    setIsAnimating(true)
    
    for (const [selector, keyframes, options] of animations) {
      await animate(selector, keyframes, {
        ...options,
        duration: options.duration * settings.transitionDuration
      })
    }
    
    setIsAnimating(false)
  }, [animate, settings.enableAnimations, settings.transitionDuration])
  
  return {
    scope,
    sequence,
    isAnimating
  }
}
