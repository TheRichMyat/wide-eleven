import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) return null
  return session
}

// GET /api/admin/projects — list all projects
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, gallery:project_gallery(*)')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/projects — create project
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: body.title,
      short_description: body.short_description,
      description: body.description,
      category: body.category,
      tags: body.tags,
      job_info: body.job_info,
      year: body.year,
      value: body.value ?? 0,
      status: body.status ?? 'draft',
      featured: body.featured ?? false,
      main_image: body.main_image ?? '',
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
