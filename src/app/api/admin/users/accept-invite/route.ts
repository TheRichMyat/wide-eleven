import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, email, password } = await req.json()
  if (!token || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = getAdminClient()

  // Get invite
  const { data: invite, error } = await supabase
    .from('admin_invites')
    .select('*')
    .eq('email', email)
    .is('accepted_at', null)
    .single()

  if (error || !invite) {
    return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })
  }

  // Check expiry
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite has expired' }, { status: 400 })
  }

  // Verify token
  const valid = await bcrypt.compare(token, invite.invite_token_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid invite token' }, { status: 400 })
  }

  // Create admin user
  const passwordHash = await bcrypt.hash(password, 12)
  const { error: createError } = await supabase
    .from('admin_users')
    .insert({ email, password_hash: passwordHash })

  if (createError) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }

  // Mark invite as accepted
  await supabase
    .from('admin_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('email', email)

  return NextResponse.json({ success: true })
}
