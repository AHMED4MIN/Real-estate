-- Run this in Supabase Dashboard -> SQL Editor.
-- `delivery_date` stores the first day of the delivery month (YYYY-MM-01).
alter table public.properties
  add column if not exists delivery_date date,
  add column if not exists building_facilities text[] not null default '{}';

alter table public.properties
  drop constraint if exists properties_delivery_date_reservation_check;

alter table public.properties
  add constraint properties_delivery_date_reservation_check
  check (delivery_date is null or listing_type = 'reservation');

notify pgrst, 'reload schema';
