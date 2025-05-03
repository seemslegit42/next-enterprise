"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { applyPreset, animationPresets } from "./presets"

type PresetName = keyof typeof animationPresets

interface PresetAnimationProps {
  children: ReactNode
  preset: PresetName
  delay?: number
  className?: string
  onClick?: () => void
  as?: keyof JSX.IntrinsicElements
  custom?: any
}

export function PresetAnimation({ 
  children, 
  preset, 
  delay = 0, 
  className, 
  onClick, 
  as = "div",
  custom
}: PresetAnimationProps) {
  const prefersReducedMotion = useReducedMotion()
  const { variants, transition } = applyPreset(preset)
  
  const Component = motion[as as keyof typeof motion] as typeof motion.div
  
  return (
    <Component
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      whileHover={variants.hover ? "hover" : undefined}
      whileTap={variants.tap ? "tap" : undefined}
      variants={variants}
      transition={{ ...transition, delay }}
      className={className}
      onClick={onClick}
      custom={custom}
    >
      {children}
    </Component>
  )
}
