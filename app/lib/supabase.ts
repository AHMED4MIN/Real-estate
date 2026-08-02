import { createClient } from "@supabase/supabase-js";

// The current Supabase Dashboard calls this a "publishable key". The anon-key
// fallback keeps older projects compatible with the legacy variable name.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && publishableKey);

// A publishable/anon key is safe in the browser. Never put a service-role key in NEXT_PUBLIC_*.
export const supabase = isSupabaseConfigured
  ? createClient(url!, publishableKey!)
  : null;
