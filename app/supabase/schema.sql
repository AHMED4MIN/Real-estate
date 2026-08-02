-- Run this file in Supabase Dashboard → SQL Editor.
-- Auth users (including the admin password) are managed by Supabase Auth, not this table.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('sale', 'rent', 'land')),
  property_type text not null check (property_type in ('house', 'apartment', 'villa', 'land')),
  city text not null,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default '$',
  price_suffix text,
  address text not null,
  bedrooms numeric(3, 1),
  bathrooms numeric(3, 1),
  area_sqft integer,
  details text,
  badge text,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.properties enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "Users can read their own profile" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "Visitors can read published properties" on public.properties
  for select using (published or public.is_admin());
create policy "Admins can add properties" on public.properties
  for insert to authenticated with check (public.is_admin());
create policy "Admins can change properties" on public.properties
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete properties" on public.properties
  for delete to authenticated using (public.is_admin());

-- 1) Create the administrator in Dashboard → Authentication → Users.
-- 2) Copy that user's UUID, then run this once:
-- insert into public.profiles (id, role) values ('PASTE-ADMIN-USER-UUID', 'admin');

-- Optional example property:
-- insert into public.properties (listing_type, property_type, city, price, address, bedrooms, bathrooms, area_sqft, badge, image_url)
-- values ('sale', 'house', 'Casablanca', 2500000, '123 Example Street, Casablanca', 4, 3, 2700, 'New', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85');
