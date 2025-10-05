import './App.css'

import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Experience } from '@/components/experience'
import { Hero } from '@/components/hero'
import { Navigation } from '@/components/navigation'
import { Projects } from '@/components/projects'
import { Skills } from '@/components/skills'
import { SocialLinks } from '@/components/social-links'

function App() {
  return (
    <div className="bg-background text-foreground">
      <Navigation />
      <main className="flex flex-col gap-0 pt-16">
        <Hero />
        <SocialLinks />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}

export default App
