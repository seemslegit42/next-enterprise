import { PageTransitionWrapper } from "@/components/animations/PageTransitionWrapper"

export const metadata = {
  title: "Advanced Animation Demo | Grimoire",
  description: "Demonstration of advanced Framer Motion animations",
}

export default function AdvancedAnimationDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageTransitionWrapper variant="fade">
      {children}
    </PageTransitionWrapper>
  )
}
