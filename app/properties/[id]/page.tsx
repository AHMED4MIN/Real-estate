"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyMediaCarousel } from "@/app/components/property-media-carousel";
import { useLanguage } from "@/app/components/language-provider";
import { Agent, formatPrice, Property } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";

const facilityIcons: Record<string, string> = { school: "🎓", supermarket: "🛒", mosque: "🕌", hospital: "⚕️", pharmacy: "💊", park: "🌳", "public transport": "🚌", restaurant: "🍽" };
const buildingFacilityIcons: Record<string, string> = {
  pool: "🏊",
  garden: "🌿",
  elevator: "🛗",
  "equipped kitchen": "🍳",
  parking: "🅿️",
  security: "🛡️",
  concierge: "🛎️",
  gym: "🏋️",
  terrace: "🌇",
  balcony: "🏙️",
  "air conditioning": "❄️",
  "central heating": "🔥",
  furnished: "🛋️",
  "accessible entrance": "♿",
  "storage room": "📦",
};
const typeLabels = { house: "homes", apartment: "apartments", villa: "villas", land: "land" } as const;
function externalUrl(value: string | null) { try { const url = new URL(value ?? ""); return ["https:", "http:"].includes(url.protocol) ? url.toString() : null; } catch { return null; } }
function phoneHref(phone: string) { return phone.replace(/[^+\d]/g, ""); }
function whatsappNumber(phone: string) { return phone.replace(/\D/g, ""); }

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
  const deliveryDate = property.delivery_date ? new Intl.DateTimeFormat(t("locale"), { month: "long", year: "numeric" }).format(new Date(`${property.delivery_date.slice(0, 10)}T12:00:00`)) : null;

  return <main className="min-h-screen bg-surface text-on-surface">
    <header className="border-b border-outline-variant/40"><nav className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-desktop"><Link href="/" className="font-headline-md text-headline-md font-bold text-primary">al salah</Link><Link href={property.listing_type === "sale" ? "/buy" : `/${property.listing_type}`} className="font-semibold text-primary">← {t("allProperties")}</Link></nav></header>
    <section className="mx-auto max-w-container-max px-margin-desktop py-12">
      <div className="flex flex-wrap items-center gap-2"><p className="text-label-bold font-label-bold uppercase text-secondary">{t(property.listing_type === "sale" ? "forSale" : property.listing_type)} · {t(typeLabels[property.property_type as keyof typeof typeLabels] ?? "propertyType")}</p>{property.listing_type === "reservation" && <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-bold text-secondary">{t("reservation")}</span>}</div>
      <h1 className="mt-3 font-display-lg text-display-lg">{t("startingAt")} {formatPrice(property)}</h1><p className="mt-2 text-body-lg text-on-surface-variant">{property.address}</p>
      {property.listing_type === "reservation" && deliveryDate && <p className="mt-4 inline-flex rounded-lg bg-secondary-container px-4 py-2 font-bold text-secondary">{t("deliveryDate")} {deliveryDate}</p>}
      <PropertyMediaCarousel images={images} videoUrl={property.video_url} address={property.address}/>
      {agent?.phone && <section className="mt-6 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary-container/40 via-white to-surface-container-low p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-label-bold font-label-bold uppercase text-secondary">{t("contactAgent")}</p><h2 className="mt-1 font-headline-md text-headline-md">{agent.name}</h2><p dir="ltr" className="mt-1 text-left text-sm text-on-surface-variant">{agent.phone}</p></div><div className="grid gap-3 sm:grid-cols-2"><a href={`tel:${phoneHref(agent.phone)}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary transition hover:brightness-95"><span className="material-symbols-outlined text-xl">call</span>{t("callAgent")}</a><a href={`https://wa.me/${whatsappNumber(agent.phone)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"><span className="material-symbols-outlined text-xl">chat</span>{t("contactWhatsapp")}</a></div></div></section>}
      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"><div>
        <h2 className="font-headline-lg text-headline-lg">{t("propertyDetails")}</h2><p className="mt-5 whitespace-pre-line text-body-lg text-on-surface-variant">{property.description || property.details || t("moreDetailsSoon")}</p>
        {instagramVideoUrl && <a href={instagramVideoUrl} target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-pink-300 bg-gradient-to-r from-pink-50 via-white to-orange-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"><span><span className="text-xs font-bold uppercase tracking-widest text-pink-700">{t("propertyVideo")}</span><span className="mt-1 block font-headline-md text-headline-md">{t("watchFullTourInstagram")}</span><span className="mt-1 block text-sm text-on-surface-variant">{t("seeEveryRoomDetail")}</span></span><span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-600 via-pink-500 to-orange-400 text-xl text-white">▶</span></a>}
        {support && <section className="mt-10 rounded-2xl border border-primary/20 bg-primary-container/30 p-6"><p className="font-bold text-primary">{t("eligibleCountrySupport")}</p><p className="mt-1 text-on-surface-variant">{t("countrySupportPrefix")} <strong>{support} DH</strong> {t("countrySupportSuffix")}</p></section>}
        {property.property_type !== "land" && (property.building_facilities?.length ?? 0) > 0 && <section className="mt-10"><p className="text-label-bold font-label-bold uppercase text-secondary">{t("featuresLabel")}</p><h2 className="mt-2 font-headline-lg text-headline-lg">{t("buildingFacilities")}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{property.building_facilities?.map((facility) => <div key={facility} className="flex items-center gap-3 rounded-xl border bg-surface-container-low p-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container text-lg">{buildingFacilityIcons[facility] ?? "🏢"}</span><span className="font-semibold">{t(facility)}</span></div>)}</div></section>}
        {(property.facilities?.length ?? 0) > 0 && <section className="mt-10"><p className="text-label-bold font-label-bold uppercase text-secondary">{t("aroundPropertyEyebrow")}</p><h2 className="mt-2 font-headline-lg text-headline-lg">{t("nearbyFacilities")}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{property.facilities?.map((facility) => <div key={facility} className="flex items-center gap-3 rounded-xl border bg-surface-container-low p-4"><span className="grid size-10 place-items-center rounded-full bg-primary-container text-lg">{facilityIcons[facility] ?? "📍"}</span><span className="font-semibold">{t(facility)}</span></div>)}</div></section>}
      </div><aside className="h-fit rounded-2xl bg-surface-container-low p-6 xl:sticky xl:top-6"><p className="text-sm text-outline">{t("featuresLabel")}</p><div className="mt-4 grid gap-3">{property.bedrooms !== null && <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-white text-primary"><span className="material-symbols-outlined">bed</span></span><span><strong>{property.bedrooms}</strong> {t("beds")}</span></div>}{property.bathrooms !== null && <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-white text-primary"><span className="material-symbols-outlined">bathtub</span></span><span><strong>{property.bathrooms}</strong> {t("baths")}</span></div>}{property.area_m2 !== null && <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-white text-primary"><span className="material-symbols-outlined">square_foot</span></span><span><strong>{new Intl.NumberFormat().format(property.area_m2)}</strong> m²</span></div>}</div><p className="mt-4 text-on-surface-variant">{property.city}</p>{(property.is_luxury || property.is_good_deal) && <div className="mt-5 flex flex-wrap gap-2 border-t border-outline-variant/40 pt-5">{property.is_luxury && <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800">{t("luxury")}</span>}{property.is_good_deal && <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">{t("goodDeal")}</span>}</div>}</aside></div>
    </section>
  </main>;
}
