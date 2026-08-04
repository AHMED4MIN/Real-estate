"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyMediaCarousel } from "@/app/components/property-media-carousel";
import { useLanguage } from "@/app/components/language-provider";
import { Agent, formatPrice, Property } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";

const facilityIcons: Record<string, string> = { school: "🎓", supermarket: "🛒", mosque: "🕌", hospital: "⚕️", pharmacy: "💊", park: "🌳", "public transport": "🚌", restaurant: "🍽" };
const typeLabels = { house: "homes", apartment: "apartments", villa: "villas", land: "land" } as const;
function externalUrl(value: string | null) { try { const url = new URL(value ?? ""); return ["https:", "http:"].includes(url.protocol) ? url.toString() : null; } catch { return null; } }

export default function PropertyPage() {
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !params?.id) { queueMicrotask(() => { setMissing(true); setLoading(false); }); return; }
    void supabase.from("properties").select("*").eq("id", params.id).eq("published", true).single().then(async ({ data }) => {
      const prop = data as Property | null;
      if (!prop) { setMissing(true); setLoading(false); return; }
      setProperty(prop);
      if (prop.agent_id) { const { data: agentData } = await supabase!.from("agents").select("*").eq("id", prop.agent_id).eq("published", true).single(); setAgent(agentData as Agent | null); }
      setLoading(false);
    });
  }, [params?.id]);

  if (missing) notFound();
  if (loading || !property) return null;
  const images = [...new Set([property.image_url, ...(property.gallery ?? [])].filter((image): image is string => Boolean(image)))];
  const support = property.country_support ? new Intl.NumberFormat("en-US").format(property.country_support) : null;
  const instagramVideoUrl = externalUrl(property.instagram_video_url);

  return <main className="min-h-screen bg-surface text-on-surface">
    <header className="border-b border-outline-variant/40"><nav className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-desktop"><Link href="/" className="font-headline-md text-headline-md font-bold text-primary">al salah</Link><Link href={property.listing_type === "sale" ? "/buy" : `/${property.listing_type}`} className="font-semibold text-primary">← {t("allProperties")}</Link></nav></header>
    <section className="mx-auto max-w-container-max px-margin-desktop py-12">
      <p className="text-label-bold font-label-bold uppercase text-secondary">{t(property.listing_type === "sale" ? "buy" : property.listing_type)} · {t(typeLabels[property.property_type as keyof typeof typeLabels] ?? "propertyType")}</p>
      <h1 className="mt-3 font-display-lg text-display-lg">{formatPrice(property)}</h1><p className="mt-2 text-body-lg text-on-surface-variant">{property.address}</p>
      <PropertyMediaCarousel images={images} videoUrl={property.video_url} address={property.address}/>
      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"><div>
        <h2 className="font-headline-lg text-headline-lg">{t("propertyDetails")}</h2><p className="mt-5 whitespace-pre-line text-body-lg text-on-surface-variant">{property.description || property.details || t("moreDetailsSoon")}</p>
        {instagramVideoUrl && <a href={instagramVideoUrl} target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-pink-300 bg-gradient-to-r from-pink-50 via-white to-orange-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"><span><span className="text-xs font-bold uppercase tracking-widest text-pink-700">{t("propertyVideo")}</span><span className="mt-1 block font-headline-md text-headline-md">{t("watchFullTourInstagram")}</span><span className="mt-1 block text-sm text-on-surface-variant">{t("seeEveryRoomDetail")}</span></span><span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-600 via-pink-500 to-orange-400 text-xl text-white">▶</span></a>}
        {support && <section className="mt-10 rounded-2xl border border-primary/20 bg-primary-container/30 p-6"><p className="font-bold text-primary">{t("eligibleCountrySupport")}</p><p className="mt-1 text-on-surface-variant">{t("countrySupportPrefix")} <strong>{support} DH</strong> {t("countrySupportSuffix")}</p></section>}
        {(property.facilities?.length ?? 0) > 0 && <section className="mt-10"><p className="text-label-bold font-label-bold uppercase text-secondary">{t("aroundPropertyEyebrow")}</p><h2 className="mt-2 font-headline-lg text-headline-lg">{t("nearbyFacilities")}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{property.facilities?.map((facility) => <div key={facility} className="flex items-center gap-3 rounded-xl border bg-surface-container-low p-4"><span className="grid size-10 place-items-center rounded-full bg-primary-container text-lg">{facilityIcons[facility] ?? "📍"}</span><span className="font-semibold">{t(facility)}</span></div>)}</div></section>}
      </div><aside className="h-fit rounded-2xl bg-surface-container-low p-6 xl:sticky xl:top-6"><p className="text-sm text-outline">{t("featuresLabel")}</p><div className="mt-4 grid gap-3">{property.bedrooms !== null && <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-white text-primary"><span className="material-symbols-outlined">bed</span></span><span><strong>{property.bedrooms}</strong> {t("beds")}</span></div>}{property.bathrooms !== null && <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-white text-primary"><span className="material-symbols-outlined">bathtub</span></span><span><strong>{property.bathrooms}</strong> {t("baths")}</span></div>}{property.area_m2 !== null && <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-white text-primary"><span className="material-symbols-outlined">square_foot</span></span><span><strong>{new Intl.NumberFormat().format(property.area_m2)}</strong> m²</span></div>}</div><p className="mt-4 text-on-surface-variant">{property.city}</p>{(property.is_luxury || property.is_good_deal) && <div className="mt-5 flex flex-wrap gap-2 border-t border-outline-variant/40 pt-5">{property.is_luxury && <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800">Luxury</span>}{property.is_good_deal && <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">Good deal</span>}</div>}{agent && <div className="mt-6 border-t border-outline-variant/40 pt-5"><p className="font-bold">{t("contactAgent")}</p><p className="mt-2 text-sm font-semibold">{agent.name}</p>{agent.phone && <p className="mt-1 text-sm text-on-surface-variant">{agent.phone}</p>}</div>}</aside></div>
    </section>
  </main>;
}
