import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase'
import { FolderOpen, Users, Star, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const supabase = getAdminClient()

  const [{ count: totalProjects }, { count: activeProjects }, { count: featuredProjects }, { count: totalClients }] =
    await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('featured', true),
      supabase.from('clients').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    { label: 'Total Projects', value: totalProjects ?? 0, icon: FolderOpen, href: '/admin/dashboard/projects' },
    { label: 'Active Projects', value: activeProjects ?? 0, icon: Eye, href: '/admin/dashboard/projects' },
    { label: 'Featured (Home)', value: featuredProjects ?? 0, icon: Star, href: '/admin/dashboard/projects' },
    { label: 'Clients / Partners', value: totalClients ?? 0, icon: Users, href: '/admin/dashboard/clients' },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Welcome back, {session.user.email}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border p-5 hover:border-[var(--accent)] transition-colors group"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <Icon size={18} className="mb-3 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-muted)' }} />
            <p className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-2xl font-light mb-4" style={{ color: 'var(--text-primary)' }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard/projects?new=true"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            + Add Project
          </Link>
          <Link
            href="/admin/dashboard/clients?new=true"
            className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            + Add Client
          </Link>
          <Link
            href="/admin/dashboard/users"
            className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Invite User
          </Link>
        </div>
      </div>
    </div>
  )
}
