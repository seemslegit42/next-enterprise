"use client"

import { useState, useEffect } from "react"
import { Flex, Text, Icon } from "@/once-ui/components"

export function SettingsClient() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [accentColor, setAccentColor] = useState<string>("blue")
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable")

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }

    const savedAccentColor = localStorage.getItem("accentColor")
    if (savedAccentColor) {
      setAccentColor(savedAccentColor)
    }

    const savedDensity = localStorage.getItem("density") as "compact" | "comfortable" | "spacious" | null
    if (savedDensity) {
      setDensity(savedDensity)
    }
  }, [])

  // Update theme when it changes
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.setAttribute("data-theme", isDark ? "dark" : "light")
    } else {
      root.setAttribute("data-theme", theme)
    }
    
    localStorage.setItem("theme", theme)
  }, [theme])

  // Update accent color when it changes
  useEffect(() => {
    localStorage.setItem("accentColor", accentColor)
    // In a real app, you would update CSS variables or classes here
  }, [accentColor])

  // Update density when it changes
  useEffect(() => {
    localStorage.setItem("density", density)
    // In a real app, you would update CSS variables or classes here
  }, [density])

  // Render theme settings
  useEffect(() => {
    const themeContainer = document.getElementById("theme-settings")
    if (themeContainer) {
      const root = document.createElement("div")
      themeContainer.innerHTML = ""
      themeContainer.appendChild(root)
      
      import("react-dom/client").then(({ createRoot }) => {
        const reactRoot = createRoot(root)
        reactRoot.render(
          <Flex gap="4">
            <ThemeOption
              value="light"
              label="Light"
              icon="sun"
              isSelected={theme === "light"}
              onClick={() => setTheme("light")}
            />
            <ThemeOption
              value="dark"
              label="Dark"
              icon="moon"
              isSelected={theme === "dark"}
              onClick={() => setTheme("dark")}
            />
            <ThemeOption
              value="system"
              label="System"
              icon="monitor"
              isSelected={theme === "system"}
              onClick={() => setTheme("system")}
            />
          </Flex>
        )
      })
    }
  }, [theme])

  // Render color settings
  useEffect(() => {
    const colorContainer = document.getElementById("color-settings")
    if (colorContainer) {
      const root = document.createElement("div")
      colorContainer.innerHTML = ""
      colorContainer.appendChild(root)
      
      import("react-dom/client").then(({ createRoot }) => {
        const reactRoot = createRoot(root)
        reactRoot.render(
          <Flex gap="4">
            <ColorOption
              value="blue"
              color="var(--brand-background-strong)"
              isSelected={accentColor === "blue"}
              onClick={() => setAccentColor("blue")}
            />
            <ColorOption
              value="purple"
              color="var(--accent-background-strong)"
              isSelected={accentColor === "purple"}
              onClick={() => setAccentColor("purple")}
            />
            <ColorOption
              value="green"
              color="var(--success-background-strong)"
              isSelected={accentColor === "green"}
              onClick={() => setAccentColor("green")}
            />
            <ColorOption
              value="orange"
              color="var(--warning-background-strong)"
              isSelected={accentColor === "orange"}
              onClick={() => setAccentColor("orange")}
            />
            <ColorOption
              value="red"
              color="var(--error-background-strong)"
              isSelected={accentColor === "red"}
              onClick={() => setAccentColor("red")}
            />
          </Flex>
        )
      })
    }
  }, [accentColor])

  // Render layout settings
  useEffect(() => {
    const layoutContainer = document.getElementById("layout-settings")
    if (layoutContainer) {
      const root = document.createElement("div")
      layoutContainer.innerHTML = ""
      layoutContainer.appendChild(root)
      
      import("react-dom/client").then(({ createRoot }) => {
        const reactRoot = createRoot(root)
        reactRoot.render(
          <Flex gap="4">
            <DensityOption
              value="compact"
              label="Compact"
              isSelected={density === "compact"}
              onClick={() => setDensity("compact")}
            />
            <DensityOption
              value="comfortable"
              label="Comfortable"
              isSelected={density === "comfortable"}
              onClick={() => setDensity("comfortable")}
            />
            <DensityOption
              value="spacious"
              label="Spacious"
              isSelected={density === "spacious"}
              onClick={() => setDensity("spacious")}
            />
          </Flex>
        )
      })
    }
  }, [density])

  return null
}

// Theme Option Component
function ThemeOption({
  value,
  label,
  icon,
  isSelected,
  onClick,
}: {
  value: string
  label: string
  icon: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <Flex
      direction="column"
      alignItems="center"
      gap="2"
      padding="4"
      borderRadius="lg"
      border
      borderColor={isSelected ? "brand" : "neutral-medium"}
      background={isSelected ? "brand-alpha-weak" : "surface"}
      cursor="pointer"
      onClick={onClick}
      hover={{
        borderColor: "brand",
      }}
      transition="all"
    >
      <Flex
        width="10"
        height="10"
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        background={isSelected ? "brand" : "neutral-alpha-weak"}
        color={isSelected ? "on-brand" : "foreground"}
      >
        <Icon name={icon} size="5" />
      </Flex>
      <Text size="sm" weight={isSelected ? "medium" : "normal"}>
        {label}
      </Text>
    </Flex>
  )
}

// Color Option Component
function ColorOption({
  value,
  color,
  isSelected,
  onClick,
}: {
  value: string
  color: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <Flex
      width="10"
      height="10"
      borderRadius="full"
      background={color}
      cursor="pointer"
      onClick={onClick}
      border={isSelected ? "4px solid var(--neutral-border-strong)" : "2px solid var(--neutral-border-medium)"}
      hover={{
        transform: "scale(1.1)",
      }}
      transition="all"
    />
  )
}

// Density Option Component
function DensityOption({
  value,
  label,
  isSelected,
  onClick,
}: {
  value: string
  label: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <Flex
      padding="2"
      paddingX="4"
      borderRadius="md"
      background={isSelected ? "brand" : "surface-strong"}
      color={isSelected ? "on-brand" : "foreground"}
      border
      cursor="pointer"
      onClick={onClick}
      hover={{
        background: isSelected ? "brand" : "neutral-alpha-weak",
      }}
      transition="colors"
    >
      <Text size="sm">{label}</Text>
    </Flex>
  )
}
