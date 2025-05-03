"use client"

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { usePerformance } from "../performance"

interface MorphSVGProps {
  paths: string[]
  width?: number | string
  height?: number | string
  viewBox?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  duration?: number
  className?: string
  autoPlay?: boolean
  interval?: number
  onPathChange?: (index: number) => void
}

export function MorphSVG({
  paths,
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
  duration = 0.5,
  className,
  autoPlay = true,
  interval = 3000,
  onPathChange
}: MorphSVGProps) {
  const [pathIndex, setPathIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const { settings } = usePerformance()
  
  useEffect(() => {
    if (!autoPlay || !settings.enableAnimations || prefersReducedMotion) return
    
    const timer = setInterval(() => {
      setPathIndex((prev) => {
        const next = (prev + 1) % paths.length
        onPathChange?.(next)
        return next
      })
    }, interval)
    
    return () => clearInterval(timer)
  }, [autoPlay, interval, paths.length, onPathChange, settings.enableAnimations, prefersReducedMotion])
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox={viewBox} 
        className={className}
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={paths[pathIndex]}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={viewBox} 
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <motion.path
        initial={{ d: paths[0] }}
        animate={{ d: paths[pathIndex] }}
        transition={{ 
          duration: duration * settings.transitionDuration,
          ease: "easeInOut"
        }}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

// Helper function to change to next path
export function usePathController(paths: string[]) {
  const [pathIndex, setPathIndex] = useState(0)
  
  const nextPath = () => {
    setPathIndex((prev) => (prev + 1) % paths.length)
  }
  
  const prevPath = () => {
    setPathIndex((prev) => (prev - 1 + paths.length) % paths.length)
  }
  
  const setPath = (index: number) => {
    if (index >= 0 && index < paths.length) {
      setPathIndex(index)
    }
  }
  
  return {
    pathIndex,
    currentPath: paths[pathIndex],
    nextPath,
    prevPath,
    setPath
  }
}
