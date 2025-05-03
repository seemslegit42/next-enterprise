// Performance optimization utilities for animations

// Device performance detection
export type DevicePerformance = 'low' | 'medium' | 'high'

// Function to detect device performance
export function detectDevicePerformance(): DevicePerformance {
  if (typeof window === 'undefined') return 'medium' // Default for SSR
  
  // Check for battery API
  const hasBattery = 'getBattery' in navigator
  
  // Check for device memory API
  const lowMemory = 'deviceMemory' in navigator && 
    // @ts-ignore - deviceMemory is not in the standard navigator type
    (navigator.deviceMemory as number) < 4
  
  // Check for hardware concurrency (CPU cores)
  const lowCPU = 'hardwareConcurrency' in navigator && 
    navigator.hardwareConcurrency < 4
  
  // Check for connection type
  const slowConnection = 'connection' in navigator && 
    // @ts-ignore - connection is not in the standard navigator type
    ['slow-2g', '2g', '3g'].includes((navigator.connection as any)?.effectiveType)
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // Determine performance level
  if (prefersReducedMotion || (lowMemory && lowCPU) || (hasBattery && slowConnection && (lowMemory || lowCPU))) {
    return 'low'
  } else if (lowMemory || lowCPU || slowConnection) {
    return 'medium'
  } else {
    return 'high'
  }
}

// Animation settings based on device performance
export const performanceSettings = {
  low: {
    enableAnimations: false,
    enableParallax: false,
    enableHoverEffects: false,
    staggerDelay: 0,
    transitionDuration: 0.1,
    maxAnimatedElements: 5
  },
  medium: {
    enableAnimations: true,
    enableParallax: false,
    enableHoverEffects: true,
    staggerDelay: 0.05,
    transitionDuration: 0.2,
    maxAnimatedElements: 20
  },
  high: {
    enableAnimations: true,
    enableParallax: true,
    enableHoverEffects: true,
    staggerDelay: 0.1,
    transitionDuration: 0.3,
    maxAnimatedElements: 100
  }
}

// Animation throttling for lists
export function throttleAnimations<T>(items: T[], performance: DevicePerformance): T[] {
  const { maxAnimatedElements } = performanceSettings[performance]
  
  if (items.length <= maxAnimatedElements) {
    return items
  }
  
  // For low-end devices, only animate a subset of items
  const step = Math.ceil(items.length / maxAnimatedElements)
  return items.filter((_, index) => index % step === 0).slice(0, maxAnimatedElements)
}

// Will-change optimization
export function getWillChangeProperty(animationType: string): string | null {
  switch (animationType) {
    case 'fade':
      return 'opacity'
    case 'slide':
    case 'slideUp':
    case 'slideDown':
      return 'transform, opacity'
    case 'scale':
      return 'transform, opacity'
    case 'rotate':
      return 'transform'
    case 'parallax':
      return 'transform'
    default:
      return null // No will-change to avoid unnecessary promotion to GPU
  }
}

// Animation debouncing for scroll events
let scrollDebounceTimer: number | null = null

export function debounceScrollAnimation(callback: () => void, delay: number = 100): () => void {
  return () => {
    if (scrollDebounceTimer) {
      window.clearTimeout(scrollDebounceTimer)
    }
    
    scrollDebounceTimer = window.setTimeout(() => {
      callback()
      scrollDebounceTimer = null
    }, delay)
  }
}

// Create a performance context to be used throughout the app
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface PerformanceContextType {
  performance: DevicePerformance
  settings: typeof performanceSettings.high
}

const defaultContext: PerformanceContextType = {
  performance: 'medium',
  settings: performanceSettings.medium
}

export const PerformanceContext = createContext<PerformanceContextType>(defaultContext)

export function usePerformance() {
  return useContext(PerformanceContext)
}

interface PerformanceProviderProps {
  children: ReactNode
  initialPerformance?: DevicePerformance
}

export function PerformanceProvider({ 
  children, 
  initialPerformance = 'medium' 
}: PerformanceProviderProps) {
  const [performance, setPerformance] = useState<DevicePerformance>(initialPerformance)
  
  useEffect(() => {
    // Detect device performance on client side
    if (typeof window !== 'undefined') {
      const detectedPerformance = detectDevicePerformance()
      setPerformance(detectedPerformance)
    }
  }, [])
  
  const value = {
    performance,
    settings: performanceSettings[performance]
  }
  
  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  )
}
