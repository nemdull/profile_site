import type { ReactNode } from 'react'

import { Navigation } from '@/components/organisms'

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="bg-background text-foreground">
      <Navigation />
      <main className="flex flex-col gap-0 pt-16">{children}</main>
    </div>
  )
}
