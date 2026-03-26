import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import Hero from '@/components/public/Hero'
import About from '@/components/public/About'
import Services from '@/components/public/Services'
import HyattSection from '@/components/public/HyattSection'
import FeaturedProjects from '@/components/public/FeaturedProjects'
import PartnersSlideshow from '@/components/public/PartnersSlideshow'
import ContactForm from '@/components/public/ContactForm'
import { getFeaturedProjects, getClients } from '@/lib/queries'

export const revalidate = 3600

export default async function HomePage() {
  const [projects, clients] = await Promise.all([
    getFeaturedProjects(),
    getClients(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <PartnersSlideshow clients={clients} />
        <HyattSection />
        <FeaturedProjects projects={projects} />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
