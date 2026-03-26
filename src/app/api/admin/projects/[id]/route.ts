import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) return null
  return session
}

// PUT /api/admin/projects/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .update({
      title: body.title,
      short_description: body.short_description,
      description: body.description,
      category: body.category,
      tags: body.tags,
      job_info: body.job_info,
      year: body.year,
      value: body.value,
      status: body.status,
      featured: body.featured,
      main_image: body.main_image,
      sort_order: body.sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/admin/projects/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getAdminClient()

  // Delete gallery first
  await supabase.from('project_gallery').delete().eq('project_id', params.id)

  const { error } = await supabase.from('projects').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
