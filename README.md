# Wide-Eleven Website — Setup & Deployment Guide

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth**: NextAuth (Credentials)
- **Database + Storage**: Supabase
- **Email**: Resend
- **Deployment**: Netlify

---

## Step 1 — Local Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
# Fill in .env.local with your real values (see Step 2–4 below)

# Run dev server
npm run dev
```

Open http://localhost:3000

---

## Step 2 — Supabase Setup

1. Go to https://supabase.com → **New Project**
2. Note your **Project URL** and **API Keys** (Settings → API)
3. Go to **SQL Editor** → paste and run the entire contents of `supabase/migration.sql`
4. Go to **Storage** → Create two buckets:
   - `project-images` → toggle **Public bucket ON**
   - `client-logos` → toggle **Public bucket ON**
5. For each bucket, go to **Policies** → Add policy:
   - **SELECT**: Allow public (`true`)
   - **INSERT/UPDATE/DELETE**: Leave as service-role only (no public policy needed — server handles this)

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Step 3 — Resend Setup (Email)

1. Go to https://resend.com → Sign up free
2. **Add your domain** (or use the sandbox for testing)
3. Go to **API Keys** → Create key
4. Note the **from address** (e.g. `noreply@wide-eleven.com`)

Add to `.env.local`:
```
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@wide-eleven.com
CONTACT_TO_EMAIL=info@wide-eleven.com
```

---

## Step 4 — NextAuth Secret

Generate a random secret:
```bash
openssl rand -base64 32
```

Add to `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
```

---

## Step 5 — First Admin Account

Add to `.env.local`:
```
ADMIN_BOOTSTRAP_EMAIL=admin@wide-eleven.com
ADMIN_BOOTSTRAP_PASSWORD=YourStrongPassword123!
```

On first login at `/admin/login`, the bootstrap account is auto-created in the database.
**Change the password after first login** (or remove the env vars once an account exists).

---

## Step 6 — Seed Demo Data (Optional)

```bash
npm run seed
```

This creates 8 demo projects and 6 demo clients.
You can then replace them via the Admin Panel.

---

## Step 7 — Deploy to Netlify

### A. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/we-website.git
git push -u origin main
```

### B. Connect to Netlify
1. Go to https://netlify.com → **Add new site** → **Import from Git**
2. Choose your GitHub repo
3. Build settings are auto-detected from `netlify.toml`
4. Click **Deploy site**

### C. Set Environment Variables in Netlify
Go to **Site settings → Environment variables** and add ALL variables from `.env.local`:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `NEXTAUTH_URL` | your Netlify URL (e.g. https://wide-eleven.netlify.app) |
| `NEXTAUTH_SECRET` | your secret |
| `RESEND_API_KEY` | your Resend key |
| `RESEND_FROM_EMAIL` | noreply@wide-eleven.com |
| `CONTACT_TO_EMAIL` | info@wide-eleven.com |
| `ADMIN_BOOTSTRAP_EMAIL` | admin@wide-eleven.com |
| `ADMIN_BOOTSTRAP_PASSWORD` | your password |

### D. Custom Domain (Optional)
- Go to **Domain management** in Netlify
- Add your domain and follow DNS instructions

---

## Admin Panel Usage

| URL | Purpose |
|---|---|
| `/admin/login` | Sign in |
| `/admin/dashboard` | Overview stats |
| `/admin/dashboard/projects` | Add/edit/delete projects |
| `/admin/dashboard/clients` | Add/edit/delete partners |
| `/admin/dashboard/users` | Invite new admins |

---

## Adding Your Real Images

1. Go to `/admin/dashboard/projects`
2. Click **Edit** on each project
3. Click **Upload Image** to replace placeholder images
4. Same for client logos at `/admin/dashboard/clients`

---

## File Structure

```
src/
  app/
    page.tsx              ← Home page
    portfolio/
      page.tsx            ← Portfolio listing
      [id]/page.tsx       ← Project detail
    admin/
      login/              ← Admin login
      invite/             ← Accept invite
      dashboard/          ← Admin dashboard
        projects/         ← Projects CRUD
        clients/          ← Clients CRUD
        users/            ← User management
    api/
      auth/               ← NextAuth
      contact/            ← Contact form email
      admin/              ← Protected CRUD APIs
  components/
    public/               ← Public site components
    admin/                ← Admin UI components
  lib/
    supabase.ts           ← Supabase client
    auth.ts               ← NextAuth config
    queries.ts            ← Data fetching
    utils.ts              ← Helpers
  i18n/
    translations.ts       ← EN + TH strings
    context.tsx           ← Language context
  types/
    index.ts              ← TypeScript types
supabase/
  migration.sql           ← Run in Supabase SQL Editor
scripts/
  seed.ts                 ← Demo data seeder
```
