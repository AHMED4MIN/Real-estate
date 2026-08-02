-- Run this once in Supabase Dashboard → SQL Editor.
create table if not exists public.sell_requests (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete set null,
  full_name text not null,
  phone text not null,
  address text not null,
  description text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.sell_requests enable row level security;
create policy "Visitors can submit sell requests" on public.sell_requests
  for insert to anon, authenticated with check (true);
create policy "Admins can view sell requests" on public.sell_requests
  for select to authenticated using ((select public.is_admin()));
create policy "Admins can update sell requests" on public.sell_requests
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete sell requests" on public.sell_requests
  for delete to authenticated using ((select public.is_admin()));

grant insert on public.sell_requests to anon, authenticated;
grant select, update, delete on public.sell_requests to authenticated;
