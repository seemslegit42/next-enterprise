"use client"

import { ReactNode, useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { usePerformance, getWillChangeProperty } from "./performance"

interface OptimizedAnimationProps {
  children: ReactNode
  type: "fade" | "slide" | "scale" | "rotate" | "parallax"
  delay?: number
  className?: string
  onClick?: () => void
  threshold?: number
  once?: boolean
  duration?: number
}

export function OptimizedAnimation({
  children,
  type,
  delay = 0,
  className,
  onClick,
  threshold = 0.1,
  once = true,
  duration = 0.3
}: OptimizedAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, threshold })
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    return <div className={className} onClick={onClick}>{children}</div>
  }
  
  // Get will-change property for optimization
  const willChange = getWillChangeProperty(type)
  
  // Define animation variants based on type
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -5 },
      visible: { opacity: 1, rotate: 0 }
    },
    parallax: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    }
  }
  
  // Adjust transition based on performance settings
  const transition = {
    duration: settings.transitionDuration,
    delay,
    type: type === "parallax" ? "spring" : "tween",
    stiffness: 300,
    damping: 30
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[type]}
      transition={transition}
      className={className}
      onClick={onClick}
      style={{ willChange: willChange || undefined }}
    >
      {children}
    </motion.div>
  )
}
