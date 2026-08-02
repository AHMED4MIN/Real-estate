-- Run this once in Supabase Dashboard → SQL Editor after agents-and-details.sql.
alter table public.properties add column if not exists video_url text;
