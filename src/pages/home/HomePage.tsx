import { Background, Certifications, Contact, Experience, Hero, Skills, Works, Writing } from '@/components/organisms'
import { MainLayout } from '@/components/templates/MainLayout'

export function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Experience />
      <Works />
      <Writing />
      <Skills />
      <Certifications />
      <Background />
      <Contact />
    </MainLayout>
  )
}

export default HomePage
