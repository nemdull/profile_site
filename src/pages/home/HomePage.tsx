import { MainLayout } from '@/components/templates/MainLayout'
import { Certifications, CommunityShowcase, Contact, Experience, Hero, Projects, Skills, SocialLinks } from '@/components/organisms'

export function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <SocialLinks />
      <Experience />
      <Skills />
      <Certifications />
      <CommunityShowcase />
      <Projects />
      <Contact />
    </MainLayout>
  )
}

export default HomePage
