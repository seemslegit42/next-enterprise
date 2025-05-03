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
  title: "Dashboard | Grimoire",
  description: "Manage your tasks and view system logs",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-border={style.border}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-surface={style.surface}
      data-transition={style.transition}
      data-scaling={style.scaling}
      className={classNames(
        font.primary.variable,
        font.secondary.variable,
        font.tertiary.variable,
        font.code.variable,
      )}
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <It's not dynamic nor a security issue.>
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  if (theme === 'system') {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
                  } else {
                    root.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <PerformanceProvider>
            <MainLayout>
              <PageTransitionWrapper variant="fade">
                {children}
              </PageTransitionWrapper>
            </MainLayout>
            <div id="portal-root" />
          </PerformanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
