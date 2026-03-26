import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase'
import ClientsClient from './ClientsClient'

export default async function AdminClientsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const supabase = getAdminClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('sort_order', { ascending: true })

  return <ClientsClient initialClients={clients ?? []} />
}
