import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import UsersClient from './UsersClient'
import { getAdminClient } from '@/lib/supabase'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const supabase = getAdminClient()
  const { data: users } = await supabase.from('admin_users').select('id, email, created_at').order('created_at')
  const { data: invites } = await supabase.from('admin_invites').select('*').is('accepted_at', null).order('expires_at')

  return <UsersClient users={users ?? []} invites={invites ?? []} />
}
