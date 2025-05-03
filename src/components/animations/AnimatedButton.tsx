"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/once-ui/components";
import { useReducedMotion } from "framer-motion";

type ButtonProps = React.ComponentProps<typeof Button>;

export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const prefersReducedMotion = useReducedMotion();

    return (
      <motion.div
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        style={{ display: "inline-block" }}
      >
        <Button ref={ref} {...props} />
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
