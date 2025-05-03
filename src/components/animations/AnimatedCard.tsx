"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/once-ui/components";
import { useReducedMotion } from "framer-motion";

type CardProps = React.ComponentProps<typeof Card>;

export const AnimatedCard = forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const prefersReducedMotion = useReducedMotion();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 500 
        }}
        whileHover={prefersReducedMotion ? {} : { 
          y: -5, 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
        }}
        style={{ display: "block", width: "100%" }}
      >
        <Card ref={ref} {...props} />
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";
