-- Run once in Supabase Dashboard -> SQL Editor. Safe to rerun.
alter table public.properties add column if not exists is_luxury boolean not null default false;
alter table public.properties add column if not exists is_good_deal boolean not null default false;
alter table public.properties add column if not exists instagram_video_url text;
alter table public.agents add column if not exists instagram_url text;
alter table public.agents add column if not exists tiktok_url text;
alter table public.agents add column if not exists facebook_url text;
notify pgrst, 'reload schema';
