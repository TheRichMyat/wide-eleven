-- ============================================================
-- Wide-Eleven Website — Supabase Database Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists public.projects (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  short_description text not null default '',
  description   text not null default '',
  category      text not null default '',
  tags          text[] not null default '{}',
  job_info      text not null default '',
  year          integer not null default extract(year from now())::integer,
  value         numeric not null default 0,
  status        text not null default 'draft' check (status in ('active', 'draft')),
  featured      boolean not null default false,
  main_image    text not null default '',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- PROJECT GALLERY
-- ============================================================
create table if not exists public.project_gallery (
  id            uuid primary key default uuid_generate_v4(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  image         text not null default '',
  sort_order    integer not null default 0
);

-- ============================================================
-- CLIENTS / TRUSTED PARTNERS
-- ============================================================
create table if not exists public.clients (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  logo_image    text not null default '',
  sort_order    integer not null default 0,
  link_url      text not null default ''
);

-- ============================================================
-- ADMIN USERS
-- ============================================================
create table if not exists public.admin_users (
  id            uuid primary key default uuid_generate_v4(),
  email         text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ADMIN INVITES
-- ============================================================
create table if not exists public.admin_invites (
  id                uuid primary key default uuid_generate_v4(),
  email             text not null unique,
  invite_token_hash text not null,
  expires_at        timestamptz not null,
  accepted_at       timestamptz
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.projects enable row level security;
alter table public.project_gallery enable row level security;
alter table public.clients enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_invites enable row level security;

-- PUBLIC can read active projects
create policy "Public read active projects"
  on public.projects for select
  using (status = 'active');

-- PUBLIC can read project gallery for active projects
create policy "Public read gallery"
  on public.project_gallery for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'active'
    )
  );

-- PUBLIC can read clients
create policy "Public read clients"
  on public.clients for select
  using (true);

-- SERVICE ROLE has full access (used by server-side API routes with service key)
-- No additional policy needed — service role bypasses RLS

-- ============================================================
-- STORAGE BUCKETS
-- (Run these separately in Supabase Dashboard > Storage
--  or via the Storage API — SQL doesn't create buckets)
-- ============================================================
-- Bucket: project-images  (public: true)
-- Bucket: client-logos    (public: true)

-- After creating buckets, set these policies in Dashboard:
-- SELECT policy: allow public read
-- INSERT/UPDATE/DELETE policy: require service role (handled server-side)

-- ============================================================
-- UPDATED_AT trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_projects_sort on public.projects(sort_order);
create index if not exists idx_gallery_project on public.project_gallery(project_id);
create index if not exists idx_clients_sort on public.clients(sort_order);
