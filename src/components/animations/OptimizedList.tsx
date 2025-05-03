"use client"

import { ReactNode, useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { usePerformance, throttleAnimations } from "./performance"

interface OptimizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  itemClassName?: string
  keyExtractor: (item: T) => string | number
  threshold?: number
  once?: boolean
}

export function OptimizedList<T>({
  items,
  renderItem,
  className,
  itemClassName,
  keyExtractor,
  threshold = 0.1,
  once = true
}: OptimizedListProps<T>) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, threshold })
  const prefersReducedMotion = useReducedMotion()
  const { performance, settings } = usePerformance()
  
  // Skip animations based on performance settings
  if (!settings.enableAnimations || prefersReducedMotion) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={keyExtractor(item)} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }
  
  // Throttle animations for better performance
  const animatedItems = throttleAnimations(items, performance)
  const shouldAnimate = animatedItems.length < items.length
  
  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: settings.staggerDelay,
        delayChildren: 0.1
      }
    }
  }
  
  // Item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        duration: settings.transitionDuration,
        stiffness: 300,
        damping: 30
      }
    }
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {items.map((item, index) => {
        const key = keyExtractor(item)
        const isAnimated = !shouldAnimate || animatedItems.includes(item)
        
        return (
          <motion.div
            key={key}
            className={itemClassName}
            variants={isAnimated ? itemVariants : undefined}
            initial={isAnimated ? undefined : { opacity: 1 }}
            style={{ willChange: isAnimated ? "opacity, transform" : undefined }}
          >
            {renderItem(item, index)}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
