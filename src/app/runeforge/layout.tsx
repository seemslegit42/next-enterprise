import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import { Metadata } from "next"
import { MainLayout } from "../../components/layout/MainLayout"
import { ThemeProvider } from "@/once-ui/components"
import { PageTransitionWrapper } from "@/components/animations/PageTransitionWrapper"
import { PerformanceProvider } from "@/components/animations/performance"
import classNames from "classnames"

import { style, font } from "@/app/resources/config"

export const metadata: Metadata = {
  title: "Runeforge | Grimoire",
  description: "Visual workflow builder for creating and managing automation workflows",
}

export default function RuneforgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={classNames(
          font.primary?.variable,
          font.secondary?.variable,
          font.tertiary?.variable,
          font.code?.variable
        )}
        data-neutral={style.neutral}
        data-brand={style.brand}
        data-accent={style.accent}
        data-border={style.border}
        data-solid={style.solid}
        data-solid-style={style.solidStyle}
        data-surface={style.surface}
        data-transition={style.transition}
        data-scaling={style.scaling}
      >
        <ThemeProvider>
          <PerformanceProvider>
            <MainLayout>
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
            </MainLayout>
          </PerformanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
