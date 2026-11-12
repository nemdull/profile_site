import type { ReactNode } from 'react'

import { Footer, Navigation } from '@/components/organisms'

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <a href="#main" className="skip-link">
        本文へ移動
      </a>
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
