-- Run in Supabase Dashboard -> SQL Editor to enable reservation listings.
alter table public.properties drop constraint if exists properties_listing_type_check;
alter table public.properties add constraint properties_listing_type_check
  check (listing_type in ('sale', 'rent', 'reservation', 'land'));

notify pgrst, 'reload schema';
