import { Variants } from "framer-motion";

// Animation preset types
export type AnimationPreset = {
  name: string;
  variants: Variants;
  transition?: {
    duration?: number;
    type?: "tween" | "spring";
    stiffness?: number;
    damping?: number;
    mass?: number;
    delay?: number;
  };
  description: string;
};

// Collection of animation presets
export const animationPresets: Record<string, AnimationPreset> = {
  // Entrance animations
  fadeIn: {
    name: "Fade In",
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    },
    transition: {
      duration: 0.3
    },
    description: "Simple fade in animation"
  },
  slideUp: {
    name: "Slide Up",
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Slide up from below with fade"
  },
  slideDown: {
    name: "Slide Down",
    variants: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Slide down from above with fade"
  },
  slideInRight: {
    name: "Slide In Right",
    variants: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Slide in from the right with fade"
  },
  slideInLeft: {
    name: "Slide In Left",
    variants: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Slide in from the left with fade"
  },
  
  // Scale animations
  scaleIn: {
    name: "Scale In",
    variants: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Scale in with fade"
  },
  scaleOut: {
    name: "Scale Out",
    variants: {
      hidden: { opacity: 0, scale: 1.1 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Scale out with fade"
  },
  
  // 3D animations
  flipX: {
    name: "Flip X",
    variants: {
      hidden: { opacity: 0, rotateX: 90 },
      visible: { opacity: 1, rotateX: 0 },
      exit: { opacity: 0, rotateX: 90 }
    },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    },
    description: "Flip around X axis with fade"
  },
  flipY: {
    name: "Flip Y",
    variants: {
      hidden: { opacity: 0, rotateY: 90 },
      visible: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: 90 }
    },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    },
    description: "Flip around Y axis with fade"
  },
  
  // Bounce animations
  bounceIn: {
    name: "Bounce In",
    variants: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 8,
      mass: 1
    },
    description: "Bounce in from below with fade"
  },
  
  // Stagger animations
  staggerContainer: {
    name: "Stagger Container",
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      },
      exit: { opacity: 0 }
    },
    description: "Container for staggered children animations"
  },
  
  // UI pattern animations
  buttonTap: {
    name: "Button Tap",
    variants: {
      hover: { scale: 1.05 },
      tap: { scale: 0.98 }
    },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    },
    description: "Button hover and tap effect"
  },
  cardHover: {
    name: "Card Hover",
    variants: {
      hover: { 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      },
      tap: { y: -2 }
    },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    },
    description: "Card hover effect with elevation"
  },
  listItem: {
    name: "List Item",
    variants: {
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Subtle animation for list items"
  },
  notification: {
    name: "Notification",
    variants: {
      hidden: { opacity: 0, y: -20, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -20, scale: 0.95 }
    },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    },
    description: "Animation for notifications and toasts"
  },
  modalBackdrop: {
    name: "Modal Backdrop",
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    },
    transition: {
      duration: 0.2
    },
    description: "Fade animation for modal backdrops"
  },
  modalContent: {
    name: "Modal Content",
    variants: {
      hidden: { opacity: 0, scale: 0.9, y: 20 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Animation for modal content"
  },
  drawer: {
    name: "Drawer",
    variants: {
      hidden: { x: "100%" },
      visible: { x: 0 },
      exit: { x: "100%" }
    },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    },
    description: "Animation for drawer/sidebar"
  },
  tabTransition: {
    name: "Tab Transition",
    variants: {
      hidden: { opacity: 0, x: 10 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 }
    },
    transition: {
      duration: 0.3
    },
    description: "Smooth transition between tabs"
  },
  accordionContent: {
    name: "Accordion Content",
    variants: {
      hidden: { opacity: 0, height: 0 },
      visible: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 }
    },
    transition: {
      duration: 0.3
    },
    description: "Animation for accordion content"
  },
  formElement: {
    name: "Form Element",
    variants: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 }
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    },
    description: "Subtle animation for form elements"
  },
  errorShake: {
    name: "Error Shake",
    variants: {
      shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
          duration: 0.5
        }
      }
    },
    description: "Shake animation for error states"
  },
  successPulse: {
    name: "Success Pulse",
    variants: {
      pulse: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.5
        }
      }
    },
    description: "Pulse animation for success states"
  }
};

// Helper function to get a preset by name
export function getPreset(name: keyof typeof animationPresets): AnimationPreset {
  return animationPresets[name];
}

// Helper function to apply a preset to a component
export function applyPreset(name: keyof typeof animationPresets) {
  const preset = getPreset(name);
  return {
    variants: preset.variants,
    transition: preset.transition
  };
}
