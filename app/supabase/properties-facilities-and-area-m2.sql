-- Run in Supabase Dashboard -> SQL Editor. Safe to run more than once.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'properties' and column_name = 'area_sqft'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'properties' and column_name = 'area_m2'
  ) then
    alter table public.properties rename column area_sqft to area_m2;
  end if;
end $$;
alter table public.properties drop column if exists badge;
alter table public.properties add column if not exists country_support integer check (country_support in (70000, 100000));
alter table public.properties add column if not exists facilities text[] not null default '{}';

-- Existing land records are normalized for the new admin-flow rules.
update public.properties
set property_type = 'land', bedrooms = null, bathrooms = null, country_support = null
where listing_type = 'land';

notify pgrst, 'reload schema';
