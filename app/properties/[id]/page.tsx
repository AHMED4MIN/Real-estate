import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, propertyFacts, Property } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured || !supabase) notFound();
  const { data } = await supabase.from("properties").select("*").eq("id", id).eq("published", true).single();
  const property = data as Property | null;
  if (!property) notFound();
  const images = [...new Set([property.image_url, ...(property.gallery ?? [])].filter((image): image is string => Boolean(image)))];
  return <main className="min-h-screen bg-surface text-on-surface"><header className="border-b border-outline-variant/40 bg-surface"><nav className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-desktop"><Link href="/" className="font-headline-md text-headline-md font-bold text-primary">EstateFlow</Link><Link href={property.listing_type === "sale" ? "/buy" : `/${property.listing_type}`} className="font-semibold text-primary">← All properties</Link></nav></header><section className="mx-auto max-w-container-max px-margin-desktop py-12"><p className="text-label-bold font-label-bold uppercase text-secondary">{property.listing_type} · {property.property_type}</p><h1 className="mt-3 font-display-lg text-display-lg">{formatPrice(property)}</h1><p className="mt-2 text-body-lg text-on-surface-variant">{property.address}</p><div className="mt-8 grid gap-4 md:grid-cols-2">{images.map((image, index) => <img key={image} src={image} alt={`${property.address} ${index + 1}`} className={`h-72 w-full rounded-xl object-cover ${index === 0 ? "md:row-span-2 md:h-full" : ""}`} />)}</div>{property.video_url && <section className="mt-12"><h2 className="font-headline-lg text-headline-lg">Property video</h2><video controls preload="metadata" poster={property.image_url ?? undefined} className="mt-5 w-full rounded-xl bg-black" src={property.video_url}>Your browser does not support property videos.</video></section>}<div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]"><div><h2 className="font-headline-lg text-headline-lg">Property details</h2><p className="mt-5 text-body-lg text-on-surface-variant">{property.description || property.details || "More details will be added soon."}</p></div><aside className="rounded-xl bg-surface-container-low p-6"><p className="text-sm text-outline">Features</p><p className="mt-3 font-headline-md text-headline-md">{propertyFacts(property)}</p><p className="mt-4 text-on-surface-variant">{property.city}</p></aside></div></section></main>;
}
