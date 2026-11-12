import { Hero } from '@/components/hero/Hero'
import { PreflightSection } from '@/components/preflight/PreflightSection'
import { Background } from '@/components/sections/Background'
import { Claims } from '@/components/sections/Claims'
import { Contact, Footer } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Patches } from '@/components/sections/Patches'
import { Skills } from '@/components/sections/Skills'
import { Writing } from '@/components/sections/Writing'
import { Hud } from '@/components/space/Hud'
import { MeteorLayer } from '@/components/space/MeteorLayer'
import { Starfield } from '@/components/space/Starfield'
import { Works } from '@/components/works/Works'
import { usePreflight } from '@/systems/preflight-context'
import { PreflightProvider } from '@/systems/PreflightProvider'

function Page() {
  const { impact } = usePreflight()

  return (
    <div className="app" data-impact={impact || undefined}>
      <a href="#main" className="skip-link">
        本文へ移動
      </a>
      <Starfield />
      <Hud />
      <main id="main">
        <Hero />
        <PreflightSection />
        <Claims />
        <Experience />
        <Works />
        <Writing />
        <Skills />
        <Patches />
        <Background />
        <Contact />
      </main>
      <Footer />
      <MeteorLayer />
    </div>
  )
}

export default function App() {
  return (
    <PreflightProvider>
      <Page />
    </PreflightProvider>
  )
}
