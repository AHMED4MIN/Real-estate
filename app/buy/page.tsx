"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ListingType = "houses" | "apartments";

const cities = [
  { name: "Los Angeles", listings: "1,248 homes", image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?auto=format&fit=crop&w=900&q=85" },
  { name: "New York", listings: "986 homes", image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=85" },
  { name: "Miami", listings: "674 homes", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=85" },
  { name: "Austin", listings: "523 homes", image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=900&q=85" },
];

const listings = [
  { type: "houses", city: "Los Angeles", price: "$1,450,000", address: "1248 Skyline Drive, Los Angeles, CA", beds: "4 Beds", baths: "3 Baths", size: "3,200 sqft", badge: "New", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsJh5KkLuXu1__HKRTAkZg1wGCrQBKzroKcdj4ACGPEJuvslfO7cC3EhE-NXpB5OvsOMNCzJnyh2HrW_0WehvxlJ8ZCssi0ZVCRBWxGViYrG5ozovv4WDHMaGjPmBBYHVCOUaSMxWvNMnwIaTj2CYPL72iCe8sss5gHMxeeab_N94UiliCoNIKXcyLEf6do9CNckkhPvbdA6au9OutoWahTVKvamGbpIVz43zFswaca7OY4yZvo3nUkA" },
  { type: "houses", city: "Miami", price: "$2,200,000", address: "77 Ocean View Terrace, Miami, FL", beds: "5 Beds", baths: "4.5 Baths", size: "4,150 sqft", badge: "Price Drop", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1izBdApHrgvpEvJMFuV_4JvMRDY8LkDESdwik12npElisX3F5sGq7GU00OlXnLKJsuyAwfKdbc5YgTqn1l2CkfVRmuuwav3vH3RV9RKUU7ylJe6AKm68VdblnFuJyv1Q9EFn3Bk3ARMdf0ZcLD39zqWkNraMpIMzJbh21ShKTK4lDo7m_DryeGaqtXS3KsrpUPXwUJgxKKarNuDg37mMToPFiGfFRNIzfRcdt-p87CuXpPKVpOOQRA" },
  { type: "houses", city: "Austin", price: "$895,000", address: "212 Foundry Street, Austin, TX", beds: "3 Beds", baths: "2 Baths", size: "2,180 sqft", badge: "Open House", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6DUN7_yX6BgIimvNiAkH5lz1RUY1s9PlPKeBbuAFbRVsksHzMb2SinlgcDbh6KMMaWs0zbTGaA10t20eZJFIKq7djOYaBTVvNCbPGpX661KiAQb32FBc_blwBOXEpnti9zyLUjd8xgB4MUZ_X4YBaYy2gsCOQ_TtER8PA1N-5Pu7DKjbZ7U4YBvPPRYRi657HJukPnNgOsqxiKHoEws41mi8_hENTHOIU-uRl78gkcSUjbDQK-kub9Q" },
  { type: "apartments", city: "New York", price: "$980,000", address: "42 Park Avenue, New York, NY", beds: "2 Beds", baths: "2 Baths", size: "1,240 sqft", badge: "New", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMC-1GsRAe09J9zA1LuaFh_8LU8Dgukx_xGQbfswlgX_98vZceS__e0m9i7OsEp_tdAYdjuz3K33YfHwdG3F49Q5-WksjyYM_Hnj3moAHhZbe8tUn5MG39VhO2TBNfnWz03XHTgKC2Gx4zUdjNJBdb6zKrL8mdtxiBHXMbJdR81Pv1Tqp3_ALYfNhXaGOQLwayrOfzz0pfNljzdkwejpdnnxj5ULN-aUCohkQppmUOksZ-Vk1hCBUo_A" },
  { type: "apartments", city: "Los Angeles", price: "$725,000", address: "810 Grand Avenue, Los Angeles, CA", beds: "2 Beds", baths: "1 Bath", size: "1,080 sqft", badge: "Featured", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85" },
  { type: "apartments", city: "Miami", price: "$1,180,000", address: "300 Biscayne Blvd, Miami, FL", beds: "3 Beds", baths: "2.5 Baths", size: "1,760 sqft", badge: "Waterfront", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=85" },
] as const;

function BedIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 17v-6h18v6M3 14h18M5 11V7h5a3 3 0 0 1 3 3v1M3 17v2m18-2v2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function BathIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12h16v5H4zM7 12V9a2 2 0 0 1 4 0v3M4 17v2m16-2v2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function SizeIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4M8 8l8 8m0-8-8 8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

export default function BuyPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "apartments" ? "apartments" : "houses";
  const [type, setType] = useState<ListingType>(initialType);
  const [city, setCity] = useState("All cities");
  const [query, setQuery] = useState("");
  const [beds, setBeds] = useState("Any beds");

  const visibleListings = useMemo(() => listings.filter((listing) => {
    const matchesType = listing.type === type;
    const matchesCity = city === "All cities" || listing.city === city;
    const matchesQuery = `${listing.address} ${listing.city}`.toLowerCase().includes(query.toLowerCase());
    const matchesBeds = beds === "Any beds" || listing.beds.startsWith(beds);
    return matchesType && matchesCity && matchesQuery && matchesBeds;
  }), [type, city, query, beds]);

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <header className="border-b border-outline-variant/40 bg-surface">
        <nav className="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-margin-desktop">
          <Link className="font-headline-md text-headline-md font-bold text-primary" href="/">EstateFlow</Link>
          <div className="hidden items-center gap-8 font-body-md text-body-md md:flex">
            <a className="border-b-2 border-primary pb-1 font-bold text-primary" href="/buy">Buy</a>
            <a className="text-on-surface-variant transition-colors hover:text-primary" href="#listings">Featured Homes</a>
            <a className="text-on-surface-variant transition-colors hover:text-primary" href="#cities">Cities</a>
          </div>
          <Link className="rounded-lg px-4 py-2 font-semibold text-primary transition-colors hover:bg-surface-container-low" href="/">Back to home</Link>
        </nav>
      </header>

      <section className="border-b border-outline-variant/30 bg-surface-container-low py-14">
        <div className="mx-auto max-w-container-max px-margin-desktop">
          <p className="mb-3 text-label-bold font-label-bold uppercase text-secondary">Properties for sale</p>
          <h1 className="max-w-2xl font-display-lg text-display-lg text-on-surface">Find a place you&apos;ll love to call home.</h1>
          <div className="mt-8 flex w-fit rounded-xl border border-outline-variant/50 bg-white p-1.5">
            {(["houses", "apartments"] as const).map((item) => (
              <button key={item} onClick={() => setType(item)} className={`rounded-lg px-5 py-2.5 text-sm font-bold capitalize transition-colors ${type === item ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-3 rounded-xl border border-outline-variant/50 bg-white p-3 shadow-sm md:grid-cols-[1fr_190px_150px_auto]">
            <label className="flex items-center gap-3 rounded-lg border border-outline-variant/60 px-4 py-3 text-outline">
              <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" strokeLinecap="round" /></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 p-0 text-on-surface outline-none placeholder:text-outline" placeholder="City, neighborhood, or address" />
            </label>
            <select value={city} onChange={(event) => setCity(event.target.value)} className="rounded-lg border border-outline-variant/60 bg-white px-4 py-3 text-on-surface outline-none focus:border-primary">
              <option>All cities</option>{cities.map((item) => <option key={item.name}>{item.name}</option>)}
            </select>
            <select value={beds} onChange={(event) => setBeds(event.target.value)} className="rounded-lg border border-outline-variant/60 bg-white px-4 py-3 text-on-surface outline-none focus:border-primary">
              <option>Any beds</option><option>2</option><option>3</option><option>4</option><option>5</option>
            </select>
            <button className="rounded-lg bg-primary px-7 py-3 font-bold text-on-primary transition-colors hover:bg-primary-container">Search</button>
          </div>
        </div>
      </section>

      <section id="cities" className="mx-auto max-w-container-max px-margin-desktop py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-label-bold font-label-bold uppercase text-secondary">Explore by location</p><h2 className="mt-2 font-headline-lg text-headline-lg">Which city interests you?</h2></div><button onClick={() => setCity("All cities")} className="font-bold text-primary">View all cities</button></div>
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((item) => <button key={item.name} onClick={() => setCity(item.name)} className={`group relative h-56 overflow-hidden rounded-xl text-left ${city === item.name ? "ring-4 ring-primary/25" : ""}`}>
            <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={item.image} alt={`${item.name} skyline`} />
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/10 to-transparent" />
            <div className="absolute bottom-0 p-5 text-white"><h3 className="font-headline-md text-headline-md">{item.name}</h3><p className="mt-1 text-sm text-white/80">{item.listings}</p></div>
          </button>)}
        </div>
      </section>

      <section id="listings" className="bg-surface-container-low py-20">
        <div className="mx-auto max-w-container-max px-margin-desktop"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-label-bold font-label-bold uppercase text-secondary">Available now</p><h2 className="mt-2 font-headline-lg text-headline-lg">{type === "houses" ? "Homes" : "Apartments"} for sale</h2></div><p className="text-on-surface-variant">{visibleListings.length} properties found</p></div>
          {visibleListings.length === 0 ? <div className="rounded-xl border border-dashed border-outline-variant bg-white p-12 text-center text-on-surface-variant">No listings match those filters. Try another city or search.</div> : <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
            {visibleListings.map((listing) => <article key={listing.address} className="property-card-shadow overflow-hidden rounded-xl bg-white">
              <div className="relative h-64"><img className="h-full w-full object-cover" src={listing.image} alt={listing.address} /><span className="absolute bottom-4 left-4 rounded bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary-container">{listing.badge}</span><button aria-label={`Save ${listing.address}`} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full glass-card text-on-surface"><svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
              <div className="p-stack-md"><h3 className="font-headline-md text-headline-md">{listing.price}</h3><p className="mb-stack-md text-body-sm text-on-surface-variant">{listing.address}</p><div className="property-specs flex items-center border-t border-outline-variant/30 pt-stack-sm text-outline"><span className="flex items-center gap-1 whitespace-nowrap"><BedIcon />{listing.beds}</span><span className="flex items-center gap-1 whitespace-nowrap"><BathIcon />{listing.baths}</span><span className="flex items-center gap-1 whitespace-nowrap"><SizeIcon />{listing.size}</span></div></div>
            </article>)}
          </div>}
        </div>
      </section>
    </main>
  );
}
