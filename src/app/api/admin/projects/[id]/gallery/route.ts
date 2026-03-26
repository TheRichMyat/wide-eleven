import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminClient, BUCKETS } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const sortOrder = parseInt(formData.get('sort_order') as string || '0')
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const fileName = `${params.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const supabase = getAdminClient()
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.PROJECT_IMAGES)
      .upload(fileName, buffer, { contentType: file.type })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    const path = `${BUCKETS.PROJECT_IMAGES}/${fileName}`
    const { data, error } = await supabase
      .from('project_gallery')
      .insert({ project_id: params.id, image: path, sort_order: sortOrder })
      .select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const galleryId = req.nextUrl.searchParams.get('galleryId')
  if (!galleryId) return NextResponse.json({ error: 'galleryId required' }, { status: 400 })

  const supabase = getAdminClient()
  const { data: img } = await supabase.from('project_gallery').select('image').eq('id', galleryId).single()

  if (img?.image) {
    const storagePath = img.image.replace(`${BUCKETS.PROJECT_IMAGES}/`, '')
    await supabase.storage.from(BUCKETS.PROJECT_IMAGES).remove([storagePath])
  }

  const { error } = await supabase.from('project_gallery').delete().eq('id', galleryId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
