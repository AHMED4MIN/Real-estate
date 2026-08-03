-- Run this once in Supabase Dashboard → SQL Editor after schema.sql.
alter table public.properties add column if not exists description text;
alter table public.properties add column if not exists gallery text[] not null default '{}';
alter table public.properties add column if not exists video_url text;
alter table public.properties add column if not exists instagram_video_url text;
alter table public.properties add column if not exists is_luxury boolean not null default false;
alter table public.properties add column if not exists is_good_deal boolean not null default false;

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

alter table public.properties add column if not exists agent_id uuid references public.agents(id) on delete set null;
alter table public.agents add column if not exists instagram_url text;
alter table public.agents add column if not exists tiktok_url text;
alter table public.agents add column if not exists facebook_url text;
create index if not exists properties_agent_id_idx on public.properties(agent_id);

alter table public.agents enable row level security;

drop policy if exists "Visitors can read published agents" on public.agents;
drop policy if exists "Admins can add agents" on public.agents;
drop policy if exists "Admins can change agents" on public.agents;
drop policy if exists "Admins can delete agents" on public.agents;

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

notify pgrst, 'reload schema';
