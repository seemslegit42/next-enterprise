"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { PageTransition } from "./index"

interface PageTransitionWrapperProps {
  children: ReactNode
  variant?: "fade" | "slide" | "scale" | "none"
}

export function PageTransitionWrapper({ 
  children, 
  variant = "fade" 
}: PageTransitionWrapperProps) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)
  
  // Skip animation on first render for better initial load performance
  useEffect(() => {
    setIsFirstRender(false)
  }, [])
  
  return (
    <AnimatePresence mode="wait">
      <PageTransition 
        key={pathname} 
        variant={isFirstRender ? "none" : variant}
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  )
}
