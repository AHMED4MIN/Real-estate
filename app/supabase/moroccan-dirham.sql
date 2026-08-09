-- Run once in the Supabase SQL Editor for existing listings.
alter table public.properties alter column currency set default 'DH';
update public.properties set currency = 'DH' where currency is distinct from 'DH';
