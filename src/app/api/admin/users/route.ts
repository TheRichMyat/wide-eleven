import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase'
import { Resend } from 'resend'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST /api/admin/users/invite — send invite
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = getAdminClient()

  // Check if user already exists
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 })

  // Generate token
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = await bcrypt.hash(token, 12)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24h

  await supabase.from('admin_invites').upsert(
    { email, invite_token_hash: tokenHash, expires_at: expiresAt, accepted_at: null },
    { onConflict: 'email' }
  )

  const inviteUrl = `${process.env.NEXTAUTH_URL}/admin/invite?token=${token}&email=${encodeURIComponent(email)}`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@wide-eleven.com',
    to: email,
    subject: 'You\'ve been invited to Wide-Eleven Admin',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #c49a2e;">Admin Invitation</h2>
        <p>You've been invited to manage the Wide-Eleven website.</p>
        <a href="${inviteUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #c49a2e; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Accept Invitation
        </a>
        <p style="color: #999; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
