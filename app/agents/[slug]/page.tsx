import { notFound } from "next/navigation";
import { Agent } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";
import { SiteHeader } from "@/app/components/site-header";

export const dynamic = "force-dynamic";
function externalUrl(value: string | null) { try { const url = new URL(value ?? ""); return ["https:", "http:"].includes(url.protocol) ? url.toString() : null; } catch { return null; } }
export default async function AgentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSupabaseConfigured || !supabase) notFound();
  const { data } = await supabase.from("agents").select("*").eq("slug", slug).eq("published", true).single();
  const agent = data as Agent | null;
  if (!agent) notFound();
  const firstName = agent.name.split(" ")[0];
  const socials = [{ label: "Instagram", url: externalUrl(agent.instagram_url), className: "border-pink-200 text-pink-700 hover:bg-pink-50" }, { label: "TikTok", url: externalUrl(agent.tiktok_url), className: "border-slate-300 text-slate-900 hover:bg-slate-50" }, { label: "Facebook", url: externalUrl(agent.facebook_url), className: "border-blue-200 text-blue-700 hover:bg-blue-50" }].filter((social): social is { label: string; url: string; className: string } => Boolean(social.url));
  return <main className="min-h-screen bg-surface text-on-surface"><SiteHeader/><section className="mx-auto grid max-w-container-max gap-12 px-margin-desktop py-16 lg:grid-cols-[minmax(0,1fr)_360px]"><div><div className="flex flex-col gap-7 sm:flex-row"><img src={agent.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85"} alt={agent.name} className="h-52 w-52 rounded-xl object-cover"/><div><p className="text-label-bold font-label-bold uppercase text-secondary">{agent.city}</p><h1 className="mt-3 font-display-lg text-display-lg">{agent.name}</h1><p className="mt-2 font-headline-md text-headline-md text-primary">{agent.title}</p><p className="mt-4 max-w-xl text-body-lg text-on-surface-variant">{agent.bio}</p></div></div><div className="mt-12 border-t border-outline-variant/40 pt-10"><h2 className="font-headline-lg text-headline-lg">About {firstName}</h2><p className="mt-4 max-w-2xl text-on-surface-variant">{agent.about}</p></div></div><aside className="h-fit rounded-xl border border-outline-variant/50 bg-white p-7 shadow-sm"><p className="text-label-bold font-label-bold uppercase text-secondary">Contact {firstName}</p>{agent.phone && <a href={`tel:${agent.phone.replace(/[^+\d]/g, "")}`} className="mt-7 block rounded-lg bg-primary px-5 py-3 text-center font-bold text-on-primary">Call {agent.phone}</a>}{agent.email && <a href={`mailto:${agent.email}`} className="mt-3 block rounded-lg border border-primary px-5 py-3 text-center font-bold text-primary">Email {firstName}</a>}{socials.length > 0 && <div className="mt-7 border-t border-outline-variant/40 pt-6"><p className="text-label-bold font-label-bold uppercase text-secondary">Follow {firstName}</p><div className="mt-3 flex flex-wrap gap-2">{socials.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noreferrer" className={`rounded-full border px-4 py-2 text-sm font-bold transition ${social.className}`}>{social.label}</a>)}</div></div>}</aside></section></main>;
}
