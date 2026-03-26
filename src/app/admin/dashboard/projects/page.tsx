import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase'
import ProjectsClient from './ProjectsClient'

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const supabase = getAdminClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  return <ProjectsClient initialProjects={projects ?? []} />
}
