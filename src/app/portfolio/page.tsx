import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PortfolioClient from './PortfolioClient'
import { getAllActiveProjects, getProjectCategories, getProjectYears } from '@/lib/queries'

export const revalidate = 3600

export default async function PortfolioPage() {
  const [projects, categories, years] = await Promise.all([
    getAllActiveProjects(),
    getProjectCategories(),
    getProjectYears(),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
        <PortfolioClient
          projects={projects}
          categories={categories}
          years={years}
        />
      </main>
      <Footer />
    </>
  )
}
