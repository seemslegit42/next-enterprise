"use client"

import { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { usePerformance } from "../performance"

interface AnimatedIconProps {
  children: ReactNode
  size?: number | string
  color?: string
  animate?: "pulse" | "spin" | "bounce" | "shake" | "wiggle" | "none"
  duration?: number
  repeat?: boolean | number
  className?: string
  onClick?: () => void
  hoverEffect?: boolean
}

export function AnimatedIcon({
  children,
  size = 24,
  color = "currentColor",
  animate = "none",
  duration = 2,
  repeat = false,
  className = "",
  onClick,
  hoverEffect = true
}: AnimatedIconProps) {
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion || animate === "none") {
    return (
      <div 
        className={className}
        style={{ 
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
          color
        }}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }
  
  // Animation variants
  const animations = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: duration * settings.transitionDuration,
        repeat: repeat ? (typeof repeat === 'number' ? repeat : Infinity) : 0,
        repeatType: "loop"
      }
    },
    spin: {
      rotate: 360,
      transition: {
        duration: duration * settings.transitionDuration,
        repeat: repeat ? (typeof repeat === 'number' ? repeat : Infinity) : 0,
        repeatType: "loop",
        ease: "linear"
      }
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: duration * settings.transitionDuration,
        repeat: repeat ? (typeof repeat === 'number' ? repeat : Infinity) : 0,
        repeatType: "loop"
      }
    },
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: duration * settings.transitionDuration,
        repeat: repeat ? (typeof repeat === 'number' ? repeat : Infinity) : 0,
        repeatType: "loop"
      }
    },
    wiggle: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: duration * settings.transitionDuration,
        repeat: repeat ? (typeof repeat === 'number' ? repeat : Infinity) : 0,
        repeatType: "loop"
      }
    }
  }
  
  // Hover effect
  const hoverVariants = hoverEffect && settings.enableHoverEffects ? {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  } : {}
  
  return (
    <motion.div
      className={className}
      style={{ 
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      animate={animations[animate]}
      whileHover={hoverVariants.hover}
      whileTap={hoverVariants.tap}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
