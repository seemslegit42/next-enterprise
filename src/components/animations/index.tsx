"use client"

import { ReactNode, useEffect, useState } from "react"
import { motion, AnimatePresence, Variants, useScroll, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion"

// Fade In Animation
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

// Slide Up Animation
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
}

// Slide In From Right Animation
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 }
  }
}

// Slide In From Left Animation
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

// Scale Animation
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

// Flip Animation
export const flipVariants: Variants = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    rotateX: 90,
    transition: { duration: 0.3 }
  }
}

// Bounce Animation
export const bounceVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 8,
      stiffness: 100,
      mass: 1
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
  }
}

// Staggered Children Animation
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { opacity: 0 }
}

// Fast Staggered Children Animation
export const fastStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  },
  exit: { opacity: 0 }
}

// Animation Components
interface AnimationProps {
  children: ReactNode
  delay?: number
  className?: string
  onClick?: () => void
  as?: keyof JSX.IntrinsicElements
}

export function FadeIn({ children, delay = 0, className, onClick, as = "div" }: AnimationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
      transition={{ delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function SlideUp({ children, delay = 0, className, onClick, as = "div" }: AnimationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={slideUpVariants}
      transition={{ delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function SlideInRight({ children, delay = 0, className, onClick, as = "div" }: AnimationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={slideInRightVariants}
      transition={{ delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function SlideInLeft({ children, delay = 0, className, onClick, as = "div" }: AnimationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={slideInLeftVariants}
      transition={{ delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, className, onClick, as = "div" }: AnimationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={scaleVariants}
      transition={{ delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function FlipIn({ children, delay = 0, className, onClick, as = "div" }: AnimationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={flipVariants}
      transition={{ delay }}
      className={className}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {children}
    </motion.div>
  )
}

export function BounceIn({ children, delay = 0, className, onClick, as = "div" }: AnimationProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={bounceVariants}
      transition={{ delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className }: Omit<AnimationProps, "delay">) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FastStaggerContainer({ children, className }: Omit<AnimationProps, "delay">) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={fastStaggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, onClick }: Omit<AnimationProps, "delay">) {
  return (
    <motion.div
      variants={slideUpVariants}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// Hover and Tap Animations
export function HoverScale({ children, className, onClick }: Omit<AnimationProps, "delay">) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function HoverElevate({ children, className, onClick }: Omit<AnimationProps, "delay">) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// Modal Animation
interface ModalProps extends Omit<AnimationProps, "delay"> {
  isOpen: boolean
  onClose: () => void
}

export function AnimatedModal({ children, isOpen, onClose, className }: ModalProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className={`fixed z-50 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Drawer Animation
interface DrawerProps extends Omit<AnimationProps, "delay"> {
  isOpen: boolean
  onClose: () => void
  position?: "left" | "right" | "top" | "bottom"
}

export function AnimatedDrawer({ children, isOpen, onClose, position = "right", className }: DrawerProps) {
  const prefersReducedMotion = useReducedMotion()

  const variants = {
    left: {
      hidden: { x: "-100%", opacity: prefersReducedMotion ? 0 : 1 },
      visible: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: prefersReducedMotion ? 0 : 1 }
    },
    right: {
      hidden: { x: "100%", opacity: prefersReducedMotion ? 0 : 1 },
      visible: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: prefersReducedMotion ? 0 : 1 }
    },
    top: {
      hidden: { y: "-100%", opacity: prefersReducedMotion ? 0 : 1 },
      visible: { y: 0, opacity: 1 },
      exit: { y: "-100%", opacity: prefersReducedMotion ? 0 : 1 }
    },
    bottom: {
      hidden: { y: "100%", opacity: prefersReducedMotion ? 0 : 1 },
      visible: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: prefersReducedMotion ? 0 : 1 }
    }
  }

  const positionClasses = {
    left: "fixed inset-y-0 left-0 z-50",
    right: "fixed inset-y-0 right-0 z-50",
    top: "fixed inset-x-0 top-0 z-50",
    bottom: "fixed inset-x-0 bottom-0 z-50"
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants[position]}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`${positionClasses[position]} ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Page Transition
interface PageTransitionProps {
  children: ReactNode
  variant?: "fade" | "slide" | "scale" | "none"
  className?: string
}

export function PageTransition({
  children,
  variant = "fade",
  className = "w-full"
}: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion || variant === "none") {
    return <div className={className}>{children}</div>
  }

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
      transition: { duration: 0.3 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.98 },
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      exit={variants[variant].exit}
      transition={variants[variant].transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll-triggered animation
interface ScrollAnimationProps extends AnimationProps {
  threshold?: number
  once?: boolean
}

export function ScrollFadeIn({
  children,
  className,
  threshold = 0.1,
  once = true,
  onClick
}: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, threshold })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function ScrollSlideUp({
  children,
  className,
  threshold = 0.1,
  once = true,
  onClick
}: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, threshold })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      animate={isInView || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, type: "spring", damping: 25, stiffness: 300 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// Animated Counter
interface CounterProps {
  from: number
  to: number
  duration?: number
  className?: string
  formatter?: (value: number) => string
}

export function AnimatedCounter({
  from,
  to,
  duration = 1,
  className,
  formatter = (value) => Math.round(value).toString()
}: CounterProps) {
  const prefersReducedMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(to)
      return
    }

    let startTime: number
    let animationFrame: number

    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const currentValue = from + (to - from) * progress

      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue)
      }
    }

    animationFrame = requestAnimationFrame(updateValue)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [from, to, duration, prefersReducedMotion])

  return (
    <span className={className}>
      {formatter(displayValue)}
    </span>
  )
}

// Parallax effect
interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export function Parallax({
  children,
  speed = 0.5,
  className = "",
  direction = "up"
}: ParallaxProps) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const directionMultiplier = direction === "down" || direction === "right" ? 1 : -1
  const isHorizontal = direction === "left" || direction === "right"

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100 * speed * directionMultiplier]
  )

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100 * speed * directionMultiplier]
  )

  const parallaxStyle = isHorizontal
    ? { x: prefersReducedMotion ? 0 : x }
    : { y: prefersReducedMotion ? 0 : y }

  return (
    <motion.div
      ref={ref}
      style={parallaxStyle}
      className={className}
    >
      {children}
    </motion.div>
  )
}
