-- Run this once in Supabase Dashboard → SQL Editor after schema.sql.
alter table public.properties add column if not exists description text;
alter table public.properties add column if not exists gallery text[] not null default '{}';

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  city text not null,
  title text not null,
  bio text,
  about text,
  image_url text,
  phone text,
  email text,
  experience text,
  sales text,
  languages text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.agents enable row level security;

create policy "Visitors can read published agents" on public.agents
  for select using (published or public.is_admin());
create policy "Admins can add agents" on public.agents
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins can change agents" on public.agents
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete agents" on public.agents
  for delete to authenticated using ((select public.is_admin()));

-- Required if Data API default privileges are disabled in your project.
grant select on public.properties, public.agents to anon;
grant select, insert, update, delete on public.properties, public.agents to authenticated;
