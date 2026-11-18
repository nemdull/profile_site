import { useEffect } from 'react'

import { AsciiSky } from '@/components/chrome/AsciiSky'
import { Header } from '@/components/chrome/Header'
import { MeteorLayer } from '@/components/chrome/MeteorLayer'
import { Hero } from '@/components/hero/Hero'
import { PreflightSection } from '@/components/preflight/PreflightSection'
import { Background } from '@/components/sections/Background'
import { Claims } from '@/components/sections/Claims'
import { Contact, Footer } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Patches } from '@/components/sections/Patches'
import { Skills } from '@/components/sections/Skills'
import { Writing } from '@/components/sections/Writing'
import { Works } from '@/components/works/Works'
import { usePreflight } from '@/systems/preflight-context'
import { PreflightProvider } from '@/systems/PreflightProvider'

function Page() {
  const { impact } = usePreflight()

  // #works のような行き先つきの URL で開かれたとき。画面はスクリプトが描くので、
  // ブラウザーが行き先を探す時点ではまだ何も無い。描き終わったここで、あらためて連れていく
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <div className="app" data-impact={impact || undefined}>
      <a href="#main" className="skip-link">
        本文へ移動
      </a>
      <AsciiSky />
      <Header />
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
