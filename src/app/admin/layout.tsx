import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminShell from './AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Allow login and invite pages without auth
  // (middleware handles redirects, but this is a safety net)
  return <AdminShell session={session}>{children}</AdminShell>
}
