"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { usePerformance } from "../performance"

interface PathAnimationProps {
  d: string
  stroke?: string
  strokeWidth?: number
  fill?: string
  duration?: number
  delay?: number
  repeat?: boolean | number
  className?: string
  pathLength?: number
  threshold?: number
  once?: boolean
}

export function PathAnimation({
  d,
  stroke = "currentColor",
  strokeWidth = 2,
  fill = "none",
  duration = 2,
  delay = 0,
  repeat = false,
  className,
  pathLength = 1,
  threshold = 0.1,
  once = true
}: PathAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, threshold })
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    return (
      <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <path
          d={d}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
        />
      </svg>
    )
  }
  
  return (
    <svg 
      ref={ref}
      className={className} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="xMidYMid meet"
    >
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { 
          pathLength: 1, 
          opacity: 1,
          transition: {
            pathLength: {
              duration: duration * settings.transitionDuration,
              delay,
              repeat: repeat ? (typeof repeat === 'number' ? repeat : Infinity) : 0,
              repeatType: "reverse",
              ease: "easeInOut"
            },
            opacity: {
              duration: duration * settings.transitionDuration * 0.3,
              delay
            }
          }
        } : { pathLength: 0, opacity: 0 }}
      />
    </svg>
  )
}

// Helper component for drawing SVG paths
interface DrawSVGProps {
  svgPath: string
  width?: number | string
  height?: number | string
  viewBox?: string
  className?: string
  pathProps?: Omit<PathAnimationProps, 'd'>
}

export function DrawSVG({
  svgPath,
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  className,
  pathProps = {}
}: DrawSVGProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={viewBox} 
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <PathAnimation d={svgPath} {...pathProps} />
    </svg>
  )
}
