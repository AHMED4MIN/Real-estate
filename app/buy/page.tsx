"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice, propertyFacts, Property } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";

export default function BuyPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [city, setCity] = useState("All cities");
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { if (supabase) void supabase.from("properties").select("*").eq("listing_type", "sale").order("created_at", { ascending: false }).then(({ data, error }) => error ? setError(error.message) : setProperties((data ?? []) as Property[])); }, []);
  const cities = useMemo(() => [...new Set(properties.map((item) => item.city))], [properties]);
  const listings = useMemo(() => properties.filter((item) => (city === "All cities" || item.city === city) && `${item.address} ${item.city}`.toLowerCase().includes(query.toLowerCase())), [city, properties, query]);
  return <main className="min-h-screen bg-surface text-on-surface"><header className="border-b border-outline-variant/40 bg-surface"><nav className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-desktop"><Link href="/" className="font-headline-md text-headline-md font-bold text-primary">EstateFlow</Link><Link href="/admin" className="font-semibold text-primary">Admin</Link></nav></header><section className="bg-surface-container-low py-14"><div className="mx-auto max-w-container-max px-margin-desktop"><p className="text-label-bold font-label-bold uppercase text-secondary">Properties for sale</p><h1 className="mt-3 font-display-lg text-display-lg">Find a place you&apos;ll love to call home.</h1><div className="mt-8 grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-[1fr_190px]"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="City, neighborhood, or address" className="rounded-lg border px-4 py-3"/><select value={city} onChange={(event) => setCity(event.target.value)} className="rounded-lg border bg-white px-4 py-3"><option>All cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></div></div></section><section className="bg-surface-container-low py-20"><div className="mx-auto max-w-container-max px-margin-desktop"><p className="mb-8 text-on-surface-variant">{listings.length} properties found</p>{!isSupabaseConfigured || error || listings.length === 0 ? <div className="rounded-xl border border-dashed bg-white p-12 text-center text-on-surface-variant">{!isSupabaseConfigured ? "Configure Supabase in .env.local to load your properties." : error || "No published properties found yet."}</div> : <div className="grid gap-gutter md:grid-cols-2 xl:grid-cols-3">{listings.map((item) => <PropertyCard key={item.id} property={item}/>)}</div>}</div></section></main>;
}
function PropertyCard({ property }: { property: Property }) { return <Link href={`/properties/${property.id}`} className="property-card-shadow overflow-hidden rounded-xl bg-white"><img className="h-64 w-full object-cover" src={property.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85"} alt={property.address}/><div className="p-stack-md"><h2 className="font-headline-md text-headline-md">{formatPrice(property)}</h2><p className="text-on-surface-variant">{property.address}</p><p className="mt-3 border-t pt-3 text-sm text-outline">{propertyFacts(property)}</p></div></Link>; }
