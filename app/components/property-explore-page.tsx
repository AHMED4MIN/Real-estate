"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, propertyFacts, Property } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";
import { SiteHeader } from "@/app/components/site-header";
import { useLanguage } from "@/app/components/language-provider";

type Mode = "sale" | "rent" | "land";
const typeLabels = { house: "homes", apartment: "apartments", villa: "villas", land: "land" } as const;

export default function PropertyExplorePage({ mode }: { mode: Mode }) {
  const { t } = useLanguage();
  const [city, setCity] = useState(""); const [type, setType] = useState(""); const [query, setQuery] = useState(""); const [properties, setProperties] = useState<Property[]>([]); const [error, setError] = useState("");
  useEffect(() => { const params = new URLSearchParams(window.location.search); setQuery(params.get("query") ?? ""); setType(params.get("type") ?? ""); }, []);
  useEffect(() => { if (supabase) void supabase.from("properties").select("*").eq("listing_type", mode).eq("published", true).order("created_at", { ascending: false }).then(({ data, error }) => error ? setError(error.message) : setProperties((data ?? []) as Property[])); }, [mode]);
  const cities = useMemo(() => [...new Set(properties.map((item) => item.city))].sort(), [properties]);
  const types = useMemo(() => [...new Set(properties.map((item) => item.property_type))].sort(), [properties]);
  const results = useMemo(() => properties.filter((item) => (!city || item.city === city) && (!type || item.property_type === type) && `${item.address} ${item.city}`.toLowerCase().includes(query.toLowerCase())), [city, properties, query, type]);
  const label = t(mode === "sale" ? "buy" : mode);
  return <main className="min-h-screen bg-surface text-on-surface"><SiteHeader/><section className="bg-surface-container-low py-14"><div className="mx-auto max-w-container-max px-margin-desktop"><p className="text-label-bold font-label-bold uppercase text-secondary">{label}</p><h1 className="mt-3 font-display-lg text-display-lg">{label} {t("propertiesFound")}.</h1><div className="mt-8 grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${t("search")}…`} className="rounded-lg border px-4 py-3"/><select value={city} onChange={(event) => setCity(event.target.value)} className="rounded-lg border bg-white px-4 py-3"><option value="">{t("allCities")}</option>{cities.map((item) => <option key={item}>{item}</option>)}</select><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border bg-white px-4 py-3"><option value="">{t("allTypes")}</option>{types.map((item) => <option key={item} value={item}>{t(typeLabels[item as keyof typeof typeLabels] ?? "propertyType")}</option>)}</select></div></div></section><section className="bg-surface-container-low py-20"><div className="mx-auto max-w-container-max px-margin-desktop"><p className="mb-8 text-on-surface-variant">{results.length} {t("propertiesFound")}</p>{!isSupabaseConfigured || error || results.length === 0 ? <div className="rounded-xl border border-dashed bg-white p-12 text-center text-on-surface-variant">{!isSupabaseConfigured ? "Configure Supabase in .env.local to load your properties." : error || t("noProperties")}</div> : <div className="grid gap-gutter md:grid-cols-2 xl:grid-cols-3">{results.map((item) => <Link key={item.id} href={`/properties/${item.id}`} className="property-card-shadow overflow-hidden rounded-xl bg-white"><img src={item.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85"} alt={item.address} className="h-64 w-full object-cover"/><div className="p-stack-md"><h2 className="font-headline-md text-headline-md">{formatPrice(item)}</h2><p className="text-on-surface-variant">{item.address}</p><p className="mt-3 border-t pt-3 text-sm text-outline">{propertyFacts(item)}</p></div></Link>)}</div>}</div></section></main>;
}
