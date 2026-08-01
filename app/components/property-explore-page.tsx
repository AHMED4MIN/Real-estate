"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Mode = "rent" | "land";
type Property = { city: string; price: string; address: string; facts: string; badge: string; image: string };

const content: Record<Mode, { eyebrow: string; title: string; cities: string[]; items: Property[] }> = {
  rent: {
    eyebrow: "Rental homes",
    title: "Find a rental that feels like home.",
    cities: ["New York", "Los Angeles", "Miami", "Austin"],
    items: [
      { city: "New York", price: "$4,250 / mo", address: "48 West 24th Street, New York, NY", facts: "2 Beds · 2 Baths · 1,120 sqft", badge: "Available now", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=85" },
      { city: "Los Angeles", price: "$3,800 / mo", address: "1110 Sunset Boulevard, Los Angeles, CA", facts: "2 Beds · 2 Baths · 1,340 sqft", badge: "New", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=85" },
      { city: "Miami", price: "$5,600 / mo", address: "25 Ocean Drive, Miami, FL", facts: "3 Beds · 2.5 Baths · 1,740 sqft", badge: "Waterfront", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85" },
      { city: "Austin", price: "$2,950 / mo", address: "635 South Congress Avenue, Austin, TX", facts: "3 Beds · 2 Baths · 1,560 sqft", badge: "Pet friendly", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85" },
    ],
  },
  land: {
    eyebrow: "Land for sale",
    title: "Find the perfect place to build your future.",
    cities: ["Austin", "Nashville", "Phoenix", "Denver"],
    items: [
      { city: "Austin", price: "$395,000", address: "2.4 acres · West Lake Hills, Austin, TX", facts: "Residential zoned · Utilities ready", badge: "Build ready", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85" },
      { city: "Nashville", price: "$285,000", address: "1.8 acres · 421 Oak Hollow Road, TN", facts: "Residential zoned · Mature trees", badge: "New", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85" },
      { city: "Phoenix", price: "$525,000", address: "5.2 acres · Sonoran Ridge, Phoenix, AZ", facts: "Mountain views · Survey complete", badge: "Featured", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1000&q=85" },
      { city: "Denver", price: "$460,000", address: "3.1 acres · Evergreen Valley, CO", facts: "Utilities nearby · Private access", badge: "Open land", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85" },
    ],
  },
};

export default function PropertyExplorePage({ mode }: { mode: Mode }) {
  const data = content[mode];
  const [city, setCity] = useState("All cities");
  const [query, setQuery] = useState("");
  const results = useMemo(() => data.items.filter((item) => (city === "All cities" || item.city === city) && `${item.address} ${item.city}`.toLowerCase().includes(query.toLowerCase())), [city, data.items, query]);
  const label = mode === "rent" ? "Rent" : "Land";

  return <main className="min-h-screen bg-surface text-on-surface">
    <header className="border-b border-outline-variant/40 bg-surface"><nav className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-desktop"><Link href="/" className="font-headline-md text-headline-md font-bold text-primary">EstateFlow</Link><div className="hidden gap-8 md:flex"><Link href="/buy" className="text-on-surface-variant hover:text-primary">Buy</Link><Link href="/rent" className={mode === "rent" ? "border-b-2 border-primary font-bold text-primary" : "text-on-surface-variant hover:text-primary"}>Rent</Link><Link href="/land" className={mode === "land" ? "border-b-2 border-primary font-bold text-primary" : "text-on-surface-variant hover:text-primary"}>Land</Link><Link href="/agents" className="text-on-surface-variant hover:text-primary">Find an Agent</Link></div><Link href="/" className="font-semibold text-primary">Back to home</Link></nav></header>
    <section className="bg-surface-container-low py-16"><div className="mx-auto max-w-container-max px-margin-desktop"><p className="text-label-bold font-label-bold uppercase text-secondary">{data.eyebrow}</p><h1 className="mt-3 max-w-2xl font-display-lg text-display-lg">{data.title}</h1><div className="mt-8 grid gap-3 rounded-xl border border-outline-variant/50 bg-white p-3 shadow-sm md:grid-cols-[1fr_210px_auto]"><label className="flex items-center gap-3 rounded-lg border border-outline-variant/60 px-4 py-3"><svg className="h-5 w-5 text-outline" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" strokeLinecap="round" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="City, neighborhood, or address" className="min-w-0 flex-1 border-0 p-0 outline-none placeholder:text-outline" /></label><select value={city} onChange={(event) => setCity(event.target.value)} className="rounded-lg border border-outline-variant/60 bg-white px-4 py-3 outline-none"><option>All cities</option>{data.cities.map((item) => <option key={item}>{item}</option>)}</select><button className="rounded-lg bg-primary px-8 py-3 font-bold text-on-primary">Search</button></div></div></section>
    <section className="mx-auto max-w-container-max px-margin-desktop py-20"><div className="mb-8 flex items-end justify-between"><div><p className="text-label-bold font-label-bold uppercase text-secondary">Browse locations</p><h2 className="mt-2 font-headline-lg text-headline-lg">Where do you want to {mode === "rent" ? "live" : "build"}?</h2></div><button onClick={() => setCity("All cities")} className="font-bold text-primary">View all</button></div><div className="grid grid-cols-2 gap-gutter md:grid-cols-4">{data.cities.map((item, index) => <button key={item} onClick={() => setCity(item)} className={`rounded-xl border p-5 text-left transition-colors ${city === item ? "border-primary bg-primary-container text-white" : "border-outline-variant/50 bg-white hover:border-primary"}`}><span className="text-2xl">0{index + 1}</span><span className="mt-8 block font-headline-md text-headline-md">{item}</span><span className="mt-1 block text-sm opacity-75">Explore properties</span></button>)}</div></section>
    <section className="bg-surface-container-low py-20"><div className="mx-auto max-w-container-max px-margin-desktop"><div className="mb-10 flex items-end justify-between"><div><p className="text-label-bold font-label-bold uppercase text-secondary">Available now</p><h2 className="mt-2 font-headline-lg text-headline-lg">{label} listings</h2></div><p className="text-on-surface-variant">{results.length} properties found</p></div><div className="grid gap-gutter md:grid-cols-2 xl:grid-cols-3">{results.map((item) => <article key={item.address} className="property-card-shadow overflow-hidden rounded-xl bg-white"><div className="relative h-64"><img src={item.image} alt={item.address} className="h-full w-full object-cover" /><span className="absolute bottom-4 left-4 rounded bg-secondary-container px-3 py-1 text-xs font-bold uppercase text-on-secondary-container">{item.badge}</span></div><div className="p-stack-md"><h3 className="font-headline-md text-headline-md">{item.price}</h3><p className="mt-1 text-body-sm text-on-surface-variant">{item.address}</p><p className="mt-stack-md border-t border-outline-variant/30 pt-stack-sm text-sm text-outline">{item.facts}</p></div></article>)}</div></div></section>
  </main>;
}
