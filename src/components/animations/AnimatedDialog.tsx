"use client";

import React, {
  ReactNode,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useState,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flex, Heading, IconButton, Text } from "@/once-ui/components";
import { useReducedMotion } from "framer-motion";

interface AnimatedDialogProps extends Omit<React.ComponentProps<typeof Flex>, "title"> {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode | string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  base?: boolean;
  stack?: boolean;
  onHeightChange?: (height: number) => void;
  minHeight?: number;
}

// Create a context for stacked dialogs
const AnimatedDialogContext = React.createContext<{
  stackedDialogOpen: boolean;
  setStackedDialogOpen: (open: boolean) => void;
}>({
  stackedDialogOpen: false,
  setStackedDialogOpen: () => {},
});

export const AnimatedDialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [stackedDialogOpen, setStackedDialogOpen] = useState(false);

  return (
    <AnimatedDialogContext.Provider
      value={{
        stackedDialogOpen,
        setStackedDialogOpen,
      }}
    >
      {children}
    </AnimatedDialogContext.Provider>
  );
};

export const AnimatedDialog = forwardRef<HTMLDivElement, AnimatedDialogProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      stack,
      base,
      footer,
      onHeightChange,
      minHeight,
      ...rest
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const { stackedDialogOpen, setStackedDialogOpen } = useContext(AnimatedDialogContext);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
      if (stack) {
        setStackedDialogOpen(isOpen);
      }
    }, [stack, isOpen, setStackedDialogOpen]);

    useEffect(() => {
      if (dialogRef.current && isOpen) {
        const height = dialogRef.current.offsetHeight;
        onHeightChange?.(height);
      }
    }, [isOpen, onHeightChange]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          if (stack || !base) {
            onClose();
          }
        }
      },
      [isOpen, onClose, stack, base],
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
        };
      }
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        // Make everything outside the dialog inert
        document.body.childNodes.forEach((node) => {
          if (node instanceof HTMLElement && node !== document.getElementById("portal-root")) {
            node.inert = true;
          }
        });

        // If this is a stacked dialog, make the base dialog inert too
        if (stack) {
          const dialogs = document.querySelectorAll('[role="dialog"]');
          dialogs.forEach((dialog) => {
            if (dialog instanceof HTMLElement && !dialog.contains(dialogRef.current)) {
              dialog.inert = true;
            }
          });
        }
      } else {
        // If this is a stacked dialog closing, restore interactivity to base dialog
        if (stack) {
          const dialogs = document.querySelectorAll('[role="dialog"]');
          dialogs.forEach((dialog) => {
            if (dialog instanceof HTMLElement) {
              dialog.inert = false;
            }
          });
        } else {
          // If base dialog is closing, restore everything
          document.body.childNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              node.inert = false;
            }
          });
          document.body.style.overflow = "unset";
        }
      }
    }, [isOpen, stack]);

    useEffect(() => {
      if (isOpen && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        firstElement?.focus();
      }
    }, [isOpen]);

    // Portal is only available in the browser
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const content = (
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: base ? 8 : 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--static-space-l)",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget && (stack || !base)) {
                  onClose();
                }
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
            >
              <motion.div
                initial={{ scale: prefersReducedMotion ? 1 : 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: prefersReducedMotion ? 1 : 0.9, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 500 
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: base ? "scale(0.94) translateY(-1.25rem)" : "",
                }}
              >
                <Flex
                  ref={dialogRef}
                  fillWidth
                  shadow="xl"
                  radius="xl"
                  border="neutral-medium"
                  background="neutral-weak"
                  direction="column"
                  tabIndex={-1}
                  style={{
                    maxWidth: "40rem",
                    maxHeight: "100%",
                    minHeight: minHeight ? `${minHeight}px` : undefined,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      const focusableElements = Array.from(
                        dialogRef.current?.querySelectorAll(
                          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                        ) || [],
                      );

                      if (focusableElements.length === 0) return;

                      const firstElement = focusableElements[0] as HTMLElement;
                      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                      if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                      } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                      }
                    }
                  }}
                  {...rest}
                >
                  <Flex
                    as="header"
                    direction="column"
                    paddingX="24"
                    paddingTop="24"
                    paddingBottom="s"
                    gap="4"
                  >
                    <Flex fillWidth horizontal="space-between" gap="8">
                      {typeof title === "string" ? (
                        <Heading id="dialog-title" variant="heading-strong-l">
                          {title}
                        </Heading>
                      ) : (
                        title
                      )}
                      <IconButton
                        icon="close"
                        size="m"
                        variant="tertiary"
                        tooltip="Close"
                        onClick={onClose}
                      />
                    </Flex>
                    {description && (
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {description}
                      </Text>
                    )}
                  </Flex>
                  <Flex
                    as="section"
                    paddingX="24"
                    paddingBottom="24"
                    flex={1}
                    overflowY="auto"
                    direction="column"
                  >
                    {children}
                  </Flex>
                  {footer && (
                    <Flex borderTop="neutral-medium" as="footer" horizontal="end" padding="12" gap="8">
                      {footer}
                    </Flex>
                  )}
                </Flex>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );

    return createPortal(content, document.getElementById("portal-root") || document.body);
  },
);

AnimatedDialog.displayName = "AnimatedDialog";
